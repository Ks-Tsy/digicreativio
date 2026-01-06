import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

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
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-mesh noise">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
              Our Work
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              Our <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              Explore our collection of creative projects that showcase our expertise and passion for exceptional design
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      {projects.length > 0 && (
        <section className="py-8 border-b border-border/30 bg-secondary/20 sticky top-20 z-30 backdrop-blur-xl">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full capitalize transition-all duration-300 ${
                    activeFilter === category 
                      ? "bg-primary text-primary-foreground" 
                      : "border-border/50 hover:border-primary/50"
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
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/50 mb-6">
                <Filter className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No portfolio items yet</h3>
              <p className="text-muted-foreground text-lg">Check back soon for amazing work!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group glass border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer opacity-0 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  {/* Project Image/Video */}
                  <div className="relative h-72 overflow-hidden">
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
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      {project.project_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-xl shadow-lg"
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
                      <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full capitalize">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
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
    </div>
  );
};

export default Portfolio;
