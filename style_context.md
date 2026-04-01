# Style Context - ArcanesAndWeapons-StoryTeller

Este documento mapeia as cores e padrões de design utilizados no projeto, organizados por sistema de cor padrão.

---

## 🎨 Sistema de Cores Identificado

### Paleta Principal: **RPG Fantasy Medieval (Terra Dourada)**

O projeto utiliza uma paleta inspirada em **ouro envelhecido, pergaminho e madeira escura**, combinada com tons sombrios de cinza e roxo místico.

---

## 📊 Cores Mapeadas

### 1. **Cores Primárias (Ion Colors)**

| Variável | Valor | RGB | Uso |
|----------|-------|-----|-----|
| `--ion-color-primary` | `#cfa86a` | `207, 168, 106` | Ícones, destaques, botões |
| `--ion-color-primary-tint` | `#dab77f` | `218, 183, 127` | Variações mais claras |
| `--ion-color-primary-shade` | `#b48f59` | `180, 143, 89` | Variações mais escuras |

---

### 2. **Cores Personalizadas (app.less)**

| Variável | Valor (OKLCH) | RGB Aproximado | Categoria |
|----------|---------------|----------------|-----------|
| `--bright-blue` | `oklch(51.01% 0.274 263.83)` | Azul ciano | Acento |
| `--electric-violet` | `oklch(53.18% 0.28 296.97)` | Roxo vibrante | Degradê |
| `--french-violet` | `oklch(47.66% 0.246 305.88)` | Roxo profundo | Degradê |
| `--vivid-pink` | `oklch(69.02% 0.277 332.77)` | Rosa vibrante | Degradê |
| `--hot-red` | `oklch(61.42% 0.238 15.34)` | Vermelho intenso | Acento |
| `--orange-red` | `oklch(63.32% 0.24 31.68)` | Laranja avermelhado | Degradê |

---

### 3. **Cores de Texto e Interface**

| Variável | Valor | Uso |
|----------|-------|-----|
| `--gray-900` | `oklch(19.37% 0.006 300.98)` | Texto principal escuro |
| `--gray-700` | `oklch(36.98% 0.014 302.71)` | Texto secundário |
| `--gray-400` | `oklch(70.9% 0.015 304.04)` | Texto claro |

---

### 4. **Cores Especiais (Modais e Overlays)**

| Cor | Valor | Uso |
|-----|-------|-----|
| `--color` | `#f7d7a8` | Texto em modais |
| `--button-color` | `#f7d7a8` | Botões em modais |
| `--background` | `rgba(35, 35, 35, 0.95)` | Fundo de modais |
| `--item-background` | `rgba(72, 72, 72, 0.95)` | Itens em modais |
| `--action-sheet-title` | `#eecda3` | Títulos de action sheet |

---

## 🌈 Degradês Oficiais

### Vertical (Portal)
```
linear-gradient(180deg, 
  var(--orange-red) 0%,
  var(--vivid-pink) 50%,
  var(--electric-violet) 100%
)
```
**Uso:** Transições dramáticas, finais de batalha, eventos especiais

### Horizontal (Interface)
```
linear-gradient(90deg, 
  var(--orange-red) 0%,
  var(--vivid-pink) 50%,
  var(--electric-violet) 100%
)
```
**Uso:** Barra de vida, status de monstro, indicadores de poder

---

## 🎭 Fontes

| Fonte | Uso | Local |
|-------|-----|-------|
| `MedievalSharpBook` | RPG medieval, títulos, interface | `/assets/font/MedievalSharp-Book.ttf` |
| `Inter` | UI geral, textos longos | Sistema |
| `Inter Tight` | Títulos grandes | Sistema |

---

## 🎯 Padrões de Design

### 1. **Modais e Overlays**
```
Fundo: rgba(35, 35, 35, 0.95)
Cor do texto: #f7d7a8 (dourado claro)
Botões: Transparente com borda dourada
Bordas: Arredondadas 20px
```

### 2. **Action Sheets**
```
Fundo: rgba(20, 20, 20, 0.95)
Títulos: #eecda3
Botões: rgba(255, 255, 255, 0.05)
Borda hover: rgba(255, 255, 255, 0.1)
Botão cancel: rgba(255, 60, 60, 0.1)
```

### 3. **Ícones e Maskes**
Todos os ícones usam `var(--ion-color-primary)` como fundo com máscara.

---

## 📸 Backgrounds Ambientais

| Classe | Imagem | Categoria |
|--------|--------|-----------|
| `.bg-portal` | `portal.jpg` | Transição/Direita |
| `.bg-city` | `city.jpg` | Urbano |
| `.bg-citytunnels` | `citytunnels.jpg` | Ruínas urbanas |
| `.bg-cave` | `cave.jpg` | Cavernas |
| `.bg-forest` | `forest.jpg` | Floresta |
| `.bg-forge` | `forge.jpg` | Forja |
| `.bg-mansion` | `mansion.jpeg` | Mansão |
| `.bg-mountains` | `mountains.png` | Montanhas |
| `.bg-tower` | `tower.jpg` | Torre |
| `.bg-towertop` | `towertop.jpeg` | Cima da torre |
| `.bg-village` | `village.jpg` | Vila |

---

## 🎮 Cores por Categoria de Ambiente

| Ambiente | Cor Dominante | Intenção |
|----------|---------------|----------|
| Woods (Floresta) | Verde escuro + dourado | Mistério natural |
| Caves (Cavernas) | Cinza + laranja de lava | Perigo oculto |
| Ruins (Ruínas) | Roxo + rosa | Magia antiga |
| Undead (Mortos-vivos) | Preto + verde pálido | Horror |
| Mountains (Montanhas) | Azul + branco | Grandiosidade |

---

## 🎯 Mapeamento para Padrão Existente

O projeto segue o padrão **"RPG Fantasy Dark Fantasy"** comum em jogos como:
- Baldur's Gate 3
- Divinity: Original Sin 2
- Pathfinder: Kingmaker

### Elementos Comuns:
- ✅ **Dourado envelhecido** como cor primária (ouro mágico)
- ✅ **Roxo/magenta** para elementos mágicos (arcana)
- ✅ **Verdes/vermelhos** para natureza/combate
- ✅ **Cinza escuro** para UI sobreposta
- ✅ **Fontes medievais** para autenticidade

---

## 📐 Sistema de Z-Index

```
0    - Backgrounds
10   - Story header
1000 - Texto da história
999  - Máscaras (mask-card)
9997 - Modais (story-modal, new-items)
9998 - Story screen overlay
9999 - Flash overlays, decisão modal
```

---

## 🎬 Animações de Efeito

### Pulse Animation
```css
0%   - scale(1), shadow 0
50%  - scale(1.1), glow effect
100% - scale(1), shadow 0
```

### Die Animation (Cartas morrendo)
```css
0%   - opacity 1, scale 1
100% - opacity 0, scale 0.75
Duration: 300ms ease-in
```

---

## 📋 Resumo Visual

| Elemento | Cor | Intenção |
|----------|-----|----------|
| **UI Primária** | `#cfa86a` | Ouro mágico, destaque |
| **Textos** | `#f7d7a8` / `#eecda3` | Pergaminho envelhecido |
| **Fundo Modais** | `rgba(35, 35, 35, 0.95)` | Madeira escura |
| **Acentos** | Roxo + Rosa | Magia arcane |
| **Destruição** | Vermelho | Perigo, dano |

---

*Documento gerado automaticamente a partir da análise dos arquivos LESS do projeto.*
