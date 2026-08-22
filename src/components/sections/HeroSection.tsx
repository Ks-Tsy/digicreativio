import React from 'react';
import { motion } from 'framer-motion';
import { FloatingElement } from '../ui/FloatingElement';
import { MagneticButton } from '../ui/MagneticButton';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Floating Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} duration={8} yOffset={30} className="absolute top-1/4 left-1/4">
          <div className="w-64 h-64 rounded-full bg-primary/10 blur-[100px]" />
        </FloatingElement>
        <FloatingElement delay={2} duration={10} yOffset={40} className="absolute top-1/3 right-1/4">
          <div className="w-96 h-96 rounded-full bg-purple/10 blur-[120px]" />
        </FloatingElement>
        <FloatingElement delay={1} duration={7} yOffset={25} className="absolute bottom-1/4 left-1/2 -translate-x-1/2">
          <div className="w-80 h-80 rounded-full bg-cyan/10 blur-[100px]" />
        </FloatingElement>
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-card/50 border border-border/50 backdrop-blur-md text-sm text-foreground/80 mb-6">
            Welcome to the future of digital
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold tracking-tight mb-8"
        >
          <span className="text-gradient-metallic block">DigiCreativio</span>
          <span className="text-3xl md:text-5xl lg:text-6xl font-normal text-foreground/60 mt-2 block">
            Weightless Experiences
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-lg md:text-xl text-foreground/70 mb-12"
        >
          We craft premium, cinematic digital products that defy gravity. 
          Elevate your brand with award-winning design and cutting-edge technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton>
            <a href="#work" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-foreground text-background font-medium text-lg hover:bg-primary transition-colors">
              Explore Our Universe
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};
