import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MusicService {

  private tracks = Array.from({ length: 10 }, (_, i) => `background${i + 1}`);
  private lastTrack: string | null = null;
  private playing = false;
  private volume = 0.3;

  private bgPath = "/assets/audio/";
  private currentAudio: HTMLAudioElement | null = null;

  async startAmbient() {
    if (this.playing) return;

    this.playing = true;
    await this.playRandom();
  }

  async stop() {
    this.playing = false;
  }

  private async playRandom() {
    if (!this.playing) return;

    let next = this.randomTrack();
    this.lastTrack = next;

    let localAudio = await this.audioExists(this.bgPath + next + ".mp3");
    await this.playFromBlob(localAudio)
    
    const duration = this.getTrackDuration(next);
    console.log(next, duration);

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
      background1: 222000,
      background2: 127000,
      background3: 197000,
      background4: 188000,
      background5: 116000,
      background6: 198000,
      background7: 195000,
      background8: 246000,
      background9: 212000,
      background10: 148000,
    };

    return durations[trackId] || 180000;
  }

  async audioExists(path: string): Promise<Blob> {
      const response = await fetch(path);
      if (!response.ok) {
          throw new Error('Áudio não encontrado');
      }

      return await response.blob();
  }

  async playFromBlob(blob: Blob) {
      // limpa áudio anterior
      if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio = null;
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.volume = 0.04;

      audio.onended = () => {
          URL.revokeObjectURL(url); // evita vazamento de memória
      };

      this.currentAudio = audio;
      await audio.play();
  }
}
