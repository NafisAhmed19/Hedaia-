// Web Audio API Synthesizer for Islamic Prayer Alarm & Calming Athan Melodies
// Implements acoustic physical modeling, authentic Maqam micro-harmonic intervals, and stopping controls.

export type CalmingAthanSoundType =
  | 'madinah'
  | 'makkah'
  | 'quds'
  | 'dawnChime'
  | 'harmonic'
  | 'adhan'
  | 'softBell'
  | 'chime';

export interface AthanSoundPreset {
  id: CalmingAthanSoundType;
  titleBn: string;
  maqamName: string;
  description: string;
  tag: string;
}

export const ATHAN_SOUND_PRESETS: AthanSoundPreset[] = [
  {
    id: 'madinah',
    titleBn: 'মদিনা আজান মেলোডি',
    maqamName: 'মাকাম বায়াতি (Maqam Bayati)',
    description: 'মসজিদে নববীর অনুকরণে অত্যন্ত শান্ত, স্নিগ্ধ ও কোমল আধ্যাত্মিক সুরমালা।',
    tag: 'সর্বাধিক জনপ্রিয়',
  },
  {
    id: 'makkah',
    titleBn: 'মক্কা মুয়াজ্জিন সুর',
    maqamName: 'মাকাম রাশত (Maqam Rast)',
    description: 'মসজিদুল হারামের মতো গম্ভীর, সুদূরপ্রসারী ও আত্মশুদ্ধিকর প্রশান্ত ধ্বনি।',
    tag: 'গম্ভীর ও মধুর',
  },
  {
    id: 'quds',
    titleBn: 'আল-আকসা আধ্যাত্মিক সুর',
    maqamName: 'মাকাম হিজাজ (Maqam Hijaz)',
    description: 'মন ছুঁয়ে যাওয়া গভীর আবেগঘন হিজাজ সুর যা অন্তরে তাকওয়া ও নামাজের আগ্রহ জাগিয়ে তোলে।',
    tag: 'আধ্যাত্মিক ও গভীর',
  },
  {
    id: 'dawnChime',
    titleBn: 'ভোরের স্নিগ্ধ চিম',
    maqamName: 'সোলেফেজিও ৫২৮Hz টিউন',
    description: 'ভোরের মিষ্টি বাতাসে ঘণ্টার অনুরণন ও স্ফটিক স্বচ্ছ সুর যা ঘুম ও অলসতা দূর করে।',
    tag: 'ভোরের জন্য সেরা',
  },
  {
    id: 'harmonic',
    titleBn: 'শান্ত ৪৩২Hz হারমোনিক রেজোন্যান্স',
    maqamName: 'স্যাক্রেড হারমোনিক্স',
    description: 'অত্যন্ত মোলায়েম ও শান্ত প্রাকৃতিক অনুরণন, যা পরিবার বা কর্মক্ষেত্রে বিরক্তি না ঘটিয়ে মৃদু স্মরণ করায়।',
    tag: 'অফিস ও ঘরের উপযোগী',
  },
];

class PrayerAlarmAudioPlayer {
  private ctx: AudioContext | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private stopTimeouts: number[] = [];

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a single rich acoustic bell chime with harmonic partials
  private scheduleTone(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
    waveType: OscillatorType = 'sine',
    overtoneBrightness = 0.35
  ): void {
    // 1. Fundamental tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = waveType;
    osc1.frequency.setValueAtTime(freq, startTime);

    // 2. Second harmonic (Octave warmth & body)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.002, startTime); // gentle chorus

    // 3. Third harmonic (Bell brilliance / brass resonance)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq * 3.008, startTime);

    // Master volume scaling
    const peak = Math.max(0.04, Math.min(1.0, volume)) * 0.45;

    // Envelopes: soft attack, natural exponential ring
    gain1.gain.setValueAtTime(0.0001, startTime);
    gain1.gain.exponentialRampToValueAtTime(peak, startTime + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    gain2.gain.setValueAtTime(0.0001, startTime);
    gain2.gain.exponentialRampToValueAtTime(peak * overtoneBrightness, startTime + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.85);

    gain3.gain.setValueAtTime(0.0001, startTime);
    gain3.gain.exponentialRampToValueAtTime(peak * (overtoneBrightness * 0.5), startTime + 0.025);
    gain3.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.65);

    // Connect to destination
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    // Start
    osc1.start(startTime);
    osc1.stop(startTime + duration + 0.1);

    osc2.start(startTime);
    osc2.stop(startTime + duration + 0.1);

    osc3.start(startTime);
    osc3.stop(startTime + duration + 0.1);

    this.activeNodes.push(
      { osc: osc1, gain: gain1 },
      { osc: osc2, gain: gain2 },
      { osc: osc3, gain: gain3 }
    );
  }

