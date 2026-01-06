-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-avatars', 'testimonial-avatars', true);

-- Allow anyone to view testimonial avatars (public bucket)
CREATE POLICY "Anyone can view testimonial avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-avatars');

-- Admins can upload testimonial avatars
CREATE POLICY "Admins can upload testimonial avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'testimonial-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update testimonial avatars
CREATE POLICY "Admins can update testimonial avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'testimonial-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete testimonial avatars
CREATE POLICY "Admins can delete testimonial avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'testimonial-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);