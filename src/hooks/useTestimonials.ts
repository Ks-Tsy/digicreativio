import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setTestimonials(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { testimonials, loading, error, refetch: fetchTestimonials };
}
