// Gera docs/09-tabelas-de-referencia.md lendo as tabelas direto do index.html.
// Uso (na pasta dragoncity/):  node docs/ferramentas/gerar-tabelas.js
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '..', '..');
const X = require('./carregar-jogo.js')(path.join(root, 'index.html'));
const { EL, EL_KEYS, STRONG, RARITY, LEGENDS, CROPS, MODES, LEAGUES, LEAGUE_RARITY, MAX_DLVL, MAX_PLVL, HATCH_COSTS, ACH, ALL_SPECIES } = X;
const br = n => (Math.round(n * 100) / 100).toLocaleString('pt-BR');
const elName = k => `${EL[k].i} ${EL[k].n}`;
const out = [];
const p = s => out.push(s);
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |'); p('|' + head.map(() => '---').join('|') + '|'); rows.forEach(r => p('| ' + r.join(' | ') + ' |')); p(''); };

p('# Tabelas de referência');
p('');
p('> Arquivo **gerado automaticamente** por `docs/ferramentas/gerar-tabelas.js` a partir do `index.html`. Não edite à mão: rode o script de novo quando o jogo mudar.');
p('');

p('## Modos e o Dragão Ancestral');
p('');
table(['Modo', 'O Ancestral invade', 'Ancestral na invasão (vida / ataque)', 'Se ferido na Arena (vida)', 'Ancestral adormecido na Arena (vida / ataque)'],
  Object.values(MODES).map(m => [m.n, m.dur ? `aos ${m.dur / 60} min` : `a cada ${m.wave / 60} min`,
    `${br(m.boss.hp)} / ${m.boss.atk}${m.dur ? '' : ' na 1ª invasão'}`, br(Math.round(m.boss.hp * 0.7)), `${br(Math.round(m.boss.hp * 0.8))} / ${Math.round(m.boss.atk * 0.8)}`]));
const inf = Object.values(MODES).find(m => !m.dur);
if (inf) {
  p(`No modo ${inf.n} o Ancestral fica 35% mais forte (vida e ataque) a cada invasão repelida:`);
  p('');
  table(['Invasão', 1, 2, 3, 4, 5, 6], [['Vida', ...[0, 1, 2, 3, 4, 5].map(w => br(Math.round(inf.boss.hp * Math.pow(1.35, w))))], ['Ataque', ...[0, 1, 2, 3, 4, 5].map(w => Math.round(inf.boss.atk * Math.pow(1.35, w)))]]);
}

p('## Elementos');
p('');
table(['Elemento', 'Nível p/ comprar', 'Preço na loja', 'Raridade do puro', 'Forte contra (x1,5)', 'Fraco contra (x0,7)'],
  EL_KEYS.map(k => {
    const weak = EL_KEYS.filter(o => STRONG[o].includes(k));
    return [elName(k), EL[k].unlock, `🪙 ${br(EL[k].cost)}`, RARITY[X.speciesFromEls([k]).rar].n, STRONG[k].map(elName).join(', '), weak.map(elName).join(', ') || '—'];
  }));
p('A coluna "fraco contra" lista os atacantes que causam x1,5 nele. Quando ele mesmo ataca um elemento que é forte contra o dele, o dano cai para x0,7.');
p('');

p('## Matriz de dano elemental (atacante na linha, defensor na coluna)');
p('');
table(['Atq \\ Def', ...EL_KEYS.map(k => EL[k].i)], EL_KEYS.map(a => [elName(a), ...EL_KEYS.map(d => { const m = X.eff(a, [d]); return m === 1 ? '·' : br(m); })]));
p('Contra dragões de dois elementos os multiplicadores se **multiplicam** (ex.: 🔥 contra 🌿❄️ = 1,5 × 1,5 = 2,25).');
p('');

p('## Raridades');
p('');
table(['Raridade', 'Valor (rv)', 'Ouro/s no Nv 1', 'Vida no Nv 1', 'Ataque no Nv 1', 'Chocagem (s)', 'Espécies'],
  Object.entries(RARITY).map(([k, r]) => [r.n, r.rv, br(r.gps), r.hp, r.atk, r.egg, ALL_SPECIES.filter(s => s.rar === k).length]));

p('## Atributos por nível de dragão');
p('');
p(`Fórmulas: ouro/s = base × (1 + 0,4 × (nv − 1)); vida = base × (1 + 0,2 × (nv − 1)); ataque = base × (1 + 0,16 × (nv − 1)); poder = vida/4 + ataque × 2. Nível máximo: ${MAX_DLVL}.`);
p('');
const lv = [1, 3, 5, 8, 10, 12, 15];
['C', 'R', 'E', 'L'].forEach(r => {
  p(`**${RARITY[r].n}**`);
  p('');
  table(['Nível', ...lv], [
    ['Ouro/s', ...lv.map(l => br(X.gpsOf({ rar: r, lvl: l })))],
    ['Vida', ...lv.map(l => X.hpOf({ rar: r, lvl: l }))],
    ['Ataque', ...lv.map(l => X.atkOf({ rar: r, lvl: l }))],
    ['Poder', ...lv.map(l => X.powerOf({ rar: r, lvl: l }))],
    ['Valor de venda', ...lv.map(l => X.sellValue({ rar: r, lvl: l }))],
  ]);
});

p('## Custo para alimentar (comida)');
p('');
const fl = Array.from({ length: MAX_DLVL - 1 }, (_, i) => i + 1);
table(['Do nível', ...fl.map(l => `${l}→${l + 1}`)], [['🍖', ...fl.map(l => X.feedCost(l))]]);
p(`Total de comida do nível 1 ao ${MAX_DLVL}: **${br(fl.reduce((a, l) => a + X.feedCost(l), 0))}**.`);
p('');

