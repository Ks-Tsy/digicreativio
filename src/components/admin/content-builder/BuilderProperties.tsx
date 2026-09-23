import { useState } from "react";
import { BuilderElement, ActiveTab } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { PAGE_TEMPLATES } from "@/utils/defaultContent";

interface BuilderPropertiesProps {
  selectedElement: BuilderElement | null;
  onUpdateElement: (id: string, data: Record<string, any>) => void;
  onDeleteElement: (id: string) => void;
}

export function BuilderProperties({ selectedElement, onUpdateElement, onDeleteElement }: BuilderPropertiesProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('customization');

  if (!selectedElement) {
    return (
      <div className="w-[340px] border-l border-slate-800 bg-slate-950 h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 shrink-0">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <p className="text-sm">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const templateFields = PAGE_TEMPLATES[selectedElement.page_name]?.sections.find(
    s => s.name === selectedElement.section_name
  )?.fields || [];
  
  const contentData = selectedElement.content_data || {};

  const fields = templateFields.length > 0
    ? templateFields
    : Object.keys(contentData).map(key => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: key.includes('content') || key.includes('description') || key.includes('subtitle') ? 'textarea' as const : 'text' as const,
        value: String(contentData[key] || '')
      }));

  const handleChange = (key: string, value: string) => {
    onUpdateElement(selectedElement.id, {
      ...contentData,
      [key]: value
    });
  };

  return (
    <div className="w-[340px] border-l border-slate-800 bg-slate-950 h-full flex flex-col shadow-[-2px_0_10px_-4px_rgba(0,0,0,0.5)] z-10 relative shrink-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full flex flex-col h-full">
          <TabsList className="w-full h-[72px] rounded-none bg-slate-950 p-0 border-b border-slate-800 shrink-0">
            <TabsTrigger 
              value="themes" 
              className="flex-1 h-full rounded-none font-bold tracking-wide uppercase text-[11px] text-slate-500 data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-primary data-[state=active]:shadow-none transition-all"
            >
              Themes
            </TabsTrigger>
            <TabsTrigger 
              value="customization" 
              className="flex-1 h-full rounded-none font-bold tracking-wide uppercase text-[11px] text-slate-500 data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-primary data-[state=active]:shadow-none transition-all"
            >
              Customization
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
            <TabsContent value="themes" className="mt-0 space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Color Palette</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
                    <span className="text-xs font-semibold text-slate-400">Background</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-950 border border-slate-800 cursor-pointer shadow-sm"></div>
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
                    <span className="text-xs font-semibold text-slate-400">Text</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200 cursor-pointer shadow-sm"></div>
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
                    <span className="text-xs font-semibold text-slate-400">Primary Button</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#F97316] cursor-pointer shadow-sm"></div>
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Font</h3>
                <Select defaultValue="inter">
                  <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-200 h-11 rounded-xl shadow-sm">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="outfit">Outfit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="customization" className="mt-0 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold capitalize text-slate-200">
                    {selectedElement.section_name.replace(/_/g, ' ')} Content
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteElement(selectedElement.id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-5">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {field.label}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.key}
                          value={contentData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          className="min-h-[120px] resize-y bg-slate-900 border-slate-800 focus:border-primary focus:ring-primary/20 transition-all text-sm rounded-xl shadow-sm p-4 text-slate-200"
                        />
                      ) : (
                        <Input
                          id={field.key}
                          value={contentData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          className="bg-slate-900 border-slate-800 focus:border-primary focus:ring-primary/20 transition-all text-sm rounded-xl shadow-sm h-11 px-4 text-slate-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
