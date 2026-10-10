import { motion } from 'framer-motion';

const principles = [
  { id: '01', title: 'Creative First', description: 'Design that commands attention.' },
  { id: '02', title: 'Detail Driven', description: 'Every pixel perfectly placed.' },
  { id: '03', title: 'Digital Native', description: 'Born and built for the web.' },
  { id: '04', title: 'Built to Impact', description: 'Results you can actually measure.' }
];

export const WhyUs = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090909]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="lg:w-1/3">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-[#F5F5F5] sticky top-32"
            >
              Why <br />
              <span className="text-[#D4AF37]">DigiCreativio?</span>
            </motion.h2>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-sm font-mono text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                      {principle.id}
                    </span>
                    <div className="h-px bg-[#111111] flex-1 group-hover:bg-[#D4AF37]/30 transition-colors" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-medium text-[#F5F5F5] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {principle.title}
                  </h3>
                  <p className="text-[#858585] text-lg font-light">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
