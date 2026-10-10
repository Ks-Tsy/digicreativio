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
                  Our journey began with a small team of passionate designers who shared a vision of creating a different kind of creative agency—one that combines artistic excellence with strategic thinking, technical expertise with human-centered design.
                </p>
                <p>
                  Today, we've grown into a full-service digital creative agency, but our core values remain unchanged. We still approach every project with the same enthusiasm and dedication, treating each client's vision as our own.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
