import React from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

export const AboutHeroSection = () => {
  const { content: heroContent } = useSiteContent("about", "hero");
  const heroData = heroContent?.content_data as { title?: string; subtitle?: string; } | null;

  return (
    <section data-section-id="hero" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Who We Are
          </span>
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            {heroData?.title || "About DigiCreativio"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {heroData?.subtitle || "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact."}
          </p>
        </div>
      </div>
    </section>
  );
};
