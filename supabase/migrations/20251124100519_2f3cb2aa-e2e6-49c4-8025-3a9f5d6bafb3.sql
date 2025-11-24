-- Create social_links table for managing social media links
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active social links" 
ON public.social_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage social links" 
ON public.social_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon_name, display_order) VALUES
  ('Facebook', 'https://facebook.com', 'Facebook', 1),
  ('Instagram', 'https://instagram.com', 'Instagram', 2),
  ('LinkedIn', 'https://linkedin.com', 'Linkedin', 3),
  ('Twitter', 'https://twitter.com', 'Twitter', 4);