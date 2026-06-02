'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth';

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard/admin' },
    { name: 'Inventario', icon: 'inventory_2', path: '/dashboard/admin/inventory' },
    { name: 'Ventas', icon: 'sell', path: '/dashboard/admin/sales' },
    { name: 'Usuarios', icon: 'group', path: '/dashboard/admin/config/users' },
    { name: 'Clientes', icon: 'person', path: '/dashboard/admin/clientsAdmin' },
    { name: 'Configuración', icon: 'settings', path: '/dashboard/admin/config' },

  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* --- TOP BAR (Desktop & Mobile) --- */}
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-200 backdrop-blur-xl px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">

        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-foreground text-xl font-bold">bolt</span>
          </div>
          <span className="hidden md:block font-black text-foreground tracking-tighter uppercase italic">
            Royal<span className="text-secundary">Super</span> <span className="text-xs text-fourth ml-1 font-bold">Admin</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 text-white">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive(item.path)
                ? 'bg-secundary/10 text-secundary'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-gray-400 hover:text-secundary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 bg-gray-100 rounded-lg active:scale-95"
          >
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </button>

          <button
            onClick={() => AuthService.signOut()}
            className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-fourth text-gray-500 hover:text-fourth px-4 py-2 rounded-xl text-xs font-black transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            SALIR
          </button>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY MENU --- */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
        <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white border-l border-gray-200 p-6 flex flex-col shadow-2xl">
          <div className="mb-10 mt-15">
            <p className="text-[18px] font-black text-secundary uppercase tracking-[0.2em] mb-2">Panel de Control</p>
            <h2 className="text-2xl font-black text-gray-900 italic">MENU</h2>
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all ${isActive(item.path)
                  ? 'bg-secundary text-white shadow-lg shadow-secundary/20'
                  : 'text-gray-500 border border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={() => AuthService.signOut()}
              className="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-fourth/10 text-fourth p-4 rounded-2xl font-black text-sm transition-all border border-fourth/10"
            >
              <span className="material-symbols-outlined">logout</span>
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
