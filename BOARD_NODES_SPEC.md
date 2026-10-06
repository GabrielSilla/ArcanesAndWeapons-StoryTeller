# Spec dos Nodes do Tabuleiro

Como os nodes do tabuleiro foram feitos na primeira campanha, **"A Maldição da Floresta Sussurrante"**, e como repetir o processo nas próximas.

---

## 1. Visão geral

- A campanha é jogada num **tabuleiro**: a arte do mapa é o fundo e os **nodes** ficam por cima.
- O grupo rola um **d6** e anda essa quantidade de nodes. Só o node onde o movimento termina dispara o evento.
- Cada campanha tem **dois mapas** (superfície e catacumbas), ligados por um node `gate`.
- O layout é desenhado numa ferramenta de preview (`tools/node-map-preview`) e depois convertido num arquivo de dados do jogo por um script.

### Arquivos

| Arquivo | Papel |
|---|---|
| `public/assets/boards/<campanha>/*.webp` ou `*.png` | Artes dos mapas (16:9) |
| `tools/node-map-preview/index.html` | Preview: onde os nodes são desenhados, arrastados e simulados |
| `tools/node-map-preview/generate-board-data.js` | Gera a lista de nodes (com `monsterType` e `level`) no arquivo da campanha |
| `src/app/static/board.ts` | Tipos: `BoardNode`, `BoardNodeType`, `BoardMapArt`, `StoryBoard`, `MonsterType` |
| `src/app/static/boards/whispering-forest.board.ts` | Dados da primeira campanha (nodes, mapas e textos) |
| `src/app/game-components/board/` | Componente que desenha a arte, os nodes e o token |
| `src/app/game-components/game.ts` | Regras de movimento e eventos dos nodes |

---

## 2. Modelo de dados

```ts
interface BoardNode {
    id: string;
    map: string;                    // id da arte: 'sup' ou 'tomb'
    x: number; y: number;           // posição no espaço 2000x1115 da arte
    type: BoardNodeType;
    monsterType: MonsterType;       // deck de monstros (só em battle; no boss é referência)
    level: number;                  // nível de HP do encontro (0 sem combate)
    next: string[];                 // próximos nodes; mais de um = bifurcação
    labels?: Record<string, string> // rótulo de cada opção da bifurcação
}
```

### Tipos de node

| Tipo | Cor | Raio | Parada obrigatória | O que acontece ao parar |
|---|---|---|---|---|
| `start` | branco | 14 | não | nada (marca o início do mapa) |
| `safe` | cinza | 10 | não | nada (vila: sem batalha) |
| `battle` | vermelho | 10 | não | sorteia monstros do deck `monsterType`, com HP do `level` |
| `rest` | verde | 13 | **sim** | texto de descanso |
| `reward` | dourado | 14 | **sim** | texto de tesouro (itens extras; as batalhas já dão itens) |
| `fork` | roxo | 14 | **sim** | abre o modal de escolha de caminho |
| `gate` | laranja | 16 | **sim** | texto de transição, depois o grupo vai para o `next[0]` (outro mapa) |
| `boss` | rosa | 20 | **sim** | carta de chefe (`StoryBoard.bossId`); ao vencer, texto final |

Raios e cores estão em `NODE_LOOK` (`board.ts` do componente) e em `TYPES` (preview). Parada obrigatória: `BOARD_FORCED_STOPS` em `game.ts`.

---

## 3. Sistema de coordenadas

- As artes têm **1678×937 px**. Os nodes são **medidos nesses pixels** e o preview converte para o espaço de trabalho **2000×1115** em `add()`:
  `x = round(x * 2000 / 1678)`, `y = round(y * 1115 / 937)`.
- O espaço 2000×1115 é o `viewBox` do SVG do tabuleiro (`BoardMapArt.width/height`). O desvio de proporção entre os dois (0,16%) é invisível.
- Como medir: abrir a arte (ou um recorte dela) em tamanho real e anotar os pixels dos pontos do caminho. Recortes de uns 900×900 px ajudam a enxergar as trilhas.

---

## 4. Como o layout da primeira campanha foi feito

O desenho dos caminhos vem da própria arte: **os nodes seguem as trilhas pintadas**. Onde a trilha se bifurca, há um `fork`; onde ela se reencontra, os dois ramos terminam no mesmo node.

### 4.1 Superfície (70 nodes)

