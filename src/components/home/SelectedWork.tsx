import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const SelectedWork = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(4);
    
    setProjects(data || []);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#090909]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#858585]">
                OUR WORK
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading font-semibold text-[#F5F5F5]">
              Selected Work
            </h2>
          </div>
          <p className="text-lg text-[#858585] font-light max-w-sm md:text-right">
            A selection of identities, digital experiences and visual stories we've created.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {projects.map((project, index) => {
            // Asymmetric layout logic: Alternate between 7 cols and 5 cols
            const isLarge = index % 2 === 0;
            const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
            const marginTop = !isLarge && index !== 0 ? "md:mt-32" : "";

            return (
              <div key={project.id} className={`${colSpan} ${marginTop}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group block relative cursor-pointer"
                >
                  <div className="relative overflow-hidden mb-6 bg-[#111111] aspect-[4/3]">
                    {project.category === 'video' ? (
                      <video
                        src={project.image_url}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        preload="metadata"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <ArrowUpRight className="w-8 h-8 text-[#050505]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider mb-2 block">
                        {project.category || 'PROJECT'}
                      </span>
                      <h3 className="text-2xl font-heading font-medium text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <span className="text-sm text-[#858585] font-mono">
                      {new Date(project.created_at || Date.now()).getFullYear()}
                    </span>
                  </div>
                  
                  {/* Animated line */}
                  <div className="w-full h-px bg-[#111111] mt-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        
        {projects.length === 0 && (
           <div className="text-center py-20 border border-[#111111]">
             <p className="text-[#858585]">Loading projects...</p>
           </div>
        )}

      </div>
    </section>
  );
};
