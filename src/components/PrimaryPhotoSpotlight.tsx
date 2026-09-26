import React, { useRef, useState } from 'react';
import { Camera, Sparkles, Lock, Upload, Heart } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { savePermanentPrimaryPhoto } from '../services/photoStorage';
import { sound } from '../services/soundEffects';

interface PrimaryPhotoSpotlightProps {
  photoUrl: string | null;
  isLocked: boolean;
  onPhotoUploaded: (url: string) => void;
}

export const PrimaryPhotoSpotlight: React.FC<PrimaryPhotoSpotlightProps> = ({
  photoUrl,
  isLocked,
  onPhotoUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectivePhoto = photoUrl || BIRTHDAY_CONFIG.primaryPhoto || null;
  const effectivelyLocked = isLocked || Boolean(BIRTHDAY_CONFIG.primaryPhoto);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          savePermanentPrimaryPhoto(compressed).then(() => {
            sound.playSuccessChime();
            onPhotoUploaded(compressed);
            setIsUploading(false);
            setShowUploadModal(false);
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full my-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
        className="hidden"
      />

      {effectivePhoto ? (
        /* PERMANENT LOCKED PHOTO DISPLAY
           Strict Requirement:
           - Hide Add Photo
           - Hide Replace Photo
           - Hide Change Photo
           - Hide Delete Photo
           No edit triggers anywhere!
        */
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/95 border-2 border-purple-100 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-sm shrink-0 bg-purple-50">
            <img
              src={effectivePhoto}
              alt={BIRTHDAY_CONFIG.recipientName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white" title="Locked Primary Photo">
              <Lock className="w-3 h-3 text-amber-300" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Primary Hero Memory • Locked Forever</span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-800 tracking-tight">
              {BIRTHDAY_CONFIG.recipientName}
            </h2>
            <p className="text-xs sm:text-sm font-handwritten text-purple-700 text-base leading-snug">
              {BIRTHDAY_CONFIG.headerSubtitle}
            </p>
          </div>
        </div>
      ) : (
        /* ONE-TIME UPLOAD BANNER (Only visible when no primary photo has been locked yet) */
        <div
          onClick={() => setShowUploadModal(true)}
          className="group flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-purple-50/70 hover:bg-purple-100/60 border-2 border-dashed border-purple-300 hover:border-purple-400 cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 font-display">
                One-Time Setup
              </span>
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">
                Set Primary Profile Photo
              </h3>
              <p className="text-xs font-handwritten text-purple-700 text-sm">
                Add your hero photo once. It will be permanently locked for this memories card! ✨
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-purple-600 group-hover:bg-purple-700 text-white font-display text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Select Photo</span>
          </div>
        </div>
      )}

      {/* One-time setup modal */}
      {showUploadModal && !effectivelyLocked && (
        <div
          onClick={() => setShowUploadModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FFFDF7] border-2 border-purple-200 rounded-3xl p-6 scrapbook-shadow-lg text-center relative"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>

            <h3 className="font-display font-bold text-slate-800 text-lg">
              Upload Primary Photo
            </h3>

            <p className="text-xs text-purple-700/80 font-handwritten text-base mt-1 mb-5">
              Notice: Once added, this photo is permanently locked and cannot be replaced or deleted! 📸💖
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Choose From Device</span>
            </button>

            <button
              onClick={() => setShowUploadModal(false)}
              className="mt-3 text-xs text-purple-600 underline font-display cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
