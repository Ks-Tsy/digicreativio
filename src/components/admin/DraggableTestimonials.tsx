import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Edit2, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
}

interface SortableTestimonialProps {
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

function SortableTestimonial({
  testimonial,
  onEdit,
  onDelete,
  onToggleActive,
}: SortableTestimonialProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`${isDragging ? "shadow-lg ring-2 ring-primary" : ""} ${!testimonial.is_active ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing mt-1"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{testimonial.name}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                {testimonial.company && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{testimonial.company}</span>
                  </>
                )}
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.content}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Switch
                checked={testimonial.is_active}
                onCheckedChange={(checked) => onToggleActive(testimonial.id, checked)}
              />
              <Button variant="ghost" size="icon" onClick={() => onEdit(testimonial)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(testimonial.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableTestimonialsProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onReorder: () => void;
}

export function DraggableTestimonials({
  testimonials,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}: DraggableTestimonialsProps) {
  const [items, setItems] = useState(testimonials);
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(testimonials);
  }, [testimonials]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }));

        for (const update of updates) {
          await supabase
            .from("testimonials")
            .update({ display_order: update.display_order })
            .eq("id", update.id);
        }

        await logActivity({
          actionType: "reorder",
          entityType: "testimonial",
          details: { items_reordered: updates.length },
        });

        toast({
          title: "Success",
          description: "Testimonials reordered successfully",
        });
        onReorder();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reorder testimonials",
          variant: "destructive",
        });
        setItems(testimonials);
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Drag and drop to reorder testimonials
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((testimonial) => (
              <SortableTestimonial
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
