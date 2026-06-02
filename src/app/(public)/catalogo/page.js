'use client'
import CatalogoBase from '@/components/CatalogoBase';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

export default function PublicPage() {
  const { productos, isLoading } = useProducts();

  return (
    <div className="bg-background min-h-screen">
       {/* Hero Publicitario */}
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="bg-primary py-24 text-center border-b-[8px] border-secundary relative overflow-hidden"
       >
         {/* Background Decoration */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
         <div className="absolute -top-32 -left-32 w-96 h-96 bg-secundary/20 rounded-full blur-[100px]"></div>
         
         <motion.h1 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.2, duration: 0.6 }}
           className="text-white text-4xl md:text-6xl font-black italic uppercase relative z-10 tracking-tighter"
         >
           Catálogo Distribuidora <span className="text-foreground drop-shadow-[0_0_15px_rgba(255,216,13,0.3)]">Super Carabobo</span>
         </motion.h1>
         <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mt-6 max-w-2xl mx-auto font-medium text-lg relative z-10"
         >
            Explora nuestra amplia gama de lubricantes y fluidos automotrices e industriales de la más alta calidad.
         </motion.p>
       </motion.div>
       
       <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, duration: 0.8 }}
         className="container mx-auto px-4 py-12"
       >
         <CatalogoBase 
           productos={productos} 
           isLoading={isLoading} 
           showPrivateData={false} 
         />
       </motion.div>
    </div>
  );
}