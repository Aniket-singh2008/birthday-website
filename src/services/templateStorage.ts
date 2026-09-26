/**
 * TEMPLATE STORAGE SERVICE
 * 
 * Uses IndexedDB for high-capacity persistent storage of templates and media (Images, GIFs, Videos)
 * with graceful localStorage fallback and automatic template numbering logic.
 */

import { TemplateItem, MediaItem, CreateTemplateInput } from '../types/template';

const DB_NAME = 'TemplateStudioDB_v1';
const STORE_NAME = 'templates';
const DB_VERSION = 1;
const LOCAL_STORAGE_BACKUP_KEY = 'templates_studio_data_v1';

/**
 * Open IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Initial Default Templates Seed
 */
function getInitialSeedTemplates(): TemplateItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'template-seed-1',
      number: 1,
      name: 'Template 1',
      title: 'Surprise Bunny & Bear Card',
      subtitle: 'Hey, I made something for you. Do you wanna see it?',
      content: 'A sweet animated surprise card featuring our beloved bunny & bear characters with an interactive gift reveal.',
      themeColor: 'purple',
      layoutStyle: 'showcase',
      isDefault: true,
      media: [
        {
          id: 'media-seed-1',
          type: 'gif',
          url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXVubHNzOGx6c2YzaWNuYmdtZXZxMWp4b294cXhkZ3pkMHltdjI5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l8oo4x3ByVK00/giphy.gif',
          filename: 'cute_bunny_bear_hug.gif',
          mimeType: 'image/gif',
          size: 145000,
          caption: 'Sweet hug animation',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'template-seed-2',
      number: 2,
      name: 'Template 2',
      title: 'Sweet Memories Storyboard',
      subtitle: 'Capturing our favorite little smiles and memories',
      content: 'Multi-media showcase for photos, GIFs, and videos arranged in an elegant pastel layout.',
      themeColor: 'pink',
      layoutStyle: 'story',
      isDefault: false,
      media: [
        {
          id: 'media-seed-2',
          type: 'gif',
          url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3UxeHNjcjl6eWJmODRqOXJtM2Jvbm9iN2NlejhqbWZ2dmh4d3VqNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZqbBT64ECtjy/giphy.gif',
          filename: 'sweet_love_moment.gif',
          mimeType: 'image/gif',
          size: 182000,
          caption: 'Cherished memories',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'template-seed-3',
      number: 3,
      name: 'Template 3',
      title: 'Celebration Reel & Moments',
      subtitle: 'Special celebrations and memorable video snippets',
      content: 'Dynamic layout with support for responsive video playback and animated sticker reactions.',
      themeColor: 'amber',
      layoutStyle: 'grid',
      isDefault: false,
      media: [
        {
          id: 'media-seed-3',
          type: 'gif',
          url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG45a3R1cGphbmhhdWRpM2I2Z2N2bmlqNnkxZGN0b2FkMWY1cGdyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/artj92V8o75VPL7AeQ/giphy.gif',
          filename: 'happy_celebration_dance.gif',
          mimeType: 'image/gif',
          size: 160000,
          caption: 'Happy celebration dance',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * LocalStorage fallback helpers
 */
function getFromLocalStorage(): TemplateItem[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToLocalStorage(templates: TemplateItem[]): void {
  try {
    // Only store lightweight metadata or reasonable sized payload in localStorage
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(templates));
  } catch {
    // LocalStorage quota may be exceeded; IndexedDB handles the heavy media
  }
}

/**
 * Get all templates, sorted by number ascending
 */
export async function getAllTemplates(): Promise<TemplateItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        let items: TemplateItem[] = request.result || [];
        if (!items || items.length === 0) {
          // Check localStorage backup
          const backup = getFromLocalStorage();
          if (backup && backup.length > 0) {
            items = backup;
          } else {
            // Seed initial templates
            items = getInitialSeedTemplates();
            saveTemplates(items).catch(() => {});
          }
        }
        items.sort((a, b) => a.number - b.number);
        resolve(items);
      };

      request.onerror = () => {
        const backup = getFromLocalStorage() || getInitialSeedTemplates();
        resolve(backup.sort((a, b) => a.number - b.number));
      };
    });
  } catch {
    const backup = getFromLocalStorage() || getInitialSeedTemplates();
    return backup.sort((a, b) => a.number - b.number);
  }
}

/**
 * Save full list of templates
 */
export async function saveTemplates(templates: TemplateItem[]): Promise<void> {
  saveToLocalStorage(templates);
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Clear and rewrite to maintain sync
      store.clear();
      templates.forEach((tmpl) => store.put(tmpl));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error, relying on localStorage:', err);
  }
}

/**
 * Get single template by ID
 */
export async function getTemplateById(id: string): Promise<TemplateItem | null> {
  const all = await getAllTemplates();
  return all.find((t) => t.id === id) || null;
}

