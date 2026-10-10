import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Sparkles, Code, Image, Video, Layers, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ServicesHeroSection } from "@/components/sections/ServicesHeroSection";

const Services = () => {
  const { content: ctaContent } = useSiteContent("services", "cta");
  const { content: gridContent } = useSiteContent("services", "services_grid");

  const ctaData = ctaContent?.content_data as {
    badge?: string;
    title?: string;
    subtitle?: string;
    cta_text?: string;
  } | null;

  const gridData = (gridContent?.content_data as any) || {};

  const services = [
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Transform your ideas into stunning visual content that captures attention and communicates your message with impact.",
      features: ["Marketing Materials", "Social Media Graphics", "Print Design", "Infographics", "Presentations"],
      popular: false,
    },
    {
      icon: Sparkles,
      title: "Logo Design",
      description: "Create a unique and memorable brand identity with a professionally designed logo that represents your business perfectly.",
      features: ["Custom Logo Concepts", "Multiple Revisions", "Vector Files", "Brand Guidelines", "Social Media Kit"],
      popular: true,
    },
    {
      icon: Layers,
      title: "Branding",
      description: "Build a cohesive brand identity that resonates with your target audience and sets you apart from the competition.",
      features: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Color Palette", "Typography System"],
      popular: false,
    },
    {
      icon: Code,
      title: "Web Design",
      description: "Beautiful, responsive websites that deliver exceptional user experiences and drive conversions for your business.",
      features: ["Responsive Design", "UI/UX Design", "Prototyping", "User Testing", "Mobile Optimization"],
      popular: true,
    },
    {
      icon: Image,
      title: "Digital Art",
      description: "Custom digital artwork and illustrations that bring your creative vision to life with unique, eye-catching visuals.",
      features: ["Digital Illustrations", "Character Design", "Concept Art", "Digital Painting", "Custom Artwork"],
      popular: false,
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing services to create engaging content that tells your story and captivates your audience.",
      features: ["Video Production", "Motion Graphics", "Color Grading", "Sound Design", "Post-Production"],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <ServicesHeroSection />

      {/* Services Grid */}
      <section data-section-id="services_grid" className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              data-editable-field="title"
              data-field-label="Grid Title"
              className="text-4xl md:text-5xl font-heading font-bold"
            >
              {gridData.title || "What We Do"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const serviceNum = index + 1;
              const currentTitle = gridData[`service_${serviceNum}_title`] || service.title;
              const currentDesc = gridData[`service_${serviceNum}_desc`] || service.description;

              return (
                <Card
                  key={index}
                  className="group bg-[#090909] border-[#111111] hover:border-[#D4AF37]/30 transition-all duration-300 relative"
                >
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111111] text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-medium">
                        <Star className="w-3 h-3 fill-[#D4AF37]" />
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#111111] mb-6 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    
                    <h3 
                      data-editable-field={`service_${serviceNum}_title`}
                      data-field-label={`Service ${serviceNum} Title`}
                      className="text-2xl font-heading font-bold mb-4 text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors"
                    >
                      {currentTitle}
                    </h3>
                    <p 
                      data-editable-field={`service_${serviceNum}_desc`}
                      data-field-label={`Service ${serviceNum} Description`}
                      data-field-type="textarea"
                      className="text-[#858585] mb-6 leading-relaxed"
                    >
                      {currentDesc}
                    </p>
                    
                    <div className="space-y-2 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                          <span className="text-[#858585]">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild variant="outline" className="w-full rounded-full border-[#111111] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#F5F5F5]">
                      <Link to="/contact">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-section-id="cta" className="py-24 bg-[#050505] border-t border-[#111111]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-[#090909] rounded-3xl p-12 md:p-16 border border-[#111111]">
            <span 
              data-editable-field="badge"
              data-field-label="CTA Badge"
              className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
            >
              {ctaData?.badge || "Start Your Project"}
            </span>
            <h2 
              data-editable-field="title"
              data-field-label="CTA Title"
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              {ctaData?.title || "Ready to Get Started?"}
            </h2>
            <p 
              data-editable-field="subtitle"
              data-field-label="CTA Subtitle"
              data-field-type="textarea"
              className="text-xl text-[#858585] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {ctaData?.subtitle || "Let's discuss your project and create something amazing together"}
            </p>
            <Button asChild size="lg" className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] font-semibold rounded-full px-10 h-14">
              <Link to="/contact">
                <span data-editable-field="cta_text" data-field-label="Button Text">
                  {ctaData?.cta_text || "Contact Us Today"}
                </span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
