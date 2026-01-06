-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view active testimonials
CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials
FOR SELECT
USING (is_active = true);

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, display_order) VALUES
('Sarah Johnson', 'Marketing Director', 'TechStart Inc', 'DigiCreativio transformed our brand completely. Their creative approach and attention to detail exceeded all our expectations. The team delivered on time and the results speak for themselves.', 5, 1),
('Michael Chen', 'Founder & CEO', 'InnovateLab', 'Working with DigiCreativio was an absolute pleasure. They understood our vision from day one and created a digital presence that truly represents our innovative spirit.', 5, 2),
('Emily Rodriguez', 'Brand Manager', 'StyleCraft', 'The team at DigiCreativio brought fresh perspectives and incredible creativity to our project. Our engagement rates have increased by 300% since the rebrand.', 5, 3),
('David Kim', 'Operations Director', 'GrowthFlow', 'Professional, creative, and incredibly talented. DigiCreativio delivered a website that not only looks stunning but also converts visitors into customers.', 5, 4),
('Lisa Thompson', 'Creative Director', 'Artisan Studios', 'I have worked with many agencies, but DigiCreativio stands out for their genuine passion and commitment to excellence. They truly care about their clients success.', 5, 5),
('James Wilson', 'Head of Digital', 'NextGen Media', 'From concept to execution, DigiCreativio demonstrated exceptional skill and professionalism. They are now our go-to partner for all creative projects.', 5, 6);