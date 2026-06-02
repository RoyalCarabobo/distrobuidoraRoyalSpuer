'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [permissionState, setPermissionState] = useState('default');

  useEffect(() => {
    // Only show if browser supports notifications
    if (!('Notification' in window)) return;

    const alreadyHandled = localStorage.getItem('royal_notification_prompted');
    const currentPermission = Notification.permission;
    setPermissionState(currentPermission);

    // Don't show if already granted/denied or already prompted
    if (currentPermission !== 'default' || alreadyHandled) return;

    // Show after cookies are handled (delay longer)
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      localStorage.setItem('royal_notification_prompted', 'true');

      if (permission === 'granted') {
        // Show a welcome notification
        new Notification('¡Notificaciones Activadas! 🔔', {
          body: 'Te avisaremos sobre ofertas y novedades de Royal Super Oil.',
          icon: '/logo-royal.png',
        });
      }

      // Dismiss after a small delay so the user sees the state change
      setTimeout(() => setVisible(false), 800);
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      localStorage.setItem('royal_notification_prompted', 'true');
      setVisible(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem('royal_notification_prompted', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-4 right-4 z-[9998] w-[calc(100vw-2rem)] sm:w-[400px]"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-secundary via-tertiary to-fourth"></div>

            <div className="p-5 sm:p-6">
              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon + Content */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-secundary to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-secundary/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1 pr-4">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                    🔔 ¿Activar Notificaciones?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Recibe alertas sobre promociones exclusivas, nuevos productos y el estado de tus pedidos en tiempo real.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={requestPermission}
                  className="flex-1 px-5 py-2.5 bg-secundary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm cursor-pointer"
                >
                  Sí, Activar
                </button>
                <button
                  onClick={dismiss}
                  className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                >
                  Ahora No
                </button>
              </div>

              {/* Privacy note */}
              <p className="text-[11px] text-gray-400 mt-3 text-center">
                Puedes desactivarlas en cualquier momento desde la configuración de tu navegador.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
