/**
 * REFERENCE PAGES MEDIA SLOTS CONFIGURATION
 *
 * Easy configuration for each reference page media slot.
 * Supported types: 'image' | 'video' | 'gif'
 *
 * Each reference page has completely independent media.
 */

export type MediaSlotType = 'image' | 'video' | 'gif';

export interface MediaSlotConfig {
  id: string;
  pageTitle: string;
  shape: 'rectangle' | 'heart';
  type: MediaSlotType;
  source: string; // URL, data URL, or asset path
  label?: string;
}

export const defaultMediaSlots: MediaSlotConfig[] = [
  {
    id: 'page1_question',
    pageTitle: 'Page 1: Question Page ("Hey, I made something for you...")',
    shape: 'rectangle',
    type: 'gif',
    source: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJnd3N4MHB2Zmt6dTZmdnNjcGZ3M3J1N2RmdWZqNWUycXhhbWZieiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lq0h93752f6J9tijrh/giphy.gif',
    label: 'Cute Puppy & Bear',
  },
  {
    id: 'page_no_dare',
    pageTitle: 'No Path: ("Seriously? How dare you? > H-mph? <")',
    shape: 'rectangle',
    type: 'gif',
    source: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG1idjIxdm9qbjM1N3oxdWFveWtwcHhrOWQwcWRxYjB1Y3Fxc3h4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mlvseq9yvZhba/giphy.gif',
    label: 'Pouting Kitten',
  },
  {
    id: 'page_yes_cutie',
    pageTitle: 'Yes Path: ("Cutie" Heart Page - "That is a good girl.")',
    shape: 'heart',
    type: 'image',
    source: '', // Ready for user's favorite photo / video / GIF inside the heart frame!
    label: 'Heart Media Slot',
  },
];
