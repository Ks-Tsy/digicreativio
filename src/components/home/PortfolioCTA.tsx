import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortfolioCTA = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden">
      {/* Background Visual */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#858585] text-sm uppercase tracking-[0.2em] font-semibold mb-6 block">
              Have a project in mind?
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-[#F5F5F5] mb-10 leading-tight"
          >
            Let's make something <br className="hidden sm:block" />
            <span className="text-[#D4AF37] italic font-serif tracking-normal pr-2">worth remembering.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#090909] border border-[#D4AF37]/30 text-[#F5F5F5] font-medium text-sm tracking-wide overflow-hidden transition-all duration-300 hover:border-[#D4AF37]"
            >
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-3 group-hover:text-[#050505] transition-colors duration-300">
                Start a Project <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
