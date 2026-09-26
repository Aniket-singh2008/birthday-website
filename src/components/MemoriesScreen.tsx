import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, X, Plus, Image as ImageIcon, Sparkles, Heart, Star, Music, Volume2, VolumeX, Lock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { memoryPhotos, MemoryPhotoSlot } from '../config/memoriesConfig';
import { getCustomMemoryBoxPhotos, saveCustomMemoryBoxPhoto } from '../services/photoStorage';
import { sound } from '../services/soundEffects';

interface MemoriesScreenProps {
  onLockApp?: () => void;
  onBackToStart?: () => void;
  onBackToGifts?: () => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({ onLockApp, onBackToStart, onBackToGifts }) => {
  // Category tabs
  const categories = ['All', 'Images', 'Videos', 'News', 'Maps', 'Memories'];
  const [selectedCategory, setSelectedCategory] = useState<string>('Memories');

  // Photo slots state: merges memoriesConfig (exactly 8 slots) with any persistent custom uploads
  const [photos, setPhotos] = useState<MemoryPhotoSlot[]>(() => {
    const customUploads = getCustomMemoryBoxPhotos();
    return memoryPhotos.slice(0, 8).map((item) => ({
      id: item.id,
      image: item.image || customUploads[item.id] || '',
    }));
  });

  // Lightbox full-screen state
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Hidden file input for uploading a photo into a specific slot
  const [uploadSlotId, setUploadSlotId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound & Music state
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sound.isMusicActive());

  // Listen for Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSlotClick = (slot: MemoryPhotoSlot) => {
    sound.playPop();
    if (slot.image) {
      // Open Lightbox
      setActivePhoto(slot.image);
    } else {
      // Trigger file selector to add photo
      setUploadSlotId(slot.id);
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadSlotId !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        saveCustomMemoryBoxPhoto(uploadSlotId, dataUrl);
        setPhotos((prev) =>
          prev.map((item) => (item.id === uploadSlotId ? { ...item, image: dataUrl } : item))
        );
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    setIsMusicPlaying(sound.isMusicActive());
  };

  const handleToggleMusic = () => {
    const active = sound.toggleMusic();
    setIsMusicPlaying(active);
  };

  // Colorful pastel letter styling for "Memories"
  const titleLetters = [
    { char: 'M', color: 'text-[#4F86F7]' }, // soft pastel cornflower blue
    { char: 'e', color: 'text-[#EA5A47]' }, // soft pastel coral red
    { char: 'm', color: 'text-[#F5B82E]' }, // soft pastel honey yellow
    { char: 'o', color: 'text-[#4F86F7]' }, // soft pastel blue
    { char: 'r', color: 'text-[#34A853]' }, // soft pastel mint green
    { char: 'i', color: 'text-[#A855F7]' }, // soft pastel lavender
    { char: 'e', color: 'text-[#EC4899]' }, // soft pastel sweet pink
    { char: 's', color: 'text-[#38BDF8]' }, // soft pastel sky blue
  ];

  return (
    <div className="relative w-full min-h-screen py-4 sm:py-6 px-3 sm:px-6 flex flex-col items-center select-none overflow-x-hidden">
      {/* Hidden file input for adding photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ============================================================== */}
      {/* TOP UTILITY BAR (Back to Start, Music & Sound)                 */}
      {/* ============================================================== */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 sm:mb-4 px-1 z-30">
        <div className="flex items-center gap-2">
          {/* Back button: Returns to Gift Box page if opened from gifts, otherwise back to start */}
          {onBackToGifts ? (
            <button
              onClick={() => {
                sound.playPop();
                onBackToGifts();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs hover:shadow-sm font-display font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              <span>← Back to Gifts 🎁</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                if (onBackToStart) onBackToStart();
                else if (onLockApp) onLockApp();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs hover:shadow-sm font-display font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              <span>← Back to Start</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-purple-700/80 font-handwritten text-base ml-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Our Sweet Memories Collection</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Music toggle */}
          <button
            onClick={handleToggleMusic}
            title={isMusicPlaying ? 'Pause Melody' : 'Play Melody'}
            className={`px-2.5 py-1 rounded-full text-xs font-display font-medium flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
              isMusicPlaying
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-white/90 text-purple-800 hover:bg-purple-50 border-purple-200'
            }`}
          >
            <Music className="w-3 h-3" />
            <span className="hidden xs:inline">{isMusicPlaying ? 'Melody On' : 'Music Box'}</span>
          </button>

          {/* Sound mute toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="w-7 h-7 rounded-full bg-white/90 text-purple-700 hover:bg-purple-50 border border-purple-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Lock App */}
          {onLockApp && (
            <button
              onClick={() => {
                sound.playPop();
                if (onBackToStart) onBackToStart();
                else onLockApp();
              }}
              title="Lock with passcode"
              className="w-7 h-7 rounded-full bg-white/90 text-purple-700 hover:bg-purple-50 border border-purple-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Lock className="w-3 h-3 text-purple-600" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DECORATIVE ELEMENTS: Scrapbook torn shapes, stars, sparkles    */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-70">
        {/* Subtle lavender torn paper accents in corners/edges */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-200/50 rounded-3xl rotate-12 filter blur-[1px]" />
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-purple-200/40 rounded-full rotate-45 filter blur-[1px]" />
        <div className="absolute top-1/4 -left-8 w-20 h-20 bg-amber-100/60 rounded-2xl -rotate-12" />
        <div className="absolute top-1/3 -right-6 w-20 h-20 bg-pink-100/60 rounded-2xl rotate-12" />
        
        {/* Tiny stars, sparkles and hearts */}
        <span className="absolute top-8 left-4 sm:left-12 text-lg text-amber-400 animate-float select-none">✨</span>
        <span className="absolute top-16 right-6 sm:right-16 text-base text-purple-400 animate-pulse-soft select-none">⭐</span>
        <span className="absolute top-36 left-2 sm:left-8 text-sm text-pink-400 select-none">💕</span>
        <span className="absolute top-44 right-3 sm:right-10 text-base text-amber-400 animate-float select-none" style={{ animationDelay: '1.2s' }}>🌟</span>
        <span className="absolute bottom-32 left-4 text-base text-purple-400 select-none animate-pulse-soft">✨</span>
        <span className="absolute bottom-20 right-6 text-lg text-pink-400 select-none animate-float">💖</span>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP AREA: Large Playful Colorful "Memories" Title           */}
      {/* ============================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center mt-2 mb-4 sm:mb-5">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight flex items-center justify-center gap-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
          {titleLetters.map((item, index) => (
            <span
              key={index}
              className={`${item.color} transform hover:scale-110 transition-transform duration-200 inline-block`}
            >
              {item.char}
            </span>
          ))}
        </h1>
        {/* Cute micro-sparkle badge */}
        <div className="flex items-center gap-1 mt-1 text-[11px] sm:text-xs font-handwritten text-purple-700/80">
          <span>✨</span>
          <span>Cherished moments captured with love</span>
          <span>✨</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SEARCH BAR: "Moments of us ❤️" with Mic & Camera Icons      */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full max-w-xl mx-auto mb-4 sm:mb-5">
        <div className="w-full bg-white/95 backdrop-blur-xs border-2 border-purple-200/90 rounded-full py-2.5 px-4 sm:py-3 sm:px-5 flex items-center justify-between shadow-[0_4px_16px_rgba(168,85,247,0.08)] hover:border-purple-300 transition-colors">
          {/* Left search icon */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
            <span className="font-display text-sm sm:text-base text-slate-700 font-medium truncate select-none">
              Moments of us ❤️
            </span>
          </div>

          {/* Right decorative icons (Microphone & Camera) */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 shrink-0 border-l border-purple-100">
            {/* Microphone icon */}
            <div
              title="Voice memories"
              className="p-1 rounded-full text-[#4F86F7] hover:bg-blue-50 transition-colors cursor-default"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {/* Camera icon with Google Lens style colorful accents */}
            <div
              title="Camera moments"
              className="p-1 rounded-full hover:bg-purple-50 transition-colors cursor-default relative"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#EA5A47]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F5B82E] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CATEGORY NAVIGATION: All, Images, Videos, News, Maps, Memories */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full max-w-xl mx-auto mb-5 sm:mb-6">
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  sound.playPop();
                  setSelectedCategory(category);
                }}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-display font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-100 text-purple-900 border-2 border-purple-300 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
                }`}
              >
                {category === 'Memories' ? '✨ Memories' : category}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. PHOTO GRID: Exactly 8 Configurable Photo Slots              */}
      {/* - Mobile: 2-column grid (4 rows of 2 = 8 cards)                */}
      {/* - Tablet/Desktop: 4-column grid (2 rows of 4 = 8 cards)        */}
      {/* - Fixed positions, object-fit: cover, rectangular/rounded cards*/}
      {/* ============================================================== */}
      <div className="relative z-20 w-full max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {photos.map((slot) => {
            const hasPhoto = Boolean(slot.image && slot.image.trim() !== '');

            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`group relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  hasPhoto
                    ? 'bg-white border-2 border-white/95 shadow-sm'
                    : 'bg-white/80 border-2 border-dashed border-purple-200/90 hover:border-purple-300 hover:bg-white shadow-2xs flex flex-col items-center justify-center p-3 text-center'
                }`}
              >
                {hasPhoto ? (
                  <>
                    {/* Rendered photo filling frame with object-fit: cover */}
                    <img
                      src={slot.image}
                      alt={`Memory ${slot.id}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Subtle aesthetic gradient overlay at bottom for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2.5">
                      <span className="text-[11px] font-display font-semibold text-white/95 drop-shadow-sm">
                        Memory #{slot.id}
                      </span>
                      <span className="text-white text-xs">✨</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Subtle "Add Photo" placeholder */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-purple-200/80 transition-all duration-300 shadow-2xs">
                      <Plus className="w-5 h-5 text-purple-600 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-display font-semibold text-purple-900/90">
                      Add Photo
                    </span>
                    <span className="text-[10px] font-handwritten text-purple-600/70 mt-0.5">
                      Slot #{slot.id}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. LIGHTBOX / FULL-SCREEN PHOTO VIEWER                         */}
      {/* - Large image, dark translucent background, close button       */}
      {/* - Smooth opening/closing animation                             */}
      {/* - No photo editing or replacement controls                     */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close button in top-right */}
            <button
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo view"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-60"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Modal image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            >
              <img
                src={activePhoto}
                alt="Full memory view"
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. BACK TO START BUTTON (Prominent rounded button at bottom)   */}
      {/* ============================================================== */}
      <div className="w-full max-w-xs sm:max-w-sm flex justify-center mt-10 mb-2 z-20">
        <button
          onClick={() => {
            sound.playPop();
            if (onBackToStart) onBackToStart();
            else if (onLockApp) onLockApp();
          }}
          className="w-full py-3 px-6 rounded-full bg-white/95 hover:bg-white text-purple-950 border-2 border-purple-200/90 shadow-sm hover:shadow-md font-display font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Start</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* FOOTER: Subtle clean note                                      */}
      {/* ============================================================== */}
      <footer className="w-full max-w-4xl mt-8 pt-4 pb-6 text-center text-xs font-handwritten text-purple-700/60 flex items-center justify-center gap-1.5">
        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
        <span>Moments are forever</span>
        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
      </footer>
    </div>
  );
};
