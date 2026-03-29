import { StoryBlock } from "./story-block";

export class Story {
    id: number;
    name: string;
    voice: string;
    blocks: StoryBlock[];
    isSubStory: boolean;

    constructor(id: number, name: string, voice: string, blocks: StoryBlock[], isSubStory?: boolean) {
        this.id = id;
        this.name = name;
        this.voice = voice;
        this.blocks = blocks;
        this.isSubStory = isSubStory ?? false;
    }
}