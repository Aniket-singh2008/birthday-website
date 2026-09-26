import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, ArrowRight, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface ShinchanBirthdayScreenProps {
  onContinueToGifts: () => void;
}

const STORAGE_KEY_BIRTHDAY_PHOTO = 'birthday_card_permanent_photo';
const STORAGE_KEY_LEFT_SHINCHAN_PHOTO = 'birthday_card_left_shinchan_photo';

export const ShinchanBirthdayScreen: React.FC<ShinchanBirthdayScreenProps> = ({
  onContinueToGifts,
}) => {
  // Center Scalloped Birthday Photo
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BIRTHDAY_PHOTO);
    } catch {
      return null;
    }
  });

  // Bottom-Left Shinchan Custom Photo
  const [leftShinchanPhoto, setLeftShinchanPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LEFT_SHINCHAN_PHOTO);
    } catch {
      return null;
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const leftPhotoInputRef = useRef<HTMLInputElement>(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.25 },
      colors: ['#FFAEC0', '#FDE047', '#38BDF8', '#FF8DA1', '#FFFFFF'],
    });
  }, []);

  // Replace / Upload Center Birthday Photo
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoUrl(dataUrl);
        try {
          localStorage.setItem(STORAGE_KEY_BIRTHDAY_PHOTO, dataUrl);
        } catch {}

        sound.playSuccessChime();
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#FFAEC0', '#FDE047', '#38BDF8', '#FF8DA1', '#E11D48'],
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleResetCenterPhoto = () => {
    setPhotoUrl(null);
    try {
      localStorage.removeItem(STORAGE_KEY_BIRTHDAY_PHOTO);
    } catch {}
    sound.playWobble();
  };

  // Replace / Upload Bottom-Left Photo (Replaces Shinchan cleanly!)
  const handleLeftPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLeftShinchanPhoto(dataUrl);
        try {
          localStorage.setItem(STORAGE_KEY_LEFT_SHINCHAN_PHOTO, dataUrl);
        } catch {}

        sound.playSuccessChime();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { x: 0.2, y: 0.8 },
          colors: ['#FFAEC0', '#FDE047', '#38BDF8', '#FFFFFF'],
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleResetLeftPhoto = () => {
    setLeftShinchanPhoto(null);
    try {
      localStorage.removeItem(STORAGE_KEY_LEFT_SHINCHAN_PHOTO);
    } catch {}
    sound.playWobble();
  };

  const handleContinue = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      onContinueToGifts();
    }, 350);
  };

  // Use clean background when leftShinchanPhoto is present so Shinchan is NOT underneath at all!
  const cardBackgroundSrc = leftShinchanPhoto
    ? '/images/shinchan_birthday_card_clean_left.svg'
    : '/images/shinchan_birthday_card.svg';

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FFF4EA] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Hidden File Input for Center Birthday Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden File Input for Bottom-Left Shinchan Photo */}
      <input
        ref={leftPhotoInputRef}
        type="file"
        accept="image/*,.gif"
        onChange={handleLeftPhotoChange}
        className="hidden"
      />

      {/* Main Birthday Card Frame */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[2/3] shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group">
        {/* Background Card Illustration (dynamically swaps so Shinchan is 100% removed when replaced!) */}
        <img
          src={cardBackgroundSrc}
          alt="Happy Birthday"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* ============================================================== */}
        {/* CENTER SCALLOPED PHOTO SLOT (REPLACEABLE PHOTO)                */}
        {/* ============================================================== */}
        <svg
          viewBox="0 0 1000 1500"
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          <defs>
            <clipPath id="birthdayScallopClip">
              <path
                d="M 245 420
                   Q 335 402 430 415 Q 500 422 570 415 Q 665 402 755 420
                   Q 795 455 805 510 Q 818 580 805 660 Q 795 735 805 810 Q 818 890 805 965 Q 795 1020 755 1055
                   Q 665 1075 570 1062 Q 500 1055 430 1062 Q 335 1075 245 1055
                   Q 205 1020 195 965 Q 182 890 195 810 Q 205 735 195 660 Q 182 580 195 510 Q 205 455 245 420 Z"
              />
            </clipPath>
          </defs>

          {/* User Photo clipped inside the Scalloped Birthday Frame */}
          {photoUrl && (
            <image
              href={photoUrl}
              x="170"
              y="385"
              width="660"
              height="700"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#birthdayScallopClip)"
              className="pointer-events-auto cursor-pointer"
              onClick={handleTriggerUpload}
            />
          )}

          {/* Pink Dashed Stitch Line on top */}
          <path
            d="M 245 420
               Q 335 402 430 415 Q 500 422 570 415 Q 665 402 755 420
               Q 795 455 805 510 Q 818 580 805 660 Q 795 735 805 810 Q 818 890 805 965 Q 795 1020 755 1055
               Q 665 1075 570 1062 Q 500 1055 430 1062 Q 335 1075 245 1055
               Q 205 1020 195 965 Q 182 890 195 810 Q 205 735 195 660 Q 182 580 195 510 Q 205 455 245 420 Z"
            fill="none"
            stroke="#FFB6C1"
            strokeWidth="4.5"
            strokeDasharray="14 10"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="pointer-events-none"
          />
        </svg>

        {/* Empty State - Inviting "Add Photo" UI inside Scalloped Box */}
        {!photoUrl ? (
          <div
            style={{
              position: 'absolute',
              left: '21%',
              top: '30%',
              width: '58%',
              height: '40%',
            }}
            onClick={handleTriggerUpload}
            className="z-30 flex flex-col items-center justify-center p-4 text-center cursor-pointer group/photo hover:scale-102 transition-transform"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-pink-100/90 border-2 border-pink-300 text-pink-600 flex items-center justify-center mb-2.5 shadow-sm group-hover/photo:bg-pink-200 transition-colors animate-pulse-soft">
              <Camera className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-1">
              Add Birthday Photo 🎂
            </h4>
            <p className="text-[11px] sm:text-xs text-pink-600 font-semibold bg-white/90 px-3.5 py-1 rounded-full border border-pink-200 shadow-2xs">
              Tap to choose photo
            </p>
          </div>
        ) : (
          /* Floating "Replace Photo" Button on Center Photo */
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200 shadow-sm text-xs font-display font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
              title="Replace Center Photo"
            >
              <Camera className="w-3.5 h-3.5 text-pink-500" />
              <span>Replace Photo</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOTTOM-LEFT: REPLACING SHINCHAN CLEANLY                        */}
        {/* ============================================================== */}
        {/* If user uploaded custom bottom-left photo: renders cleanly in that spot */}
        {leftShinchanPhoto && (
          <div
            style={{
              position: 'absolute',
              left: '4%',
              top: '64%',
              width: '35%',
              height: '32%',
            }}
            className="z-30 flex flex-col items-center justify-center p-1.5 pointer-events-none"
          >
            <div className="relative w-full h-full max-h-[185px] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={leftShinchanPhoto}
                alt="Birthday Mascot"
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="mt-4 flex flex-col items-center gap-2.5 w-full max-w-md">
        {/* Center Birthday Photo Actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleTriggerUpload}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white shadow-xs font-display font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{photoUrl ? 'Replace Center Photo' : 'Add Center Photo'}</span>
          </button>

          {photoUrl && (
            <button
              type="button"
              onClick={handleResetCenterPhoto}
              className="px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="Reset Center Photo"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Clear Center</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-1 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xs font-display font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <span>Open Birthday Gifts 🎁</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
