/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DecorativeBackground } from './components/DecorativeBackground';
import { PasscodeScreen } from './components/PasscodeScreen';
import { ChinChinScreen } from './components/ChinChinScreen';
import { QuestionPageScreen } from './components/QuestionPageScreen';
import { NoDareYouScreen } from './components/NoDareYouScreen';
import { YesCutieHeartScreen } from './components/YesCutieHeartScreen';
import { ShinchanBirthdayScreen } from './components/ShinchanBirthdayScreen';
import { GiftBoxesScreen } from './components/GiftBoxesScreen';
import { Gift2BlankScreen } from './components/Gift2BlankScreen';
import { MemoriesHome } from './components/MemoriesHome';
import { getPermanentPrimaryPhoto } from './services/photoStorage';

export default function App() {
  // Screen 1: Passcode (0510) with 5-Second Heart Intro Animation
  // Screen 2: Chin Chin Photo Screen (5-sec automatic transition -> Screen 3 Question Page)
  // Screen 3: Reference Page 1: Question Page ("Hey, I made something for you. Do you wanna see it?")
  // Screen 31: YES Path: Reference Page 2 ("Cutie" Heart Page -> 3s auto-redirect -> Screen 33 Birthday)
  // Screen 32: NO Path: Reference Page ("Seriously? How dare you? > H-mph? <" -> Go back to Screen 3)
  // Screen 33: Shinchan Happy Birthday Screen (Center & Left photo customization -> Screen 5 Gifts)
  // Screen 5: FIXED TEMPLATE: "Here is your gifts" with 4 lavender floral gift boxes
  //    - Gift Box 1 -> Screen 4 (Existing Memories Home) -> Back returns to Screen 5
  //    - Gift Box 2 -> Screen 6 (Interactive Cake Cutting Scene) -> Back returns to Screen 5
  //    - Gift Box 3 & 4 -> Inactive as requested
  // Screen 4: Memories Home (Moments of us, 10 photo boxes, letters)
  // Screen 6: Interactive Cake Cutting Scene (drag/swipe to slice cake)
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passcodeSessionKey, setPasscodeSessionKey] = useState<number>(1);

  // Permanent primary photo state
  const [primaryPhotoState, setPrimaryPhotoState] = useState<{ photoUrl: string | null; isLocked: boolean }>({
    photoUrl: null,
    isLocked: false,
  });

  useEffect(() => {
    const stored = getPermanentPrimaryPhoto();
    setPrimaryPhotoState(stored);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setCurrentScreen(2);
  };

  // After Chin-Chin photo screen (5 sec), transition directly to Question Page
  const handleChinChinComplete = () => {
    setCurrentScreen(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // YES Path from Question Page: Open YES Page 2 ("Cutie" Heart)
  const handleQuestionYes = () => {
    setCurrentScreen(31);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NO Path from Question Page: Open "Seriously? How dare you?"
  const handleQuestionNo = () => {
    setCurrentScreen(32);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // "Go back" from "Seriously? How dare you?": return to original Page 1
  const handleGoBackToQuestion = () => {
    setCurrentScreen(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From Cutie Heart Page: after 3 seconds or button, redirect to Birthday Screen
  const handleCutieComplete = () => {
    setCurrentScreen(33);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From Birthday Screen: proceed to Gift Boxes Screen
  const handleBirthdayComplete = () => {
    setCurrentScreen(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From Gift Boxes: Open Gift 1 (Memories)
  const handleOpenMemoriesFromGifts = () => {
    setCurrentScreen(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From Gift Boxes: Open Gift 2 (New Blank Page with empty photo area)
  const handleOpenGift2FromGifts = () => {
    setCurrentScreen(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Gift Boxes Screen
  const handleBackToGifts = () => {
    setCurrentScreen(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from Gift Boxes to Birthday Screen
  const handleBackToBirthday = () => {
    setCurrentScreen(33);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStart = () => {
    setIsUnlocked(false);
    setCurrentScreen(1);
    setPasscodeSessionKey((prev) => prev + 1);
  };

  const handlePrimaryPhotoUploaded = (dataUrl: string) => {
    setPrimaryPhotoState({
      photoUrl: dataUrl,
      isLocked: true,
    });
  };

  const isReferenceScreen =
    currentScreen === 3 ||
    currentScreen === 31 ||
    currentScreen === 32 ||
    currentScreen === 33 ||
    currentScreen === 5 ||
    currentScreen === 6;

  return (
    <div className="relative min-h-screen w-full bg-[#FFFDF8] text-slate-800 font-body">
      <DecorativeBackground
        showTornBorders={currentScreen !== 1 && !isReferenceScreen}
        isPasscodeScreen={currentScreen === 1}
        isSpecialPageScreen={isReferenceScreen}
        maxWidthClass={
          currentScreen === 4
            ? 'max-w-5xl'
            : currentScreen === 1
            ? 'max-w-5xl'
            : isReferenceScreen
            ? 'max-w-none'
            : 'max-w-xl'
        }
      >
        {/* Top persistent navigation when unlocked so user can re-lock or switch */}
        {isUnlocked && currentScreen >= 3 && (
          <div className="w-full flex items-center justify-between max-w-xl mx-auto px-3 sm:px-4 py-2 mb-2 z-40">
            <button
              onClick={handleBackToStart}
              className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-900 border border-purple-200/90 shadow-xs font-display text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>← Lock (0510)</span>
            </button>

            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-full border border-purple-200/90 shadow-xs">
              <button
                onClick={() => {
                  setCurrentScreen(5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full font-display font-semibold text-xs transition-all cursor-pointer ${
                  currentScreen === 5
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                🎁 Gifts
              </button>
              <button
                onClick={() => {
                  setCurrentScreen(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full font-display font-semibold text-xs transition-all cursor-pointer ${
                  currentScreen === 4
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                📸 Memories
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* SCREEN 1: PASSCODE */}
          {currentScreen === 1 && (
            <motion.div
              key={`screen-passcode-${passcodeSessionKey}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center py-6"
            >
              <PasscodeScreen
                key={`passcode-screen-${passcodeSessionKey}`}
                onUnlock={handleUnlock}
              />
            </motion.div>
          )}

          {/* SCREEN 2: CHIN-CHIN PHOTO (5-sec transition) */}
          {currentScreen === 2 && (
            <motion.div
              key="screen-chin-chin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <ChinChinScreen
                onNext={handleChinChinComplete}
                onBackToStart={handleBackToStart}
              />
            </motion.div>
          )}

          {/* SCREEN 3: REFERENCE PAGE 1 ("Hey, I made something for you. Do you wanna see it?") */}
          {currentScreen === 3 && (
            <motion.div
              key="screen-question-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <QuestionPageScreen
                onYes={handleQuestionYes}
                onNo={handleQuestionNo}
              />
            </motion.div>
          )}

          {/* SCREEN 32: NO PATH ("Seriously? How dare you? > H-mph? <") */}
          {currentScreen === 32 && (
            <motion.div
              key="screen-no-dare-you"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <NoDareYouScreen
                onGoBack={handleGoBackToQuestion}
              />
            </motion.div>
          )}

          {/* SCREEN 31: YES PATH - CUTIE HEART (3-sec auto-redirect -> Birthday) */}
          {currentScreen === 31 && (
            <motion.div
              key="screen-yes-cutie-heart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <YesCutieHeartScreen
                onComplete={handleCutieComplete}
              />
            </motion.div>
          )}

          {/* SCREEN 33: SHINCHAN HAPPY BIRTHDAY SCREEN */}
          {currentScreen === 33 && (
            <motion.div
              key="screen-shinchan-birthday"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <ShinchanBirthdayScreen
                onContinueToGifts={handleBirthdayComplete}
              />
            </motion.div>
          )}

          {/* SCREEN 5: FIXED TEMPLATE - "HERE IS YOUR GIFTS" (4 Lavender Gift Boxes) */}
          {currentScreen === 5 && (
            <motion.div
              key="screen-gift-boxes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <GiftBoxesScreen
                onOpenMemories={handleOpenMemoriesFromGifts}
                onOpenGift2={handleOpenGift2FromGifts}
                onBackToBirthday={handleBackToBirthday}
              />
            </motion.div>
          )}

          {/* SCREEN 6: GIFT 2 BLANK PAGE (Empty photo/image upload area) */}
          {currentScreen === 6 && (
            <motion.div
              key="screen-gift-2-blank"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <Gift2BlankScreen
                onBackToGifts={handleBackToGifts}
              />
            </motion.div>
          )}

          {/* SCREEN 4: EXISTING MEMORIES HOME ("Moments of us ❤️" - Gift Box 1) */}
          {currentScreen === 4 && (
            <motion.div
              key="screen-memories-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <MemoriesHome
                primaryPhotoUrl={primaryPhotoState.photoUrl}
                isPrimaryPhotoLocked={primaryPhotoState.isLocked}
                onPrimaryPhotoUploaded={handlePrimaryPhotoUploaded}
                onLockApp={handleBackToStart}
                onBackToStart={handleBackToStart}
                onBackToGifts={handleBackToGifts}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DecorativeBackground>
    </div>
  );
}
