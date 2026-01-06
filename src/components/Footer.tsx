import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight, Heart } from "lucide-react";
import * as LucideIcons from "lucide-react";
import logo from "@/assets/logo-enhanced.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

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
    return Icon ? <Icon size={20} /> : null;
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  const services = [
    "Graphic Design",
    "Logo Design",
    "Branding",
    "Web Design",
    "Digital Art",
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple/3 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src={logo} alt="DigiCreativio Logo" className="h-12 w-12 object-contain relative z-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gradient">DigiCreativio</h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Crafting digital experiences that inspire and engage. Your creative partner for stunning design solutions.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300" 
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
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/contact" 
                  className="group flex items-center text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <span>Contact</span>
                  <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Get in Touch</h4>
            <div className="space-y-4">
              <a 
                href="mailto:hello@digicreativio.com" 
                className="group flex items-center p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mr-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Email us</div>
                  <div className="text-sm text-foreground group-hover:text-primary transition-colors">hello@digicreativio.com</div>
                </div>
              </a>
              <p className="text-sm text-muted-foreground">
                Available for freelance projects. Let's create something amazing together.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground flex items-center">
              © {currentYear} DigiCreativio. Made with <Heart className="h-3.5 w-3.5 mx-1.5 text-primary" /> All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
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
