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
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      icon: Sparkles,
      title: "Branding",
      description: "Build a memorable brand identity that resonates with your target audience.",
      iconBg: "bg-pink-500/20",
      iconColor: "text-pink-400",
    },
    {
      icon: Code,
      title: "Web Design",
      description: "Beautiful, responsive websites that deliver exceptional user experiences.",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      icon: Layers,
      title: "Digital Art",
      description: "Custom digital artwork that brings your creative vision to life.",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
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
                {/* Logo container - image fills circle */}
                <div className="relative z-10 w-36 h-36 rounded-full overflow-hidden border-2 border-primary/20 shadow-2xl ring-1 ring-primary/10">
                  <img 
                    src={logo} 
                    alt="DigiCreativio Logo" 
                    className="w-full h-full object-cover"
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
              <div key={index} className="group text-center p-8 rounded-2xl bg-card/50 border border-border/30 hover:border-border/60 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2.5 rounded-full border border-border/50 bg-card/50 text-muted-foreground text-sm font-medium mb-8">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Creative <span className="text-primary">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {servicesData?.subtitle || "Comprehensive creative solutions tailored to your unique needs"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group bg-card/80 border-border/40 hover:border-border/80 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 border-border/50 hover:border-border"
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
      <section className="py-24 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2.5 rounded-full border border-border/50 bg-card/50 text-muted-foreground text-sm font-medium mb-8">
              Client Love
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              What Our <span className="text-primary">Clients</span> Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it — hear from the brands we've helped transform
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative max-w-5xl mx-auto text-center rounded-[2.5rem] p-12 md:p-20 overflow-hidden border border-border/20">
            {/* Multi-layer Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/10" />
            
            {/* Animated Blur Orbs */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Pill Badge */}
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Let's Create Together
              </span>
              
              {/* Gradient Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
                Ready to Transform Your Brand?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                {ctaData?.subtitle || "Let's collaborate to create something extraordinary. Get in touch today and let's bring your vision to life."}
              </p>
              
              {/* Animated Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group"
                >
                  <Link to="/contact">
                    {ctaData?.cta_text || "Get Started Today"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="font-semibold text-lg px-10 py-6 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Link to="/portfolio">
                    View Our Work
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
