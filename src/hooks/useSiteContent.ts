import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  content_type: string;
  content_data: Json;
}

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
      }
      setLoading(false);
    };

    fetchContent();
  }, [pageName, sectionName]);

  return { content, loading };
};
