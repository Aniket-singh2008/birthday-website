import React from 'react';

interface DecorativeBackgroundProps {
  children: React.ReactNode;
  showTornBorders?: boolean;
  maxWidthClass?: string;
  isPasscodeScreen?: boolean;
  isSpecialPageScreen?: boolean;
}

export const DecorativeBackground: React.FC<DecorativeBackgroundProps> = ({
  children,
  showTornBorders = true,
  maxWidthClass = 'max-w-5xl',
  isPasscodeScreen = false,
  isSpecialPageScreen = false,
}) => {
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-purple-200 selection:text-purple-900 ${
        isPasscodeScreen
          ? 'bg-passcode'
          : isSpecialPageScreen
          ? 'bg-[#FAF5EC]'
          : 'bg-stripes-yellow-subtle'
      }`}
    >
      {/* Top Scalloped Lavender Border (Hidden on passcode screen and special reference page) */}
      {showTornBorders && !isPasscodeScreen && !isSpecialPageScreen && (
        <div className="w-full z-20 pointer-events-none select-none">
          <div className="h-3 sm:h-4 bg-[#DDD6FE] w-full" />
          <svg
            className="w-full h-3 sm:h-4 text-[#DDD6FE] block -mt-[1px]"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 Q15,24 30,0 Q45,24 60,0 Q75,24 90,0 Q105,24 120,0 Q135,24 150,0 Q165,24 180,0 Q195,24 210,0 Q225,24 240,0 Q255,24 270,0 Q285,24 300,0 Q315,24 330,0 Q345,24 360,0 Q375,24 390,0 Q405,24 420,0 Q435,24 450,0 Q465,24 480,0 Q495,24 510,0 Q525,24 540,0 Q555,24 570,0 Q585,24 600,0 Q615,24 630,0 Q645,24 660,0 Q675,24 690,0 Q705,24 720,0 Q735,24 750,0 Q765,24 780,0 Q795,24 810,0 Q825,24 840,0 Q855,24 870,0 Q885,24 900,0 Q915,24 930,0 Q945,24 960,0 Q975,24 990,0 Q1005,24 1020,0 Q1035,24 1050,0 Q1065,24 1080,0 Q1095,24 1110,0 Q1125,24 1140,0 Q1155,24 1170,0 Q1185,24 1200,0 L1200,0 L0,0 Z" />
          </svg>
        </div>
      )}

      {/* Floating decorative subtle sparkles (hidden on passcode and special reference page) */}
      {!isPasscodeScreen && !isSpecialPageScreen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-50">
          <span className="absolute top-12 left-6 text-xl text-amber-400 select-none animate-float">✨</span>
          <span className="absolute top-28 right-8 text-lg text-purple-400 select-none animate-pulse-soft">⭐</span>
          <span className="absolute top-1/3 left-4 text-base text-pink-400 select-none animate-float" style={{ animationDelay: '1s' }}>🌸</span>
          <span className="absolute top-1/2 right-6 text-xl text-amber-400 select-none animate-float" style={{ animationDelay: '1.5s' }}>⭐</span>
          <span className="absolute bottom-28 left-8 text-lg text-purple-400 select-none animate-pulse-soft" style={{ animationDelay: '2s' }}>✨</span>
          <span className="absolute bottom-16 right-10 text-xl text-pink-400 select-none animate-float" style={{ animationDelay: '0.5s' }}>💖</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-start w-full ${isSpecialPageScreen ? 'p-0 max-w-none' : `${maxWidthClass} px-3 sm:px-6 py-4 md:py-6`} mx-auto`}>
        {children}
      </div>

      {/* Bottom Scalloped Lavender Border (Hidden on passcode and special reference page) */}
      {showTornBorders && !isPasscodeScreen && !isSpecialPageScreen && (
        <div className="w-full z-20 pointer-events-none select-none rotate-180">
          <div className="h-3 sm:h-4 bg-[#DDD6FE] w-full" />
          <svg
            className="w-full h-3 sm:h-4 text-[#DDD6FE] block -mt-[1px]"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 Q15,24 30,0 Q45,24 60,0 Q75,24 90,0 Q105,24 120,0 Q135,24 150,0 Q165,24 180,0 Q195,24 210,0 Q225,24 240,0 Q255,24 270,0 Q285,24 300,0 Q315,24 330,0 Q345,24 360,0 Q375,24 390,0 Q405,24 420,0 Q435,24 450,0 Q465,24 480,0 Q495,24 510,0 Q525,24 540,0 Q555,24 570,0 Q585,24 600,0 Q615,24 630,0 Q645,24 660,0 Q675,24 690,0 Q705,24 720,0 Q735,24 750,0 Q765,24 780,0 Q795,24 810,0 Q825,24 840,0 Q855,24 870,0 Q885,24 900,0 Q915,24 930,0 Q945,24 960,0 Q975,24 990,0 Q1005,24 1020,0 Q1035,24 1050,0 Q1065,24 1080,0 Q1095,24 1110,0 Q1125,24 1140,0 Q1155,24 1170,0 Q1185,24 1200,0 L1200,0 L0,0 Z" />
          </svg>
        </div>
      )}
    </div>
  );
};
