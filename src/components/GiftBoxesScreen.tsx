import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { giftImageAssets } from '../assets/giftImages';
import { getItemPersistent, setItemPersistent, compressImageFile } from '../services/dbStorage';

interface GiftBoxesScreenProps {
  onOpenMemories: () => void;
  onOpenGift2: () => void;
  onBackToBirthday?: () => void;
}

const STORAGE_KEY_GIFT_1 = 'gift1_image_slot';
const STORAGE_KEY_GIFT_2 = 'gift2_image_slot';
const STORAGE_KEY_GIFT_3 = 'gift3_image_slot';
const STORAGE_KEY_GIFT_4 = 'gift4_image_slot';

export const GiftBoxesScreen: React.FC<GiftBoxesScreenProps> = ({
  onOpenMemories,
  onOpenGift2,
  onBackToBirthday,
}) => {
  // Visual image state for each of the 4 gift boxes
  const [gift1Image, setGift1Image] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIFT_1) || giftImageAssets.gift1Image;
    } catch {
      return giftImageAssets.gift1Image;
    }
  });

  const [gift2Image, setGift2Image] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIFT_2) || giftImageAssets.gift2Image;
    } catch {
      return giftImageAssets.gift2Image;
    }
  });

  const [gift3Image, setGift3Image] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIFT_3) || giftImageAssets.gift3Image;
    } catch {
      return giftImageAssets.gift3Image;
    }
  });

  const [gift4Image, setGift4Image] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIFT_4) || giftImageAssets.gift4Image;
    } catch {
      return giftImageAssets.gift4Image;
    }
  });

  // Load persistent IndexedDB backups on mount
  useEffect(() => {
    async function loadPersisted() {
      const g1 = await getItemPersistent(STORAGE_KEY_GIFT_1);
      if (g1) setGift1Image(g1);
      const g2 = await getItemPersistent(STORAGE_KEY_GIFT_2);
      if (g2) setGift2Image(g2);
      const g3 = await getItemPersistent(STORAGE_KEY_GIFT_3);
      if (g3) setGift3Image(g3);
      const g4 = await getItemPersistent(STORAGE_KEY_GIFT_4);
      if (g4) setGift4Image(g4);
    }
    loadPersisted();
  }, []);

  // Dedicated file input refs for each gift slot
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);

  // File upload handler for visual slots with automatic compression & persistent storage
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    storageKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playPop();
      try {
        const compressed = await compressImageFile(file);
        setter(compressed);
        await setItemPersistent(storageKey, compressed);
        sound.playSuccessChime();
      } catch (err) {
        console.error('Failed to save image:', err);
      }
    }
    e.target.value = '';
  };

  const handleResetImage = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    storageKey: string
  ) => {
    setter(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  // Click handlers for functionality (Kept 100% unchanged)
  const handleBox1Click = () => {
    sound.playSuccessChime();
    onOpenMemories();
  };

  const handleBox2Click = () => {
    sound.playSuccessChime();
    onOpenGift2();
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FEF6EE] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Hidden File Inputs for each of the 4 Gift Image Slots */}
      <input
        ref={inputRef1}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setGift1Image, STORAGE_KEY_GIFT_1)}
        className="hidden"
      />
      <input
        ref={inputRef2}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setGift2Image, STORAGE_KEY_GIFT_2)}
        className="hidden"
      />
      <input
        ref={inputRef3}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setGift3Image, STORAGE_KEY_GIFT_3)}
        className="hidden"
      />
      <input
        ref={inputRef4}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setGift4Image, STORAGE_KEY_GIFT_4)}
        className="hidden"
      />

      {/* Top back navigation */}
      {onBackToBirthday && (
        <div className="w-full max-w-[460px] sm:max-w-[500px] flex items-center justify-between mb-2 px-1">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onBackToBirthday();
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200 shadow-2xs font-display font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
            <span>← Back</span>
          </button>
        </div>
      )}

      {/* Main Square Card Container matching the uploaded reference image exactly */}
      <div className="relative w-full max-w-[460px] sm:max-w-[500px] aspect-square shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group/card">
        {/* Background Card Illustration (Visually untouched) */}
        <img
          src="/images/here_is_your_gifts_card.svg"
          alt="Here is your gifts"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* ============================================================== */}
        {/* VISUAL IMAGE SLOTS (Visual only - displays uploaded images)    */}
        {/* ============================================================== */}
        {/* Gift 1 Visual Image Slot */}
        <div
          style={{
            position: 'absolute',
            left: '2.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            pointerEvents: 'none',
          }}
          className="z-20 flex items-center justify-center overflow-hidden"
        >
          {gift1Image && (
            <img
              src={gift1Image}
              alt="Gift 1"
              className="w-full h-full object-contain select-none"
            />
          )}
        </div>

        {/* Gift 2 Visual Image Slot */}
        <div
          style={{
            position: 'absolute',
            left: '26.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            pointerEvents: 'none',
          }}
          className="z-20 flex items-center justify-center overflow-hidden"
        >
          {gift2Image && (
            <img
              src={gift2Image}
              alt="Gift 2"
              className="w-full h-full object-contain select-none"
            />
          )}
        </div>

        {/* Gift 3 Visual Image Slot */}
        <div
          style={{
            position: 'absolute',
            left: '50.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            pointerEvents: 'none',
          }}
          className="z-20 flex items-center justify-center overflow-hidden"
        >
          {gift3Image && (
            <img
              src={gift3Image}
              alt="Gift 3"
              className="w-full h-full object-contain select-none"
            />
          )}
        </div>

        {/* Gift 4 Visual Image Slot */}
        <div
          style={{
            position: 'absolute',
            left: '74.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            pointerEvents: 'none',
          }}
          className="z-20 flex items-center justify-center overflow-hidden"
        >
          {gift4Image && (
            <img
              src={gift4Image}
              alt="Gift 4"
              className="w-full h-full object-contain select-none"
            />
          )}
        </div>

        {/* ============================================================== */}
        {/* CLICKABLE AREAS / FUNCTIONALITY (Completely unchanged)         */}
        {/* ============================================================== */}
        {/* GIFT BOX 1: CLICK HANDLER (OPENS EXISTING MEMORIES PAGE)       */}
        <div
          onClick={handleBox1Click}
          style={{
            position: 'absolute',
            left: '2.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            cursor: 'pointer',
          }}
          className="z-30"
          role="button"
          tabIndex={0}
          aria-label="Gift Box 1"
          title="Gift Box 1"
        />

        {/* GIFT BOX 2: CLICK HANDLER (OPENS GIFT 2 PAGE)                  */}
        <div
          onClick={handleBox2Click}
          style={{
            position: 'absolute',
            left: '26.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
            cursor: 'pointer',
          }}
          className="z-30"
          role="button"
          tabIndex={0}
          aria-label="Gift Box 2"
          title="Gift Box 2"
        />

        {/* GIFT BOX 3+: Inactive as instructed                            */}
        <div
          style={{
            position: 'absolute',
            left: '50.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
          }}
          className="z-30"
          aria-label="Gift Box 3"
        />
        <div
          style={{
            position: 'absolute',
            left: '74.5%',
            top: '41.5%',
            width: '23.0%',
            height: '24.0%',
          }}
          className="z-30"
          aria-label="Gift Box 4"
        />
      </div>

      {/* ============================================================== */}
      {/* SEPARATE VISUAL IMAGE UPLOAD CONTROLS                          */}
      {/* Kept outside the clickable card so functionality is untouched  */}
      {/* ============================================================== */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 z-40 max-w-[500px]">
        <span className="text-[10px] font-display font-medium text-purple-900/60 mr-1">
          Upload Box Images:
        </span>

        {/* Slot 1 Image Control */}
        <button
          type="button"
          onClick={() => inputRef1.current?.click()}
          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-purple-900 border border-purple-200/80 shadow-2xs font-display text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          title="Change Gift 1 Image"
        >
          <Camera className="w-2.5 h-2.5 text-pink-500" />
          <span>Box 1</span>
        </button>
        {gift1Image && (
          <button
            type="button"
            onClick={() => handleResetImage(setGift1Image, STORAGE_KEY_GIFT_1)}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] transition-all active:scale-95"
            title="Reset Box 1 Image"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Slot 2 Image Control */}
        <button
          type="button"
          onClick={() => inputRef2.current?.click()}
          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-purple-900 border border-purple-200/80 shadow-2xs font-display text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          title="Change Gift 2 Image"
        >
          <Camera className="w-2.5 h-2.5 text-pink-500" />
          <span>Box 2</span>
        </button>
        {gift2Image && (
          <button
            type="button"
            onClick={() => handleResetImage(setGift2Image, STORAGE_KEY_GIFT_2)}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] transition-all active:scale-95"
            title="Reset Box 2 Image"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Slot 3 Image Control */}
        <button
          type="button"
          onClick={() => inputRef3.current?.click()}
          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-purple-900 border border-purple-200/80 shadow-2xs font-display text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          title="Change Gift 3 Image"
        >
          <Camera className="w-2.5 h-2.5 text-pink-500" />
          <span>Box 3</span>
        </button>
        {gift3Image && (
          <button
            type="button"
            onClick={() => handleResetImage(setGift3Image, STORAGE_KEY_GIFT_3)}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] transition-all active:scale-95"
            title="Reset Box 3 Image"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Slot 4 Image Control */}
        <button
          type="button"
          onClick={() => inputRef4.current?.click()}
          className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-purple-900 border border-purple-200/80 shadow-2xs font-display text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          title="Change Gift 4 Image"
        >
          <Camera className="w-2.5 h-2.5 text-pink-500" />
          <span>Box 4</span>
        </button>
        {gift4Image && (
          <button
            type="button"
            onClick={() => handleResetImage(setGift4Image, STORAGE_KEY_GIFT_4)}
            className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] transition-all active:scale-95"
            title="Reset Box 4 Image"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
};
