import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users, Sparkles, Rocket, Heart, Shield } from "lucide-react";
import { AboutHeroSection } from "@/components/sections/AboutHeroSection";
import { AboutStorySection } from "@/components/sections/AboutStorySection";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
  const { content: capContent } = useSiteContent("about", "capabilities");
  const { content: valContent } = useSiteContent("about", "values");
  const { content: teamContent } = useSiteContent("about", "team");

  const capData = (capContent?.content_data as any) || {};
  const valData = (valContent?.content_data as any) || {};
  const teamData = (teamContent?.content_data as any) || {};

  const values = [
    {
      icon: Target,
      defaultTitle: "Our Mission",
      defaultDesc: "To empower businesses and creators with exceptional digital design solutions that drive success and inspire audiences.",
      titleKey: "val_1_title",
      descKey: "val_1_desc",
      label: "Value 1",
    },
    {
      icon: Eye,
      defaultTitle: "Our Vision",
      defaultDesc: "To be the leading creative agency recognized for innovation, quality, and transformative digital experiences.",
      titleKey: "val_2_title",
      descKey: "val_2_desc",
      label: "Value 2",
    },
    {
      icon: Award,
      defaultTitle: "Excellence",
      defaultDesc: "We pursue excellence in every project, delivering work that exceeds expectations and sets new standards.",
      titleKey: "val_3_title",
      descKey: "val_3_desc",
      label: "Value 3",
    },
    {
      icon: Users,
      defaultTitle: "Collaboration",
      defaultDesc: "We believe in the power of partnership, working closely with clients to achieve their goals and realize their vision.",
      titleKey: "val_4_title",
      descKey: "val_4_desc",
      label: "Value 4",
    },
  ];

  const capabilities = [
    { icon: Sparkles, key: "cap_1", defaultLabel: "Creative Strategy", label: "Capability 1" },
    { icon: Rocket, key: "cap_2", defaultLabel: "Fast Delivery", label: "Capability 2" },
    { icon: Heart, key: "cap_3", defaultLabel: "Client Focus", label: "Capability 3" },
    { icon: Shield, key: "cap_4", defaultLabel: "Quality Assurance", label: "Capability 4" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <AboutHeroSection />

      {/* Capabilities Bar */}
      <section data-section-id="capabilities" className="py-8 border-y border-[#111111] bg-[#090909]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {capabilities.map((cap) => (
              <div key={cap.key} className="flex items-center gap-3 text-[#858585]">
                <cap.icon className="w-5 h-5 text-[#D4AF37]" />
                <span 
                  data-editable-field={cap.key}
                  data-field-label={cap.label}
                  className="text-sm font-medium"
                >
                  {capData[cap.key] || cap.defaultLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <AboutStorySection />

      {/* Values Section */}
      <section data-section-id="values" className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span 
              data-editable-field="badge"
              data-field-label="Values Badge"
              className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
            >
              {valData.badge || "Our Foundation"}
            </span>
            <h2 
              data-editable-field="title"
              data-field-label="Values Title"
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              {valData.title || "What We Stand For"}
            </h2>
            <p 
              data-editable-field="subtitle"
              data-field-label="Values Subtitle"
              data-field-type="textarea"
              className="text-xl text-[#858585] max-w-2xl mx-auto"
            >
              {valData.subtitle || "Our values guide everything we do and shape the way we work with our clients"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const currentTitle = valData[value.titleKey] || value.defaultTitle;
              const currentDesc = valData[value.descKey] || value.defaultDesc;

              return (
                <Card
                  key={index}
                  className="group bg-[#090909] border-[#111111] hover:border-[#D4AF37]/30 transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#111111] mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <h3 
                      data-editable-field={value.titleKey}
                      data-field-label={`${value.label} Title`}
                      className="text-2xl font-heading font-semibold mb-4 text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors"
                    >
                      {currentTitle}
                    </h3>
                    <p 
                      data-editable-field={value.descKey}
                      data-field-label={`${value.label} Description`}
                      data-field-type="textarea"
                      className="text-[#858585] leading-relaxed"
                    >
                      {currentDesc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section data-section-id="team" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span 
              data-editable-field="badge"
              data-field-label="Team Badge"
              className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
            >
              {teamData.badge || "The Team"}
            </span>
            <h2 
              data-editable-field="title"
              data-field-label="Team Title"
              className="text-4xl md:text-5xl font-heading font-bold mb-8"
            >
              {teamData.title || "Meet Our Creative Team"}
            </h2>
            <p 
              data-editable-field="subtitle"
              data-field-label="Team Subtitle"
              data-field-type="textarea"
              className="text-xl text-[#858585] mb-12 leading-relaxed"
            >
              {teamData.subtitle || "A diverse group of talented individuals united by a passion for creativity and innovation. Our team brings together expertise in design, technology, and strategy to deliver exceptional results."}
            </p>
            <Card className="bg-[#090909] border-[#111111]">
              <CardContent className="p-10 md:p-14">
                <p 
                  data-editable-field="card_content"
                  data-field-label="Team Card Text"
                  data-field-type="textarea"
                  className="text-lg text-[#F5F5F5] leading-relaxed"
                >
                  {teamData.card_content || "With years of combined experience across various industries, our team has the knowledge and skills to tackle any creative challenge. We stay at the forefront of design trends and technologies, ensuring that our clients always receive cutting-edge solutions that give them a competitive advantage."}
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
