export type DifficultyId = 'easy' | 'normal' | 'hard' | 'nightmare';

/** HP adicionado por ponto de nível do bloco da história (multiplicador × nível). */
export const HP_PER_LEVEL_BY_DIFFICULTY: Record<DifficultyId, number> = {
    easy: 1,
    normal: 3,
    hard: 5,
    nightmare: 10
};

export function hpPerLevelFor(id: DifficultyId): number {
    return HP_PER_LEVEL_BY_DIFFICULTY[id];
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
        description: 'Monstros ganham +1 de HP por nível do encontro (padrão clássico).'
    },
    {
        id: 'normal',
        label: 'Normal',
        description: 'Monstros ganham +3 de HP por nível do encontro.'
    },
    {
        id: 'hard',
        label: 'Difícil',
        description: 'Monstros ganham +5 de HP por nível do encontro.'
    },
    {
        id: 'nightmare',
        label: 'Pesadelo',
        description: 'Monstros ganham +10 de HP por nível do encontro.'
    }
];

export function isDifficultyId(value: string | null): value is DifficultyId {
    return value === 'easy' || value === 'normal' || value === 'hard' || value === 'nightmare';
}
