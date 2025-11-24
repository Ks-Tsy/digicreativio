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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Edit, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

interface SortableItemProps {
  link: SocialLink;
  editingLink: SocialLink | null;
  onEdit: (link: SocialLink) => void;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  setEditingLink: (link: SocialLink | null) => void;
}

function SortableItem({
  link,
  editingLink,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  setEditingLink,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingLink?.id === link.id;

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className={isDragging ? "shadow-lg" : ""}>
        <CardContent className="flex items-center gap-3 p-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 grid grid-cols-4 gap-3 items-center">
            <div>
              {isEditing ? (
                <Input
                  value={editingLink.platform}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, platform: e.target.value })
                  }
                  className="h-8"
                />
              ) : (
                <span className="font-medium">{link.platform}</span>
              )}
            </div>
            <div className="col-span-2">
              {isEditing ? (
                <Input
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  className="h-8"
                />
              ) : (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate block"
                >
                  {link.url}
                </a>
              )}
            </div>
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input
                  value={editingLink.icon_name}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, icon_name: e.target.value })
                  }
                  className="h-8 w-32"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {link.icon_name}
                </span>
              )}
              <Badge variant={link.is_active ? "default" : "secondary"}>
                {link.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onSave(link.id, editingLink)}
                  variant="default"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => onEdit(link)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableSocialLinksProps {
  socialLinks: SocialLink[];
  onReorder: () => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export function DraggableSocialLinks({
  socialLinks,
  onReorder,
  onUpdate,
  onDelete,
}: DraggableSocialLinksProps) {
  const [items, setItems] = useState(socialLinks);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when socialLinks prop changes
  useEffect(() => {
    setItems(socialLinks);
  }, [socialLinks]);

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
            .from("social_links")
            .update({ display_order: update.display_order })
            .eq("id", update.id);
        }

        toast({
          title: "Success",
          description: "Social links reordered successfully",
        });
        onReorder();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reorder social links",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
  };

  const handleSave = (id: string, updates: any) => {
    onUpdate(id, updates);
    setEditingLink(null);
  };

  const handleCancel = () => {
    setEditingLink(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop to reorder social links
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((link) => (
            <SortableItem
              key={link.id}
              link={link}
              editingLink={editingLink}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={onDelete}
              setEditingLink={setEditingLink}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
