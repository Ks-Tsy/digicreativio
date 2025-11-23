-- Create storage bucket for portfolio items
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for portfolio files bucket
CREATE POLICY "Anyone can view portfolio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-files');

CREATE POLICY "Admins can upload portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update portfolio files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete portfolio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);