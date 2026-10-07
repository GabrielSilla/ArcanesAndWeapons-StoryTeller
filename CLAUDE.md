# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é isso

Um port de um RPG de mesa (criado pelo dono do repositório) para Angular + Capacitor. O plano de longo prazo é ter dois apps — um app de Mestre e um app de Jogador — mas por enquanto só existe o **app do Mestre**. Ele permite que um mestre humano escolha uma campanha e conduza combates sorteando cartas de monstro e controlando HP.

O jogo está em transição de um formato de **leitura de história bloco a bloco** (com narrador/TTS) para um formato de **tabuleiro**: a campanha é um mapa com nodes (batalha, descanso, tesouro, bifurcação, chefe) desenhados sobre uma arte de fundo, e o grupo rola um d6 para andar pelo mapa. A primeira campanha ("A Maldição da Floresta Sussurrante") já roda nesse formato; o narrador/TTS foi removido do projeto. As outras campanhas ainda existem como dados no formato antigo (bloco a bloco), mas estão **desabilitadas** no seletor (`Stories.enabledStoryIds`) até serem portadas para tabuleiro.

## Comandos

```bash
npm start              # ng serve — servidor de desenvolvimento
npm run build          # ng build (configuração production por padrão)
npm run watch          # ng build --watch --configuration development
npm test               # ng test — executa o builder de testes do Angular (Vitest por baixo)
```

Atualmente só existe um arquivo de spec (`src/app/app.spec.ts`); ainda não há um padrão documentado para rodar um teste específico isoladamente.

