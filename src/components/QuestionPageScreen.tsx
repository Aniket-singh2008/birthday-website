import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Camera, RefreshCw } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface QuestionPageScreenProps {
  onYes: () => void;
  onNo: () => void;
}

const STORAGE_KEY_QUESTION_PHOTO = 'custom_question_card_photo';

export const QuestionPageScreen: React.FC<QuestionPageScreenProps> = ({
  onYes,
  onNo,
}) => {
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_QUESTION_PHOTO);
    } catch {
      return null;
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleYesClick = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#FFAEC0', '#FDE047', '#E11D48', '#B9C6FF', '#FFFFFF'],
    });

    setTimeout(() => {
      onYes();
    }, 400);
  };

  const handleNoClick = () => {
    sound.playWobble();
    onNo();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCustomPhoto(dataUrl);
        try {
          localStorage.setItem(STORAGE_KEY_QUESTION_PHOTO, dataUrl);
        } catch {}
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleReset = () => {
    setCustomPhoto(null);
    try {
      localStorage.removeItem(STORAGE_KEY_QUESTION_PHOTO);
    } catch {}
    sound.playWobble();
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FAF5EC] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Exact Card Template */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[2/3] shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group">
        {/* Background Card Illustration matching the exact user attached image */}
        <img
          src="/images/shinchan_question_card.svg"
          alt="Hey, I made something for you"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Optional Custom Photo Overlay inside Center Box */}
        {customPhoto && (
          <div
            style={{
              position: 'absolute',
              left: '13.2%',
              top: '32.3%',
              width: '73.6%',
              height: '35.1%',
            }}
            className="rounded-[22px] sm:rounded-[26px] overflow-hidden z-20 shadow-inner bg-white"
          >
            <img
              src={customPhoto}
              alt="Custom Center Photo"
              className="w-full h-full object-cover select-none"
            />
          </div>
        )}

        {/* Floating Quick Change Photo Button on Card */}
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-purple-900 border border-purple-200 text-[11px] font-display font-semibold flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Change Center Photo"
          >
            <Camera className="w-3 h-3 text-purple-600" />
            <span>Change Photo</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE PINK "YES" BUTTON                                  */}
        {/* Position: x: 9.5%, y: 77.5%, w: 39%, h: 9%                    */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleYesClick}
          style={{
            position: 'absolute',
            left: '9.5%',
            top: '77.5%',
            width: '39%',
            height: '9%',
          }}
          className="rounded-full cursor-pointer z-30 transition-transform active:scale-95 hover:bg-pink-500/10 focus:outline-hidden"
          title="Yes"
          aria-label="Yes Button"
        >
          <span className="sr-only">Yes</span>
        </button>

        {/* ============================================================== */}
        {/* INTERACTIVE BLUE "NO" BUTTON (OPENS NO PATH: ANGRY SHINCHAN)   */}
        {/* Position: x: 52.6%, y: 77.5%, w: 39%, h: 9%                   */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleNoClick}
          style={{
            position: 'absolute',
            left: '52.6%',
            top: '77.5%',
            width: '39%',
            height: '9%',
          }}
          className="rounded-full cursor-pointer z-30 transition-transform active:scale-95 hover:bg-indigo-500/10 focus:outline-hidden"
          title="No"
          aria-label="No Button"
        >
          <span className="sr-only">No</span>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-xs font-display font-medium flex items-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Camera className="w-3 h-3 text-purple-600" />
          <span>Change Photo</span>
        </button>

        {customPhoto && (
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-display flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            title="Reset to Shinchan"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Reset to Shinchan</span>
          </button>
        )}
      </div>
    </div>
  );
};
