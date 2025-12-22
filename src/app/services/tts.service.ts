import { Injectable } from "@angular/core";

declare const puter: any;

@Injectable({
  providedIn: 'root'
})
export class TtsService {

    private currentAudio: HTMLAudioElement | null = null;

    public async speak(texto: string) {
        // Para qualquer áudio anterior
        this.stop();

        var options = {
            provider: "openai",
            model: "gpt-4o-mini-tts",
            voice: "sage",
            response_format: "mp3",
            instructions: "Deve ser o narrador de uma história medieval de fantasia. Coloque um entonação sombria, falas pausadas e dramaticas."
        };

        console.log(options);

        const result = await puter.ai.txt2speech(texto, options);

        // Em WebView o Puter retorna um Audio
        if (result instanceof HTMLAudioElement) {
            this.currentAudio = result;
            result.play();
        }
    }

    public stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }
}