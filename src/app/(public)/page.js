'use client';
import Link from 'next/link';
import Image from 'next/image';
import Carrusel from '@/components/Carrusel';
import { certifi } from '@/assets/index';
import { motion } from 'framer-motion';

export default function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center w-full overflow-x-hidden selection:bg-secundary selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className='relative w-full bg-gradient-to-b from-gray-50 to-backgroundSecundary/20 pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden flex flex-col items-center'>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-secundary/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className='px-4 sm:px-6 w-full max-w-7xl text-center flex flex-col items-center z-10'
        >
          <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-gray-200 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-fourth animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 tracking-wide">Distribuidora Oficial en Venezuela</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className='text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase italic text-gray-900 leading-[1.1] mb-6'
          >
            Royal <span className='text-transparent bg-clip-text bg-gradient-to-r from-secundary to-blue-500 drop-shadow-sm'>Super Oil</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className='max-w-2xl text-gray-600 font-medium text-lg sm:text-xl md:text-2xl leading-relaxed mb-10'
          >
            Lubricantes premium para motores a gasolina y diesel. 
            <span className="text-gray-900 font-bold"> Calidad garantizada</span> para el parque automotor venezolano.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
             <Link
                href="/catalogo"
                className="group relative px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:shadow-primary/30 w-full sm:w-auto flex justify-center"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10">Explorar Catálogo</span>
             </Link>
             <Link
                href="/contacto"
                className="px-8 py-4 bg-white text-primary border border-gray-200 rounded-xl font-bold text-lg shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 w-full sm:w-auto flex justify-center"
              >
                Contactar Ventas
             </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. CAROUSEL SECTION */}
      <section className='w-full bg-black py-16 lg:py-24 relative z-20 border-y border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)]'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[1400px] mx-auto px-4"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-secundary/20 to-tertiary/20 opacity-50 blur-2xl rounded-[3rem]"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
             <Carrusel />
          </div>
        </motion.div>
      </section>

      {/* 3. CERTIFICATION & ABOUT SECTION */}
      <section className="py-24 sm:py-32 w-full bg-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gray-50 to-transparent -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center"
        >
          <div className="text-center max-w-4xl mb-16">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 leading-tight">
              Fabricante líder en <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secundary to-blue-600">Emiratos Árabes Unidos</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
              Distribuidores de lubricantes de alto rendimiento para motores a gasolina y diesel, transmisiones, ligas de freno y mucho más.
              A diferencia de otras marcas, <span className="font-bold text-gray-900">Royal Super</span> se enfoca en el sellado de los anillos del pistón y la protección de las partes móviles desde el encendido en frío, cuando ocurre el 75% del desgaste del motor.
            </motion.p>
          </div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-3 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secundary/10 to-tertiary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Image
              src={certifi}
              alt="Certificado Royal Super Oil"
              width={800}
              height={700}
              className="rounded-2xl relative z-10 object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Info Cards Split */}
        <div className="pt-24 sm:pt-32 pb-10 bg-transparent relative z-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
              
              {/* Left Column: Local */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center bg-gray-50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-gray-100">
                  <svg className="w-8 h-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mb-6">
                  Nuestra Huella en la <span className="text-tertiary block mt-2">Ciudad Industrial</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  Nacidos en la zona industrial de Valencia, hemos crecido junto al parque automotor carabobeño, entendiendo las exigencias de sus rutas y el rigor de su industria. Hoy distribuimos calidad certificada desde el centro del país hacia cada rincón de Venezuela.
                </p>
                <div className="mt-auto p-5 bg-white rounded-2xl border-l-4 border-secundary shadow-sm">
                  <p className="italic text-gray-800 font-semibold text-sm sm:text-base">
                    "Experiencia comprobada en las rutas más exigentes del país."
                  </p>
                </div>
              </motion.div>

              {/* Right Column: Global */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-primary p-8 sm:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center"
              >
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-secundary rounded-full mix-blend-screen filter blur-[80px] opacity-60 pointer-events-none"></div>
                
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 relative z-10">
                  <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white italic relative z-10 tracking-tight">
                  Fabricante <span className="text-foreground">Líder</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-10 relative z-10">
                  Con más de dos décadas de experiencia, fabricamos y exportamos lubricantes de alto rendimiento a nivel mundial. Como proveedores con presencia en África y Asia, cumplimos con los más altos estándares internacionales.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10 mt-auto">
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center transition-all hover:bg-white/10">
                    <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Tecnología</span>
                    <span className="text-base sm:text-lg font-black text-white">Alemana</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center transition-all hover:bg-white/10">
                    <span className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Calidad</span>
                    <span className="text-base sm:text-lg font-black text-white">Certificada</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-24 sm:py-32 text-center w-full bg-gradient-to-br from-backgroundSecundary/30 via-white to-backgroundSecundary/30 relative overflow-hidden border-t border-gray-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secundary/5 rounded-full blur-[100px] -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tighter uppercase italic mb-8 drop-shadow-sm">
            Calidad y confianza en <br className="hidden sm:block"/> <span className="text-fourth">cada producto</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Somos líderes en distribución de lubricantes y aditivos para vehículos. Revisa nuestro catálogo y haz tu pedido hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link
                href="/catalogo"
                className="group w-full sm:w-auto bg-tertiary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(255,115,0,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,115,0,0.4)] flex items-center justify-center gap-2"
              >
                <span>VER CATÁLOGO</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
             </Link>

             <Link
                href="/contacto"
                className="group w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(41,40,40,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(41,40,40,0.4)] flex items-center justify-center gap-2"
              >
                <span>CONTACTAR VENTAS</span>
             </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
