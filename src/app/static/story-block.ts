export interface DecisionOption {
    label: string;
    targetStoryId: number;
}

export class StoryBlock {
    id: number;
    title: string;
    narrative: string;
    background: string;
    monsterType: string;
    level: number;
    boss: boolean;
    blockType: 'narrative' | 'decision';
    decisionOptions: DecisionOption[];
    /** Quando definido e boss=true, força a carta do boss pelo id (ex: 7 = Drácula) */
    bossId?: number;
    /** Quando definido e boss=true, modifica HP do boss: negativo = enfraquece, positivo = fortalece. */
    bossHpModifier?: number;

    constructor(
        id: number,
        title: string,
        narrative: string,
        background: string,
        monsterType: string,
        level: number,
        boss: boolean,
        blockType?: 'narrative' | 'decision',
        decisionOptions?: DecisionOption[],
        bossId?: number,
        bossHpModifier?: number
    ) {
        this.id = id;
        this.title = title;
        this.narrative = narrative;
        this.background = background;
        this.monsterType = monsterType;
        this.level = level;
        this.boss = boss;
        this.blockType = blockType ?? 'narrative';
        this.decisionOptions = decisionOptions ?? [];
        this.bossId = bossId;
        this.bossHpModifier = bossHpModifier;
    }
}