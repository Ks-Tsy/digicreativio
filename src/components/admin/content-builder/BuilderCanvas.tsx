import React, { useState, useEffect, useRef } from "react";
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import Portfolio from '@/pages/Portfolio';
import Blog from '@/pages/Blog';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { PAGE_TEMPLATES } from "@/utils/defaultContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Check, RotateCcw, Edit3, Sparkles, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ActiveEditState {
  sectionName: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  initialValue: string;
  currentValue: string;
  availableFields: { key: string; label: string; type: string; value: string }[];
  targetRect: DOMRect | null;
}

interface BuilderCanvasProps {
  pageName: string;
  elements: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateSectionData: (pageName: string, sectionName: string, newData: Record<string, any>) => void;
  onSelectSectionName?: (name: string) => void;
}

export function BuilderCanvas({
  pageName,
  elements,
  selectedId,
  onSelect,
  onUpdateSectionData,
}: BuilderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEdit, setActiveEdit] = useState<ActiveEditState | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<{ label: string; rect: DOMRect } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const renderPage = () => {
    switch (pageName) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      case 'portfolio':
        return <Portfolio />;
      case 'blog':
        return <Blog />;
      case 'navbar':
        return (
          <div className="min-h-screen bg-background relative pt-28">
            <Navbar />
            <div className="p-8 text-center text-slate-300 text-sm border border-border/20 max-w-3xl mx-auto mt-12 bg-card/40 rounded-2xl backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-heading font-bold text-foreground mb-1">Header & Navbar Settings</h3>
              <p className="text-muted-foreground text-xs">Click on the logo, brand name, or "Get Started" CTA button in the header above to edit live.</p>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="min-h-screen flex flex-col justify-between bg-background">
            <div className="p-8 text-center text-slate-300 text-sm border-b border-border/20 max-w-3xl mx-auto mt-8 bg-card/40 rounded-2xl backdrop-blur-md">
              <h3 className="text-xl font-heading font-bold text-foreground mb-1">Footer Content Showcase</h3>
              <p className="text-muted-foreground text-xs">Click on any text, logo, or contact detail in the footer below to edit.</p>
            </div>
            <Footer />
          </div>
        );
      default:
        return (
          <div className="p-8 text-center bg-slate-900 text-slate-400 rounded-xl">
            Preview not available for page: {pageName}
          </div>
        );
    }
  };

  // Close active edit if page changes
  useEffect(() => {
    setActiveEdit(null);
    setHoveredBadge(null);
  }, [pageName]);

  // Handle clicks on canvas to open in-place editor
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if click was inside an editable field
    const fieldEl = target.closest('[data-editable-field]') as HTMLElement | null;
    const sectionEl = target.closest('[data-section-id]') as HTMLElement | null;

    if (fieldEl || sectionEl) {
      e.preventDefault();
      e.stopPropagation();

      const sectionName = (sectionEl?.getAttribute('data-section-id') ||
        fieldEl?.closest('[data-section-id]')?.getAttribute('data-section-id') ||
        'hero').toLowerCase();

      // Find template for this section
      const pageTemplate = PAGE_TEMPLATES[pageName];
      const sectionTemplate = pageTemplate?.sections.find(
        (s) => s.name.toLowerCase() === sectionName
      );

      const availableFields = sectionTemplate?.fields || [];

      // Find current section element in elements array
      const currentElement = elements.find(
        (el) => el.page_name === pageName && el.section_name.toLowerCase() === sectionName
      );
      const currentContentData = currentElement?.content_data || {};

      let fieldKey = '';
      let fieldLabel = '';
      let fieldType = 'text';

      if (fieldEl) {
        fieldKey = fieldEl.getAttribute('data-editable-field') || '';
        fieldLabel = fieldEl.getAttribute('data-field-label') || fieldKey;
        fieldType = fieldEl.getAttribute('data-field-type') || 'text';
      } else if (availableFields.length > 0) {
        // Fallback to first field of section
        fieldKey = availableFields[0].key;
        fieldLabel = availableFields[0].label;
        fieldType = availableFields[0].type || 'text';
      }

      // If field was matched in template, use template's config
      const matchedField = availableFields.find((f) => f.key === fieldKey);
      if (matchedField) {
        fieldLabel = matchedField.label;
        fieldType = matchedField.type;
      }

      // Auto-detect image type if key or label suggests an image/photo/logo
      if (
        fieldKey.toLowerCase().includes('image') ||
        fieldKey.toLowerCase().includes('logo') ||
        fieldKey.toLowerCase().includes('cover') ||
        fieldKey.toLowerCase().includes('photo')
      ) {
        fieldType = 'image';
      }

      const rect = (fieldEl || sectionEl)?.getBoundingClientRect() || null;
      const initialVal = String(
        currentContentData[fieldKey] !== undefined
          ? currentContentData[fieldKey]
          : matchedField?.value || ''
      );

      setActiveEdit({
        sectionName,
        fieldKey,
        fieldLabel: fieldLabel || fieldKey,
        fieldType,
        initialValue: initialVal,
        currentValue: initialVal,
        availableFields: availableFields.map((f) => ({
          ...f,
          value: String(currentContentData[f.key] !== undefined ? currentContentData[f.key] : f.value),
        })),
        targetRect: rect,
      });

      if (currentElement) {
        onSelect(currentElement.id);
      }
    } else {
      // Clicked on non-editable canvas background
      if (activeEdit) {
        handleSaveEdit();
      }
    }
  };

  // Handle mouse move for hover badges
  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeEdit) {
      if (hoveredBadge) setHoveredBadge(null);
      return;
    }

    const target = e.target as HTMLElement;
    const fieldEl = target.closest('[data-editable-field]') as HTMLElement | null;

    if (fieldEl) {
      const label = fieldEl.getAttribute('data-field-label') || 'Text';
      const rect = fieldEl.getBoundingClientRect();
      setHoveredBadge({ label, rect });
    } else {
      const sectionEl = target.closest('[data-section-id]') as HTMLElement | null;
      if (sectionEl) {
        const sectionName = sectionEl.getAttribute('data-section-id') || '';
        const rect = sectionEl.getBoundingClientRect();
        setHoveredBadge({
          label: `${sectionName.replace(/_/g, ' ')} (Click to edit)`,
          rect,
        });
      } else {
        if (hoveredBadge) setHoveredBadge(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredBadge(null);
  };

  // When user edits text in active popover
  const handleValueChange = (newVal: string) => {
    if (!activeEdit) return;

    setActiveEdit({
      ...activeEdit,
      currentValue: newVal,
    });

    // Real-time live update on the page!
    onUpdateSectionData(pageName, activeEdit.sectionName, {
      [activeEdit.fieldKey]: newVal,
    });
  };

  // Handle photo/image upload from local device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeEdit) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `content-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // Try uploading to Supabase Storage bucket
      const { error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-files')
          .getPublicUrl(fileName);

        handleValueChange(publicUrl);
        toast({ title: "Photo Uploaded", description: "Image uploaded and applied." });
      } else {
        // Fallback to Base64 Data URL so local/offline always works
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          handleValueChange(dataUrl);
          toast({ title: "Photo Applied", description: "Image applied successfully." });
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to Base64
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        handleValueChange(dataUrl);
        toast({ title: "Photo Applied", description: "Image applied successfully." });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Switch to another field of the same section in the popover
  const handleSwitchField = (field: { key: string; label: string; type: string; value: string }) => {
    if (!activeEdit) return;

    const currentElement = elements.find(
      (el) => el.page_name === pageName && el.section_name.toLowerCase() === activeEdit.sectionName
    );
    const currentContentData = currentElement?.content_data || {};
    const val = String(
      currentContentData[field.key] !== undefined ? currentContentData[field.key] : field.value
    );

    let resolvedType = field.type;
    if (
      field.key.toLowerCase().includes('image') ||
      field.key.toLowerCase().includes('logo') ||
      field.key.toLowerCase().includes('cover')
    ) {
      resolvedType = 'image';
    }

    setActiveEdit({
      ...activeEdit,
      fieldKey: field.key,
      fieldLabel: field.label,
      fieldType: resolvedType,
      initialValue: val,
      currentValue: val,
    });
  };

  // Save and close
  const handleSaveEdit = () => {
    if (activeEdit) {
      toast({
        title: "Updated",
        description: `Updated ${activeEdit.fieldLabel}`,
      });
      setActiveEdit(null);
    }
  };

  // Revert back to value before opening popover
  const handleRevert = () => {
    if (!activeEdit) return;
    onUpdateSectionData(pageName, activeEdit.sectionName, {
      [activeEdit.fieldKey]: activeEdit.initialValue,
    });
    setActiveEdit({
      ...activeEdit,
      currentValue: activeEdit.initialValue,
    });
    toast({
      title: "Reverted",
      description: `Reverted ${activeEdit.fieldLabel} to original`,
    });
  };

  // Calculate popover coordinates
  const getPopoverPosition = () => {
    if (!activeEdit?.targetRect) {
      return { top: 120, left: window.innerWidth / 2 - 240 };
    }

    const rect = activeEdit.targetRect;
    const popoverWidth = 480;
    const popoverHeight = activeEdit.fieldType === 'image' ? 380 : 320;

    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    // Keep horizontally within screen
    if (left < 20) left = 20;
    if (left + popoverWidth > window.innerWidth - 20) {
      left = window.innerWidth - popoverWidth - 20;
    }

    // Try placing below target
    let top = rect.bottom + 12;
    // If not enough room below, place above target
    if (top + popoverHeight > window.innerHeight - 20) {
      top = rect.top - popoverHeight - 12;
    }
    // If still out of viewport, position at top comfortable offset
    if (top < 80) {
      top = 90;
    }

    return { top, left };
  };

  const popoverPos = getPopoverPosition();
  const isImageField =
    activeEdit?.fieldType === 'image' ||
    activeEdit?.fieldKey.toLowerCase().includes('image') ||
    activeEdit?.fieldKey.toLowerCase().includes('logo') ||
    activeEdit?.fieldKey.toLowerCase().includes('cover');

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-background relative builder-canvas-wrapper selection:bg-primary/30"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        /* Highlight editable fields */
        .builder-canvas-wrapper [data-editable-field] {
          cursor: pointer !important;
          position: relative;
          outline: 1.5px dashed rgba(99, 102, 241, 0.45) !important;
          outline-offset: 4px;
          border-radius: 6px;
          transition: all 0.2s ease-in-out;
        }

        .builder-canvas-wrapper [data-editable-field]:hover {
          outline: 2px solid #6366f1 !important;
          outline-offset: 4px;
          background: rgba(99, 102, 241, 0.08) !important;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
        }

        /* Section boundaries */
        .builder-canvas-wrapper [data-section-id] {
          position: relative;
        }

        .builder-canvas-wrapper [data-section-id]::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px dashed rgba(255, 255, 255, 0.05);
          pointer-events: none;
          z-index: 20;
        }

        /* Intercept button and link clicks inside canvas */
        .builder-canvas-wrapper a, 
        .builder-canvas-wrapper button {
          cursor: pointer !important;
        }
      `}</style>

      {/* Floating subtle helper banner at top */}
      <div className="sticky top-4 z-40 flex justify-center pointer-events-none px-4">
        <div className="bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Click any text, photo, button or card directly to edit</span>
        </div>
      </div>

      {/* Hover Floating Pill Tag */}
      {hoveredBadge && !activeEdit && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-75 ease-out"
          style={{
            top: Math.max(75, hoveredBadge.rect.top - 28),
            left: Math.max(10, hoveredBadge.rect.left),
          }}
        >
          <div className="bg-indigo-600 text-white text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md shadow-lg flex items-center gap-1.5 uppercase animate-in fade-in zoom-in-95">
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <span>Click to edit: {hoveredBadge.label}</span>
          </div>
        </div>
      )}

      {/* Main Page Rendering */}
      <div className="min-h-full w-full pb-32">
        {renderPage()}
      </div>

      {/* IN-PLACE FLOATING EDIT POPOVER */}
      {activeEdit && (
        <>
          {/* Subtle click-away backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={handleSaveEdit}
          />

          {/* Floating Editor Card */}
          <div
            className="fixed z-50 w-[480px] bg-slate-950/95 border border-indigo-500/50 rounded-2xl shadow-2xl backdrop-blur-2xl p-5 text-slate-100 animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {pageName} • {activeEdit.sectionName.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeEdit.fieldLabel}
                </span>
              </div>
              <button
                onClick={handleSaveEdit}
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Switcher for Other Fields in Same Section */}
            {activeEdit.availableFields.length > 1 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Section Fields
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {activeEdit.availableFields.map((f) => {
                    const isSelected = f.key === activeEdit.fieldKey;
                    return (
                      <button
                        key={f.key}
                        onClick={() => handleSwitchField(f)}
                        className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all font-medium ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Controls */}
            <div className="space-y-2 mb-4">
              <Label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>{activeEdit.fieldLabel}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Live preview active
                </span>
              </Label>

              {/* Photo / Image Editor */}
              {isImageField ? (
                <div className="space-y-3">
                  {activeEdit.currentValue && (
                    <div className="relative h-28 w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={activeEdit.currentValue}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      type="text"
                      value={activeEdit.currentValue}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder="Enter photo/image URL (https://...)"
                      className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-10 flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white border-0 gap-1.5 h-10 px-3.5 text-xs font-semibold"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Upload an image file from your device or paste any image URL.
                  </p>
                </div>
              ) : activeEdit.fieldType === 'textarea' ? (
                <Textarea
                  autoFocus
                  value={activeEdit.currentValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={`Enter ${activeEdit.fieldLabel.toLowerCase()}...`}
                  rows={4}
                  className="w-full bg-slate-900 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm rounded-xl p-3 resize-y"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSaveEdit();
                    }
                  }}
                />
              ) : (
                <Input
                  autoFocus
                  type="text"
                  value={activeEdit.currentValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={`Enter ${activeEdit.fieldLabel.toLowerCase()}...`}
                  className="w-full bg-slate-900 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm rounded-xl h-11 px-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit();
                    }
                  }}
                />
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400">
                {activeEdit.fieldType === 'textarea' ? 'Ctrl+Enter to save' : 'Enter to save'}
              </div>

              <div className="flex items-center gap-2">
                {activeEdit.currentValue !== activeEdit.initialValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRevert}
                    className="h-8 px-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    title="Revert changes"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-8 px-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Done
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
