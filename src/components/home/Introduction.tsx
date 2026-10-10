import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Introduction = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090909] relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
          
          {/* Left Column - Heading */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#858585]">
                WHAT WE DO
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-[#F5F5F5] leading-tight"
            >
              Ideas become identities. <br />
              <span className="text-[#858585]">Identities become experiences.</span>
            </motion.h2>
          </div>

          {/* Right Column - Description */}
          <div className="lg:w-1/2 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pl-0 lg:pl-12 border-l-0 lg:border-l-[1px] border-[#111111]"
            >
              <p className="text-xl sm:text-2xl text-[#F5F5F5] font-light leading-relaxed mb-10">
                DigiCreativio helps businesses transform ideas into memorable visual identities, digital products and powerful content.
              </p>
              
              <Link 
                to="/about" 
                className="group inline-flex items-center gap-3 text-[#D4AF37] font-medium text-sm tracking-wide transition-colors"
              >
                <span className="relative">
                  Learn about our studio
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </span>
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#050505] transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
