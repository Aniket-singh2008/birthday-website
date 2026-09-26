/**
 * REFERENCE MEDIA STORAGE SERVICE
 *
 * Provides persistent independent storage for each reference page media slot.
 * Ensures:
 * - Page 1 media !== Page 2 media !== Page 3 media
 * - Editing one slot never affects other slots
 * - Supports Image, Video, and Animated GIF
 */

import { MediaSlotConfig, MediaSlotType, defaultMediaSlots } from '../config/referenceMediaConfig';

const STORAGE_PREFIX = 'ref_media_slot_v2_';

export function getMediaSlot(id: string): MediaSlotConfig {
  const defaultSlot = defaultMediaSlots.find((s) => s.id === id) || {
    id,
    pageTitle: 'Custom Slot',
    shape: 'rectangle' as const,
    type: 'image' as MediaSlotType,
    source: '',
  };

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSlot,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn(`Failed to read media slot ${id} from storage:`, err);
  }

  return defaultSlot;
}

export function saveMediaSlot(slot: MediaSlotConfig): void {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${slot.id}`,
      JSON.stringify({
        id: slot.id,
        type: slot.type,
        source: slot.source,
        label: slot.label,
      })
    );
  } catch (err) {
    console.warn(`Failed to save media slot ${slot.id} to storage:`, err);
  }
}

export function resetMediaSlot(id: string): MediaSlotConfig {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
  } catch {
    // Ignore
  }
  return defaultMediaSlots.find((s) => s.id === id) || {
    id,
    pageTitle: 'Custom Slot',
    shape: 'rectangle',
    type: 'image',
    source: '',
  };
}
