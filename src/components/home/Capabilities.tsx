import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilities = [
  {
    id: '01',
    title: 'GRAPHIC DESIGN',
    description: 'Brand identities, logo systems, social media creatives and visual communication.',
    link: '/services#graphic-design'
  },
  {
    id: '02',
    title: 'WEB DEVELOPMENT',
    description: 'Modern websites and digital experiences built for performance and growth.',
    link: '/services#web-development'
  },
  {
    id: '03',
    title: 'VIDEO EDITING',
    description: 'Visual storytelling, promotional content, reels and motion-driven experiences.',
    link: '/services#video-editing'
  }
];

export const Capabilities = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 sm:py-32 bg-[#050505] relative">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl font-heading font-semibold text-[#F5F5F5] mb-4">
            What we create
          </h2>
          <p className="text-xl text-[#858585] font-light max-w-xl">
            Creative thinking backed by digital expertise.
          </p>
        </div>

        <div className="flex flex-col border-t border-[#111111]">
          {capabilities.map((item, index) => (
            <div 
              key={item.id}
              className="group relative border-b border-[#111111]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={item.link} className="block py-8 md:py-12 relative z-10 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start md:items-center gap-6 md:gap-12 w-full md:w-auto">
                    <span className="text-sm md:text-lg font-mono font-medium text-[#858585] transition-colors duration-500 group-hover:text-[#D4AF37]">
                      {item.id}
                    </span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-[#F5F5F5] transition-transform duration-500 origin-left group-hover:scale-[1.02]">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 flex-1 w-full md:w-auto mt-4 md:mt-0 pl-12 md:pl-0">
                    <div className="overflow-hidden md:max-w-md w-full md:w-auto">
                      <p className="text-[#858585] md:text-right text-base sm:text-lg transition-all duration-500 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="hidden md:flex w-16 h-16 rounded-full border border-[#111111] items-center justify-center transition-all duration-500 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/10 flex-shrink-0">
                      <ArrowUpRight className="w-6 h-6 text-[#858585] transition-all duration-500 group-hover:text-[#D4AF37] group-hover:rotate-45" />
                    </div>
                  </div>

                </div>
              </Link>
              
              {/* Hover Background Glow Element */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
