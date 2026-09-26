import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Check, Lock } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { getItemPersistent, setItemPersistent, compressImageFile } from '../services/dbStorage';

interface Gift2BlankScreenProps {
  onBackToGifts: () => void;
}

const STORAGE_KEY_GIFT2_PHOTO = 'gift_2_blank_custom_photo';
const STORAGE_KEY_GIFT2_LOCKED = 'gift_2_blank_photo_locked';

export const Gift2BlankScreen: React.FC<Gift2BlankScreenProps> = ({ onBackToGifts }) => {
  const [photo, setPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIFT2_PHOTO);
    } catch {
      return null;
    }
  });

  const [isSaved, setIsSaved] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY_GIFT2_PHOTO));
    } catch {
      return false;
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from persistent IndexedDB store on mount if not in localStorage
  useEffect(() => {
    async function loadPhoto() {
      const stored = await getItemPersistent(STORAGE_KEY_GIFT2_PHOTO);
      if (stored) {
        setPhoto(stored);
        setIsSaved(true);
      }
    }
    loadPhoto();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playPop();
      try {
        const compressed = await compressImageFile(file);
        setPhoto(compressed);
        setIsSaved(true);
        await setItemPersistent(STORAGE_KEY_GIFT2_PHOTO, compressed);
        await setItemPersistent(STORAGE_KEY_GIFT2_LOCKED, 'true');
        sound.playSuccessChime();
      } catch (err) {
        console.error('Failed to save photo:', err);
      }
    }
    e.target.value = '';
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FEF6EE] flex flex-col items-center justify-start p-3 sm:p-6 select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Navigation Row */}
      <div className="w-full max-w-[500px] flex items-center justify-between mb-4 px-1 z-30">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToGifts();
          }}
          className="px-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200 shadow-2xs font-display font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
          <span>← Back to Gifts</span>
        </button>

        {/* Saved & Locked indicator */}
        {photo && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-display font-semibold shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Photo Saved & Locked</span>
          </div>
        )}
      </div>

      {/* Main Dedicated Photo Container */}
      <div className="w-full max-w-[460px] sm:max-w-[500px] flex-1 flex flex-col items-center justify-center my-auto">
        <div
          onClick={() => {
            if (!photo) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative w-full aspect-square rounded-[32px] sm:rounded-[36px] overflow-hidden transition-all shadow-md ${
            photo
              ? 'border-4 border-white bg-white'
              : 'border-2 border-dashed border-purple-200 bg-white/80 hover:bg-white cursor-pointer group'
          }`}
        >
          {photo ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={photo}
                alt="Gift 2 Saved Photo"
                className="w-full h-full object-contain select-none pointer-events-none rounded-2xl"
              />
              {/* Permanent lock badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-display font-medium flex items-center gap-1 shadow-md pointer-events-none">
                <Lock className="w-3 h-3 text-pink-300" />
                <span>Saved Permanently</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-purple-400 group-hover:text-purple-600 transition-colors h-full">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                <Plus className="w-8 h-8 text-purple-400 group-hover:text-purple-600" />
              </div>
              <span className="text-xs sm:text-sm font-display font-medium">
                Add Photo / Image
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
