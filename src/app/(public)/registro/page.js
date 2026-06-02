'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ClientService } from '@/services/clients';
import limpiarrif from '@/funciones/limpiarrif';
import validatePassword from '@/funciones/validatePassword';
import limpform from '@/funciones/limpform';
import { motion } from 'framer-motion';

// --- SUB-COMPONENTE DE VALIDACIÓN ---
function ValidationItem({ label, isValid }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isValid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-300'}`} />
      <span className={`text-[11px] font-medium transition-colors ${isValid ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // --- ESTADOS DE FLUJO ---
  const [phase, setPhase] = useState('form');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ESTADO DE ZONAS (Desde DB) ---
  const [zonasDB, setZonasDB] = useState([]);

  // --- ESTADOS DE FORMULARIO ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [form, setForm] = useState({
    razon_social: '',
    rif: '',
    encargado: '',
    telefono: '',
    direccion: '',
    zona: ''
  });

  const [isCustomZona, setIsCustomZona] = useState(false);
  const [files, setFiles] = useState({ rif: null, fachada: null });
  const [previews, setPreviews] = useState({ rif: null, fachada: null });

  // Lógica de validación derivada
  const passwordIssues = validatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirm;

  // --- CARGAR ZONAS ---
  useEffect(() => {
    const fetchZonas = async () => {
      const { data, error } = await supabase
        .from('zonas_ventas')
        .select('nombre')
        .order('nombre', { ascending: true });

      if (!error && data) {
        setZonasDB(data.map(z => z.nombre));
      }
    };
    fetchZonas();
  }, [supabase]);

  // Limpieza de URLs de memoria
  useEffect(() => {
    return () => {
      if (previews.rif) URL.revokeObjectURL(previews.rif);
      if (previews.fachada) URL.revokeObjectURL(previews.fachada);
    };
  }, [previews]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [type]: file });
      setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
    }
  };

  const goStep2 = (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return setError('Ingresa tu correo.');
    if (passwordIssues.length > 0) return setError(`La contraseña no cumple los requisitos.`);
    if (!passwordsMatch) return setError('Las contraseñas no coinciden.');
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!files.rif || !files.fachada) return setError('Debes cargar ambas imágenes.');
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const sanitizedForm = limpform(form);
      const cleanRif = limpiarrif(sanitizedForm.rif);

      const metadataParaSupabase = {
        rol: 'cliente',
        nombre_completo: sanitizedForm.encargado,
        razon_social: sanitizedForm.razon_social,
        rif: cleanRif,
        zona: sanitizedForm.zona || 'No especificada',
        direccion: sanitizedForm.direccion,
        telefono: sanitizedForm.telefono,
      };

      // 1. Auth SignUp
      const { data: signData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: { data: metadataParaSupabase }
      });

      if (signUpError) throw signUpError;
      const userId = signData?.user?.id;
      if (!userId) throw new Error('Error al generar ID de usuario.');

      // 2. Client Service (Imágenes y Perfil)
      await ClientService.completeSelfRegistration(userId, metadataParaSupabase, files);

      // 3. Finalización
      await supabase.auth.signOut();
      setPhase('awaiting');

    } catch (err) {
      console.error("Error:", err);
      setError(err.message.includes('already registered') ? 'Este correo ya está registrado.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (phase === 'awaiting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-gray-100 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <span className="material-symbols-outlined text-6xl text-tertiary animate-pulse">hourglass_top</span>
          <h2 className="text-3xl font-black uppercase italic text-primary tracking-tighter">Solicitud enviada</h2>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">Tu registro está en revisión por un administrador. Te notificaremos vía correo una vez seas aprobado.</p>
          <Link href="/login" className="block w-full py-4 bg-secundary text-white font-black rounded-2xl uppercase italic hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">Ir al Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-900 p-6 font-sans relative overflow-hidden flex flex-col justify-center">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secundary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fourth/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="max-w-5xl mx-auto space-y-8 relative z-10 w-full my-auto"
      >
        <motion.header variants={fadeInUp} className="text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-primary">
            Royal <span className="text-fourth drop-shadow-sm">Super</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Nuevo Aliado Comercial</p>
        </motion.header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="max-w-md mx-auto bg-red-50 border border-red-200 text-fourth p-4 rounded-2xl text-center text-xs font-bold animate-shake shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {step === 1 ? (
          <motion.form variants={fadeInUp} onSubmit={goStep2} className="max-w-md mx-auto bg-white p-10 rounded-[3rem] border border-gray-100 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative">
            <h3 className="text-secundary font-black uppercase text-xs tracking-[0.2em] mb-4 text-center">Paso 1: Seguridad</h3>

            <input
              type="email" required placeholder="Correo electrónico"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-secundary focus:bg-white focus:ring-0 outline-none transition-all font-medium placeholder:text-gray-400"
              value={email} onChange={e => setEmail(e.target.value)}
            />

            <div className="space-y-4">
              <input
                type="password" required placeholder="Contraseña"
                className={`w-full bg-gray-50 border-2 ${password.length > 0 && passwordIssues.length > 0 ? 'border-fourth/30' : 'border-gray-100'} rounded-2xl px-5 py-4 focus:border-secundary focus:bg-white focus:ring-0 outline-none transition-all font-medium placeholder:text-gray-400`}
                value={password} onChange={e => setPassword(e.target.value)}
              />

              {password.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 py-3 space-y-2 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Seguridad:</p>
                  <div className="grid grid-cols-1 gap-2 pb-1">
                    <ValidationItem label="Mínimo 8 caracteres" isValid={!passwordIssues.includes('min')} />
                    <ValidationItem label="Al menos una mayúscula" isValid={!passwordIssues.includes('upper')} />
                    <ValidationItem label="Al menos un número" isValid={!passwordIssues.includes('number')} />
                    <ValidationItem label="Un carácter especial" isValid={!passwordIssues.includes('special')} />
                  </div>
                </motion.div>
              )}

              <input
                type="password" required placeholder="Confirmar contraseña"
                className={`w-full bg-gray-50 border-2 ${confirm.length > 0 && !passwordsMatch ? 'border-fourth/50' : 'border-gray-100'} rounded-2xl px-5 py-4 focus:border-secundary focus:bg-white focus:ring-0 outline-none transition-all font-medium placeholder:text-gray-400`}
                value={confirm} onChange={e => setConfirm(e.target.value)}
              />

              {confirm.length > 0 && (
                <p className={`text-[11px] font-bold uppercase px-2 ${passwordsMatch ? 'text-emerald-500' : 'text-fourth'}`}>
                  {passwordsMatch ? '✓ Las contraseñas coinciden' : '✕ Las contraseñas no coinciden'}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={passwordIssues.length > 0 || !passwordsMatch || !email}
              className="w-full py-4 mt-2 bg-secundary disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-black uppercase italic rounded-2xl shadow-[0_10px_20px_rgba(13,37,255,0.2)] disabled:shadow-none hover:bg-blue-700 text-white transition-all"
            >
              Siguiente
            </motion.button>
          </motion.form>
        ) : (
          <motion.form variants={fadeInUp} onSubmit={handleRegister} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Columna Izquierda: Multimedia */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] h-full">
                <h3 className="text-xs font-black uppercase text-secundary tracking-widest text-center">Documentación Visual</h3>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-[0.1em]">Copia del RIF</label>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-300 hover:border-secundary overflow-hidden bg-gray-50 flex items-center justify-center group transition-colors cursor-pointer">
                    {previews.rif ? (
                      <img src={previews.rif} alt="Vista RIF" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 group-hover:text-secundary transition-colors">
                        <span className="material-symbols-outlined text-5xl block mb-2">document_scanner</span>
                        <span className="text-[10px] font-bold uppercase block tracking-widest">Subir Archivo</span>
                      </div>
                    )}
                    <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'rif')} />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-[0.1em]">Fachada del Negocio</label>
                  <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-300 hover:border-secundary overflow-hidden bg-gray-50 flex items-center justify-center group transition-colors cursor-pointer">
                    {previews.fachada ? (
                      <img src={previews.fachada} alt="Vista Fachada" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 group-hover:text-secundary transition-colors">
                        <span className="material-symbols-outlined text-5xl block mb-2">storefront</span>
                        <span className="text-[10px] font-bold uppercase block tracking-widest">Tomar Foto</span>
                      </div>
                    )}
                    <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'fachada')} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-gray-100 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <h3 className="text-[11px] font-black uppercase text-secundary tracking-widest text-center">Datos del Comercio</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-[0.1em]">Nombre / Razón Social</label>
                  <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all uppercase font-bold text-primary"
                    value={form.razon_social} onChange={e => setForm({ ...form, razon_social: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-[0.1em]">RIF</label>
                  <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all text-primary"
                    placeholder="J-00000000-0" value={form.rif} onChange={e => setForm({ ...form, rif: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-[0.1em]">Persona de Contacto</label>
                  <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all uppercase font-bold text-primary"
                    value={form.encargado} onChange={e => setForm({ ...form, encargado: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-[0.1em]">Teléfono</label>
                  <input required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all text-primary"
                    placeholder="04141234567" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] text-secundary font-bold uppercase ml-2 tracking-[0.1em]">Zona de Ventas</label>
                  <div className="flex gap-3">
                    {!isCustomZona ? (
                      <select
                        className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all text-primary font-bold cursor-pointer"
                        value={form.zona}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomZona(true);
                            setForm({ ...form, zona: '' });
                          } else {
                            setForm({ ...form, zona: e.target.value });
                          }
                        }}
                      >
                        <option value="">Selecciona zona (Opcional)</option>
                        {zonasDB.map(z => <option key={z} value={z}>{z}</option>)}
                        <option value="custom" className="text-secundary font-black">+ Escribir nueva zona</option>
                      </select>
                    ) : (
                      <div className="flex-1 flex gap-3">
                        <input
                          autoFocus
                          className="flex-1 bg-white border-2 border-secundary rounded-2xl px-5 py-4 text-sm outline-none transition-all uppercase font-bold text-primary"
                          placeholder="Nombre de la zona..."
                          value={form.zona}
                          onChange={e => setForm({ ...form, zona: e.target.value })}
                        />
                        <button type="button" onClick={() => { setIsCustomZona(false); setForm({ ...form, zona: '' }) }}
                          className="px-6 bg-gray-100 hover:bg-gray-200 rounded-2xl text-[10px] font-black uppercase transition-colors text-gray-600">Cancelar</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-[0.1em]">Dirección Exacta</label>
                  <textarea required rows="2" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm focus:border-secundary focus:bg-white outline-none transition-all resize-none uppercase font-bold text-primary"
                    value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black uppercase italic text-xs hover:bg-gray-50 text-gray-600 transition-all">Atrás</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-[2] py-4 bg-secundary text-white rounded-2xl font-black uppercase italic shadow-[0_10px_20px_rgba(13,37,255,0.2)] hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all">
                  {loading ? 'Procesando...' : 'Enviar Registro'}
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}