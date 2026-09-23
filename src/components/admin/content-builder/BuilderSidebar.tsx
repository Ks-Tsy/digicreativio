import { Type, Image, Heading1, LayoutGrid, FileText, Edit2, Plus } from "lucide-react";
import { BuilderElement } from "./types";

interface BuilderSidebarProps {
  pageTemplates: any[];
  pageElements: BuilderElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddSection: (sectionTemplate: any) => void;
}

export function BuilderSidebar({ pageTemplates, pageElements, selectedId, onSelect, onAddSection }: BuilderSidebarProps) {
  return (
    <div className="w-[340px] border-r border-slate-800 bg-slate-950 h-full flex flex-col shadow-[2px_0_10px_-4px_rgba(0,0,0,0.5)] z-10 relative shrink-0">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="font-bold text-sm tracking-wide text-slate-200">Page Sections</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">Editable Sections</h3>
          <div className="space-y-2">
            {pageTemplates.map((template) => {
              const existingElement = pageElements.find(el => el.section_name === template.name);
              const isSelected = existingElement && selectedId === existingElement.id;

              return (
                <button
                  key={template.name}
                  onClick={() => existingElement ? onSelect(existingElement.id) : onAddSection(template)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary/20 text-primary' : (existingElement ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 border border-slate-800 text-slate-500')
                    }`}>
                      {existingElement ? <Edit2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate capitalize ${
                        isSelected ? 'text-primary' : (existingElement ? 'text-slate-300' : 'text-slate-500')
                      }`}>
                        {template.name.replace(/_/g, " ")}
                      </p>
                      {!existingElement && (
                        <p className="text-[10px] text-slate-500 font-medium">Click to edit</p>
                      )}
                    </div>
                  </div>
                  {!existingElement && (
                    <div className="shrink-0 h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                      <Plus className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
            
            {pageTemplates.length === 0 && (
              <div className="text-center p-6 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                No editable sections found.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Text Blocks</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border border-slate-100 opacity-40 cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors">
              <Heading1 className="h-6 w-6 text-slate-500 mb-2" />
              <span className="text-[10px] font-medium text-slate-600">Headline</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border border-slate-100 opacity-40 cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors">
              <Type className="h-6 w-6 text-slate-500 mb-2" />
              <span className="text-[10px] font-medium text-slate-600">Sub-Head</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border border-slate-100 opacity-40 cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors">
              <FileText className="h-6 w-6 text-slate-500 mb-2" />
              <span className="text-[10px] font-medium text-slate-600">Body Text</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Media Blocks</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border border-slate-100 opacity-40 cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors">
              <Image className="h-6 w-6 text-slate-500 mb-2" />
              <span className="text-[10px] font-medium text-slate-600">Image</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border border-slate-100 opacity-40 cursor-not-allowed bg-slate-50 hover:bg-slate-100 transition-colors">
              <LayoutGrid className="h-6 w-6 text-slate-500 mb-2" />
              <span className="text-[10px] font-medium text-slate-600">Gallery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
