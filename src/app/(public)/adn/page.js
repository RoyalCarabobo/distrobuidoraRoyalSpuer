'use client'
import React from 'react';
import Image from 'next/image';
import { andRoyal, misionRoyal, blackLogo } from '@/assets/index';
import { motion } from 'framer-motion';

const AdnRoyalPage = () => {
    const products = [
        { title: 'Línea Pesada (Diesel)', description: 'SAE 50, 60 y 70. Máxima protección contra el hollín y desgaste extremo.', icon: '🚛' },
        { title: 'Línea Automotriz (Gasolina)', description: '15W-40 y 20W-50. Ingeniería para optimización de combustible y limpieza activa.', icon: '🚗' },
        { title: 'Ligas de Freno', description: 'DOT 3 y DOT 4. Seguridad crítica con alto punto de ebullición.', icon: '🛑' },
        { title: 'Especialidades & Fluidos', description: 'Transmisión, Hidráulico y Refrigerantes de alto control térmico.', icon: '⚙️' },
        { title: 'Motos & Fuera de Borda', description: '2T, 4T y Náutico. Protección contra la corrosión y máxima aceleración.', icon: '🛵' },
    ];

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
        <div className="bg-background text-gray-900 font-sans overflow-hidden">

            {/* 1. TRAYECTORIA: Valencia en el ADN */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 to-background overflow-hidden"
            >
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div variants={fadeInUp} className="md:w-1/2 z-10">
                            <h4 className="text-foreground font-black uppercase tracking-[0.2em] mb-4 text-sm drop-shadow-sm">Orgullo Carabobeño</h4>
                            <h1 className="text-5xl md:text-7xl font-black mb-8 text-primary leading-tight italic tracking-tighter">
                                Nuestra Huella en la <br/> 
                                <span className="text-secundary drop-shadow-md">Ciudad Industrial</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-foreground pl-8 max-w-xl font-medium">
                                <span className="font-bold text-primary">Desde hace más de 2 años</span>, Royal Super echó raíces en la Zona Industrial de Valencia. Nacimos con una misión clara: ofrecer una alternativa de lubricación de clase mundial que soporte el rigor de las rutas venezolanas.
                            </p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="md:w-1/2 relative w-full flex justify-center md:justify-end">
                            <div className="absolute inset-0 bg-secundary/10 blur-[80px] rounded-full scale-150"></div>
                            <motion.div 
                                whileHover={{ scale: 1.02, rotate: 0 }}
                                className="relative p-3 bg-primary rounded-[2.5rem] shadow-2xl transform md:rotate-3 transition-all duration-500 ease-in-out group z-10 w-full max-w-lg"
                            >
                                <Image
                                    src={andRoyal}
                                    alt='Huella Royal Valencia'
                                    className="rounded-[2rem] object-cover opacity-90 group-hover:opacity-100 transition-opacity w-full h-auto"
                                    width={700}
                                    height={450}
                                    priority
                                />
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -bottom-8 -right-8 bg-secundary text-white p-8 rounded-3xl shadow-xl hidden md:block"
                                >
                                    <p className="text-4xl font-black italic">+2</p>
                                    <p className="text-[12px] uppercase font-bold tracking-widest mt-1">Años en Valencia</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 2. MISIÓN: Compromiso Técnico */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="py-28 bg-white relative"
            >
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-20">
                        <motion.div variants={fadeInUp} className="md:w-1/2">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 text-primary italic uppercase tracking-tighter">
                                Misión: <span className="text-secundary">Potencia</span> en Movimiento
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-12 font-medium">
                                "Garantizar la continuidad del movimiento en Venezuela, suministrando tecnología emiratí que supere las exigencias de nuestras carreteras. Protegemos el patrimonio de cada conductor."
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <motion.div whileHover={{ y: -5 }} className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl shadow-xl hover:bg-secundary transition-colors cursor-default">
                                    <span className="material-symbols-outlined text-foreground text-2xl">local_shipping</span>
                                    <span className="text-sm font-black uppercase italic tracking-widest">Despacho Inmediato</span>
                                </motion.div>
                                <motion.div whileHover={{ y: -5 }} className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary text-primary rounded-2xl shadow-lg hover:border-secundary transition-colors cursor-default">
                                    <span className="material-symbols-outlined text-secundary text-2xl">support_agent</span>
                                    <span className="text-sm font-black uppercase italic tracking-widest">Soporte Directo</span>
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="md:w-1/2 w-full flex justify-center md:justify-start">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="relative p-2 bg-backgroundSecundary rounded-[3rem] shadow-inner overflow-hidden group max-w-lg w-full"
                            >
                                <Image
                                    src={misionRoyal}
                                    alt='Mision Royal Super'
                                    className="rounded-[2.8rem] w-full h-auto"
                                    width={700}
                                    height={450}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 3. VISIÓN: El Sello de Confianza (LOGO SECTION) */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="py-32 bg-primary relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-secundary/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/20 blur-[150px] rounded-full"></div>
                
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-20">
                        <motion.div variants={fadeInUp} className="md:w-1/2 text-white">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
                                Visión: El <span className="text-secundary">Estándar</span> Global
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-10 font-light">
                                Proyectamos a Royal Super como la marca de referencia indiscutible en Venezuela, transformando la excelencia de los Emiratos Árabes en la tranquilidad diaria del conductor.
                            </p>
                            <motion.blockquote 
                                whileHover={{ x: 10 }}
                                className="border-l-4 border-secundary pl-8 py-4 bg-white/5 rounded-r-2xl backdrop-blur-sm"
                            >
                                <p className="text-3xl font-black italic text-white uppercase tracking-tight">
                                    "Cada gota es rendimiento imparable."
                                </p>
                            </motion.blockquote>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="md:w-1/2 flex justify-center">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: 0 }}
                                className="relative p-12 bg-white rounded-[4rem] shadow-[0_0_80px_rgba(13,37,255,0.3)] transform md:-rotate-3 transition-all duration-500 ease-out group"
                            >
                                <Image
                                    src={blackLogo}
                                    alt='Logo Royal Super Oficial'
                                    className="rounded-2xl brightness-110"
                                    width={400}
                                    height={240}
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-secundary/5 rounded-[4rem] pointer-events-none"></div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 4. INGENIERÍA: Portafolio */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="py-32 bg-white"
            >
                <div className="container mx-auto px-6 max-w-7xl text-center">
                    <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black mb-4 text-primary uppercase italic tracking-tighter">
                        Ingeniería <span className="text-secundary text-stroke">Maestra</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm mb-24">
                        Catálogo de Alto Desempeño
                    </motion.p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {products.map((product, index) => (
                            <motion.div 
                                key={index} 
                                variants={fadeInUp}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="group relative bg-backgroundSecundary/30 p-12 rounded-[3rem] border border-gray-100 hover:border-secundary/30 hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-secundary/5 rounded-full -mr-20 -mt-20 group-hover:bg-secundary/10 transition-colors duration-500"></div>
                                <motion.div 
                                    className="text-7xl mb-8 inline-block drop-shadow-md"
                                    whileHover={{ rotate: [-10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {product.icon}
                                </motion.div>
                                <h3 className="text-2xl font-black mb-4 text-primary uppercase italic tracking-tight">{product.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-medium text-base">{product.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default AdnRoyalPage;