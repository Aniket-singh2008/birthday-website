/**
 * =========================================================================
 * MEMORIES PHOTO CONFIGURATION
 * =========================================================================
 *
 * Add your 8 photos here!
 *
 * You can set image URLs (e.g. "/photos/pic1.jpg", external URL, or base64 data URL)
 * or leave as "" to show the "Add Photo" placeholder.
 *
 * When an image is provided or uploaded, the "Add Photo" placeholder disappears
 * and your image fills the card with object-fit: cover.
 *
 * All 8 boxes remain in their exact positions!
 */

export interface MemoryPhotoSlot {
  id: number;
  image: string;
}

export const memoryPhotos: MemoryPhotoSlot[] = [
  { id: 1, image: '' },
  { id: 2, image: '' },
  { id: 3, image: '' },
  { id: 4, image: '' },
  { id: 5, image: '' },
  { id: 6, image: '' },
  { id: 7, image: '' },
  { id: 8, image: '' },
];

