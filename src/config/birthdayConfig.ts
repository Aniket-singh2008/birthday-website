/**
 * =========================================================================
 * CENTRAL BIRTHDAY & MEMORIES CONFIGURATION
 * =========================================================================
 * 
 * Edit this file to customize:
 * 1. Primary Profile Photo
 * 2. 10 Memory Photos
 * 3. Letters & Message contents
 * 4. Recipient Name & Details
 * 
 * No need to touch component code!
 */

export interface MemoryPhotoBox {
  id: number;
  title: string;
  image: string; // Add your image URL or relative path here (e.g., "/photos/pic1.jpg" or data URL)
  caption?: string;
  date?: string;
}

export interface LetterItem {
  id: number;
  title: string;
  date?: string;
  subtitle?: string;
  content: string; // The customizable letter text
}

export interface BirthdayConfig {
  /** The passcode to unlock the surprise (0510) */
  passcode: string;

  /** Name of the recipient */
  recipientName: string;

  /** Subtitle / Tagline shown in Memories header */
  headerSubtitle: string;

  /**
   * SPECIAL PAGE PHOTO (Screen after Chin-Chin):
   * Add your photo URL or image path here:
   * e.g. specialPagePhoto: "/photos/special.jpg" or data URL.
   * If left empty (""), shows a subtle "Add Photo" placeholder on the screen.
   */
  specialPagePhoto: string;

  /**
   * PRIMARY HERO / PROFILE PHOTO:
   * Leave empty ("") if you want to upload it via the UI once.
   * If you provide a URL here or upload once via UI, it becomes locked permanently.
   */
  primaryPhoto: string;

  /**
   * 10 MEMORY PHOTO BOXES:
   * Easily configure the image for Photo Box 1 through Photo Box 10 here.
   */
  memories: MemoryPhotoBox[];

  /**
   * LETTERS:
   * Add, remove, or edit letter titles and personal letter contents here.
   */
  letters: LetterItem[];

  /**
   * PASSCODE SCREEN SHINCHAN PHOTOS
   * Set custom image URLs or leave empty to use default cute Shinchan visuals.
   * leftImage: Blushing Shinchan resting on chin (Image 1)
   * rightImage: Shinchan perched on fence with ONE LOVE (Image 2)
   */
  passcodeShinchanPhotos: {
    leftImage: string;
    rightImage: string;
  };

  /** Surprise question screen */
  surpriseQuestion: {
    greeting: string;
    question: string;
    yesButtonText: string;
    noButtonText: string;
    playfulNoResponses: string[];
  };

  /** Virtual Hug Configuration */
  virtualHug: {
    loadingText: string;
    deliveredTitle: string;
    deliveredMessage: string;
    sendLoveButtonText: string;
  };
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  // Correct passcode to unlock
  passcode: '0510',

  recipientName: 'Birthday Star',
  headerSubtitle: 'A collection of our favorite moments & smiles ✨',

  // SPECIAL PAGE PHOTO (Dedicated slot for the new page after Chin-Chin)
  // Customize easily by putting your image URL or file path here (e.g. "/photos/myphoto.jpg")
  specialPagePhoto: '',

  // Primary profile/hero photo (Leave empty to use the one-time upload in UI, or put your image URL here)
  primaryPhoto: '',

