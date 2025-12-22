import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';

@Injectable({ providedIn: 'root' })
export class MusicService {

  private tracks = Array.from({ length: 10 }, (_, i) => `bg${i + 1}`);
  private lastTrack: string | null = null;
  private playing = false;
  private volume = 0.10;

  async init() {
    for (let i = 1; i <= 10; i++) {
      await NativeAudio.preload({
        assetId: `bg${i}`,
        assetPath: `background${i}.mp3`,
        volume: this.volume,
        isUrl: false
      });
    }
  }

  async startAmbient() {
    if (this.playing) return;

    this.playing = true;
    await this.playRandom();
  }

  async stop() {
    this.playing = false;

    for (const id of this.tracks) {
      try {
        await NativeAudio.stop({ assetId: id });
      } catch {}
    }
  }

  private async playRandom() {
    if (!this.playing) return;

    let next = this.randomTrack();

    this.lastTrack = next;

    await NativeAudio.play({ assetId: next });

    const duration = this.getTrackDuration(next);

    setTimeout(() => {
      this.playRandom();
    }, duration);
  }

  private randomTrack(): string {
    let next;
    do {
      next = this.tracks[Math.floor(Math.random() * this.tracks.length)];
    } while (next === this.lastTrack);

    return next;
  }

  private getTrackDuration(trackId: string): number {
    const durations: Record<string, number> = {
      bg1: 222000,
      bg2: 127000,
      bg3: 197000,
      bg4: 188000,
      bg5: 116000,
      bg6: 198000,
      bg7: 195000,
      bg8: 246000,
      bg9: 212000,
      bg10: 148000,
    };

    return durations[trackId] || 180000;
  }

  async setVolume(value: number) {
    this.volume = value;

    for (const id of this.tracks) {
      await NativeAudio.setVolume({
        assetId: id,
        volume: value
      });
    }
  }
}
