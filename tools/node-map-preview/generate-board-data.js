/**
 * Gera a lista de nodes de um tabuleiro a partir do layout desenhado em index.html
 * (preview) e a grava no arquivo .board.ts da campanha.
 *
 * Uso:
 *   node tools/node-map-preview/generate-board-data.js <arquivo .board.ts> [index.html do preview]
 *
 * O que acrescenta ao layout do preview:
 *   - monsterType de cada node de batalha (pelo prefixo do id, ver MONSTER_RULES)
 *   - level de cada node (progresso no caminho, de 1 a 10)
 * Os nodes intermediários criados pela subdivisão já vêm prontos do preview.
 * Ver BOARD_NODES_SPEC.md.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const target = process.argv[2];
const previewFile = process.argv[3] || path.join(__dirname, 'index.html');
if (!target) {
    console.error('Uso: node generate-board-data.js <arquivo .board.ts> [index.html do preview]');
    process.exit(1);
}

// Ids do primeiro e do último node do caminho completo (usados para calcular o nível).
const START_ID = 'S01';
const END_ID = 'BOSS';

// monsterType por prefixo de id; vale também para os nodes de subdivisão (ex.: "A08~1").
// A ordem importa: a primeira regra que casar vence.
const MONSTER_RULES = [
    [/^(S|SS|N|A)\d/, 'woods'],      // vila, floresta e lago
    [/^(E|B)\d/, 'ruins'],           // muralhas externas e escada do muro
    [/^M01~/, 'ruins'],              // trecho entre o descanso e as muralhas
    [/^T\d/, 'woods'],               // trilha sul na mata
    [/^(K|M02~)/, 'undead'],         // cripta e antessala do cristal
    [/^U\d/, 'undead'],              // corredor dos nichos
    [/^L\d/, 'caves']                // caverna inferior
];
const BOSS_MONSTER_TYPE = 'undead';

// --- carrega N (os nodes) executando só a parte de dados do preview ---
const html = fs.readFileSync(previewFile, 'utf8');
const from = html.indexOf('const TYPES');
const to = html.indexOf('/* ---------- RENDER');
if (from < 0 || to < 0) throw new Error('Não achei o bloco de dados em ' + previewFile);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(html.slice(from, to).replace(/^const /gm, 'var ') + '\nthis.N = N;', ctx);
const N = ctx.N;
const ids = Object.keys(N);

// --- distâncias mínimas início -> node e node -> fim (em nodes) ---
const fromStart = { [START_ID]: 0 };
for (const queue = [START_ID]; queue.length;) {
    const c = queue.shift();
    N[c].next.forEach(t => { if (fromStart[t] === undefined) { fromStart[t] = fromStart[c] + 1; queue.push(t); } });
}
const prev = Object.fromEntries(ids.map(i => [i, []]));
ids.forEach(i => N[i].next.forEach(t => prev[t].push(i)));
const toEnd = { [END_ID]: 0 };
for (const queue = [END_ID]; queue.length;) {
    const c = queue.shift();
    prev[c].forEach(p => { if (toEnd[p] === undefined) { toEnd[p] = toEnd[c] + 1; queue.push(p); } });
}

function monsterTypeOf(id, type) {
    if (type === 'boss') return BOSS_MONSTER_TYPE;
    if (type !== 'battle') return '';
    const rule = MONSTER_RULES.find(([re]) => re.test(id));
    if (!rule) throw new Error('Sem monsterType para o node ' + id);
    return rule[1];
}

function levelOf(id, type) {
    if (type === 'boss') return 10;
    if (type !== 'battle') return 0;
    if (fromStart[id] === undefined || toEnd[id] === undefined) throw new Error('Node fora do caminho: ' + id);
    const progress = fromStart[id] / (fromStart[id] + toEnd[id]);
    return Math.max(1, Math.min(10, 1 + Math.round(progress * 9)));
}

// superfície primeiro, depois os demais mapas, mantendo a ordem de definição
const order = ids.slice().sort((a, b) => (N[a].map === N[b].map ? 0 : N[a].map === 'sup' ? -1 : 1));
const lines = order.map(id => {
    const n = N[id];
    const labels = Object.keys(n.labels).length ? `, labels: ${JSON.stringify(n.labels)}` : '';
    const next = JSON.stringify(n.next).replace(/"/g, "'");
    return `        { id: '${id}', map: '${n.map}', x: ${n.x}, y: ${n.y}, type: '${n.type}', ` +
        `monsterType: '${monsterTypeOf(id, n.type)}', level: ${levelOf(id, n.type)}, next: ${next}${labels} },`;
});

// --- grava no .board.ts, entre "const nodes: BoardNode[] = [" e "];" ---
const ts = fs.readFileSync(target, 'utf8');
const marker = 'const nodes: BoardNode[] = [';
const start = ts.indexOf(marker);
if (start < 0) throw new Error('Não achei "' + marker + '" em ' + target);
const bodyStart = start + marker.length;
const bodyEnd = ts.indexOf('];', bodyStart);
fs.writeFileSync(target, ts.slice(0, bodyStart) + '\n' + lines.join('\n') + '\n\n' + ts.slice(bodyEnd), 'utf8');
console.log(`${ids.length} nodes gravados em ${target}`);
