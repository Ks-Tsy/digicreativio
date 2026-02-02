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
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be the leading creative agency recognized for innovation, quality, and transformative digital experiences.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue excellence in every project, delivering work that exceeds expectations and sets new standards.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnership, working closely with clients to achieve their goals and realize their vision.",
    },
  ];

  const capabilities = [
    { icon: Sparkles, label: "Creative Strategy" },
    { icon: Rocket, label: "Fast Delivery" },
    { icon: Heart, label: "Client Focus" },
    { icon: Shield, label: "Quality Assurance" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Who We Are
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              {heroData?.title || "About DigiCreativio"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact."}
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities Bar */}
      <section className="py-8 border-y border-border/30 bg-secondary/30">
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
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-border/50">
              <CardContent className="p-10 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  <Sparkles className="w-3 h-3" />
                  Our Journey
                </div>
                <h2 className="text-4xl font-heading font-bold mb-8">
                  {storyData?.title || "Our Story"}
                </h2>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Foundation
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do and shape the way we work with our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              The Team
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
              Meet Our Creative Team
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              A diverse group of talented individuals united by a passion for creativity and innovation. Our team brings together expertise in design, technology, and strategy to deliver exceptional results.
            </p>
            <Card className="bg-card border-border/50">
              <CardContent className="p-10 md:p-14">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With years of combined experience across various industries, our team has the knowledge and skills to tackle any creative challenge. We stay at the forefront of design trends and technologies, ensuring that our clients always receive cutting-edge solutions that give them a competitive advantage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
