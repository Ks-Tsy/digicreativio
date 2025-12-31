import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { ShortId } from "@/components/ShortId";

interface AdminSettingsProps {
  siteSettings: any[];
  onUpdateSetting: (id: string, value: any) => void;
}

export function AdminSettings({ siteSettings, onUpdateSetting }: AdminSettingsProps) {
  // Group settings by type
  const groupedSettings = siteSettings.reduce((acc, setting) => {
    if (!acc[setting.setting_type]) {
      acc[setting.setting_type] = [];
    }
    acc[setting.setting_type].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Configure global settings for your website ({siteSettings.length} settings)
          </CardDescription>
        </CardHeader>
      </Card>

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
                    <div>
                      <h4 className="font-medium">{setting.setting_key}</h4>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    <ShortId id={setting.id} />
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
                        // Invalid JSON
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
            No settings found
          </CardContent>
        </Card>
      )}
    </div>
  );
}
