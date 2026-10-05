import { StoryBoard } from "./board";
import { StoryBlock } from "./story-block";

export class Story {
    id: number;
    name: string;
    voice: string;
    blocks: StoryBlock[];
    isSubStory: boolean;
    /** Quando definido, a campanha é jogada no tabuleiro em vez de pelos blocos narrativos. */
    board?: StoryBoard;

    constructor(id: number, name: string, voice: string, blocks: StoryBlock[], isSubStory?: boolean, board?: StoryBoard) {
        this.id = id;
        this.name = name;
        this.voice = voice;
        this.blocks = blocks;
        this.isSubStory = isSubStory ?? false;
        this.board = board;
    }
}
