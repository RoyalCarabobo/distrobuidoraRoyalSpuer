'use client';
import { useEffect, useState } from 'react';
import { ClientService } from '@/services/clients';
import Link from 'next/link';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('todos'); // todos, pendiente, aprobado
  const [loading, setLoading] = useState(true);


  // --- CÁLCULOS DE ESTADÍSTICAS ---
  const totalAliados = clients.length;
  const aprobados = clients.filter(c => c.status === 'habilitado').length;
  const pendientes = clients.filter(c => c.status === 'pendiente').length;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {
      setLoading(true);
      const data = await ClientService.getAllForAdmin();
      setClients(data || []);

    } catch (error) {
      // Log detallado para capturar errores de nombres de columna
      console.error("Error en AdminClients:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const filteredClients = clients.filter(c =>
    filter === 'todos' ? true : c.status === filter
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-secundary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-secundary animate-pulse font-black uppercase tracking-widest text-xs">
          Sincronizando Cartera de Aliados...
        </p>
      </div>
    </div>
  );


  return (
    <main className="min-h-screen bg-white text-gray-900 p-6 md:p-10 font-['Manrope']">

      {/* Encabezado Profesional */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
            Red de <span className="text-secundary">Aliados</span>
          </h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Control de Distribución y Puntos de Venta</p>
        </div>

        <Link href="/dashboard/admin/clients/new" className="bg-secundary hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs transition-all shadow-sm">
          + Registrar Aliado
        </Link>
      </div>

      {/* Filtros de Estado */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-2 p-1 bg-gray-300 w-fit rounded-2xl border border-black">
        {['todos', 'pendiente', 'habilitado', 'deshabilitado'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === tab ? 'bg-secundary text-white shadow-md' : 'text-black hover:bg-gray-100'
              }`}
          >
            {tab === 'habilitado' ? 'Activos' : tab}
          </button>
        ))}
      </div>

      {/* Sección de Estadísticas Rápidas */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-3 p-3 gap-4  rounded-2xl border border-gray-200">

        <div className="bg-blue-50 border border-blue-300 p-6 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Cartera</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black italic text-gray-900">{totalAliados}</h2>
            <span className="text-secundary material-symbols-outlined text-3xl">groups</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-300 p-6 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Aliados Activos</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black italic text-green-600">{aprobados}</h2>
            <span className="text-green-400 material-symbols-outlined text-3xl">verified</span>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-300 p-6 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Por Validar</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black italic text-orange-600">{pendientes}</h2>
            <span className="text-orange-400 material-symbols-outlined text-3xl">pending_actions</span>
          </div>
        </div>

      </div>

      {/* Tabla de Inteligencia Comercial */}
      <div className="max-w-7xl mx-auto bg-blue-100 border border-black rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="bg-gray-50 border-b border-black">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black">Aliado Comercial</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black">RIF</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black">Contacto</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black text-right">Vendedor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-black text-right">Gestión</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-500">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden">
                        <img src={client.foto_fachada_url || '/placeholder-store.jpg'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{client.razon_social}</p>
                        <p className="text-[12px] text-gray-900 truncate max-w-[200px] uppercase">{client.direccion}</p>
                      </div>
                    </div>

                  </td>
                  <td className="px-8 py-6 text-xs font-mono text-secundary">{client.rif}</td>
                  <td className="px-8 py-6 text-xs">
                    <p className="text-gray-700 font-bold">{client.encargado}</p>
                    <p className="text-gray-900 text-[12px]">{client.telefono}</p>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${client.status === 'habilitado' // Antes decía 'aprobado'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-orange-50 text-orange-600 border-orange-200'
                      }`}>
                      {client.status === 'habilitado' ? 'Activo' : client.status}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-xs font-bold text-secundary text-right">
                    {client.vendedor?.nombre_completo || 'Sin asignar'}
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/admin/clientsAdmin/${client.id}`}>
                        <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 hover:text-secundary hover:border-secundary transition-all">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                      </Link>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="p-20 text-center text-gray-400 uppercase font-bold text-xs">
              No se encontraron aliados con este estado
            </div>
          )}
        </div>
      </div>
    </main>
  );
}