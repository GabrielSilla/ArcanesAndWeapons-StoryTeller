export type DifficultyId = 'easy' | 'normal' | 'hard' | 'nightmare';

/** HP adicionado por ponto de nível do bloco da história (multiplicador × nível). */
export const HP_PER_LEVEL_BY_DIFFICULTY: Record<DifficultyId, number> = {
    easy: 1,
    normal: 3,
    hard: 5,
    nightmare: 8
};

export function hpPerLevelFor(id: DifficultyId): number {
    return HP_PER_LEVEL_BY_DIFFICULTY[id];
}

/** Quantidade de monstros sorteados do baralho em encontros comuns (min/max inclusivos). */
export const MONSTER_PICK_COUNT_RANGE_BY_DIFFICULTY: Record<
    DifficultyId,
    { min: number; max: number }
> = {
    easy: { min: 1, max: 5 },
    normal: { min: 2, max: 5 },
    hard: { min: 2, max: 6 },
    nightmare: { min: 3, max: 7 }
};

export function randomMonsterPickCountFor(id: DifficultyId): number {
    const { min, max } = MONSTER_PICK_COUNT_RANGE_BY_DIFFICULTY[id];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface DifficultyOption {
    id: DifficultyId;
    label: string;
    description: string;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
    {
        id: 'easy',
        label: 'Fácil',
        description:
            'Monstros ganham +1 de HP por nível do encontro (padrão clássico). Encontros comuns: de 1 a 5 monstros.'
    },
    {
        id: 'normal',
        label: 'Normal',
        description:
            'Monstros ganham +3 de HP por nível do encontro. Encontros comuns: de 2 a 5 monstros.'
    },
    {
        id: 'hard',
        label: 'Difícil',
        description:
            'Monstros ganham +5 de HP por nível do encontro. Encontros comuns: de 2 a 6 monstros.'
    },
    {
        id: 'nightmare',
        label: 'Pesadelo',
        description:
            'Monstros ganham +8 de HP por nível do encontro. Encontros comuns: de 3 a 7 monstros.'
    }
];

export function isDifficultyId(value: string | null): value is DifficultyId {
    return value === 'easy' || value === 'normal' || value === 'hard' || value === 'nightmare';
}
