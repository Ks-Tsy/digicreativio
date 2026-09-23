import { ContentBuilder } from "./content-builder/ContentBuilder";

interface AdminContentProps {
  siteContent: any[];
  onUpdateContent: (id: string, data: any) => void;
  onExit: () => void;
}

export function AdminContent({ siteContent, onUpdateContent, onExit }: AdminContentProps) {
  return (
    <ContentBuilder 
      siteContent={siteContent} 
      onUpdateContent={onUpdateContent}
      onExit={onExit} 
    />
  );
}
