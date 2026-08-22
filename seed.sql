-- SQL Script to seed site_content
-- Run this in the Supabase SQL Editor

INSERT INTO public.site_content (page_name, section_name, content_type, content_data) VALUES
('home', 'hero', 'text', '{"title": "Crafting Digital Experiences That Inspire", "subtitle": "We are a creative agency dedicated to building exceptional digital products, brands, and experiences that resonate with your audience.", "cta_primary": "Start a Project", "cta_secondary": "View Our Work"}'),
('home', 'services_section', 'text', '{"title": "Our Capabilities", "subtitle": "We offer a comprehensive suite of digital services to help your business grow and succeed in the modern landscape."}'),
('home', 'cta_section', 'text', '{"title": "Ready to Start Your Project?", "subtitle": "Let''s work together to create something amazing. Our team of experts is ready to bring your vision to life.", "cta_text": "Get in Touch"}'),
('about', 'hero', 'text', '{"title": "About Us", "subtitle": "We are a team of passionate designers, developers, and strategists dedicated to creating exceptional digital experiences."}'),
('about', 'story', 'text', '{"title": "Our Story", "content": "Founded with a vision to redefine digital creativity, we''ve spent years honing our craft and building a team of exceptional talent. We believe in the power of design to solve complex problems and connect with people on a deeper level."}'),
('services', 'hero', 'text', '{"title": "Our Services", "subtitle": "Comprehensive digital solutions tailored to your unique business needs and goals."}'),
('services', 'cta', 'text', '{"title": "Need Custom Solutions?", "subtitle": "We can tailor our services to meet your specific business requirements and objectives.", "cta_text": "Contact Us Today"}'),
('contact', 'hero', 'text', '{"title": "Get in Touch", "subtitle": "Have a project in mind? We''d love to hear from you. Reach out to our team to start the conversation."}'),
('contact', 'info', 'text', '{"email": "hello@digicreativio.com", "phone": "+1 (555) 123-4567", "address": "123 Creative Street\nInnovation City, Tech 10010\nUnited States"}')
ON CONFLICT DO NOTHING;
