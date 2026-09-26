/**
 * SOUND EFFECTS SERVICE
 * 
 * Uses Web Audio API to synthesize cute, nostalgic, delightful sound effects
 * and an optional music-box background chime without external MP3 assets.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /** Soft cute bubble pop for keypad & buttons */
  public playPop(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio error safe fallback
    }
  }

  /** Cute soft wobble for incorrect passcode or playful No */
  public playWobble(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.12);
      osc.frequency.linearRampToValueAtTime(220, now + 0.24);
      osc.frequency.linearRampToValueAtTime(150, now + 0.35);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // safe fallback
    }
  }

  /** Ascending magical chime for unlock and reveals */
  public playSuccessChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.48);
      } catch {
        // safe fallback
      }
    });
  }

  /** Sweet soft warm chord for the virtual hug */
  public playHugChord(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [329.63, 392.00, 493.88, 587.33, 659.25]; // E major 9 chord
    const now = ctx.currentTime;

    freqs.forEach((freq) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.25);
      } catch {
        // safe fallback
      }
    });
  }

  /** Play gentle music box melody */
  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public isMusicActive(): boolean {
    return this.isMusicPlaying;
  }

  private startMusic(): void {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    this.isMusicPlaying = true;
    // Cute gentle lullaby / birthday melody notes (C, C, D, C, F, E...)
    const melody = [
      { f: 523.25, d: 350 },
      { f: 523.25, d: 350 },
      { f: 587.33, d: 700 },
      { f: 523.25, d: 700 },
      { f: 698.46, d: 700 },
      { f: 659.25, d: 1100 },
      { f: 523.25, d: 350 },
      { f: 523.25, d: 350 },
      { f: 587.33, d: 700 },
      { f: 523.25, d: 700 },
      { f: 783.99, d: 700 },
      { f: 698.46, d: 1100 },
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isMusicPlaying || this.isMuted) return;
      const c = this.getContext();
      if (!c) return;

      const note = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;

      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, c.currentTime);

        gain.gain.setValueAtTime(0, c.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (note.d / 1000) * 0.9);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(c.currentTime);
        osc.stop(c.currentTime + note.d / 1000);
      } catch {
        // safe fallback
      }

      this.musicInterval = window.setTimeout(playNext, note.d + 100);
    };

    playNext();
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundService();
