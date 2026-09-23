import { BuilderElement } from "./types";
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Contact from '@/pages/Contact';
import { useEffect } from "react";

interface BuilderCanvasProps {
  elements: BuilderElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectSectionName?: (name: string) => void;
  onReorder: (newElements: BuilderElement[]) => void;
  pageName: string;
}

export function BuilderCanvas({ pageName, onSelect, onSelectSectionName, elements, selectedId }: BuilderCanvasProps) {
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
      default:
        return (
          <div className="p-8 text-center bg-slate-900 text-slate-400 rounded-xl">
            Preview not available for page: {pageName}
          </div>
        );
    }
  };

  useEffect(() => {
    const selectedElement = elements.find(el => el.id === selectedId);
    const selectedSectionName = selectedElement?.section_name;
    
    const sections = document.querySelectorAll('.builder-canvas-wrapper [data-section-id]');
    sections.forEach((section) => {
      const sectionName = section.getAttribute('data-section-id');
      if (sectionName === selectedSectionName) {
        section.setAttribute('data-selected', 'true');
      } else {
        section.removeAttribute('data-selected');
      }
    });
  }, [selectedId, elements]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const sectionEl = target.closest('[data-section-id]');
    
    if (sectionEl) {
      e.stopPropagation();
      e.preventDefault();
      const sectionName = sectionEl.getAttribute('data-section-id');
      if (sectionName && onSelectSectionName) {
        onSelectSectionName(sectionName);
      }
    } else {
      onSelect('');
    }
  };

  return (
    <div 
      className="flex-1 overflow-y-auto bg-background relative builder-canvas-wrapper"
      onClick={handleCanvasClick}
    >
      <style>{`
        .builder-canvas-wrapper [data-section-id] {
          cursor: pointer;
          position: relative;
        }
        
        .builder-canvas-wrapper [data-section-id]::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px dashed transparent;
          pointer-events: none;
          z-index: 50;
          transition: all 0.2s ease;
        }
        
        .builder-canvas-wrapper [data-section-id]:hover::before {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .builder-canvas-wrapper [data-section-id][data-selected="true"]::before {
          border-color: #3b82f6;
          border-style: solid;
          background: rgba(59, 130, 246, 0.02);
        }
      `}</style>
      <div className="min-h-full w-full">
        {renderPage()}
      </div>
    </div>
  );
}
