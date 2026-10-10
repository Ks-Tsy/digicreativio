import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PremiumHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background System */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Abstract Visual Element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 h-full z-0 opacity-40 mix-blend-screen pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] rounded-full border-[1px] border-[#D4AF37]/10"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.7 }}
          className="absolute right-[5%] top-[10%] w-[500px] h-[500px] rounded-full border-[1px] border-[#D4AF37]/20"
        />
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute right-[10%] top-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-2xl"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-8 bg-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
              DIGICREATIVIO® — DIGITAL CREATIVE STUDIO
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] tracking-tight mb-8 text-[#F5F5F5]"
          >
            Crafting the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0C75E] via-[#D4AF37] to-[#F0C75E] pr-2">
              Future of Digital.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-[#858585] max-w-2xl mb-12 font-sans leading-relaxed"
          >
            We specialize in premium graphic design, high-performance web development, and compelling video editing to help brands stand out and grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] text-[#050505] font-semibold text-sm tracking-wide overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                Start a Project <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link 
              to="/portfolio" 
              className="group inline-flex items-center gap-2 text-[#F5F5F5] font-semibold text-sm tracking-wide hover:text-[#D4AF37] transition-colors"
            >
              <span className="relative">
                View Our Work
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
