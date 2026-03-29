# Ideias de Novas Aventuras

Documento com sugestões de histórias para o ArcanesAndWeapons-StoryTeller. Todas seguem a estrutura de blocos narrativos, combates com monstros e bosses.

---

## ✅ 1. O Naufrágio do Gargoyle — **Implementada**

**Status:** Pronta no jogo. Áudios gerados.

**Ambiente:** Ilha deserta, ruínas costeiras, cavernas marinhas  
**Tom:** Sobrevivência + mistério  

- Naufrágio em ilha misteriosa
- Blocos: `woods` (floresta tropical), `caves` (cavernas marinhas), `ruins` (forte antigo), `undead` (corrompidos)
- Boss: Sentinela das Profundezas
- Backgrounds: forest, tower, cave, towertop, village

---

## 2. A Prisão dos Sonhos Perdidos

**Ambiente:** Prisão abandonada, masmorras, plano onírico  
**Tom:** Horror psicológico + dungeon crawl  

- Personagens acordam numa prisão sem memória
- `undead` e `ruins` para guardas e fantasmas
- `caves` nos túneis de fuga
- Boss: carcereiro ou entidade dos pesadelos
- Backgrounds: cave, tower, citytunnels

---

## 3. O Colapso das Minas de Keldrum

**Ambiente:** Minas, cidades anãs, vulcão  
**Tom:** Aventura subterrânea  

- Minas anãs tomadas por criaturas após desabamento
- `caves` e `mountains` predominantes
- `undead` se houver desastre magístico
- Boss: dragão ou demônio subterrâneo
- Backgrounds: cave, forge, mountains

---

## 4. O Concílio das Bruxas

**Ambiente:** Pântano, torre, floresta sagrada  
**Tom:** Mistério + bruxaria  

- Aldeias assombradas por concílio de bruxas
- `woods` (floresta, pântano) e `mountains`
- `undead` se houver necromancia
- Boss: Matriarca das Bruxas ou criatura invocada
- Backgrounds: forest, tower, village, cave

---

## 5. A Última Caravana

**Ambiente:** Estrada, deserto, oásis, fortaleza  
**Tom:** Aventura de viagem  

- Proteger caravana até santuário distante
- `mountains` (passagens), `ruins` (postos abandonados), `woods` (trechos de floresta)
- Boss: líder de saqueadores ou besta do deserto
- Backgrounds: village, mountains, city, forge

---

## 6. O Sangue dos Antigos

**Ambiente:** Templo, catacumbas, biblioteca proibida  
**Tom:** Arqueologia + horror cósmico  

- Expedição a ruínas de civilização antiga
- `undead` (maldição), `ruins`, `caves`
- Boss: avatar ou servidor dos Antigos
- Backgrounds: cave, tower, citytunnels, mansion

---

## 📜 Histórias com Ramificações (Decisões)

Histórias onde as escolhas dos jogadores influenciam o rumo da narrativa. Em momentos-chave, um **modal de decisão** é exibido; cada escolha carrega um **Story** separado como ramificação, mantendo a complexidade sob controle.

### Proposta Técnica

**1. StoryBlock de Decisão**
- Novo tipo: `blockType: 'narrative' | 'decision'` (default `'narrative'`)
- Quando `blockType === 'decision'` → exibe modal com opções em vez de avançar
- Array de opções: `decisionOptions?: { label: string; targetStoryId: number }[]`

**2. Story com flag `isSubStory`**
- `Story` ganha `isSubStory?: boolean` (default `false`)
- SubStories **não aparecem** no menu de seleção
- Carregadas apenas via decisão: `stories.filter(s => !s.isSubStory)` no seletor

**3. Fluxo**
```
Story principal (visível no menu)
  → Blocos normais...
  → StoryBlock DECISÃO → Modal (Opção A | B | C)
       → Escolha A → loadStory(targetStoryId A) — isSubStory: true
       → Escolha B → loadStory(targetStoryId B) — isSubStory: true
       → Escolha C → loadStory(targetStoryId C) — isSubStory: true
  → Cada ramificação é um Story completo (blocos + combates + boss + epílogo)
```

### Extensões nos Modelos (sugestão)

**Story:**
```typescript
isSubStory?: boolean;  // default: false. Se true, não aparece no seletor.
```

**StoryBlock:**
```typescript
blockType?: 'narrative' | 'decision';  // default: 'narrative'
decisionOptions?: { label: string; targetStoryId: number }[];
```

