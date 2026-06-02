'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EnRevision() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secundary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fourth/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, staggerChildren: 0.2 } }
          }}
          className="max-w-[840px] w-full bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden"
        >
          
          {/* Header Image Area */}
          <div className="w-full bg-primary/5 py-12 flex justify-center items-center relative overflow-hidden">
          
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-secundary rounded-full filter blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-fourth rounded-full filter blur-[80px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <motion.div variants={fadeInUp} className="relative z-10 w-full max-w-[400px] flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4 border border-gray-50"
              >
                <span className="material-symbols-outlined text-secundary text-6xl">fact_check</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-secundary/20 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-secundary/40 rounded-full animate-pulse delay-75"></div>
                  <div className="w-3 h-3 bg-secundary rounded-full animate-pulse delay-150"></div>
                </div>
              </motion.div>
            </motion.div>
            
          </div>

          {/* Content Area */}
          <motion.div variants={staggerContainer} className="p-8 lg:p-12 text-center">
            <motion.h1 variants={fadeInUp} className="text-primary text-3xl lg:text-5xl font-black italic tracking-tighter mb-4 uppercase">
              Perfil en <span className="text-secundary">Revisión</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed mb-12 font-medium">
              Estamos validando tu RIF y los datos de tu empresa. Este proceso suele tomar entre <strong className='text-primary font-black'>24 y 48 horas hábiles</strong>. Te notificaremos por correo una vez finalizado.
            </motion.p>

            {/* Horizontal Timeline */}
            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto mb-16 px-4">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gray-100 rounded-full z-0"></div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-secundary/40 rounded-full z-0"
                ></motion.div>
                
                {/* Steps */}
                {[
                  { label: 'Cuenta Creada', status: 'Completado', icon: 'check', active: true },
                  { label: 'Datos Enviados', status: 'Completado', icon: 'check', active: true },
                  { label: 'Verificación', status: 'En curso', icon: 'hourglass_empty', active: false, current: true }
                ].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
                        step.active 
                          ? 'bg-secundary text-white' 
                          : 'bg-white border-2 border-secundary text-secundary animate-pulse'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl font-bold">{step.icon}</span>
                    </motion.div>
                    <div className="absolute top-14 whitespace-nowrap">
                      <p className={`text-sm font-black uppercase tracking-widest ${step.current ? 'text-secundary' : 'text-gray-900'}`}>{step.label}</p>
                      <p className={`text-xs font-bold ${step.active ? 'text-emerald-500' : 'text-secundary/70'}`}>{step.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div variants={fadeInUp} className="mt-24">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link href="/catalogo" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-gray-800 text-white font-black uppercase italic text-sm transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
                  <span className="material-symbols-outlined mr-3">shopping_bag</span>
                  Visitar Catálogo
                </Link>
              </motion.div>
              <p className="mt-6 text-sm text-gray-500 font-medium">
                Puedes explorar nuestros productos mientras esperas.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Support Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 group"
      >
        <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-gray-100 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <p className="text-sm font-black text-primary uppercase italic">¿Necesitas ayuda?</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Soporte por WhatsApp</p>
        </div>
        <a 
          href="https://wa.me/5804145174722" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </motion.div>

      <footer className="py-8 text-center text-gray-500 text-sm font-medium z-10 relative">
        <p>© 2026 Distribuidora Super Carabobo - Royal Super Oil Venezuela. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}