### Build para Android

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug   # gradlew.bat no Windows
```

O APK de debug fica em `android/app/build/outputs/apk/debug/app-debug.apk`. O `android/build.gradle` fixa `compileOptions` em Java 17 nos subprojetos `com.android.library`/`com.android.application`, já que o `@capacitor/android` normalmente exige Java 21.

## Arquitetura

**Componentes standalone do início ao fim, sem NgModules.** O `app.config.ts` registra o router e o `IonicModule.forRoot()` via `importProvidersFrom`. O `app.routes.ts` fica propositalmente vazio — não há navegação baseada em rotas; cada tela é um componente mostrado/escondido via signals na árvore de componentes raiz.

**O estado é feito com signals puros do Angular, sem lib de store.** Cada componente guarda seu próprio `signal(...)` e o muta com `.set()`/`.update()`. Não existe um serviço de estado global além do `MusicService`.

### Fluxo de componentes

- [app.ts](src/app/app.ts) — shell raiz. Controla a sequência de animação do splash/logo, trava a orientação de tela em landscape e ativa o `KeepAwake` em plataformas nativas (`Capacitor.isNativePlatform()`), e guarda o signal da imagem de fundo atual (`bgN`), que os componentes em `game-components` atualizam através do output `bgChange`.
- [game.ts](src/app/game-components/game.ts) (`Game`) — o orquestrador central. Controla a rolagem de dados, a seleção de dificuldade e todo o estado de monstros/combate, além de dois modos de progressão de campanha:
  - **Tabuleiro** (`board()`/`boardNodeId()`, etc.) — quando a `Story` selecionada tem um `board: StoryBoard`. `rollMovement()` rola o d6 e anima o token andando node por node (`moveBy`); o grupo só para de fato (`arriveAtNode`) ao esgotar os passos ou ao cair num node de parada obrigatória (`BOARD_FORCED_STOPS`: `rest`/`reward`/`fork`/`gate`/`boss`) — passos excedentes são perdidos, não acumulam pra próxima rolada. Num node `fork`, `askBoardChoice` pausa esperando o `boardChoose()` do jogador antes de continuar.
  - **Bloco a bloco** (legado) — `storyNext()`/`storyPrevious()`/`decisionChoice()` avançam por `StoryBlock`s sequenciais, com `blockType: 'decision'` abrindo o modal de decisão (`modalDecisionData`).
- `game-components/*` — `init-screen`, `story-selector`, `difficulty-selector`, `messages` (renderiza o texto narrativo do bloco de história atual), `board` (desenha o mapa + nodes + token do tabuleiro), `rules`/`rules-modal` (referência estática das regras). Em geral são peças de UI "burras" guiadas pelos signals e eventos `@Output()` do `Game`.

### Modelo de conteúdo/história (`src/app/static/`)

- [story.ts](src/app/static/story.ts) / [story-block.ts](src/app/static/story-block.ts) — modelo de dados legado. Uma `Story` é uma lista ordenada de `StoryBlock`s (opcionalmente com um `board: StoryBoard` — ver abaixo). Um bloco é do tipo `blockType: 'narrative'` (texto narrativo + encontro de monstro opcional) ou `'decision'` (apresenta `DecisionOption[]`, cada uma apontando para um `targetStoryId` para ramificar a narrativa — ver `Game.decisionChoice`).
- [stories.ts](src/app/static/stories.ts) — as aventuras (dados de conteúdo, não lógica). `Stories.enabledStoryIds` é a allowlist do que aparece no seletor; `selectableStories` filtra por isso e por `!isSubStory`. Hoje só o id `1` está habilitado — as demais (incluindo a árvore de sub-histórias ramificadas "A Encruzilhada das Almas", ids 4/101-143) continuam no arquivo mas ficam fora do seletor até ganharem tabuleiro.
- [board.ts](src/app/static/board.ts) / `boards/*.board.ts` (ex.: [whispering-forest.board.ts](src/app/static/boards/whispering-forest.board.ts)) — modelo e dados do **tabuleiro**: `StoryBoard` tem uma ou mais `BoardMapArt` (imagem + dimensões em pixels da arte), uma lista de `BoardNode` (`id`, `map`, posição `x`/`y` nas mesmas unidades da arte, `type`, `monsterType`/`level` quando aplicável, e `next: string[]` — mais de um id em `next` é uma bifurcação, com `labels` descrevendo cada opção). Node types: `start`/`safe`/`battle`/`rest`/`reward`/`fork`/`gate`/`boss` (`safe` = trecho sem combate, ex. dentro de uma vila). O deslocamento entre dois nodes "que importam" é modelado como uma cadeia de nodes `battle`/`safe` comuns (não como peso numa aresta) — por isso uma campanha de tabuleiro tem dezenas de `BoardNode`, a maioria só repetindo o tipo/monstro do trecho pra controlar quantos nodes um d6 consegue atravessar de uma vez. **O processo completo de criar/editar um tabuleiro (medir coordenadas, bifurcações, subdivisão automática por `SPACING`, cálculo de `monsterType`/`level`, o script gerador) está documentado em [BOARD_NODES_SPEC.md](BOARD_NODES_SPEC.md) — leia-o antes de criar ou alterar um `.board.ts`.**
- [card-model.ts](src/app/static/card-model.ts) / [cards.ts](src/app/static/cards.ts) — dados das cartas de monstro/boss: mais de 150 entradas de `CardModel` agrupadas por `monsterType` (`woods`, `caves`, `ruins`, `undead`, `mountains`), além de um baralho separado de `bosses`. `shouldIncrementLevel` controla se o ataque exibido da carta escala com o nível do bloco (`Game.getMonsterAttack`).
- [difficulty.ts](src/app/static/difficulty.ts) — os quatro `DifficultyId`s (`easy`/`normal`/`hard`/`nightmare`) e seus multiplicadores de HP por nível e faixas de quantidade de monstros sorteados. `Game.cloneMonsterWithEncounterHp` é onde o HP base de uma carta é escalado: `baseHp + hpPerLevel(difficulty) * level + bossHpModifier` (o `level` e o `bossHpModifier` vêm do `StoryBlock` ou, em modo tabuleiro, do `BoardNode`/`StoryBoard.bossId` equivalentes montados em `Game.arriveAtNode`).
- [monster-summons.ts](src/app/static/monster-summons.ts) — um mapa de id-do-monstro → ids-de-monstros-invocados, para cartas que trazem aliados junto quando sorteadas. Aplicado recursivamente em `Game.spawnMonsterById`/`pickAMonster`, apenas em encontros que não são de chefe.

Ao adicionar uma campanha em formato de tabuleiro, siga o passo a passo do `BOARD_NODES_SPEC.md` (seção 9): desenhar o layout em [tools/node-map-preview](tools/node-map-preview/index.html) com `add()`/`chain()`/`fork()`, ajustar `SPACING`, e gerar o array de nodes com `node tools/node-map-preview/generate-board-data.js <arquivo .board.ts>` (o script calcula `monsterType` por prefixo de id e `level` pela distância até o boss — ver `MONSTER_RULES`/`START_ID`/`END_ID` no topo do script). Por fim, ligar o board no 6º argumento do `new Story(...)` em `stories.ts` e incluir o id em `enabledStoryIds`. "A Cidade Onde Ninguém Dorme" já tem arte de tabuleiro em `public/assets/boards/sleepless-city/` (`cidade.png`, `tuneis.png`), mas ainda não tem `.board.ts` — é a próxima campanha a ser portada. Ao adicionar uma carta de monstro/boss, dê a ela um `id` numérico único — os ids também são usados como chaves em `monster-summons.ts` e no caso especial de revive de boss, codificado diretamente (`BOSS_ARAUTO_DO_FIM_ID` em `game.ts`).

### Áudio

- [music.service.ts](src/app/services/music.service.ts) — música ambiente. Escolhe uma faixa aleatória entre `/assets/audio/background{1..10}.mp3` (nunca repetindo a última tocada), usando uma tabela fixa de durações para saber quando avançar para a próxima faixa.
- O narrador (TTS via Puter.ai) foi **removido do projeto** — `tts.service.ts`, o toggle de narrador em `Game` e os áudios gerados em `public/assets/sounds/` não existem mais. `Story.voice` ainda é um campo do modelo de dados (histórico), mas não é mais lido por ninguém.
- `src/services/ai.service.ts` (atenção: fora de `src/app/`) está atualmente vazio, como placeholder — é onde entraria a integração planejada com Groq AI mencionada no README; ainda não está conectada ao app.

### Estilo

LESS por componente, mais variáveis/gradientes globais em `src/styles.less`. O `style_context.md` documenta em detalhe toda a paleta de cores (custom properties em OKLCH), gradientes, camadas de z-index e tempos de animação — consulte-o antes de introduzir novas cores ou camadas de overlay para manter a UI nova consistente com o tema atual de fantasia sombria/dourado envelhecido.

O `CHECKPOINT.md` documenta correções de CSS específicas para o WebView do Android já aplicadas (principalmente: evitar `anchor-center`/CSS Anchor Positioning — é frágil no WebView do Android; usar `position: fixed` + `transform: translate(-50%, -50%)` ou flex + `inset: 0` para centralizar overlays/modais).

### Capacitor

O [capacitor.config.ts](capacitor.config.ts) define `appId: com.aastorygame.app`, builda a partir de `dist/aa-game/browser` e habilita `cleartext: true`. Apenas a plataforma `android` está adicionada até o momento.
