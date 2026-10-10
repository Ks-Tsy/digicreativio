import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-enhanced.png";
import { useSiteContent } from "@/hooks/useSiteContent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const { content } = useSiteContent("navbar", "main");
  const data = (content?.content_data as any) || {};

  const brandName = data.brand_name || "DigiCreativio";
  const brandLogo = data.logo_url || logo;
  const ctaText = data.cta_text || "Get Started";
  const ctaLink = data.cta_link || "/contact";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      data-section-id="main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <img 
              src={brandLogo} 
              alt="DigiCreativio Logo" 
              data-editable-field="logo_url"
              data-field-label="Navbar Logo Image"
              data-field-type="image"
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0" 
            />
            <span 
              data-editable-field="brand_name"
              data-field-label="Brand Name"
              className="text-lg sm:text-xl font-heading font-bold whitespace-nowrap"
            >
              {brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-300 whitespace-nowrap relative group ${
                  isActive(link.path)
                    ? "text-[#F5F5F5]"
                    : "text-[#858585] hover:text-[#F5F5F5]"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#D4AF37] rounded-full" />
                )}
                {!isActive(link.path) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#D4AF37]/50 rounded-full transition-all duration-300 group-hover:w-4" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-300 flex items-center whitespace-nowrap ${
                  isActive("/admin")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Shield className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1.5 shrink-0" />
                Admin
              </Link>
            )}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {isAdmin && user && (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                size="sm"
                className="rounded-full text-xs xl:text-sm h-9 px-3 whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1.5 shrink-0" />
                Sign Out
              </Button>
            )}
            <Button asChild size="sm" className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] font-medium rounded-full px-4 xl:px-6 h-9 text-xs xl:text-sm whitespace-nowrap transition-all duration-300">
              <Link to={ctaLink}>
                <span data-editable-field="cta_text" data-field-label="CTA Button Text">
                  {ctaText}
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors rounded-full hover:bg-secondary/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 bg-background/95 backdrop-blur-md rounded-2xl mt-2 mb-4 border border-border/30">
            <div className="flex flex-col space-y-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center ${
                    isActive("/admin")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2 shrink-0" />
                  Admin
                </Link>
              )}
              {isAdmin && user && (
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2 shrink-0" />
                  Sign Out
                </button>
              )}
              <div className="pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full">
                  <Link to={ctaLink} onClick={() => setIsOpen(false)}>
                    {ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
