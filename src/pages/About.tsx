import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users, Sparkles, Rocket, Heart, Shield } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
  const { content: heroContent } = useSiteContent("about", "hero");
  const { content: storyContent } = useSiteContent("about", "story");

  const heroData = heroContent?.content_data as {
    title?: string;
    subtitle?: string;
  } | null;

  const storyData = storyContent?.content_data as {
    title?: string;
    content?: string;
  } | null;

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower businesses and creators with exceptional digital design solutions that drive success and inspire audiences.",
      accent: "gold",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be the leading creative agency recognized for innovation, quality, and transformative digital experiences.",
      accent: "purple",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue excellence in every project, delivering work that exceeds expectations and sets new standards.",
      accent: "cyan",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnership, working closely with clients to achieve their goals and realize their vision.",
      accent: "gold",
    },
  ];

  const capabilities = [
    { icon: Sparkles, label: "Creative Strategy" },
    { icon: Rocket, label: "Fast Delivery" },
    { icon: Heart, label: "Client Focus" },
    { icon: Shield, label: "Quality Assurance" },
  ];

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-mesh noise">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
              Who We Are
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <span className="text-gradient">{heroData?.title || "About DigiCreativio"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              {heroData?.subtitle || "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact."}
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Bar */}
      <section className="py-8 border-y border-border/30 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-center gap-3 text-muted-foreground">
                <cap.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border-gradient">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
              
              <div className="relative z-10 p-10 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  Our Journey
                </div>
                <h2 className="text-4xl font-heading font-bold mb-8 text-gradient">{storyData?.title || "Our Story"}</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    {storyData?.content || "DigiCreativio was born from a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. Since our founding, we've been committed to pushing the boundaries of creativity while delivering practical, results-driven solutions."}
                  </p>
                  <p>
                    Our journey began with a small team of passionate designers who shared a vision of creating a different kind of creative agency—one that combines artistic excellence with strategic thinking, technical expertise with human-centered design.
                  </p>
                  <p>
                    Today, we've grown into a full-service digital creative agency, but our core values remain unchanged. We still approach every project with the same enthusiasm and dedication, treating each client's vision as our own.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Our Foundation
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do and shape the way we work with our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group glass border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 opacity-0 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <CardContent className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110
                    ${value.accent === 'gold' ? 'bg-gold/10 border border-gold/20' : ''}
                    ${value.accent === 'purple' ? 'bg-purple/10 border border-purple/20' : ''}
                    ${value.accent === 'cyan' ? 'bg-cyan/10 border border-cyan/20' : ''}
                  `}>
                    <value.icon className={`w-8 h-8
                      ${value.accent === 'gold' ? 'text-gold' : ''}
                      ${value.accent === 'purple' ? 'text-purple' : ''}
                      ${value.accent === 'cyan' ? 'text-cyan' : ''}
                    `} />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple/10 text-purple text-sm font-medium mb-4 border border-purple/20">
              The Team
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">
              Meet Our <span className="text-gradient-purple">Creative Team</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              A diverse group of talented individuals united by a passion for creativity and innovation. Our team brings together expertise in design, technology, and strategy to deliver exceptional results.
            </p>
            <div className="relative rounded-3xl overflow-hidden border-gradient">
              <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-gold/5" />
              <div className="relative z-10 p-10 md:p-14">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With years of combined experience across various industries, our team has the knowledge and skills to tackle any creative challenge. We stay at the forefront of design trends and technologies, ensuring that our clients always receive cutting-edge solutions that give them a competitive advantage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
