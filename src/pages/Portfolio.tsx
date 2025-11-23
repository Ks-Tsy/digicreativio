import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our collection of creative projects that showcase our expertise and passion for exceptional design
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No portfolio items yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    {project.project_url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/50 hover:bg-primary/10"
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

                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
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
