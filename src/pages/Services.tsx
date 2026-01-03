import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Sparkles, Code, Image, Video, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Services = () => {
  const { content: heroContent } = useSiteContent("services", "hero");
  const { content: ctaContent } = useSiteContent("services", "cta");

  const heroData = heroContent?.content_data as {
    title?: string;
    subtitle?: string;
  } | null;

  const ctaData = ctaContent?.content_data as {
    title?: string;
    subtitle?: string;
    cta_text?: string;
  } | null;

  const services = [
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Transform your ideas into stunning visual content that captures attention and communicates your message with impact.",
      features: [
        "Marketing Materials",
        "Social Media Graphics",
        "Print Design",
        "Infographics",
        "Presentations",
      ],
    },
    {
      icon: Sparkles,
      title: "Logo Design",
      description: "Create a unique and memorable brand identity with a professionally designed logo that represents your business perfectly.",
      features: [
        "Custom Logo Concepts",
        "Multiple Revisions",
        "Vector Files",
        "Brand Guidelines",
        "Social Media Kit",
      ],
    },
    {
      icon: Layers,
      title: "Branding",
      description: "Build a cohesive brand identity that resonates with your target audience and sets you apart from the competition.",
      features: [
        "Brand Strategy",
        "Visual Identity",
        "Brand Guidelines",
        "Color Palette",
        "Typography System",
      ],
    },
    {
      icon: Code,
      title: "Web Design",
      description: "Beautiful, responsive websites that deliver exceptional user experiences and drive conversions for your business.",
      features: [
        "Responsive Design",
        "UI/UX Design",
        "Prototyping",
        "User Testing",
        "Mobile Optimization",
      ],
    },
    {
      icon: Image,
      title: "Digital Art",
      description: "Custom digital artwork and illustrations that bring your creative vision to life with unique, eye-catching visuals.",
      features: [
        "Digital Illustrations",
        "Character Design",
        "Concept Art",
        "Digital Painting",
        "Custom Artwork",
      ],
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing services to create engaging content that tells your story and captivates your audience.",
      features: [
        "Video Production",
        "Motion Graphics",
        "Color Grading",
        "Sound Design",
        "Post-Production",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {heroData?.title || "Our Services"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "Comprehensive creative solutions designed to help your business thrive in the digital landscape"}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                    <Link to="/contact">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
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
                  {ctaData?.title || "Ready to Get Started?"}
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {ctaData?.subtitle || "Let's discuss your project and create something amazing together"}
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-metallic text-lg px-8">
                  <Link to="/contact">
                    {ctaData?.cta_text || "Contact Us Today"}
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

export default Services;