  // Stop any currently playing audio immediately
  stop(): void {
    // Clear timeouts
    this.stopTimeouts.forEach((tid) => clearTimeout(tid));
    this.stopTimeouts = [];

    // Fade out and stop active nodes
    if (this.ctx && this.activeNodes.length > 0) {
      const now = this.ctx.currentTime;
      this.activeNodes.forEach(({ osc, gain }) => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          setTimeout(() => {
            try {
              osc.stop(now + 0.16);
            } catch {
              // ignore
            }
          }, 180);
        } catch {
          // ignore
        }
      });
      this.activeNodes = [];
    }
  }

  // Play prayer alarm melody based on chosen calming Athan sound
  playChime(soundType: CalmingAthanSoundType = 'madinah', volume = 0.8): void {
    try {
      this.stop(); // Stop any previous playback
      const ctx = this.getAudioContext();
      const now = ctx.currentTime + 0.05;

      const normalizedType =
        soundType === 'adhan' ? 'madinah' : soundType === 'softBell' ? 'dawnChime' : soundType;

      if (normalizedType === 'madinah') {
        // Madinah Bayati Melody: Authentic calming prayer motif (D4 -> F4 -> G4 -> A4 -> Bb4 -> A4 -> G4 -> D5)
        const notes = [
          { freq: 293.66, delay: 0.0, dur: 1.3 }, // D4 (Allahu...)
          { freq: 349.23, delay: 0.5, dur: 1.2 }, // F4
          { freq: 392.0, delay: 1.0, dur: 1.4 },  // G4 (...Akbar)
          { freq: 440.0, delay: 1.6, dur: 1.3 },  // A4
          { freq: 466.16, delay: 2.1, dur: 1.2 }, // Bb4
          { freq: 440.0, delay: 2.6, dur: 1.3 },  // A4
          { freq: 392.0, delay: 3.1, dur: 1.4 },  // G4
          { freq: 587.33, delay: 3.7, dur: 2.8 }, // D5 (Long soothing reverberant tail)
        ];
        notes.forEach((n) => {
          this.scheduleTone(ctx, n.freq, now + n.delay, n.dur, volume, 'sine', 0.4);
        });
      } else if (normalizedType === 'makkah') {
        // Makkah Rast Melody: Ascending majestic sanctuary call (C4 -> D4 -> E4 -> F4 -> G4 -> C5)
        const notes = [
          { freq: 261.63, delay: 0.0, dur: 1.3 }, // C4
          { freq: 293.66, delay: 0.45, dur: 1.2 }, // D4
          { freq: 329.63, delay: 0.95, dur: 1.3 }, // E4
          { freq: 349.23, delay: 1.45, dur: 1.3 }, // F4
          { freq: 392.0, delay: 2.0, dur: 1.5 },  // G4
          { freq: 523.25, delay: 2.7, dur: 2.6 }, // C5
        ];
        notes.forEach((n) => {
          this.scheduleTone(ctx, n.freq, now + n.delay, n.dur, volume, 'sine', 0.45);
        });
      } else if (normalizedType === 'quds') {
        // Al-Aqsa Hijaz Melody: Heart-stirring evocative Maqam Hijaz (D4 -> Eb4 -> F#4 -> G4 -> A4 -> D5)
        const notes = [
          { freq: 293.66, delay: 0.0, dur: 1.3 }, // D4
          { freq: 311.13, delay: 0.48, dur: 1.2 }, // Eb4 (distinctive Hijaz 2nd)
          { freq: 369.99, delay: 1.0, dur: 1.3 },  // F#4 (characteristic Hijaz 3rd)
          { freq: 392.0, delay: 1.55, dur: 1.3 },  // G4
          { freq: 440.0, delay: 2.1, dur: 1.4 },   // A4
          { freq: 587.33, delay: 2.75, dur: 2.9 }, // D5
        ];
        notes.forEach((n) => {
          this.scheduleTone(ctx, n.freq, now + n.delay, n.dur, volume, 'sine', 0.38);
        });
      } else if (normalizedType === 'dawnChime') {
        // Serene Dawn Chimes (528Hz Solfeggio, 660Hz, 792Hz, 1056Hz)
        const notes = [
          { freq: 528.0, delay: 0.0, dur: 2.2 },
          { freq: 660.0, delay: 0.6, dur: 2.0 },
          { freq: 792.0, delay: 1.2, dur: 2.2 },
          { freq: 1056.0, delay: 1.8, dur: 2.8 },
        ];
        notes.forEach((n) => {
          this.scheduleTone(ctx, n.freq, now + n.delay, n.dur, volume, 'sine', 0.25);
        });
      } else {
        // 432Hz Sacred Harmonic Resonance (A3 -> C#4 -> E4 -> A4 -> E5)
        const notes = [
          { freq: 216.0, delay: 0.0, dur: 1.8 },
          { freq: 270.0, delay: 0.3, dur: 1.7 },
          { freq: 324.0, delay: 0.6, dur: 1.8 },
          { freq: 432.0, delay: 0.95, dur: 2.2 },
          { freq: 540.0, delay: 1.35, dur: 2.5 },
          { freq: 648.0, delay: 1.8, dur: 2.8 },
        ];
        notes.forEach((n) => {
          this.scheduleTone(ctx, n.freq, now + n.delay, n.dur, volume, 'sine', 0.3);
        });
      }
    } catch (err) {
      console.warn('Audio playback not permitted yet or unsupported', err);
    }
  }

  // Play a quick celebratory gentle confirmation ping
  playConfirmation(): void {
    try {
      this.stop();
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      this.scheduleTone(ctx, 523.25, now, 0.5, 0.65); // C5
      this.scheduleTone(ctx, 659.25, now + 0.12, 0.6, 0.7); // E5
      this.scheduleTone(ctx, 783.99, now + 0.24, 1.1, 0.75); // G5
    } catch {
      // ignore
    }
  }
}

export const prayerAlarmAudio = new PrayerAlarmAudioPlayer();
