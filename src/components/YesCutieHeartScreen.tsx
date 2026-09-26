import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../services/soundEffects';
import { getMediaSlot, saveMediaSlot } from '../services/referenceMediaStorage';

interface YesCutieHeartScreenProps {
  onComplete: () => void;
}

const STORAGE_KEY_CUTIE_PHOTO = 'custom_cutie_heart_photo';

export const YesCutieHeartScreen: React.FC<YesCutieHeartScreenProps> = ({ onComplete }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUTIE_PHOTO);
      if (stored && stored.trim() !== '') return stored;
      const slot = getMediaSlot('page_yes_cutie');
      return slot.source && slot.source.trim() !== '' ? slot.source : null;
    } catch {
      return null;
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3-second automatic redirect to the new Happy Birthday page
  useEffect(() => {
    if (!isUploading) {
      const timer = window.setTimeout(() => {
        onComplete();
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isUploading, onComplete]);

  const handleClickButton = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 120,
      spread: 110,
      origin: { y: 0.65 },
      colors: ['#FFAEC0', '#FEF08A', '#F472B6', '#B9C6FF', '#FFFFFF'],
    });

    setTimeout(() => {
      onComplete();
    }, 350);
  };

  const handleTriggerPicker = () => {
    setIsUploading(true);
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
          localStorage.setItem(STORAGE_KEY_CUTIE_PHOTO, dataUrl);
          saveMediaSlot({
            id: 'page_yes_cutie',
            pageTitle: 'Cutie Heart',
            shape: 'heart',
            type: 'image',
            source: dataUrl,
          });
        } catch {}
        sound.playSuccessChime();
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsUploading(false);
    }
    e.target.value = '';
  };

  const handleResetPhoto = () => {
    setPhotoUrl(null);
    try {
      localStorage.removeItem(STORAGE_KEY_CUTIE_PHOTO);
      saveMediaSlot({
        id: 'page_yes_cutie',
        pageTitle: 'Cutie Heart',
        shape: 'heart',
        type: 'image',
        source: '',
      });
    } catch {}
    sound.playWobble();
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FAF5EC] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Exact Reference Card Template */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[2/3] shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group">
        {/* Background Card Illustration */}
        <img
          src="/images/yes_cutie_heart_card.svg"
          alt="Cutie Heart Card"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Floating Add / Change Photo Button at Top Right of Card */}
        <div className="absolute top-4 right-4 z-40">
          <button
            type="button"
            onClick={handleTriggerPicker}
            className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 text-xs font-display font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            title={photoUrl ? 'Change Heart Photo' : 'Add Photo to Heart'}
          >
            <Camera className="w-3.5 h-3.5 text-pink-500" />
            <span>{photoUrl ? 'Change Photo' : 'Add Photo'}</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* LARGE HEART-SHAPED BLANK CONTENT AREA                          */}
        {/* W3C SVG clip-path clips image seamlessly inside the heart!      */}
        {/* ============================================================== */}
        <svg
          viewBox="0 0 1000 1500"
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          <defs>
            <clipPath id="cutieHeartMediaClip">
              <path d="M 500 325 C 500 325, 360 258, 250 272 C 152 286, 98 392, 106 492 C 118 610, 268 755, 500 930 C 732 755, 882 610, 894 492 C 902 392, 848 286, 750 272 C 640 258, 500 325, 500 325 Z" />
            </clipPath>
          </defs>

          {/* User Photo clipped inside the Heart Shape */}
          {photoUrl && (
            <image
              href={photoUrl}
              x="90"
              y="240"
              width="820"
              height="700"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#cutieHeartMediaClip)"
              className="pointer-events-auto cursor-pointer"
              onClick={handleTriggerPicker}
            />
          )}

          {/* Crisp Pink Dashed Stitch Line on top of media */}
          <path
            d="M 500 325 C 500 325, 360 258, 250 272 C 152 286, 98 392, 106 492 C 118 610, 268 755, 500 930 C 732 755, 882 610, 894 492 C 902 392, 848 286, 750 272 C 640 258, 500 325, 500 325 Z"
            fill="none"
            stroke="#F472B6"
            strokeWidth="4.5"
            strokeDasharray="14 10"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="pointer-events-none"
          />
        </svg>

        {/* Empty Heart State - Inviting "Add Photo" Button inside Heart */}
        {!photoUrl && (
          <div
            style={{
              position: 'absolute',
              left: '18%',
              top: '28%',
              width: '64%',
              height: '34%',
            }}
            onClick={handleTriggerPicker}
            className="z-30 flex flex-col items-center justify-center p-4 text-center cursor-pointer group/heart transition-all hover:scale-102"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100/90 border-2 border-pink-300 text-pink-600 flex items-center justify-center mb-2 shadow-sm group-hover/heart:bg-pink-200 transition-colors animate-pulse-soft">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-1">
              Add Photo in Heart ❤️
            </h4>
            <p className="text-[11px] sm:text-xs text-pink-600 font-medium bg-white/80 px-3 py-1 rounded-full border border-pink-200 shadow-2xs">
              Tap here to choose photo
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* INTERACTIVE STITCHED YELLOW "CLICK" BUTTON                     */}
        {/* Position: x: 27.5%, y: 81.67%, w: 45.0%, h: 9.0%               */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleClickButton}
          style={{
            position: 'absolute',
            left: '27.5%',
            top: '81.67%',
            width: '45%',
            height: '9%',
          }}
          className="rounded-full cursor-pointer z-30 transition-transform active:scale-95 hover:bg-amber-400/15 focus:outline-hidden"
          title="Click"
          aria-label="Click Button"
        >
          <span className="sr-only">Click</span>
        </button>
      </div>

      {/* 3-Second Automatic Progress Bar & Action Controls */}
      <div className="mt-3 flex flex-col items-center gap-2">
        {!isUploading && (
          <div className="w-48 h-1.5 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 rounded-full"
            />
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTriggerPicker}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-50 text-purple-900 border border-purple-200/90 shadow-2xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-pink-500" />
            <span>{photoUrl ? 'Change Heart Photo' : 'Add Photo'}</span>
          </button>

          {photoUrl && (
            <button
              type="button"
              onClick={handleResetPhoto}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="Reset Photo"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClickButton}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xs font-display font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next (Birthday 🎂)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
