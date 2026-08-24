import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
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
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Work
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our collection of creative projects that showcase our expertise and passion for exceptional design
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      {projects.length > 0 && (
        <section className="py-6 border-y border-border/30 bg-secondary/30 sticky top-20 z-30 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full capitalize ${
                    activeFilter === category 
                      ? "bg-primary text-primary-foreground" 
                      : ""
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
                  className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {project.project_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
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
                    <div className="mb-3">
                      <Badge className="bg-primary/10 text-primary border-0 rounded-full capitalize">
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
