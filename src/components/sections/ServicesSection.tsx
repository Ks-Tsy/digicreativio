import React from 'react';
import { motion } from 'framer-motion';
import { FloatingElement } from '../ui/FloatingElement';
import { TiltCard } from '../ui/TiltCard';

const services = [
  {
    title: 'Digital Experience',
    description: 'Immersive websites and web applications that captivate users.',
    icon: '✧',
    delay: 0,
  },
  {
    title: 'Brand Identity',
    description: 'Strategic visual systems that elevate your market presence.',
    icon: '✦',
    delay: 0.2,
  },
  {
    title: 'Motion Design',
    description: 'Fluid animations that bring your digital products to life.',
    icon: '⟡',
    delay: 0.4,
  },
  {
    title: '3D Interactions',
    description: 'Spatial computing and 3D web experiences.',
    icon: '✺',
    delay: 0.6,
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6"
          >
            Capabilities
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto text-lg"
          >
            We blend art and engineering to create digital products that stand out in the void.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <FloatingElement key={index} delay={service.delay} duration={5 + index} yOffset={15} className={index % 2 === 1 ? 'md:mt-24' : ''}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: service.delay }}
                className="h-full"
              >
                <TiltCard depth={15} className="h-full">
                  <div className="glass h-full rounded-2xl p-8 lg:p-12 relative group overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(255,200,0,0.15)]">
                    {/* Hover Glow Effect inside card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="text-4xl text-primary mb-6">{service.icon}</div>
                    <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            </FloatingElement>
          ))}
        </div>
      </div>
    </section>
  );
};
