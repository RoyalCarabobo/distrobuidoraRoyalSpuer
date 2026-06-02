'use client';
import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Intentamos el login
      const result = await AuthService.signIn(email, password);

      // 2. Extraemos data con seguridad
      const userData = result?.user || result?.data?.user;

      if (!userData) {
        throw new Error("Sesión iniciada, pero no se recibieron datos del perfil.");
      }

      // Verificamos el rol desde metadatos
      const userRole = result.user?.user_metadata?.rol || 'Staff'; // Fallback por seguridad

      // 4. Redirección 
      router.push(`/dashboard/${userRole.toLowerCase()}`);

      // Delay antes de refrescar ayuda a Turbopack
      setTimeout(() => {
        router.refresh();
      }, 100);

    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Credenciales incorrectas");
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fondo con brillo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-secundary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.8, staggerChildren: 0.1 } }
        }}
        className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10"
      >
        
        {/* Cabecera */}
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-4xl font-black italic uppercase text-primary tracking-tighter">
            Distribuidora <span className="text-fourth drop-shadow-md">Super Carabobo</span>
          </h2>
          <p className="mt-4 text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
            Panel de Acceso
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.form variants={fadeInUp} className="mt-8 space-y-6" onSubmit={handleLogin}>
          
          {/* Mensaje de Error */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-fourth p-4 rounded-2xl text-xs font-bold border border-red-200 text-center uppercase tracking-wider animate-shake"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            {/* Campo de Correo */}
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 pl-12 text-gray-900 focus:border-secundary focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-secundary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Campo de Contraseña */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 pl-12 pr-12 text-gray-900 focus:border-secundary focus:bg-white focus:ring-0 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-secundary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              
              {/* Botón para mostrar/ocultar contraseña */}
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secundary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-3.582-8-8 0-.645.08-1.275.228-1.875M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.875 9.875l4.25 4.25" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Opciones adicionales: Recordar sesión y Olvidé mi contraseña */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-gray-300 text-secundary focus:ring-secundary" 
              />
              Recordar cuenta
            </label>
            <button 
              type="button" 
              onClick={() => router.push('/recuperar')} // Puedes cambiar la ruta
              className="hover:text-secundary transition-colors font-bold"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 text-sm font-black uppercase italic rounded-2xl text-white transition-all shadow-[0_10px_20px_rgba(13,37,255,0.3)] ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-secundary to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sincronizando...
                </span>
              ) : (
                'Entrar al Sistema'
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push('/registro')}
              disabled={loading}
              className={`w-full py-4 px-4 text-sm font-black uppercase italic rounded-2xl border-2 border-gray-200 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Crear cuenta
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}