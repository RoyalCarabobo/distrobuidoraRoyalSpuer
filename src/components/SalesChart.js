'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    Tooltip, CartesianGrid, BarChart, Bar, Legend
} from 'recharts';
import { Calendar, TrendingUp, ShoppingCart } from 'lucide-react';

export default function SalesChart() {
    const [data, setData] = useState({ current: [], previous: [], daily: [] });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            // 1. Definir rangos para comparativa (Mes Actual vs Mes Anterior)
            const startCurrent = new Date(dateRange.start);
            const endCurrent = new Date(dateRange.end);

            // Calcular mismo rango pero del mes anterior para la comparativa
            const startPrev = new Date(startCurrent);
            startPrev.setMonth(startPrev.getMonth() - 1);
            const endPrev = new Date(endCurrent);
            endPrev.setMonth(endPrev.getMonth() - 1);

            // 2. Consulta a Supabase
            const { data: orders, error } = await supabase
                .from('pedidos')
                .select('fecha_pedido, monto_total, id')
                .gte('fecha_pedido', startPrev.toISOString())
                .lte('fecha_pedido', endCurrent.toISOString());

            if (error) throw error;

            // 3. Procesar Datos
            const processed = processChartData(orders, startCurrent, endCurrent, startPrev, endPrev);
            setData(processed);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (orders, sCur, eCur, sPrev, ePrev) => {
        // Agrupador por día para la gráfica de barras (pedidos diarios)
        const dailyMap = {};
        // Agrupador para comparativa de ventas (Actual vs Anterior)
        const stats = { currentSales: 0, prevSales: 0 };

        orders.forEach(order => {
            const orderDate = new Date(order.fecha_pedido);
            const amount = order.monto_total || 0;

            // Lógica para Pedidos Diarios (dentro del rango actual)
            if (orderDate >= sCur && orderDate <= eCur) {
                const day = orderDate.getDate();
                dailyMap[day] = (dailyMap[day] || 0) + 1;
                stats.currentSales += amount;
            }
            // Lógica para Ventas del periodo anterior
            else if (orderDate >= sPrev && orderDate <= ePrev) {
                stats.prevSales += amount;
            }
        });

        // Formatear para Recharts
        const dailyData = Object.keys(dailyMap).map(day => ({
            day: `Día ${day}`,
            pedidos: dailyMap[day]
        })).sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]));

        const comparisonData = [
            { name: 'Periodo Anterior', ventas: stats.prevSales, fill: '#d1d5db' },
            { name: 'Periodo Actual', ventas: stats.currentSales, fill: '#0d25ff' }
        ];

        return { daily: dailyData, comparison: comparisonData, totals: stats };
    };

    if (loading) return <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-secundary">
                        <Calendar size={20} />
                    </div>
                    <h3 className="font-black uppercase italic text-sm text-gray-900">Rango de Análisis</h3>
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-900 outline-none focus:border-secundary"
                    />
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-900 outline-none focus:border-secundary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica 1: Comparativa de Ventas Totales */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-secundary mb-1">
                            <TrendingUp size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Performance de Ventas</span>
                        </div>
                        <h2 className="text-xl font-black italic uppercase text-gray-900">Vs. Mes Anterior</h2>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.comparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} stroke="#9ca3af" />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="ventas" radius={[10, 10, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfica 2: Pedidos Diarios (Área) */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <ShoppingCart size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Volumen de Operaciones</span>
                        </div>
                        <h2 className="text-xl font-black italic uppercase text-gray-900">Pedidos Diarios</h2>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="day" fontSize={9} axisLine={false} tickLine={false} stroke="#9ca3af" />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pedidos"
                                    stroke="#10b981"
                                    fill="url(#colorOrders)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}