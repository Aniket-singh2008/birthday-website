import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { sound } from '../services/soundEffects';

interface SurpriseScreenProps {
  onYes: () => void;
}

export const SurpriseScreen: React.FC<SurpriseScreenProps> = ({ onYes }) => {
  const { surpriseQuestion } = BIRTHDAY_CONFIG;
  const [noCount, setNoCount] = useState(0);
  const [noButtonOffset, setNoButtonOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [playfulSpeech, setPlayfulSpeech] = useState<string | null>(null);

  const handleNoClick = () => {
    sound.playWobble();
    const responses = surpriseQuestion.playfulNoResponses;
    const nextResponse = responses[noCount % responses.length];
    setPlayfulSpeech(nextResponse);
    setNoCount((prev) => prev + 1);

    // Bounded playful dodge within safe container bounds (-50px to 50px)
    const randomX = (Math.random() - 0.5) * 80;
    const randomY = (Math.random() - 0.5) * 40;
    setNoButtonOffset({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#DDD6FE', '#FEF08A', '#FBCFE8', '#C084FC', '#F472B6'],
    });
    setTimeout(() => {
      onYes();
    }, 400);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center">
      {/* Top washi tape */}
      <div className="w-28 h-5 washi-tape-yellow -rotate-1 -mb-2 z-20 rounded-xs" />

      {/* Main card */}
      <div className="w-full bg-[#FFFDF7] border-2 border-purple-200 rounded-3xl p-7 sm:p-10 scrapbook-shadow relative overflow-hidden">
        {/* Floating stickers */}
        <span className="absolute top-4 left-6 text-2xl select-none animate-float">✨</span>
        <span className="absolute top-5 right-6 text-2xl select-none animate-pulse-soft">💖</span>
        <span className="absolute bottom-4 left-8 text-xl select-none">🌸</span>
        <span className="absolute bottom-4 right-8 text-xl select-none">⭐</span>

        {/* Cute Mascot Greeting Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-100 to-amber-100 border-2 border-purple-300 flex items-center justify-center text-4xl shadow-sm mb-4 animate-bounce">
          🎁
        </div>

        {/* Greeting Prose */}
        <p className="font-handwritten text-purple-700 text-2xl sm:text-3xl font-semibold mb-1">
          {surpriseQuestion.greeting}
        </p>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-purple-950 tracking-tight mb-6">
          {surpriseQuestion.question}
        </h2>

        {/* Playful speech bubble when 'No' is tapped */}
        {playfulSpeech && (
          <div className="mb-6 p-3 bg-purple-100/90 border border-purple-300 rounded-2xl text-purple-900 font-handwritten text-xl animate-wiggle shadow-xs inline-block max-w-xs">
            {playfulSpeech}
          </div>
        )}

        {/* Two large buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 relative min-h-[110px]">
          {/* YES Button (Grows more prominent if No is tapped) */}
          <button
            onClick={handleYesClick}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-display font-bold text-lg sm:text-xl shadow-lg shadow-purple-300/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer z-10 ${
              noCount > 0 ? 'scale-105 ring-4 ring-purple-200 animate-pulse-soft' : ''
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>{surpriseQuestion.yesButtonText}</span>
            <Heart className="w-5 h-5 fill-white text-white" />
          </button>

          {/* NO Button (Playful dodge interaction) */}
          <div
            style={{
              transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <button
              onClick={handleNoClick}
              onMouseEnter={noCount > 2 ? handleNoClick : undefined}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-purple-200 text-purple-700 hover:text-purple-900 font-display font-semibold text-base sm:text-lg shadow-xs transition-all active:scale-90 cursor-pointer"
            >
              {surpriseQuestion.noButtonText}
            </button>
          </div>
        </div>

        <p className="text-xs text-purple-500/70 mt-6 font-handwritten text-base">
          Handmade with care and love 💌
        </p>
      </div>

      {/* Bottom washi tape */}
      <div className="w-24 h-4 washi-tape-lavender rotate-2 -mt-2 z-20 rounded-xs" />
    </div>
  );
};
