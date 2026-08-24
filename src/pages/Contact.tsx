import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
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
  const [slowDownMessage, setSlowDownMessage] = useState<string | null>(null);
  
  const [formLoadedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSlowDownMessage(null);

    try {
      if (formData.name.trim().length < 2) {
        toast.error("Name must be at least 2 characters");
        setIsSubmitting(false);
        return;
      }
      if (formData.message.trim().length < 10) {
        toast.error("Message must be at least 10 characters");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          _hp_field: honeypot,
          _form_loaded_at: formLoadedAt,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        if (data.slowDown || data.expired) {
          setSlowDownMessage(data.error);
        } else {
          toast.error(data.error);
        }
      } else {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error: any) {
      toast.error("Failed to send message. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (slowDownMessage) {
      setSlowDownMessage(null);
    }
  };

  const contactEmail = infoData?.email || "digicreativio@gmail.com";
  const contactPhone = infoData?.phone || "+1 (234) 567-890";
  const contactAddress = infoData?.address || "123 Creative Street, Design City, DC 12345";

  const contactCards = [
    { icon: Mail, title: "Email Us", content: contactEmail, href: `mailto:${contactEmail}` },
    { icon: Phone, title: "Call Us", content: contactPhone, href: `tel:${contactPhone.replace(/\D/g, '')}` },
    { icon: MapPin, title: "Visit Us", content: contactAddress, href: null },
    { icon: Clock, title: "Business Hours", content: "Mon - Fri: 9AM - 6PM", href: null },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Let's Connect
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              {heroData?.title || "Get in Touch"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life"}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-4">
              {contactCards.map((card, index) => (
                <Card key={index} className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                        {card.href ? (
                          <a href={card.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {card.content}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{card.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border/50">
                <CardContent className="p-8 md:p-10">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-3">Message Sent!</h3>
                      <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Send us a Message</h2>
                      <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>
                      
                      {slowDownMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-warning">{slowDownMessage}</p>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true">
                          <Label htmlFor="_hp_field">Leave this field empty</Label>
                          <Input
                            id="_hp_field"
                            name="_hp_field"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground font-medium">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Your full name"
                              className="bg-secondary/30 border-border focus:border-primary rounded-xl h-12"
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
                              className="bg-secondary/30 border-border focus:border-primary rounded-xl h-12"
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
                              className="bg-secondary/30 border-border focus:border-primary rounded-xl h-12"
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
                              className="bg-secondary/30 border-border focus:border-primary rounded-xl h-12"
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
                            className="min-h-[160px] bg-secondary/30 border-border focus:border-primary resize-none rounded-xl"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 rounded-full text-lg"
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