p('## Plantações');
p('');
table(['Plantação', 'Nível', 'Custo', 'Tempo', 'Comida', 'Comida por segundo', 'Lucro de comida por ouro'],
  Object.values(CROPS).map(c => [`${c.i} ${c.n}`, c.lvl, `🪙 ${c.cost}`, `${c.dur}s`, c.food, br(c.food / c.dur), br(c.food / c.cost)]));

p('## Construções');
p('');
const maxHab = X.HAB_LOTS ? X.HAB_LOTS.length : 9, maxFarm = X.FARM_LOTS ? X.FARM_LOTS.length : 10;
const habs = [], farms = [];
for (let n = 2; n <= maxHab; n++) habs.push([`${n}º habitat`, `🪙 ${br(Math.round(150 * Math.pow(2.1, n - 2)))}`]);
for (let n = 3; n <= maxFarm; n++) farms.push([`${n}ª fazenda`, `🪙 ${br(Math.round(100 * Math.pow(1.8, n - 3)))}`]);
p(`A partida começa com 1 habitat (3 vagas de dragão) e 2 fazendas. A ilha tem lotes para no máximo ${maxHab} habitats e ${maxFarm} fazendas. Custo de cada nova unidade:`);
p('');
const rows = Math.max(habs.length, farms.length);
table(['Habitat', 'Custo', 'Fazenda', 'Custo'], Array.from({ length: rows }, (_, i) => [...(habs[i] || ['', '']), ...(farms[i] || ['', ''])]));
table(['Espaço da chocadeira', '2º', '3º', '4º'], [['Custo', ...HATCH_COSTS.map(c => `🪙 ${br(c)}`)]]);

p('## Nível do jogador');
p('');
const pl = Array.from({ length: MAX_PLVL - 1 }, (_, i) => i + 1);
let acc = 0;
table(['Nível', 'XP para o próximo', 'XP acumulado', 'Gemas ao subir', 'Desbloqueia'], pl.map(l => {
  acc += X.xpNeed(l);
  const n = l + 1, un = [];
  EL_KEYS.forEach(k => { if (EL[k].unlock === n) un.push(elName(k)); });
  Object.values(CROPS).forEach(c => { if (c.lvl === n) un.push(`${c.i} ${c.n}`); });
  if (n === 3) un.push('Colher e replantar tudo');
  if (n === 5) un.push('Coletar tudo (tecla C)');
  return [`${l}→${n}`, br(X.xpNeed(l)), br(acc), 2 + Math.floor(n / 5), un.join(', ') || ''];
}));

p('## Arena: ligas');
p('');
table(['Liga', 'Raridades sorteadas', 'Oponentes (luta 1/2/3)', 'Nível dos oponentes (luta 1/2/3)', 'Ouro por vitória (luta 1/2/3)', 'Gemas', 'XP (luta 1/2/3)'],
  LEAGUES.map((n, i) => {
    const L = i + 1;
    const cnt = [0, 1, 2].map(f => Math.min(3, Math.ceil((L + f) / 2)));
    const lvls = [0, 1, 2].map(f => Math.max(1, Math.min(MAX_DLVL, 1 + (L - 1) * 2 + f)));
    const gold = [0, 1, 2].map(f => br(Math.round(90 * Math.pow(L, 1.9) * (1 + f * 0.5))));
    const xp = [0, 1, 2].map(f => 15 * L + 5 * f);
    const rs = LEAGUE_RARITY[i].map(r => RARITY[r].n).join(', ');
    return [n, rs, cnt.join(' / '), lvls.join(' / '), gold.join(' / '), L, xp.join(' / ')];
  }));
p('As raridades sorteadas têm o mesmo peso cada; repetições na lista aumentam a chance (ex.: "Raro, Raro, Épico" = 2/3 Raro, 1/3 Épico). Oponentes de liga têm 95% da vida e do ataque de um dragão normal do mesmo nível.');
p('');

p('## Espécies (' + ALL_SPECIES.length + ')');
p('');
table(['#', 'Espécie', 'Elementos', 'Raridade', 'Como obter'], ALL_SPECIES.map((s, i) => {
  let how;
  if (s.rar === 'L') { const L = LEGENDS.find(l => 'L:' + l.k === s.key); how = `Cruzar pais que somem ${L.els.map(elName).join(' + ')} (${Math.round(L.ch * 100)}%)`; }
  else if (s.els.length === 1) how = `Loja (nível ${EL[s.els[0]].unlock}) ou cruzamento`;
  else how = `Cruzar um pai com ${elName(s.els[0])} e outro com ${elName(s.els[1])}`;
  return [i + 1, s.name, s.els.map(elName).join(' + '), RARITY[s.rar].n, how];
}));

p('## Conquistas (' + ACH.length + ', total de ' + ACH.reduce((a, b) => a + b.g, 0) + ' gemas)');
p('');
[...new Set(ACH.map(a => a.cat))].forEach(c => {
  p(`### ${c}`);
  p('');
  table(['', 'Conquista', 'Requisito', 'Gemas'], ACH.filter(a => a.cat === c).map(a => [a.i, a.n, a.d, a.g]));
});

fs.writeFileSync(path.join(root, 'docs', '09-tabelas-de-referencia.md'), out.join('\n'));
console.log('ok', out.length, 'linhas');
