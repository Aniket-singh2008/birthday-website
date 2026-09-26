import React from 'react';

interface ShinchanProps {
  className?: string;
  variant: 'blushing' | 'pointing';
  customImageUrl?: string | null;
}

/**
 * Renders the real Shinchan image uploaded by the user, or high-fidelity visual vector recreation.
 */
export const ShinchanUserPhoto: React.FC<ShinchanProps> = ({
  className = 'w-36 h-36',
  variant,
  customImageUrl,
}) => {
  // If custom real image is supplied, render real image tag
  if (customImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border-2 border-purple-200 shadow-md bg-purple-50 ${className}`}>
        <img
          src={customImageUrl}
          alt={variant === 'blushing' ? 'Shinchan Blushing' : 'Shinchan One Love'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
      </div>
    );
  }

  if (variant === 'blushing') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border-2 border-purple-200 shadow-md ${className}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background: Window Frame, Blue Sky & Green wall */}
          {/* Blue Sky through window */}
          <rect x="0" y="0" width="200" height="75" fill="#87CEEB" />
          <path d="M 170 30 Q 185 20 200 30" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.7" />

          {/* Wooden Window Frame (Brown beams) */}
          <rect x="0" y="70" width="200" height="16" fill="#BD8249" stroke="#5A3A1A" strokeWidth="2.5" />
          {/* Vertical wood post */}
          <rect x="105" y="0" width="16" height="86" fill="#C5894E" stroke="#5A3A1A" strokeWidth="2.5" />
          {/* Wood grain dots/knots */}
          <circle cx="113" cy="22" r="2" fill="#5A3A1A" />
          <circle cx="165" cy="78" r="1.5" fill="#5A3A1A" />

          {/* Lower wall: soft light pastel green */}
          <rect x="0" y="86" width="200" height="114" fill="#B5E48C" />

          {/* Table edge at bottom */}
          <rect x="0" y="175" width="200" height="25" fill="#FDE68A" stroke="#262626" strokeWidth="3" />

          {/* Shinchan Character (Blushing resting head on hands) */}
          <g transform="translate(10, 25)">
            {/* Hair */}
            <path
              d="M 38 48 C 36 28, 55 12, 85 12 C 115 12, 132 28, 130 50 C 122 45, 112 40, 95 44 C 75 42, 60 48, 38 48 Z"
              fill="#26221F"
            />
            {/* Side Hair Burn */}
            <path
              d="M 125 40 C 135 48, 142 60, 134 75 C 130 65, 128 50, 125 40 Z"
              fill="#26221F"
            />

            {/* Chubby Head Contour (Iconic right ear and ultra-chubby left cheek) */}
            <path
              d="M 45 45 C 75 32, 110 35, 122 55 C 130 68, 126 80, 120 88 C 138 78, 158 84, 158 100 C 158 116, 140 125, 124 122 C 122 135, 110 148, 88 150 C 65 152, 45 145, 30 135 C 15 125, 12 108, 15 95 C 18 80, 30 70, 42 65 C 38 58, 40 48, 45 45 Z"
              fill="#FFDFC4"
              stroke="#262626"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Thick Iconic Eyebrows */}
            <path
              d="M 42 36 C 48 24, 62 26, 68 36 C 60 40, 48 42, 42 36 Z"
              fill="#26221F"
              stroke="#262626"
              strokeWidth="1.5"
            />
            <path
              d="M 80 27 C 88 20, 102 24, 108 34 C 98 38, 86 36, 80 27 Z"
              fill="#26221F"
              stroke="#262626"
              strokeWidth="1.5"
            />

            {/* Dreamy Closed Eyes (Gentle curves) */}
            <path
              d="M 45 68 Q 62 68 76 56"
              stroke="#262626"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 80 55 Q 98 58 112 52"
              stroke="#262626"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cute Open Mouth (Yawing / Sighing affectionately) */}
            <path
              d="M 32 94 C 36 94, 52 98, 50 110 C 48 118, 34 116, 32 106 Z"
              fill="#991B1B"
              stroke="#262626"
              strokeWidth="3"
            />

            {/* Prominent Pink Blush Stripes (////) */}
            {/* Left Cheek Blush */}
            <g stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              <line x1="38" y1="84" x2="44" y2="76" />
              <line x1="44" y1="84" x2="50" y2="76" />
              <line x1="50" y1="84" x2="56" y2="76" />
              <line x1="56" y1="84" x2="62" y2="76" />
            </g>
            {/* Soft pink aura underneath */}
            <ellipse cx="48" cy="80" rx="14" ry="8" fill="#FDA4AF" opacity="0.5" filter="blur(3px)" />

            {/* Right Cheek Blush */}
            <g stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              <line x1="90" y1="72" x2="96" y2="64" />
              <line x1="96" y1="72" x2="102" y2="64" />
              <line x1="102" y1="72" x2="108" y2="64" />
              <line x1="108" y1="72" x2="114" y2="64" />
            </g>
            <ellipse cx="102" cy="68" rx="14" ry="8" fill="#FDA4AF" opacity="0.5" filter="blur(3px)" />

            {/* White School Uniform Shirt & Green Collar Accent */}
            <path
              d="M 45 135 C 50 120, 68 122, 75 130 L 105 132 C 122 135, 135 145, 140 160 L 40 160 Z"
              fill="#F8FAFC"
              stroke="#262626"
              strokeWidth="3.5"
            />
            {/* Red necktie/collar bar */}
            <path d="M 72 132 L 85 125 L 80 140 Z" fill="#EF4444" stroke="#262626" strokeWidth="2.5" />
            {/* Green patch on sleeve */}
            <ellipse cx="120" cy="155" rx="12" ry="10" fill="#22C55E" stroke="#262626" strokeWidth="2.5" />

            {/* Two Cute Little Hands Supporting Chin */}
            {/* Left Fist */}
            <path
              d="M 80 122 C 80 114, 90 112, 98 116 C 104 120, 102 128, 98 135 C 92 138, 82 134, 80 122 Z"
              fill="#FFDFC4"
              stroke="#262626"
              strokeWidth="3"
            />
            <path d="M 88 114 Q 92 122 88 128" stroke="#262626" strokeWidth="2" fill="none" />

            {/* Right Fist */}
            <path
              d="M 102 116 C 104 110, 114 110, 120 116 C 124 122, 122 130, 118 136 C 110 138, 102 132, 102 116 Z"
              fill="#FFDFC4"
              stroke="#262626"
              strokeWidth="3"
            />
            <path d="M 110 114 Q 114 122 110 128" stroke="#262626" strokeWidth="2" fill="none" />
          </g>
        </svg>
      </div>
    );
  }

  // variant === 'pointing' (Image 2: Shinchan sitting on fence pointing, with bump on head & ONE LOVE text)
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-purple-200 shadow-md ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full object-cover select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky Background */}
        <rect x="0" y="0" width="200" height="240" fill="#7EC8E3" />

        {/* Fluffy white cartoon clouds */}
        <ellipse cx="60" cy="35" rx="30" ry="10" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="50" cy="30" rx="16" ry="12" fill="#FFFFFF" />
        <ellipse cx="70" cy="30" rx="18" ry="12" fill="#FFFFFF" />

        <ellipse cx="170" cy="85" rx="28" ry="10" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="160" cy="80" rx="15" ry="10" fill="#FFFFFF" />

        {/* Green bushes in distance behind fence */}
        <ellipse cx="30" cy="200" rx="35" ry="25" fill="#4ADE80" stroke="#1E3A1E" strokeWidth="2" />
        <ellipse cx="175" cy="205" rx="40" ry="30" fill="#22C55E" stroke="#1E3A1E" strokeWidth="2" />

        {/* Big "ONE LOVE" Stylized Typography rotated like Image 2 */}
        <g transform="translate(15, 115) rotate(-32)">
          <text
            x="0"
            y="0"
            fill="#EF4444"
            fontFamily="'Fredoka', sans-serif"
            fontWeight="900"
            fontSize="30"
            letterSpacing="2"
          >
            ONE
          </text>
          <text
            x="5"
            y="26"
            fill="#1E293B"
            fontFamily="'Fredoka', sans-serif"
            fontWeight="900"
            fontSize="32"
            letterSpacing="3"
          >
            LOVE
          </text>
        </g>

        {/* Shinchan Character (Sitting on wooden beam pointing) */}
        <g transform="translate(25, 78)">
          {/* Big Bump / Lump on head with dots (Iconic Shinchan knot!) */}
          <ellipse cx="60" cy="28" rx="22" ry="20" fill="#FED7AA" stroke="#262626" strokeWidth="3" />
          {/* Bump dots */}
          <circle cx="52" cy="22" r="1.5" fill="#B45309" />
          <circle cx="62" cy="18" r="1.5" fill="#B45309" />
          <circle cx="68" cy="26" r="1.5" fill="#B45309" />
          <circle cx="56" cy="32" r="1.5" fill="#B45309" />

          {/* Hair */}
          <path
            d="M 52 44 C 44 48, 38 65, 42 78 C 45 74, 52 68, 62 65 C 75 62, 92 65, 102 75 C 104 60, 95 45, 80 42 Z"
            fill="#26221F"
          />

          {/* Chubby Head Contour */}
          <path
            d="M 55 45 C 80 38, 105 45, 115 62 C 122 75, 120 90, 114 98 C 135 90, 155 100, 152 118 C 148 135, 125 140, 105 138 C 85 140, 60 135, 48 124 C 38 115, 36 100, 42 88 C 44 75, 48 55, 55 45 Z"
            fill="#FFDFC4"
            stroke="#262626"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Angled Thick Angry/Mischievous Eyebrows */}
          <path
            d="M 56 68 C 66 52, 78 54, 85 64 C 75 66, 65 66, 56 68 Z"
            fill="#26221F"
            stroke="#262626"
            strokeWidth="1.5"
          />
          <path
            d="M 96 55 C 106 48, 116 50, 122 60 C 112 62, 104 62, 96 55 Z"
            fill="#26221F"
            stroke="#262626"
            strokeWidth="1.5"
          />

          {/* Forehead wrinkles (Little tick marks) */}
          <path d="M 85 58 L 89 65 L 93 58" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Squinty Smug / Cool Eyes */}
          <path d="M 68 76 Q 78 72 88 77" stroke="#262626" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse cx="78" cy="78" rx="2" ry="2" fill="#262626" />

          <path d="M 102 68 Q 112 65 120 70" stroke="#262626" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse cx="112" cy="70" rx="2" ry="2" fill="#262626" />

          {/* Small Pouted Mouth */}
          <ellipse cx="130" cy="115" rx="3" ry="3.5" fill="#262626" />

          {/* Red Sweatshirt Torso */}
          <path
            d="M 60 135 C 50 140, 52 155, 65 165 C 80 170, 120 170, 135 158 C 142 145, 138 135, 125 132 Z"
            fill="#EF4444"
            stroke="#262626"
            strokeWidth="3.5"
          />

          {/* Left Arm Pointing to the Right */}
          <path
            d="M 85 142 C 95 140, 115 142, 122 146 L 128 144 L 122 152 C 115 155, 95 154, 85 150 Z"
            fill="#EF4444"
            stroke="#262626"
            strokeWidth="2.5"
          />
          {/* Left hand with index finger pointed */}
          <path
            d="M 124 144 C 132 144, 138 146, 135 150 C 130 152, 124 150, 122 148 Z"
            fill="#FFDFC4"
            stroke="#262626"
            strokeWidth="2.5"
          />

          {/* Right Arm Pointing Farther Right */}
          <path
            d="M 125 142 C 140 144, 158 142, 168 148 C 160 154, 142 154, 130 152 Z"
            fill="#EF4444"
            stroke="#262626"
            strokeWidth="2.5"
          />
          {/* Pointing finger hand */}
          <path
            d="M 166 146 L 178 144 C 180 148, 175 152, 168 152 Z"
            fill="#FFDFC4"
            stroke="#262626"
            strokeWidth="2.5"
          />

          {/* Yellow Shorts */}
          <path
            d="M 55 160 L 52 178 C 75 185, 125 185, 145 174 L 140 158 Z"
            fill="#FACC15"
            stroke="#262626"
            strokeWidth="3.5"
          />

          {/* Legs sitting on fence */}
          {/* Left Leg & White Sock & Shoe */}
          <path d="M 52 165 C 45 170, 42 180, 48 190" stroke="#262626" strokeWidth="3" fill="#FFDFC4" />
          <rect x="44" y="185" width="10" height="12" fill="#FFFFFF" stroke="#262626" strokeWidth="2.5" />
          <ellipse cx="50" cy="198" rx="7" ry="4" fill="#FDE047" stroke="#262626" strokeWidth="2.5" />

          {/* Right Leg & White Sock & Shoe */}
          <path d="M 140 162 C 148 170, 150 180, 145 190" stroke="#262626" strokeWidth="3" fill="#FFDFC4" />
          <rect x="142" y="185" width="10" height="12" fill="#FFFFFF" stroke="#262626" strokeWidth="2.5" />
          <ellipse cx="152" cy="198" rx="7" ry="4" fill="#FDE047" stroke="#262626" strokeWidth="2.5" />
        </g>

        {/* Wooden Fence Bar across the bottom */}
        <rect x="0" y="210" width="200" height="30" fill="#EAB308" stroke="#262626" strokeWidth="3.5" />
        <rect x="12" y="222" width="6" height="60" fill="#CA8A04" stroke="#262626" strokeWidth="2" />
      </svg>
    </div>
  );
};
