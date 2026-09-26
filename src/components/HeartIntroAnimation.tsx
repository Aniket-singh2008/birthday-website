import React, { useEffect, useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeartParticle {
  id: number;
  xPercent: number;
  yPercent: number;
  size: number;
  driftX: number;
  driftY: number;
  rotateDeg: number;
  duration: number;
  symbol: string;
}

/**
 * PASSCODE SCREEN — 5 SECOND HEART INTRODUCTION
 *
 * SPECIFICATION:
 * - Starts automatically immediately when the passcode screen appears/loads.
 * - NOT triggered by pressing any keypad button.
 * - Generates approximately 8–15 new hearts every second continuously for exactly 5 seconds.
 * - Hearts continuously pop/burst from different areas around the screen with varied sizes.
 * - Random starting positions, floating upward and diagonally across the screen.
 * - Gentle rotation while moving.
 * - Soft scale/pop effect when each heart appears (scale 0.2 -> 1.35 -> 1.0).
 * - Gradually fades away while moving.
 * - Does NOT block or cover the passcode keypad (pointer-events: none, z-40).
 * - Passcode input is completely independent and immediately usable (0510).
 * - Does NOT restart when user types keypad numbers or unlocks.
 * - Stops creating new hearts after exactly 5 seconds; existing ones finish fading out naturally.
 * - Automatically cleans up DOM elements (zero memory accumulation).
 */
export const HeartIntroAnimation: React.FC = memo(() => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const nextIdRef = useRef(0);
  const isSpawningRef = useRef(true);

  useEffect(() => {
    isSpawningRef.current = true;
    const startTime = Date.now();
    const FIVE_SECONDS_MS = 5000;

    const spawnHeart = () => {
      if (!isSpawningRef.current) return;
      const elapsed = Date.now() - startTime;
      if (elapsed >= FIVE_SECONDS_MS) {
        isSpawningRef.current = false;
        return;
      }

      const id = ++nextIdRef.current;

      // Random starting positions across the entire screen
      // Horizontal: 4% to 94% across the screen
      const xPercent = Math.floor(Math.random() * 90) + 5;
      
      // Vertical: 45% bursting from mid-screen (30%-65%), 55% floating from lower zones (65%-95%)
      const yPercent = Math.random() < 0.45
        ? Math.floor(Math.random() * 35) + 30
        : Math.floor(Math.random() * 30) + 65;

      // Varied heart sizes (18px to 48px)
      const sizes = [18, 22, 26, 30, 36, 42, 48];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Float upward (-220px to -480px) and diagonal drift (-150px to +150px)
      const driftX = Math.floor((Math.random() - 0.5) * 300);
      const driftY = -(Math.floor(Math.random() * 260) + 220);

      // Gentle rotation (-40deg to +40deg)
      const rotateDeg = Math.floor((Math.random() - 0.5) * 80);

      // Duration in seconds (2.2s to 3.2s)
      const duration = (Math.floor(Math.random() * 1000) + 2200) / 1000;

      // Heart symbol
      const symbols = ['❤️', '❤️', '❤️', '❤️', '💖', '💕', '❤️', '❤️'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      const newParticle: HeartParticle = {
        id,
        xPercent,
        yPercent,
        size,
        driftX,
        driftY,
        rotateDeg,
        duration,
        symbol,
      };

      setHearts((prev) => [...prev, newParticle]);

      // Automatically clean up this particle after its animation duration
      window.setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, duration * 1000 + 100);
    };

    // Immediate initial burst of hearts on mount
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnHeart, i * 40);
    }

    // Interval generating ~11 new hearts per second (within 8-15 range: 1000ms / 88ms ≈ 11.4/s)
    const intervalTimer = window.setInterval(spawnHeart, 88);

    // Stop creating new hearts after exactly 5 seconds
    const stopTimer = window.setTimeout(() => {
      isSpawningRef.current = false;
      clearInterval(intervalTimer);
    }, FIVE_SECONDS_MS);

    return () => {
      isSpawningRef.current = false;
      clearInterval(intervalTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
    >
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            initial={{
              opacity: 0,
              scale: 0.2,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 0.95, 0.8, 0],
              scale: [0.2, 1.35, 1.0, 0.95, 0.65],
              x: [0, heart.driftX * 0.2, heart.driftX * 0.55, heart.driftX],
              y: [0, heart.driftY * 0.22, heart.driftY * 0.65, heart.driftY],
              rotate: [0, heart.rotateDeg * 0.35, heart.rotateDeg * 0.75, heart.rotateDeg],
            }}
            transition={{
              duration: heart.duration,
              ease: [0.25, 1, 0.5, 1],
              times: [0, 0.14, 0.35, 0.75, 1],
            }}
            className="absolute inline-block pointer-events-none select-none filter drop-shadow-sm"
            style={{
              left: `${heart.xPercent}%`,
              top: `${heart.yPercent}%`,
              fontSize: `${heart.size}px`,
              lineHeight: 1,
              willChange: 'transform, opacity',
            }}
          >
            {heart.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
});

HeartIntroAnimation.displayName = 'HeartIntroAnimation';
