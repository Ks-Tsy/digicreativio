-- Create site_content table for managing page content
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name text NOT NULL,
  section_name text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  content_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_name)
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Anyone can view site content'
  ) THEN
    ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Anyone can view site content"
      ON public.site_content
      FOR SELECT
      USING (true);

    CREATE POLICY "Admins can manage site content"
      ON public.site_content
      FOR ALL
      USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Create trigger for updated_at if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_content_updated_at'
  ) THEN
    CREATE TRIGGER update_site_content_updated_at
      BEFORE UPDATE ON public.site_content
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Insert or update default content
INSERT INTO public.site_content (page_name, section_name, content_type, content_data) VALUES
  ('home', 'hero', 'json', '{"title": "Elevate Your Brand with Digital Creativity", "subtitle": "We craft stunning digital experiences that inspire, engage, and drive results for your business.", "cta_primary": "Start Your Project", "cta_secondary": "View Our Work"}'::jsonb),
  ('home', 'services_section', 'json', '{"title": "Our Services", "subtitle": "Comprehensive creative solutions tailored to your unique needs"}'::jsonb),
  ('home', 'cta_section', 'json', '{"title": "Ready to Transform Your Brand?", "subtitle": "Let''s collaborate to create something extraordinary. Get in touch today and let''s bring your vision to life.", "cta_text": "Get Started Today"}'::jsonb),
  ('about', 'hero', 'json', '{"title": "About DigiCreativio", "subtitle": "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact."}'::jsonb),
  ('about', 'story', 'json', '{"title": "Our Story", "content": "DigiCreativio was born from a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. Since our founding, we''ve been committed to pushing the boundaries of creativity while delivering practical, results-driven solutions."}'::jsonb),
  ('services', 'hero', 'json', '{"title": "Our Services", "subtitle": "Comprehensive creative solutions designed to help your business thrive in the digital landscape"}'::jsonb),
  ('services', 'cta', 'json', '{"title": "Ready to Get Started?", "subtitle": "Let''s discuss your project and create something amazing together", "cta_text": "Contact Us Today"}'::jsonb),
  ('contact', 'hero', 'json', '{"title": "Get in Touch", "subtitle": "Have a project in mind? Let''s discuss how we can help bring your vision to life"}'::jsonb),
  ('contact', 'info', 'json', '{"email": "hello@digicreativio.com", "phone": "+1 (234) 567-890", "address": "123 Creative Street, Design City, DC 12345"}'::jsonb),
  ('settings', 'general', 'json', '{"site_name": "DigiCreativio", "tagline": "Digital Creative Solutions", "description": "Professional digital design and creative services", "admin_email": "admin@digicreativio.com"}'::jsonb)
ON CONFLICT (page_name, section_name) DO UPDATE 
  SET content_data = EXCLUDED.content_data, updated_at = now();

-- Create site_settings table for configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  setting_type text NOT NULL DEFAULT 'general',
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for site_settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Anyone can view site settings'
  ) THEN
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can view site settings"
      ON public.site_settings
      FOR SELECT
      USING (true);

    CREATE POLICY "Admins can manage site settings"
      ON public.site_settings
      FOR ALL
      USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Create trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_site_settings_updated_at
      BEFORE UPDATE ON public.site_settings
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('maintenance_mode', '{"enabled": false}'::jsonb, 'general', 'Enable maintenance mode for the site'),
  ('contact_email', '{"value": "hello@digicreativio.com"}'::jsonb, 'contact', 'Primary contact email'),
  ('social_links', '{"facebook": "", "twitter": "", "instagram": "", "linkedin": ""}'::jsonb, 'social', 'Social media links'),
  ('analytics', '{"google_analytics_id": "", "enabled": false}'::jsonb, 'tracking', 'Analytics configuration')
ON CONFLICT (setting_key) DO NOTHING;