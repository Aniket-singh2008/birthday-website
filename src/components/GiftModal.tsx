import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, Heart } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose }) => {
  const [isOpened, setIsOpened] = useState(false);

  if (!isOpen) return null;

  const handleOpenGift = () => {
    sound.playSuccessChime();
    setIsOpened(true);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#DDD6FE', '#FEF08A', '#FBCFE8', '#F472B6', '#C084FC'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#FFFDF8] border-2 border-purple-200 rounded-3xl p-6 sm:p-8 scrapbook-shadow-lg relative text-center">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-4 washi-tape-pink -rotate-1 mx-auto -mt-3 mb-3 rounded-xs" />

        <h3 className="text-2xl font-display font-bold text-purple-950">
          {isOpened ? 'Your Birthday Voucher!' : 'A Special Birthday Token'}
        </h3>
        <p className="text-xs sm:text-sm font-handwritten text-purple-700 text-lg mt-0.5 mb-5">
          {isOpened ? 'Redeemable anytime with zero expiration date!' : 'Tap the gift box to unwrap ✨'}
        </p>

        {!isOpened ? (
          <div
            onClick={handleOpenGift}
            className="my-6 p-6 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-100 border-2 border-dashed border-purple-300 flex flex-col items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md mb-2 group-hover:rotate-6 transition-transform">
              <Gift className="w-10 h-10 text-pink-500 animate-bounce" />
            </div>
            <span className="font-display font-bold text-purple-900 text-base mt-2">
              Tap to Unwrap 🎀
            </span>
            <span className="font-handwritten text-purple-600 text-base">
              A little token of love inside
            </span>
          </div>
        ) : (
          <div className="my-5 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Official Birthday Pass
              </span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-display font-bold text-purple-950 text-lg">
              One Free Wish & Treat Coupon 🎟️
            </p>
            <p className="font-handwritten text-purple-800 text-xl mt-1 leading-snug">
              Valid for: One full day of whatever treats, ice creams, favorite movies, or adventure you desire!
            </p>
            <div className="mt-4 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-medium">
              <span>Status: <strong className="text-emerald-700">Active Forever</strong></span>
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500 inline" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
