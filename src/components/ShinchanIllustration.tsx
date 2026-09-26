import React from 'react';

interface ShinchanProps {
  className?: string;
  variant?: 'left' | 'right';
}

/**
 * High-quality authentic vector illustration of Shinchan (Crayon Shin-chan / Shinnosuke Nohara)
 * Left: Cheerful waving Shinchan with signature red shirt & yellow shorts
 * Right: Playful laughing Shinchan with cute blush and peace / thumbs up pose
 */
export const ShinchanIllustration: React.FC<ShinchanProps> = ({
  className = 'w-24 h-28',
  variant = 'left',
}) => {
  if (variant === 'right') {
    return (
      <svg
        viewBox="0 0 120 140"
        className={`${className} filter drop-shadow-md select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Playful Shinchan (Right side) */}
        {/* Hair - back spiky bump */}
        <path
          d="M 35 15 C 20 18, 12 35, 18 52 C 14 56, 16 65, 24 68 C 18 45, 30 20, 52 18 Z"
          fill="#1E1B18"
        />

        {/* Head / Iconic Cheek Contour */}
        <path
          d="M 36 20 C 58 10, 85 18, 92 36 C 98 48, 94 65, 88 74 C 98 84, 94 102, 78 104 C 62 106, 38 106, 28 88 C 22 78, 24 64, 25 54 C 20 40, 24 26, 36 20 Z"
          fill="#FFDFC4"
          stroke="#1F1A17"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Thick Signature Eyebrows */}
        <path
          d="M 40 34 C 48 30, 60 32, 65 37 C 62 40, 50 40, 40 37 Z"
          fill="#18181B"
        />
        <path
          d="M 72 37 C 78 33, 88 35, 92 41 C 88 43, 78 44, 72 41 Z"
          fill="#18181B"
        />

        {/* Eyes (Mischievous / Happy Shinchan Eyes) */}
        <ellipse cx="54" cy="48" rx="6" ry="8" fill="#18181B" />
        <ellipse cx="56" cy="46" rx="2.5" ry="3.5" fill="#FFFFFF" />

        <ellipse cx="80" cy="51" rx="6" ry="8" fill="#18181B" />
        <ellipse cx="82" cy="49" rx="2.5" ry="3.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="38" cy="74" rx="7" ry="5" fill="#F87171" opacity="0.75" />
        <ellipse cx="86" cy="80" rx="7" ry="5" fill="#F87171" opacity="0.75" />

        {/* Cute Open Laughing Mouth */}
        <path
          d="M 52 70 Q 64 88 74 72"
          fill="#E11D48"
          stroke="#1F1A17"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 57 78 Q 64 74 70 78"
          fill="#FB7185"
        />

        {/* Ear */}
        <path
          d="M 23 54 C 18 54, 16 64, 22 68 C 26 66, 27 58, 23 54 Z"
          fill="#FFDFC4"
          stroke="#1F1A17"
          strokeWidth="2.8"
        />

        {/* Red T-Shirt Body */}
        <path
          d="M 40 102 C 34 105, 30 115, 32 130 C 48 132, 75 132, 86 128 C 88 116, 84 104, 76 102 Z"
          fill="#EF4444"
          stroke="#1F1A17"
          strokeWidth="3"
        />

        {/* Right Arm (Peace / Waving gesture) */}
        <path
          d="M 84 105 C 95 106, 108 98, 110 88 C 105 84, 98 88, 92 92 C 86 96, 82 102, 84 105 Z"
          fill="#FFDFC4"
          stroke="#1F1A17"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Left Arm on hip */}
        <path
          d="M 33 105 C 22 108, 15 116, 20 124 C 26 126, 32 120, 35 115 Z"
          fill="#FFDFC4"
          stroke="#1F1A17"
          strokeWidth="2.8"
        />

        {/* Yellow Shorts peeking */}
        <path
          d="M 36 128 L 34 138 L 56 138 L 58 130 Z"
          fill="#FACC15"
          stroke="#1F1A17"
          strokeWidth="2.5"
        />
        <path
          d="M 60 130 L 62 138 L 84 138 L 82 128 Z"
          fill="#FACC15"
          stroke="#1F1A17"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  // Left Shinchan (Iconic waving pose with big eyes & smile)
  return (
    <svg
      viewBox="0 0 120 140"
      className={`${className} filter drop-shadow-md select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair (Left side) */}
      <path
        d="M 85 15 C 100 18, 108 35, 102 52 C 106 56, 104 65, 96 68 C 102 45, 90 20, 68 18 Z"
        fill="#1E1B18"
      />

      {/* Head / Chubby Cheek */}
      <path
        d="M 84 20 C 62 10, 35 18, 28 36 C 22 48, 26 65, 32 74 C 22 84, 26 102, 42 104 C 58 106, 82 106, 92 88 C 98 78, 96 64, 95 54 C 100 40, 96 26, 84 20 Z"
        fill="#FFDFC4"
        stroke="#1F1A17"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Eyebrows */}
      <path
        d="M 80 34 C 72 30, 60 32, 55 37 C 58 40, 70 40, 80 37 Z"
        fill="#18181B"
      />
      <path
        d="M 48 37 C 42 33, 32 35, 28 41 C 32 43, 42 44, 48 41 Z"
        fill="#18181B"
      />

      {/* Eyes */}
      <ellipse cx="66" cy="48" rx="6" ry="8" fill="#18181B" />
      <ellipse cx="64" cy="46" rx="2.5" ry="3.5" fill="#FFFFFF" />

      <ellipse cx="40" cy="51" rx="6" ry="8" fill="#18181B" />
      <ellipse cx="38" cy="49" rx="2.5" ry="3.5" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <ellipse cx="82" cy="74" rx="7" ry="5" fill="#F87171" opacity="0.75" />
      <ellipse cx="34" cy="80" rx="7" ry="5" fill="#F87171" opacity="0.75" />

      {/* Sweet Smile */}
      <path
        d="M 68 70 Q 56 86 46 72"
        fill="#E11D48"
        stroke="#1F1A17"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 63 78 Q 56 74 50 78"
        fill="#FB7185"
      />

      {/* Ear */}
      <path
        d="M 97 54 C 102 54, 104 64, 98 68 C 94 66, 93 58, 97 54 Z"
        fill="#FFDFC4"
        stroke="#1F1A17"
        strokeWidth="2.8"
      />

      {/* Red T-Shirt */}
      <path
        d="M 80 102 C 86 105, 90 115, 88 130 C 72 132, 45 132, 34 128 C 32 116, 36 104, 44 102 Z"
        fill="#EF4444"
        stroke="#1F1A17"
        strokeWidth="3"
      />

      {/* Left Waving Arm */}
      <path
        d="M 36 105 C 25 106, 12 98, 10 88 C 15 84, 22 88, 28 92 C 34 96, 38 102, 36 105 Z"
        fill="#FFDFC4"
        stroke="#1F1A17"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Right Arm */}
      <path
        d="M 87 105 C 98 108, 105 116, 100 124 C 94 126, 88 120, 85 115 Z"
        fill="#FFDFC4"
        stroke="#1F1A17"
        strokeWidth="2.8"
      />

      {/* Yellow Shorts */}
      <path
        d="M 84 128 L 86 138 L 64 138 L 62 130 Z"
        fill="#FACC15"
        stroke="#1F1A17"
        strokeWidth="2.5"
      />
      <path
        d="M 60 130 L 58 138 L 36 138 L 38 128 Z"
        fill="#FACC15"
        stroke="#1F1A17"
        strokeWidth="2.5"
      />
    </svg>
  );
};
