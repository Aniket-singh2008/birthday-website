import React, { useState, useEffect } from 'react';
import { Lock, Delete, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { sound } from '../services/soundEffects';
import { ShinchanUserPhoto } from './ShinchanUserPhoto';
import { getPasscodeShinchanPhotos } from '../services/photoStorage';
import { HeartIntroAnimation } from './HeartIntroAnimation';

interface PasscodeScreenProps {
  onUnlock: () => void;
}

export const PasscodeScreen: React.FC<PasscodeScreenProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Shinchan real photos (persisted or from config)
  const [shinchanPhotos] = useState<{ leftImage: string | null; rightImage: string | null }>(() => {
    const saved = getPasscodeShinchanPhotos();
    return {
      leftImage: saved.leftImage || BIRTHDAY_CONFIG.passcodeShinchanPhotos?.leftImage || null,
      rightImage: saved.rightImage || BIRTHDAY_CONFIG.passcodeShinchanPhotos?.rightImage || null,
    };
  });

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const targetPasscode = BIRTHDAY_CONFIG.passcode;

  // Handle digit input
  const handlePressKey = (val: string) => {
    if (isSuccess || digits.length >= 4) return;

    sound.playPop();
    const newDigits = [...digits, val];
    setDigits(newDigits);
    setIsError(false);
    setErrorMessage(null);

    // If 4 digits entered, evaluate immediately
    if (newDigits.length === 4) {
      const enteredCode = newDigits.join('');
      if (enteredCode === targetPasscode) {
        setIsSuccess(true);
        sound.playSuccessChime();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DDD6FE', '#FEF08A', '#FBCFE8', '#C084FC'],
        });
        setTimeout(() => {
          onUnlock();
        }, 850);
      } else {
        setIsError(true);
        sound.playWobble();
        setErrorMessage('Oops, that is not quite right! Try again ~ 🤫');
        setTimeout(() => {
          setDigits([]);
          setIsError(false);
        }, 1100);
      }
    }
  };

  const handleBackspace = () => {
    if (digits.length > 0 && !isSuccess) {
      sound.playPop();
      setDigits(digits.slice(0, -1));
      setIsError(false);
      setErrorMessage(null);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePressKey(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, isSuccess]);

  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-2 py-4 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
      {/* 5-Second Heart Intro Animation on initial load */}
      <HeartIntroAnimation />

      {/* ============================================================== */}
      {/* LEFT SIDE: Large Shinchan Blushing Photo (Image 1)             */}
      {/* ============================================================== */}
      <div className="hidden sm:flex flex-col items-center justify-center shrink-0 z-10 select-none animate-float">
        {/* Playful Shinchan speech bubble */}
        <div className="mb-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-purple-200 text-purple-900 font-handwritten text-lg shadow-sm relative">
          <span>Orey Shinchan! 🥰</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-purple-200 rotate-45" />
        </div>
        <div className="transform hover:scale-105 hover:-rotate-2 transition-transform duration-300">
          <ShinchanUserPhoto
            variant="blushing"
            customImageUrl={shinchanPhotos.leftImage}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shadow-xl rounded-3xl"
          />
        </div>
        <span className="text-xs font-display font-semibold text-purple-700/90 mt-2 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
          Blushing Shinchan 💖
        </span>
      </div>

      {/* ============================================================== */}
      {/* CENTER: Main Passcode Card                                      */}
      {/* ============================================================== */}
      <div className="w-full max-w-sm flex flex-col items-center shrink-0 z-20">
        {/* Mobile Shinchan photos row (visible on small phone screens) */}
        <div className="flex sm:hidden items-center justify-between w-full px-2 mb-3 gap-2">
          <div className="flex items-center gap-2 bg-white/95 p-1.5 rounded-2xl border border-purple-200 shadow-sm animate-float">
            <ShinchanUserPhoto
              variant="blushing"
              customImageUrl={shinchanPhotos.leftImage}
              className="w-14 h-14 rounded-xl"
            />
            <span className="font-handwritten text-xs font-bold text-purple-800 pr-1">Shinchan 💕</span>
          </div>
          <div
            className="flex items-center gap-2 bg-white/95 p-1.5 rounded-2xl border border-purple-200 shadow-sm animate-float"
            style={{ animationDelay: '1s' }}
          >
            <span className="font-handwritten text-xs font-bold text-purple-800 pl-1">One Love ✌️</span>
            <ShinchanUserPhoto
              variant="pointing"
              customImageUrl={shinchanPhotos.rightImage}
              className="w-14 h-18 rounded-xl"
            />
          </div>
        </div>

        {/* Decorative Washi Tape on top */}
        <div className="w-24 h-5 washi-tape-lavender -rotate-2 -mb-2 z-30 rounded-xs" />

        {/* Cute Scrapbook Card */}
        <div className="w-full bg-[#FFFDF8] border-2 border-purple-200/90 rounded-3xl p-6 sm:p-8 scrapbook-shadow relative overflow-hidden text-center">
          {/* Top Sound Toggle & Corner Stickers */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 transition-all cursor-pointer z-30"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className="absolute top-3 left-4 text-xl select-none">✨</span>

          {/* Lock Icon Emblem */}
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-purple-700 mb-3 shadow-inner">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-purple-950 tracking-tight">
            Secret Surprise
          </h1>
          <p className="text-sm font-handwritten text-purple-700/80 text-lg mt-0.5">
            Enter the secret 4-digit date passcode to unlock
          </p>

          {/* 4 Passcode Boxes */}
          <div className={`flex justify-center items-center gap-3 my-6 ${isError ? 'animate-wiggle' : ''}`}>
            {[0, 1, 2, 3].map((index) => {
              const hasDigit = digits[index] !== undefined;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold font-display transition-all duration-200 ${
                    isSuccess
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600 scale-105 shadow-sm'
                      : isError
                      ? 'border-rose-400 bg-rose-50 text-rose-500'
                      : hasDigit
                      ? 'border-purple-400 bg-purple-50/70 text-purple-900 shadow-sm scale-105'
                      : 'border-purple-200 bg-white/80 text-purple-300'
                  }`}
                >
                  {hasDigit ? (
                    <span className="animate-pulse-soft">●</span>
                  ) : (
                    <span className="text-purple-200 text-lg">·</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error / Hint feedback */}
          <div className="h-6 flex items-center justify-center mb-3">
            {errorMessage && (
              <p className="text-xs font-medium text-rose-600 font-handwritten text-base animate-bounce">
                {errorMessage}
              </p>
            )}
            {isSuccess && (
              <p className="text-sm font-semibold text-emerald-600 font-display animate-pulse">
                Unlocked! Preparing surprise... ✨
              </p>
            )}
          </div>

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
            {keypadRows.map((row, rowIdx) =>
              row.map((key) => {
                if (key === '#') {
                  return (
                    <button
                      key="backspace"
                      onClick={handleBackspace}
                      aria-label="Delete last digit"
                      className="h-13 rounded-2xl bg-purple-50/80 hover:bg-purple-100 active:scale-90 border border-purple-200/80 text-purple-700 flex items-center justify-center font-display text-lg shadow-xs transition-all touch-manipulation cursor-pointer"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  );
                }

                return (
                  <button
                    key={`${rowIdx}-${key}`}
                    onClick={() => handlePressKey(key)}
                    className="h-13 rounded-2xl bg-white hover:bg-purple-50 active:scale-90 border-2 border-purple-100 hover:border-purple-300 text-purple-950 font-display font-semibold text-xl shadow-xs transition-all touch-manipulation cursor-pointer flex items-center justify-center select-none"
                  >
                    {key}
                  </button>
                );
              })
            )}
          </div>

          <p className="text-xs text-purple-600/60 mt-5 font-handwritten text-sm">
            A special gift made just for you 💖
          </p>
        </div>

        {/* Decorative Washi Tape on bottom */}
        <div className="w-20 h-4 washi-tape-yellow rotate-1 -mt-2 z-30 rounded-xs" />
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE: Large Shinchan Pointing / One Love Photo (Image 2) */}
      {/* ============================================================== */}
      <div
        className="hidden sm:flex flex-col items-center justify-center shrink-0 z-10 select-none animate-float"
        style={{ animationDelay: '1.2s' }}
      >
        {/* Playful Shinchan speech bubble */}
        <div className="mb-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-purple-200 text-purple-900 font-handwritten text-lg shadow-sm relative">
          <span>One Love! Guess karo! 😜</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-purple-200 rotate-45" />
        </div>
        <div className="transform hover:scale-105 hover:rotate-2 transition-transform duration-300">
          <ShinchanUserPhoto
            variant="pointing"
            customImageUrl={shinchanPhotos.rightImage}
            className="w-40 h-50 sm:w-48 sm:h-60 md:w-56 md:h-70 lg:w-64 lg:h-80 shadow-xl rounded-3xl"
          />
        </div>
        <span className="text-xs font-display font-semibold text-purple-700/90 mt-2 bg-purple-100/90 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
          One Love Shinchan ✌️
        </span>
      </div>
    </div>
  );
};
