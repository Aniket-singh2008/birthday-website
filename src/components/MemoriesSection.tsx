import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { MemoryPhotoBox, BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { sound } from '../services/soundEffects';

interface MemoriesSectionProps {
  memories: MemoryPhotoBox[];
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories }) => {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);

  // Modern memory highlight capsules inspired by modern photo platforms
  const highlightStories = [
    {
      id: 'story-1',
      title: 'Spotlight Moments',
      subtitle: 'Best smiles of the year',
      color: 'from-amber-200 via-rose-200 to-purple-200',
      icon: '✨',
      badge: 'Highlights',
      quote: 'Every smile captured tells a story of happiness and warmth.',
    },
    {
      id: 'story-2',
      title: 'Golden Days',
      subtitle: 'Unforgettable adventures',
      color: 'from-purple-200 via-pink-200 to-amber-100',
      icon: '☀️',
      badge: 'Adventures',
      quote: 'The best days are the simple days spent together.',
    },
    {
      id: 'story-3',
      title: 'Heartfelt Talks',
      subtitle: 'Cozy conversations',
      color: 'from-pink-200 via-purple-100 to-indigo-200',
      icon: '☕',
      badge: 'Cozy',
      quote: 'Late-night talks, endless laughter, and tea or coffee.',
    },
    {
      id: 'story-4',
      title: 'Birthday Star',
      subtitle: 'A year of growth & joy',
      color: 'from-purple-300 via-violet-200 to-pink-200',
      icon: '🌟',
      badge: 'Special',
      quote: 'Celebrating another amazing milestone around the sun!',
    },
  ];

  const handleOpenStory = (idx: number) => {
    sound.playPop();
    setActiveStoryIdx(idx);
  };

  const handleClose = () => {
    sound.playPop();
    setActiveStoryIdx(null);
  };

  return (
    <section className="w-full my-4">
      {/* Memories Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 tracking-tight">
              Memories
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-handwritten text-purple-700/80 text-base mt-0.5">
            Cherished memory reels & special highlights
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>Curated</span>
        </span>
      </div>

      {/* Horizontal Modern Gallery Scroll / Capsule Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {highlightStories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => handleOpenStory(idx)}
            className="group relative h-40 sm:h-48 rounded-2xl p-4 bg-gradient-to-br border-2 border-purple-100/90 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage:
                idx === 0
                  ? 'linear-gradient(135deg, #FEF3C7 0%, #FCE7F3 50%, #EDE9FE 100%)'
                  : idx === 1
                  ? 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 50%, #FEF9C3 100%)'
                  : idx === 2
                  ? 'linear-gradient(135deg, #FCE7F3 0%, #F5F3FF 50%, #E0E7FF 100%)'
                  : 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 50%, #FBCFE8 100%)',
            }}
          >
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-xs text-purple-900 border border-purple-200/50 shadow-xs font-display">
                {story.badge}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                {story.icon}
              </span>
            </div>

            {/* Bottom Titles */}
            <div className="text-left">
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-purple-950 transition-colors">
                {story.title}
              </h3>
              <p className="font-handwritten text-purple-800 text-xs sm:text-sm mt-0.5 line-clamp-1 font-semibold">
                {story.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Story Detail Light Modal */}
      {activeStoryIdx !== null && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFEFA] border-2 border-purple-200 rounded-3xl p-6 sm:p-7 scrapbook-shadow-lg text-center relative"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-3xl mb-3 shadow-inner">
              {highlightStories[activeStoryIdx].icon}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {highlightStories[activeStoryIdx].badge}
            </span>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-800 mt-2">
              {highlightStories[activeStoryIdx].title}
            </h3>

            <p className="font-handwritten text-purple-700 text-lg mb-4">
              {highlightStories[activeStoryIdx].subtitle}
            </p>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-left my-3 font-handwritten text-purple-900 text-xl leading-relaxed">
              "{highlightStories[activeStoryIdx].quote}"
            </div>

            <p className="text-xs text-purple-600/80 font-medium">
              Curated especially for {BIRTHDAY_CONFIG.recipientName} ✨
            </p>

            <button
              onClick={handleClose}
              className="mt-5 px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display text-xs font-semibold shadow-xs active:scale-95 cursor-pointer"
            >
              Back to Memories
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
