/**
 * =========================================================================
 * SPECIAL PAGE CONFIGURATION (Page immediately following Chin-Chin screen)
 * =========================================================================
 *
 * Exact recreation of the reference template:
 * - Exact image card layout with bunny & bear mascots
 * - Center box with GIF/Photo upload & URL options
 *
 * Customize your GIF:
 * 1. Add your GIF URL or path in `specialPageGif`:
 *    e.g. specialPageGif: "https://media.giphy.com/.../giphy.gif"
 * OR
 * 2. Upload any .gif / image directly in the box on the screen.
 */

import { BIRTHDAY_CONFIG } from './birthdayConfig';

export const specialPageConfig = {
  /**
   * GIF or Photo for the center box:
   * Put your GIF URL or path here, or leave empty to choose on-screen.
   */
  specialPageGif: BIRTHDAY_CONFIG.specialPagePhoto || '',
  specialPagePhoto: BIRTHDAY_CONFIG.specialPagePhoto || '',

  /**
   * Speech bubble text matching the attached illustration:
   */
  line1: 'Hey, I made something',
  line2: 'for you. Do you wanna',
  line3: 'see it?',

  yesButtonText: 'Yes',
  noButtonText: 'No',

  /**
   * Preset cute GIFs available to pick with 1 click:
   */
  presetGifs: [
    {
      id: 'bear-bunny-hug',
      label: 'Bear & Bunny 💕',
      url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXVubHNzOGx6c2YzaWNuYmdtZXZxMWp4b294cXhkZ3pkMHltdjI5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l8oo4x3ByVK00/giphy.gif',
    },
    {
      id: 'milk-mocha',
      label: 'Sweet Love 🥰',
      url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3UxeHNjcjl6eWJmODRqOXJtM2Jvbm9iN2NlejhqbWZ2dmh4d3VqNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZqbBT64ECtjy/giphy.gif',
    },
    {
      id: 'happy-dance',
      label: 'Happy Dance ✨',
      url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG45a3R1cGphbmhhdWRpM2I2Z2N2bmlqNnkxZGN0b2FkMWY1cGdyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/artj92V8o75VPL7AeQ/giphy.gif',
    },
  ],
};
