import { Injectable } from "@angular/core";

declare const puter: any;

@Injectable({
  providedIn: 'root'
})
export class TtsService {

    private generationPath = "/assets/sounds/";
    private currentAudio: HTMLAudioElement | null = null;

    public async speak(text: string, storyId: number, storyBlockId: number, voice: string) {
        let path = this.generationPath + storyId + "/" + storyBlockId + ".mp3";

        try {
            console.log("Buscando audio em: " + path);
            let localAudio = await this.audioExists(path);
            await this.playFromBlob(localAudio)
        } catch {
            console.log("Audio não existe");
            await this.generate(text, storyBlockId, voice);
        }
    }

    public stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    async generate(text: string, blockId: number, voice: string) {
        console.log("Iniciando geração");
        this.stop();

        var options = {
            provider: "openai",
            model: "gpt-4o-mini-tts",
            voice: voice,
            response_format: "mp3",
            instructions: `Você é um narrador imersivo de RPG de mesa em português brasileiro. Estilo sombrio e cinematográfico, como contador de histórias à beira da fogueira.
Ritmo: Velocidade moderada. Pausas naturais em vírgulas e pontos finais. Reticências (...) e travessões (—) indicam suspense ou ênfase — faça uma pausa dramática antes de continuar. Exclamações recebem entusiasmo controlado, sem gritar. Em frases longas, respire entre orações. Alongue sílabas em revelações e momentos de tensão; acelere levemente em cenas de ação. Entre parágrafos, faça uma pausa mais longa.
Entonação: Tom grave e misterioso na narrativa descritiva. Mais presente e urgente em diálogos (texto entre aspas) — mude sutilmente a voz para diferenciar personagens do narrador. Antes de revelações, baixe o tom e fale mais devagar para criar suspense.
Qualidade: Articule nomes e lugares com clareza. Evite soar robótico, apressado ou monótono. Cada frase deve construir atmosfera. Varie a intensidade de forma sutil, sem exageros. Soe sempre como alguém vivendo a história, não apenas lendo. Travessões (—) marcam uma pausa breve e dramática. Pontos de exclamação pedem ênfase, mas sem gritar.`
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