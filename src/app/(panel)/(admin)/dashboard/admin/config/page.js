'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// --- HELPERS UI ---
const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors";
const labelCls = "block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider";

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('pagos');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- ESTADOS DE DATOS ---
  const [vendedores, setVendedores] = useState([]);
  const [methods, setMethods] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [tasaActual, setTasaActual] = useState(0);
  const [tempTasa, setTempTasa] = useState('');

  // --- ESTADOS DE MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [isZonaModalOpen, setIsZonaModalOpen] = useState(false);
  const [editingZona, setEditingZona] = useState(null);
  const [formError, setFormError] = useState('');

  // --- CARGA DE DATOS ---
  const fetchData = useCallback(async () => {

    setLoading(true);
    try {
      // 1. Verificamos la sesión y los metadatos antes de consultar las tablas
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      const rol = user?.user_metadata?.rol;

      if (authError || !user || rol !== 'admin') {
        console.error('Acceso denegado: El usuario no posee rol de Administrador.');
        // Opcional: puedes redirigir o levantar un estado de error
        // window.location.href = '/dashboard/admin'; 
        return;
      }

      const [
        { data: v },
        { data: m },
        { data: z },
        { data: t }
      ] = await Promise.all([
        supabase.from('usuarios').select('id, nombre_completo').eq('rol', 'vendedor'),
        supabase.from('configuracion_pagos').select('*').order('created_at', { ascending: false }),
        supabase.from('zonas_ventas').select('*').order('nombre', { ascending: true }),
        // maybeSingle() evita error cuando no hay filas
        supabase.from('configuracion_tasa').select('valor').order('fecha', { ascending: false }).limit(1).maybeSingle(),
      ]);

      setVendedores(v || []);
      setMethods(m || []);
      setZonas(z || []);

      if (t) {
        setTasaActual(t.valor);
        setTempTasa(String(t.valor));
      }
    } catch (err) {
      console.error('Error cargando configuración:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Cerrar modales con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsZonaModalOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // --- LÓGICA: MÉTODOS DE PAGO ---
  const openMethodModal = (method = null) => {
    setEditingMethod(method);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveMethod = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const fd = new FormData(e.target);

    const methodData = {
      banco: fd.get('banco'),
      tipo: fd.get('tipo'),
      moneda: fd.get('moneda'),
      detalles: {
        titular: fd.get('titular'),
        rif: fd.get('rif'),
        dato: fd.get('dato'),
      },
    };

    const { error } = editingMethod
      ? await supabase.from('configuracion_pagos').update(methodData).eq('id', editingMethod.id)
      : await supabase.from('configuracion_pagos').insert([methodData]);

    if (error) {
      setFormError(error.message);
    } else {
      setIsModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDeleteMethod = async (id) => {
    if (!confirm('¿Eliminar este método de pago?')) return;
    await supabase.from('configuracion_pagos').delete().eq('id', id);
    fetchData();
  };

  // --- LÓGICA: ZONAS DE VENTAS ---
  // Schema: id, nombre, sector, vendedor
  const openZonaModal = (zona = null) => {
    setEditingZona(zona);
    setFormError('');
    setIsZonaModalOpen(true);
  };

  const handleSaveZona = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const fd = new FormData(e.target);

    // La columna en zonas_ventas es "vendedor" (según schema)
    const zonaData = {
      nombre: fd.get('nombre').toUpperCase(),
      sector: fd.get('sector'),
      vendedor_nombre: fd.get('vendedor'),
    };

    const { error } = editingZona
      ? await supabase.from('zonas_ventas').update(zonaData).eq('id', editingZona.id)
      : await supabase.from('zonas_ventas').insert([zonaData]);

    if (error) {
      setFormError(error.message);
    } else {
      setIsZonaModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const deleteZona = async (id) => {
    if (!confirm('¿Eliminar esta zona?')) return;
    const { error } = await supabase.from('zonas_ventas').delete().eq('id', id);
    if (!error) fetchData();
  };

  // --- LÓGICA: TASA DEL DÍA ---
  const updateTasa = async () => {
    const valor = parseFloat(tempTasa);
    if (isNaN(valor) || valor <= 0) return alert('Ingresa un valor válido.');
    setSaving(true);
    const { error } = await supabase.from('configuracion_tasa').insert([{ valor }]);
    if (!error) {
      setTasaActual(valor);
      alert('Tasa actualizada globalmente.');
    } else {
      alert('Error: ' + error.message);
    }
    setSaving(false);
  };

  // --- RENDER ---
  const TABS = [
    { id: 'pagos', label: 'Métodos de Pago', icon: 'account_balance' },
    { id: 'zonas', label: 'Zonas de Venta', icon: 'map' },
    { id: 'tasa', label: 'Tasa del Día', icon: 'currency_exchange' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-sm">settings</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter uppercase italic text-gray-900">
              Royal<span className="text-fourth">Super</span> Config
            </h2>
          </div>
          <Link href="/dashboard/admin" className="text-xs font-bold uppercase text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
          </Link>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto py-8 px-4 lg:px-10">

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-[11px] font-black uppercase italic transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING GLOBAL */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            <span className="text-sm font-bold uppercase">Cargando...</span>
          </div>
        )}

        {/* CONTENIDO */}
        {!loading && (
          <div className="min-h-[400px]">

            {/* ─── TAB: MÉTODOS DE PAGO ─── */}
            {activeTab === 'pagos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic text-gray-900">Métodos de Pago</h3>
                    <p className="text-xs text-gray-400 font-medium">{methods.length} método{methods.length !== 1 ? 's' : ''} registrado{methods.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => openMethodModal()}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase italic hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Agregar Nuevo
                  </button>
                </div>

                {methods.length === 0 ? (
                  <div className="text-center py-16 text-gray-300">
                    <span className="material-symbols-outlined text-5xl mb-3 block">account_balance</span>
                    <p className="text-sm font-bold uppercase italic">Sin métodos de pago</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {methods.map((m) => (
                      <div key={m.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex justify-between items-center hover:border-gray-300 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 text-lg">account_balance</span>
                          </div>
                          <div>
                            <p className="font-black text-sm italic uppercase text-gray-900">
                              {m.banco} <span className="text-blue-600">({m.moneda})</span>
                            </p>
                            <p className="text-xs text-gray-400 font-medium">{m.tipo}</p>
                            <p className="text-xs text-gray-500">{m.detalles?.dato || m.detalles?.cuenta || m.detalles?.correo || '—'}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openMethodModal(m)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMethod(m.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB: ZONAS ─── */}
            {activeTab === 'zonas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic text-gray-900">Zonas de Venta</h3>
                    <p className="text-xs text-gray-400 font-medium">{zonas.length} zona{zonas.length !== 1 ? 's' : ''} registrada{zonas.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => openZonaModal()}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase italic hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Nueva Zona
                  </button>
                </div>

                {zonas.length === 0 ? (
                  <div className="text-center py-16 text-gray-300">
                    <span className="material-symbols-outlined text-5xl mb-3 block">map</span>
                    <p className="text-sm font-bold uppercase italic">Sin zonas registradas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {zonas.map((z) => (
                      <div key={z.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex justify-between items-start hover:border-gray-300 hover:shadow-sm transition-all">
                        <div>
                          <h4 className="font-black text-sm uppercase italic text-gray-900">{z.nombre}</h4>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{z.sector}</p>
                          <p className="text-[10px] text-blue-600 font-black mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">person</span>
                            {z.vendedor_nombre || 'SIN ASIGNAR'}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openZonaModal(z)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => deleteZona(z.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB: TASA ─── */}
            {activeTab === 'tasa' && (
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <div className="size-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-green-600 text-2xl">currency_exchange</span>
                  </div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Tasa BCV Vigente</label>
                  <div className="text-5xl font-black italic text-blue-600 mb-1">
                    {Number(tasaActual).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-gray-400 font-bold mb-6">Bs. / USD</p>

                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">Bs.</span>
                    <input
                      type="number"
                      value={tempTasa}
                      onChange={(e) => setTempTasa(e.target.value)}
                      placeholder="Ej: 45.50"
                      step="0.01"
                      min="0"
                      className="w-full bg-white border border-gray-200 rounded-xl px-12 py-4 text-2xl font-mono text-center text-gray-900 outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={updateTasa}
                    disabled={saving || !tempTasa}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase italic hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving
                      ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Guardando...</>
                      : <><span className="material-symbols-outlined text-sm">sync</span> Actualizar para toda la App</>
                    }
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          MODAL: MÉTODOS DE PAGO
      ═══════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-lg">account_balance</span>
                </div>
                <h3 className="font-black uppercase italic text-base text-gray-900">
                  {editingMethod ? 'Editar Método' : 'Nuevo Método de Pago'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-gray-400 text-sm">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveMethod} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span> {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Banco / Entidad</label>
                  <input
                    name="banco"
                    defaultValue={editingMethod?.banco || ''}
                    placeholder="Ej: Banesco"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Tipo de Pago</label>
                  <select name="tipo" defaultValue={editingMethod?.tipo || ''} className={inputCls} required>
                    <option value="" disabled>Seleccionar...</option>
                    <option value="Pago Móvil">Pago Móvil</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Zelle">Zelle</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Binance">Binance</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Moneda</label>
                <select name="moneda" defaultValue={editingMethod?.moneda || ''} className={inputCls} required>
                  <option value="" disabled>Seleccionar...</option>
                  <option value="VES">VES (Bolívares)</option>
                  <option value="USD">USD (Dólares)</option>
                  <option value="EUR">EUR (Euros)</option>
                  <option value="USDT">USDT (Tether)</option>
                </select>
              </div>

              <hr className="border-gray-100" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Detalles del Cuenta</p>

              <div>
                <label className={labelCls}>Titular</label>
                <input
                  name="titular"
                  defaultValue={editingMethod?.detalles?.titular || ''}
                  placeholder="Nombre del titular"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>RIF / Cédula</label>
                  <input
                    name="rif"
                    defaultValue={editingMethod?.detalles?.rif || ''}
                    placeholder="J-12345678-9"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Número / Correo / ID</label>
                  <input
                    name="dato"
                    defaultValue={editingMethod?.detalles?.dato || ''}
                    placeholder="0414-0000000"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase italic hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {saving
                    ? <><span className="material-symbols-outlined animate-spin text-xs">progress_activity</span> Guardando...</>
                    : <><span className="material-symbols-outlined text-xs">save</span> {editingMethod ? 'Actualizar' : 'Guardar Método'}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          MODAL: ZONAS DE VENTAS
      ═══════════════════════════════════════════ */}
      {isZonaModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsZonaModalOpen(false)}
        >
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-lg">map</span>
                </div>
                <h3 className="font-black uppercase italic text-base text-gray-900">
                  {editingZona ? 'Editar Zona' : 'Nueva Zona'}
                </h3>
              </div>
              <button onClick={() => setIsZonaModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-gray-400 text-sm">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveZona} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span> {formError}
                </div>
              )}

              <div>
                <label className={labelCls}>Nombre (Ciudad / Eje)</label>
                <input
                  name="nombre"
                  defaultValue={editingZona?.nombre || ''}
                  placeholder="Ej: VALENCIA"
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Vendedor Responsable</label>
                <select
                  name="vendedor"
                  defaultValue={editingZona?.vendedor || ''}
                  className={inputCls}
                  required
                >
                  <option value="" disabled>Seleccionar vendedor...</option>
                  {vendedores.length === 0 && (
                    <option value="" disabled>No hay vendedores registrados</option>
                  )}
                  {vendedores.map((v) => (
                    <option key={v.id} value={v.nombre_completo}>
                      {v.nombre_completo.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Sectores Abarcados</label>
                <textarea
                  name="sector"
                  defaultValue={editingZona?.sector || ''}
                  placeholder="Ej: Naguanagua, San Diego, El Viñedo..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsZonaModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase italic hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {saving
                    ? <><span className="material-symbols-outlined animate-spin text-xs">progress_activity</span> Guardando...</>
                    : <><span className="material-symbols-outlined text-xs">save</span> {editingZona ? 'Actualizar Zona' : 'Guardar Zona'}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}