import React from 'react';
import { Gift, Sparkles, Heart } from 'lucide-react';

export const SurpriseSection: React.FC = () => {
  return (
    <section className="w-full my-6">
      {/* Attractive, Cute Pastel Banner / Card for SURPRISE */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#FFF8E7] via-[#FFF3F8] to-[#F3EEFF] border-2 border-purple-200/80 p-5 sm:p-6 shadow-xs overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subtle decorative background sparkles */}
        <div className="absolute top-2 left-4 text-amber-400 opacity-60 text-lg pointer-events-none select-none animate-float">
          ✨
        </div>
        <div className="absolute bottom-2 right-6 text-pink-400 opacity-60 text-base pointer-events-none select-none animate-pulse-soft">
          💖
        </div>

        {/* Left side: Icon & Title */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-13 h-13 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-center justify-center text-purple-600 shrink-0">
            <Gift className="w-7 h-7 text-pink-500" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 font-display">
                SURPRISE
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-800 tracking-tight">
              A Special Birthday Surprise
            </h3>
            <p className="text-xs sm:text-sm font-handwritten text-purple-700/80 text-base">
              Something sweet prepared especially for your special celebration ✨
            </p>
          </div>
        </div>

        {/* Right side: Attractive pastel card/button UI element (Visual only) */}
        <div className="shrink-0 select-none">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-purple-200 text-purple-700 font-display font-semibold text-xs sm:text-sm shadow-xs hover:border-purple-300 transition-colors">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>Surprise Unlocked</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
              VIP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
