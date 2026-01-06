import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-enhanced.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "glass-strong shadow-lg shadow-background/50" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src={logo} alt="DigiCreativio Logo" className="h-10 w-10 object-contain relative z-10" />
            </div>
            <span className="text-2xl font-heading font-bold text-gradient">DigiCreativio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-primary/10 border border-primary/20"
                    : "group-hover:bg-secondary/50"
                }`} />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center group ${
                  isActive("/admin")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="h-4 w-4 mr-1.5" />
                <span className="relative z-10">Admin</span>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  isActive("/admin")
                    ? "bg-primary/10 border border-primary/20"
                    : "group-hover:bg-secondary/50"
                }`} />
              </Link>
            )}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && user && (
              <Button
                variant="outline"
                onClick={() => signOut()}
                size="sm"
                className="border-border/50 hover:border-primary/50 rounded-xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
            <Button asChild className="group relative bg-primary hover:bg-gold-bright text-primary-foreground font-semibold rounded-xl px-6 transition-all duration-300 hover:scale-105">
              <Link to="/contact">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors rounded-xl hover:bg-secondary/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 animate-fade-in-down glass-strong rounded-2xl mt-2 mb-4 border border-border/30">
            <div className="flex flex-col space-y-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10 border border-primary/20"
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
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2" />
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
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              )}
              <div className="pt-4">
                <Button asChild className="w-full bg-primary hover:bg-gold-bright text-primary-foreground font-semibold rounded-xl">
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Started
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
