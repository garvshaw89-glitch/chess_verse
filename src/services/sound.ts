/**
 * Web Audio API Sound Synthesizer for Chessverse 3D
 * Generates all audio procedurally without external audio file dependencies.
 * Respects browser autoplay policies and volume controls.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;
  private volume: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Piece Move: soft wooden landing thud + subtle felt rustle
   */
  public playMove() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Body thud (sine decay)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);

      // Subtle high click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(650, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);

      clickOsc.start(now);
      clickOsc.stop(now + 0.04);
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Piece Capture: sharp impact crack + resonant wooden knock
   */
  public playCapture() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Heavy resonant strike
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);

      // Noise burst for the crack
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start(now);
    } catch {}
  }

  /**
   * King in Check: tension alert chime
   */
  public playCheck() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Two alert tones (minor second / tritone tension)
      const freqs = [440, 622.25]; // A4 and Eb5
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        // Lowpass filter for smooth warmth
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch {}
  }

  /**
   * Checkmate / Victory fanfare
   */
  public playCheckmate() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Heroic triumphant triad: D4, F#4, A4, D5
      const chord = [293.66, 369.99, 440.0, 587.33];
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    } catch {}
  }

  /**
   * Game start chime
   */
  public playGameStart() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {}
  }

  /**
   * Gentle UI click
   */
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  /**
   * Low Clock Warning
   */
  public playClockWarning() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Premium 3D Button Press: Tactile, mechanical acoustic click with dampening
   */
  public playButton3DPress(variant: 'primary' | 'secondary' | 'tactile' = 'primary') {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Mechanical attack click
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = variant === 'primary' ? 'triangle' : 'sine';
      const baseFreq = variant === 'primary' ? 950 : 720;
      click.frequency.setValueAtTime(baseFreq, now);
      click.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      click.connect(clickGain);
      clickGain.connect(this.masterGain);

      click.start(now);
      click.stop(now + 0.045);

      // Low wooden tactile thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(180, now);
      thud.frequency.exponentialRampToValueAtTime(55, now + 0.06);

      thudGain.gain.setValueAtTime(0.2, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      thud.connect(thudGain);
      thudGain.connect(this.masterGain);

      thud.start(now);
      thud.stop(now + 0.06);
    } catch {}
  }

  /**
   * Cinematic 3D Page Transition Whoosh
   */
  public playTransitionWhoosh() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Filtered noise sweep
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.16);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);

      // Subtle harmonic glass resonance
      const glass = this.ctx.createOscillator();
      const glassGain = this.ctx.createGain();
      glass.type = 'sine';
      glass.frequency.setValueAtTime(587.33, now + 0.1); // D5
      glass.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      glassGain.gain.setValueAtTime(0.001, now);
      glassGain.gain.setValueAtTime(0.08, now + 0.12);
      glassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      glass.connect(glassGain);
      glassGain.connect(this.masterGain);

      glass.start(now + 0.1);
      glass.stop(now + 0.4);
    } catch {}
  }

  /**
   * Tactical success / puzzle / quiz correct chime
   */
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      // Rising arpeggio: C5 -> G5
      const freqs = [523.25, 783.99];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  }

  public playWin() {
    this.playCheckmate();
  }

  public playCelebration() {
    this.playCheckmate();
  }

  /**
   * Mistake / quiz incorrect error buzz
   */
  public playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }
}

export const soundService = new SoundSynthesizer();
