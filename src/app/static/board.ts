/** Tipo do deck de monstros sorteado em um node de batalha (mesmos decks de `Cards`). */
export type MonsterType = 'woods' | 'caves' | 'ruins' | 'undead' | 'mountains' | '';

export type BoardNodeType = 'start' | 'safe' | 'battle' | 'rest' | 'reward' | 'fork' | 'gate' | 'boss';

export interface BoardNode {
    id: string;
    /** id da arte (`BoardMapArt.id`) em que o node está desenhado */
    map: string;
    /** posição em unidades da arte (`BoardMapArt.width` x `BoardMapArt.height`) */
    x: number;
    y: number;
    type: BoardNodeType;
    /** deck de monstros do node (só em `battle`; no `boss` serve de referência) */
    monsterType: MonsterType;
    /** nível de HP do encontro (0 nos nodes sem combate) */
    level: number;
    /** nodes alcançáveis a partir deste; mais de um = bifurcação */
    next: string[];
    /** rótulo de cada opção de uma bifurcação, por id de destino */
    labels?: Record<string, string>;
}

export interface BoardMapArt {
    id: string;
    image: string;
    width: number;
    height: number;
}

export interface StoryBoard {
    maps: BoardMapArt[];
    nodes: BoardNode[];
    startNodeId: string;
    /** força a carta de chefe (id) no node `boss` */
    bossId?: number;
    /** contexto exibido ao iniciar a campanha */
    intro: string;
    /** exibido ao chegar no node `gate`; depois o grupo segue para o `next` do portão */
    gateText: string;
    restText: string;
    rewardText: string;
    /** exibido ao derrotar o chefe */
    endText: string;
}
