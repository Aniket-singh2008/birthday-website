import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Upload, Link as LinkIcon, RefreshCw, Film } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { specialPageConfig } from '../config/specialPageConfig';
import { getPermanentSpecialPagePhoto, savePermanentSpecialPagePhoto } from '../services/photoStorage';
import { sound } from '../services/soundEffects';

interface SpecialPageScreenProps {
  onYes: () => void;
  onBackToStart?: () => void;
}

export const SpecialPageScreen: React.FC<SpecialPageScreenProps> = ({
  onYes,
}) => {
  // GIF / Photo source: 1. specialPageConfig, 2. birthdayConfig, 3. persistent storage
  const [gifUrl, setGifUrl] = useState<string | null>(() => {
    const fromSpecial = specialPageConfig.specialPageGif?.trim() || specialPageConfig.specialPagePhoto?.trim();
    if (fromSpecial) return fromSpecial;

    const fromBirthday = BIRTHDAY_CONFIG.specialPagePhoto?.trim();
    if (fromBirthday) return fromBirthday;

    const stored = getPermanentSpecialPagePhoto();
    return stored.photoUrl;
  });

  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [noOffset, setNoOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = getPermanentSpecialPagePhoto();
    if (stored.photoUrl && !gifUrl) {
      setGifUrl(stored.photoUrl);
    }
  }, [gifUrl]);

  // Handle local GIF / image file upload
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        await savePermanentSpecialPagePhoto(dataUrl);
        setGifUrl(dataUrl);
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle Preset GIF selection
  const handleSelectPreset = async (url: string) => {
    await savePermanentSpecialPagePhoto(url);
    setGifUrl(url);
    sound.playSuccessChime();
  };

  // Handle Custom GIF URL Submit
  const handleSaveCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      const url = customUrlInput.trim();
      await savePermanentSpecialPagePhoto(url);
      setGifUrl(url);
      setIsUrlModalOpen(false);
      setCustomUrlInput('');
      sound.playSuccessChime();
    }
  };

  // Playful interaction when user tries to click/hover "No"
  const handleNoClick = () => {
    sound.playWobble();
    setNoCount((prev) => prev + 1);

    // Playful dodge movement
    const randomX = (Math.random() - 0.5) * 80;
    const randomY = (Math.random() - 0.5) * 45;
    setNoOffset({ x: randomX, y: randomY });
  };

  // When user clicks "Yes" -> trigger celebration confetti and navigate to Memories!
  const handleYesClick = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 110,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#FFAEC0', '#B9C6FF', '#FBBF24', '#F472B6', '#FFFFFF'],
    });
    setTimeout(() => {
      onYes();
    }, 450);
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FAF5EC] flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      {/* Hidden file input for uploading any GIF / Image */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".gif,image/gif,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Card Container exactly holding the reference card image */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[2/3] shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden">
        {/* The Exact Card Illustration Background */}
        <img
          src="/images/bunny_bear_card.svg"
          alt="Surprise Card"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* ============================================================== */}
        {/* CENTER BLANK BOX (INTERACTIVE GIF / PHOTO SLOT)                */}
        {/* Position: x: 12.8%, y: 32.0%, w: 74.4%, h: 35.67%             */}
        {/* ============================================================== */}
        <div
          style={{
            position: 'absolute',
            left: '13.2%',
            top: '32.3%',
            width: '73.6%',
            height: '35.1%',
          }}
          className="rounded-[22px] sm:rounded-[26px] overflow-hidden z-20 flex flex-col items-center justify-center"
        >
          {gifUrl ? (
            /* GIF is displayed and animated smoothly inside the exact box */
            <div className="relative w-full h-full group bg-slate-50">
              <img
                src={gifUrl}
                alt="Selected GIF"
                className="w-full h-full object-cover select-none"
              />
              {/* Subtle hover overlay to change GIF if user wishes */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/80 text-white font-display text-[11px] flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Change GIF"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Change GIF</span>
                </button>
              </div>
            </div>
          ) : (
            /* Blank Box State: Full Option to Add GIF (Upload, URL, or Presets) */
            <div className="w-full h-full bg-[#FAF8F5] p-3 flex flex-col items-center justify-between text-center overflow-y-auto">
              <div className="flex flex-col items-center justify-center mt-1">
                <div className="w-11 h-11 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-purple-600 mb-1 shadow-xs animate-bounce">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base leading-tight">
                  Add a Cute GIF
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Upload GIF or pick one below
                </p>
              </div>

              {/* Main Action Buttons: Upload or Paste Link */}
              <div className="w-full flex items-center justify-center gap-2 my-1 px-1">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-semibold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload GIF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(true)}
                  className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-display font-medium text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Paste GIF Link"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Link</span>
                </button>
              </div>

              {/* Cute 1-Click GIF Presets */}
              <div className="w-full pt-1 border-t border-slate-200/80">
                <span className="text-[10px] text-purple-700 font-medium block mb-1">
                  Or pick a preset:
                </span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {specialPageConfig.presetGifs?.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-display font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE PINK "YES" BUTTON (CLICK TO GO TO MEMORIES)        */}
        {/* Position: x: 10.2%, y: 78.0%, w: 37.6%, h: 8.0%               */}
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
          title="Click Yes to see Memories!"
          aria-label="Yes Button"
        >
          <span className="sr-only">Yes</span>
        </button>

        {/* ============================================================== */}
        {/* INTERACTIVE LAVENDER-BLUE "NO" BUTTON (PLAYFUL DODGE)          */}
        {/* Position: x: 52.6%, y: 78.0%, w: 37.6%, h: 8.0%               */}
        {/* ============================================================== */}
        <motion.div
          animate={{ x: noOffset.x, y: noOffset.y }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          style={{
            position: 'absolute',
            left: '52.6%',
            top: '77.5%',
            width: '39%',
            height: '9%',
          }}
          className="z-30"
        >
          <button
            type="button"
            onClick={handleNoClick}
            onMouseEnter={noCount > 0 ? handleNoClick : undefined}
            className="w-full h-full rounded-full cursor-pointer transition-transform active:scale-90 focus:outline-hidden"
            title="No"
            aria-label="No Button"
          >
            <span className="sr-only">No</span>
          </button>
        </motion.div>
      </div>

      {/* Action Button to Memories */}
      <div className="mt-4 flex flex-col items-center gap-2 z-30 text-center px-2">
        <button
          type="button"
          onClick={handleYesClick}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>📸 View Memories Album ("Moments of Us") ❤️ →</span>
        </button>

        <span className="text-[11px] text-purple-800/80 font-medium">
          Tap "Yes" on the card, or click the button above to see all memory photos
        </span>
      </div>

      {/* URL Input Modal for Pasting GIF Links */}
      <AnimatePresence>
        {isUrlModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-2 border-purple-200"
            >
              <div className="flex items-center gap-2 text-purple-900 font-display font-bold text-lg mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Paste GIF URL</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-body">
                Paste any GIF link (e.g. from Giphy, Tenor, Pinterest)
              </p>
              <form onSubmit={handleSaveCustomUrl} className="flex flex-col gap-3">
                <input
                  type="url"
                  placeholder="https://.../cute.gif"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-purple-600 text-sm font-body"
                  autoFocus
                  required
                />
                <div className="flex items-center justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsUrlModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-display font-medium text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-xs shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    Save GIF
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
