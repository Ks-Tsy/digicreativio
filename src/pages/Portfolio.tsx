import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      title: "Brand Identity Design",
      category: "Branding",
      description: "Complete brand identity system including logo, colors, and guidelines for a tech startup.",
      tags: ["Logo Design", "Branding", "Identity"],
    },
    {
      title: "E-Commerce Website",
      category: "Web Design",
      description: "Modern, conversion-optimized e-commerce platform with seamless user experience.",
      tags: ["Web Design", "UI/UX", "E-Commerce"],
    },
    {
      title: "Marketing Campaign",
      category: "Graphic Design",
      description: "Comprehensive marketing materials for a product launch including social media and print.",
      tags: ["Graphic Design", "Marketing", "Social Media"],
    },
    {
      title: "Mobile App Interface",
      category: "UI/UX Design",
      description: "Intuitive and beautiful mobile app interface design with user-centered approach.",
      tags: ["UI Design", "Mobile", "App Design"],
    },
    {
      title: "Digital Illustrations",
      category: "Digital Art",
      description: "Custom digital artwork and character designs for a gaming company.",
      tags: ["Digital Art", "Illustration", "Character Design"],
    },
    {
      title: "Corporate Rebranding",
      category: "Branding",
      description: "Complete visual identity refresh for an established corporation.",
      tags: ["Branding", "Identity", "Corporate"],
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-charcoal to-charcoal-light overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary/20">{project.title.charAt(0)}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                      {project.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-border/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="glass border-primary/30 overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Like What You <span className="text-gradient">See</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's create something amazing together. Start your project today.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-metallic text-lg px-8">
                  <Link to="/contact">
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
