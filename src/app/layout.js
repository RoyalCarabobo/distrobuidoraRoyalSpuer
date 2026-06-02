import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import PermissionPrompts from "@/components/PermissionPrompts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Exportación separada de Viewport y ThemeColor (Obligatorio para la PWA)
export const viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Metadata limpia (Sin themeColor ni viewport adentro)
export const metadata = {
  title: 'Distribuidora Super Carabobo | Lubricantes de Alta Calidad en Valencia - Venezuela',
  description: 'Distribución al mayor de aceites y lubricantes para vehículos en Valencia Carabobo. Calidad Proxil para tu vehículo.',
  manifest: "/manifest.json", // <-- Enlace de la PWA
  keywords: [
    'lubricantes venezuela',
    'aceite para motor valencia',
    'royal super oil',
    'proxil',
    'Royal super carabobo',
    'distribuidor de lubricantes',
    'lubricantes para vehículos',
    'aceites de alta calidad',
    'lubricantes automotrices',
    'valencia carabobo'
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Super Carabobo",
  },
  openGraph: {
    title: 'Royal Super Oil - Potencia y Protección',
    description: 'Expertos en lubricación automotriz.',
    images: ['/logo-royal.png'],
  },
};

// 3. Tu Layout base intacto
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
        <PermissionPrompts />
      </body>
    </html>
  );
}