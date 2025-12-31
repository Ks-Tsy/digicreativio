import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Share2 } from "lucide-react";
import { DraggableSocialLinks } from "./DraggableSocialLinks";

interface AdminSocialProps {
  socialLinks: any[];
  onAdd: (link: any) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function AdminSocial({ socialLinks, onAdd, onUpdate, onDelete, onRefresh }: AdminSocialProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    icon_name: "",
    display_order: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(newLink);
    setNewLink({
      platform: "",
      url: "",
      icon_name: "",
      display_order: 0,
      is_active: true,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-info" />
            <div>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media links ({socialLinks.length} total)
              </CardDescription>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Social Link</DialogTitle>
                <DialogDescription>
                  Add a new social media link to your footer
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform Name</Label>
                  <Input
                    id="platform"
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    placeholder="Facebook, Instagram, etc."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
                  <Input
                    id="icon_name"
                    value={newLink.icon_name}
                    onChange={(e) => setNewLink({ ...newLink, icon_name: e.target.value })}
                    placeholder="Facebook, Instagram, Linkedin, etc."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use Lucide icon names like Facebook, Instagram, Twitter, Linkedin, Youtube
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={newLink.display_order}
                    onChange={(e) =>
                      setNewLink({ ...newLink, display_order: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={newLink.is_active}
                    onCheckedChange={(checked) => setNewLink({ ...newLink, is_active: checked })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Link</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {socialLinks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No social links found. Add your first link to get started.</p>
          </div>
        ) : (
          <DraggableSocialLinks
            socialLinks={socialLinks}
            onReorder={onRefresh}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}
