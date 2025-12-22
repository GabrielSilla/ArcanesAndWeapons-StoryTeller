export class CardModel {
    id: number;
    name: string;
    source: string;
    hp: number;
    attack: number;
    shouldIncrementLevel: boolean = true;
    
    constructor(id: number, name: string, source: string, hp: number, attack: number, shouldIncrementLevel: boolean = true) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.hp = hp;
        this.attack = attack;
        this.shouldIncrementLevel = shouldIncrementLevel;
    }
}