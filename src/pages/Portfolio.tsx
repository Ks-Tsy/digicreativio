import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Loader2, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const { content: heroContent } = useSiteContent("portfolio", "hero");
  const heroData = (heroContent?.content_data as any) || {};

  const { content: ctaContent } = useSiteContent("portfolio", "cta");
  const ctaData = (ctaContent?.content_data as any) || {};

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true });
    
    setProjects(data || []);
    setLoading(false);
  };

  const categories = ["all", ...new Set(projects.map(p => p.category))];
  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section data-section-id="hero" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span 
              data-editable-field="badge"
              data-field-label="Hero Badge"
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              {heroData.badge || "Our Work"}
            </span>
            <h1 
              data-editable-field="title"
              data-field-label="Page Title"
              className="text-5xl md:text-6xl font-heading font-bold mb-6"
            >
              {heroData.title || "Our Portfolio"}
            </h1>
            <p 
              data-editable-field="subtitle"
              data-field-label="Page Subtitle"
              data-field-type="textarea"
              className="text-xl text-muted-foreground leading-relaxed"
            >
              {heroData.subtitle || "Explore our collection of creative projects that showcase our expertise and passion for exceptional design"}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      {projects.length > 0 && (
        <section className="py-6 border-y border-[#111111] bg-[#050505]/80 sticky top-20 z-30 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full capitalize transition-all ${
                    activeFilter === category 
                      ? "bg-[#D4AF37] text-[#050505] hover:bg-[#F0C75E] border-transparent" 
                      : "bg-[#090909] text-[#858585] border-[#111111] hover:text-[#F5F5F5] hover:border-[#D4AF37]/50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6">
                <Filter className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No portfolio items yet</h3>
              <p className="text-muted-foreground text-lg">Check back soon for amazing work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-[#090909] border-[#111111] hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Project Image/Video */}
                  <div className="relative h-64 overflow-hidden">
                    {project.category === 'video' ? (
                      <video
                        src={project.image_url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                      {project.project_url && (
                        <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <Button
                            size="sm"
                            className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] rounded-full font-semibold px-6"
                            asChild
                          >
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Project
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge className="bg-[#111111] text-[#D4AF37] hover:bg-[#111111] border border-[#D4AF37]/20 rounded-full capitalize text-xs px-3 py-1 font-medium">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-[#F5F5F5] mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-[#858585] text-sm line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio CTA Section */}
      <section data-section-id="cta" className="py-24 bg-[#050505] border-t border-[#111111]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-[#090909] rounded-[2rem] p-12 md:p-16 border border-[#111111] relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10">
              <span 
                data-editable-field="badge"
                data-field-label="CTA Badge"
                className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
              >
                {ctaData.badge || "Start a Project"}
              </span>
            <h2 
              data-editable-field="title"
              data-field-label="CTA Title"
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              {ctaData.title || "Have a Project in Mind?"}
            </h2>
            <p 
              data-editable-field="subtitle"
              data-field-label="CTA Subtitle"
              data-field-type="textarea"
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {ctaData.subtitle || "Let's collaborate to create something truly exceptional. Reach out to discuss your ideas."}
            </p>
            <Button asChild size="lg" className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] font-semibold rounded-full px-10 h-14 mt-4">
              <a href="/contact">
                <span data-editable-field="button_text" data-field-label="Button Text">
                  {ctaData.button_text || "Get in Touch"}
                </span>
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
