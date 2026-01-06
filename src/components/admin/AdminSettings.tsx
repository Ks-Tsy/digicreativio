import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, Plus, Pencil, Trash2, Download, Upload, FileText, Globe, Mail, Share2 } from "lucide-react";
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

const SETTING_TEMPLATES = [
  {
    name: "SEO Settings",
    icon: Globe,
    description: "Meta title, description, and keywords",
    settings: [
      { setting_key: "meta_title", setting_type: "seo", setting_value: { value: "My Website - Welcome" }, description: "Default meta title for pages" },
      { setting_key: "meta_description", setting_type: "seo", setting_value: { value: "Welcome to our website. We provide excellent services." }, description: "Default meta description for SEO" },
      { setting_key: "meta_keywords", setting_type: "seo", setting_value: { keywords: ["website", "services", "professional"] }, description: "SEO keywords for search engines" },
      { setting_key: "og_image", setting_type: "seo", setting_value: { url: "" }, description: "Open Graph image URL for social sharing" },
    ]
  },
  {
    name: "Contact Info",
    icon: Mail,
    description: "Business contact details",
    settings: [
      { setting_key: "contact_email", setting_type: "general", setting_value: { email: "contact@example.com" }, description: "Primary contact email address" },
      { setting_key: "contact_phone", setting_type: "general", setting_value: { phone: "+1 (555) 123-4567" }, description: "Business phone number" },
      { setting_key: "business_address", setting_type: "general", setting_value: { street: "", city: "", state: "", zip: "", country: "" }, description: "Physical business address" },
      { setting_key: "business_hours", setting_type: "general", setting_value: { weekdays: "9:00 AM - 5:00 PM", weekends: "Closed" }, description: "Business operating hours" },
    ]
  },
  {
    name: "Social Media",
    icon: Share2,
    description: "Social media profile URLs",
    settings: [
      { setting_key: "social_facebook", setting_type: "social", setting_value: { url: "" }, description: "Facebook page URL" },
      { setting_key: "social_twitter", setting_type: "social", setting_value: { url: "" }, description: "Twitter/X profile URL" },
      { setting_key: "social_instagram", setting_type: "social", setting_value: { url: "" }, description: "Instagram profile URL" },
      { setting_key: "social_linkedin", setting_type: "social", setting_value: { url: "" }, description: "LinkedIn profile URL" },
      { setting_key: "social_youtube", setting_type: "social", setting_value: { url: "" }, description: "YouTube channel URL" },
    ]
  },
];

export function AdminSettings({ siteSettings, onUpdateSetting, onRefresh }: AdminSettingsProps) {
  const { toast } = useToast();
  const { logActivity } = useActivityLog();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleApplyTemplate = async (template: typeof SETTING_TEMPLATES[0]) => {
    setIsLoading(true);
    try {
      const existingKeys = siteSettings.map(s => s.setting_key);
      const newSettings = template.settings.filter(s => !existingKeys.includes(s.setting_key));

      if (newSettings.length === 0) {
        toast({ title: "Info", description: "All settings from this template already exist" });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.from("site_settings").insert(newSettings);
      if (error) throw error;

      await logActivity({
        actionType: "create",
        entityType: "site_setting",
        entityName: `Template: ${template.name}`,
        details: { settings_added: newSettings.length },
      });

      toast({ title: "Success", description: `Added ${newSettings.length} settings from "${template.name}"` });
      setIsTemplateDialogOpen(false);
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

  // Export settings as JSON
  const handleExport = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      settings: siteSettings.map(({ id, created_at, updated_at, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-settings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Success", description: "Settings exported successfully" });
  };

  // Import settings from JSON
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.settings || !Array.isArray(data.settings)) {
        throw new Error("Invalid settings file format");
      }

      const existingKeys = siteSettings.map(s => s.setting_key);
      const newSettings = data.settings.filter((s: any) => !existingKeys.includes(s.setting_key));
      const updateSettings = data.settings.filter((s: any) => existingKeys.includes(s.setting_key));

      // Insert new settings
      if (newSettings.length > 0) {
        const { error } = await supabase.from("site_settings").insert(newSettings);
        if (error) throw error;
      }

      // Update existing settings
      for (const setting of updateSettings) {
        const existing = siteSettings.find(s => s.setting_key === setting.setting_key);
        if (existing) {
          await supabase.from("site_settings").update({
            setting_value: setting.setting_value,
            setting_type: setting.setting_type,
            description: setting.description,
            updated_at: new Date().toISOString(),
          }).eq("id", existing.id);
        }
      }

      await logActivity({
        actionType: "import",
        entityType: "site_setting",
        entityName: "Settings Import",
        details: { new: newSettings.length, updated: updateSettings.length },
      });

      toast({ 
        title: "Success", 
        description: `Imported ${newSettings.length} new and updated ${updateSettings.length} existing settings` 
      });
      onRefresh?.();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure global settings for your website ({siteSettings.length} settings)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Import/Export */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={siteSettings.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              {/* Templates */}
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Quick Templates</DialogTitle>
                    <DialogDescription>
                      Apply pre-configured setting templates to quickly set up common configurations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {SETTING_TEMPLATES.map((template) => (
                      <div
                        key={template.name}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-info/10">
                            <template.icon className="h-5 w-5 text-info" />
                          </div>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{template.settings.length} settings</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApplyTemplate(template)}
                          disabled={isLoading}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add New */}
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
            <p className="text-sm mt-2">Use "Templates" to quickly add common settings or click "Add Setting" to create one manually</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
