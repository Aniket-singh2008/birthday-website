import React, { useState } from 'react';
import { Mail, ArrowRight, Heart, Sparkles, X, BookOpen } from 'lucide-react';
import { LetterItem, BIRTHDAY_CONFIG } from '../config/birthdayConfig';
import { sound } from '../services/soundEffects';

interface LettersSectionProps {
  letters: LetterItem[];
}

export const LettersSection: React.FC<LettersSectionProps> = ({ letters }) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);

  const handleOpenLetter = (letter: LetterItem) => {
    sound.playPop();
    setSelectedLetter(letter);
  };

  const handleClose = () => {
    sound.playPop();
    setSelectedLetter(null);
  };

  return (
    <section className="w-full my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 tracking-tight">
              Letters & Notes
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-handwritten text-purple-700/80 text-base mt-0.5">
            Personal heartfelt letters written just for you 💌
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          {letters.length} {letters.length === 1 ? 'Letter' : 'Letters'}
        </span>
      </div>

      {/* Letters List / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {letters.map((letter, idx) => (
          <div
            key={letter.id}
            onClick={() => handleOpenLetter(letter)}
            className="group relative bg-[#FFFEFA] hover:bg-white border-2 border-purple-100 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top Washi Tape decorative touch */}
            <div
              className={`absolute top-0 right-6 w-12 h-3.5 rounded-b-xs opacity-75 ${
                idx % 2 === 0 ? 'washi-tape-lavender' : 'washi-tape-pink'
              }`}
            />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                {letter.date && (
                  <span className="text-[11px] font-medium text-purple-600/75 uppercase tracking-wide">
                    {letter.date}
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-slate-800 text-base group-hover:text-purple-900 transition-colors line-clamp-1">
                {letter.title}
              </h3>

              {letter.subtitle && (
                <p className="font-handwritten text-purple-600 text-sm mt-0.5 line-clamp-1">
                  {letter.subtitle}
                </p>
              )}

              {/* Snippet preview */}
              <p className="font-handwritten text-slate-600 text-base leading-snug mt-2 line-clamp-2">
                {letter.content.trim() ? letter.content : 'Tap to read this personal letter...'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between text-xs font-semibold text-purple-600 group-hover:text-purple-800">
              <span className="font-display flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Read Letter
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Elegant Cream Paper Letter Reader Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#FFFDF7] border-2 border-purple-200/90 rounded-3xl p-6 sm:p-9 scrapbook-shadow-lg relative max-h-[90vh] flex flex-col overflow-hidden text-left">
            {/* Top Washi Tape */}
            <div className="w-24 h-4 washi-tape-lavender -rotate-1 mx-auto -mt-4 mb-3 rounded-xs pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 cursor-pointer transition-colors"
              aria-label="Close letter"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Letter Header */}
            <div className="border-b border-purple-100 pb-3 mb-4 pr-10">
              {selectedLetter.date && (
                <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider block">
                  {selectedLetter.date}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-purple-950 mt-1">
                {selectedLetter.title}
              </h2>
              {selectedLetter.subtitle && (
                <p className="font-handwritten text-purple-700 text-lg">
                  {selectedLetter.subtitle}
                </p>
              )}
            </div>

            {/* Scrollable Letter Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 font-handwritten text-purple-950 text-xl sm:text-2xl leading-relaxed">
              {selectedLetter.content.trim() ? (
                selectedLetter.content.split('\n\n').map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center font-body text-sm text-purple-700">
                  <p className="font-semibold">No content written yet for this letter.</p>
                  <p className="text-xs mt-1 text-purple-500">
                    You can easily add your custom message in <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200">src/config/birthdayConfig.ts</code> under <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200">letters</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Letter Footer */}
            <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
              <span className="font-handwritten text-purple-700 text-lg flex items-center gap-1">
                With love for {BIRTHDAY_CONFIG.recipientName} <Heart className="w-4 h-4 fill-pink-500 text-pink-500 inline" />
              </span>
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
