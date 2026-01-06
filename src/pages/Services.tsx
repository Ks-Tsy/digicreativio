import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Sparkles, Code, Image, Video, Layers, ArrowRight, CheckCircle2, Star } from "lucide-react";
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
      features: ["Marketing Materials", "Social Media Graphics", "Print Design", "Infographics", "Presentations"],
      accent: "gold",
      popular: false,
    },
    {
      icon: Sparkles,
      title: "Logo Design",
      description: "Create a unique and memorable brand identity with a professionally designed logo that represents your business perfectly.",
      features: ["Custom Logo Concepts", "Multiple Revisions", "Vector Files", "Brand Guidelines", "Social Media Kit"],
      accent: "purple",
      popular: true,
    },
    {
      icon: Layers,
      title: "Branding",
      description: "Build a cohesive brand identity that resonates with your target audience and sets you apart from the competition.",
      features: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Color Palette", "Typography System"],
      accent: "gold",
      popular: false,
    },
    {
      icon: Code,
      title: "Web Design",
      description: "Beautiful, responsive websites that deliver exceptional user experiences and drive conversions for your business.",
      features: ["Responsive Design", "UI/UX Design", "Prototyping", "User Testing", "Mobile Optimization"],
      accent: "cyan",
      popular: true,
    },
    {
      icon: Image,
      title: "Digital Art",
      description: "Custom digital artwork and illustrations that bring your creative vision to life with unique, eye-catching visuals.",
      features: ["Digital Illustrations", "Character Design", "Concept Art", "Digital Painting", "Custom Artwork"],
      accent: "purple",
      popular: false,
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing services to create engaging content that tells your story and captivates your audience.",
      features: ["Video Production", "Motion Graphics", "Color Grading", "Sound Design", "Post-Production"],
      accent: "cyan",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-mesh noise">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
              What We Offer
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <span className="text-gradient">{heroData?.title || "Our Services"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              {heroData?.subtitle || "Comprehensive creative solutions designed to help your business thrive in the digital landscape"}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative glass border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 opacity-0 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      <Star className="w-3 h-3 fill-primary" />
                      Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`inline-flex items-center justify-center w-18 h-18 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110
                    ${service.accent === 'gold' ? 'bg-gold/10 border border-gold/20' : ''}
                    ${service.accent === 'purple' ? 'bg-purple/10 border border-purple/20' : ''}
                    ${service.accent === 'cyan' ? 'bg-cyan/10 border border-cyan/20' : ''}
                  `} style={{ width: '4.5rem', height: '4.5rem' }}>
                    <service.icon className={`w-9 h-9
                      ${service.accent === 'gold' ? 'text-gold' : ''}
                      ${service.accent === 'purple' ? 'text-purple' : ''}
                      ${service.accent === 'cyan' ? 'text-cyan' : ''}
                    `} />
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild variant="outline" className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl group/btn">
                    <Link to="/contact">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border-gradient">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple/5 to-cyan/5" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                Start Your Project
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {ctaData?.title || "Ready to Get Started?"}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                {ctaData?.subtitle || "Let's discuss your project and create something amazing together"}
              </p>
              <Button asChild size="lg" className="group bg-primary hover:bg-gold-bright text-primary-foreground font-semibold text-lg px-10 py-6 rounded-xl glow-gold transition-all duration-300 hover:scale-105">
                <Link to="/contact">
                  {ctaData?.cta_text || "Contact Us Today"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
