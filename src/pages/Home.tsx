import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Sparkles, Code, Layers, ArrowRight, Zap, Globe, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBackground from "@/assets/hero-background.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

const Home = () => {
  const { content: heroContent } = useSiteContent("home", "hero");
  const { content: servicesContent } = useSiteContent("home", "services_section");
  const { content: ctaContent } = useSiteContent("home", "cta_section");

  const heroData = heroContent?.content_data as {
    title?: string;
    subtitle?: string;
    cta_primary?: string;
    cta_secondary?: string;
  } | null;

  const servicesData = servicesContent?.content_data as {
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

  const stats = [
    { value: "150+", label: "Projects Delivered" },
    { value: "50+", label: "Happy Clients" },
    { value: "5+", label: "Years Experience" },
    { value: "100%", label: "Satisfaction Rate" },
  ];

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Quick turnaround without compromising quality" },
    { icon: CheckCircle, title: "Premium Quality", desc: "Pixel-perfect designs that stand out" },
    { icon: Globe, title: "Global Reach", desc: "Serving clients worldwide with excellence" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with Background Image */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/60" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Radial Glow Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 border border-primary/5 rotate-45" />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-primary/5 rounded-lg rotate-12" />
        <div className="absolute bottom-20 right-40 w-24 h-24 border border-primary/10 rounded-full" />
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo in Circle with Glow Ring */}
            <div className="mb-12 flex justify-center">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 opacity-60" />
                {/* Animated glow ring */}
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 animate-[spin_8s_linear_infinite] opacity-60" />
                {/* Inner ring glow */}
                <div className="absolute inset-[-2px] rounded-full bg-primary/10 blur-sm" />
                {/* Logo container */}
                <div className="relative z-10 w-40 h-40 rounded-full bg-card/90 backdrop-blur-md border border-primary/20 flex items-center justify-center shadow-2xl ring-1 ring-primary/10">
                  <img 
                    src={logo} 
                    alt="DigiCreativio Logo" 
                    className="w-24 h-24 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Main heading with shimmer effect */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
              {heroData?.title || "Crafting the Future of Digital"}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {heroData?.subtitle || "Transform your brand with stunning visuals, memorable identities, and exceptional web experiences tailored to your unique vision."}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button 
                asChild 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
              >
                <Link to="/contact">
                  {heroData?.cta_primary || "Start Your Project"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-6 rounded-full border-border hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
              >
                <Link to="/portfolio">
                  {heroData?.cta_secondary || "View Our Work"}
                </Link>
              </Button>
            </div>

            {/* Stats with Glass Effect */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section - Clean Cards */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Creative Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {servicesData?.subtitle || "Comprehensive creative solutions tailored to your unique needs and vision"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8"
            >
              <Link to="/services" className="group">
                Explore All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Client Love
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it — hear from the brands we've helped transform
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-12 md:p-20 border border-border/50">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Let's Create Together
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {ctaData?.title || "Ready to Transform Your Brand?"}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {ctaData?.subtitle || "Let's collaborate to create something extraordinary. Get in touch today and let's bring your vision to life."}
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Link to="/contact">
                {ctaData?.cta_text || "Get Started Today"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
