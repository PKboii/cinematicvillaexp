/**
 * Procedural ambient soundscape — ocean swell + warm air.
 * Synthesised with WebAudio so no audio files ship with the build.
 * Never autoplays: only starts on an explicit user toggle.
 */
class AmbientAudio {
  enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  private ensure(): void {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    // 4s looped brown-noise buffer
    const len = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch += 1) {
      const data = buffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
    }

    // layer 1 — ocean swell (slow LFO on gain + low-pass)
    const sea = ctx.createBufferSource();
    sea.buffer = buffer;
    sea.loop = true;
    const seaFilter = ctx.createBiquadFilter();
    seaFilter.type = "lowpass";
    seaFilter.frequency.value = 260;
    seaFilter.Q.value = 0.4;
    const seaGain = ctx.createGain();
    seaGain.gain.value = 0.5;
    const swell = ctx.createOscillator();
    swell.frequency.value = 0.07;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.26;
    swell.connect(swellDepth);
    swellDepth.connect(seaGain.gain);
    sea.connect(seaFilter);
    seaFilter.connect(seaGain);
    seaGain.connect(master);

    // layer 2 — warm air / distant birds shimmer
    const air = ctx.createBufferSource();
    air.buffer = buffer;
    air.loop = true;
    air.playbackRate.value = 1.7;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "bandpass";
    airFilter.frequency.value = 1500;
    airFilter.Q.value = 0.9;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.03;
    const breeze = ctx.createOscillator();
    breeze.frequency.value = 0.11;
    const breezeDepth = ctx.createGain();
    breezeDepth.gain.value = 0.018;
    breeze.connect(breezeDepth);
    breezeDepth.connect(airGain.gain);
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(master);

    sea.start();
    air.start();
    swell.start();
    breeze.start();
  }

  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on;
    if (on) {
      this.ensure();
      const ctx = this.ctx;
      const master = this.master;
      if (!ctx || !master) return;
      if (ctx.state === "suspended") await ctx.resume();
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0.16, t + 2.5);
    } else if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0.0001, t + 1.2);
    }
  }

  toggle(): boolean {
    void this.setEnabled(!this.enabled);
    return this.enabled;
  }
}

export const ambient = new AmbientAudio();