  // 10 DEDICATED MEMORY PHOTO BOXES (Photo Box 1 to Photo Box 10)
  memories: [
    {
      id: 1,
      title: 'Photo Box 1',
      image: '', // e.g. "/photos/memory-1.jpg"
      caption: 'The beginning of wonderful memories',
      date: 'Moments',
    },
    {
      id: 2,
      title: 'Photo Box 2',
      image: '',
      caption: 'Unforgettable smiles and sunny days',
      date: 'Sunshine',
    },
    {
      id: 3,
      title: 'Photo Box 3',
      image: '',
      caption: 'Little adventures together',
      date: 'Adventures',
    },
    {
      id: 4,
      title: 'Photo Box 4',
      image: '',
      caption: 'Late night laughter and jokes',
      date: 'Laughter',
    },
    {
      id: 5,
      title: 'Photo Box 5',
      image: '',
      caption: 'Quiet cozy conversations',
      date: 'Cozy',
    },
    {
      id: 6,
      title: 'Photo Box 6',
      image: '',
      caption: 'Celebrating life and sweet milestones',
      date: 'Celebration',
    },
    {
      id: 7,
      title: 'Photo Box 7',
      image: '',
      caption: 'Cherished memories in full bloom',
      date: 'Bloom',
    },
    {
      id: 8,
      title: 'Photo Box 8',
      image: '',
      caption: 'Every moment spent with you is special',
      date: 'Pure Joy',
    },
    {
      id: 9,
      title: 'Photo Box 9',
      image: '',
      caption: 'A day filled with happiness',
      date: 'Happiness',
    },
    {
      id: 10,
      title: 'Photo Box 10',
      image: '',
      caption: 'To many more beautiful memories ahead',
      date: 'Forever',
    },
  ],

  // LETTERS CONFIGURATION
  letters: [
    {
      id: 1,
      title: 'Letter 1: A Special Birthday Note',
      date: 'On Your Special Day ✨',
      subtitle: 'To someone truly unforgettable',
      content: `Happy Birthday! Today is all about celebrating you and the beautiful light you bring into everyone’s life around you.

Thank you for all the laughter, the gentle kindness, the late-night talks, and every small memory that turns into something unforgettable. Having you around makes ordinary days feel so warm and bright.

I hope this year showers you with endless happiness, exciting new adventures, sweet victories, and all the love your heart can hold. May all your quiet wishes come true.

Always remember how deeply cherished and appreciated you are today, tomorrow, and every single day after.`,
    },
    {
      id: 2,
      title: 'Letter 2: Reasons You Are Wonderful',
      date: 'From The Heart 💖',
      subtitle: 'Just a few gentle reminders',
      content: `I wanted to take a moment to write down a few things that make you so special:

1. Your genuine kindness and the way you always listen attentively.
2. Your contagious laughter that can instantly brighten anyone's gloomy day.
3. Your strength and grace, even during challenging times.
4. The little quirks and jokes that make you uniquely you!

Never forget how much happiness you bring into my world. Have the happiest birthday!`,
    },
    {
      id: 3,
      title: 'Letter 3: Birthday Wishes & Dreams',
      date: 'Wishing On Stars ⭐',
      subtitle: 'For the journey ahead',
      content: `As you blow out your candles and embark on another fantastic trip around the sun, my biggest wish for you is that you continue chasing what sets your soul on fire.

May you discover new passions, visit dream places, and surround yourself with people who appreciate how rare and precious you are.

Happy Birthday, always and forever!`,
    },
  ],

  // Passcode screen Shinchan photos (Left: Blushing chin rest, Right: One Love fence)
  // You can paste image paths/URLs or use the in-browser upload buttons on the passcode screen
  passcodeShinchanPhotos: {
    leftImage: '',
    rightImage: '',
  },

  // Screen 2: Question and playful responses
  surpriseQuestion: {
    greeting: 'Hey! I made something for you.',
    question: 'Do you wanna see it? ✨',
    yesButtonText: 'Yes, show me! 💕',
    noButtonText: 'No thanks 🙈',
    playfulNoResponses: [
      'Are you really sure? 🥺',
      'Wait, think again! 🙈',
      'Wrong button! The other one is much prettier ✨',
      'Nice try, but you know you want to! 😜',
      'The "No" button is feeling shy today! 💕',
      'Oops! Access denied to saying no! 🥰',
    ],
  },

  // Virtual Hug
  virtualHug: {
    loadingText: 'Virtual hug loading...',
    deliveredTitle: 'Virtual Hug Delivered! 🤗💖',
    deliveredMessage: 'Sent with 100% warmth, infinite love, and the tightest squeeze across any distance!',
    sendLoveButtonText: 'Send Love Back 💖',
  },
};
