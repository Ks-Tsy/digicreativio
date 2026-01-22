-- Tighten public INSERT policy on contact_submissions to avoid overly-permissive (true) checks
-- while still allowing unauthenticated contact form submissions.

BEGIN;

DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;

CREATE POLICY "Public can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 2 AND 100
  AND length(trim(email)) BETWEEN 3 AND 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND length(trim(message)) BETWEEN 10 AND 5000
  AND status = 'new'
);

COMMIT;