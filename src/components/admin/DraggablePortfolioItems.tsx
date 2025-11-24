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
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  project_url: string | null;
  display_order: number;
  created_at: string;
}

interface SortableItemProps {
  item: PortfolioItem;
  onDelete: (id: string) => void;
}

function SortableItem({ item, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className={isDragging ? "shadow-lg" : ""}>
        <CardContent className="flex items-center gap-4 p-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <img
            src={item.image_url}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-md"
          />

          <div className="flex-1">
            <h4 className="font-semibold text-lg">{item.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description || "No description"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{item.category}</Badge>
              {item.project_url && (
                <a
                  href={item.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View Project
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Order: {item.display_order}
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggablePortfolioItemsProps {
  portfolioItems: PortfolioItem[];
  onReorder: () => void;
  onDelete: (id: string) => void;
}

export function DraggablePortfolioItems({
  portfolioItems,
  onReorder,
  onDelete,
}: DraggablePortfolioItemsProps) {
  const [items, setItems] = useState(portfolioItems);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when portfolioItems prop changes
  useEffect(() => {
    setItems(portfolioItems);
  }, [portfolioItems]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update display_order for all affected items
      try {
        const updates = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }));

        for (const update of updates) {
          await supabase
            .from("portfolio_items")
            .update({ display_order: update.display_order })
            .eq("id", update.id);
        }

        toast({
          title: "Success",
          description: "Portfolio items reordered successfully",
        });
        onReorder();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reorder portfolio items",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop to reorder portfolio items
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onDelete={onDelete} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
