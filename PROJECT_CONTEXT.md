# ArcanesAndWeapons-StoryTeller — Contexto do Projeto

Este documento descreve o contexto e funcionamento do projeto ArcanesAndWeapons-StoryTeller.

---

## O que é o Projeto

É um **port de um jogo de mesa RPG para smartphones**, construído com **Angular 21 + Ionic + Capacitor**. O jogo original foi criado pelo próprio desenvolvedor e está sendo adaptado para celulares.

---

## Visão Geral e Objetivo

A ideia é ter **dois aplicativos** que funcionem em conjunto:

1. **App do Mestre** — Controla as histórias, narra as cenas pre-escritas e deve integrar com **Groq AI** para trazer imersão ao jogo.
2. **App do Jogador** — Controla atributos e cartas do personagem.

**Estado atual:** Existe apenas **um app** focado no papel do **Mestre**.

---

## Funcionalidades Implementadas

### Sistema de Histórias

- **Histórias pré-escritas** organizadas em blocos (Story Blocks).
- Duas aventuras completas:
  - **"A Maldição da Floresta Sussurrante"** — Aventura em floresta amaldiçoada.
  - **"A Cidade Onde Ninguém Dorme"** — Mistério urbano na metrópole de Nova Vigília.
- Cada bloco possui: narrativa, background, tipo de monstro (woods, caves, ruins, undead, mountains), nível e flag de boss.

### Sistema de Combate e Monstros

- **Mais de 150 cartas de monstros**, em 5 categorias (floresta, cavernas, ruínas, mortos-vivos, montanhas) e 15 bosses.
- Cada monstro tem HP e ataque; HP escala com o nível do bloco da história.
- O Mestre controla HP dos monstros (adicionar/remover), que são removidos quando chegam a 0.

### Dados (Dice)

- Dados virtuais: **D20**, **D12** e **D4**, com animação ao rolar.

### Text-to-Speech (TTS)

- Narração dos blocos de história em áudio.
- Usa **Puter.ai** para gerar áudio quando o arquivo local ainda não existe.
- Voz e instruções configuráveis por história (ex.: tom sombrio e dramático).

### Música e Atmosfera

- **MusicService** para música ambiente durante a aventura.

### Experiência Mobile

- Tela travada em **landscape**.
- **KeepAwake** para evitar que a tela desligue durante o jogo.
- Tela inicial com splash e logo.

---

## Fluxo de Uso

1. **Inicialização** — Splash screen e início da música ambiente.
2. **Seleção de história** — Modal para escolher a aventura.
3. **Narração** — Mestre avança pelos blocos, lê a narrativa e ouve o TTS.
4. **Combate** — Nos blocos com monstros, o sistema embaralha e sorteia cartas; o Mestre gerencia HP.
5. **Bosses** — Blocos marcados como boss utilizam cartas especiais de chefes.
6. **Conclusão** — Ao final da história, opção de resetar.

---

## Stack Técnica

| Tecnologia | Uso |
|------------|-----|
| Angular 21 | Framework principal |
| Ionic | Componentes de UI para mobile |
| Capacitor 7 | Build nativo para Android |
| Puter.ai | Geração de áudio (TTS) |
| Vitest | Testes |

---

## O que Ainda Falta

- **Integração com Groq AI** — Mencionada no README como planejada, não implementada.
- **App do jogador** — Segundo aplicativo previsto para controlar personagens.
- Rotas configuradas em `app.routes.ts`, mas `routes` está vazio — a navegação é feita via componentes exibidos diretamente na tela principal.

---

## Estrutura de Arquivos Relevantes

- `src/app/game-components/game.ts` — Componente principal do jogo.
- `src/app/static/stories.ts` — Definição das aventuras.
- `src/app/static/cards.ts` — Definição das cartas de monstros e bosses.
- `src/app/services/tts.service.ts` — Serviço de Text-to-Speech.
- `src/app/services/music.service.ts` — Serviço de música.
- `capacitor.config.ts` — Configuração do Capacitor para builds nativos.

---

*Documento gerado com base na análise do código do projeto.*


## Vozes disponíveis para geração!

alloy	- Padrão, neutra
ash -	Masculina, grave
ballad - Narrativa, acolhedora
coral	- Feminina, clara
echo - Neutra, limpa
fable -	Narrativa, mais dramática
nova -	Feminina, amigável
onyx - Masculina, profunda
sage - Narrativa, sombria
shimmer - Feminina, suave
