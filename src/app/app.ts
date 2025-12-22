import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './game-components/game';
import { IonicModule } from '@ionic/angular';
import { InitScreen } from "./game-components/init-screen/init-screen";
import { single } from 'rxjs';
import { NativeAudio } from '@capacitor-community/native-audio';
import { MusicService } from './services/music.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Game, IonicModule, InitScreen],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('aa-game');
  musicService: MusicService;

  bgN = signal("");
  logoImg = "logo.png";
  gameLogo = "game-logo.png";

  showInit = signal(false);
  initImg = signal("");
  animation = signal("");
  bgAnimation = signal("");

  constructor(musicService: MusicService) {
    this.musicService = musicService;

    this.InitScreen();
    const width = window.innerWidth;

    this.bgN.set("bg-portal");
  }

  changeBg(event: string) {
    this.bgN.set("bg-" + event);
  }

  InitScreen() {
    this.showInit.set(true);
    this.initImg.set(this.logoImg);
    
    this.animation.set("fade-in");
  
    setTimeout(() => {
      this.animation.set("fade-out");

      setTimeout(() => {
        this.initImg.set(this.gameLogo);
        this.animation.set("fade-in");

        setTimeout(() => {
          this.animation.set("fade-out");
          this.bgAnimation.set("fade-out");

          setTimeout(() => {
            this.showInit.set(false);
          }, 1000);
        }, 4000);
      }, 1000);
    }, 4000);
  }
}
