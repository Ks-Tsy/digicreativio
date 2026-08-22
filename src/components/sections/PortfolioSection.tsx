import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'Aura',
    category: 'Web Experience',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    yOffset: 0,
  },
  {
    id: 2,
    title: 'Nebula',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    yOffset: 100,
  },
  {
    id: 3,
    title: 'Chroma',
    category: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop',
    yOffset: 50,
  },
  {
    id: 4,
    title: 'Void',
    category: '3D Interaction',
    image: 'https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    yOffset: 150,
  }
];

export const PortfolioSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="work" className="relative py-32 bg-background overflow-hidden" ref={containerRef}>
      <div className="container relative z-10 mb-20">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-heading font-bold"
        >
          Selected <span className="text-foreground/40 italic">Work</span>
        </motion.h2>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-32">
          {projects.map((project, i) => {
            // Parallax effect based on scroll
            const y = useTransform(
              scrollYProgress,
              [0, 1],
              [0, -150 * (i % 2 === 0 ? 1 : 1.5)]
            );

            return (
              <motion.div 
                key={project.id}
                style={{ y, marginTop: project.yOffset }}
                className="group relative"
              >
                <div className="overflow-hidden rounded-2xl glass-strong aspect-[4/5] relative">
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-10" />
                  
                  {/* Floating Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="glass p-6 rounded-xl">
                      <p className="text-primary text-sm font-mono mb-2 uppercase tracking-wider">{project.category}</p>
                      <h3 className="text-3xl font-heading text-white">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
