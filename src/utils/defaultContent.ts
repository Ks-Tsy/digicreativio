export const PAGE_TEMPLATES: Record<string, { label: string; sections: { name: string; fields: { key: string; label: string; type: "text" | "textarea" | "url" | "image"; value: string; }[] }[] }> = {
  home: {
    label: "Home Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "logo_url", label: "Hero Logo Image", type: "image", value: "" },
          { key: "title", label: "Main Title", type: "text", value: "Crafting Digital Experiences That Inspire" },
          { key: "subtitle", label: "Subtitle", type: "textarea", value: "We are a creative agency dedicated to building exceptional digital products, brands, and experiences that resonate with your audience." },
          { key: "cta_primary", label: "Primary Button Text", type: "text", value: "Start a Project" },
          { key: "cta_secondary", label: "Secondary Button Text", type: "text", value: "View Our Work" },
        ]
      },
      {
        name: "services_section",
        fields: [
          { key: "title", label: "Section Title", type: "text", value: "Capabilities" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", value: "We blend art and engineering to create digital products that stand out in the void." },
          { key: "item_1_title", label: "Service 1 Title", type: "text", value: "Digital Experience" },
          { key: "item_1_desc", label: "Service 1 Description", type: "textarea", value: "Immersive websites and web applications that captivate users." },
          { key: "item_2_title", label: "Service 2 Title", type: "text", value: "Brand Identity" },
          { key: "item_2_desc", label: "Service 2 Description", type: "textarea", value: "Strategic visual systems that elevate your market presence." },
          { key: "item_3_title", label: "Service 3 Title", type: "text", value: "Motion Design" },
          { key: "item_3_desc", label: "Service 3 Description", type: "textarea", value: "Fluid animations that bring your digital products to life." },
          { key: "item_4_title", label: "Service 4 Title", type: "text", value: "3D Interactions" },
          { key: "item_4_desc", label: "Service 4 Description", type: "textarea", value: "Spatial computing and 3D web experiences." },
        ]
      },
      {
        name: "portfolio_section",
        fields: [
          { key: "title_normal", label: "Title Part 1", type: "text", value: "Selected" },
          { key: "title_italic", label: "Title Part 2 (Italic)", type: "text", value: "Work" },
          { key: "proj_1_title", label: "Project 1 Title", type: "text", value: "Aura" },
          { key: "proj_1_cat", label: "Project 1 Category", type: "text", value: "Web Experience" },
          { key: "proj_1_img", label: "Project 1 Image URL", type: "image", value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
          { key: "proj_2_title", label: "Project 2 Title", type: "text", value: "Nebula" },
          { key: "proj_2_cat", label: "Project 2 Category", type: "text", value: "Brand Identity" },
          { key: "proj_2_img", label: "Project 2 Image URL", type: "image", value: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" },
          { key: "proj_3_title", label: "Project 3 Title", type: "text", value: "Chroma" },
          { key: "proj_3_cat", label: "Project 3 Category", type: "text", value: "Motion Design" },
          { key: "proj_3_img", label: "Project 3 Image URL", type: "image", value: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop" },
          { key: "proj_4_title", label: "Project 4 Title", type: "text", value: "Void" },
          { key: "proj_4_cat", label: "Project 4 Category", type: "text", value: "3D Interaction" },
          { key: "proj_4_img", label: "Project 4 Image URL", type: "image", value: "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
        ]
      },
      {
        name: "contact_section",
        fields: [
          { key: "title", label: "Section Title", type: "text", value: "Let's Talk" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", value: "Ready to start your next project? Drop us a signal." },
          { key: "button_text", label: "Button Text", type: "text", value: "Send Message" },
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
          { key: "badge", label: "Hero Badge", type: "text", value: "Who We Are" },
          { key: "title", label: "Page Title", type: "text", value: "About DigiCreativio" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact." },
        ]
      },
      {
        name: "capabilities",
        fields: [
          { key: "cap_1", label: "Capability 1", type: "text", value: "Creative Strategy" },
          { key: "cap_2", label: "Capability 2", type: "text", value: "Fast Delivery" },
          { key: "cap_3", label: "Capability 3", type: "text", value: "Client Focus" },
          { key: "cap_4", label: "Capability 4", type: "text", value: "Quality Assurance" },
        ]
      },
      {
        name: "story",
        fields: [
          { key: "badge", label: "Story Badge", type: "text", value: "Our Journey" },
          { key: "title", label: "Story Title", type: "text", value: "Our Story" },
          { key: "content", label: "Story Content", type: "textarea", value: "DigiCreativio was born from a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. Since our founding, we've been committed to pushing the boundaries of creativity while delivering practical, results-driven solutions." },
        ]
      },
      {
        name: "values",
        fields: [
          { key: "badge", label: "Values Badge", type: "text", value: "Our Foundation" },
          { key: "title", label: "Values Title", type: "text", value: "What We Stand For" },
          { key: "subtitle", label: "Values Subtitle", type: "textarea", value: "Our values guide everything we do and shape the way we work with our clients" },
          { key: "val_1_title", label: "Value 1 Title", type: "text", value: "Our Mission" },
          { key: "val_1_desc", label: "Value 1 Description", type: "textarea", value: "To empower businesses and creators with exceptional digital design solutions that drive success and inspire audiences." },
          { key: "val_2_title", label: "Value 2 Title", type: "text", value: "Our Vision" },
          { key: "val_2_desc", label: "Value 2 Description", type: "textarea", value: "To be the leading creative agency recognized for innovation, quality, and transformative digital experiences." },
          { key: "val_3_title", label: "Value 3 Title", type: "text", value: "Excellence" },
          { key: "val_3_desc", label: "Value 3 Description", type: "textarea", value: "We pursue excellence in every project, delivering work that exceeds expectations and sets new standards." },
          { key: "val_4_title", label: "Value 4 Title", type: "text", value: "Collaboration" },
          { key: "val_4_desc", label: "Value 4 Description", type: "textarea", value: "We believe in the power of partnership, working closely with clients to achieve their goals and realize their vision." },
        ]
      },
      {
        name: "team",
        fields: [
          { key: "badge", label: "Team Badge", type: "text", value: "The Team" },
          { key: "title", label: "Team Title", type: "text", value: "Meet Our Creative Team" },
          { key: "subtitle", label: "Team Subtitle", type: "textarea", value: "A diverse group of talented individuals united by a passion for creativity and innovation. Our team brings together expertise in design, technology, and strategy to deliver exceptional results." },
          { key: "card_content", label: "Team Card Text", type: "textarea", value: "With years of combined experience across various industries, our team has the knowledge and skills to tackle any creative challenge. We stay at the forefront of design trends and technologies, ensuring that our clients always receive cutting-edge solutions that give them a competitive advantage." },
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
          { key: "badge", label: "Hero Badge", type: "text", value: "What We Offer" },
          { key: "title", label: "Page Title", type: "text", value: "Our Services" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Comprehensive creative solutions designed to help your business thrive in the digital landscape" },
        ]
      },
      {
        name: "services_grid",
        fields: [
          { key: "title", label: "Grid Title", type: "text", value: "What We Do" },
          { key: "service_1_title", label: "Service 1 Title", type: "text", value: "Graphic Design" },
          { key: "service_1_desc", label: "Service 1 Description", type: "textarea", value: "Transform your ideas into stunning visual content that captures attention and communicates your message with impact." },
          { key: "service_2_title", label: "Service 2 Title", type: "text", value: "Logo Design" },
          { key: "service_2_desc", label: "Service 2 Description", type: "textarea", value: "Create a unique and memorable brand identity with a professionally designed logo that represents your business perfectly." },
          { key: "service_3_title", label: "Service 3 Title", type: "text", value: "Branding" },
          { key: "service_3_desc", label: "Service 3 Description", type: "textarea", value: "Build a cohesive brand identity that resonates with your target audience and sets you apart from the competition." },
          { key: "service_4_title", label: "Service 4 Title", type: "text", value: "Web Design" },
          { key: "service_4_desc", label: "Service 4 Description", type: "textarea", value: "Beautiful, responsive websites that deliver exceptional user experiences and drive conversions for your business." },
          { key: "service_5_title", label: "Service 5 Title", type: "text", value: "Digital Art" },
          { key: "service_5_desc", label: "Service 5 Description", type: "textarea", value: "Custom digital artwork and illustrations that bring your creative vision to life with unique, eye-catching visuals." },
          { key: "service_6_title", label: "Service 6 Title", type: "text", value: "Video Editing" },
          { key: "service_6_desc", label: "Service 6 Description", type: "textarea", value: "Professional video editing services to create engaging content that tells your story and captivates your audience." },
        ]
      },
      {
        name: "cta",
        fields: [
          { key: "badge", label: "CTA Badge", type: "text", value: "Start Your Project" },
          { key: "title", label: "CTA Title", type: "text", value: "Ready to Get Started?" },
          { key: "subtitle", label: "CTA Subtitle", type: "textarea", value: "Let's discuss your project and create something amazing together" },
          { key: "cta_text", label: "Button Text", type: "text", value: "Contact Us Today" },
        ]
      }
    ]
  },
  portfolio: {
    label: "Portfolio Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "badge", label: "Hero Badge", type: "text", value: "Our Work" },
          { key: "title", label: "Page Title", type: "text", value: "Our Portfolio" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Explore our collection of creative projects that showcase our expertise and passion for exceptional design" },
        ]
      },
      {
        name: "cta",
        fields: [
          { key: "badge", label: "CTA Badge", type: "text", value: "Start a Project" },
          { key: "title", label: "CTA Title", type: "text", value: "Have a Project in Mind?" },
          { key: "subtitle", label: "CTA Subtitle", type: "textarea", value: "Let's collaborate to create something truly exceptional. Reach out to discuss your ideas." },
          { key: "button_text", label: "Button Text", type: "text", value: "Get in Touch" },
        ]
      }
    ]
  },
  blog: {
    label: "Blog Page",
    sections: [
      {
        name: "hero",
        fields: [
          { key: "badge", label: "Hero Badge", type: "text", value: "Our Blog" },
          { key: "title", label: "Page Title", type: "text", value: "Insights & Updates" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Insights, tutorials, and updates from our team" },
        ]
      },
      {
        name: "newsletter",
        fields: [
          { key: "badge", label: "Badge", type: "text", value: "Newsletter" },
          { key: "title", label: "Section Title", type: "text", value: "Stay in the Loop" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", value: "Subscribe to our newsletter to receive the latest updates, design tips, and industry trends directly to your inbox." },
          { key: "button_text", label: "Button Text", type: "text", value: "Subscribe" },
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
          { key: "badge", label: "Hero Badge", type: "text", value: "Let's Connect" },
          { key: "title", label: "Page Title", type: "text", value: "Get in Touch" },
          { key: "subtitle", label: "Page Subtitle", type: "textarea", value: "Have a project in mind? Let's discuss how we can help bring your vision to life" },
        ]
      },
      {
        name: "info",
        fields: [
          { key: "email", label: "Contact Email", type: "text", value: "hello@digicreativio.com" },
          { key: "phone", label: "Phone Number", type: "text", value: "+1 (555) 123-4567" },
          { key: "address", label: "Address", type: "textarea", value: "123 Creative Street\nInnovation City, Tech 10010\nUnited States" },
          { key: "form_title", label: "Form Title", type: "text", value: "Send us a Message" },
          { key: "form_subtitle", label: "Form Subtitle", type: "textarea", value: "Fill out the form below and we'll get back to you as soon as possible." },
          { key: "form_button", label: "Submit Button Text", type: "text", value: "Send Message" },
        ]
      }
    ]
  },
  footer: {
    label: "Footer",
    sections: [
      {
        name: "brand",
        fields: [
          { key: "logo_url", label: "Footer Logo Image", type: "image", value: "" },
          { key: "brand_name", label: "Brand Name", type: "text", value: "DigiCreativio" },
          { key: "description", label: "Brand Description", type: "textarea", value: "Crafting digital experiences that inspire and engage. Your creative partner for stunning design solutions." },
        ]
      },
      {
        name: "contact",
        fields: [
          { key: "email", label: "Contact Email", type: "text", value: "hello@digicreativio.com" },
        ]
      },
      {
        name: "copyright",
        fields: [
          { key: "text", label: "Copyright Text", type: "text", value: "DigiCreativio. All rights reserved." },
        ]
      }
    ]
  },
  navbar: {
    label: "Navbar (Header)",
    sections: [
      {
        name: "main",
        fields: [
          { key: "logo_url", label: "Navbar Logo Image", type: "image", value: "" },
          { key: "brand_name", label: "Brand Name", type: "text", value: "DigiCreativio" },
          { key: "cta_text", label: "CTA Button Text", type: "text", value: "Get Started" },
          { key: "cta_link", label: "CTA Button Link", type: "text", value: "/contact" },
        ]
      }
    ]
  }
};
