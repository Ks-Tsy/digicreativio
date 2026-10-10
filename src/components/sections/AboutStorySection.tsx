import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useSiteContent } from '@/hooks/useSiteContent';

export const AboutStorySection = () => {
  const { content: storyContent } = useSiteContent("about", "story");
  const storyData = storyContent?.content_data as { badge?: string; title?: string; content?: string; } | null;

  return (
    <section data-section-id="story" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#090909] border-[#111111]">
            <CardContent className="p-10 md:p-14">
              <div
                data-editable-field="badge"
                data-field-label="Story Badge"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium mb-6"
              >
                <Sparkles className="w-3 h-3" />
                <span>{storyData?.badge || "Our Journey"}</span>
              </div>
              <h2
                data-editable-field="title"
                data-field-label="Story Title"
                className="text-4xl font-heading font-bold mb-8"
              >
                {storyData?.title || "Our Story"}
              </h2>
              <div className="space-y-6 text-[#858585] leading-relaxed text-lg">
                <p
                  data-editable-field="content"
                  data-field-label="Story Content"
                  data-field-type="textarea"
                >
                  {storyData?.content || "DigiCreativio was born from a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. Since our founding, we've been committed to pushing the boundaries of creativity while delivering practical, results-driven solutions."}
                </p>
                <p>
                  Our journey began with a focus on graphic design, but we quickly realized that true digital impact requires a seamless blend of disciplines. Today, we bridge the gap between aesthetics and functionality, ensuring that every project not only looks beautiful but also performs flawlessly.
                </p>
                <p>
                  At DigiCreativio, we believe that design, web development, and video editing are not separate services—they are interconnected facets of a single, unified brand experience. By combining these core disciplines, we craft comprehensive digital solutions that resonate with audiences and drive real results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
