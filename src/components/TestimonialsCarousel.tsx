import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";

export function TestimonialsCarousel() {
  const { testimonials, loading } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 3;
  const totalSlides = Math.max(0, testimonials.length - itemsPerView + 1);

  const goToNext = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [testimonials.length, totalSlides]);

  const goToPrev = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [testimonials.length, totalSlides]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {testimonials.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/50 shadow-lg"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/50 shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Carousel Container - No auto-sliding animation */}
      <div className="overflow-hidden px-2">
        <div
          className="flex gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView + 2)}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              getInitials={getInitials}
            />
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "w-6 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  getInitials: (name: string) => string;
}

function TestimonialCard({ testimonial, getInitials }: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group glass border-border/30 hover:border-primary/30 transition-all duration-500"
      )}
    >
      <CardContent className="p-8 relative">
        {/* Quote Icon */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="w-12 h-12 text-primary" />
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-gold text-gold transition-transform group-hover:scale-110"
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
          {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
            <Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/30" />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-muted-foreground mb-6 leading-relaxed italic line-clamp-4">
          "{testimonial.content}"
        </p>

        {/* Client Info */}
        <div className="flex items-center gap-4">
          {testimonial.avatar_url ? (
            <img
              src={testimonial.avatar_url}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {getInitials(testimonial.name)}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.company && `, ${testimonial.company}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
