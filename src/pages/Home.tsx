import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Sparkles, Code, Layers, ArrowRight, Star, Zap, Globe } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo-enhanced.png";
import { useSiteContent } from "@/hooks/useSiteContent";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
const Home = () => {
  const {
    content: heroContent
  } = useSiteContent("home", "hero");
  const {
    content: servicesContent
  } = useSiteContent("home", "services_section");
  const {
    content: ctaContent
  } = useSiteContent("home", "cta_section");
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
  const services = [{
    icon: Palette,
    title: "Graphic Design",
    description: "Stunning visuals that capture attention and communicate your message effectively.",
    accent: "gold"
  }, {
    icon: Sparkles,
    title: "Branding",
    description: "Build a memorable brand identity that resonates with your target audience.",
    accent: "purple"
  }, {
    icon: Code,
    title: "Web Design",
    description: "Beautiful, responsive websites that deliver exceptional user experiences.",
    accent: "cyan"
  }, {
    icon: Layers,
    title: "Digital Art",
    description: "Custom digital artwork that brings your creative vision to life.",
    accent: "gold"
  }];
  const stats = [{
    value: "150+",
    label: "Projects Delivered"
  }, {
    value: "50+",
    label: "Happy Clients"
  }, {
    value: "5+",
    label: "Years Experience"
  }, {
    value: "100%",
    label: "Satisfaction Rate"
  }];
  return <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh noise">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: "1s"
        }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan/3 rounded-full blur-3xl" />
        </div>
        
        <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.15
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo with glow */}
            <div className="mb-8 opacity-0 animate-scale-in" style={{
            animationDelay: "100ms",
            animationFillMode: "forwards"
          }}>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
                <img src={logo} alt="DigiCreativio Logo" className="mx-auto w-72 md:w-96 h-auto object-contain relative z-10 border-0 shadow-none" />
              </div>
            </div>
            
            {/* Main heading with gradient */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[1.1] opacity-0 animate-fade-in" style={{
            animationDelay: "300ms",
            animationFillMode: "forwards"
          }}>
              <span className="text-gradient text-justify text-gray-400 bg-gray-400">{heroData?.title || "Crafting the Future"}</span>
              <br />
              <span className="text-gradient-white"></span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in" style={{
            animationDelay: "500ms",
            animationFillMode: "forwards"
          }}>
              {heroData?.subtitle || "Transform your brand with stunning visuals, memorable identities, and exceptional web experiences tailored to your unique vision."}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-fade-in" style={{
            animationDelay: "700ms",
            animationFillMode: "forwards"
          }}>
              <Button asChild size="lg" className="group relative bg-primary hover:bg-gold-bright text-primary-foreground font-semibold text-lg px-10 py-6 rounded-xl glow-gold transition-all duration-300 hover:scale-105">
                <Link to="/contact">
                  {heroData?.cta_primary || "Start Your Project"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <Link to="/portfolio">{heroData?.cta_secondary || "View Our Work"}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{
            animationDelay: "900ms",
            animationFillMode: "forwards"
          }}>
              {stats.map((stat, index) => <div key={index} className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-1 text-gray-100">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>)}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in" style={{
        animationDelay: "1200ms",
        animationFillMode: "forwards"
      }}>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce-soft" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            icon: Zap,
            title: "Lightning Fast",
            desc: "Quick turnaround without compromising quality"
          }, {
            icon: Star,
            title: "Premium Quality",
            desc: "Pixel-perfect designs that stand out"
          }, {
            icon: Globe,
            title: "Global Reach",
            desc: "Serving clients worldwide with excellence"
          }].map((feature, index) => <div key={index} className="text-center p-6 opacity-0 animate-fade-in-up" style={{
            animationDelay: `${index * 150}ms`,
            animationFillMode: "forwards"
          }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Our Expertise
            </span>
            <h2 className="text-4xl font-heading font-bold mb-6 text-gray-100 md:text-7xl">
              Creative <span className="text-gradient text-gray-100">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {servicesData?.subtitle || "Comprehensive creative solutions tailored to your unique needs and vision"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => <Card key={index} className="group glass border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 opacity-0 animate-fade-in-up overflow-hidden" style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards"
          }}>
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110
                    ${service.accent === 'gold' ? 'bg-gold/10 border border-gold/20' : ''}
                    ${service.accent === 'purple' ? 'bg-purple/10 border border-purple/20' : ''}
                    ${service.accent === 'cyan' ? 'bg-cyan/10 border border-cyan/20' : ''}
                  `}>
                    <service.icon className={`w-10 h-10
                      ${service.accent === 'gold' ? 'text-gold' : ''}
                      ${service.accent === 'purple' ? 'text-purple' : ''}
                      ${service.accent === 'cyan' ? 'text-cyan' : ''}
                    `} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl px-8">
              <Link to="/services" className="group">
                Explore All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden bg-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Client Love
            </span>
            <h2 className="text-4xl font-heading font-bold mb-6 text-gray-200 md:text-5xl">
              What Our <span className="text-gradient text-gray-100">Clients Say</span>
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
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border-gradient">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple/5 to-cyan/5" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                Let's Create Together
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-cyan-500">
                {ctaData?.title || "Ready to Transform"}
                <br />
                <span className="text-gradient">Your Brand?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                {ctaData?.subtitle || "Let's collaborate to create something extraordinary. Get in touch today and let's bring your vision to life."}
              </p>
              <Button asChild size="lg" className="group bg-primary hover:bg-gold-bright text-primary-foreground font-semibold text-lg px-10 py-6 rounded-xl glow-gold transition-all duration-300 hover:scale-105">
                <Link to="/contact">
                  {ctaData?.cta_text || "Get Started Today"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;