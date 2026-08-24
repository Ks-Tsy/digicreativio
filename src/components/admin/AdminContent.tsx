import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Edit, Save, X, FileText, Plus, Type, Image, 
  Heading1, AlignLeft, Link2, LayoutGrid, Eye, 
  Trash2, GripVertical, Settings2
} from "lucide-react";
import { ShortId } from "@/components/ShortId";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PAGE_TEMPLATES } from "@/utils/defaultContent";

interface AdminContentProps {
  siteContent: any[];
  onUpdateContent: (id: string, data: any) => void;
}

const CONTENT_TYPE_ICONS: Record<string, any> = {
  text: Type,
  hero: Heading1,
  section: AlignLeft,
  link: Link2,
  image: Image,
  grid: LayoutGrid,
};

export function AdminContent({ siteContent, onUpdateContent }: AdminContentProps) {
  const { toast } = useToast();
  const [editingContent, setEditingContent] = useState<any>(null);
  const [editingFields, setEditingFields] = useState<Record<string, string>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSectionPage, setNewSectionPage] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Group content by page
  const groupedContent = siteContent.reduce((acc, content) => {
    if (!acc[content.page_name]) {
      acc[content.page_name] = [];
    }
    acc[content.page_name].push(content);
    return acc;
  }, {} as Record<string, any[]>);

  const pages = Object.keys(groupedContent);

  const handleStartEdit = (content: any) => {
    setEditingContent(content);
    const fields: Record<string, string> = {};
    if (typeof content.content_data === 'object' && content.content_data !== null) {
      Object.entries(content.content_data).forEach(([key, value]) => {
        fields[key] = String(value || '');
      });
    }
    setEditingFields(fields);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditingFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (editingContent) {
      onUpdateContent(editingContent.id, editingFields);
      setEditingContent(null);
      setEditingFields({});
    }
  };

  const handleCancel = () => {
    setEditingContent(null);
    setEditingFields({});
  };

  const handleAddSection = async () => {
    if (!newSectionPage || !newSectionName) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const template = PAGE_TEMPLATES[newSectionPage]?.sections.find(s => s.name === newSectionName);
    const initialData: Record<string, string> = {};
    template?.fields.forEach(f => { initialData[f.key] = ""; });

    const { error } = await supabase.from("site_content").insert({
      page_name: newSectionPage,
      section_name: newSectionName,
      content_type: "text",
      content_data: initialData,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add section", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Section added successfully" });
      setAddDialogOpen(false);
      setNewSectionPage("");
      setNewSectionName("");
      // Trigger refresh via parent
      window.location.reload();
    }
  };

  const getFieldsForSection = (pageName: string, sectionName: string): ContentField[] => {
    const template = PAGE_TEMPLATES[pageName]?.sections.find(s => s.name === sectionName);
    if (template) {
      return template.fields;
    }
    // Fallback: create fields from existing content_data
    return [];
  };

  const renderContentEditor = (content: any) => {
    const isEditing = editingContent?.id === content.id;
    const templateFields = getFieldsForSection(content.page_name, content.section_name);
    const contentData = content.content_data || {};

    // Use template fields or generate from content_data
    const fields = templateFields.length > 0 
      ? templateFields 
      : Object.keys(contentData).map(key => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: key.includes('content') || key.includes('description') || key.includes('subtitle') ? 'textarea' as const : 'text' as const,
          value: String(contentData[key] || '')
        }));

    return (
      <Card key={content.id} className="border-border/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlignLeft className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-medium capitalize">{content.section_name.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <ShortId id={content.id} />
                <Badge variant="outline" className="text-xs">{content.content_type}</Badge>
              </div>
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1.5">
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => handleStartEdit(content)} className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
        
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      value={editingFields[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={editingFields[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => {
                const value = contentData[field.key];
                return (
                  <div key={field.key} className="group">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {field.label}
                    </div>
                    <div className="text-sm p-3 rounded-lg bg-background/50 border border-border/30 min-h-[40px]">
                      {value || <span className="text-muted-foreground/50 italic">Not set</span>}
                    </div>
                  </div>
                );
              })}
              {fields.length === 0 && Object.keys(contentData).length > 0 && (
                <pre className="text-sm overflow-auto font-mono bg-background/50 p-4 rounded-md text-muted-foreground">
                  {JSON.stringify(contentData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const availableSections = newSectionPage 
    ? PAGE_TEMPLATES[newSectionPage]?.sections.filter(
        s => !groupedContent[newSectionPage]?.some(c => c.section_name === s.name)
      ) || []
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Site Content Management
              </CardTitle>
              <CardDescription className="mt-1">
                Edit page content across your website ({siteContent.length} sections)
              </CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Content Section</DialogTitle>
                  <DialogDescription>
                    Choose a page and section to add editable content.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Page</Label>
                    <Select value={newSectionPage} onValueChange={setNewSectionPage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAGE_TEMPLATES).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newSectionPage && (
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={newSectionName} onValueChange={setNewSectionName}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSections.map(section => (
                            <SelectItem key={section.name} value={section.name}>
                              {section.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                          {availableSections.length === 0 && (
                            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                              All sections for this page already exist
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button 
                    onClick={handleAddSection} 
                    className="w-full" 
                    disabled={!newSectionPage || !newSectionName}
                  >
                    Add Section
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Page Tabs */}
      {pages.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              All Pages
            </TabsTrigger>
            {pages.map(page => (
              <TabsTrigger key={page} value={page} className="gap-2 capitalize">
                <FileText className="h-4 w-4" />
                {page}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-6">
            {pages.map(pageName => (
              <div key={pageName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold capitalize">{pageName} Page</h3>
                  <Badge variant="outline">{groupedContent[pageName].length} sections</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedContent[pageName].map(content => renderContentEditor(content))}
                </div>
              </div>
            ))}
          </TabsContent>

          {pages.map(pageName => (
            <TabsContent key={pageName} value={pageName} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {groupedContent[pageName].map(content => renderContentEditor(content))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No content sections found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by adding content sections to control the text and information displayed across your website.
            </p>
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Section
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
