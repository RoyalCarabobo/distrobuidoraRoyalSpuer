import withPWAPlugin from "@ducanh2912/next-pwa";

const withPWA = withPWAPlugin({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Evita problemas de caché programando en local
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rgamxsgnvwfxoxnyszfm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactCompiler: true,
};

// Envolvemos tu configuración original con el plugin de la PWA
export default withPWA(nextConfig);