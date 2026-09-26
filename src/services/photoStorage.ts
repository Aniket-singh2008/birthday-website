/**
 * PHOTO STORAGE SERVICE
 * 
 * Enforces strict one-time photo upload architecture for the Primary Photo:
 * 1. Once primary photo is set/uploaded, it is permanently locked.
 * 2. All upload / replace / edit / remove UI triggers are completely removed.
 * 3. Saved to persistent storage for refresh resilience.
 * 4. Prepared for seamless connection to Supabase Storage.
 * 
 * Also provides storage helpers for the 10 Memory Boxes so user can optionally
 * upload photos directly from browser as well as configuring in birthdayConfig.ts.
 */

const STORAGE_KEY_PRIMARY_PHOTO = 'memories_primary_photo_permanent_v2';
const STORAGE_KEY_PRIMARY_LOCKED = 'memories_primary_photo_locked_v2';
const STORAGE_KEY_CHIN_CHIN_PHOTO = 'memories_chin_chin_photo_permanent_v1';
const STORAGE_KEY_CHIN_CHIN_LOCKED = 'memories_chin_chin_photo_locked_v1';
const STORAGE_KEY_SPECIAL_PAGE_PHOTO = 'memories_special_page_photo_v2';
const STORAGE_KEY_SPECIAL_PAGE_LOCKED = 'memories_special_page_locked_v2';
const STORAGE_KEY_MEMORY_BOXES = 'memories_boxes_custom_uploads_v2';
const STORAGE_KEY_SHINCHAN_LEFT = 'passcode_shinchan_photo_left_v1';
const STORAGE_KEY_SHINCHAN_RIGHT = 'passcode_shinchan_photo_right_v1';

export interface PhotoStorageState {
  photoUrl: string | null;
  isLocked: boolean;
}

/**
 * Retrieves the permanent Chin Chin photo and lock status.
 */
export function getPermanentChinChinPhoto(): PhotoStorageState {
  try {
    const isLocked = localStorage.getItem(STORAGE_KEY_CHIN_CHIN_LOCKED) === 'true';
    const photoUrl = localStorage.getItem(STORAGE_KEY_CHIN_CHIN_PHOTO);
    return {
      photoUrl: photoUrl || null,
      isLocked: isLocked && Boolean(photoUrl),
    };
  } catch {
    return { photoUrl: null, isLocked: false };
  }
}

/**
 * Saves and updates the Chin Chin photo.
 * Allows updating when user chooses to change the photo.
 */
export async function savePermanentChinChinPhoto(photoDataUrl: string): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_KEY_CHIN_CHIN_PHOTO, photoDataUrl);
    localStorage.setItem(STORAGE_KEY_CHIN_CHIN_LOCKED, 'true');

    // Supabase connector ready
    await syncToSupabaseStorage('chin_chin', photoDataUrl);

    return true;
  } catch (err) {
    console.error('Failed to store Chin Chin photo:', err);
    return false;
  }
}

/**
 * Resets the Chin Chin photo if user wants to clear and pick a fresh one.
 */
export function resetPermanentChinChinPhoto(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CHIN_CHIN_PHOTO);
    localStorage.removeItem(STORAGE_KEY_CHIN_CHIN_LOCKED);
  } catch (err) {
    console.error('Failed to reset Chin Chin photo:', err);
  }
}

/**
 * Retrieves the stored Special Page photo.
 */
export function getSpecialPagePhoto(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_SPECIAL_PAGE_PHOTO) || null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the permanent Special Page photo and one-time lock status.
 */
export function getPermanentSpecialPagePhoto(): PhotoStorageState {
  try {
    const isLocked = localStorage.getItem(STORAGE_KEY_SPECIAL_PAGE_LOCKED) === 'true';
    const photoUrl = localStorage.getItem(STORAGE_KEY_SPECIAL_PAGE_PHOTO);
    return {
      photoUrl: photoUrl || null,
      isLocked: isLocked && Boolean(photoUrl),
    };
  } catch {
    return { photoUrl: null, isLocked: false };
  }
}

/**
 * Saves and permanently locks the Special Page photo (one-time add).
 */
export async function savePermanentSpecialPagePhoto(photoDataUrl: string): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_KEY_SPECIAL_PAGE_PHOTO, photoDataUrl);
    localStorage.setItem(STORAGE_KEY_SPECIAL_PAGE_LOCKED, 'true');
    await syncToSupabaseStorage('special_page', photoDataUrl);
    return true;
  } catch (err) {
    console.error('Failed to store Special Page photo:', err);
    return false;
  }
}

