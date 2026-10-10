import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Code, Video, ArrowRight, CheckCircle2 } from "lucide-react";
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
      id: "01",
      icon: Palette,
      title: "Graphic Design",
      description: "Transform your brand's vision into striking visual content. We design identities, social creatives, and marketing materials that capture attention and communicate your message with impact.",
      features: ["Brand Identity & Logos", "Marketing Materials", "Social Media Creatives", "Editorial Design"],
    },
    {
      id: "02",
      icon: Code,
      title: "Web Development",
      description: "Modern, high-performance websites and digital experiences. We build responsive, scalable, and beautiful platforms that drive engagement and conversions.",
      features: ["Responsive Web Design", "UI/UX Architecture", "E-commerce Solutions", "Custom Web Applications"],
    },
    {
      id: "03",
      icon: Video,
      title: "Video Editing",
      description: "Compelling visual storytelling through motion. We produce and edit engaging content, promotional videos, and dynamic reels that captivate your audience.",
      features: ["Promotional Videos", "Motion Graphics", "Social Media Reels", "Post-Production & Color Grading"],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <ServicesHeroSection />

      {/* Services Editorial Section */}
      <section data-section-id="services_grid" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 
              data-editable-field="title"
              data-field-label="Grid Title"
              className="text-4xl md:text-5xl font-heading font-bold mb-6 text-[#F5F5F5]"
            >
              {gridData.title || "Our Expertise"}
            </h2>
            <p className="text-xl text-[#858585] leading-relaxed">
              We combine creative strategy with technical precision to deliver solutions that elevate your brand.
            </p>
          </div>

          <div className="space-y-32 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const serviceNum = index + 1;
              const currentTitle = gridData[`service_${serviceNum}_title`] || service.title;
              const currentDesc = gridData[`service_${serviceNum}_desc`] || service.description;
              const isEven = index % 2 === 1;

              return (
                <div key={service.id} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 group`}>
                  {/* Visual Detail */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#090909] border border-[#111111] group-hover:border-[#D4AF37]/30 transition-colors duration-500 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative z-10 w-32 h-32 rounded-full bg-[#111111] border border-[#111111] flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-110">
                        <service.icon className="w-12 h-12 text-[#D4AF37]" />
                      </div>
                      <div className="absolute bottom-6 left-8 font-mono text-8xl font-bold text-[#111111] opacity-50 z-0 select-none">
                        {service.id}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-8">
                    <div>
                      <span className="inline-block font-mono text-[#D4AF37] mb-4 text-sm tracking-widest uppercase">
                        Service {service.id}
                      </span>
                      <h3 
                        data-editable-field={`service_${serviceNum}_title`}
                        data-field-label={`Service ${serviceNum} Title`}
                        className="text-4xl md:text-5xl font-heading font-bold text-[#F5F5F5] mb-6"
                      >
                        {currentTitle}
                      </h3>
                      <p 
                        data-editable-field={`service_${serviceNum}_desc`}
                        data-field-label={`Service ${serviceNum} Description`}
                        data-field-type="textarea"
                        className="text-lg text-[#858585] leading-relaxed"
                      >
                        {currentDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                          <span className="text-[#E5E5E5] font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button asChild variant="outline" className="rounded-full border-[#111111] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#F5F5F5] h-12 px-8">
                        <Link to="/contact">
                          Discuss a Project
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-section-id="cta" className="py-24 bg-[#050505] border-t border-[#111111]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-[#090909] rounded-3xl p-12 md:p-16 border border-[#111111] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
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
                {ctaData?.title || "Ready to Build What's Next?"}
              </h2>
              <p 
                data-editable-field="subtitle"
                data-field-label="CTA Subtitle"
                data-field-type="textarea"
                className="text-xl text-[#858585] mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                {ctaData?.subtitle || "Let's discuss your vision and create something amazing together."}
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
        </div>
      </section>
    </div>
  );
};

export default Services;
