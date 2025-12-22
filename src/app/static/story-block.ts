export class StoryBlock {
    title: string;
    narrative: string;
    background: string;
    monsterType: string;
    level: number;
    boss: boolean;

    constructor(title: string, narrative: string, background: string, monsterType: string, level: number, boss: boolean) {
        this.title = title;
        this.narrative = narrative;
        this.background = background;
        this.monsterType = monsterType;
        this.level = level;
        this.boss = boss;
    }
}