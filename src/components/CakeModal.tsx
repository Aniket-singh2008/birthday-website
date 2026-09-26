import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Heart } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface CakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CakeModal: React.FC<CakeModalProps> = ({ isOpen, onClose }) => {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [wishMade, setWishMade] = useState(false);

  if (!isOpen) return null;

  const handleCandleClick = (index: number) => {
    sound.playPop();
    const next = [...candlesLit];
    next[index] = false;
    setCandlesLit(next);

    // If all blown out:
    if (next.every((lit) => !lit) && !wishMade) {
      setWishMade(true);
      sound.playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#DDD6FE', '#FEF08A', '#FBCFE8', '#F472B6', '#60A5FA'],
      });
    }
  };

  const handleBlowAll = () => {
    sound.playPop();
    setCandlesLit([false, false, false]);
    setWishMade(true);
    sound.playSuccessChime();
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#DDD6FE', '#FEF08A', '#FBCFE8', '#F472B6', '#60A5FA'],
    });
  };

  const handleRelight = () => {
    sound.playPop();
    setCandlesLit([true, true, true]);
    setWishMade(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#FFFDF8] border-2 border-purple-200 rounded-3xl p-6 sm:p-8 scrapbook-shadow-lg relative text-center">
        {/* Close Button */}
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

        {/* Washi tape header */}
        <div className="w-20 h-4 washi-tape-lavender -rotate-1 mx-auto -mt-3 mb-3 rounded-xs" />

        <h3 className="text-2xl font-display font-bold text-purple-950">
          Make a Birthday Wish!
        </h3>
        <p className="text-xs sm:text-sm font-handwritten text-purple-700 text-lg mt-0.5 mb-6">
          Tap each candle to blow it out 🎂✨
        </p>

        {/* CAKE ILLUSTRATION WITH CANDLES */}
        <div className="relative w-48 h-40 mx-auto my-2 flex flex-col items-center justify-end">
          {/* Candle Flames & Wicks */}
          <div className="flex justify-center gap-6 mb-1 z-20">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => handleCandleClick(idx)}
                className="flex flex-col items-center cursor-pointer group"
                title="Tap to blow out candle"
              >
                {/* Flame */}
                {isLit ? (
                  <div className="w-4 h-5 bg-gradient-to-t from-amber-500 via-yellow-300 to-amber-100 rounded-full animate-bounce shadow-md shadow-amber-300/80 mb-0.5 group-hover:scale-125 transition-transform" />
                ) : (
                  <div className="w-2 h-4 text-slate-400 font-mono text-[10px] animate-pulse">
                    ~
                  </div>
                )}
                {/* Candle Stick */}
                <div
                  className={`w-3 h-10 rounded-t-sm border border-purple-300 ${
                    idx === 0
                      ? 'bg-gradient-to-b from-pink-300 to-pink-200'
                      : idx === 1
                      ? 'bg-gradient-to-b from-purple-300 to-purple-200'
                      : 'bg-gradient-to-b from-amber-300 to-amber-200'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Top Cake Tier (Frosting) */}
          <div className="w-36 h-12 bg-pink-100 border-2 border-pink-300 rounded-t-2xl relative shadow-inner flex items-center justify-around px-2 z-10">
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
          </div>

          {/* Bottom Cake Tier */}
          <div className="w-44 h-16 bg-[#FFF2D8] border-2 border-amber-300 rounded-b-2xl -mt-1 relative shadow-md flex items-center justify-center">
            <div className="text-center font-handwritten text-amber-800 text-lg font-bold">
              Happy Birthday 💖
            </div>
          </div>

          {/* Cake Stand */}
          <div className="w-48 h-3 bg-purple-200 border border-purple-300 rounded-full mt-1" />
        </div>

        {/* State Feedback */}
        <div className="min-h-12 my-3 flex items-center justify-center">
          {wishMade ? (
            <div className="space-y-1">
              <p className="text-base font-display font-bold text-purple-900 animate-pulse flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Wish Sealed in the Stars!
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              </p>
              <p className="text-xs text-purple-600 font-handwritten text-base">
                May every single dream of yours come true this year!
              </p>
            </div>
          ) : (
            <button
              onClick={handleBlowAll}
              className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-display text-xs font-semibold cursor-pointer border border-purple-300 active:scale-95"
            >
              💨 Blow Out All Candles
            </button>
          )}
        </div>

        {wishMade && (
          <button
            onClick={handleRelight}
            className="text-xs text-purple-600 underline font-handwritten text-base cursor-pointer hover:text-purple-800"
          >
            Light them again ✨
          </button>
        )}
      </div>
    </div>
  );
};
