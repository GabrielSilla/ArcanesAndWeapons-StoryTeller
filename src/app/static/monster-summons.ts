/**
 * Monstros invocados quando outro entra em campo (apenas encontros comuns, não chefes).
 * Chave = id da carta que invoca; valor = ids das cartas a adicionar à mesa.
 */
export const MONSTER_SUMMONS: Readonly<Record<number, readonly number[]>> = {
    108: [112], // Necromante → Zumbi Lento

    //BOSS
    10003: [102, 102]
};

export function getSummonsForMonster(monsterId: number): readonly number[] {
    return MONSTER_SUMMONS[monsterId] ?? [];
}
