import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, RotateCcw, Flame } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface InteractiveCakeScreenProps {
  onBack?: () => void;
  onBackToGifts?: () => void;
}

export const InteractiveCakeScreen: React.FC<InteractiveCakeScreenProps> = ({ onBack, onBackToGifts }) => {
  const handleBackNavigation = () => {
    if (onBackToGifts) onBackToGifts();
    else if (onBack) onBack();
  };
  const [isCut, setIsCut] = useState(false);
  const [cutProgress, setCutProgress] = useState(0); // 0 to 100
  const [isCutting, setIsCutting] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [sliceOffset, setSliceOffset] = useState(0);
  const [cutAngle, setCutAngle] = useState(0); // angle of cut line

  // Mouse / Pointer position for custom knife
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isOverCake, setIsOverCake] = useState(false);

  const cakeAreaRef = useRef<HTMLDivElement>(null);
  const cutStartPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initial celebratory chime on entrance
  useEffect(() => {
    sound.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#FFAEC0', '#FDE047', '#E11D48', '#38BDF8', '#FFFFFF'],
    });
  }, []);

  const handleCutComplete = useCallback(() => {
    if (isCut) return;
    setIsCut(true);
    setIsCutting(false);
    setSliceOffset(36);
    sound.playSuccessChime();

    // Big celebratory confetti burst!
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.55 },
      colors: ['#FF69B4', '#FFD700', '#FF1493', '#00BFFF', '#FFFFFF', '#FFB6C1'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
      });
    }, 250);
  }, [isCut]);

  // Pointer event handlers for cutting
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCut) return;
    const rect = cakeAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    cutStartPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsCutting(true);
    setCutProgress(10);
    sound.playPop();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = cakeAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      setMousePos({ x: relX, y: relY });

      if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
        setIsOverCake(true);
      } else {
        setIsOverCake(false);
      }

      if (isCutting && cutStartPointRef.current && !isCut) {
        const start = cutStartPointRef.current;
        const dx = relX - start.x;
        const dy = relY - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate progress based on drag distance across cake
        const maxDist = rect.height * 0.45;
        const progress = Math.min(100, Math.max(15, (distance / maxDist) * 100));
        setCutProgress(progress);

        // Compute angle of cut line
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setCutAngle(angle);

        if (progress >= 85) {
          handleCutComplete();
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (isCutting && !isCut) {
      if (cutProgress > 45) {
        handleCutComplete();
      } else {
        setIsCutting(false);
        setCutProgress(0);
      }
    }
  };

  // Direct click / tap to cut fallback for convenience
  const handleInstantCut = () => {
    if (!isCut) {
      setCutProgress(100);
      handleCutComplete();
    }
  };

  const handleBlowCandles = () => {
    setCandlesLit(!candlesLit);
    sound.playPop();
    if (candlesLit) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.35 },
        colors: ['#FFFFFF', '#FFE4E6', '#FDE047'],
      });
    }
  };

  const handleResetCake = () => {
    setIsCut(false);
    setCutProgress(0);
    setIsCutting(false);
    setSliceOffset(0);
    setCandlesLit(true);
    sound.playWobble();
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-gradient-to-b from-[#FFF5ED] via-[#FFF0F5] to-[#FFEFE5] flex flex-col items-center justify-between p-3 sm:p-6 select-none overflow-hidden"
    >
      {/* Top Bar with Back Button */}
      <div className="w-full max-w-xl flex items-center justify-between z-30 pt-2 px-2">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            handleBackNavigation();
          }}
          className="px-4 py-2 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs font-display font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          <span>← Back to Gifts</span>
        </button>

        <div className="flex items-center gap-2">
          {isCut && (
            <button
              type="button"
              onClick={handleResetCake}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 shadow-xs font-display font-medium text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cut Again</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleBlowCandles}
            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-xs font-display font-medium text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            title="Blow out / Relight candles"
          >
            <Flame className={`w-3.5 h-3.5 ${candlesLit ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>{candlesLit ? 'Blow Candles 💨' : 'Relight 🔥'}</span>
          </button>
        </div>
      </div>

      {/* Celebratory Title */}
      <div className="text-center z-20 my-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 shadow-xs mb-1.5"
        >
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse-soft" />
          <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-800 tracking-wide">
            {isCut ? 'Happy Birthday! 🎉🎂' : 'Make a Wish & Cut the Cake! 🎂'}
          </h2>
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse-soft" />
        </motion.div>

        <p className="text-xs sm:text-sm font-handwritten text-purple-900/80">
          {isCut
            ? 'Yay! Here is your delicious birthday slice! 🍰✨'
            : 'Swipe or drag across the cake with your cursor / finger to slice it 🔪'}
        </p>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE CAKE CUTTING STAGE                                 */}
      {/* ============================================================== */}
      <div
        ref={cakeAreaRef}
        onPointerDown={handlePointerDown}
        className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center cursor-crosshair touch-none select-none z-20 my-auto"
      >
        {/* Soft Ambient Pedestal Glow */}
        <div className="absolute bottom-6 w-72 h-16 bg-pink-200/40 rounded-full blur-xl pointer-events-none" />

        {/* White Ceramic Cake Pedestal Plate */}
        <div className="absolute bottom-6 w-80 h-20 bg-gradient-to-b from-white to-slate-100 rounded-[50%] shadow-xl border-4 border-white flex items-center justify-center pointer-events-none">
          <div className="w-[94%] h-[82%] rounded-[50%] border-2 border-dashed border-pink-200/80" />
        </div>

        {/* ========================================================== */}
        {/* THE 3D MULTI-LAYER CAKE (SPLITS WHEN CUT)                  */}
        {/* ========================================================== */}
        <div className="relative w-72 h-64 flex items-center justify-center">
          {/* LEFT HALF OF CAKE */}
          <motion.div
            animate={{
              x: isCut ? -sliceOffset : 0,
              rotate: isCut ? -4 : 0,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute left-0 w-36 h-full overflow-hidden pointer-events-none"
          >
            <div className="w-72 h-full relative">
              <CakeArtwork candlesLit={candlesLit} />
            </div>
          </motion.div>

          {/* RIGHT HALF OF CAKE */}
          <motion.div
            animate={{
              x: isCut ? sliceOffset : 0,
              rotate: isCut ? 4 : 0,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute right-0 w-36 h-full overflow-hidden pointer-events-none"
          >
            <div className="w-72 h-full relative -left-36">
              <CakeArtwork candlesLit={candlesLit} />
            </div>
          </motion.div>

          {/* Cut Line Indicator during cutting */}
          {isCutting && !isCut && (
            <div
              style={{
                position: 'absolute',
                top: '15%',
                bottom: '15%',
                left: '50%',
                width: '4px',
                transform: `translateX(-50%) rotate(${cutAngle * 0.2}deg)`,
              }}
              className="bg-gradient-to-b from-pink-400 via-white to-pink-500 rounded-full shadow-[0_0_12px_#FF69B4] animate-pulse pointer-events-none z-30"
            />
          )}

          {/* Sliced Inside Cream Filling Layer Visible When Split */}
          {isCut && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute z-20 flex items-center justify-center pointer-events-none"
            >
              <div className="w-10 h-28 bg-gradient-to-b from-[#FFF5EA] via-[#FED7AA] to-[#FDBA74] rounded-lg shadow-inner border border-amber-300 flex flex-col justify-around py-2 px-1">
                <div className="w-full h-1.5 bg-[#EC4899] rounded-full" />
                <div className="w-full h-1.5 bg-[#FFF0F5] rounded-full" />
                <div className="w-full h-1.5 bg-[#EC4899] rounded-full" />
              </div>
            </motion.div>
          )}
        </div>

        {/* ========================================================== */}
        {/* CUSTOM ANIMATED KNIFE CURSOR FOLLOWING POINTER            */}
        {/* ========================================================== */}
        {mousePos && isOverCake && !isCut && (
          <div
            style={{
              position: 'absolute',
              left: mousePos.x,
              top: mousePos.y,
              transform: `translate(-15%, -85%) rotate(${isCutting ? -35 : -15}deg)`,
              transition: isCutting ? 'none' : 'transform 0.15s ease-out',
            }}
            className="pointer-events-none z-40 drop-shadow-xl"
          >
            {/* Knife SVG */}
            <svg width="65" height="65" viewBox="0 0 100 100" fill="none">
              {/* Blade */}
              <path
                d="M 25 75 L 85 15 C 88 12, 92 14, 90 18 L 65 80 C 63 85, 55 85, 50 82 Z"
                fill="url(#bladeGrad)"
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Blade Shine */}
              <line x1="35" y1="68" x2="80" y2="22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Wooden / Pink Pastel Knife Handle */}
              <path
                d="M 12 90 L 32 70 C 35 67, 39 67, 42 70 L 46 74 C 49 77, 49 81, 46 84 L 26 104 C 23 107, 19 107, 16 104 L 12 100 C 9 97, 9 93, 12 90 Z"
                fill="#FF8DA1"
                stroke="#1E1E1E"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="86" r="2" fill="#FFFFFF" />
              <defs>
                <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="60%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Hint / Quick Slice Action */}
      <div className="z-20 flex flex-col items-center gap-2 mb-4">
        {!isCut ? (
          <button
            type="button"
            onClick={handleInstantCut}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white shadow-md font-display font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>🔪 Tap Here to Slice Cake</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetCake}
              className="px-4 py-2 rounded-full bg-white hover:bg-pink-50 text-purple-900 border border-purple-200 shadow-2xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
              <span>Cut Cake Again</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                handleBackNavigation();
              }}
              className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xs font-display font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Back to Gifts 🎁</span>
            </button>
          </div>
        )}

        <p className="text-[11px] text-slate-500 font-medium">
          {isCut ? 'Birthday celebration complete! 🥳' : 'Drag cursor/finger across the cake to cut directly 🎂'}
        </p>
      </div>
    </div>
  );
};

/**
 * High-fidelity 2-Tier Birthday Cake Artwork with Candles, Strawberries & Frosting
 */
const CakeArtwork: React.FC<{ candlesLit: boolean }> = ({ candlesLit }) => {
  return (
    <svg viewBox="0 0 300 280" className="w-full h-full drop-shadow-2xl">
      <defs>
        {/* Soft gradients for frosting */}
        <linearGradient id="frostingTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9F9" />
          <stop offset="100%" stopColor="#FFE4E8" />
        </linearGradient>
        <linearGradient id="frostingBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF5EA" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
        <linearGradient id="pinkDrip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8DA1" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>

      {/* ============================================================== */}
      {/* 3 CANDLES ON TOP                                               */}
      {/* ============================================================== */}
      {/* Center Candle */}
      <g transform="translate(150, 48)">
        <rect x="-5" y="0" width="10" height="34" rx="2" fill="#E0F2FE" stroke="#1E1E1E" strokeWidth="2.5" />
        <path d="M -5 10 L 5 7 M -5 22 L 5 19" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="-8" stroke="#1E1E1E" strokeWidth="2" />
        {/* Flame */}
        {candlesLit && (
          <g className="animate-pulse">
            <path d="M 0 -8 Q 6 -18 0 -26 Q -6 -18 0 -8 Z" fill="#FACC15" stroke="#EA580C" strokeWidth="1.5" />
            <circle cx="0" cy="-14" r="2.5" fill="#FEF08A" />
            <ellipse cx="0" cy="-15" rx="14" ry="14" fill="#FDE047" opacity="0.25" />
          </g>
        )}
      </g>

      {/* Left Candle */}
      <g transform="translate(110, 56)">
        <rect x="-5" y="0" width="10" height="30" rx="2" fill="#FFE4E6" stroke="#1E1E1E" strokeWidth="2.5" />
        <path d="M -5 8 L 5 5 M -5 18 L 5 15" stroke="#FF8DA1" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="-7" stroke="#1E1E1E" strokeWidth="2" />
        {candlesLit && (
          <g className="animate-pulse">
            <path d="M 0 -7 Q 5 -16 0 -23 Q -5 -16 0 -7 Z" fill="#FACC15" stroke="#EA580C" strokeWidth="1.5" />
            <circle cx="0" cy="-13" r="2" fill="#FEF08A" />
            <ellipse cx="0" cy="-13" rx="12" ry="12" fill="#FDE047" opacity="0.2" />
          </g>
        )}
      </g>

      {/* Right Candle */}
      <g transform="translate(190, 56)">
        <rect x="-5" y="0" width="10" height="30" rx="2" fill="#FEF08A" stroke="#1E1E1E" strokeWidth="2.5" />
        <path d="M -5 8 L 5 5 M -5 18 L 5 15" stroke="#F59E0B" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="-7" stroke="#1E1E1E" strokeWidth="2" />
        {candlesLit && (
          <g className="animate-pulse">
            <path d="M 0 -7 Q 5 -16 0 -23 Q -5 -16 0 -7 Z" fill="#FACC15" stroke="#EA580C" strokeWidth="1.5" />
            <circle cx="0" cy="-13" r="2" fill="#FEF08A" />
            <ellipse cx="0" cy="-13" rx="12" ry="12" fill="#FDE047" opacity="0.2" />
          </g>
        )}
      </g>

      {/* ============================================================== */}
      {/* TOP CAKE TIER                                                  */}
      {/* ============================================================== */}
      {/* Top Tier Cylinder Base */}
      <path
        d="M 80 110 L 80 150 C 80 168, 220 168, 220 150 L 220 110 Z"
        fill="url(#frostingBase)"
        stroke="#1E1E1E"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Top Tier Top Surface Ellipse */}
      <ellipse cx="150" cy="110" rx="70" ry="24" fill="url(#frostingTop)" stroke="#1E1E1E" strokeWidth="3.5" />

      {/* Pink Dripping Frosting on Top Tier */}
      <path
        d="M 80 110
           C 80 120, 92 135, 102 122
           C 112 110, 122 142, 134 125
           C 144 110, 156 138, 168 122
           C 180 110, 192 140, 204 120
           C 214 130, 220 120, 220 110
           C 220 95, 80 95, 80 110 Z"
        fill="url(#pinkDrip)"
        stroke="#1E1E1E"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Strawberries on Top Tier */}
      {/* Left Strawberry */}
      <g transform="translate(118, 98) scale(0.9)">
        <path d="M 0 -12 C 10 -12, 14 0, 0 14 C -14 0, -10 -12, 0 -12 Z" fill="#EF4444" stroke="#1E1E1E" strokeWidth="2.5" />
        <polygon points="-4,-12 0,-16 4,-12 0,-10" fill="#22C55E" />
        <circle cx="-3" cy="0" r="1" fill="#FEF08A" />
        <circle cx="2" cy="4" r="1" fill="#FEF08A" />
      </g>
      {/* Right Strawberry */}
      <g transform="translate(182, 98) scale(0.9)">
        <path d="M 0 -12 C 10 -12, 14 0, 0 14 C -14 0, -10 -12, 0 -12 Z" fill="#EF4444" stroke="#1E1E1E" strokeWidth="2.5" />
        <polygon points="-4,-12 0,-16 4,-12 0,-10" fill="#22C55E" />
        <circle cx="-3" cy="0" r="1" fill="#FEF08A" />
        <circle cx="2" cy="4" r="1" fill="#FEF08A" />
      </g>

      {/* ============================================================== */}
      {/* BOTTOM / BASE CAKE TIER                                        */}
      {/* ============================================================== */}
      {/* Base Tier Cylinder Body */}
      <path
        d="M 45 155 L 45 220 C 45 248, 255 248, 255 220 L 255 155 Z"
        fill="url(#frostingBase)"
        stroke="#1E1E1E"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Base Tier Top Surface Ellipse */}
      <ellipse cx="150" cy="155" rx="105" ry="32" fill="url(#frostingTop)" stroke="#1E1E1E" strokeWidth="4" />

      {/* Pink Dripping Frosting on Bottom Tier */}
      <path
        d="M 45 160
           C 45 180, 65 200, 80 175
           C 95 155, 110 205, 130 180
           C 150 155, 170 205, 190 178
           C 210 155, 230 200, 245 170
           C 252 180, 255 170, 255 160
           C 255 130, 45 130, 45 160 Z"
        fill="url(#pinkDrip)"
        stroke="#1E1E1E"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Decorative Piped Whipped Cream Swirls on Base Perimeter */}
      <circle cx="65" cy="222" r="10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
      <circle cx="105" cy="232" r="10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
      <circle cx="150" cy="235" r="10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
      <circle cx="195" cy="232" r="10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />
      <circle cx="235" cy="222" r="10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="2.5" />

      {/* Colorful Sprinkles on Base */}
      <rect x="75" y="180" width="8" height="4" rx="2" fill="#38BDF8" transform="rotate(25 75 180)" />
      <rect x="115" y="195" width="8" height="4" rx="2" fill="#FACC15" transform="rotate(-35 115 195)" />
      <rect x="165" y="190" width="8" height="4" rx="2" fill="#4ADE80" transform="rotate(40 165 190)" />
      <rect x="215" y="185" width="8" height="4" rx="2" fill="#A855F7" transform="rotate(-20 215 185)" />
    </svg>
  );
};
