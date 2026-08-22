import React from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';
import { FloatingElement } from '../ui/FloatingElement';
import { useSiteContent } from '@/hooks/useSiteContent';

export const ContactSection: React.FC = () => {
  const { content } = useSiteContent('home', 'cta_section');
  const data = (content?.content_data as any) || {};

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <FloatingElement delay={1} duration={9} yOffset={20} className="absolute bottom-0 right-0">
          <div className="w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        </FloatingElement>
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-6"
          >
            {data.title || "Initiate Contact"}
          </motion.h2>
          <p className="text-foreground/60 text-lg">
            {data.subtitle || "Ready to break the laws of physics? Drop us a signal."}
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-12"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative group">
              <input 
                type="text" 
                id="name"
                required
                className="w-full bg-transparent border-0 border-b border-border/50 py-4 text-xl text-foreground focus:outline-none focus:border-primary transition-colors peer"
                placeholder=" "
              />
              <label 
                htmlFor="name" 
                className="absolute left-0 top-4 text-foreground/40 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-6 peer-valid:text-sm peer-valid:text-foreground/40"
              >
                Name
              </label>
              {/* Glowing bottom border effect on focus */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary shadow-[0_0_10px_rgba(255,200,0,0.8)] transition-all duration-300 peer-focus:w-full" />
            </div>

            <div className="relative group">
              <input 
                type="email" 
                id="email"
                required
                className="w-full bg-transparent border-0 border-b border-border/50 py-4 text-xl text-foreground focus:outline-none focus:border-primary transition-colors peer"
                placeholder=" "
              />
              <label 
                htmlFor="email" 
                className="absolute left-0 top-4 text-foreground/40 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-6 peer-valid:text-sm peer-valid:text-foreground/40"
              >
                Email
              </label>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary shadow-[0_0_10px_rgba(255,200,0,0.8)] transition-all duration-300 peer-focus:w-full" />
            </div>
          </div>

          <div className="relative group">
            <textarea 
              id="message"
              required
              rows={4}
              className="w-full bg-transparent border-0 border-b border-border/50 py-4 text-xl text-foreground focus:outline-none focus:border-primary transition-colors peer resize-none"
              placeholder=" "
            />
            <label 
              htmlFor="message" 
              className="absolute left-0 top-4 text-foreground/40 text-xl transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary peer-valid:-top-6 peer-valid:text-sm peer-valid:text-foreground/40"
            >
              Message
            </label>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary shadow-[0_0_10px_rgba(255,200,0,0.8)] transition-all duration-300 peer-focus:w-full" />
          </div>

          <div className="flex justify-center pt-8">
            <MagneticButton>
              <button type="submit" className="relative group overflow-hidden rounded-full bg-foreground text-background px-12 py-5 text-lg font-medium transition-colors">
                <span className="relative z-10 group-hover:text-background mix-blend-difference">{data.cta_text || "Transmit Message"}</span>
                {/* Liquid hover effect */}
                <div className="absolute inset-0 bg-primary translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </button>
            </MagneticButton>
          </div>
        </motion.form>
      </div>
    </section>
  );
};
