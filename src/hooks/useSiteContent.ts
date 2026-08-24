import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Json } from "@/integrations/supabase/types";

interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  content_type: string;
  content_data: Json;
}

import { PAGE_TEMPLATES } from "@/utils/defaultContent";

export const useSiteContent = (pageName: string, sectionName: string) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_name", pageName)
        .eq("section_name", sectionName)
        .single();

      if (!error && data) {
        setContent(data as SiteContent);
      } else {
        // Fallback to default content if not found
        const pageTemplate = PAGE_TEMPLATES[pageName];
        if (pageTemplate) {
            const sectionTemplate = pageTemplate.sections.find(s => s.name === sectionName);
            if (sectionTemplate) {
                const defaultData: Record<string, string> = {};
                sectionTemplate.fields.forEach(f => {
                    defaultData[f.key] = f.value;
                });
                
                const finalData = defaultData;

                setContent({
                    id: `default-${pageName}-${sectionName}`,
                    page_name: pageName,
                    section_name: sectionName,
                    content_type: "text",
                    content_data: finalData as Json
                });
            }
        }
      }
      setLoading(false);
    };

    fetchContent();
  }, [pageName, sectionName]);

  return { content, loading };
};
