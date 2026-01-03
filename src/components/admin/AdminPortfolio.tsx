import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import { DraggablePortfolioItems } from "./DraggablePortfolioItems";

interface AdminPortfolioProps {
  portfolioItems: any[];
  onRefresh: () => void;
}

export function AdminPortfolio({ portfolioItems, onRefresh }: AdminPortfolioProps) {
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "image",
    project_url: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fileUrl = newItem.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-files")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio-files").getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      const { error } = await supabase
        .from("portfolio_items")
        .insert([{ ...newItem, image_url: fileUrl }]);

      if (error) throw error;

      await logActivity({
        actionType: "create",
        entityType: "portfolio_item",
        entityName: newItem.title,
      });

      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });

      setNewItem({
        title: "",
        description: "",
        image_url: "",
        category: "image",
        project_url: "",
      });
      setSelectedFile(null);
      setIsAddDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const item = portfolioItems.find(p => p.id === id);
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } else {
      await logActivity({
        actionType: "delete",
        entityType: "portfolio_item",
        entityId: id,
        entityName: item?.title,
      });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
      onRefresh();
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Portfolio Management</CardTitle>
            <CardDescription>
              Drag and drop to reorder items ({portfolioItems.length} total)
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Portfolio Item</DialogTitle>
                <DialogDescription>
                  Add a new project to your portfolio
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Project title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="web">Web Design</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project_url">Project URL (optional)</Label>
                  <Input
                    id="project_url"
                    type="url"
                    value={newItem.project_url}
                    onChange={(e) => setNewItem({ ...newItem, project_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Image</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Or enter an image URL:
                  </p>
                  <Input
                    type="url"
                    value={newItem.image_url}
                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No portfolio items yet. Add your first project to get started.</p>
          </div>
        ) : (
          <DraggablePortfolioItems
            portfolioItems={portfolioItems}
            onReorder={onRefresh}
            onDelete={handleDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}
