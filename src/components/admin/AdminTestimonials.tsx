import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { Plus, Star, Loader2, Upload, X, User } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return formData.avatar_url || null;

    setUploading(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('testimonial-avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('testimonial-avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData({ ...formData, avatar_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.role || !formData.content) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    
    // Upload avatar if selected
    const avatarUrl = await uploadAvatar();
    
    const maxOrder = Math.max(...testimonials.map(t => t.display_order), 0);
    
    const { error } = await supabase.from("testimonials").insert([{
      name: formData.name,
      role: formData.role,
      company: formData.company || null,
      content: formData.content,
      rating: formData.rating,
      avatar_url: avatarUrl,
      is_active: formData.is_active,
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
    
    // Upload new avatar if selected
    let avatarUrl = formData.avatar_url;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
        
        // Delete old avatar if exists and is from our storage
        if (editingItem.avatar_url?.includes('testimonial-avatars')) {
          const oldPath = editingItem.avatar_url.split('/').pop();
          if (oldPath) {
            await supabase.storage.from('testimonial-avatars').remove([oldPath]);
          }
        }
      }
    }

    const { error } = await supabase.from("testimonials").update({
      name: formData.name,
      role: formData.role,
      company: formData.company || null,
      content: formData.content,
      rating: formData.rating,
      avatar_url: avatarUrl || null,
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
    
    // Delete avatar from storage if exists
    if (testimonial?.avatar_url?.includes('testimonial-avatars')) {
      const path = testimonial.avatar_url.split('/').pop();
      if (path) {
        await supabase.storage.from('testimonial-avatars').remove([path]);
      }
    }

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
    setAvatarPreview(item.avatar_url || null);
    setAvatarFile(null);
    setEditingItem(item);
  };

  const currentAvatar = avatarPreview || formData.avatar_url;

  const TestimonialForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      {/* Avatar Upload */}
      <div className="space-y-2">
        <Label>Avatar Image</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentAvatar ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                <img
                  src={currentAvatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Image
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

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
      <div className="flex items-center gap-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active (visible on website)</Label>
      </div>
      <Button onClick={isEdit ? handleEdit : handleAdd} disabled={saving || uploading} className="w-full">
        {(saving || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
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
      <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) { setEditingItem(null); resetForm(); } }}>
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