/**
 * Automatically calculates the next available template number.
 * e.g., if templates are 1, 2, 3 -> returns 4.
 * If 1, 2, 4 -> returns 3 (or next max).
 */
export function getNextTemplateNumber(templates: TemplateItem[]): number {
  if (!templates || templates.length === 0) return 1;
  const numbers = templates.map((t) => t.number).filter((n) => typeof n === 'number' && !isNaN(n));
  if (numbers.length === 0) return 1;

  const max = Math.max(...numbers);
  // Find first gap, or max + 1
  for (let i = 1; i <= max; i++) {
    if (!numbers.includes(i)) {
      return i;
    }
  }
  return max + 1;
}

/**
 * Create a new template with automatic numbering and unique ID
 */
export async function createTemplate(input: CreateTemplateInput): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const nextNum = getNextTemplateNumber(all);
  const now = new Date().toISOString();
  const id = `template-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newTemplate: TemplateItem = {
    id,
    number: nextNum,
    name: input.name?.trim() || `Template ${nextNum}`,
    title: input.title?.trim() || `Template ${nextNum}`,
    subtitle: input.subtitle?.trim() || '',
    content: input.content?.trim() || '',
    themeColor: input.themeColor || 'purple',
    layoutStyle: input.layoutStyle || 'showcase',
    media: input.initialMedia ? [...input.initialMedia] : [],
    createdAt: now,
    updatedAt: now,
    isDefault: false,
  };

  const updated = [...all, newTemplate];
  await saveTemplates(updated);
  return newTemplate;
}

/**
 * Duplicate an existing template safely
 */
export async function duplicateTemplate(sourceTemplateId: string): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const source = all.find((t) => t.id === sourceTemplateId);
  if (!source) {
    throw new Error('Source template not found for duplication');
  }

  const nextNum = getNextTemplateNumber(all);
  const now = new Date().toISOString();
  const newId = `template-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Duplicate media items with brand new IDs to allow independent editing
  const duplicatedMedia: MediaItem[] = source.media.map((m) => ({
    ...m,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  }));

  const duplicatedTemplate: TemplateItem = {
    ...source,
    id: newId,
    number: nextNum,
    name: `Template ${nextNum}`,
    title: `${source.title} (Copy)`,
    subtitle: source.subtitle,
    content: source.content,
    themeColor: source.themeColor,
    layoutStyle: source.layoutStyle,
    media: duplicatedMedia,
    createdAt: now,
    updatedAt: now,
    isDefault: false,
  };

  const updated = [...all, duplicatedTemplate];
  await saveTemplates(updated);
  return duplicatedTemplate;
}

/**
 * Update an existing template
 */
export async function updateTemplate(updatedTmpl: TemplateItem): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const index = all.findIndex((t) => t.id === updatedTmpl.id);
  if (index === -1) {
    throw new Error(`Template with ID ${updatedTmpl.id} not found`);
  }

  const tmpl: TemplateItem = {
    ...updatedTmpl,
    updatedAt: new Date().toISOString(),
  };

  all[index] = tmpl;
  await saveTemplates(all);
  return tmpl;
}

/**
 * Delete a template by ID
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  const all = await getAllTemplates();
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;

  await saveTemplates(filtered);
  return true;
}

/**
 * Add media item to a template
 */
export async function addMediaToTemplate(
  templateId: string,
  mediaData: Omit<MediaItem, 'id' | 'createdAt'>
): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const tmpl = all.find((t) => t.id === templateId);
  if (!tmpl) throw new Error('Template not found');

  const newMediaItem: MediaItem = {
    ...mediaData,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  tmpl.media = [...tmpl.media, newMediaItem];
  tmpl.updatedAt = new Date().toISOString();

  await saveTemplates(all);
  return tmpl;
}

/**
 * Replace an existing media item in a template
 */
export async function replaceMediaInTemplate(
  templateId: string,
  mediaId: string,
  newMediaData: Omit<MediaItem, 'id' | 'createdAt'>
): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const tmpl = all.find((t) => t.id === templateId);
  if (!tmpl) throw new Error('Template not found');

  tmpl.media = tmpl.media.map((m) =>
    m.id === mediaId
      ? {
          ...newMediaData,
          id: mediaId,
          createdAt: m.createdAt,
        }
      : m
  );
  tmpl.updatedAt = new Date().toISOString();

  await saveTemplates(all);
  return tmpl;
}

/**
 * Remove media item from a template
 */
export async function removeMediaFromTemplate(templateId: string, mediaId: string): Promise<TemplateItem> {
  const all = await getAllTemplates();
  const tmpl = all.find((t) => t.id === templateId);
  if (!tmpl) throw new Error('Template not found');

  tmpl.media = tmpl.media.filter((m) => m.id !== mediaId);
  tmpl.updatedAt = new Date().toISOString();

  await saveTemplates(all);
  return tmpl;
}
