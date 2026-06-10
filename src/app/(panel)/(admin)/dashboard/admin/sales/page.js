'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, ArrowUpRight, Target, Edit2 } from 'lucide-react';
import Link from 'next/link';
import VentasStatsGrid from '@/components/VentasStatsGrid';
import KpiDetailView from '@/components/KpiDetailView';
import { useAnularPedido } from '@/hooks/useAnularPedido';

export default function VendedorVentasDashboard() {
    const [loading, setLoading] = useState(true);
    const [currentKpi, setCurrentKpi] = useState(null);
    const [user, setUser] = useState(null);
    const [isEditingMeta, setIsEditingMeta] = useState(false);
    const router = useRouter();

    const META_MENSUAL_GENERAL = 5000;
    const [metaMensual, setMetaMensual] = useState(META_MENSUAL_GENERAL);

    const [stats, setStats] = useState({
        totalVendidoMes: 0,
        totalPedidos: 0,
        porConfirmar: 0,
        porCobrar: 0,
        morosos: 0,
        pedidos: []
    });

    const fetchVentasVendedor = useCallback(async () => {
        setLoading(true);
        try {
            const now = new Date();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            const authUser = session.user;
            setUser(authUser);

            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            const { data: pedidos, error } = await supabase
                .from('pedidos')
                .select(`*, clientes!cliente_id (razon_social, rif)`)
                .gte('fecha_pedido', firstDay)
                .order('fecha_pedido', { ascending: false });

            if (error) throw error;

            let totalVendido = 0;
            let porConfirmar = 0;
            let porCobrar = 0;
            let morosos = 0;

            if (pedidos && pedidos.length > 0) {
                totalVendido = pedidos.reduce((acc, p) => acc + (Number(p.monto_total) || 0), 0);
                porConfirmar = pedidos.filter(p => p.status_logistico === 'pendiente').length;
                porCobrar = pedidos.filter(p => ['aprobado', 'por cobrar', 'despachado'].includes(p.status_logistico)).length;

                morosos = pedidos.filter(p => {
                    if (p.status_pago === 'pagado' || p.status_pago === 'anulado') return false;
                    if (!p.fecha_vencimiento) return false;
                    return new Date(p.fecha_vencimiento) < now;
                }).length;
            }

            setStats({
                totalVendidoMes: totalVendido,
                totalPedidos: pedidos?.length || 0,
                porConfirmar,
                porCobrar,
                morosos,
                pedidos: pedidos || []
            });

        } catch (err) {
            console.error("Error detallado en Dashboard:", err.message || err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const { anular } = useAnularPedido(fetchVentasVendedor);

    useEffect(() => {
        fetchVentasVendedor();
    }, [fetchVentasVendedor]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-secundary border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse font-black italic tracking-widest text-xs text-gray-500">SINCRONIZANDO RED ROYAL...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen text-gray-900 font-sans">
            {currentKpi ? (
                <KpiDetailView
                    type={currentKpi}
                    data={stats.pedidos}
                    onBack={() => setCurrentKpi(null)}
                    onRefresh={fetchVentasVendedor}
                    onAnular={anular}
                />
            ) : (
                <>
                    {/* HEADER */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-10 gap-8">
                        <div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-gray-900">
                                Panel de <span className="text-secundary">Ventas</span>
                            </h1>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 ml-1">
                                Carabobo, Venezuela | Agente: {user?.usuario_metadata?.nombre_completo || 'Autenticado'}
                            </p>
                        </div>
                    </div>

                    {/* WIDGET DE META Y CLIENTES */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2 bg-primary border-foreground p-8 rounded-2xl border shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase text-white flex items-center gap-2 tracking-widest">
                                    <Target size={14} className="text-foreground" /> Mi Objetivo Comercial
                                </span>
                                <button onClick={() => setIsEditingMeta(!isEditingMeta)} className="cursor-pointer text-white hover:text-foreground transition-colors">
                                    <Edit2 size={14} />
                                </button>
                            </div>

                            {isEditingMeta ? (
                                <div className='flex gap-2 mb-3'>
                                    <input
                                        className="bg-gray-50 border border-secundary rounded-xl px-4 py-2 text-sm w-full outline-none font-black italic text-gray-900"
                                        type='number'
                                        value={metaMensual}
                                        onChange={(e) => setMetaMensual(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsEditingMeta(false)}
                                        className="bg-secundary text-white text-[10px] px-5 rounded-xl font-black uppercase"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className='h-2 bg-gray-100 rounded-full overflow-hidden mb-4'>
                                        <div
                                            className="h-full bg-secundary transition-all duration-1000 shadow-[0_0_10px_rgba(13,37,255,0.2)]"
                                            style={{ width: `${Math.min((stats.totalVendidoMes / metaMensual) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-3xl font-black italic leading-none text-foreground">
                                        ${stats.totalVendidoMes.toLocaleString()}
                                        <span className="text-white text-sm font-bold not-italic ml-2 uppercase"> / ${Number(metaMensual).toLocaleString()} meta</span>
                                    </p>
                                </>
                            )}
                        </div>

                        <Link href="/dashboard/vendedor/clientes" className="bg-secundary p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Users size={160} />
                            </div>
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Cartera Royal</p>
                            <h3 className="text-4xl font-black italic uppercase text-white">Mis Clientes</h3>
                            <p className="text-white text-[10px] font-black uppercase mt-4 flex items-center gap-2">
                                <ArrowUpRight size={14} /> Gestionar Aliados
                            </p>
                        </Link>
                    </div>
                    {/* TABLA DE MOVIMIENTOS */}
                    <div className="mt-10 bg-gary-300 rounded-2xl border border overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-black italic uppercase tracking-[0.2em] text-xs text-gray-900">Historial de Operaciones</h3>
                            <Link href="/dashboard/vendedor/ventas/pedidos-totales" className="text-[10px] font-black uppercase text-secundary hover:text-blue-700 transition-colors">
                                Ver Reporte Completo
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gary-500 text-[12px] font-black uppercase text-white tracking-widest border-b border-gray-100">
                                        <th className="py-6 px-8">Aliado Comercial</th>
                                        <th className="py-6 px-8 text-center">Inversión</th>
                                        <th className="py-6 px-8 text-center">Estatus</th>
                                        <th className="py-6 px-8 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.pedidos.slice(0, 8).map((pedido) => (
                                        <tr key={pedido.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="py-6 px-8">
                                                <p className="font-black text-sm uppercase italic text-gray-900 group-hover:text-secundary transition-colors">
                                                    {pedido.clientes?.razon_social || 'Sin Razón Social'}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
                                                    ID: {pedido.id.toString().slice(-8).toUpperCase()}
                                                </p>
                                            </td>
                                            <td className="py-6 px-8 text-center font-black text-sm italic text-gray-900">
                                                ${Number(pedido.monto_total || 0).toLocaleString()}
                                            </td>
                                            <td className="py-6 px-8 text-center">
                                                <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border ${pedido.status_pago === 'pagado' ? 'bg-green-50 text-green-600 border-green-200' :
                                                    pedido.status_logistico === 'pendiente' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                        'bg-blue-50 text-blue-600 border-blue-200'
                                                    }`}>
                                                    {pedido.status_logistico}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <Link href={`/dashboard/vendedor/ventas/edit-order/${pedido.id}`}>
                                                    <button className="p-2.5 bg-gray-50 border border-gray-200 hover:border-secundary hover:bg-blue-50 rounded-xl transition-all">
                                                        <Edit2 size={14} className="text-gray-400 group-hover:text-secundary" />
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}