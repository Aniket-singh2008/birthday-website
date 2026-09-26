import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { sound } from '../services/soundEffects';

interface VirtualHugProps {
  onReplay: () => void;
  onGoToMenu: () => void;
}

interface FloatingHeart {
  id: number;
  left: number;
  size: number;
  color: string;
}

export const VirtualHug: React.FC<VirtualHugProps> = ({ onReplay, onGoToMenu }) => {
  const { virtualHug, recipientName } = BIRTHDAY_CONFIG;
  const [progress, setProgress] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Hug loading animation progression
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.floor(Math.random() * 14) + 8;
        const next = Math.min(100, prev + step);
        if (next === 100) {
          setTimeout(() => {
            setIsDelivered(true);
            sound.playHugChord();
            confetti({
              particleCount: 90,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#F472B6', '#DDD6FE', '#FEF08A', '#FB7185', '#C084FC'],
            });
          }, 300);
        }
        return next;
      });
    }, 280);

    return () => clearInterval(timer);
  }, []);

  // Send love back interactive burst
  const handleSendLove = () => {
    sound.playPop();
    const newHearts: FloatingHeart[] = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
      size: Math.random() * 14 + 18,
      color: ['#F472B6', '#EC4899', '#A855F7', '#F43F5E', '#FB7185'][Math.floor(Math.random() * 5)],
    }));

    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center relative">
      {/* Floating Hearts from user clicks */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-50 animate-float"
          style={{
            left: `${heart.left}%`,
            bottom: '20%',
            fontSize: `${heart.size}px`,
            color: heart.color,
            transition: 'all 2s ease-out',
            transform: 'translateY(-120px)',
          }}
        >
          💖
        </div>
      ))}

      {/* Top washi tape */}
      <div className="w-28 h-5 washi-tape-lavender -rotate-1 -mb-2 z-20 rounded-xs" />

      {/* Main Hug Card */}
      <div className="w-full bg-[#FFFDF8] border-2 border-purple-200 rounded-3xl p-6 sm:p-10 scrapbook-shadow relative overflow-hidden">
        {/* Floating Stars */}
        <span className="absolute top-4 left-6 text-2xl select-none animate-float">✨</span>
        <span className="absolute top-4 right-6 text-2xl select-none animate-pulse-soft">💖</span>
        <span className="absolute bottom-6 left-6 text-2xl select-none animate-float" style={{ animationDelay: '1s' }}>⭐</span>
        <span className="absolute bottom-6 right-6 text-2xl select-none animate-pulse-soft" style={{ animationDelay: '1.5s' }}>🌸</span>

        {/* HUGGING CHARACTERS VECTOR ART */}
        <div className="relative w-52 h-44 mx-auto my-3 flex items-center justify-center">
          {/* Subtle warm glow circle */}
          <div className="absolute inset-0 bg-pink-100/60 rounded-full blur-xl transform scale-90" />

          {/* Adorable SVG Hugging Bears */}
          <div
            className={`relative z-10 transition-transform duration-500 ${
              isDelivered ? 'scale-110 animate-bounce' : 'animate-float'
            }`}
          >
            <svg
              className="w-48 h-40 filter drop-shadow-md select-none"
              viewBox="0 0 240 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Bear (Lavender-Cream) */}
              <g className="left-bear">
                {/* Body */}
                <ellipse cx="85" cy="115" rx="42" ry="48" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
                {/* Left Ear */}
                <circle cx="55" cy="50" r="14" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
                <circle cx="55" cy="50" r="8" fill="#FBCFE8" />
                {/* Right Ear */}
                <circle cx="105" cy="50" r="14" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
                <circle cx="105" cy="50" r="8" fill="#FBCFE8" />
                {/* Head */}
                <ellipse cx="80" cy="75" rx="36" ry="32" fill="#FEF08A" stroke="#B45309" strokeWidth="2.5" />
                {/* Cheeks */}
                <circle cx="65" cy="85" r="5" fill="#FDA4AF" opacity="0.8" />
                {/* Closed happy eye */}
                <path d="M 68 73 Q 74 67 80 73" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                {/* Snout */}
                <ellipse cx="84" cy="80" rx="9" ry="7" fill="#FFFBEB" stroke="#B45309" strokeWidth="1.5" />
                <ellipse cx="84" cy="78" rx="4" ry="2.5" fill="#78350F" />
                {/* Hugging Arm around right bear */}
                <path
                  d="M 95 105 C 120 100, 145 110, 135 125 C 125 135, 100 125, 95 118"
                  fill="#FDE68A"
                  stroke="#B45309"
                  strokeWidth="2.5"
                />
              </g>

              {/* Right Bear (Soft Lavender) */}
              <g className="right-bear">
                {/* Body */}
                <ellipse cx="145" cy="115" rx="42" ry="48" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2.5" />
                {/* Left Ear */}
                <circle cx="125" cy="50" r="14" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2.5" />
                <circle cx="125" cy="50" r="8" fill="#FBCFE8" />
                {/* Right Ear */}
                <circle cx="175" cy="50" r="14" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2.5" />
                <circle cx="175" cy="50" r="8" fill="#FBCFE8" />
                {/* Head */}
                <ellipse cx="150" cy="75" rx="36" ry="32" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2.5" />
                {/* Cheeks */}
                <circle cx="165" cy="85" r="5" fill="#FDA4AF" opacity="0.8" />
                {/* Closed happy eye */}
                <path d="M 152 73 Q 158 67 164 73" stroke="#5B21B6" strokeWidth="2.5" strokeLinecap="round" />
                {/* Snout */}
                <ellipse cx="146" cy="80" rx="9" ry="7" fill="#F5F3FF" stroke="#6D28D9" strokeWidth="1.5" />
                <ellipse cx="146" cy="78" rx="4" ry="2.5" fill="#5B21B6" />
                {/* Hugging Arm around left bear */}
                <path
                  d="M 130 110 C 105 105, 80 115, 90 130 C 100 140, 125 130, 130 120"
                  fill="#DDD6FE"
                  stroke="#6D28D9"
                  strokeWidth="2.5"
                />
              </g>

              {/* Little Floating Hearts between their heads */}
              <g className="animate-pulse">
                <path
                  d="M 115 45 C 115 40, 110 35, 105 38 C 100 42, 115 55, 115 55 C 115 55, 130 42, 125 38 C 120 35, 115 40, 115 45 Z"
                  fill="#F43F5E"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Text Section */}
        {!isDelivered ? (
          <div className="space-y-3 my-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-purple-950 tracking-tight animate-pulse">
              {virtualHug.loadingText}
            </h2>

            {/* Cute Scrapbook Progress Bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-5 w-full bg-purple-100 rounded-full border-2 border-purple-200 p-0.5 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400 rounded-full transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <p className="font-handwritten text-purple-700 text-lg font-bold mt-2">
                Wrapping warm squeeze: {progress}% 🧸
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 my-2 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold border border-pink-200">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>100% SQUEEZE DELIVERED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-purple-950 tracking-tight">
              {virtualHug.deliveredTitle}
            </h2>

            <p className="font-handwritten text-purple-900 text-xl sm:text-2xl max-w-md mx-auto leading-relaxed">
              {virtualHug.deliveredMessage}
            </p>

            <p className="text-xs text-purple-600/80 font-medium">
              Made with endless warmth for {recipientName} ✨
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSendLove}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-display font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>{virtualHug.sendLoveButtonText}</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onGoToMenu();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-display font-semibold text-sm transition-all active:scale-95 cursor-pointer border border-purple-300"
          >
            Back to Memories ✨
          </button>
        </div>
      </div>

      {/* Bottom washi tape */}
      <div className="w-24 h-4 washi-tape-yellow rotate-1 -mt-2 z-20 rounded-xs" />
    </div>
  );
};
