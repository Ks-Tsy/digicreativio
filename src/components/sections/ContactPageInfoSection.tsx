import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useSiteContent } from '@/hooks/useSiteContent';

export const ContactPageInfoSection = () => {
  const { content: infoContent } = useSiteContent("contact", "info");

  const infoData = infoContent?.content_data as {
    email?: string;
    phone?: string;
    address?: string;
    form_title?: string;
    form_subtitle?: string;
    form_button?: string;
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

      // Honeypot check: trick bots into thinking they succeeded
      if (honeypot && honeypot.length > 0) {
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          toast.success("Message sent successfully! We'll get back to you soon.");
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
          setTimeout(() => setIsSubmitted(false), 5000);
        }, 1000);
        return;
      }

      // Timing check: prevent extremely fast script submissions
      const submissionTime = Date.now() - formLoadedAt;
      if (submissionTime < 3000) {
        setSlowDownMessage("Please take a moment to fill out the form carefully.");
        setIsSubmitting(false);
        return;
      }

      // Combine optional fields into message and format
      const sanitizedData = {
        name: formData.name.trim().slice(0, 100),
        email: formData.email.trim().toLowerCase().slice(0, 255),
        message: [
          formData.subject ? `Subject: ${formData.subject.trim().slice(0, 200)}` : null,
          formData.phone ? `Phone: ${formData.phone.trim().slice(0, 50)}` : null,
          "",
          formData.message.trim().slice(0, 5000)
        ].filter(Boolean).join("\n"),
        status: 'new',
      };

      const { error } = await supabase.from("contact_submissions").insert([sanitizedData]);

      if (error) {
        throw error;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error("Supabase error:", error);
      toast.error(`Failed to send message: ${error.message || "Please try again."}`);
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
    { icon: Mail, title: "Email Us", content: contactEmail, href: `mailto:${contactEmail}`, fieldKey: "email", fieldLabel: "Contact Email", fieldType: "text" },
    { icon: Phone, title: "Call Us", content: contactPhone, href: `tel:${contactPhone.replace(/\D/g, '')}`, fieldKey: "phone", fieldLabel: "Phone Number", fieldType: "text" },
    { icon: MapPin, title: "Visit Us", content: contactAddress, href: null, fieldKey: "address", fieldLabel: "Address", fieldType: "textarea" },
    { icon: Clock, title: "Business Hours", content: "Mon - Fri: 9AM - 6PM", href: null },
  ];

  return (
    <section data-section-id="info" className="py-12 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactCards.map((card, index) => (
              <Card key={index} className="bg-[#090909] border-[#111111] hover:border-[#D4AF37]/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#111111] flex items-center justify-center">
                      <card.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                      {card.href ? (
                        <a 
                          href={card.href} 
                          data-editable-field={card.fieldKey}
                          data-field-label={card.fieldLabel}
                          data-field-type={card.fieldType}
                          className="text-sm text-[#858585] hover:text-[#D4AF37] transition-colors block"
                        >
                          {card.content}
                        </a>
                      ) : (
                        <p 
                          data-editable-field={card.fieldKey}
                          data-field-label={card.fieldLabel}
                          data-field-type={card.fieldType}
                          className="text-sm text-[#858585] block"
                        >
                          {card.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#090909] border-[#111111]">
              <CardContent className="p-8 md:p-10">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#111111] mb-6">
                      <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3 text-[#F5F5F5]">Message Sent!</h3>
                    <p className="text-[#858585]">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <h2 
                      data-editable-field="form_title"
                      data-field-label="Form Title"
                      className="text-2xl font-heading font-bold text-foreground mb-2"
                    >
                      {infoData?.form_title || "Send us a Message"}
                    </h2>
                    <p 
                      data-editable-field="form_subtitle"
                      data-field-label="Form Subtitle"
                      data-field-type="textarea"
                      className="text-[#858585] mb-8 font-light"
                    >
                      {infoData?.form_subtitle || "Fill out the form below and we'll get back to you as soon as possible."}
                    </p>
                    
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
                            className="bg-[#111111] border-[#111111] focus:border-[#D4AF37] rounded-xl h-12 text-[#F5F5F5]"
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
                            className="bg-[#111111] border-[#111111] focus:border-[#D4AF37] rounded-xl h-12 text-[#F5F5F5]"
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
                            className="bg-[#111111] border-[#111111] focus:border-[#D4AF37] rounded-xl h-12 text-[#F5F5F5]"
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
                            className="bg-[#111111] border-[#111111] focus:border-[#D4AF37] rounded-xl h-12 text-[#F5F5F5]"
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
                          className="min-h-[160px] bg-[#111111] border-[#111111] focus:border-[#D4AF37] resize-none rounded-xl text-[#F5F5F5]"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#050505] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37] text-[#F5F5F5] hover:text-[#050505] font-semibold h-14 rounded-full text-lg transition-all duration-300 group"
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
                            <span data-editable-field="form_button" data-field-label="Submit Button Text">
                              {infoData?.form_button || "Send Message"}
                            </span>
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
  );
};
