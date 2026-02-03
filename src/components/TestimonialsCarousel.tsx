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
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border-border hover:bg-secondary"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border-border hover:bg-secondary"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
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
      className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-gradient-to-br from-card via-card to-card/80 border-border/30 hover:border-primary/30 transition-all duration-300"
    >
      <CardContent className="p-8 relative min-h-[280px] flex flex-col">
        {/* Large Quote Mark */}
        <div className="absolute top-6 right-6">
          <span className="text-6xl font-serif text-primary/20 leading-none">"</span>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
          {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
            <Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/30" />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-4 italic flex-grow">
          "{testimonial.content}"
        </p>

        {/* Client Info */}
        <div className="flex items-center gap-4 mt-auto">
          {testimonial.avatar_url ? (
            <img
              src={testimonial.avatar_url}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground font-semibold text-sm border-2 border-border/50">
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
