import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isHoveringPortfolio, setIsHoveringPortfolio] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is desktop and doesn't prefer reduced motion
    const mediaQueryDesktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsDesktop(mediaQueryDesktop.matches);
    setIsReducedMotion(mediaQueryMotion.matches);

    const handleResize = () => {
      setIsDesktop(window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over a link or button
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button')
      ) {
        // Check if it's a portfolio card (you can add a specific class to identify them)
        if (target.closest('.group.cursor-pointer')) {
          setIsHoveringPortfolio(true);
          setIsHoveringLink(false);
        } else {
          setIsHoveringLink(true);
          setIsHoveringPortfolio(false);
        }
      } else if (target.closest('.group.cursor-pointer')) {
        setIsHoveringPortfolio(true);
        setIsHoveringLink(false);
      } else {
        setIsHoveringLink(false);
        setIsHoveringPortfolio(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor on body when custom cursor is active
    document.body.style.cursor = 'none';
    const hideCursors = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      elements.forEach((el) => {
        (el as HTMLElement).style.cursor = 'none';
      });
    };
    hideCursors();
    
    const observer = new MutationObserver(hideCursors);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      observer.disconnect();
      const elements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      elements.forEach((el) => {
        (el as HTMLElement).style.cursor = '';
      });
    };
  }, [isDesktop, isReducedMotion]);

  if (!isDesktop || isReducedMotion) return null;

  const variants = {
    default: {
      x: position.x - 8,
      y: position.y - 8,
      width: 16,
      height: 16,
      backgroundColor: 'rgba(212, 175, 55, 1)', // #D4AF37
      mixBlendMode: 'normal' as any,
    },
    link: {
      x: position.x - 24,
      y: position.y - 24,
      width: 48,
      height: 48,
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      border: '1px solid rgba(212, 175, 55, 0.5)',
      mixBlendMode: 'normal' as any,
    },
    portfolio: {
      x: position.x - 40,
      y: position.y - 40,
      width: 80,
      height: 80,
      backgroundColor: 'rgba(212, 175, 55, 1)',
      mixBlendMode: 'normal' as any,
    }
  };

  const getVariant = () => {
    if (isHoveringPortfolio) return 'portfolio';
    if (isHoveringLink) return 'link';
    return 'default';
  };

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
      variants={variants}
      animate={getVariant()}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 28,
        mass: 0.5
      }}
    >
      <AnimatePresence>
        {isHoveringPortfolio && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[#050505] text-[10px] font-semibold tracking-widest font-mono"
          >
            VIEW
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
