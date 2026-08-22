import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoEnhanced from '../assets/logo-enhanced.png';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const brandName = "DigiCreativio".split("");

  useEffect(() => {
    // Hide preloader after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2500); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c11] overflow-hidden"
        >
          {/* Abstract ambient background from the main page */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
          </div>

          {/* Logo and Text Reveal */}
          <div className="relative z-10 flex w-full items-center justify-center px-4 text-[9vw] sm:text-[8vw] md:text-[7vw] lg:text-[6vw] leading-normal font-heading font-bold tracking-tight py-8 gap-3 sm:gap-4 md:gap-6">
            <motion.img 
              src={logoEnhanced} 
              alt="Logo"
              initial={{ opacity: 0, scale: 0.5, rotate: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-[1.2em] h-[1.2em] object-cover rounded-full border border-white/10 bg-black/40 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex-shrink-0"
            />
            
            <div className="flex">
              {brandName.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.3 + (index * 0.1), // Stagger effect after logo
                  }}
                  className="text-gradient-metallic inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
