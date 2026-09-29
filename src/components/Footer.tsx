import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import logo from "@/assets/logo-enhanced.png";
import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  
  // Connect to Footer site content
  const { content: brandContent } = useSiteContent("footer", "brand");
  const { content: footerContactContent } = useSiteContent("footer", "contact");
  const { content: copyrightContent } = useSiteContent("footer", "copyright");
  const { content: infoContent } = useSiteContent("contact", "info");

  const brandData = (brandContent?.content_data as any) || {};
  const footerContactData = (footerContactContent?.content_data as any) || {};
  const infoData = (infoContent?.content_data as any) || {};
  const copyrightData = (copyrightContent?.content_data as any) || {};

  const brandName = brandData.brand_name || "DigiCreativio";
  const brandDescription = brandData.description || "Crafting digital experiences that inspire and engage. Your creative partner for stunning design solutions.";
  const brandLogo = brandData.logo_url || logo;
  const contactEmail = footerContactData.email || infoData.email || "hello@digicreativio.com";
  const rawCopyright = copyrightData.text || "DigiCreativio. All rights reserved.";
  const copyrightText = rawCopyright.startsWith("©") ? rawCopyright : `© ${currentYear} ${rawCopyright}`;

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    setSocialLinks(data || []);
  };

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={18} /> : null;
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    "Graphic Design",
    "Logo Design",
    "Branding",
    "Web Design",
    "Digital Art",
  ];

  return (
    <footer data-section-id="brand" className="border-t border-border/30 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div data-section-id="brand" className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={brandLogo} 
                alt="DigiCreativio Logo" 
                data-editable-field="logo_url"
                data-field-label="Footer Logo Image"
                data-field-type="image"
                className="h-10 w-10 object-contain" 
              />
              <h3 
                data-editable-field="brand_name"
                data-field-label="Brand Name"
                className="text-xl font-heading font-bold"
              >
                {brandName}
              </h3>
            </Link>
            <p 
              data-editable-field="description"
              data-field-label="Brand Description"
              data-field-type="textarea"
              className="text-muted-foreground leading-relaxed text-sm"
            >
              {brandDescription}
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" 
                  aria-label={link.platform}
                >
                  {renderIcon(link.icon_name)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-sm text-muted-foreground">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-section-id="contact">
            <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Get in Touch</h4>
            <a 
              href={`mailto:${contactEmail}`}
              className="group flex items-center p-4 rounded-xl bg-secondary/30 hover:bg-primary/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Email us</div>
                <div 
                  data-editable-field="email"
                  data-field-label="Contact Email"
                  className="text-sm text-foreground group-hover:text-primary transition-colors"
                >
                  {contactEmail}
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div data-section-id="copyright" className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p 
              data-editable-field="text"
              data-field-label="Copyright Text"
              className="text-sm text-muted-foreground"
            >
              {copyrightText}
            </p>
            <div className="flex space-x-8">
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
