export class StoryBlock {
    id: number;
    title: string;
    narrative: string;
    background: string;
    monsterType: string;
    level: number;
    boss: boolean;

    constructor(id: number, title: string, narrative: string, background: string, monsterType: string, level: number, boss: boolean) {
        this.id = id;
        this.title = title;
        this.narrative = narrative;
        this.background = background;
        this.monsterType = monsterType;
        this.level = level;
        this.boss = boss;
    }
}