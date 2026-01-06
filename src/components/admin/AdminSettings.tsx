import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, Plus, Pencil, Trash2, Save } from "lucide-react";
import { ShortId } from "@/components/ShortId";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/useActivityLog";

interface AdminSettingsProps {
  siteSettings: any[];
  onUpdateSetting: (id: string, value: any) => void;
  onRefresh?: () => void;
}

const SETTING_TYPES = ["general", "seo", "social", "email", "appearance", "advanced"];

export function AdminSettings({ siteSettings, onUpdateSetting, onRefresh }: AdminSettingsProps) {
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new setting
  const [newSetting, setNewSetting] = useState({
    setting_key: "",
    setting_type: "general",
    setting_value: "{}",
    description: "",
  });

  // Group settings by type
  const groupedSettings = siteSettings.reduce((acc, setting) => {
    if (!acc[setting.setting_type]) {
      acc[setting.setting_type] = [];
    }
    acc[setting.setting_type].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  const handleAddSetting = async () => {
    if (!newSetting.setting_key.trim()) {
      toast({ title: "Error", description: "Setting key is required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(newSetting.setting_value);
      } catch {
        toast({ title: "Error", description: "Invalid JSON value", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from("site_settings").insert([{
        setting_key: newSetting.setting_key,
        setting_type: newSetting.setting_type,
        setting_value: parsedValue,
        description: newSetting.description || null,
      }]);

      if (error) throw error;

      await logActivity({
        actionType: "create",
        entityType: "site_setting",
        entityName: newSetting.setting_key,
      });

      toast({ title: "Success", description: "Setting added successfully" });
      setIsAddDialogOpen(false);
      setNewSetting({ setting_key: "", setting_type: "general", setting_value: "{}", description: "" });
      onRefresh?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = async () => {
    if (!editingSetting) return;

    setIsLoading(true);
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editingSetting.setting_value_str);
      } catch {
        toast({ title: "Error", description: "Invalid JSON value", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from("site_settings").update({
        setting_key: editingSetting.setting_key,
        setting_type: editingSetting.setting_type,
        setting_value: parsedValue,
        description: editingSetting.description || null,
        updated_at: new Date().toISOString(),
      }).eq("id", editingSetting.id);

      if (error) throw error;

      await logActivity({
        actionType: "update",
        entityType: "site_setting",
        entityId: editingSetting.id,
        entityName: editingSetting.setting_key,
      });

      toast({ title: "Success", description: "Setting updated successfully" });
      setEditingSetting(null);
      onRefresh?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSetting = async (id: string, settingKey: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("site_settings").delete().eq("id", id);
      if (error) throw error;

      await logActivity({
        actionType: "delete",
        entityType: "site_setting",
        entityId: id,
        entityName: settingKey,
      });

      toast({ title: "Success", description: "Setting deleted successfully" });
      onRefresh?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (setting: any) => {
    setEditingSetting({
      ...setting,
      setting_value_str: JSON.stringify(setting.setting_value, null, 2),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure global settings for your website ({siteSettings.length} settings)
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Setting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Setting</DialogTitle>
                  <DialogDescription>
                    Create a new site setting with a JSON value.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="setting_key">Setting Key</Label>
                    <Input
                      id="setting_key"
                      placeholder="e.g., site_name, meta_description"
                      value={newSetting.setting_key}
                      onChange={(e) => setNewSetting({ ...newSetting, setting_key: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setting_type">Setting Type</Label>
                    <Select
                      value={newSetting.setting_type}
                      onValueChange={(value) => setNewSetting({ ...newSetting, setting_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SETTING_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      placeholder="Describe what this setting does"
                      value={newSetting.description}
                      onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setting_value">Value (JSON)</Label>
                    <Textarea
                      id="setting_value"
                      placeholder='{"key": "value"}'
                      value={newSetting.setting_value}
                      onChange={(e) => setNewSetting({ ...newSetting, setting_value: e.target.value })}
                      className="font-mono text-sm min-h-[120px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSetting} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Setting"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={(open) => !open && setEditingSetting(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Modify the setting details and value.
            </DialogDescription>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_setting_key">Setting Key</Label>
                <Input
                  id="edit_setting_key"
                  value={editingSetting.setting_key}
                  onChange={(e) => setEditingSetting({ ...editingSetting, setting_key: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_setting_type">Setting Type</Label>
                <Select
                  value={editingSetting.setting_type}
                  onValueChange={(value) => setEditingSetting({ ...editingSetting, setting_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SETTING_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Input
                  id="edit_description"
                  value={editingSetting.description || ""}
                  onChange={(e) => setEditingSetting({ ...editingSetting, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_setting_value">Value (JSON)</Label>
                <Textarea
                  id="edit_setting_value"
                  value={editingSetting.setting_value_str}
                  onChange={(e) => setEditingSetting({ ...editingSetting, setting_value_str: e.target.value })}
                  className="font-mono text-sm min-h-[120px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSetting(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSetting} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {Object.entries(groupedSettings).map(([settingType, settings]) => (
        <Card key={settingType} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-info" />
              <CardTitle className="text-lg capitalize">{settingType} Settings</CardTitle>
              <Badge variant="outline" className="ml-2">
                {(settings as any[]).length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(settings as any[]).map((setting) => (
              <div
                key={setting.id}
                className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden"
              >
                <div className="p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{setting.setting_key}</h4>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ShortId id={setting.id} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(setting)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Setting</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{setting.setting_key}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSetting(setting.id, setting.setting_key)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Textarea
                    defaultValue={JSON.stringify(setting.setting_value, null, 2)}
                    onBlur={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        onUpdateSetting(setting.id, parsed);
                      } catch (err) {
                        toast({ title: "Invalid JSON", description: "Please enter valid JSON", variant: "destructive" });
                      }
                    }}
                    className="font-mono text-sm min-h-[100px] bg-background"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {siteSettings.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No settings found</p>
            <p className="text-sm mt-2">Click "Add Setting" to create your first setting</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
