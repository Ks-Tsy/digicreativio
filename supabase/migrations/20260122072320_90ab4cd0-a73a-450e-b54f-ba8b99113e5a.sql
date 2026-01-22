-- Create table to track spam/suspicious contact activity
CREATE TABLE public.spam_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  reason text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spam_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view spam logs
CREATE POLICY "Admins can view spam logs"
ON public.spam_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete spam logs
CREATE POLICY "Admins can delete spam logs"
ON public.spam_logs
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index for efficient querying
CREATE INDEX idx_spam_logs_ip ON public.spam_logs (ip_address);
CREATE INDEX idx_spam_logs_created_at ON public.spam_logs (created_at DESC);