```
S01 (início, dentro da vila)
 └─ A01..A07 (safe)  contorno da cerca pelo oeste e pelo sul
     └─ A08..A13      trilha ao sul da cerca (primeira batalha: A08)
         └─ S03 [fork]  portão leste da vila
             ├─ SS1..SS5   margem sul do lago (curta) ──────────────┐
             └─ N01..N18   margem oeste e norte do lago (longa)      │
                 N05 = descanso, N18 = tesouro ─────────────────────┤
                                                                     ▼
                                                            M01 (descanso) junto à muralha
                                                              └─ E01..E05 contorno obrigatório da muralha sul
                                                                  └─ E06 [fork]
                                                                      ├─ B01..B04  escada do muro (direto) ─┐
                                                                      └─ T01..T04 → T03r, T02r, T01r (volta)│
                                                                          T04 = tesouro, T02r = descanso    │
                                                                          (a volta termina em B01) ─────────┤
                                                                                                            ▼
                                                                                                   G01 [gate] diante do portão da tumba
```

| Região | Ids | Observação |
|---|---|---|
| Vila | `S01`, `A01`–`A07` | `safe`: sem batalhas dentro da vila |
| Trilha da vila | `A08`–`A13` | primeira batalha, fora da cerca |
| Fork inicial | `S03` | curta (`SS*`) ou longa (`N*`, com descanso e tesouro) |
| Margem sul | `SS1`–`SS5` | curta, sem recompensas |
| Margem norte | `N01`–`N18` | longa; `N05` descanso, `N18` tesouro |
| Entrada das ruínas | `M01` | descanso; o muro **fecha** a porta oeste, o contorno é obrigatório |
| Contorno da muralha | `E01`–`E05` | corredor sem escolha |
| Fork da muralha | `E06` | escada (direto) ou trilha sul (ida e volta) |
| Escada do muro | `B01`–`B04` | leva ao portão |
| Trilha sul | `T01`–`T04`, `T03r`–`T01r` | **desvio de ida e volta pelo mesmo caminho** |
| Portão | `G01` | `gate`; leva a `K01` nas catacumbas |

**Ida e volta (`T`)**: a trilha sul é um beco sem saída. Ida: `T01→T04` (tesouro no fim). Volta: `T03r→T01r`, com os mesmos pontos **deslocados cerca de 28 px em x** (para os nodes não se sobreporem). A volta termina em `B01`, de modo que as duas opções do fork se encontram na escada.

### 4.2 Catacumbas (40 nodes)

```
K01 (início) → K02..K09 (cripta e escada) → KF [fork]
   ├─ U01..U09  corredor dos nichos (curto) ──────────┐
   └─ L01..L19  caverna inferior (longa)               │
       L05 = tesouro (caixão), L08 = descanso ─────────┤
                                                        ▼
                                            M02 (descanso) → BOSS (cristal)
```

| Região | Ids | Observação |
|---|---|---|
| Cripta | `K01`–`K09` | sarcófagos e escada |
| Fork | `KF` | corredor ou caverna |
| Corredor dos nichos | `U01`–`U09` | curto |
| Caverna inferior | `L01`–`L19` | longa; tesouro no caixão (`L05`) e descanso (`L08`) |
| Plataforma do cristal | `M02`, `BOSS` | descanso antes do chefe |

### 4.3 Números finais da primeira campanha

| | Superfície | Catacumbas |
|---|---|---|
| Nodes | 70 | 40 |
| `start` / `safe` | 1 / 8 | 1 / 0 |
| `battle` | 53 | 34 |
| `rest` / `reward` | 3 / 2 | 2 / 1 |
| `fork` / `gate` / `boss` | 2 / 1 / 0 | 1 / 0 / 1 |
| Rota curta–longa (nodes) | 42–60 | 21–31 |

Rolagens esperadas (média 3,5): cerca de **18 a 26** por partida.

---

## 5. Subdivisão: como a quantidade de nodes cresce

Os nodes definidos à mão são os **pontos de passagem**. O preview insere nodes intermediários nos trechos longos para dar o ritmo do d6.

- Distância-alvo entre nodes (espaço 2000×1115): `SPACING = { sup: 48, tomb: 88 }`.
- Um trecho de comprimento `len` recebe `round(len / SPACING) - 1` nodes intermediários.
- Ids: `<origem>~<n>` (ex.: `A08~1`). São sempre `battle`, exceto entre dois nodes `safe`/`start`, que ficam `safe`.
- **Não são subdivididos**: bifurcações (nodes com mais de um `next`) e a ligação entre mapas (`G01 → K01`).
- Mexer em `SPACING` muda a densidade de todo o mapa; é o botão principal para ajustar a duração da partida.

---

## 6. `monsterType` por região

O deck sorteado vem do prefixo do id (regras em `MONSTER_RULES`, no script gerador). Vale também para os ids de subdivisão.

| Prefixo | Região | `monsterType` |
|---|---|---|
| `S`, `SS`, `N`, `A` | vila, floresta e lago | `woods` |
| `E`, `B`, `M01~` | muralhas externas e escada | `ruins` |
| `T` | trilha sul na mata | `woods` |
| `K`, `M02~`, `U` | cripta, corredor dos nichos, antessala | `undead` |
| `L` | caverna inferior | `caves` |
| `BOSS` | chefe | `undead` (referência) |

