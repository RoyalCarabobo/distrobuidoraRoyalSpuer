'use client';
import { useState } from 'react';
import Image from 'next/image';
import { blackLogo } from '@/assets/index';
import { motion } from 'framer-motion';

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    ciudad: '',
    interes: 'Minorista / Repuestera',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarWhatsApp = (e) => {
    e.preventDefault();
    const telefono = "+5804145174722"; 
    
    const texto = `*SOLICITUD DE INFORMACIÓN - ROYAL SUPER OIL*%0A` +
                  `--------------------------------------------%0A` +
                  `👤 *Nombre:* ${formData.nombre}%0A` +
                  `🏢 *Empresa:* ${formData.empresa || 'N/A'}%0A` +
                  `📍 *Ciudad:* ${formData.ciudad}%0A` +
                  `🎯 *Interés:* ${formData.interes}%0A` +
                  `💬 *Mensaje:* ${formData.mensaje}`;
    
    const url = `https://wa.me/${telefono}?text=${texto}`;
    window.open(url, '_blank');
  };

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
    <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secundary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-gray-100"
      >
        
        {/* Lado Izquierdo: Branding e Info */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="md:w-2/5 bg-primary p-12 flex flex-col justify-between relative overflow-hidden text-white"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
             <div className="absolute -top-32 -right-32 w-80 h-80 bg-secundary rounded-full blur-[100px] opacity-30"></div>
          </div>

          <div className="relative z-10 text-center md:text-left">
            <motion.div 
              variants={fadeInUp}
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="bg-white p-8 rounded-3xl shadow-xl mb-10 inline-block transform -rotate-3 transition-transform duration-500"
            >
              <Image 
                src={blackLogo} 
                alt="Royal Super Logo" 
                width={200} 
                height={100}
                className="mx-auto"
              />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-6">
              Impulsa tu <span className="text-secundary drop-shadow-lg">Negocio</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 font-medium leading-relaxed mb-10 text-lg">
              Únete a la red de distribución con tecnología de los Emiratos Árabes. Estamos en Valencia para mover a toda Venezuela.
            </motion.p>
          </div>
          
          <motion.div variants={fadeInUp} className="space-y-8 relative z-10">
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-secundary/20 flex items-center justify-center text-secundary group-hover:bg-secundary group-hover:text-white transition-all shadow-lg">
                <span className="material-symbols-outlined text-2xl">location_on</span>
              </div>
              <p className="text-sm font-black uppercase italic text-gray-200 tracking-[0.2em]">Valencia, Carabobo</p>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-foreground/20 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-primary transition-all shadow-lg">
                <span className="material-symbols-outlined text-2xl">call</span>
              </div>
              <p className="text-sm font-black uppercase italic text-gray-200 tracking-[0.2em]">+58 414-5174722</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Lado Derecho: Formulario Estilizado */}
        <motion.form 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          onSubmit={enviarWhatsApp} 
          className="md:w-3/5 p-12 bg-white space-y-8"
        >
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-[0.2em]">Nombre Completo</label>
              <input 
                required 
                name="nombre" 
                onChange={handleChange} 
                placeholder="Ej. Juan Pérez"
                type="text" 
                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl p-5 outline-none focus:border-secundary focus:bg-white transition-all placeholder:text-gray-400 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-[0.2em]">Empresa / Negocio</label>
              <input 
                name="empresa" 
                onChange={handleChange} 
                placeholder="Repuestera Royal"
                type="text" 
                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl p-5 outline-none focus:border-secundary focus:bg-white transition-all placeholder:text-gray-400 font-medium" 
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-[0.2em]">Ubicación</label>
              <input 
                required 
                name="ciudad" 
                onChange={handleChange} 
                placeholder="Valencia, Edo. Carabobo"
                type="text" 
                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl p-5 outline-none focus:border-secundary focus:bg-white transition-all placeholder:text-gray-400 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-[0.2em]">Tipo de Cliente</label>
              <select 
                name="interes" 
                onChange={handleChange} 
                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl p-5 outline-none focus:border-secundary focus:bg-white transition-all font-bold text-sm uppercase cursor-pointer"
              >
                <option value="Minorista / Repuestera">Minorista / Repuestera</option>
                <option value="Flota de Transporte">Flota de Transporte</option>
                <option value="Consumidor Final">Consumidor Final</option>
              </select>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-[0.2em]">Mensaje o Pedido Especial</label>
            <textarea 
              required 
              name="mensaje" 
              onChange={handleChange} 
              rows="4" 
              placeholder="¿En qué podemos ayudarte?"
              className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-2xl p-5 outline-none focus:border-secundary focus:bg-white transition-all placeholder:text-gray-400 font-medium resize-none"
            ></textarea>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 uppercase italic shadow-[0_10px_20px_rgba(34,197,94,0.3)]"
            >
              <span className="material-symbols-outlined font-bold text-2xl">send</span>
              Iniciar Consulta vía WhatsApp
            </motion.button>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="text-center text-[10px] text-gray-400 uppercase font-black tracking-[0.3em]">
            Atención Inmediata de Lunes a Sábado
          </motion.p>
        </motion.form>

      </motion.div>
    </div>
  );
};

export default ContactoPage;