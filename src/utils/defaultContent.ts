export const PAGE_TEMPLATES: Record<string, { label: string; sections: { name: string; fields: { key: string; label: string; type: "text" | "textarea" | "url" | "image"; value: string; }[] }[] }> = {
  home: {
    label: "Home Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "title", label: "Main Title", type: "text", value: "Crafting Digital Experiences That Inspire" },
          { key: "subtitle", label: "Subtitle", type: "textarea", value: "We are a creative agency dedicated to building exceptional digital products, brands, and experiences that resonate with your audience." },
          { key: "cta_primary", label: "Primary Button Text", type: "text", value: "Start a Project" },
          { key: "cta_secondary", label: "Secondary Button Text", type: "text", value: "View Our Work" },
        ]
      },
      {
        name: "services_section",
        fields: [
          { key: "title", label: "Section Title", type: "text", value: "Our Capabilities" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", value: "We offer a comprehensive suite of digital services to help your business grow and succeed in the modern landscape." },
        ]
      },
      {
        name: "cta_section",
        fields: [
          { key: "title", label: "CTA Title", type: "text", value: "Ready to Start Your Project?" },
          { key: "subtitle", label: "CTA Description", type: "textarea", value: "Let's work together to create something amazing. Our team of experts is ready to bring your vision to life." },
          { key: "cta_text", label: "Button Text", type: "text", value: "Get in Touch" },
        ]
      }
    ]
  },
  about: {
    label: "About Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "title", label: "Page Title", type: "text", value: "About Us" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "We are a team of passionate designers, developers, and strategists dedicated to creating exceptional digital experiences." },
        ]
      },
      {
        name: "story",
        fields: [
          { key: "title", label: "Story Title", type: "text", value: "Our Story" },
          { key: "content", label: "Story Content", type: "textarea", value: "Founded with a vision to redefine digital creativity, we've spent years honing our craft and building a team of exceptional talent. We believe in the power of design to solve complex problems and connect with people on a deeper level." },
        ]
      }
    ]
  },
  services: {
    label: "Services Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "title", label: "Page Title", type: "text", value: "Our Services" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Comprehensive digital solutions tailored to your unique business needs and goals." },
        ]
      }
    ]
  },
  contact: {
    label: "Contact Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "title", label: "Page Title", type: "text", value: "Get in Touch" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Have a project in mind? We'd love to hear from you. Reach out to our team to start the conversation." },
        ]
      },
      {
        name: "info",
        fields: [
          { key: "email", label: "Contact Email", type: "text", value: "hello@digicreativio.com" },
          { key: "phone", label: "Phone Number", type: "text", value: "+1 (555) 123-4567" },
          { key: "address", label: "Address", type: "textarea", value: "123 Creative Street\nInnovation City, Tech 10010\nUnited States" },
        ]
      }
    ]
  }
};
