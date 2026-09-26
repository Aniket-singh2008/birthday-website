import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface GiftBoxScreenProps {
  onOpenMemories: () => void;
  onOpenCake: () => void;
  onBackToBirthday: () => void;
}

/**
 * GIFT BOX SELECTION SCREEN
 *
 * Uses the user's exact uploaded reference image ("Here is your gifts") as the fixed visual template.
 *
 * FUNCTIONALITY:
 * - Gift Box 1 (Leftmost): Opens existing Memories page ("Moments of us ❤️")
 * - Gift Box 2 (Second from Left): Opens interactive Cake Cutting scene 🎂
 * - Gift Box 3 & 4: Inactive for now (reserved for future instructions)
 */
export const GiftBoxScreen: React.FC<GiftBoxScreenProps> = ({
  onOpenMemories,
  onOpenCake,
  onBackToBirthday,
}) => {
  const handleBox1Click = () => {
    sound.playSuccessChime();
    onOpenMemories();
  };

  const handleBox2Click = () => {
    sound.playSuccessChime();
    onOpenCake();
  };

  const handleInactiveBoxClick = () => {
    sound.playPop();
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#FEF6EE] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Top Navigation Row */}
      <div className="w-full max-w-[480px] sm:max-w-[520px] flex items-center justify-between mb-2 px-2 z-40">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToBirthday();
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
          <span>← Back</span>
        </button>

        <span className="text-xs font-handwritten text-purple-900/80 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>Tap a gift box to open! 🎁</span>
        </span>
      </div>

      {/* ============================================================== */}
      {/* FIXED TEMPLATE CARD (EXACT USER REFERENCE IMAGE)               */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-[460px] sm:max-w-[500px] aspect-square shadow-2xl rounded-[32px] sm:rounded-[36px] overflow-hidden group">
        {/* Exact Visual Background Image */}
        <img
          src="/images/here_is_your_gifts_card.svg"
          alt="Here is your gifts"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* ============================================================== */}
        {/* GIFT BOX 1: MEMORIES (Interactive Click Target)                */}
        {/* Coordinates: Leftmost box (x: ~3% to 25%, y: ~41.5% to 63%)    */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleBox1Click}
          style={{
            position: 'absolute',
            left: '2.5%',
            top: '41.5%',
            width: '22.5%',
            height: '21.5%',
          }}
          className="rounded-3xl cursor-pointer z-30 transition-transform active:scale-90 hover:scale-105 hover:bg-pink-500/10 focus:outline-hidden group/box1"
          title="Gift 1: Moments of Us (Memories)"
          aria-label="Gift Box 1: Open Memories"
        >
          {/* Subtle pulse hint badge on hover */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/box1:opacity-100 transition-opacity bg-purple-900/90 text-white text-[10px] font-display font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none">
            Memories 📸
          </span>
          <span className="sr-only">Gift Box 1: Open Memories</span>
        </button>

        {/* ============================================================== */}
        {/* GIFT BOX 2: CAKE CUTTING (Interactive Click Target)            */}
        {/* Coordinates: Second box (x: ~26.5% to 48.5%, y: ~41.5% to 63%) */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleBox2Click}
          style={{
            position: 'absolute',
            left: '26.5%',
            top: '41.5%',
            width: '22.5%',
            height: '21.5%',
          }}
          className="rounded-3xl cursor-pointer z-30 transition-transform active:scale-90 hover:scale-105 hover:bg-pink-500/10 focus:outline-hidden group/box2"
          title="Gift 2: Birthday Cake Cutting"
          aria-label="Gift Box 2: Interactive Cake Cutting"
        >
          {/* Subtle pulse hint badge on hover */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/box2:opacity-100 transition-opacity bg-pink-600 text-white text-[10px] font-display font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none">
            Cake 🎂
          </span>
          <span className="sr-only">Gift Box 2: Birthday Cake Cutting</span>
        </button>

        {/* ============================================================== */}
        {/* GIFT BOX 3: INACTIVE FOR NOW                                   */}
        {/* Coordinates: Third box (x: ~50.2% to 72.2%, y: ~41.5% to 63%)  */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleInactiveBoxClick}
          style={{
            position: 'absolute',
            left: '50.2%',
            top: '41.5%',
            width: '22.5%',
            height: '21.5%',
          }}
          className="rounded-3xl cursor-pointer z-30 transition-transform active:scale-95 hover:bg-slate-500/5 focus:outline-hidden group/box3"
          title="Gift 3: Coming Soon"
          aria-label="Gift Box 3"
        >
          <span className="sr-only">Gift Box 3</span>
        </button>

        {/* ============================================================== */}
        {/* GIFT BOX 4: INACTIVE FOR NOW                                   */}
        {/* Coordinates: Fourth box (x: ~73.5% to 95.5%, y: ~41.5% to 63%) */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={handleInactiveBoxClick}
          style={{
            position: 'absolute',
            left: '73.5%',
            top: '41.5%',
            width: '22.5%',
            height: '21.5%',
          }}
          className="rounded-3xl cursor-pointer z-30 transition-transform active:scale-95 hover:bg-slate-500/5 focus:outline-hidden group/box4"
          title="Gift 4: Coming Soon"
          aria-label="Gift Box 4"
        >
          <span className="sr-only">Gift Box 4</span>
        </button>
      </div>

      {/* Helpful Action Links below the card */}
      <div className="mt-3 flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handleBox1Click}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200/90 shadow-2xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <span>Gift 1: Memories 📸</span>
        </button>

        <button
          type="button"
          onClick={handleBox2Click}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-2xs font-display font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <span>Gift 2: Cut Cake 🎂</span>
        </button>
      </div>
    </div>
  );
};
