'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,       // Always on
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('royal_cookie_consent');
    if (!consent) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const all = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('royal_cookie_consent', JSON.stringify(all));
    localStorage.setItem('royal_cookie_date', new Date().toISOString());
    setVisible(false);
  };

  const rejectOptional = () => {
    const minimal = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('royal_cookie_consent', JSON.stringify(minimal));
    localStorage.setItem('royal_cookie_date', new Date().toISOString());
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem('royal_cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('royal_cookie_date', new Date().toISOString());
    setVisible(false);
    setShowPreferences(false);
  };

  const togglePref = (key) => {
    if (key === 'essential') return; // Can't disable essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieTypes = [
    {
      key: 'essential',
      label: 'Cookies Esenciales',
      description: 'Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.',
      locked: true,
    },
    {
      key: 'analytics',
      label: 'Cookies de Análisis',
      description: 'Nos ayudan a entender cómo usas el sitio para mejorar tu experiencia.',
      locked: false,
    },
    {
      key: 'marketing',
      label: 'Cookies de Marketing',
      description: 'Permiten mostrarte contenido y ofertas personalizadas.',
      locked: false,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl sm:rounded-3xl shadow-[0_-10px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            
            {/* Main Banner */}
            <div className="p-5 sm:p-8">
              <div className="flex items-start gap-4 mb-5">
                {/* Cookie Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-tertiary to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-tertiary/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1">🍪 Usamos Cookies</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. 
                    Puedes aceptar todas, rechazar las opcionales o configurarlas a tu medida.
                  </p>
                </div>
              </div>

              {/* Preferences Panel */}
              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 pt-5 mb-5 space-y-3">
                      {cookieTypes.map((cookie) => (
                        <div
                          key={cookie.key}
                          className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex-1 mr-4">
                            <p className="font-bold text-gray-900 text-sm sm:text-base">{cookie.label}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{cookie.description}</p>
                          </div>
                          <button
                            onClick={() => togglePref(cookie.key)}
                            disabled={cookie.locked}
                            className={`
                              relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none
                              ${preferences[cookie.key] ? 'bg-secundary' : 'bg-gray-300'}
                              ${cookie.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            aria-label={`Toggle ${cookie.label}`}
                          >
                            <span
                              className={`
                                absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300
                                ${preferences[cookie.key] ? 'translate-x-5' : 'translate-x-0'}
                              `}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base cursor-pointer"
                >
                  Aceptar Todas
                </button>
                <button
                  onClick={rejectOptional}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  Solo Esenciales
                </button>
                {!showPreferences ? (
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
                  >
                    Configurar
                  </button>
                ) : (
                  <button
                    onClick={savePreferences}
                    className="flex-1 px-6 py-3 bg-secundary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base cursor-pointer"
                  >
                    Guardar Preferencias
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