---

### 7. A Encruzilhada das Almas

**Ambiente:** Encruzilhada mística, três caminhos, névoa  
**Tom:** Escolha moral + fantasia sombria  
**Tipo:** Ramificada (1 decisão → 3 finais)

**Sinopse:** O grupo chega a uma encruzilhada envolta em névoa sob lua sangrenta. Três caminhos se abrem: à esquerda, floresta que sussurra; à frente, ruínas de pedra antiga; à direita, vila abandonada. Uma voz ecoa: *"Escolham. Cada caminho guarda uma verdade... e um preço."*

**Story principal** (aparece no menu):

| Bloco | Tipo | Conteúdo |
|-------|------|----------|
| 1 | narrative | Prólogo — chegada à encruzilhada, descrição dos três caminhos |
| 2 | **decision** | Modal: "Qual caminho seguir?" → [Floresta Sombria \| Ruínas Antigas \| Vila Amaldiçoada] |

**SubStories** (isSubStory: true):

| targetStoryId | Nome | Monstros | Boss |
|---------------|------|----------|------|
| 101 | O Caminho da Floresta | woods, caves | Espírito da Floresta Corrompida |
| 102 | O Caminho das Ruínas | ruins, undead | Lich das Colunas |
| 103 | O Caminho da Vila | ruins, undead | Senhor das Trevas |

Cada ramificação: ~8–12 blocos, combates, descansos, boss, epílogo próprio.

---

### 8. O Traidor na Torre

**Ambiente:** Torre do Conselho, festa nobre, assassinato  
**Tom:** Mistério + traição (whodunit)  
**Tipo:** Ramificada (1 decisão → 3 finais)

**Sinopse:** Durante um baile na Torre do Véu, um nobre é envenenado. Três suspeitos: o Capitão da Guarda, a Feiticeira Real e o Mordomo. O grupo investiga pistas e combates menores — mas o tempo é curto. Ao final da fase, precisam **acusar alguém** perante o Conselho. A acusação define o rumo; acusar errado traz consequências terríveis.

**Story principal** (aparece no menu):

| Bloco | Tipo | Conteúdo |
|-------|------|----------|
| 1–3 | narrative | Prólogo: assassinato, cena do crime, três suspeitos |
| 4–6 | narrative | Investigação: pistas, interrogatórios, combates (ruins) |
| 7 | **decision** | Modal: "Quem vocês acusam?" → [O Capitão \| A Feiticeira \| O Mordomo] |

**SubStories** (isSubStory: true):

| targetStoryId | Nome | O que acontece | Boss |
|---------------|------|---------------|------|
| 201 | A Injustiça ao Capitão | Acusaram errado — inocente executado, traidor escapa e volta | Espectro do Traidor |
| 202 | A Conspiradora | Feiticeira era culpada — ritual, confronto nas masmorras | Demônio Invocado |
| 203 | O Servo das Sombras | Mordomo era culpado — identidade secreta revelada | Assassino Mascarado |

*Simplificação: 3 ramificações (1 correta, 2 incorretas com final similar de "traidor revelado"). Ou 3 finais distintos por suspeito.*

**Diagrama:**
```
[Encruzilhada]          [Traidor na Torre]
     │                          │
     ▼                    [Investigação]
[Decisão]                        │
  ┌──┼──┐                        ▼
  ▼  ▼  ▼                   [Decisão]
[F][R][V]                    ┌───┼───┐
                              ▼   ▼   ▼
                           [Cap][F][Mor]
```

---

## Resumo de Tipos de Monstro por História

| História                 | woods | caves | ruins | undead | mountains |
|--------------------------|-------|-------|-------|--------|-----------|
| O Naufrágio do Gargoyle  | ✅    | ✅    | ✅    | ✅     | —         |
| A Prisão dos Sonhos     | —     | ✅    | ✅    | ✅     | —         |
| O Colapso das Minas      | —     | ✅    | —     | ?      | ✅        |
| O Concílio das Bruxas    | ✅    | —     | —     | ?      | ✅        |
| A Última Caravana        | ✅    | —     | ✅    | —      | ✅        |
| O Sangue dos Antigos     | —     | ✅    | ✅    | ✅     | —         |

---

## Backgrounds Disponíveis no Projeto

- `portal`, `village`, `forest`, `cave`, `city`, `tower`, `towertop`, `citytunnels`, `forge`, `mansion`, `mountains`
