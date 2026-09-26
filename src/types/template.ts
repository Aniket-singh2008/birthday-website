/**
 * DYNAMIC TEMPLATE & MEDIA SYSTEM TYPES
 */

export type MediaType = 'image' | 'gif' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // Base64 data URL, Blob URL, or external URL
  filename: string;
  mimeType: string;
  size: number; // in bytes
  caption?: string;
  createdAt: string;
}

export type TemplateLayoutStyle = 'showcase' | 'card' | 'story' | 'grid';

export interface TemplateItem {
  id: string;
  number: number;
  name: string; // e.g. "Template 1", "Template 2"
  title: string;
  subtitle?: string;
  content?: string;
  themeColor?: string; // 'purple' | 'pink' | 'amber' | 'emerald' | 'sky' | 'rose'
  layoutStyle?: TemplateLayoutStyle;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export type CreateTemplateMode = 'blank' | 'duplicate' | 'from_existing';

export interface CreateTemplateInput {
  name?: string;
  title: string;
  subtitle?: string;
  content?: string;
  themeColor?: string;
  layoutStyle?: TemplateLayoutStyle;
  sourceTemplateId?: string; // if duplicating or creating from existing
  copyMedia?: boolean;
  initialMedia?: MediaItem[];
}
