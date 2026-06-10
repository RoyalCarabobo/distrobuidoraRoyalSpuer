'use client';
import { useEffect, useState } from 'react';
import { StatsServices } from '@/services/stats';
import Link from 'next/link';
import { TrendingUp, Clock, AlertTriangle, Users, UserPlus } from 'lucide-react';
import OrderDetailModal from '@/components/modal/OrderDetailModal';
import SalesChart from '@/components/SalesChart';
import ReportFilterModal from '@/components/modal/ReportFilterModal';
import VentasStatsGrid from '@/components/VentasStatsGrid';
import KpiDetailView from '@/components/KpiDetailView';


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [recentOrders, setRecentOrders] = useState([]);
  const [currentKpi, setCurrentKpi] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [sellerPerformance, setSellerPerformance] = useState([]);

  const [stats, setStats] = useState({
    totalVendidoMes: 0,
    totalPedidos: 0,
    porConfirmar: 0,
    porCobrar: 0,
    morosos: 0,
    pedidos: []
  });



  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [total, pending, stock, sellers, ordersData, performanceData, pendingClients] = await Promise.all([
          StatsServices.getTotalOrders(),
          StatsServices.getPendingOrders(),
          StatsServices.getLowStock(),
          StatsServices.getActiveSellers(),
          StatsServices.getRecentOrders(),
          StatsServices.getSellerPerformance(),
          StatsServices.getPendingClients()
        ]);

        setStats({
          totalPedidos: total.count || 0,     // Corregido para que coincida con lo que el Grid busca
          porConfirmar: pending.count || 0,   // Corregido
          porCobrar: 0,                       // Si tienes un servicio para esto, agrégalo aquí, ej: cobros.count || 0
          morosos: 0,                         // Si tienes un servicio para esto, ej: morosos.count || 0
          trendPedidos: 12,                   // Valores estáticos temporales o dinámicos para los trends si los tienes
          trendCobros: null,
          trendMorosos: null
        });

        const orders = ordersData.data || [];
        setRecentOrders(orders);

        // --- PROCESAR DATOS PARA LA GRÁFICA ---
        // Agrupamos ventas por fecha (DD/MM)
        const dailyData = orders.reduce((acc, order) => {
          const date = new Date(order.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' });
          acc[date] = (acc[date] || 0) + Number(order.monto_total || 0);
          return acc;
        }, {});


        const processedPerformance = performanceData.data?.map(seller => ({
          name: seller.nombre_completo || seller.full_name,
          totalSales: seller.pedidos?.reduce((acc, curr) => acc + (Number(curr.monto_total) || 0), 0) || 0
        })).sort((a, b) => b.totalSales - a.totalSales);

        setSellerPerformance(processedPerformance || []);
      } catch (error) {
        console.error('Error al cargar datos del dashboard', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);


  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-secundary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-900 text-xl animate-pulse font-black italic uppercase tracking-tighter'>
            Sincronizando con <span className='text-secundary'>Royal Super Oil</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-10xl mx-auto space-y-10 bg-white/70 min-h-screen">
      {/* Header */}
      <header className="flex flex-col justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
            Panel <span className="text-secundary">Administrativo</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Control Global Royal Super Oil</p>
        </div>

        <div className="flex flex-wrap  justify-end gap-3">

          <button className="bg-amber-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-amber-600 transition-all shadow-sm" onClick={() => setIsReportModalOpen(true)}>Imprimir Reporte Mensual</button>

          <Link href="/dashboard/admin/inventory" className="bg-gray-100 text-gray-700 border border-gray-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all">
            Inventario
          </Link>

          <Link href="/dashboard/admin/ventas" className="bg-secundary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-sm">
            Ver Pedidos
          </Link>
        </div>
        <VentasStatsGrid data={stats} />
      </header>

      {/* Gráfica de Ventas */}
      <div className="bg-gray-400 rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black italic uppercase text-sm tracking-widest text-gray-900">Rendimiento de Ventas Mensual</h3>
          <span className="text-[10px] text-secundary font-bold uppercase">Mes Actual</span>
        </div>
        <SalesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Top Vendedores */}
        <div className="bg-gray-200 rounded-2xl border border-black p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-secundary" size={20} />
            <h3 className="font-black italic uppercase text-sm tracking-widest text-gray-900">Ranking Mensual</h3>
          </div>
          <div className="space-y-8">
            {sellerPerformance.slice(0, 5).map((seller, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Puesto {index + 1}</span>
                    <span className="text-sm font-black text-gray-900 uppercase italic">{seller.name}</span>
                  </div>
                  <span className="text-sm font-black text-secundary">${seller.totalSales.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-secundary' : index === 1 ? 'bg-blue-400' : 'bg-gray-300'}`}
                    style={{ width: `${Math.min((seller.totalSales / (sellerPerformance[0]?.totalSales || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrderDetailModal isOpen={isModalOpen} order={selectedOrder} onClose={() => setIsModalOpen(false)} />

      <ReportFilterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}