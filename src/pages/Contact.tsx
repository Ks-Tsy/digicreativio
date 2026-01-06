import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

const Contact = () => {
  const { content: heroContent } = useSiteContent("contact", "hero");
  const { content: infoContent } = useSiteContent("contact", "info");

  const heroData = heroContent?.content_data as {
    title?: string;
    subtitle?: string;
  } | null;

  const infoData = infoContent?.content_data as {
    email?: string;
    phone?: string;
    address?: string;
  } | null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("contact_submissions")
      .insert([{
        name: formData.name,
        email: formData.email,
        message: `Subject: ${formData.subject}\nPhone: ${formData.phone}\n\n${formData.message}`,
      }]);

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactEmail = infoData?.email || "digicreativio@gmail.com";
  const contactPhone = infoData?.phone || "+1 (234) 567-890";
  const contactAddress = infoData?.address || "123 Creative Street, Design City, DC 12345";

  const contactCards = [
    {
      icon: Mail,
      title: "Email Us",
      content: contactEmail,
      href: `mailto:${contactEmail}`,
      accent: "gold",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: contactPhone,
      href: `tel:${contactPhone.replace(/\D/g, '')}`,
      accent: "purple",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: contactAddress,
      href: null,
      accent: "cyan",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM",
      href: null,
      accent: "gold",
    },
  ];

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-mesh noise">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
              Let's Connect
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <span className="text-gradient">{heroData?.title || "Get in Touch"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              {heroData?.subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life"}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-4">
              {contactCards.map((card, index) => (
                <Card 
                  key={index} 
                  className="group glass border-border/30 hover:border-primary/40 transition-all duration-500 opacity-0 animate-fade-in-left"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110
                        ${card.accent === 'gold' ? 'bg-gold/10 border border-gold/20' : ''}
                        ${card.accent === 'purple' ? 'bg-purple/10 border border-purple/20' : ''}
                        ${card.accent === 'cyan' ? 'bg-cyan/10 border border-cyan/20' : ''}
                      `}>
                        <card.icon className={`w-6 h-6
                          ${card.accent === 'gold' ? 'text-gold' : ''}
                          ${card.accent === 'purple' ? 'text-purple' : ''}
                          ${card.accent === 'cyan' ? 'text-cyan' : ''}
                        `} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                        {card.href ? (
                          <a href={card.href} className="text-muted-foreground hover:text-primary transition-colors">
                            {card.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{card.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass border-border/30 overflow-hidden opacity-0 animate-fade-in-right" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
                
                <CardContent className="p-8 md:p-10 relative z-10">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 border border-success/20 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-3">Message Sent!</h3>
                      <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Send us a Message</h2>
                      <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground font-medium">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Your full name"
                              className="bg-secondary/30 border-border/50 focus:border-primary rounded-xl h-12"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground font-medium">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="your@email.com"
                              className="bg-secondary/30 border-border/50 focus:border-primary rounded-xl h-12"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="+1 (234) 567-890"
                              className="bg-secondary/30 border-border/50 focus:border-primary rounded-xl h-12"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-foreground font-medium">Subject</Label>
                            <Input
                              id="subject"
                              name="subject"
                              type="text"
                              placeholder="Project inquiry"
                              className="bg-secondary/30 border-border/50 focus:border-primary rounded-xl h-12"
                              value={formData.subject}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about your project..."
                            className="min-h-[160px] bg-secondary/30 border-border/50 focus:border-primary resize-none rounded-xl"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-gold-bright text-primary-foreground font-semibold glow-gold h-14 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
