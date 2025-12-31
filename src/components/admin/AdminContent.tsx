import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, FileText } from "lucide-react";
import { ShortId } from "@/components/ShortId";

interface AdminContentProps {
  siteContent: any[];
  onUpdateContent: (id: string, data: any) => void;
}

export function AdminContent({ siteContent, onUpdateContent }: AdminContentProps) {
  const [editingContent, setEditingContent] = useState<any>(null);

  const handleSave = () => {
    if (editingContent) {
      onUpdateContent(editingContent.id, editingContent.content_data);
      setEditingContent(null);
    }
  };

  const groupedContent = siteContent.reduce((acc, content) => {
    if (!acc[content.page_name]) {
      acc[content.page_name] = [];
    }
    acc[content.page_name].push(content);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Site Content Management</CardTitle>
          <CardDescription>
            Edit page content across your website ({siteContent.length} sections)
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(groupedContent).map(([pageName, contents]) => (
        <Card key={pageName} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-info" />
              <CardTitle className="text-lg capitalize">{pageName} Page</CardTitle>
              <Badge variant="outline" className="ml-2">
                {(contents as any[]).length} sections
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(contents as any[]).map((content) => (
              <div
                key={content.id}
                className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="font-medium capitalize">{content.section_name}</span>
                    <ShortId id={content.id} />
                  </div>
                  {editingContent?.id === content.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingContent(null)}
                        className="gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingContent(content)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  )}
                </div>
                <div className="p-4">
                  {editingContent?.id === content.id ? (
                    <Textarea
                      value={JSON.stringify(editingContent.content_data, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setEditingContent({ ...editingContent, content_data: parsed });
                        } catch (err) {
                          // Invalid JSON
                        }
                      }}
                      className="font-mono text-sm min-h-[200px] bg-background"
                      placeholder="JSON content"
                    />
                  ) : (
                    <pre className="text-sm overflow-auto font-mono bg-background/50 p-4 rounded-md">
                      {JSON.stringify(content.content_data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {siteContent.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            No content sections found
          </CardContent>
        </Card>
      )}
    </div>
  );
}