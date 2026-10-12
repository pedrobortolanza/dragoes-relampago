// Carrega o script do jogo num sandbox Node e expõe as tabelas
const fs = require('fs'), vm = require('vm');
module.exports = function load(path) {
  const html = fs.readFileSync(path, 'utf8');
  // O jogo pode ter mais de um <script> (ex.: o áudio vem antes); usamos o que contém as tabelas de dados.
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const src = scripts.find(s => s.includes('DATA-START')) || scripts[scripts.length - 1];
  // Elemento falso: qualquer propriedade desconhecida vira uma função que não faz nada,
  // para o script do jogo carregar sem navegador mesmo quando a interface mudar.
  const el = () => new Proxy({ innerHTML: '', children: [], childNodes: [], scrollTop: 0, style: {}, dataset: {} },
    { get: (o, k) => (k in o ? o[k] : (typeof k === 'string' ? () => el() : undefined)) });
  const ctx = {
    Som: new Proxy({}, { get: () => () => {} }),
    console, Math, JSON, Object, Array, Set, String, Number, parseInt,
    performance: { now: () => Date.now() },
    setInterval: () => 0, setTimeout: () => 0,
    document: { querySelector: el, getElementById: () => null, addEventListener() {}, createElement: el, body: el(), documentElement: {}, elementFromPoint: () => null, hidden: false },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(src + `\n;globalThis.__x = { EL, EL_KEYS, STRONG, RARITY, LEGENDS, CROPS, MODES, LEAGUES, LEAGUE_RARITY, MAX_DLVL, MAX_PLVL, HAB_CAP, HATCH_COSTS, EVENTS, MISSION_TPL, ACH, ALL_SPECIES, speciesFromEls, gpsOf, hpOf, atkOf, powerOf, feedCost, sellValue, breedCost, xpNeed, eff, breedOutcomes, enemyTeam, newState, fmt, get S(){return S}, set S(v){S=v}, startGame, score, rankFor, HAB_LOTS: typeof HAB_LOTS !== 'undefined' ? HAB_LOTS : null, FARM_LOTS: typeof FARM_LOTS !== 'undefined' ? FARM_LOTS : null };`, ctx);
  return ctx.__x;
};
