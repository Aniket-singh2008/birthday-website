import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Heart, Sparkles, ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { chinChinConfig } from '../config/chinChinConfig';
import { getPermanentChinChinPhoto, savePermanentChinChinPhoto, resetPermanentChinChinPhoto } from '../services/photoStorage';
import { sound } from '../services/soundEffects';

interface ChinChinScreenProps {
  onNext: () => void;
  onBackToStart?: () => void;
}

/**
 * CHIN CHIN PHOTO SCREEN
 *
 * Dedicated photo screen shown immediately after entering correct passcode 0510.
 *
 * FEATURES:
 * - Displays Chin Chin photo centered as main focus
 * - "You got it 😍" title prominent and enlarged above the photo
 * - "📸 Change Photo" button to easily upload/change photo anytime!
 * - Option to reset to original default photo
 * - Automatic 5-second timer with smooth progress bar
 * - "Next →" skip option if user wants to proceed immediately
 * - "← Back to Start" button allows returning to Passcode Screen at any time
 */
export const ChinChinScreen: React.FC<ChinChinScreenProps> = ({ onNext, onBackToStart }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    const stored = getPermanentChinChinPhoto();
    if (stored.photoUrl && stored.photoUrl.trim() !== '') {
      return stored.photoUrl;
    }
    return chinChinConfig.defaultPhotoUrl || null;
  });

  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5-Second Automatic Timer logic:
  // Pauses if user is interacting with Change Photo
  useEffect(() => {
    if (photoUrl && !isChangingPhoto) {
      const timer = window.setTimeout(() => {
        onNext();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [photoUrl, isChangingPhoto, onNext]);

  const handleTriggerFileInput = () => {
    setIsChangingPhoto(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        await savePermanentChinChinPhoto(dataUrl);
        setPhotoUrl(dataUrl);
        setIsChangingPhoto(false);
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    } else {
      setIsChangingPhoto(false);
    }
    e.target.value = '';
  };

  const handleResetPhoto = async () => {
    await resetPermanentChinChinPhoto();
    setPhotoUrl(chinChinConfig.defaultPhotoUrl || null);
    setIsChangingPhoto(false);
    sound.playWobble();
  };

  return (
    <div className="relative w-full min-h-[82vh] flex flex-col items-center justify-center px-4 py-8 select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Decorative ambient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-75">
        <div className="absolute top-8 left-6 sm:left-16 w-20 h-20 bg-purple-200/40 rounded-full blur-md" />
        <div className="absolute bottom-12 right-6 sm:right-20 w-28 h-28 bg-amber-200/40 rounded-full blur-md" />
        <span className="absolute top-12 left-8 text-xl text-amber-400 animate-float select-none">✨</span>
        <span className="absolute top-20 right-10 text-lg text-purple-400 animate-pulse-soft select-none">⭐</span>
        <span className="absolute bottom-24 left-10 text-base text-pink-400 animate-float select-none">💕</span>
        <span className="absolute bottom-16 right-12 text-xl text-amber-400 select-none animate-pulse-soft">🌟</span>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Top Navigation Row: Back to Start button & Next button */}
        <div className="w-full flex items-center justify-between mb-3 px-2">
          {onBackToStart ? (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onBackToStart();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs hover:shadow-sm font-display font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              <span>← Back to Start</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={() => {
              sound.playSuccessChime();
              onNext();
            }}
            className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xs font-display font-semibold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            <span>Next →</span>
          </button>
        </div>

        {/* Celebratory heading directly above the photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 border-2 border-purple-200/90 shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-pulse-soft" />
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-purple-950 tracking-wide">
              {chinChinConfig.title || 'You got it 😍'}
            </h2>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 animate-pulse-soft" />
          </div>
        </motion.div>

        {/* PHOTO PRESENTATION */}
        {photoUrl ? (
          <div className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-white/95 group"
            >
              <img
                src={photoUrl}
                alt="Chin Chin"
                className="w-full h-full object-cover select-none"
              />

              {/* Floating Change Photo Button overlay on hover or tap */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs font-display font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-400" />
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Aesthetic gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end justify-center p-4">
                <span className="text-white font-handwritten text-lg sm:text-xl drop-shadow-md flex items-center gap-1.5">
                  <span>Chin Chin</span>
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 inline" />
                </span>
              </div>
            </motion.div>

            {/* Quick Actions Under Photo */}
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={handleTriggerFileInput}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200/90 shadow-xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-purple-600" />
                <span>Change Photo</span>
              </button>

              <button
                type="button"
                onClick={handleResetPhoto}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Reset to default"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>

            {/* 5-second indicator bar */}
            {!isChangingPhoto && (
              <div className="w-48 h-1.5 bg-purple-100 rounded-full mt-4 overflow-hidden border border-purple-200/50">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 rounded-full"
                />
              </div>
            )}
          </div>
        ) : (
          /* INITIAL PHOTO SETUP CARD ("Add Photo") */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleTriggerFileInput}
            className="w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-3xl border-3 border-dashed border-purple-300 bg-white/90 hover:bg-white hover:border-purple-400 transition-all duration-300 shadow-md cursor-pointer flex flex-col items-center justify-center p-6 group"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs">
              <Plus className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="font-display font-bold text-lg text-purple-950 mb-1">
              Add Photo
            </h3>
            <p className="text-xs sm:text-sm text-purple-700/80 font-body mb-2">
              Select the Chin Chin photo for this screen
            </p>
            <span className="text-[11px] font-handwritten text-purple-500 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Tap here to choose photo
            </span>
          </motion.div>
        )}

        {/* Subtitle note */}
        <p className="mt-2 text-sm sm:text-base font-handwritten text-purple-800/85">
          {chinChinConfig.subtitle || 'My favorite smile in the whole world'}
        </p>
      </div>
    </div>
  );
};
