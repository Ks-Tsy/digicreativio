import { motion } from 'framer-motion';

const steps = [
  { id: '01', title: 'Discover', description: 'Understanding your brand, audience, and objectives.' },
  { id: '02', title: 'Define', description: 'Strategizing and planning the creative direction.' },
  { id: '03', title: 'Create', description: 'Designing and building the digital experience.' },
  { id: '04', title: 'Deliver', description: 'Launching and optimizing for impact.' }
];

export const Process = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#050505]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-semibold text-[#F5F5F5]">
            How we work
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-0 w-full h-[1px] bg-[#111111] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Mobile Connecting Line */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[56px] left-[28px] w-[1px] h-[calc(100%+48px)] bg-[#111111] z-0" />
                )}

                <div className="flex md:block items-start gap-6 md:gap-0">
                  <div className="w-14 h-14 rounded-full bg-[#090909] border border-[#111111] flex items-center justify-center text-[#D4AF37] font-mono text-lg shrink-0 md:mb-8 transition-colors duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 z-10 relative">
                    {step.id}
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-medium text-[#F5F5F5] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#858585] text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
