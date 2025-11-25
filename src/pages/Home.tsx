import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Sparkles, Code, Layers, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo-enhanced.png";

const Home = () => {
  const services = [
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Stunning visuals that capture attention and communicate your message effectively.",
    },
    {
      icon: Sparkles,
      title: "Branding",
      description: "Build a memorable brand identity that resonates with your target audience.",
    },
    {
      icon: Code,
      title: "Web Design",
      description: "Beautiful, responsive websites that deliver exceptional user experiences.",
    },
    {
      icon: Layers,
      title: "Digital Art",
      description: "Custom digital artwork that brings your creative vision to life.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-0" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-scale-in">
              <img 
                src={logo} 
                alt="DigiCreativio Logo" 
                className="mx-auto w-64 md:w-80 h-auto object-contain animate-fade-in"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
              <span className="text-gradient">Crafting the Future of Digital</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-metallic text-lg px-8">
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:bg-primary/10">
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive creative solutions tailored to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="glass border-primary/30 overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to <span className="text-gradient">Transform</span> Your Brand?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's collaborate to create something extraordinary. Get in touch today and let's bring your vision to life.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-metallic text-lg px-8">
                  <Link to="/contact">
                    Get Started Today
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

export default Home;
