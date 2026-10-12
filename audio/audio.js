/* =====================================================================
   Dragões Relâmpago — Sons e Música
   ---------------------------------------------------------------------
   Tudo é sintetizado no navegador com a Web Audio API: nenhum arquivo
   de áudio, nenhuma dependência. Expõe um único objeto global `Som`.

   Uso rápido:
     Som.play('coletar');                       // efeito sonoro
     Som.play('ataque', { elemento: 'fogo' });  // efeito com opções
     Som.musica('ilha');                        // troca a música (crossfade)
     Som.musica(null);                          // para a música
     Som.tensao(0.6);                           // 0..1, deixa a música da ilha tensa
     Som.alternarMudo();  Som.volume(0.8);
     Som.criarControles(elemento);              // botão de mudo + volumes

   O áudio só começa depois do primeiro clique ou tecla (regra dos
   navegadores). Pedidos de música feitos antes disso ficam guardados
   e começam sozinhos no primeiro gesto. Nada é salvo em localStorage.
   ===================================================================== */
(function () {
  'use strict';

  const AC = window.AudioContext || window.webkitAudioContext;

  // ------------------------------------------------------------------
  // Estado
  // ------------------------------------------------------------------
  const st = {
    mudo: false,
    volume: 0.8,      // geral
    volMusica: 0.5,
    volEfeitos: 0.85,
    faixa: null,      // faixa pedida (mesmo antes do desbloqueio)
    tensao: 0,
    pausadoPeloJogo: false,
  };
  const ouvintes = [];
  let ctx = null, master, busMusica, busEfeitos, reverb, revSend, ruido;
  let ultimoTocado = {};

  const m2f = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const escolha = (arr) => arr[(Math.random() * arr.length) | 0];

  function avisar() { const e = estado(); ouvintes.forEach((fn) => { try { fn(e); } catch (_) {} }); }
  function estado() {
    return { mudo: st.mudo, volume: st.volume, volMusica: st.volMusica, volEfeitos: st.volEfeitos,
      faixa: st.faixa, tensao: st.tensao, ativo: !!(ctx && ctx.state === 'running'), suportado: !!AC };
  }

  // ------------------------------------------------------------------
  // Grafo de áudio
  // ------------------------------------------------------------------
  function iniciarContexto() {
    if (ctx || !AC) return ctx;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4;
    comp.attack.value = 0.004; comp.release.value = 0.2;
    master = ctx.createGain();
    master.connect(comp); comp.connect(ctx.destination);
    busMusica = ctx.createGain(); busMusica.connect(master);
    busEfeitos = ctx.createGain(); busEfeitos.connect(master);

    // reverb gerado (ruído com decaimento exponencial)
    reverb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.2);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    reverb.buffer = ir;
    revSend = ctx.createGain(); revSend.gain.value = 0.35;
    revSend.connect(reverb); reverb.connect(master);

    // ruído branco reaproveitado
    ruido = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = ruido.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    aplicarVolumes(true);
    return ctx;
  }

  function aplicarVolumes(imediato) {
    if (!ctx) return;
    const t = ctx.currentTime, tc = imediato ? 0.001 : 0.08;
    master.gain.setTargetAtTime(st.mudo ? 0 : st.volume, t, tc);
    busMusica.gain.setTargetAtTime(st.volMusica, t, tc);
    busEfeitos.gain.setTargetAtTime(st.volEfeitos, t, tc);
  }

  function desbloquear() {
    if (!AC) return;
    iniciarContexto();
    if (ctx.state === 'suspended' && !st.pausadoPeloJogo) ctx.resume().then(() => { iniciarMusicaSePreciso(); avisar(); });
    else iniciarMusicaSePreciso();
  }
  ['pointerdown', 'keydown', 'touchend'].forEach((ev) =>
    window.addEventListener(ev, desbloquear, { capture: true, passive: true }));

  // O jogo pausa quando a aba fica oculta; o áudio acompanha.
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (!st.pausadoPeloJogo) ctx.resume();
  });

  // ------------------------------------------------------------------
  // Blocos de síntese. `at` é tempo absoluto do contexto.
  // ------------------------------------------------------------------
  function saida(dest, pan, rev) {
    let n = dest;
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; p.connect(dest); n = p; }
    return { no: n, rev };
  }

  function envelope(g, at, a, dur, vol, curva) {
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(vol, at + a);
    if (curva === 'sustenta') { g.gain.setValueAtTime(vol, at + Math.max(a, dur - 0.08)); g.gain.linearRampToValueAtTime(0.0001, at + dur); }
    else g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  }

  // Oscilador com envelope, glissando e filtro opcionais.
  function tom(o) {
    const at = o.at, dur = o.dur || 0.2;
    const osc = ctx.createOscillator();
    osc.type = o.tipo || 'sine';
    osc.frequency.setValueAtTime(Math.min(o.f, 16000), at);
    if (o.f2) {
      if (o.lin) osc.frequency.linearRampToValueAtTime(o.f2, at + (o.glide || dur));
      else osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), at + (o.glide || dur));
    }
    if (o.detune) osc.detune.value = o.detune;
    let ult = osc;
    if (o.filtro) {
      const fl = ctx.createBiquadFilter();
      fl.type = o.filtro; fl.frequency.setValueAtTime(o.ff || 1200, at); fl.Q.value = o.q || 0.7;
      if (o.ff2) fl.frequency.exponentialRampToValueAtTime(o.ff2, at + dur);
      osc.connect(fl); ult = fl;
    }
    const g = ctx.createGain();
    envelope(g, at, o.a || 0.005, dur, o.vol || 0.2, o.curva);
    ult.connect(g);
    const s = saida(o.dest || busEfeitos, o.pan, o.rev);
    g.connect(s.no);
    if (o.rev) { const rg = ctx.createGain(); rg.gain.value = o.rev; g.connect(rg); rg.connect(revSend); }
    if (o.vib) { // vibrato
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1];
      l.connect(lg); lg.connect(osc.frequency); l.start(at); l.stop(at + dur + 0.05);
    }
    osc.start(at); osc.stop(at + dur + 0.05);
    return osc;
  }

  // Ruído filtrado com envelope.
  function chiado(o) {
    const at = o.at, dur = o.dur || 0.2;
    const src = ctx.createBufferSource();
    src.buffer = ruido; src.loop = true;
    const fl = ctx.createBiquadFilter();
    fl.type = o.filtro || 'bandpass'; fl.Q.value = o.q || 1;
    fl.frequency.setValueAtTime(o.ff || 1500, at);
    if (o.ff2) fl.frequency.exponentialRampToValueAtTime(o.ff2, at + (o.glide || dur));
    const g = ctx.createGain();
    envelope(g, at, o.a || 0.003, dur, o.vol || 0.2, o.curva);
    src.connect(fl); fl.connect(g);
    const s = saida(o.dest || busEfeitos, o.pan);
    g.connect(s.no);
    if (o.rev) { const rg = ctx.createGain(); rg.gain.value = o.rev; g.connect(rg); rg.connect(revSend); }
    if (o.trem) { // tremolo (para tremores)
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = o.trem[0]; lg.gain.value = o.trem[1];
      l.connect(lg); lg.connect(g.gain); l.start(at); l.stop(at + dur + 0.05);
    }
    src.start(at, Math.random() * 1.5); src.stop(at + dur + 0.05);
  }

  // Sino: parciais inarmônicas.
  function sino(f, at, dur, vol, dest, rev) {
    tom({ at, f, dur, vol, dest, rev, tipo: 'sine' });
    if (f * 2.76 < 16000) tom({ at, f: f * 2.76, dur: dur * 0.5, vol: vol * 0.35, dest, rev });
    if (f * 5.4 < 16000) tom({ at, f: f * 5.4, dur: dur * 0.25, vol: vol * 0.15, dest, rev });
  }
  function moeda(at, f, vol, pan) {
    tom({ at, f, dur: 0.07, vol, tipo: 'square', filtro: 'lowpass', ff: 5000, pan });
    tom({ at: at + 0.06, f: f * 1.335, dur: 0.22, vol: vol * 0.9, tipo: 'square', filtro: 'lowpass', ff: 5000, pan, rev: 0.15 });
  }
  function brilho(at, n, vol, base) {
    for (let i = 0; i < n; i++) sino((base || 2000) * rnd(0.9, 2), at + i * rnd(0.02, 0.06), 0.25, vol * rnd(0.4, 1), busEfeitos, 0.4);
  }
  function arpejo(notas, at, passo, o) {
    notas.forEach((m, i) => tom(Object.assign({ at: at + i * passo, f: m2f(m) }, o)));
  }

  // Rugido: serra com formantes + ruído + distorção.
  let curvaDist = null;
  function distorcao() {
    if (curvaDist) return curvaDist;
    const n = 1024; curvaDist = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; curvaDist[i] = (3 + 20) * x * 0.3 / (Math.PI + 20 * Math.abs(x)); }
    return curvaDist;
  }
  function rugido(at, dur, grave, vol) {
    const ws = ctx.createWaveShaper(); ws.curve = distorcao();
    const g = ctx.createGain(); envelope(g, at, 0.12, dur, vol);
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 600 * grave + 100; f1.Q.value = 2;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1400 * grave + 200; f2.Q.value = 3;
    const mix = ctx.createGain(); mix.gain.value = 1;
    ws.connect(f1); ws.connect(f2); f1.connect(mix); f2.connect(mix); mix.connect(g);
    g.connect(busEfeitos);
    const rg = ctx.createGain(); rg.gain.value = 0.5; g.connect(rg); rg.connect(revSend);
    const base = 70 * grave + 30;
    [0, 7, -5].forEach((dt, i) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.detune.value = dt * 3;
      o.frequency.setValueAtTime(base, at);
      o.frequency.linearRampToValueAtTime(base * 1.6, at + dur * 0.3);
      o.frequency.linearRampToValueAtTime(base * 0.75, at + dur);
      const lf = ctx.createOscillator(), lg = ctx.createGain();
      lf.frequency.value = 23 + i * 4; lg.gain.value = base * 0.25;
      lf.connect(lg); lg.connect(o.frequency);
      o.connect(ws); o.start(at); o.stop(at + dur + 0.05); lf.start(at); lf.stop(at + dur + 0.05);
    });
    chiado({ at, dur, ff: 900 * grave + 300, q: 0.8, vol: vol * 0.6, a: 0.1 });
  }

  // ------------------------------------------------------------------
  // Efeitos sonoros. Cada um recebe (t = agora, o = opções).
  // ------------------------------------------------------------------
  const ATAQUES = {
    fogo(t, k) {
      chiado({ at: t, dur: 0.45 * k, ff: 300, ff2: 2500, glide: 0.18, q: 0.9, vol: 0.45 * k, a: 0.04 });
      chiado({ at: t + 0.15, dur: 0.4 * k, filtro: 'lowpass', ff: 900, ff2: 200, vol: 0.3 * k });
      tom({ at: t, f: 90, f2: 50, dur: 0.4, vol: 0.25 * k });
    },
    agua(t, k) {
      for (let i = 0; i < 6 * k; i++) { const f = rnd(300, 800); tom({ at: t + i * 0.045, f, f2: f * 2.2, dur: 0.08, vol: 0.18, tipo: 'sine' }); }
      chiado({ at: t + 0.2, dur: 0.35 * k, filtro: 'lowpass', ff: 3000, ff2: 400, vol: 0.3 * k, rev: 0.3 });
    },
    planta(t, k) {
      chiado({ at: t, dur: 0.18, filtro: 'highpass', ff: 1500, ff2: 6000, vol: 0.3 * k, a: 0.06 });
      [0, 0.09, 0.16].forEach((d, i) => tom({ at: t + 0.12 + d, f: 260 + i * 70, f2: 180, dur: 0.12, vol: 0.25 * k, tipo: 'triangle' }));
      chiado({ at: t + 0.12, dur: 0.3, ff: 4000, q: 2, vol: 0.12 * k });
    },
    terra(t, k) {
      tom({ at: t, f: 130, f2: 35, dur: 0.5 * k, vol: 0.6 * Math.min(k, 1.3), tipo: 'sine' });
      chiado({ at: t, dur: 0.4 * k, filtro: 'lowpass', ff: 500, ff2: 120, vol: 0.5 * k });
      for (let i = 0; i < 4; i++) chiado({ at: t + 0.08 + i * 0.05, dur: 0.05, ff: rnd(800, 2000), q: 3, vol: 0.12 });
    },
    eletrico(t, k) {
      const o = tom({ at: t, f: 900, f2: 300, dur: 0.3 * k, vol: 0.16 * k, tipo: 'sawtooth', filtro: 'highpass', ff: 600 });
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.type = 'square'; l.frequency.value = 55; lg.gain.value = 500;
      l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + 0.35 * k);
      chiado({ at: t, dur: 0.25 * k, filtro: 'highpass', ff: 3000, vol: 0.2 * k, trem: [40, 0.15] });
      tom({ at: t + 0.02, f: 2400, f2: 1200, dur: 0.1, vol: 0.1, tipo: 'square' });
    },
    gelo(t, k) {
      for (let i = 0; i < 7 * k; i++) sino(rnd(1800, 4200), t + i * 0.035, 0.3, 0.09, busEfeitos, 0.5);
      chiado({ at: t, dur: 0.5 * k, filtro: 'highpass', ff: 5000, ff2: 9000, vol: 0.18 * k, a: 0.05 });
      tom({ at: t, f: 1200, f2: 2400, dur: 0.25, vol: 0.06, tipo: 'triangle' });
    },
    metal(t, k) {
      [520, 1310, 2030, 3150].forEach((f, i) => tom({ at: t, f: f * rnd(0.98, 1.02), dur: 0.6 * k / (i * 0.4 + 1), vol: 0.2 / (i + 1) * k, tipo: i ? 'sine' : 'triangle', rev: 0.3 }));
      chiado({ at: t, dur: 0.06, ff: 3000, q: 1, vol: 0.4 * k });
      tom({ at: t, f: 160, f2: 70, dur: 0.15, vol: 0.3 });
    },
    trevas(t, k) {
      chiado({ at: t, dur: 0.6 * k, ff: 200, ff2: 900, glide: 0.5 * k, q: 3, vol: 0.35 * k, a: 0.35 * k, curva: 'sustenta' });
      tom({ at: t, f: 95, f2: 45, dur: 0.7 * k, vol: 0.3 * k, tipo: 'sawtooth', filtro: 'lowpass', ff: 500, a: 0.2 });
      tom({ at: t, f: 101, f2: 47, dur: 0.7 * k, vol: 0.25 * k, tipo: 'sawtooth', filtro: 'lowpass', ff: 500, a: 0.2, rev: 0.4 });
    },
    luz(t, k) {
      arpejo([84, 88, 91, 95, 96], t, 0.035, { dur: 0.5, vol: 0.12 * k, tipo: 'sine', rev: 0.6 });
      chiado({ at: t, dur: 0.4 * k, filtro: 'highpass', ff: 3000, ff2: 8000, vol: 0.15 * k, a: 0.1 });
      tom({ at: t, f: 600, f2: 2400, dur: 0.3, vol: 0.08, tipo: 'triangle' });
    },
    neutro(t, k) {
      chiado({ at: t, dur: 0.25 * k, ff: 600, ff2: 2000, q: 1, vol: 0.3 * k, a: 0.05 });
      tom({ at: t + 0.1, f: 160, f2: 60, dur: 0.2, vol: 0.35 * k });
    },
  };
  const elem = (o) => ATAQUES[normalizar(o && o.elemento)] || ATAQUES.neutro;
  function normalizar(e) {
    if (!e) return 'neutro';
    e = String(e).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const mapa = { fire: 'fogo', water: 'agua', plant: 'planta', earth: 'terra', electric: 'eletrico', ice: 'gelo', dark: 'trevas', light: 'luz' };
    return mapa[e] || e;
  }

  const RAR = { comum: 0, raro: 1, epico: 2, lendario: 3 };
  const rar = (o) => RAR[normalizar(o && o.raridade)] ?? 0;

  const SONS = {
    // --- interface ---
    clique(t) { tom({ at: t, f: 900, f2: 620, dur: 0.05, vol: 0.12, tipo: 'triangle' }); },
    aba(t) { tom({ at: t, f: 660, dur: 0.04, vol: 0.08, tipo: 'sine' }); tom({ at: t + 0.03, f: 990, dur: 0.05, vol: 0.06 }); },
    erro(t) { tom({ at: t, f: 190, dur: 0.1, vol: 0.14, tipo: 'square', filtro: 'lowpass', ff: 1200 }); tom({ at: t + 0.12, f: 140, dur: 0.16, vol: 0.14, tipo: 'square', filtro: 'lowpass', ff: 1000 }); },
    pausar(t) { arpejo([76, 69, 64], t, 0.07, { dur: 0.12, vol: 0.12, tipo: 'triangle' }); },
    retomar(t) { arpejo([64, 69, 76], t, 0.07, { dur: 0.12, vol: 0.12, tipo: 'triangle' }); },
    confirmar(t) { arpejo([72, 79], t, 0.06, { dur: 0.15, vol: 0.12, tipo: 'triangle' }); },

    // --- economia ---
    coletar(t, o) {
      const n = Math.max(1, Math.min(5, (o && o.quantidade) || 1));
      for (let i = 0; i < n; i++) moeda(t + i * 0.05, 988 * Math.pow(1.06, i) * rnd(0.98, 1.03), 0.12 / Math.sqrt(n), rnd(-0.4, 0.4));
    },
    coletarTudo(t) {
      for (let i = 0; i < 8; i++) moeda(t + i * 0.055, m2f(76 + [0, 2, 4, 7, 9, 12, 14, 16][i]), 0.07, rnd(-0.6, 0.6));
      brilho(t + 0.45, 4, 0.08, 2500);
    },
    comprar(t) { moeda(t, 1046, 0.08); sino(m2f(91), t + 0.12, 0.6, 0.12, busEfeitos, 0.3); sino(m2f(96), t + 0.2, 0.7, 0.1, busEfeitos, 0.3); },
    vender(t) { for (let i = 0; i < 4; i++) moeda(t + i * 0.07, 1318 / Math.pow(1.12, i), 0.07, rnd(-0.3, 0.3)); },
    gemas(t) { arpejo([88, 93, 100], t, 0.05, { dur: 0.35, vol: 0.09, tipo: 'sine', rev: 0.5 }); brilho(t + 0.1, 3, 0.06, 3500); },

    // --- fazenda ---
    plantar(t) { tom({ at: t, f: 220, f2: 80, dur: 0.15, vol: 0.3 }); chiado({ at: t, dur: 0.12, ff: 2500, q: 1.5, vol: 0.12 }); },
    colher(t) {
      chiado({ at: t, dur: 0.12, ff: 3000, q: 1, vol: 0.15 });
      tom({ at: t + 0.04, f: 500, f2: 950, dur: 0.1, vol: 0.2, tipo: 'sine' });
      tom({ at: t + 0.1, f: 1100, dur: 0.12, vol: 0.08, tipo: 'triangle' });
    },
    colherTudo(t) { for (let i = 0; i < 4; i++) SONS.colher(t + i * 0.08); arpejo([72, 76, 79, 84], t + 0.35, 0.06, { dur: 0.2, vol: 0.1, tipo: 'triangle' }); },

    // --- dragões ---
    alimentar(t) {
      for (let i = 0; i < 3; i++) { chiado({ at: t + i * 0.12, dur: 0.07, filtro: 'lowpass', ff: 900, vol: 0.3 }); tom({ at: t + i * 0.12, f: 180, f2: 120, dur: 0.06, vol: 0.15 }); }
      tom({ at: t + 0.38, f: 600, f2: 900, dur: 0.12, vol: 0.12, tipo: 'triangle' });
    },
    nivelDragao(t) { arpejo([72, 76, 79, 84], t, 0.06, { dur: 0.18, vol: 0.13, tipo: 'triangle', rev: 0.2 }); brilho(t + 0.25, 4, 0.07, 2600); },
    nivelJogador(t) {
      const lat = { tipo: 'sawtooth', filtro: 'lowpass', ff: 2200, a: 0.02, rev: 0.4 };
      arpejo([67, 72, 76], t, 0.11, Object.assign({ dur: 0.14, vol: 0.12 }, lat));
      [79, 76, 72, 60].forEach((m) => tom(Object.assign({ at: t + 0.33, f: m2f(m), dur: 0.9, vol: 0.08, curva: 'sustenta', vib: [5, 3] }, lat)));
      brilho(t + 0.35, 6, 0.08, 2400);
    },

    // --- chocadeira ---
    ovoColocado(t) { tom({ at: t, f: 280, f2: 520, dur: 0.12, vol: 0.25 }); tom({ at: t + 0.1, f: 520, dur: 0.1, vol: 0.06, tipo: 'triangle' }); },
    ovoPronto(t) { sino(m2f(88), t, 0.5, 0.14, busEfeitos, 0.4); sino(m2f(91), t + 0.14, 0.7, 0.14, busEfeitos, 0.4); },
    chocar(t) {
      [0, 0.18, 0.3].forEach((d) => chiado({ at: t + d, dur: 0.03, filtro: 'highpass', ff: 2500, vol: 0.35 }));
      tom({ at: t + 0.45, f: 300, f2: 700, dur: 0.1, vol: 0.25 });
      chiado({ at: t + 0.45, dur: 0.1, ff: 1800, q: 0.8, vol: 0.2 });
      // piado do filhote
      tom({ at: t + 0.6, f: 1400, f2: 2000, dur: 0.12, vol: 0.12, tipo: 'sine', vib: [28, 80] });
      tom({ at: t + 0.76, f: 1600, f2: 2300, dur: 0.16, vol: 0.12, tipo: 'sine', vib: [28, 100] });
    },
    revelacao(t, o) {
      const r = rar(o);
      const notas = [[72, 76, 79, 84], [72, 76, 79, 83, 86], [69, 72, 76, 79, 83, 88], [62, 69, 74, 78, 81, 86, 90, 93]][r];
      arpejo(notas, t, 0.07 - r * 0.008, { dur: 0.6 + r * 0.2, vol: 0.1, tipo: 'triangle', rev: 0.5 });
      const acorde = notas.slice(-3).map((m) => m - 12);
      acorde.forEach((m) => {
        tom({ at: t + 0.3, f: m2f(m), dur: 1.2 + r * 0.6, vol: 0.05 + r * 0.01, tipo: 'sawtooth', filtro: 'lowpass', ff: 1500 + r * 500, a: 0.15, rev: 0.6, detune: -6 });
        tom({ at: t + 0.3, f: m2f(m), dur: 1.2 + r * 0.6, vol: 0.05 + r * 0.01, tipo: 'sawtooth', filtro: 'lowpass', ff: 1500 + r * 500, a: 0.15, rev: 0.6, detune: 6 });
      });
      brilho(t + 0.3, 5 + r * 4, 0.07, 2200);
      if (r >= 2) chiado({ at: t, dur: 0.8, filtro: 'highpass', ff: 1500, ff2: 8000, vol: 0.12, a: 0.5 });
      if (r === 3) { // gongo + rugido curto para Lendário
        [110, 220 * 1.41, 330 * 1.83].forEach((f, i) => tom({ at: t + 0.3, f, dur: 3 / (i + 1), vol: 0.15 / (i + 1), rev: 0.8 }));
        rugido(t + 0.9, 0.9, 0.9, 0.12);
      }
    },
    especieNova(t, o) { SONS.revelacao(t, o); },
    cruzar(t) {
      tom({ at: t, f: 330, f2: 660, dur: 0.9, vol: 0.12, tipo: 'sine', vib: [7, 15], a: 0.2 });
      tom({ at: t, f: 1320, f2: 660, dur: 0.9, vol: 0.1, tipo: 'sine', vib: [9, 20], a: 0.2 });
      chiado({ at: t, dur: 0.9, ff: 800, ff2: 4000, q: 4, vol: 0.12, a: 0.4 });
      sino(m2f(84), t + 0.9, 0.9, 0.15, busEfeitos, 0.6);
      brilho(t + 0.95, 5, 0.07, 2400);
    },

    // --- batalha ---
    ataque(t, o) { elem(o)(t, 1); },
    especial(t, o) {
      tom({ at: t, f: 180, f2: 1400, dur: 0.32, vol: 0.12, tipo: 'sawtooth', filtro: 'lowpass', ff: 3000 });
      chiado({ at: t, dur: 0.3, ff: 500, ff2: 5000, q: 3, vol: 0.12, a: 0.25, curva: 'sustenta' });
      elem(o)(t + 0.3, 1.6);
    },
    acerto(t) { chiado({ at: t, dur: 0.1, filtro: 'lowpass', ff: 2500, vol: 0.35 }); tom({ at: t, f: 170, f2: 60, dur: 0.15, vol: 0.35 }); },
    critico(t) {
      SONS.acerto(t);
      tom({ at: t, f: 220, f2: 50, dur: 0.3, vol: 0.4, tipo: 'triangle' });
      sino(1760, t + 0.03, 0.4, 0.12, busEfeitos, 0.4);
      chiado({ at: t, dur: 0.2, ff: 4000, q: 1, vol: 0.2 });
    },
    superEficaz(t) { arpejo([84, 91], t, 0.07, { dur: 0.2, vol: 0.12, tipo: 'square', filtro: 'lowpass', ff: 4000 }); },
    poucoEficaz(t) { arpejo([67, 62], t, 0.09, { dur: 0.18, vol: 0.12, tipo: 'triangle', filtro: 'lowpass', ff: 700 }); },
    nocaute(t) {
      tom({ at: t, f: 700, f2: 90, dur: 0.6, vol: 0.13, tipo: 'square', filtro: 'lowpass', ff: 2000 });
      tom({ at: t + 0.55, f: 120, f2: 40, dur: 0.35, vol: 0.4 });
      chiado({ at: t + 0.55, dur: 0.3, filtro: 'lowpass', ff: 600, vol: 0.35 });
    },
    batalhaInicio(t) {
      chiado({ at: t, dur: 0.5, ff: 400, ff2: 3000, q: 1, vol: 0.2, a: 0.4, curva: 'sustenta' });
      const lat = { tipo: 'sawtooth', filtro: 'lowpass', ff: 2500, rev: 0.3 };
      tom(Object.assign({ at: t + 0.5, f: m2f(57), dur: 0.5, vol: 0.12 }, lat));
      tom(Object.assign({ at: t + 0.5, f: m2f(64), dur: 0.5, vol: 0.1 }, lat));
      tom({ at: t + 0.5, f: 110, f2: 45, dur: 0.4, vol: 0.5 });
    },
    vitoria(t) {
      const lat = { tipo: 'square', filtro: 'lowpass', ff: 3500, rev: 0.3 };
      [[72, 0, 0.12], [76, 0.12, 0.12], [79, 0.24, 0.12], [84, 0.36, 0.3], [79, 0.7, 0.12], [84, 0.82, 0.8]].forEach(([m, d, du]) =>
        tom(Object.assign({ at: t + d, f: m2f(m), dur: du, vol: 0.1 }, lat)));
      [60, 64, 67].forEach((m) => tom({ at: t + 0.82, f: m2f(m), dur: 0.9, vol: 0.07, tipo: 'triangle', rev: 0.4, curva: 'sustenta' }));
      brilho(t + 0.85, 6, 0.07, 2400);
    },
    derrota(t) {
      [[67, 0, 0.3], [63, 0.3, 0.3], [60, 0.6, 0.3], [55, 0.9, 1.0]].forEach(([m, d, du]) =>
        tom({ at: t + d, f: m2f(m), dur: du, vol: 0.13, tipo: 'triangle', filtro: 'lowpass', ff: 1500, vib: [5, 4], curva: 'sustenta', rev: 0.4 }));
      tom({ at: t + 0.9, f: m2f(43), dur: 1.0, vol: 0.12, tipo: 'sawtooth', filtro: 'lowpass', ff: 400, curva: 'sustenta' });
    },

    // --- progresso ---
    conquista(t) {
      arpejo([76, 80, 83, 88], t, 0.06, { dur: 0.5, vol: 0.12, tipo: 'triangle', rev: 0.5 });
      [64, 68, 71].forEach((m) => tom({ at: t + 0.24, f: m2f(m), dur: 0.9, vol: 0.05, tipo: 'sawtooth', filtro: 'lowpass', ff: 2000, a: 0.05, rev: 0.5 }));
      sino(m2f(100), t + 0.24, 1.0, 0.1, busEfeitos, 0.6);
      brilho(t + 0.3, 6, 0.07, 3000);
    },
    missao(t) { moeda(t, 988, 0.07); sino(m2f(79), t + 0.1, 0.4, 0.12, busEfeitos, 0.3); sino(m2f(84), t + 0.22, 0.6, 0.12, busEfeitos, 0.3); },

    // --- eventos aleatórios ---
    evento(t) {
      const lat = { tipo: 'sawtooth', filtro: 'lowpass', ff: 1800, a: 0.06, rev: 0.4, curva: 'sustenta' };
      tom(Object.assign({ at: t, f: m2f(67), dur: 0.25, vol: 0.1 }, lat)); tom(Object.assign({ at: t, f: m2f(74), dur: 0.25, vol: 0.08 }, lat));
      tom(Object.assign({ at: t + 0.28, f: m2f(72), dur: 0.6, vol: 0.1 }, lat)); tom(Object.assign({ at: t + 0.28, f: m2f(79), dur: 0.6, vol: 0.08 }, lat));
    },
    chuvaOuro(t) {
      SONS.evento(t);
      for (let i = 0; i < 18; i++) moeda(t + 0.4 + i * rnd(0.04, 0.09), rnd(900, 2000), 0.05, rnd(-0.8, 0.8));
    },
    colheitaFarta(t) { SONS.evento(t); arpejo([72, 74, 76, 79, 81, 84], t + 0.45, 0.06, { dur: 0.25, vol: 0.1, tipo: 'triangle' }); },
    ovoPerdido(t) {
      tom({ at: t, f: 400, f2: 1200, dur: 0.5, vol: 0.12, tipo: 'sine', vib: [8, 40], a: 0.1 });
      sino(m2f(88), t + 0.45, 0.6, 0.1, busEfeitos, 0.6); sino(m2f(95), t + 0.6, 0.8, 0.08, busEfeitos, 0.6);
    },
    ovoPego(t) { SONS.ovoColocado(t); brilho(t + 0.05, 4, 0.08, 2500); },
    dragaoSelvagem(t) { SONS.evento(t); rugido(t + 0.5, 1.0, 1.1, 0.32); },
    mercador(t) {
      [0, 0.1, 0.2].forEach((d, i) => sino(m2f(91 + i * 2), t + d, 0.3, 0.08, busEfeitos, 0.3));
      arpejo([67, 71, 74, 79], t + 0.35, 0.08, { dur: 0.25, vol: 0.09, tipo: 'triangle', rev: 0.3 });
    },

    // --- Ancestral ---
    // intensidade 0..1: use 0.25 (5 min), 0.5 (2 min), 0.75 (1 min), 1 (30 s)
    tremor(t, o) {
      const k = (o && o.intensidade != null) ? o.intensidade : 0.5;
      const dur = 1.4 + k * 1.6;
      chiado({ at: t, dur, filtro: 'lowpass', ff: 90 + k * 80, vol: 0.5 + k * 0.4, a: 0.3, trem: [6 + k * 6, 0.3] });
      tom({ at: t, f: 42, f2: 36, dur, vol: 0.35 + k * 0.3, a: 0.3, vib: [5, 3] });
      for (let i = 0; i < 3 + k * 6; i++) chiado({ at: t + rnd(0.2, dur - 0.2), dur: 0.08, ff: rnd(500, 1500), q: 2, vol: 0.08 + k * 0.06 });
    },
    rugido(t, o) { rugido(t, (o && o.duracao) || 1.2, (o && o.grave) || 1, 0.38); },
    despertar(t) {
      SONS.tremor(t, { intensidade: 1 });
      rugido(t + 0.8, 2.4, 0.6, 0.26);
      [55, 82.4, 110, 164.8].forEach((f, i) => tom({ at: t + 0.8, f, dur: 4 - i * 0.6, vol: 0.18 / (i + 1), tipo: 'sine', rev: 0.9 }));
      [38, 45, 50].forEach((m) => tom({ at: t + 1.2, f: m2f(m), dur: 3, vol: 0.06, tipo: 'sawtooth', filtro: 'lowpass', ff: 600, a: 0.6, rev: 0.6, curva: 'sustenta' }));
    },
    soproAncestral(t) { ATAQUES.trevas(t, 2); ATAQUES.fogo(t + 0.2, 1.6); rugido(t, 0.8, 0.7, 0.14); },

    // --- telas finais ---
    finalVitoria(t) {
      const lat = { tipo: 'sawtooth', filtro: 'lowpass', ff: 2600, a: 0.03, rev: 0.5 };
      [[60, 0, 0.2], [67, 0.2, 0.2], [72, 0.4, 0.4], [71, 0.8, 0.2], [72, 1.0, 0.2], [76, 1.2, 0.2], [79, 1.4, 1.6]].forEach(([m, d, du]) =>
        tom(Object.assign({ at: t + d, f: m2f(m), dur: du, vol: 0.1, vib: du > 1 ? [5, 4] : null }, lat)));
      [48, 55, 64, 67, 72].forEach((m) => tom(Object.assign({ at: t + 1.4, f: m2f(m), dur: 1.8, vol: 0.05, curva: 'sustenta' }, lat)));
      tom({ at: t + 1.4, f: 65, f2: 40, dur: 0.6, vol: 0.5 });
      brilho(t + 1.4, 12, 0.07, 2200);
    },
    finalDerrota(t) {
      [[62, 0, 0.5], [60, 0.5, 0.5], [58, 1.0, 0.5], [57, 1.5, 1.6]].forEach(([m, d, du]) =>
        tom({ at: t + d, f: m2f(m), dur: du, vol: 0.12, tipo: 'sawtooth', filtro: 'lowpass', ff: 1200, a: 0.05, vib: [4, 4], rev: 0.6, curva: 'sustenta' }));
      [38, 45, 49].forEach((m) => tom({ at: t + 1.5, f: m2f(m), dur: 2.2, vol: 0.07, tipo: 'sawtooth', filtro: 'lowpass', ff: 500, a: 0.3, rev: 0.6, curva: 'sustenta' }));
      rugido(t + 1.6, 1.6, 0.6, 0.1);
    },
  };

  // Espaçamento mínimo entre repetições do mesmo som (ms), para cliques em rajada.
  const INTERVALO = { coletar: 45, colher: 45, clique: 30, acerto: 40, aba: 40, plantar: 40, erro: 120, tremor: 800 };

  function play(nome, o) {
    if (!AC || st.mudo || st.volEfeitos <= 0) return false;
    const fn = SONS[nome];
    if (!fn) { console.warn('[Som] efeito desconhecido:', nome); return false; }
    iniciarContexto();
    if (ctx.state !== 'running') return false;
    const agora = performance.now(), min = INTERVALO[nome] || 0;
    if (min && ultimoTocado[nome] && agora - ultimoTocado[nome] < min) return false;
    ultimoTocado[nome] = agora;
    try { fn(ctx.currentTime + 0.01, o || {}); } catch (e) { console.warn('[Som]', nome, e); }
    return true;
  }

  // ------------------------------------------------------------------
  // Música: sequenciador em semicolcheias com agendamento antecipado.
  // ------------------------------------------------------------------
  const I = { // instrumentos da música
    pluck(f, at, dur, vol, out) { tom({ at, f, dur, vol, tipo: 'triangle', filtro: 'lowpass', ff: 3000, ff2: 600, dest: out }); },
    sino(f, at, dur, vol, out) { tom({ at, f, dur, vol, dest: out, rev: 0.5 }); tom({ at, f: f * 3, dur: dur * 0.3, vol: vol * 0.25, dest: out, rev: 0.5 }); },
    epiano(f, at, dur, vol, out) { tom({ at, f, dur, vol, dest: out, rev: 0.3 }); tom({ at, f: f * 2, dur: dur * 0.4, vol: vol * 0.3, tipo: 'triangle', dest: out }); },
    lead(f, at, dur, vol, out, tipo) { tom({ at, f, dur, vol, tipo: tipo || 'square', filtro: 'lowpass', ff: 2600, a: 0.01, dest: out, rev: 0.25, curva: 'sustenta', vib: dur > 0.3 ? [5.5, 4] : null }); },
    trompa(f, at, dur, vol, out) {
      tom({ at, f, dur, vol, tipo: 'sawtooth', filtro: 'lowpass', ff: 900, a: 0.08, dest: out, rev: 0.6, curva: 'sustenta', vib: [4.5, 3] });
      tom({ at, f, dur, vol: vol * 0.7, tipo: 'sawtooth', filtro: 'lowpass', ff: 900, a: 0.08, dest: out, detune: 9, curva: 'sustenta' });
    },
    baixo(f, at, dur, vol, out, ff) { tom({ at, f, dur, vol, tipo: 'sawtooth', filtro: 'lowpass', ff: ff || 700, q: 4, dest: out, curva: 'sustenta', a: 0.01 }); },
    baixoSuave(f, at, dur, vol, out) { tom({ at, f, dur, vol, tipo: 'triangle', dest: out, curva: 'sustenta', a: 0.01 }); },
    pad(notas, at, dur, vol, out, ff) {
      notas.forEach((m) => [-7, 7].forEach((dt) =>
        tom({ at, f: m2f(m), dur, vol, tipo: 'sawtooth', filtro: 'lowpass', ff: ff || 1100, a: dur * 0.3, detune: dt, dest: out, rev: 0.5, curva: 'sustenta' })));
    },
    bumbo(at, vol, out) { tom({ at, f: 150, f2: 42, glide: 0.12, dur: 0.3, vol, dest: out }); },
    caixa(at, vol, out) { chiado({ at, dur: 0.14, ff: 1800, q: 0.7, vol, dest: out }); tom({ at, f: 220, f2: 150, dur: 0.08, vol: vol * 0.6, tipo: 'triangle', dest: out }); },
    chimbal(at, vol, out, aberto) { chiado({ at, dur: aberto ? 0.18 : 0.04, filtro: 'highpass', ff: 7500, vol, dest: out }); },
    taiko(at, vol, out) { tom({ at, f: 95, f2: 48, glide: 0.2, dur: 0.6, vol, dest: out, rev: 0.4 }); chiado({ at, dur: 0.08, filtro: 'lowpass', ff: 500, vol: vol * 0.5, dest: out }); },
    coracao(at, vol, out) { tom({ at, f: 70, f2: 40, dur: 0.18, vol, dest: out }); },
  };

  const _ = null;
  const FAIXAS = {
    // Ilha: alegre, Dó maior pentatônico. Responde a Som.tensao().
    ilha: {
      bpm: 112, compassos: 16,
      acordes: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]],
      raiz: [36, 33, 41, 43],
      melodia: [
        [76, _, 79, 76, 72, _, 74, 76], [72, _, 69, _, 72, 74, 76, _],
        [81, _, 79, 76, 77, _, 76, 74], [74, _, 79, _, 74, 71, 74, _],
        [76, 79, 84, _, 83, 81, 79, _], [81, _, 76, _, 79, 76, 72, _],
        [77, _, 81, _, 79, 77, 76, 74], [74, _, _, 71, 74, _, _, _],
      ],
      passo(s, at, out, sem) {
        const c = Math.floor(s / 16) % this.compassos, p = s % 16, ac = c % 4;
        const tens = st.tensao;
        const notas = this.acordes[ac];
        if (p === 0) I.pad(notas.map((m) => m - 12), at, sem * 16, 0.016 * (1 - tens * 0.4), out, 900 - tens * 300);
        if (p % 8 === 0) I.baixoSuave(m2f(this.raiz[ac]), at, sem * 3, 0.16, out);
        if (p === 6 || p === 14) I.baixoSuave(m2f(this.raiz[ac] + 7), at, sem * 1.5, 0.1, out);
        if (p % 2 === 0) { // arpejo em colcheias
          const ordem = [0, 1, 2, 1][(p / 2) % 4];
          I.pluck(m2f(notas[ordem] + 12), at, sem * 2, 0.045, out);
        }
        // melodia nos compassos 0–7, sinos espaçados nos 8–15
        if (p % 2 === 0) {
          if (c < 8) { const m = this.melodia[c][p / 2]; if (m) I.sino(m2f(m), at, sem * 3, 0.07, out); }
          else if (p % 4 === 0 && (p === 0 || Math.random() < 0.4)) I.sino(m2f(escolha(notas) + 24), at, sem * 4, 0.035, out);
        }
        // percussão leve
        if (p % 4 === 2) I.chimbal(at, 0.03, out);
        if (p === 0 || p === 10) I.bumbo(at, 0.18 * (1 - tens * 0.5), out);
        // tensão: batimento grave e drone
        if (tens > 0.05) {
          if (p === 0 || p === 3 || p === 8 || p === 11) I.coracao(at, 0.35 * tens, out);
          if (p === 0) tom({ at, f: m2f(this.raiz[ac] - 12), dur: sem * 16, vol: 0.06 * tens, tipo: 'sawtooth', filtro: 'lowpass', ff: 220, dest: out, curva: 'sustenta', a: 0.3 });
          if (tens > 0.6 && p % 4 === 0) I.chimbal(at, 0.04 * tens, out);
        }
      },
    },

    // Arena: rápida e heroica, Lá menor.
    batalha: {
      bpm: 144, compassos: 16,
      acordes: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]],
      raiz: [45, 41, 48, 43, 45, 41, 43, 40],
      melodia: [
        [69, _, 72, 76, 74, 72, 71, 72], [69, _, _, 65, 69, 72, 77, 76],
        [76, _, 79, 76, 72, _, 76, 79], [79, 77, 76, 74, 71, _, 74, _],
        [81, _, 79, 76, 72, _, 76, 81], [77, _, 76, 72, 69, 72, 77, _],
        [79, _, 77, 74, 71, 74, 79, _], [80, _, 76, _, 71, _, 68, _],
      ],
      passo(s, at, out, sem) {
        const c = Math.floor(s / 16) % this.compassos, p = s % 16, ac = c % 8;
        const notas = this.acordes[ac], r = this.raiz[ac];
        if (p === 0) I.pad(notas, at, sem * 16, 0.012, out, 1600);
        if (p % 2 === 0) I.baixo(m2f(p % 4 === 0 ? r : r + 12), at, sem * 1.6, 0.11, out, 900);
        if (c >= 8) I.pluck(m2f(notas[[0, 1, 2, 1][p % 4]] + 12), at, sem, 0.035, out);
        if (p % 2 === 0) { const m = this.melodia[ac][p / 2]; if (m) I.lead(m2f(m), at, sem * 1.8, c >= 8 ? 0.045 : 0.055, out); }
        if (p === 0 || p === 8 || p === 10) I.bumbo(at, 0.32, out);
        if (p === 4 || p === 12) I.caixa(at, 0.16, out);
        if (p % 2 === 0) I.chimbal(at, 0.035, out, p % 4 === 2);
        if (c % 4 === 3 && p >= 12) I.caixa(at, 0.08 + (p - 12) * 0.02, out);
      },
    },

    // Invasão Final: sombria e pesada, Ré menor com toque frígio.
    invasao: {
      bpm: 84, compassos: 16,
      acordes: [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52], [50, 53, 57], [51, 55, 58], [48, 52, 55], [45, 49, 52]],
      raiz: [38, 34, 31, 33, 38, 39, 36, 33],
      trompa: [[62, _, 65, 64], [62, _, _, _], [67, _, 65, 62], [61, _, 64, _], [69, _, 70, 69], [67, _, 63, _], [64, 65, 67, 64], [61, _, _, _]],
      passo(s, at, out, sem) {
        const c = Math.floor(s / 16) % this.compassos, p = s % 16, ac = c % 8;
        const notas = this.acordes[ac], r = this.raiz[ac];
        if (p === 0) {
          I.pad(notas.map((m) => m + 12), at, sem * 16, 0.014, out, 1000);
          tom({ at, f: m2f(r), dur: sem * 16, vol: 0.08, tipo: 'sawtooth', filtro: 'lowpass', ff: 260, q: 3, dest: out, curva: 'sustenta', a: 0.2 });
          tom({ at, f: m2f(r - 12), dur: sem * 16, vol: 0.1, tipo: 'sine', dest: out, curva: 'sustenta', a: 0.2 });
        }
        if (p === 0 || p === 8) I.taiko(at, 0.5, out);
        if (p === 3 || p === 6 || p === 11) I.taiko(at, 0.22, out);
        if (c % 2 === 1 && (p === 14 || p === 15)) I.taiko(at, 0.3, out);
        if (p % 4 === 0) { const m = this.trompa[ac][p / 4]; if (m) I.trompa(m2f(c >= 8 ? m + 12 : m), at, sem * (this.trompa[ac][p / 4 + 1] === _ ? 7.5 : 3.8), 0.05, out); }
        if (c >= 8) { // ostinato de cordas na segunda metade
          const ost = [notas[0] + 24, notas[2] + 12, notas[1] + 12, notas[2] + 12];
          tom({ at, f: m2f(ost[p % 4]), dur: sem * 0.9, vol: 0.022, tipo: 'sawtooth', filtro: 'lowpass', ff: 2000, dest: out });
        }
        if (p % 4 === 2) I.chimbal(at, 0.02, out);
      },
    },

    // Placar / tela final: calma e reflexiva, Fá maior.
    placar: {
      bpm: 88, compassos: 8,
      acordes: [[53, 57, 60, 64], [57, 60, 64, 67], [58, 62, 65, 69], [60, 64, 67, 70]],
      raiz: [41, 45, 46, 48],
      passo(s, at, out, sem) {
        const c = Math.floor(s / 16) % this.compassos, p = s % 16, ac = c % 4;
        const notas = this.acordes[ac];
        if (p === 0 || p === 6 || p === 10) notas.forEach((m) => I.epiano(m2f(m), at, sem * 5, 0.025, out));
        if (p === 0 || p === 8) I.baixoSuave(m2f(this.raiz[ac]), at, sem * 7, 0.12, out);
        if (p % 4 === 0 && Math.random() < 0.55) I.sino(m2f(escolha(notas) + 24), at, sem * 5, 0.04, out);
        if (p === 0) I.pad(notas.map((m) => m - 12), at, sem * 16, 0.008, out, 800);
      },
    },
  };

  const mus = { atual: null, timer: null };

  function iniciarMusicaSePreciso() {
    if (!ctx || ctx.state !== 'running') return;
    const quer = st.faixa;
    if ((mus.atual && mus.atual.nome) === quer) return;
    trocarFaixa(quer);
  }

  function trocarFaixa(nome) {
    const t = ctx.currentTime;
    if (mus.atual) { // fade-out da anterior; as notas já agendadas terminam nesse ganho
      const velha = mus.atual;
      velha.ganho.gain.cancelScheduledValues(t);
      velha.ganho.gain.setValueAtTime(velha.ganho.gain.value, t);
      velha.ganho.gain.linearRampToValueAtTime(0, t + 1.2);
      setTimeout(() => velha.ganho.disconnect(), 1800);
      mus.atual = null;
    }
    if (!nome || !FAIXAS[nome]) { pararTimer(); return; }
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 1.0);
    g.connect(busMusica);
    mus.atual = { nome, faixa: FAIXAS[nome], ganho: g, passo: 0, prox: t + 0.1 };
    if (!mus.timer) mus.timer = setInterval(agendar, 25);
  }
  function pararTimer() { if (mus.timer) { clearInterval(mus.timer); mus.timer = null; } }

  function agendar() {
    const a = mus.atual;
    if (!a || !ctx || ctx.state !== 'running') return;
    const sem = 60 / a.faixa.bpm / 4;
    // se o relógio pulou (aba voltou), não tenta recuperar notas perdidas
    if (a.prox < ctx.currentTime - 0.2) a.prox = ctx.currentTime + 0.05;
    while (a.prox < ctx.currentTime + 0.15) {
      try { a.faixa.passo(a.passo, a.prox, a.ganho, sem); } catch (e) { console.warn('[Som] música', e); }
      a.prox += sem; a.passo++;
    }
  }

  function musica(nome) {
    if (nome && !FAIXAS[nome]) { console.warn('[Som] faixa desconhecida:', nome); return; }
    st.faixa = nome || null;
    if (ctx && ctx.state === 'running') trocarFaixa(st.faixa);
    avisar();
  }

  // ------------------------------------------------------------------
  // Controles prontos (botão de mudo + dois volumes)
  // ------------------------------------------------------------------
  let cssInjetado = false;
  function injetarCss() {
    if (cssInjetado) return; cssInjetado = true;
    const s = document.createElement('style');
    s.textContent = `
.som-ctrl{display:inline-flex;align-items:center;gap:8px;font:13px/1.2 system-ui,sans-serif;color:inherit}
.som-ctrl button{all:unset;cursor:pointer;font-size:18px;width:32px;height:32px;display:grid;place-items:center;border-radius:8px;background:rgba(127,127,127,.18)}
.som-ctrl button:hover{background:rgba(127,127,127,.3)}
.som-ctrl button:focus-visible{outline:2px solid currentColor}
.som-ctrl label{display:inline-flex;align-items:center;gap:4px;opacity:.9}
.som-ctrl input[type=range]{width:80px;accent-color:#f5a623}
.som-ctrl.som-compacto label{display:none}
.som-ctrl.som-compacto:hover label,.som-ctrl.som-compacto:focus-within label{display:inline-flex}`;
    document.head.appendChild(s);
  }

  function criarControles(alvo, opcoes) {
    injetarCss();
    const el = document.createElement('div');
    el.className = 'som-ctrl' + (opcoes && opcoes.compacto ? ' som-compacto' : '');
    el.innerHTML = `<button type="button" data-som="mudo" aria-label="Som ligado"></button>
<label title="Música">🎵<input type="range" min="0" max="100" data-som="musica" aria-label="Volume da música"></label>
<label title="Efeitos">💥<input type="range" min="0" max="100" data-som="efeitos" aria-label="Volume dos efeitos"></label>`;
    const b = el.querySelector('[data-som=mudo]'), rm = el.querySelector('[data-som=musica]'), re = el.querySelector('[data-som=efeitos]');
    const sync = (e) => {
      b.textContent = e.mudo ? '🔇' : '🔊';
      b.setAttribute('aria-label', e.mudo ? 'Som desligado (clique para ligar)' : 'Som ligado (clique para desligar)');
      b.title = (e.mudo ? 'Ligar som' : 'Desligar som') + ' (M)';
      if (document.activeElement !== rm) rm.value = Math.round(e.volMusica * 100);
      if (document.activeElement !== re) re.value = Math.round(e.volEfeitos * 100);
    };
    // pointerdown não deve propagar para o ouvinte global do jogo
    ['pointerdown', 'pointerup', 'click'].forEach((ev) => el.addEventListener(ev, (e) => e.stopPropagation()));
    b.addEventListener('click', () => alternarMudo());
    rm.addEventListener('input', () => volumeMusica(rm.value / 100));
    re.addEventListener('input', () => volumeEfeitos(re.value / 100));
    re.addEventListener('change', () => play('clique'));
    aoMudar(sync); sync(estado());
    if (alvo) alvo.appendChild(el);
    return el;
  }

  // ------------------------------------------------------------------
  // API pública
  // ------------------------------------------------------------------
  function mudo(v) { st.mudo = !!v; aplicarVolumes(); avisar(); }
  function alternarMudo() { mudo(!st.mudo); if (!st.mudo) desbloquear(); return st.mudo; }
  const lim = (v) => Math.max(0, Math.min(1, +v || 0));
  function volume(v) { if (v === undefined) return st.volume; st.volume = lim(v); aplicarVolumes(); avisar(); }
  function volumeMusica(v) { if (v === undefined) return st.volMusica; st.volMusica = lim(v); aplicarVolumes(); avisar(); }
  function volumeEfeitos(v) { if (v === undefined) return st.volEfeitos; st.volEfeitos = lim(v); aplicarVolumes(); avisar(); }
  function tensao(v) { if (v === undefined) return st.tensao; st.tensao = lim(v); avisar(); }
  function pausar() { st.pausadoPeloJogo = true; if (ctx) ctx.suspend(); }
  function retomar() { st.pausadoPeloJogo = false; if (ctx && !document.hidden) ctx.resume().then(iniciarMusicaSePreciso); }
  function aoMudar(fn) { ouvintes.push(fn); return () => { const i = ouvintes.indexOf(fn); if (i >= 0) ouvintes.splice(i, 1); }; }
  function ligarTeclaM() {
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) alternarMudo();
    });
  }

  window.Som = {
    play, musica, tensao, pausar, retomar,
    mudo, alternarMudo, volume, volumeMusica, volumeEfeitos,
    estado, aoMudar, criarControles, ligarTeclaM, desbloquear,
    efeitos: Object.keys(SONS), faixas: Object.keys(FAIXAS),
    elementos: Object.keys(ATAQUES),
  };
})();
