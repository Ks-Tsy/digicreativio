-- Create unique partial index to enforce only one admin account
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_admin ON public.user_roles(role) WHERE role = 'admin';

-- Add database constraints for contact submissions
ALTER TABLE public.contact_submissions 
  ADD CONSTRAINT contact_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT contact_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT contact_message_length CHECK (char_length(message) <= 10000);