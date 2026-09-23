import React from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

export const ContactHeroSection = () => {
  const { content: heroContent } = useSiteContent("contact", "hero");
  const heroData = heroContent?.content_data as { title?: string; subtitle?: string; } | null;

  return (
    <section data-section-id="hero" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Let's Connect
          </span>
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            {heroData?.title || "Get in Touch"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {heroData?.subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life"}
          </p>
        </div>
      </div>
    </section>
  );
};
