import React from 'react';
import { motion } from 'framer-motion';
import { FloatingElement } from '../ui/FloatingElement';
import { MagneticButton } from '../ui/MagneticButton';
import logoEnhanced from '../../assets/logo-enhanced.png';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

export const HeroSection: React.FC = () => {
  const { content } = useSiteContent('home', 'hero');
  const data = (content?.content_data as any) || {};

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

        {/* Wavy lines / mesh background simulation using radial gradients and background images */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%), 
                              repeating-radial-gradient(circle at 0 0, transparent 0, transparent 10px, rgba(255, 255, 255, 0.03) 10px, rgba(255, 255, 255, 0.03) 11px)`,
            backgroundSize: '100% 100%, 60px 60px'
          }}
        />

        <div className="absolute top-[30%] left-0 w-full h-[40%] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl transform -rotate-6" />
        <div className="absolute top-[40%] left-0 w-full h-[20%] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl transform rotate-3" />

        {/* Floating Geometric Shapes (Diamonds/Squares) */}
        <FloatingElement delay={0} duration={8} yOffset={30} className="absolute top-[20%] left-[15%]">
          <div className="w-32 h-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transform rotate-45" />
        </FloatingElement>

        <FloatingElement delay={1.5} duration={10} yOffset={40} className="absolute top-[60%] left-[5%]">
          <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transform rotate-[30deg]" />
        </FloatingElement>

        <FloatingElement delay={0.5} duration={9} yOffset={25} className="absolute top-[15%] right-[20%]">
          <div className="w-24 h-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transform -rotate-12" />
        </FloatingElement>

        <FloatingElement delay={2} duration={12} yOffset={50} className="absolute bottom-[20%] right-[10%]">
          <div className="w-40 h-40 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-lg transform rotate-[15deg]" />
        </FloatingElement>
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center max-w-5xl">

        {/* Center Circular Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] pointer-events-none z-0" />
          <img
            src={logoEnhanced}
            alt="DigiCreativio Logo"
            className="w-full h-full object-cover relative z-10 scale-105"
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8 leading-[1.1]"
        >
          {data.title ? (
            <span className="text-gradient-metallic block">{data.title}</span>
          ) : (
            <>
              <span className="text-gradient-metallic block">Crafting the Future</span>
              <span className="text-gradient-metallic block">of Digital</span>
            </>
          )}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-lg md:text-xl text-foreground/60 mb-12 font-light leading-relaxed"
        >
          {data.subtitle || "Transform your brand with stunning visuals, memorable identities, and exceptional web experiences tailored to your unique vision."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <MagneticButton strength={30}>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center h-14 px-8 rounded-full bg-foreground text-background font-medium text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105"
            >
              {data.cta_primary || "Start Your Project"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </MagneticButton>

          <MagneticButton strength={30}>
            <a
              href="#work"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-transparent border border-white/20 text-foreground font-medium text-lg hover:bg-white/5 transition-colors"
            >
              {data.cta_secondary || "View Our Work"}
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};
