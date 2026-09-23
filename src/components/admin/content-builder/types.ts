export type BuilderElement = {
  id: string;
  page_name: string;
  section_name: string;
  content_type: string;
  content_data: Record<string, any>;
};

export type ActiveTab = 'themes' | 'customization';
