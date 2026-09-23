import { useState, useMemo } from "react";
import { BuilderElement } from "./types";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderProperties } from "./BuilderProperties";
import { PAGE_TEMPLATES } from "@/utils/defaultContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { BuilderContext } from "./BuilderContext";

interface ContentBuilderProps {
  siteContent: any[];
  onUpdateContent: (id: string, data: any) => void;
  onExit: () => void; // To go back to the regular admin view if we were full-screen
}

export function ContentBuilder({ siteContent, onUpdateContent, onExit }: ContentBuilderProps) {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<any[]>(siteContent);
  const { toast } = useToast();

  // Sync localContent if siteContent changes externally
  useMemo(() => {
    setLocalContent(siteContent);
  }, [siteContent]);

  // Elements for current page
  const pageElements = localContent.filter(c => c.page_name === currentPage);
  
  // All editable templates for this page
  const pageTemplates = PAGE_TEMPLATES[currentPage]?.sections || [];

  const handleAddSection = async (template: any) => {
    const initialData: Record<string, string> = {};
    template.fields.forEach((f: any) => { initialData[f.key] = ""; });

    // Optimistic UI update can be complex here, so we'll just use Supabase then reload for now
    // as it matches existing logic, or we can just append it locally and force a save.
    const { data, error } = await supabase.from("site_content").insert({
      page_name: currentPage,
      section_name: template.name,
      content_type: "text",
      content_data: initialData,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: "Failed to add section", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Section added successfully" });
      setLocalContent([...localContent, data]);
      setSelectedElementId(data.id);
    }
  };

  const handleDeleteSection = async (id: string) => {
    const { error } = await supabase.from("site_content").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete section", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Section deleted" });
      setLocalContent(localContent.filter(c => c.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    }
  };

  const handleUpdateElement = (id: string, data: any) => {
    // Update locally for fast preview
    setLocalContent(prev => prev.map(c => c.id === id ? { ...c, content_data: data } : c));
  };

  const handleSaveProgress = async () => {
    // Save all modifications made to the local state
    // For simplicity, we save the currently selected element's modifications
    if (selectedElementId) {
      const element = localContent.find(c => c.id === selectedElementId);
      if (element) {
        onUpdateContent(element.id, element.content_data);
      }
    } else {
      toast({ title: "Info", description: "Select an element to save its changes." });
    }
  };

  const handleReorder = (newElements: BuilderElement[]) => {
    // Update order visually (Supabase doesn't have an order column currently for site_content,
    // so this is strictly visual for this session unless we add it to the schema)
    const newContent = [...localContent.filter(c => c.page_name !== currentPage), ...newElements];
    setLocalContent(newContent);
  };

  const handleSelectSectionName = (name: string) => {
    const existingElement = pageElements.find(el => el.section_name === name);
    if (existingElement) {
      setSelectedElementId(existingElement.id);
    } else {
      const template = pageTemplates.find(t => t.name === name);
      if (template) {
        handleAddSection(template);
      }
    }
  };

  const selectedElement = localContent.find(c => c.id === selectedElementId) || null;

  return (
    <BuilderContext.Provider value={localContent}>
      <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans text-slate-200">
        {/* Top Header */}
        <header className="h-[72px] bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20 relative">
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium" onClick={onExit}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">1</div>
              <span className="text-sm font-semibold text-slate-800">Create Page</span>
              <span className="text-slate-300 mx-1">&gt;</span>
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">2</div>
              <span className="text-sm font-medium text-slate-400">Publish</span>
            </div>
          </div>

          <div className="flex flex-1 justify-center px-10">
            <div className="w-64">
              <Select value={currentPage} onValueChange={(v) => { setCurrentPage(v); setSelectedElementId(null); }}>
                <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20 text-slate-700 font-medium h-10">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PAGE_TEMPLATES).map((key) => (
                    <SelectItem key={key} value={key} className="capitalize font-medium">{key} Page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-indigo-600 border-indigo-200 bg-white hover:bg-indigo-50 font-medium h-10 px-6 rounded-md" onClick={handleSaveProgress}>
              Save Progress
            </Button>
            <Button className="bg-[#3D47A9] hover:bg-[#3D47A9]/90 text-white font-medium h-10 px-8 rounded-md shadow-sm">
              Publish
            </Button>
            <div className="h-10 w-10 rounded-full bg-[#3D47A9] text-white flex items-center justify-center text-sm font-bold ml-2 cursor-pointer shadow-sm border-2 border-white ring-2 ring-slate-100">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <BuilderSidebar 
            pageTemplates={pageTemplates}
            onAddSection={handleAddSection}
            pageElements={pageElements}
            selectedId={selectedElementId}
            onSelect={setSelectedElementId}
          />
          
          <BuilderCanvas 
            elements={pageElements}
            selectedId={selectedElementId}
            onSelect={setSelectedElementId}
            onSelectSectionName={handleSelectSectionName}
            onReorder={handleReorder}
            pageName={currentPage}
          />
          
          <BuilderProperties 
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteSection}
          />
        </div>
      </div>
    </BuilderContext.Provider>
  );
}
