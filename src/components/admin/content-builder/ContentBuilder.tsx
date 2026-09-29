import { useState, useMemo } from "react";
import { BuilderCanvas } from "./BuilderCanvas";
import { PAGE_TEMPLATES } from "@/utils/defaultContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Globe, Palette, Check, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BuilderContext } from "./BuilderContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ContentBuilderProps {
  siteContent: any[];
  onUpdateContent: (id: string, data: any) => Promise<void> | void;
  onExit: () => void;
}

export function ContentBuilder({ siteContent, onUpdateContent, onExit }: ContentBuilderProps) {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<any[]>(siteContent);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [hasUnpublishedDraft, setHasUnpublishedDraft] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [themeFont, setThemeFont] = useState<string>("inter");
  const { toast } = useToast();

  // Sync localContent if siteContent changes externally
  useMemo(() => {
    setLocalContent(siteContent);
  }, [siteContent]);

  // Elements for current page
  const pageElements = localContent.filter((c) => c.page_name === currentPage);
  
  // All editable templates for this page
  const pageTemplates = PAGE_TEMPLATES[currentPage]?.sections || [];

  // Update section data in localContent
  const handleUpdateSectionData = (pageName: string, sectionName: string, newData: Record<string, any>) => {
    setLocalContent((prev) => {
      const index = prev.findIndex(
        (c) => c.page_name === pageName && c.section_name.toLowerCase() === sectionName.toLowerCase()
      );

      if (index >= 0) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          content_data: {
            ...(updated[index].content_data || {}),
            ...newData,
          },
        };
        return updated;
      } else {
        // Create from template defaults
        const pageTemplate = PAGE_TEMPLATES[pageName];
        const sectionTemplate = pageTemplate?.sections.find(
          (s) => s.name.toLowerCase() === sectionName.toLowerCase()
        );
        const defaultData: Record<string, string> = {};
        sectionTemplate?.fields.forEach((f) => {
          defaultData[f.key] = f.value;
        });

        return [
          ...prev,
          {
            id: `default-${pageName}-${sectionName}`,
            page_name: pageName,
            section_name: sectionName,
            content_type: "text",
            content_data: {
              ...defaultData,
              ...newData,
            },
          },
        ];
      }
    });

    setHasUnsavedChanges(true);
  };

  // Save progress as DRAFT only (does NOT change the live public website)
  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      const currentSections = localContent.filter((c) => c.page_name === currentPage);

      if (currentSections.length === 0) {
        for (const template of pageTemplates) {
          const defaultData: Record<string, string> = {};
          template.fields.forEach((f) => {
            defaultData[f.key] = f.value;
          });
          const draftPayload = {
            ...defaultData,
            _published: { ...defaultData },
            _is_published: false,
          };
          await onUpdateContent(`default-${currentPage}-${template.name}`, draftPayload);
        }
      } else {
        for (const item of currentSections) {
          const raw = item.content_data || {};
          // Preserve existing _published if present, so the live website is NOT touched
          const existingPublished = raw._published !== undefined ? raw._published : { ...raw };
          delete existingPublished._published;
          delete existingPublished._is_published;

          const draftPayload = {
            ...raw,
            _published: existingPublished,
            _is_published: false,
          };
          await onUpdateContent(item.id, draftPayload);
        }
      }

      setHasUnsavedChanges(false);
      setHasUnpublishedDraft(true);
      toast({
        title: "Draft Saved",
        description: `Edits saved as draft. The live website will not change until you click Publish.`,
      });
    } catch (err: any) {
      toast({
        title: "Error Saving",
        description: err.message || "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish to LIVE website (copies draft into _published)
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const currentSections = localContent.filter((c) => c.page_name === currentPage);

      if (currentSections.length === 0) {
        for (const template of pageTemplates) {
          const defaultData: Record<string, string> = {};
          template.fields.forEach((f) => {
            defaultData[f.key] = f.value;
          });
          const publishPayload = {
            ...defaultData,
            _published: { ...defaultData },
            _is_published: true,
          };
          await onUpdateContent(`default-${currentPage}-${template.name}`, publishPayload);
        }
      } else {
        for (const item of currentSections) {
          const cleanDraft = { ...(item.content_data || {}) };
          delete cleanDraft._published;
          delete cleanDraft._is_published;

          const publishPayload = {
            ...cleanDraft,
            _published: cleanDraft,
            _is_published: true,
          };
          await onUpdateContent(item.id, publishPayload);
        }
      }

      setHasUnsavedChanges(false);
      setHasUnpublishedDraft(false);
      toast({
        title: "Published Successfully!",
        description: `${PAGE_TEMPLATES[currentPage]?.label || currentPage} changes are now live on the website!`,
      });
    } catch (err: any) {
      toast({
        title: "Error Publishing",
        description: err.message || "Failed to publish content",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Smooth scroll to a section on the canvas
  const handleJumpToSection = (sectionName: string) => {
    const el = document.querySelector(`.builder-canvas-wrapper [data-section-id="${sectionName}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-4');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-4');
      }, 2000);
    }
  };

  return (
    <BuilderContext.Provider value={localContent}>
      <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans text-slate-200">
        {/* Top Header */}
        <header className="h-[72px] bg-slate-950/95 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 relative backdrop-blur-md">
          {/* Left: Go Back & Page Selector */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 font-medium"
              onClick={onExit}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <div className="h-6 w-px bg-slate-800"></div>

            {/* Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">PAGE:</span>
              <Select
                value={currentPage}
                onValueChange={(v) => {
                  setCurrentPage(v);
                  setSelectedElementId(null);
                }}
              >
                <SelectTrigger className="w-48 bg-slate-900 border-slate-700 text-slate-200 font-medium h-9 focus:ring-indigo-500/30">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  {Object.keys(PAGE_TEMPLATES).map((key) => (
                    <SelectItem key={key} value={key} className="capitalize font-medium focus:bg-indigo-600 focus:text-white">
                      {PAGE_TEMPLATES[key]?.label || `${key} Page`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jump to section quick selector */}
            {pageTemplates.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">JUMP TO:</span>
                <Select onValueChange={handleJumpToSection}>
                  <SelectTrigger className="w-44 bg-slate-900/60 border-slate-800 text-slate-400 text-xs h-9">
                    <SelectValue placeholder="Section..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {pageTemplates.map((template) => (
                      <SelectItem key={template.name} value={template.name} className="capitalize focus:bg-indigo-600 focus:text-white">
                        {template.name.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Center: Status indicator */}
          <div className="hidden md:flex items-center gap-2">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-2 text-xs font-medium text-amber-300 bg-amber-950/50 border border-amber-800/60 px-3 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Unsaved edits pending
              </span>
            ) : hasUnpublishedDraft ? (
              <span className="flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-950/40 border border-blue-800/60 px-3 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Draft saved (Not live yet)
              </span>
            ) : (
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                All changes saved
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Settings Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsThemeOpen(true)}
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 gap-1.5 h-9"
            >
              <Palette className="h-4 w-4 text-indigo-400" />
              <span className="hidden sm:inline">Theme</span>
            </Button>

            {/* Save Progress Button (Saves Draft without publishing) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
              disabled={isSaving || isPublishing}
              className={`h-9 px-4 font-semibold rounded-lg transition-all ${
                hasUnsavedChanges
                  ? "bg-slate-800 text-slate-100 border-indigo-500/60 hover:bg-slate-700 shadow-sm"
                  : "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Progress
                </>
              )}
            </Button>

            {/* Publish Button (Pushes to live site) */}
            <Button
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="bg-[#3D47A9] hover:bg-[#3D47A9]/90 text-white font-semibold h-9 px-5 rounded-lg shadow-sm"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-1.5" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Full-Width Canvas */}
        <div className="flex-1 flex overflow-hidden relative">
          <BuilderCanvas
            pageName={currentPage}
            elements={localContent}
            selectedId={selectedElementId}
            onSelect={setSelectedElementId}
            onUpdateSectionData={handleUpdateSectionData}
          />
        </div>

        {/* Theme Settings Modal */}
        <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
          <DialogContent className="bg-slate-950 border border-slate-800 text-slate-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
                <Palette className="w-5 h-5 text-indigo-400" />
                Theme & Styling Settings
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Customize global website appearance and typography
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-3">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Color Palette</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300">Background</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-black border border-slate-700 shadow-sm cursor-pointer"></div>
                      <span className="text-xs text-slate-400">Dark (#000000)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300">Text Color</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 border border-slate-700 shadow-sm cursor-pointer"></div>
                      <span className="text-xs text-slate-400">Light (#FFFFFF)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300">Primary Accent</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-indigo-500 border border-indigo-400 shadow-sm cursor-pointer"></div>
                      <span className="text-xs text-slate-400">Indigo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Font Family</h4>
                <Select value={themeFont} onValueChange={setThemeFont}>
                  <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-200 h-10 rounded-xl">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="inter">Inter (Clean & Modern)</SelectItem>
                    <SelectItem value="roboto">Roboto (Geometric)</SelectItem>
                    <SelectItem value="outfit">Outfit (Creative & Bold)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <Button
                  onClick={() => {
                    setIsThemeOpen(false);
                    toast({ title: "Theme Applied", description: "Global theme styles updated." });
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 h-9 rounded-lg"
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BuilderContext.Provider>
  );
}
