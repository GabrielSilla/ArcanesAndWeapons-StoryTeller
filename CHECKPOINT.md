# Checkpoint — alterações recentes (sessões de desenvolvimento)

Este ficheiro regista mudanças relevantes no repositório para referência rápida. Atualizado em **2026-03-29**.

---

## 1. Layout e CSS (Android / WebView)

### `anchor-center` removido ou substituído
- Uso de `justify-self: anchor-center`, `align-self: anchor-center` e `place-self: anchor-center` era frágil no WebView Android (CSS Anchor Positioning).
- **Ficheiros:** `game.less`, `messages.less`, `story-selector.less`, `init-screen.less`
- **Padrão aplicado:** `position: fixed` + `transform: translate(-50%, -50%)`, ou flexbox com `inset: 0`, conforme o caso.

### Carta ampliada (`.card-view`)
- **Ficheiro:** `game.less`
- Overlay com `position: fixed`, `inset: 0`, flex para centrar imagem; fundo escuro semitransparente; `z-index: 1002`; safe-area no padding.

### Área das cartas de monstro (`.right-bottom-view`)
- **Ficheiro:** `game.less`
- `position: fixed`, `inset: 0`, flex com `align-items` / `align-content: center` para centrar o grupo de cartas no ecrã.
- `pointer-events: none` no contentor e `pointer-events: auto` nas `.card` para não bloquear dados/botões.

### Dados (`.dice-mask` / `.dice-result`)
- **Ficheiro:** `game.less`
- `.dice-mask` com overlay fixo em flex ao centro; `.dice-result` sem `anchor-center`.

### Outros blocos em `game.less`
- `.story-header`, `.story-status-view`, `.monster-random`, `.new-items`, `.story-modal`: centralização com `left/top` + `transform` ou `fixed` + centro.

### Mensagens de narrativa (`app-messages`)
- **Ficheiros:** `messages.less`, `messages.html`
- Texto da história (`.message.ft-15`): ~90% do viewport, centrado, scroll vertical, safe-area; remoção de margens fixas (100px) que deslocavam o texto.
- **Template:** `[class]="'message ft-' + size"` para garantir sempre as classes `message` e `ft-15` / `ft-25` juntas.
- Mensagens curtas (`.message.ft-25`): `max-width` limitada.

### Tela inicial (`init-screen`)
- **Ficheiro:** `init-screen.less`
- Imagem centrada com `fixed` + `transform`.

### Seletor de história
- **Ficheiro:** `story-selector.less`
- `ion-card` com `fixed` + centro via `transform`.

---

## 2. Toggle do narrador (TTS)

- **Ficheiros:** `game.html`, `game.ts`, `game.less`
- Na tela inicial (sem história selecionada), abaixo do ícone de regras: label **“Narrador”** e **`ion-toggle`** (toggle por baixo da label, em coluna).
- Clique na label chama `toggleNarrator()`; o switch usa `onNarratorChange` / `setNarratorEnabled`.
- Preferência em **`localStorage`**, chave `aa-story-narrator-enabled`.
- Em `speak()`: se o narrador estiver desligado, não chama o `TtsService`.

---

## 3. Build web (Angular)

### Orçamento de estilos de componente
- **Ficheiro:** `angular.json` (configuração `production`)
- `anyComponentStyle`: `maximumWarning` 10 kB, `maximumError` 16 kB (antes 4 kB / 8 kB), para permitir `game.less` maior sem falhar `ng build`.

---

## 4. Build Android (APK)

### Compatibilidade Java
- **Ficheiro:** `android/build.gradle`
- Bloco `subprojects { afterEvaluate { ... } }` que define `compileOptions` com **Java 17** em módulos `com.android.library` e `com.android.application`, para compilar quando o JDK não suporta **Java 21** (definida pelo `@capacitor/android` em `node_modules`).

### Comandos usados para gerar APK de debug
1. `npm run build`
2. `npx cap sync android`
3. `android\gradlew.bat assembleDebug` (a partir da pasta `android`)

### Saída do APK de debug
- `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 5. `PROJECT_CONTEXT.md`

- Mantido como visão geral do projeto; pode estar desatualizado face a funcionalidades novas (ex.: modal de decisão, regras, toggle narrador). Este **CHECKPOINT** complementa com o que foi alterado nas sessões recentes.

---

*Para o próximo checkpoint, acrescentar secção com data e lista de ficheiros/commits.*