/**
 * Saves the Special Page photo.
 */
export async function saveSpecialPagePhoto(photoDataUrl: string): Promise<boolean> {
  return savePermanentSpecialPagePhoto(photoDataUrl);
}

/**
 * Resets the Special Page photo.
 */
export function resetSpecialPagePhoto(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SPECIAL_PAGE_PHOTO);
    localStorage.removeItem(STORAGE_KEY_SPECIAL_PAGE_LOCKED);
  } catch (err) {
    console.error('Failed to reset Special Page photo:', err);
  }
}

/**
 * Retrieves the permanent primary photo and lock status.
 */
export function getPermanentPrimaryPhoto(): PhotoStorageState {
  try {
    const isLocked = localStorage.getItem(STORAGE_KEY_PRIMARY_LOCKED) === 'true';
    const photoUrl = localStorage.getItem(STORAGE_KEY_PRIMARY_PHOTO);
    return {
      photoUrl: photoUrl || null,
      isLocked: isLocked && Boolean(photoUrl),
    };
  } catch {
    return { photoUrl: null, isLocked: false };
  }
}

/**
 * Permanently locks and stores the primary photo.
 * If already locked, this operation is strictly rejected to prevent replacements.
 */
export async function savePermanentPrimaryPhoto(photoDataUrl: string): Promise<boolean> {
  try {
    const current = getPermanentPrimaryPhoto();
    if (current.isLocked) {
      console.warn('Primary photo is already permanently locked. Replacements are disallowed.');
      return false;
    }

    localStorage.setItem(STORAGE_KEY_PRIMARY_PHOTO, photoDataUrl);
    localStorage.setItem(STORAGE_KEY_PRIMARY_LOCKED, 'true');

    // Supabase hook
    await syncToSupabaseStorage('primary', photoDataUrl);

    return true;
  } catch (err) {
    console.error('Failed to store permanent primary photo:', err);
    return false;
  }
}

/**
 * Custom memory photo box uploads (for Photo Box 1 to 10)
 * Reads all current and historical storage keys so no previous user uploads are lost.
 */
export function getCustomMemoryBoxPhotos(): Record<number, string> {
  try {
    const keys = [
      STORAGE_KEY_MEMORY_BOXES,
      'memories_boxes_custom_uploads_v1',
      'memories_boxes_custom_uploads',
      'memory_photos_custom',
      'memories_photos_storage',
      'memories_custom_uploads',
    ];
    let result: Record<number, string> = {};
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            result = { ...parsed, ...result };
          }
        }
      } catch {}
    }
    return result;
  } catch {
    return {};
  }
}

export function saveCustomMemoryBoxPhoto(boxId: number, dataUrl: string): void {
  try {
    const existing = getCustomMemoryBoxPhotos();
    existing[boxId] = dataUrl;
    localStorage.setItem(STORAGE_KEY_MEMORY_BOXES, JSON.stringify(existing));
    syncToSupabaseStorage(`box-${boxId}`, dataUrl).catch(() => {});
  } catch (err) {
    console.error('Failed to save memory box photo:', err);
  }
}

/**
 * Passcode Screen Shinchan custom photos
 */
export function getPasscodeShinchanPhotos(): { leftImage: string | null; rightImage: string | null } {
  try {
    const left = localStorage.getItem(STORAGE_KEY_SHINCHAN_LEFT);
    const right = localStorage.getItem(STORAGE_KEY_SHINCHAN_RIGHT);
    return { leftImage: left || null, rightImage: right || null };
  } catch {
    return { leftImage: null, rightImage: null };
  }
}

export function savePasscodeShinchanPhoto(side: 'left' | 'right', dataUrl: string): void {
  try {
    const key = side === 'left' ? STORAGE_KEY_SHINCHAN_LEFT : STORAGE_KEY_SHINCHAN_RIGHT;
    localStorage.setItem(key, dataUrl);
  } catch (err) {
    console.error('Failed to save shinchan passcode photo:', err);
  }
}

/**
 * Prepared connector for Supabase Storage integration.
 */
async function syncToSupabaseStorage(tag: string, dataUrl: string): Promise<string | null> {
  // Plug in Supabase Storage client here when credentials are provided:
  // e.g., supabase.storage.from('memories').upload(...)
  return dataUrl;
}
