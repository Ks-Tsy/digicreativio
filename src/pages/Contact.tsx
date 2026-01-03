import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
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

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {heroData?.title || "Get in Touch"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "Have a project in mind? Let's discuss how we can help bring your vision to life"}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                      <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                      <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {contactPhone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                      <p className="text-muted-foreground">
                        {contactAddress}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass border-border/50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          className="bg-background/50 border-border focus:border-primary"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-background/50 border-border focus:border-primary"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (234) 567-890"
                          className="bg-background/50 border-border focus:border-primary"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-foreground">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Project inquiry"
                          className="bg-background/50 border-border focus:border-primary"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your project..."
                        className="min-h-[150px] bg-background/50 border-border focus:border-primary resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-metallic"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
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
