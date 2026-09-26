import React, { useState, useEffect } from 'react';
import { sound } from '../services/soundEffects';
import { getItemPersistent } from '../services/dbStorage';

interface NoDareYouScreenProps {
  onGoBack: () => void;
}

const STORAGE_KEY_NO_PHOTO = 'custom_no_card_photo';

export const NoDareYouScreen: React.FC<NoDareYouScreenProps> = ({ onGoBack }) => {
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_NO_PHOTO);
    } catch {
      return null;
    }
  });

  // Load from persistent IndexedDB store on mount if available
  useEffect(() => {
    async function loadPhoto() {
      const stored = await getItemPersistent(STORAGE_KEY_NO_PHOTO);
      if (stored) {
        setCustomPhoto(stored);
      }
    }
    loadPhoto();
  }, []);

  const handleGoBack = () => {
    sound.playWobble();
    onGoBack();
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FAF5EC] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Exact Reference Card Template with Angry Shinchan */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[2/3] shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group">
        {/* Background Card Illustration matching the exact user attached image */}
        <img
          src="/images/shinchan_no_card.svg"
          alt="Seriously? How dare you?"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Locked Photo Overlay inside Center Box */}
        {customPhoto && (
          <div
            style={{
              position: 'absolute',
              left: '14.6%',
              top: '33.2%',
              width: '70.8%',
              height: '33.3%',
              pointerEvents: 'none',
            }}
            className="rounded-[20px] sm:rounded-[24px] overflow-hidden z-20 shadow-inner bg-white"
          >
            <img
              src={customPhoto}
              alt="Center Photo"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* INTERACTIVE "GO BACK" BUTTON (POUTING KITTEN)                  */}
        {/* Position: x: 22.0%, y: 81.6%, w: 56.0%, h: 8.4%                */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleGoBack}
          style={{
            position: 'absolute',
            left: '22%',
            top: '81.6%',
            width: '56%',
            height: '8.4%',
          }}
          className="rounded-full cursor-pointer z-30 transition-transform active:scale-95 hover:bg-pink-500/10 focus:outline-hidden"
          title="Go back"
          aria-label="Go back Button"
        >
          <span className="sr-only">Go back</span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <button
          type="button"
          onClick={handleGoBack}
          className="px-5 py-2 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200/90 text-xs font-display font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span>← Go back</span>
        </button>
      </div>
    </div>
  );
};
