import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { Plus, Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraggableTestimonials } from "./DraggableTestimonials";

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
  created_at: string;
  updated_at: string;
}

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export function AdminTestimonials({ testimonials, onRefresh }: AdminTestimonialsProps) {
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar_url: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatar_url: "",
      is_active: true,
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.role || !formData.content) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    const maxOrder = Math.max(...testimonials.map(t => t.display_order), 0);
    
    const { error } = await supabase.from("testimonials").insert([{
      ...formData,
      company: formData.company || null,
      avatar_url: formData.avatar_url || null,
      display_order: maxOrder + 1,
    }]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity({
        actionType: "create",
        entityType: "testimonial",
        entityName: formData.name,
      });
      toast({ title: "Success", description: "Testimonial added" });
      resetForm();
      setIsAddOpen(false);
      onRefresh();
    }
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!editingItem) return;

    setSaving(true);
    const { error } = await supabase.from("testimonials").update({
      name: formData.name,
      role: formData.role,
      company: formData.company || null,
      content: formData.content,
      rating: formData.rating,
      avatar_url: formData.avatar_url || null,
      is_active: formData.is_active,
    }).eq("id", editingItem.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity({
        actionType: "update",
        entityType: "testimonial",
        entityId: editingItem.id,
        entityName: formData.name,
      });
      toast({ title: "Success", description: "Testimonial updated" });
      setEditingItem(null);
      resetForm();
      onRefresh();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const testimonial = testimonials.find(t => t.id === deleteId);
    const { error } = await supabase.from("testimonials").delete().eq("id", deleteId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await logActivity({
        actionType: "delete",
        entityType: "testimonial",
        entityId: deleteId,
        entityName: testimonial?.name,
      });
      toast({ title: "Success", description: "Testimonial deleted" });
      onRefresh();
    }
    setDeleteId(null);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from("testimonials").update({ is_active: isActive }).eq("id", id);

    if (!error) {
      toast({ title: "Success", description: `Testimonial ${isActive ? "activated" : "deactivated"}` });
      onRefresh();
    }
  };

  const openEditDialog = (item: Testimonial) => {
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company || "",
      content: item.content,
      rating: item.rating,
      avatar_url: item.avatar_url || "",
      is_active: item.is_active,
    });
    setEditingItem(item);
  };

  const TestimonialForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="CEO"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Select
            value={formData.rating.toString()}
            onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((r) => (
                <SelectItem key={r} value={r.toString()}>
                  {r} Star{r > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Review Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Their work exceeded all our expectations..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
        <Input
          id="avatar_url"
          value={formData.avatar_url}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active (visible on website)</Label>
      </div>
      <Button onClick={isEdit ? handleEdit : handleAdd} disabled={saving} className="w-full">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? "Update Testimonial" : "Add Testimonial"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Testimonials</h2>
          <p className="text-muted-foreground">Manage client testimonials displayed on the homepage</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialForm />
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No testimonials yet</p>
            <p className="text-sm text-muted-foreground">Add your first client testimonial</p>
          </CardContent>
        </Card>
      ) : (
        <DraggableTestimonials
          testimonials={testimonials}
          onEdit={openEditDialog}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggleActive}
          onReorder={onRefresh}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <TestimonialForm isEdit />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
