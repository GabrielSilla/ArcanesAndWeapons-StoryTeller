import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './game-components/game';
import { IonicModule } from '@ionic/angular';
import { InitScreen } from "./game-components/init-screen/init-screen";
import { single } from 'rxjs';
import { NativeAudio } from '@capacitor-community/native-audio';
import { MusicService } from './services/music.service';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { KeepAwake } from '@capacitor-community/keep-awake';

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
    this.setupWebOrientationLock();
    const width = window.innerWidth;

    this.bgN.set("bg-portal");
  }

  /**
   * No navegador (fora do app nativo, que já trava em paisagem), tenta travar a tela em
   * horizontal. Só funciona no Android (Chrome/Firefox), em tela cheia e depois de um toque
   * do jogador. Onde não há suporte (ex.: Safari do iPhone), o aviso de rotação do
   * app.html/app.less cobre o caso.
   */
  private setupWebOrientationLock() {
    if (Capacitor.isNativePlatform()) return;
    if (!window.matchMedia('(pointer: coarse)').matches) return; // só celular/tablet

    const tryLock = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        await (screen.orientation as any)?.lock?.('landscape');
      } catch {
        /* sem suporte ou recusado: o aviso de rotação continua valendo */
      }
    };

    // primeiro toque do jogador; depois, só quando ele estiver em retrato (vendo o aviso)
    let firstTouch = true;
    document.addEventListener('pointerup', () => {
      if (firstTouch || window.matchMedia('(orientation: portrait)').matches) {
        firstTouch = false;
        tryLock();
      }
    });
  }

  changeBg(event: string) {
    this.bgN.set("bg-" + event);
  }

  async InitScreen() {
    if (Capacitor.isNativePlatform()) {
      await ScreenOrientation.lock({ orientation: 'landscape' });
      await KeepAwake.keepAwake();
    }

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