Nodes que não são `battle` têm `monsterType: ''`. Resultado na primeira campanha: `woods` 40, `ruins` 13, `undead` 17, `caves` 17.

---

## 7. `level` (HP dos monstros)

O nível cresce com o **progresso no caminho**:

```
progresso = nodes_do_início_até_aqui / (nodes_do_início_até_aqui + nodes_daqui_até_o_boss)   // menor distância
level     = clamp(1 + round(progresso * 9), 1, 10)
```

- O boss é sempre nível 10; nodes sem combate têm `level: 0`.
- Os dois ramos de uma bifurcação ficam com níveis parecidos, porque o progresso usa a menor distância.
- Distribuição na primeira campanha: superfície do nível 2 ao 7; catacumbas do 7 ao 10.
- O HP final do monstro é `HP da carta + HP por nível da dificuldade × level`.

---

## 8. Regras de movimento (no jogo)

Em `game.ts` (`rollMovement`, `moveBy`, `arriveAtNode`):

1. O d6 é rolado e mostrado sobre a tela escurecida.
2. O token anda um node por vez (animado) até esgotar os passos **ou** chegar a um node de parada obrigatória.
3. Ao chegar num `fork`, o modal de escolha abre na hora; o caminho escolhido vale para a próxima rolagem.
4. `battle`/`boss`: os monstros são sorteados e o tabuleiro escurece; o botão de rolar fica desabilitado até todos morrerem.
5. `gate`: mostra o texto de transição e move o token para `next[0]`, trocando a arte.
6. Ao derrotar o `boss`, aparece o texto final e o botão de resetar.

---

## 9. Como criar o tabuleiro de uma nova campanha

1. **Arte**: duas imagens 16:9, salvas em `public/assets/boards/<campanha>/`. A primeira campanha usa webp (qualidade 90, ~0,5 MB cada); as artes de "A Cidade Onde Ninguém Dorme" já estão em `public/assets/boards/sleepless-city/` como **PNG original** (`cidade.png`, `tuneis.png`), para manter a qualidade. O formato é livre: o arquivo `.board.ts` só aponta para o caminho da imagem.
2. **Medir os caminhos** nos pixels da arte e anotar os pontos de passagem de cada trilha, as bifurcações e onde ficam descansos e tesouros.
3. **Escrever os nodes** em `tools/node-map-preview/index.html`: blocos `add('mapa', [...])` com `[id, x, y, tipo]` e as ligações com `chain(...)` e `fork(id, [[destino, 'rótulo'], ...])`. Apontar o preview para as novas artes.
4. **Conferir no preview** (servido por `.claude/launch.json`, `node-map-preview`): marcar "editar" para arrastar nodes, ver as estatísticas e jogar o simulador.
5. **Ajustar** `SPACING` e a distribuição de descansos e tesouros.
6. **Gerar os dados**: criar o `.board.ts` da campanha (com `maps`, `startNodeId`, `bossId`, textos) contendo `const nodes: BoardNode[] = [ ];` e rodar:
   ```bash
   node tools/node-map-preview/generate-board-data.js src/app/static/boards/<campanha>.board.ts
   ```
   Antes, ajustar no topo do script `START_ID`, `END_ID` e `MONSTER_RULES` para os ids da nova campanha.
7. **Ligar à história**: passar o board no 6º argumento do `new Story(...)` em `stories.ts` e incluir o id em `enabledStoryIds`.

> O script lê o preview e reescreve **apenas** a lista de nodes do `.board.ts`. Rodá-lo sem mudar o layout produz exatamente o mesmo arquivo.

---

## 10. Armadilhas e validações

- Todo node precisa ser alcançável a partir do `START_ID` **e** alcançar o `END_ID`; o script falha com "Node fora do caminho" se não for.
- Todo node `battle` precisa de uma regra em `MONSTER_RULES`; o script falha com "Sem monsterType".
- Ids únicos por campanha. Prefixos novos exigem regra de `monsterType`.
- Os dois ramos de uma bifurcação devem se reencontrar no mesmo node (evita ramos órfãos e níveis desiguais).
- Nodes de duas rotas não devem se sobrepor na arte; na ida e volta, desloque a volta (cerca de 28 px).
- Edições por arrastar no preview ficam só na memória da página; para valer, os valores precisam ser copiados para o `index.html` (ou exportados pelo botão "Exportar JSON").
- O preview e o jogo usam o espaço 2000×1115; as coordenadas do `index.html` são em pixels da arte (1678×937) e convertidas em `add()`.
