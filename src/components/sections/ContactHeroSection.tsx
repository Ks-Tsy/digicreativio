import React from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

export const ContactHeroSection = () => {
  const { content: heroContent } = useSiteContent("contact", "hero");
  const heroData = heroContent?.content_data as { badge?: string; title?: string; subtitle?: string; } | null;

  return (
    <section data-section-id="hero" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span 
            data-editable-field="badge"
            data-field-label="Hero Badge"
            className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
          >
            {heroData?.badge || "Let's Connect"}
          </span>
          <h1 
            data-editable-field="title"
            data-field-label="Page Title"
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            {heroData?.title || "Get in Touch"}
          </h1>
          <p 
            data-editable-field="subtitle"
            data-field-label="Page Subtitle"
            data-field-type="textarea"
            className="text-xl text-muted-foreground leading-relaxed"
          >
            {heroData?.subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life"}
          </p>
        </div>
      </div>
    </section>
  );
};
