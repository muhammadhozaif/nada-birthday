/**
 * Lightweight Web Audio API sound generator for celebration sound effects:
 * - Candle blowing puff
 * - Magic chime when secret wish unlocks
 * - Celebratory button fanfare
 * - Synthetic party background loop fallback
 */

class SoundEffectsController {
  private ctx: AudioContext | null = null;
  private backgroundOscillators: OscillatorNode[] = [];
  private isPlayingSynthMusic = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Sound effect: Air puff when a candle is extinguished.
   */
  playCandleBlowPuff() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Noise buffer for realistic blowing puff sound
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio autoplay or permissions prevented sound
    }
  }

  /**
   * Sound effect: Magic celebratory chime when all candles are blown.
   */
  playCelebrationChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 1.2);
      } catch {
        // Audio error caught
      }
    });
  }

  /**
   * Sound effect: Snappy tactile button tap.
   */
  playTactileClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio error caught
    }
  }

  /**
   * Plays or pauses a groovy synthesized celebratory backing loop.
   */
  toggleSyntheticBackgroundMusic(shouldPlay: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    if (!shouldPlay) {
      this.backgroundOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // already stopped
        }
      });
      this.backgroundOscillators = [];
      this.isPlayingSynthMusic = false;
      return;
    }

    if (this.isPlayingSynthMusic) return;
    this.isPlayingSynthMusic = true;

    // Upbeat chords (warm amber tone)
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ];

    let chordIdx = 0;
    const playNextBar = () => {
      if (!this.isPlayingSynthMusic || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        try {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0.04, this.ctx!.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, this.ctx!.currentTime + 0.95);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start();
          osc.stop(this.ctx!.currentTime + 1.0);
          this.backgroundOscillators.push(osc);
        } catch {
          // ignore
        }
      });

      if (this.isPlayingSynthMusic) {
        setTimeout(playNextBar, 1000);
      }
    };

    playNextBar();
  }
}

export const soundEffects = new SoundEffectsController();
