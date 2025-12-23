import { Injectable } from "@angular/core";

declare const puter: any;

@Injectable({
  providedIn: 'root'
})
export class TtsService {

    private generationPath = "/assets/sounds/";
    private currentAudio: HTMLAudioElement | null = null;

    public async speak(text: string, storyId: number, storyBlockId: number) {
        let path = this.generationPath + storyId + "/" + storyBlockId + ".mp3";

        try {
            console.log("Buscando audio em: " + path);
            let localAudio = await this.audioExists(path);
            await this.playFromBlob(localAudio)
        } catch {
            console.log("Audio não existe");
            await this.generate(text, storyBlockId);
        }
    }

    public stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    async generate(text: string, blockId: number) {
        console.log("Iniciando geração");
        this.stop();

        var options = {
            provider: "openai",
            model: "gpt-4o-mini-tts",
            voice: "sage",
            response_format: "mp3",
            instructions: "Deve ser o narrador de uma história medieval de fantasia. Coloque um entonação sombria, falas pausadas e dramaticas."
        };

        const result: HTMLAudioElement = await puter.ai.txt2speech(text, options);
        var blob = this.base64AudioToBlob(result);
        this.saveBlob(blob, blockId);

        await this.playFromBlob(blob);
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
        audio.volume = 1.0;

        audio.onended = () => {
            URL.revokeObjectURL(url); // evita vazamento de memória
        };

        this.currentAudio = audio;
        await audio.play();
    }

    base64AudioToBlob(audio: HTMLAudioElement): Blob {
        const src = audio.src;

        if (!src.startsWith('data:audio')) {
            throw new Error('Audio não é base64');
        }

        const [meta, base64] = src.split(',');
        const mime = meta.match(/data:(.*);base64/)?.[1] || 'audio/mpeg';

        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return new Blob([bytes], { type: mime });
    }

    saveBlob(blob: Blob, blockId: number) {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = blockId + ".mp3";
        a.click();

        URL.revokeObjectURL(url);
    }
}