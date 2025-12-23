import { StoryBlock } from "./story-block";

export class Story {
    id: number;
    name: string;
    voice: string;
    blocks: StoryBlock[];

    constructor(id: number, name: string, voice: string, blocks:  StoryBlock[]) {
        this.id = id;
        this.name = name;
        this.voice = voice;
        this.blocks = blocks;
    }
}