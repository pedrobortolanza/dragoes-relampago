/* Dragões Relâmpago: cutscenes da lore.
 * Módulo autossuficiente: injeta o próprio CSS, desenha tudo em <canvas> (sem imagens, sem emojis).
 * Uso: Cutscene.play('abertura', { modo: 'padrao' }).then(r => ...)
 * Texto canônico da história: lore/HISTORIA.md
 */
(function (global) {
  'use strict';

  // ---------- Cores dos elementos (as mesmas da interface do jogo) ----------
  const EL = {
    fogo: '#ff6a2b', agua: '#3aa8ff', planta: '#5fd35a', terra: '#c08a4a', eletrico: '#ffe14a',
    gelo: '#a8eeff', metal: '#c3ccd6', trevas: '#9a5cff', luz: '#fff3b0',
  };
  const NOVE = Object.keys(EL).map((k) => EL[k]);

  // ---------- Personagens ----------
  const QUEM = {
    narrador: { nome: '', cor: '#ffd25c' },
    iara: { nome: 'Mestra Iara', cor: '#7ff0ff' },
    voragon: { nome: 'Vorágon', cor: '#ff5a4a' },
  };

  // ---------- Roteiros ----------
  // palco: cenário do canvas. quem: personagem. texto: fala ({tempo} e {onda} são trocados).
  // flash: clarão branco na entrada. tremor: 0..1 sacode a câmera. som: [efeito, opções] do audio.js.
  // so / exceto: 'infinito' mostra a cena só no modo Infinito / em todos menos o Infinito.
  // titulo: cartão de título no lugar da caixa de fala.
  const ROTEIROS = {
    abertura: {
      musica: null,
      cenas: [
        { palco: 'tempestade', quem: 'narrador', texto: 'No começo, só havia mar e tempestade.' },
        { palco: 'clarao', quem: 'narrador', flash: true, som: ['tremor', { intensidade: 0.4 }],
          texto: 'Então caiu o Primeiro Relâmpago. Do clarão nasceram a Ilha Relâmpago e nove faíscas: os primeiros dragões.' },
        { palco: 'sombra', quem: 'narrador',
          texto: 'Mas todo clarão deixa uma sombra. Dela nasceu Vorágon, Aquele que Engole Tempestades, faminto pelas nove faíscas.' },
        { palco: 'selo', quem: 'narrador',
          texto: 'Os antigos Guardiões uniram os nove elementos e o prenderam sob a ilha, no Selo dos Nove. Ele dorme até hoje.' },
        { palco: 'tremor', quem: 'iara', tremor: 0.35, som: ['tremor', { intensidade: 0.6 }],
          texto: 'Sentiu isso? O selo está rachando. Os Guardiões se foram, e eu estou velha demais para lutar.' },
        { palco: 'ovo', quem: 'iara',
          texto: 'Este é o último ovo de Fogo da ilha. Choque dragões, cruze elementos e vença as Provas da Arena.' },
        { palco: 'ilha', quem: 'iara', exceto: 'infinito',
          texto: 'Vorágon desperta em {tempo}. Quando ele vier, só três dragões poderão enfrentá-lo. Escolha bem.' },
        { palco: 'ilha', quem: 'iara', so: 'infinito',
          texto: 'O selo já não segura. Ele vai subir a cada quinze minutos, mais forte a cada vez. Aguente o quanto puder.' },
        { palco: 'titulo', titulo: 'Dragões Relâmpago', sub: 'O Selo dos Nove', dur: 3.2 },
      ],
    },
    sonho: {
      cenas: [
        { palco: 'sonho', quem: 'iara',
          texto: 'Só os campeões entram no sonho do Ancestral. Lá dentro ele ainda dorme, e pode ser ferido.' },
        { palco: 'sonho', quem: 'iara', texto: 'Uma cicatriz feita no sonho continua aberta quando ele acorda. Mire bem.' },
      ],
    },
    despertar: {
      musica: 'invasao',
      cenas: [
        { palco: 'tremor', quem: 'narrador', tremor: 1, rachas: 1, som: ['tremor', { intensidade: 1 }],
          texto: 'O Selo dos Nove se parte. O chão da ilha se abre.' },
        { palco: 'olhos', quem: 'narrador', som: ['despertar'], texto: 'Sob as rochas, dois olhos se acendem.' },
        { palco: 'ancestral', quem: 'voragon', tremor: 0.5, flash: true,
          texto: 'MIL ANOS NO ESCURO. Eu sou a sombra do Primeiro Relâmpago, e as nove faíscas são minhas.' },
        { palco: 'ancestral', quem: 'iara', texto: 'Agora! Escolha três dragões. Tudo o que você construiu decide este momento.' },
      ],
    },
    despertarOnda: {
      musica: 'invasao',
      cenas: [
        { palco: 'tremor', quem: 'narrador', tremor: 0.9, rachas: 1, som: ['tremor', { intensidade: 1 }],
          texto: 'Invasão {onda}. A fenda se abre de novo.' },
        { palco: 'ancestral', quem: 'voragon', tremor: 0.5, flash: true, som: ['despertar'],
          texto: 'Você me derrubou. Eu comi a tempestade que me derrubou, e voltei maior.' },
        { palco: 'ancestral', quem: 'iara', texto: 'Três dragões, de novo. Ele está mais forte, e nós também.' },
      ],
    },
    ondaVencida: {
      cenas: [
        { palco: 'vitoria', quem: 'narrador', texto: 'Vorágon afunda na fenda. O selo se fecha, mas não por inteiro.' },
        { palco: 'ilha', quem: 'iara', texto: 'Ele vai voltar em quinze minutos. Colete, cruze, treine. Não pare agora.' },
      ],
    },
    vitoria: {
      cenas: [
        { palco: 'vitoria', quem: 'narrador', flash: true, texto: 'Vorágon cai de volta na fenda. O Selo dos Nove se fecha, brilhando nas nove cores.' },
        { palco: 'vitoria', quem: 'voragon', texto: 'Mil anos... passam... rápido...' },
        { palco: 'amanhecer', quem: 'iara', texto: 'A ilha resistiu. De hoje em diante, a ilha tem uma nova guarda: você.' },
      ],
    },
    derrota: {
      cenas: [
        { palco: 'derrota', quem: 'voragon', tremor: 0.3, texto: 'As faíscas voltam para a sombra de onde vieram.' },
        { palco: 'derrota', quem: 'iara', texto: 'A cicatriz que você deixou nele não fecha. A próxima guarda vai saber onde mirar.' },
      ],
    },
    semDefesa: {
      cenas: [
        { palco: 'vazio', quem: 'narrador', texto: 'Vorágon despertou e encontrou os habitats vazios. Ninguém ficou para defender a ilha.' },
      ],
    },
  };

  const TEMPO_MODO = { rapido: '10 minutos', padrao: '20 minutos', longa: '30 minutos', infinito: '15 minutos' };

  // ---------- CSS ----------
  const CSS = `
.cs-root{position:fixed;inset:0;z-index:2147483000;background:#05030c;overflow:hidden;user-select:none;-webkit-user-select:none;
  font-family:"Nunito",system-ui,sans-serif;color:#fff;cursor:pointer;opacity:0;transition:opacity .5s}
.cs-root.on{opacity:1}
.cs-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.cs-bar{position:absolute;left:0;right:0;height:9vh;background:#000;transition:transform .7s cubic-bezier(.2,.8,.2,1);z-index:2}
.cs-bar.t{top:0;transform:translateY(-100%)} .cs-bar.b{bottom:0;transform:translateY(100%)}
.cs-root.on .cs-bar{transform:none}
.cs-fade{position:absolute;inset:0;background:#000;opacity:1;transition:opacity .45s;pointer-events:none;z-index:3}
.cs-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:4}
.cs-flash.go{animation:csflash .7s ease-out}
@keyframes csflash{0%{opacity:.95}100%{opacity:0}}
.cs-skip{position:absolute;top:calc(9vh + 12px);right:16px;z-index:6;font-family:"Lilita One","Trebuchet MS",sans-serif;font-size:1rem;
  color:#fff;padding:8px 16px 8px 14px;border:2px solid #1b1230;border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:8px;
  background:linear-gradient(180deg,#8573c9 0%,#6b5aa8 45%,#43357c 100%);text-shadow:0 2px 0 rgba(0,0,0,.45);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -3px 0 rgba(0,0,0,.22),0 4px 0 #1b1230,0 7px 10px rgba(0,0,0,.35)}
.cs-skip:hover{filter:brightness(1.12)} .cs-skip:active{transform:translateY(3px);box-shadow:0 1px 0 #1b1230}
.cs-skip i{display:inline-block;width:0;height:0;border-left:7px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent;margin-right:-4px}
.cs-skip:focus-visible{outline:3px solid #ffd25c;outline-offset:3px}
.cs-box{position:absolute;left:50%;bottom:calc(9vh + 18px);transform:translate(-50%,20px);width:min(880px,calc(100% - 32px));z-index:5;
  display:flex;gap:16px;align-items:flex-end;opacity:0;transition:opacity .35s,transform .35s}
.cs-box.on{opacity:1;transform:translate(-50%,0)}
.cs-port{flex:none;width:104px;height:104px;border-radius:50%;border:3px solid #1b1230;overflow:hidden;
  box-shadow:0 0 0 3px #ffd25c,0 6px 0 #1b1230,0 10px 18px rgba(0,0,0,.5);background:#2f2656}
.cs-port svg{width:100%;height:100%;display:block}
.cs-panel{position:relative;flex:1;min-height:104px;padding:20px 22px 18px;border:3px solid #1b1230;border-radius:16px;
  background:linear-gradient(180deg,rgba(74,61,122,.96) 0%,rgba(47,38,86,.97) 100%);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.18),inset 0 -4px 0 rgba(0,0,0,.25),0 6px 0 #1b1230,0 12px 24px rgba(0,0,0,.5)}
.cs-name{position:absolute;top:-17px;left:16px;font-family:"Lilita One","Trebuchet MS",sans-serif;font-size:1.05rem;padding:3px 14px;
  border:2px solid #1b1230;border-radius:10px;background:linear-gradient(180deg,#ffdf6b,#ffa531 55%,#f0670f);text-shadow:0 2px 0 #8f3a05;
  box-shadow:0 3px 0 #1b1230}
.cs-name.voragon{background:linear-gradient(180deg,#ff8a7a,#e0303a 55%,#7a0f2a);text-shadow:0 2px 0 #4a0612}
.cs-name.iara{background:linear-gradient(180deg,#8ff4ff,#2bb3ea 55%,#1672c4);text-shadow:0 2px 0 #0b4378}
.cs-text{font-size:clamp(1rem,2.3vw,1.22rem);font-weight:700;line-height:1.45;text-shadow:0 2px 0 rgba(0,0,0,.4);min-height:2.9em}
.cs-panel.narr{background:linear-gradient(180deg,rgba(10,6,24,.82),rgba(10,6,24,.9));border-color:rgba(255,210,92,.55);box-shadow:none}
.cs-panel.narr .cs-text{font-style:italic;text-align:center;color:#ffe9b0}
.cs-panel.voragon .cs-text{color:#ffd2c8;letter-spacing:.3px}
.cs-more{position:absolute;right:16px;bottom:10px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;
  border-top:10px solid #ffd25c;opacity:0;animation:csbob .9s ease-in-out infinite}
.cs-more.on{opacity:1}
@keyframes csbob{50%{transform:translateY(4px)}}
.cs-dots{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(9vh - 22px);z-index:6;display:flex;gap:7px}
.cs-dots b{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25);border:1px solid rgba(0,0,0,.5);transition:background .3s}
.cs-dots b.on{background:#ffd25c}
.cs-title{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  opacity:0;transform:scale(.92);transition:opacity .8s,transform 1.4s cubic-bezier(.2,.8,.2,1);pointer-events:none;text-align:center;padding:0 16px}
.cs-title.on{opacity:1;transform:none}
.cs-title h1{margin:0;font-family:"Lilita One","Trebuchet MS",sans-serif;font-weight:400;font-size:clamp(2.4rem,9vw,5.6rem);line-height:1;
  color:#ffd25c;text-shadow:0 5px 0 #1b1230,3px 0 0 #1b1230,-3px 0 0 #1b1230,0 -3px 0 #1b1230,0 0 40px rgba(255,190,60,.6)}
.cs-title p{margin:0;font-family:"Lilita One","Trebuchet MS",sans-serif;font-size:clamp(1.1rem,3.4vw,1.8rem);color:#bfe9ff;
  text-shadow:0 3px 0 #1b1230,2px 0 0 #1b1230,-2px 0 0 #1b1230}
@media (max-width:600px){.cs-port{width:64px;height:64px}.cs-panel{min-height:88px;padding:18px 14px 16px}.cs-box{gap:10px}}
@media (prefers-reduced-motion:reduce){.cs-flash.go{animation:none}.cs-more{animation:none}}
`;

  // ---------- Retratos (SVG desenhado, sem imagem externa) ----------
  const RETRATO = {
    iara: `<svg viewBox="0 0 100 100"><defs><radialGradient id="csIa" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#4fb6d8"/><stop offset="1" stop-color="#173a63"/></radialGradient></defs>
<rect width="100" height="100" fill="url(#csIa)"/>
<path d="M14 104 C16 72 30 58 50 58 C70 58 84 72 86 104Z" fill="#2c6f6a"/>
<path d="M22 104 C24 80 36 70 50 70 C64 70 76 80 78 104Z" fill="#3f9a8c"/>
<path d="M50 66 L44 104 M50 66 L56 104" stroke="#e8c26a" stroke-width="2.5"/>
<path d="M18 62 C14 34 30 12 50 12 C70 12 86 34 82 62 C76 52 72 40 70 34 C66 44 34 44 30 34 C28 40 24 52 18 62Z" fill="#245a57"/>
<ellipse cx="50" cy="44" rx="17" ry="20" fill="#c98f63"/>
<path d="M33 40 C34 26 42 22 50 22 C58 22 66 26 67 40 C62 32 56 30 50 30 C44 30 38 32 33 40Z" fill="#e9e6f2"/>
<path d="M33 40 C30 52 30 60 36 66 L38 46Z M67 40 C70 52 70 60 64 66 L62 46Z" fill="#e9e6f2"/>
<path d="M41 44 q3 -2 6 0 M53 44 q3 -2 6 0" stroke="#3a2418" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M44 55 q6 3 12 0" stroke="#7a3d2c" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M40 39 l4 -1 M60 39 l-4 -1" stroke="#a87250" stroke-width="1.5"/>
<circle cx="50" cy="27" r="4" fill="#7ff0ff" stroke="#e8c26a" stroke-width="1.5"/>
</svg>`,
    voragon: `<svg viewBox="0 0 100 100"><defs><radialGradient id="csVg" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#7a1424"/><stop offset="1" stop-color="#14060f"/></radialGradient>
<radialGradient id="csVe" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6a0"/><stop offset=".5" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff2a1a" stop-opacity="0"/></radialGradient></defs>
<rect width="100" height="100" fill="url(#csVg)"/>
<path d="M22 30 L8 4 L32 24Z M78 30 L92 4 L68 24Z" fill="#2a1430" stroke="#9a5cff" stroke-width="1.5"/>
<path d="M30 26 L24 10 L38 22Z M70 26 L76 10 L62 22Z" fill="#2a1430" stroke="#9a5cff" stroke-width="1"/>
<path d="M20 34 C26 20 74 20 80 34 L84 58 C78 72 66 86 50 98 C34 86 22 72 16 58Z" fill="#1d0c26" stroke="#5a2a7a" stroke-width="2"/>
<path d="M34 76 L50 98 L66 76 C60 82 40 82 34 76Z" fill="#2a1430"/>
<path d="M38 82 l3 7 l3 -7 M56 82 l3 7 l3 -7" fill="#f2e6d0"/>
<path d="M24 46 L44 52 L40 58 L22 52Z M76 46 L56 52 L60 58 L78 52Z" fill="url(#csVe)"/>
<path d="M28 48 L42 53 L39 56 L27 51Z M72 48 L58 53 L61 56 L73 51Z" fill="#ffe680"/>
<path d="M33 52 L34.5 50 L36 52 L34.5 55Z M67 52 L65.5 50 L64 52 L65.5 55Z" fill="#1a0505"/>
<path d="M50 30 L46 44 L50 40 L54 44Z" fill="#9a5cff" opacity=".8"/>
<path d="M30 66 l6 4 M70 66 l-6 4 M40 70 l3 2 M60 70 l-3 2" stroke="#ff5a2a" stroke-width="1.5" opacity=".7"/>
</svg>`,
  };

  // ---------- Utilidades de desenho ----------
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const lerp = (a, b, k) => a + (b - a) * k;
  function rnd(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

  function ceu(c, w, h, stops) {
    const g = c.createLinearGradient(0, 0, 0, h);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function estrelas(c, w, h, t, n, alpha) {
    for (let i = 0; i < n; i++) {
      const x = hash(i, 1) * w, y = hash(i, 2) * h * 0.6, tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(i, 3) * 3) + i);
      c.globalAlpha = alpha * (0.3 + 0.7 * tw); c.fillStyle = '#fff';
      c.fillRect(x, y, 1.6, 1.6);
    }
    c.globalAlpha = 1;
  }
  function mar(c, w, h, y0, t, cores) {
    const g = c.createLinearGradient(0, y0, 0, h);
    g.addColorStop(0, cores[0]); g.addColorStop(1, cores[1]);
    c.fillStyle = g; c.fillRect(0, y0, w, h - y0);
    for (let k = 0; k < 4; k++) {
      const yy = y0 + 8 + k * (h - y0) / 4.5, amp = 3 + k * 2, len = 60 + k * 30;
      c.beginPath(); c.moveTo(0, yy);
      for (let x = 0; x <= w; x += 12) c.lineTo(x, yy + Math.sin(x / len + t * (0.8 + k * 0.3) + k) * amp);
      c.strokeStyle = cores[2] || 'rgba(255,255,255,.12)'; c.lineWidth = 1.5 + k * 0.5; c.globalAlpha = 0.5 - k * 0.08; c.stroke();
    }
    c.globalAlpha = 1;
  }
  function nuvem(c, x, y, s, cor) {
    c.fillStyle = cor; c.beginPath();
    [[0, 0, 1], [0.9, -0.3, 0.8], [1.8, 0, 0.9], [-0.9, 0.1, 0.7], [0.4, 0.35, 0.9], [1.3, 0.35, 0.8]].forEach(([dx, dy, r]) => {
      c.moveTo(x + dx * 40 * s + r * 40 * s, y + dy * 40 * s); c.arc(x + dx * 40 * s, y + dy * 40 * s, r * 40 * s, 0, TAU);
    });
    c.fill();
  }
  function nuvens(c, w, h, t, cor, n, yMax, vel) {
    for (let i = 0; i < n; i++) {
      const s = 0.8 + hash(i, 5) * 1.4, v = (vel || 8) * (0.5 + hash(i, 6));
      const x = ((hash(i, 7) * (w + 400) + t * v) % (w + 400)) - 200, y = hash(i, 8) * yMax;
      nuvem(c, x, y, s, cor);
    }
  }
  // Ilha vista de lado (silhueta com grama, penhasco e detalhes). rachas: 0..1 brilho vermelho na rocha.
  function ilha(c, cx, base, lw, t, o) {
    o = o || {};
    const top = base - lw * 0.12;
    c.save();
    // rocha
    const gr = c.createLinearGradient(0, top, 0, base + lw * 0.32);
    gr.addColorStop(0, o.rocha1 || '#6a4a35'); gr.addColorStop(1, o.rocha2 || '#2a1a14');
    c.fillStyle = gr; c.beginPath();
    c.moveTo(cx - lw / 2, top + 6);
    c.bezierCurveTo(cx - lw * 0.42, base + lw * 0.1, cx - lw * 0.2, base + lw * 0.3, cx, base + lw * 0.34);
    c.bezierCurveTo(cx + lw * 0.2, base + lw * 0.3, cx + lw * 0.42, base + lw * 0.1, cx + lw / 2, top + 6);
    c.closePath(); c.fill();
    // camadas
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2;
    for (let k = 1; k < 4; k++) {
      c.beginPath(); const yy = top + k * lw * 0.07;
      c.moveTo(cx - lw * (0.48 - k * 0.05), yy); c.quadraticCurveTo(cx, yy + 10, cx + lw * (0.48 - k * 0.05), yy); c.stroke();
    }
    if (o.rachas) {
      c.save(); c.shadowColor = '#ff4a1a'; c.shadowBlur = 18 * o.rachas; c.strokeStyle = `rgba(255,120,40,${0.4 + 0.6 * o.rachas})`;
      c.lineWidth = 2 + 2 * o.rachas;
      const r = rnd(7); c.beginPath();
      for (let k = 0; k < 5; k++) {
        let x = cx + (r() - 0.5) * lw * 0.6, y = top + 10; c.moveTo(x, y);
        for (let j = 0; j < 5; j++) { x += (r() - 0.5) * 30; y += lw * 0.05 * (0.4 + o.rachas); c.lineTo(x, y); }
      }
      c.stroke(); c.restore();
    }
    // grama
    const gg = c.createLinearGradient(0, top - 10, 0, top + 18);
    gg.addColorStop(0, o.grama1 || '#7ed957'); gg.addColorStop(1, o.grama2 || '#3e8d34');
    c.fillStyle = gg; c.beginPath(); c.moveTo(cx - lw / 2 - 6, top + 10);
    c.quadraticCurveTo(cx - lw * 0.25, top - 14, cx, top - 10); c.quadraticCurveTo(cx + lw * 0.25, top - 14, cx + lw / 2 + 6, top + 10);
    c.quadraticCurveTo(cx, top + 22, cx - lw / 2 - 6, top + 10); c.fill();
    // árvores e casinhas (silhuetas)
    if (!o.vazia) {
      const sc = lw / 600;
      [[-0.36, 1.1], [-0.3, 0.8], [0.32, 1], [0.38, 0.75], [-0.05, 0.7]].forEach(([dx, s], i) => {
        const x = cx + dx * lw, y = top - 8 + Math.abs(dx) * 14, sw = Math.sin(t * 1.3 + i) * 2 * sc;
        c.fillStyle = '#5a3a22'; c.fillRect(x - 3 * sc * s, y - 18 * sc * s, 6 * sc * s, 18 * sc * s);
        c.fillStyle = o.arvore || '#2f7a33'; c.beginPath(); c.arc(x + sw, y - 28 * sc * s, 16 * sc * s, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(x + sw - 5 * sc, y - 33 * sc * s, 7 * sc * s, 0, TAU); c.fill();
      });
      [[-0.17, '#b5653a'], [0.15, '#7a5cc8'], [0.03, '#d9a441']].forEach(([dx, teto], i) => {
        const x = cx + dx * lw, y = top - 10, s = lw / 600;
        c.fillStyle = o.ruina ? '#6d665f' : '#e8dcc4'; c.fillRect(x - 16 * s, y - 20 * s, 32 * s, 20 * s);
        c.fillStyle = o.ruina ? '#4a423c' : teto; c.beginPath();
        if (o.ruina && i !== 1) { c.moveTo(x - 20 * s, y - 20 * s); c.lineTo(x - 4 * s, y - 34 * s); c.lineTo(x + 6 * s, y - 24 * s); c.lineTo(x + 20 * s, y - 20 * s); }
        else { c.moveTo(x - 20 * s, y - 20 * s); c.lineTo(x, y - 38 * s); c.lineTo(x + 20 * s, y - 20 * s); }
        c.fill();
        c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x - 4 * s, y - 11 * s, 8 * s, 11 * s);
      });
    }
    c.restore();
  }
  // Raio em zigue-zague
  function raio(c, x, y0, y1, seed, cor, largura) {
    const r = rnd(seed); c.save(); c.shadowColor = cor; c.shadowBlur = 24; c.strokeStyle = '#fff'; c.lineWidth = largura || 3;
    c.beginPath(); let x0 = x; c.moveTo(x0, y0);
    const n = 9;
    for (let i = 1; i <= n; i++) {
      x0 += (r() - 0.5) * 60; const y = lerp(y0, y1, i / n); c.lineTo(x0, y);
      if (r() < 0.3) { c.moveTo(x0, y); c.lineTo(x0 + (r() - 0.5) * 80, y + 40); c.moveTo(x0, y); }
    }
    c.stroke(); c.restore();
  }
  function chuva(c, w, h, t, n, alpha) {
    c.strokeStyle = `rgba(180,200,255,${alpha})`; c.lineWidth = 1.2; c.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = 700 + hash(i, 1) * 500, x = ((hash(i, 2) * w * 1.3 + t * 160) % (w * 1.3)) - w * 0.15, y = (hash(i, 3) * h + t * sp) % h;
      c.moveTo(x, y); c.lineTo(x - 6, y + 18);
    }
    c.stroke();
  }
  function brasas(c, w, h, t, n, cor, sobe) {
    for (let i = 0; i < n; i++) {
      const v = 30 + hash(i, 1) * 80, x = hash(i, 2) * w + Math.sin(t + i) * 20;
      let y = (hash(i, 3) * h - t * v * (sobe === false ? -1 : 1)) % h; if (y < 0) y += h;
      c.globalAlpha = 0.3 + 0.6 * hash(i, 4) * (0.6 + 0.4 * Math.sin(t * 4 + i));
      c.fillStyle = cor; c.beginPath(); c.arc(x, y, 1 + hash(i, 5) * 2.2, 0, TAU); c.fill();
    }
    c.globalAlpha = 1;
  }
  function brilho(c, x, y, r, cor, a) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, cor); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = a == null ? 1 : a; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.globalAlpha = 1;
  }
  // Silhueta do Ancestral de frente, asas abertas. s = escala (1 ≈ 520 px de envergadura). bate: fase da asa.
  function ancestral(c, x, y, s, bate, o) {
    o = o || {};
    const corpo = o.cor || '#140a1e', borda = o.borda || '#ff3d2e';
    c.save(); c.translate(x, y); c.scale(s, s);
    c.shadowColor = borda; c.shadowBlur = o.semBrilho ? 0 : 30;
    const ab = Math.sin(bate) * 26;
    // asas
    [-1, 1].forEach((lado) => {
      c.save(); c.scale(lado, 1);
      c.fillStyle = o.asa || '#1f0f2c'; c.beginPath();
      c.moveTo(30, -40);
      c.quadraticCurveTo(120, -150 - ab, 250, -120 - ab * 1.4);
      c.lineTo(230, -90 - ab); c.quadraticCurveTo(210, -40 - ab * 0.6, 200, 10 - ab * 0.3);
      c.quadraticCurveTo(170, -10, 150, 30 - ab * 0.2);
      c.quadraticCurveTo(120, 10, 100, 50);
      c.quadraticCurveTo(80, 20, 40, 40); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(255,90,60,.35)'; c.lineWidth = 3; c.shadowBlur = 0; c.beginPath();
      c.moveTo(30, -40); c.lineTo(250, -120 - ab * 1.4); c.moveTo(80, -70 - ab * 0.4); c.lineTo(200, 10 - ab * 0.3);
      c.moveTo(70, -50); c.lineTo(150, 30 - ab * 0.2); c.moveTo(55, -40); c.lineTo(100, 50); c.stroke();
      c.restore();
    });
    c.shadowBlur = o.semBrilho ? 0 : 24;
    c.fillStyle = corpo;
    // corpo e pescoço
    c.beginPath(); c.ellipse(0, 40, 62, 90, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-26, -20); c.quadraticCurveTo(-30, -90, -18, -120); c.lineTo(18, -120); c.quadraticCurveTo(30, -90, 26, -20); c.fill();
    // cabeça
    c.beginPath(); c.moveTo(-34, -130); c.quadraticCurveTo(-40, -170, 0, -178); c.quadraticCurveTo(40, -170, 34, -130);
    c.quadraticCurveTo(22, -96, 0, -88); c.quadraticCurveTo(-22, -96, -34, -130); c.fill();
    // chifres
    c.beginPath(); c.moveTo(-26, -160); c.quadraticCurveTo(-60, -200, -50, -240); c.quadraticCurveTo(-40, -200, -14, -170); c.fill();
    c.beginPath(); c.moveTo(26, -160); c.quadraticCurveTo(60, -200, 50, -240); c.quadraticCurveTo(40, -200, 14, -170); c.fill();
    // garras / pernas
    c.beginPath(); c.ellipse(-44, 120, 20, 30, 0.3, 0, TAU); c.ellipse(44, 120, 20, 30, -0.3, 0, TAU); c.fill();
    // peito com placas
    c.shadowBlur = 0; c.strokeStyle = 'rgba(154,92,255,.35)'; c.lineWidth = 3;
    for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(-30 + k * 2, 0 + k * 22); c.quadraticCurveTo(0, 10 + k * 22, 30 - k * 2, 0 + k * 22); c.stroke(); }
    // olhos
    if (o.olhos !== false) {
      const a = o.olhos == null ? 1 : o.olhos;
      [-1, 1].forEach((l) => {
        brilho(c, l * 15, -140, 26, `rgba(255,120,40,${0.7 * a})`);
        c.fillStyle = `rgba(255,236,140,${a})`; c.beginPath(); c.moveTo(l * 4, -142); c.lineTo(l * 26, -148); c.lineTo(l * 22, -136); c.closePath(); c.fill();
      });
    }
    // boca acesa
    if (o.rugido) { brilho(c, 0, -100, 40 * o.rugido, 'rgba(255,90,30,.9)'); }
    c.restore();
  }
  // Ancestral dormindo, enrolado (para o selo e o sonho)
  function dormindo(c, x, y, s, t, cor, borda) {
    c.save(); c.translate(x, y); c.scale(s, s * (1 + Math.sin(t * 1.2) * 0.02));
    c.shadowColor = borda; c.shadowBlur = 20; c.fillStyle = cor;
    c.beginPath(); c.ellipse(0, 0, 120, 52, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(100, 10); c.quadraticCurveTo(170, 40, 120, 70); c.quadraticCurveTo(60, 80, 0, 56); c.lineTo(20, 40); c.quadraticCurveTo(90, 50, 100, 10); c.fill();
    c.beginPath(); c.ellipse(-110, 18, 46, 28, -0.2, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-130, 0); c.quadraticCurveTo(-170, -40, -150, -60); c.quadraticCurveTo(-140, -30, -112, -6); c.fill();
    c.beginPath(); c.moveTo(-40, -40); c.quadraticCurveTo(0, -110, 70, -70); c.quadraticCurveTo(20, -60, -10, -30); c.fill();
    c.shadowBlur = 0; c.strokeStyle = 'rgba(255,120,60,.5)'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-128, 16); c.quadraticCurveTo(-118, 22, -106, 16); c.stroke();
    c.restore();
  }
  function runas(c, cx, cy, r, t, quebra, achat) {
    achat = achat || 1;
    c.save(); c.translate(cx, cy); c.scale(1, achat);
    c.strokeStyle = 'rgba(255,230,160,.5)'; c.lineWidth = 2;
    c.setLineDash([10, 8]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.setLineDash([]);
    NOVE.forEach((cor, i) => {
      const a = i / 9 * TAU + t * 0.15, x = Math.cos(a) * r, y = Math.sin(a) * r;
      const apag = quebra && hash(i, 9) < quebra ? 0.2 + 0.2 * Math.sin(t * 20 + i) : 1;
      brilho(c, x, y, 26, cor, 0.6 * apag);
      c.save(); c.translate(x, y); c.rotate(a); c.globalAlpha = apag; c.strokeStyle = cor; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(-7, -9); c.lineTo(0, 9); c.lineTo(7, -9); c.moveTo(-6, 0); c.lineTo(6, 0); c.stroke(); c.restore();
    });
    c.restore();
  }
  function ovoFogo(c, cx, cy, s, t) {
    brilho(c, cx, cy, 180 * s, 'rgba(255,140,50,.45)');
    // ninho
    c.save(); c.strokeStyle = '#a07438'; c.lineWidth = 4 * s;
    for (let i = 0; i < 22; i++) {
      c.beginPath(); const a0 = hash(i, 1) * Math.PI;
      c.ellipse(cx, cy + 50 * s, 95 * s, 28 * s, 0, a0, a0 + 1.2); c.stroke();
    }
    c.fillStyle = '#6e4a22'; c.beginPath(); c.ellipse(cx, cy + 56 * s, 92 * s, 24 * s, 0, 0, Math.PI); c.fill();
    c.restore();
    // ovo
    const bal = Math.sin(t * 2.4) * 0.05;
    c.save(); c.translate(cx, cy + 40 * s); c.rotate(bal); c.translate(0, -40 * s);
    const g = c.createRadialGradient(-18 * s, -30 * s, 6 * s, 0, 0, 80 * s);
    g.addColorStop(0, '#ffe7a0'); g.addColorStop(0.45, '#ff8a2a'); g.addColorStop(1, '#9a2a10');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 52 * s, 68 * s, 0, 0, TAU); c.fill();
    c.strokeStyle = '#1b1230'; c.lineWidth = 3 * s; c.stroke();
    c.fillStyle = 'rgba(120,20,10,.5)';
    [[-20, -20, 9], [18, 4, 12], [-8, 30, 8], [22, -36, 6]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x * s, y * s, r * s, 0, TAU); c.fill(); });
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-20 * s, -34 * s, 10 * s, 16 * s, -0.4, 0, TAU); c.fill();
    c.restore();
  }

  // ---------- Palcos: cada um desenha o cenário no tempo t (segundos desde o início da cena) ----------
  const PALCOS = {
    tempestade(c, w, h, t) {
      ceu(c, w, h, ['#05040d', '#141a33', '#26304d']);
      nuvens(c, w, h, t, 'rgba(20,22,40,.85)', 9, h * 0.35, 14);
      const ciclo = t % 2.6, flash = ciclo < 0.18 ? 1 - ciclo / 0.18 : 0;
      if (flash > 0) { c.fillStyle = `rgba(200,210,255,${flash * 0.35})`; c.fillRect(0, 0, w, h); raio(c, w * (0.25 + hash(Math.floor(t / 2.6), 1) * 0.5), 0, h * 0.62, Math.floor(t / 2.6) + 3, '#9fb8ff'); }
      mar(c, w, h, h * 0.62, t * 1.6, ['#101a33', '#03060f', 'rgba(150,170,220,.25)']);
      chuva(c, w, h, t, 220, 0.35);
    },
    clarao(c, w, h, t) {
      ceu(c, w, h, ['#0c0b24', '#2b2a5a', '#5a4a7a']);
      estrelas(c, w, h, t, 60, 0.6);
      const cx = w / 2, mY = h * 0.66;
      if (t < 0.9) raio(c, cx, 0, mY, 11, '#fff3b0', 6 * (1 - t / 0.9) + 2);
      brilho(c, cx, mY - 20, Math.max(w, h) * 0.5 * (1 - ease(t / 3) * 0.6), 'rgba(255,240,180,.5)');
      const sobe = ease((t - 0.3) / 2.2);
      mar(c, w, h, mY, t, ['#1d2d5a', '#08102a', 'rgba(200,220,255,.25)']);
      c.save(); c.beginPath(); c.rect(0, 0, w, mY + 8); c.clip();
      ilha(c, cx, mY + 6 + (1 - sobe) * h * 0.3, Math.min(w * 0.6, 640), t, { vazia: true });
      c.restore();
      // nove faíscas
      const lw = Math.min(w * 0.7, 720);
      NOVE.forEach((cor, i) => {
        const k = ease((t - 0.6 - i * 0.08) / 1.8), a = Math.PI + (i + 0.5) / 9 * Math.PI;
        const tx = cx + Math.cos(a) * lw * 0.48, ty = mY - h * 0.18 + Math.sin(a) * h * 0.26 + Math.sin(t * 2 + i) * 6;
        const x = lerp(cx, tx, k), y = lerp(mY - 20, ty, k);
        if (k <= 0) return;
        brilho(c, x, y, 34, cor, 0.85); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill();
      });
    },
    sombra(c, w, h, t) {
      ceu(c, w, h, ['#070208', '#2a0a14', '#4a1218']);
      const a = ease(t / 2.5);
      ancestral(c, w / 2, h * 0.5 + 30, Math.min(w, h * 1.3) / 640, t * 1.6, { olhos: a, cor: '#0d0612' });
      nuvens(c, w, h, t, 'rgba(10,4,10,.8)', 8, h * 0.9, 18);
      brasas(c, w, h, t, 70, '#ff6a2a');
      // faíscas fugindo para baixo
      NOVE.forEach((cor, i) => {
        const x = w * (0.1 + i * 0.1), y = h * 0.88 + Math.sin(t * 3 + i) * 5;
        brilho(c, x, y, 18, cor, 0.7);
      });
    },
    selo(c, w, h, t) {
      // corte da ilha: o selo e o Ancestral dormem numa caverna dentro da rocha
      const base = h * 0.3, lw = Math.min(w * 0.9, 860);
      ceu(c, w, h, ['#1a2a5a', '#4a6aa0', '#8aa8d0']);
      nuvens(c, w, h, t, 'rgba(255,255,255,.5)', 5, h * 0.18, 8);
      mar(c, w, h, base + 4, t, ['#2a5a8a', '#0a1a38']);
      ilha(c, w / 2, base, lw, t, {});
      const cy = base + lw * 0.15, rx = lw * 0.27, ry = lw * 0.1;
      c.save(); c.beginPath(); c.ellipse(w / 2, cy, rx, ry, 0, 0, TAU); c.clip();
      const g = c.createRadialGradient(w / 2, cy, 0, w / 2, cy, rx);
      g.addColorStop(0, '#3a2440'); g.addColorStop(1, '#0a0408');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      brilho(c, w / 2, cy, rx, 'rgba(255,220,140,.22)');
      dormindo(c, w / 2, cy + ry * 0.1, lw / 1250, t, '#120818', '#9a5cff');
      c.restore();
      c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 4; c.beginPath(); c.ellipse(w / 2, cy, rx, ry, 0, 0, TAU); c.stroke();
      runas(c, w / 2, cy, rx * 0.92, t, 0, ry / rx * 1.05);
    },
    tremor(c, w, h, t, cena) {
      const rach = cena.rachas || 0.35;
      ceu(c, w, h, rach > 0.6 ? ['#1a0610', '#5a1420', '#a03a2a'] : ['#24305a', '#6a5a8a', '#d98a6a']);
      nuvens(c, w, h, t, rach > 0.6 ? 'rgba(30,8,14,.7)' : 'rgba(255,220,220,.18)', 6, h * 0.3, 10);
      const mY = h * 0.68;
      mar(c, w, h, mY, t * 1.4, rach > 0.6 ? ['#2a0a18', '#0a0208', 'rgba(255,120,80,.2)'] : ['#2a4a7a', '#0e1e3a']);
      ilha(c, w / 2, mY + 4, Math.min(w * 0.75, 720), t, { ruina: true, rachas: Math.min(1, rach * (0.6 + 0.4 * Math.sin(t * 3)) + t * 0.05), arvore: '#3f6a34' });
      // poeira
      brasas(c, w, h, t, 40, rach > 0.6 ? '#ff7a3a' : 'rgba(230,200,170,.8)', false);
    },
    ovo(c, w, h, t) {
      ceu(c, w, h, ['#140a22', '#2a1430', '#4a2228']);
      // parede de pedra
      c.fillStyle = 'rgba(0,0,0,.25)';
      for (let y = 0; y < h; y += 40) for (let x = (y / 40) % 2 ? -30 : 0; x < w; x += 60) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; c.strokeRect(x, y, 60, 40); }
      const s = Math.min(w, h) / 520;
      ovoFogo(c, w / 2, h * 0.48, s * 1.2, t);
      brasas(c, w, h, t, 40, '#ffb04a');
    },
    ilha(c, w, h, t) {
      ceu(c, w, h, ['#3a5aa8', '#8ab0e0', '#ffd6a0']);
      brilho(c, w * 0.78, h * 0.42, h * 0.5, 'rgba(255,230,160,.6)');
      nuvens(c, w, h, t, 'rgba(255,255,255,.75)', 7, h * 0.32, 10);
      const mY = h * 0.66;
      mar(c, w, h, mY, t, ['#3a8ad0', '#123a78', 'rgba(255,255,255,.35)']);
      ilha(c, w / 2, mY + 4, Math.min(w * 0.75, 720), t, { ruina: true });
      // pássaros
      c.strokeStyle = 'rgba(30,30,50,.6)'; c.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const x = ((t * 40 + i * 140) % (w + 100)) - 50, y = h * 0.2 + i * 18, b = Math.sin(t * 8 + i) * 5;
        c.beginPath(); c.moveTo(x - 8, y - b); c.quadraticCurveTo(x - 3, y - 4, x, y); c.quadraticCurveTo(x + 3, y - 4, x + 8, y - b); c.stroke();
      }
    },
    titulo(c, w, h, t) {
      PALCOS.ilha(c, w, h, t);
      c.fillStyle = 'rgba(8,4,20,.55)'; c.fillRect(0, 0, w, h);
      brasas(c, w, h, t, 30, '#ffe680');
    },
    olhos(c, w, h, t) {
      c.fillStyle = '#030104'; c.fillRect(0, 0, w, h);
      // rachaduras ao fundo
      c.save(); c.strokeStyle = 'rgba(255,70,30,.35)'; c.shadowColor = '#ff3a1a'; c.shadowBlur = 12; c.lineWidth = 2;
      const r = rnd(21); c.beginPath();
      for (let k = 0; k < 8; k++) { let x = r() * w, y = r() * h; c.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (r() - 0.5) * 120; y += (r() - 0.5) * 120; c.lineTo(x, y); } }
      c.stroke(); c.restore();
      const ab = ease((t - 0.6) / 1.6), cx = w / 2, cy = h * 0.42, d = Math.min(w * 0.16, 150), tam = Math.min(w, h) / 9;
      [-1, 1].forEach((l) => {
        const x = cx + l * d;
        brilho(c, x, cy, tam * 2.4, `rgba(255,90,30,${0.55 * ab})`);
        c.save(); c.translate(x, cy); c.scale(l, 1);
        c.fillStyle = '#ffe680'; c.beginPath();
        c.moveTo(-tam, 0); c.quadraticCurveTo(0, -tam * 0.55 * ab, tam, -tam * 0.15); c.quadraticCurveTo(0, tam * 0.45 * ab, -tam, 0); c.fill();
        c.fillStyle = '#ff8a2a'; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(0, 0, tam * 0.5, tam * 0.3 * ab, 0, 0, TAU); c.fill(); c.globalAlpha = 1;
        c.fillStyle = '#120202'; c.beginPath(); c.ellipse(Math.sin(t) * tam * 0.08, 0, tam * 0.08, tam * 0.36 * ab, 0, 0, TAU); c.fill();
        c.restore();
      });
    },
    ancestral(c, w, h, t) {
      ceu(c, w, h, ['#0a0208', '#3a0a18', '#8a2a20']);
      nuvens(c, w, h, t, 'rgba(20,4,12,.75)', 9, h * 0.4, 22);
      if ((t % 3.1) < 0.15) { c.fillStyle = 'rgba(255,200,200,.18)'; c.fillRect(0, 0, w, h); raio(c, w * (0.15 + hash(Math.floor(t / 3.1), 4) * 0.7), 0, h * 0.5, Math.floor(t / 3.1) + 40, '#ff8a8a'); }
      const mY = h * 0.78;
      mar(c, w, h, mY, t * 1.8, ['#2a0a18', '#06020a', 'rgba(255,120,80,.2)']);
      const sobe = ease(t / 2.4), s = Math.min(w, h * 1.25) / 600;
      ancestral(c, w / 2, lerp(h * 0.95, h * 0.44, sobe), s, t * 2.4, { rugido: t > 1.2 && t < 3 ? 1 : 0.3 });
      ilha(c, w / 2, mY + 4, Math.min(w * 0.8, 760), t, { ruina: true, rachas: 1, arvore: '#2a4a2a', grama1: '#5a8a3a', grama2: '#2a4a20' });
      brasas(c, w, h, t, 90, '#ff6a2a');
    },
    sonho(c, w, h, t) {
      ceu(c, w, h, ['#0a0620', '#2a1450', '#4a2a7a']);
      estrelas(c, w, h, t, 90, 0.8);
      for (let i = 0; i < 6; i++) { brilho(c, (hash(i, 1) * w + t * 10 * (i % 2 ? 1 : -1)) % w, h * (0.3 + hash(i, 2) * 0.6), 160 + hash(i, 3) * 120, 'rgba(160,110,255,.18)'); }
      dormindo(c, w / 2, h * 0.52, Math.min(w, 900) / 700, t, '#1a0c2a', '#c08aff');
      brasas(c, w, h, t, 50, '#d8c0ff');
    },
    vitoria(c, w, h, t) {
      ceu(c, w, h, ['#2a3a7a', '#e0906a', '#ffe0a0']);
      const cx = w / 2, mY = h * 0.7;
      for (let i = 0; i < 12; i++) {
        c.save(); c.translate(cx, mY - 40); c.rotate(-Math.PI / 2 + (i - 5.5) * 0.16 + Math.sin(t * 0.5) * 0.02);
        c.fillStyle = 'rgba(255,240,190,.12)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-18, -h); c.lineTo(18, -h); c.fill(); c.restore();
      }
      mar(c, w, h, mY, t, ['#4a7ac0', '#1a3a70', 'rgba(255,255,255,.4)']);
      const desce = ease(t / 6), s = Math.min(w, h * 1.25) / 700, lw = Math.min(w * 0.8, 760), topo = mY + 4 - lw * 0.12;
      c.save(); c.beginPath(); c.rect(0, 0, w, topo + 4); c.clip();
      ancestral(c, cx, lerp(h * 0.36, h * 0.95, desce), s, t * 1.2, { olhos: 1 - desce * 0.8, borda: '#9a5cff' });
      c.restore();
      ilha(c, cx, mY + 4, lw, t, { ruina: false });
      const fecha = ease((t - 0.8) / 2.5);
      if (fecha > 0) runas(c, cx, topo - 30, lerp(lw * 0.75, lw * 0.32, fecha), t * 2, 0, 0.28);
      brasas(c, w, h, t, 40, '#fff6c0');
    },
    amanhecer(c, w, h, t) {
      PALCOS.ilha(c, w, h, t);
      brilho(c, w / 2, h * 0.5, Math.max(w, h) * 0.6, 'rgba(255,220,140,.25)');
      // dragões da ilha voando (pequenas silhuetas coloridas)
      ['#ff6a2b', '#3aa8ff', '#5fd35a'].forEach((cor, i) => {
        const x = ((t * (50 + i * 15) + i * 220) % (w + 200)) - 100, y = h * (0.22 + i * 0.07) + Math.sin(t * 2 + i) * 10;
        ancestral(c, x, y, 0.09, t * 6 + i, { cor, asa: cor, borda: cor, olhos: false, semBrilho: true });
      });
    },
    derrota(c, w, h, t) {
      ceu(c, w, h, ['#1a0204', '#5a0a10', '#b0301a']);
      nuvens(c, w, h, t, 'rgba(40,6,8,.7)', 8, h * 0.4, 6);
      const mY = h * 0.72;
      mar(c, w, h, mY, t, ['#3a0a10', '#0a0204', 'rgba(255,100,60,.18)']);
      ilha(c, w / 2, mY + 4, Math.min(w * 0.8, 760), t, { ruina: true, rachas: 0.8, arvore: '#2a1a14', grama1: '#4a3a24', grama2: '#2a1a10' });
      ancestral(c, w / 2, mY - h * 0.3, Math.min(w, h * 1.2) / 560, t * 0.9, { rugido: 0.4 });
      brasas(c, w, h, t, 100, 'rgba(200,190,180,.8)', false);
    },
    vazio(c, w, h, t) {
      ceu(c, w, h, ['#202432', '#4a4a5a', '#7a6a6a']);
      const mY = h * 0.7;
      mar(c, w, h, mY, t, ['#3a4a5a', '#141a24']);
      ilha(c, w / 2, mY + 4, Math.min(w * 0.75, 720), t, { ruina: true, arvore: '#3a4a3a', grama1: '#6a7a5a', grama2: '#3a4a30' });
      const x = lerp(-w * 0.2, w * 1.2, (t / 7) % 1);
      ancestral(c, x, h * 0.3, Math.min(w, h) / 1400, t * 3, { olhos: 1 });
    },
  };

  // ---------- Motor ----------
  let atual = null;
  function injetaCSS() {
    if (document.getElementById('cs-style')) return;
    const st = document.createElement('style'); st.id = 'cs-style'; st.textContent = CSS; document.head.appendChild(st);
    if (!document.querySelector('link[href*="Lilita+One"]')) {
      const l = document.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;700;800&display=swap';
      document.head.appendChild(l);
    }
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  function play(id, opts) {
    opts = opts || {};
    const rot = ROTEIROS[id];
    if (!rot) return Promise.reject(new Error('[Cutscene] roteiro desconhecido: ' + id));
    if (atual) atual.fim(true);
    injetaCSS();
    const modo = opts.modo || 'padrao';
    const vars = Object.assign({ tempo: TEMPO_MODO[modo] || '20 minutos', onda: 2 }, opts.vars || {});
    const cenas = rot.cenas.filter((c) => (!c.so || c.so === modo) && (!c.exceto || c.exceto !== modo));
    const reduz = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const som = opts.som === false ? null : (opts.som || global.Som || null);
    const sfx = (a) => { try { if (som && a) som.play(a[0], a[1]); } catch (e) { /* som é opcional */ } };

    const root = document.createElement('div');
    root.className = 'cs-root'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Cena da história');
    root.innerHTML = `<canvas></canvas><div class="cs-bar t"></div><div class="cs-bar b"></div>
<div class="cs-title"><h1></h1><p></p></div>
<div class="cs-box"><div class="cs-port"></div><div class="cs-panel"><span class="cs-name"></span><div class="cs-text" aria-live="polite"></div><i class="cs-more"></i></div></div>
<div class="cs-dots">${cenas.map(() => '<b></b>').join('')}</div>
<button class="cs-skip" type="button">Pular <i></i><i></i></button>
<div class="cs-flash"></div><div class="cs-fade"></div>`;
    (opts.container || document.body).appendChild(root);
    const $ = (s) => root.querySelector(s);
    const cv = $('canvas'), c = cv.getContext('2d'), box = $('.cs-box'), port = $('.cs-port'), panel = $('.cs-panel'),
      nome = $('.cs-name'), txt = $('.cs-text'), more = $('.cs-more'), fade = $('.cs-fade'), flash = $('.cs-flash'),
      tit = $('.cs-title'), dots = [...root.querySelectorAll('.cs-dots b')], btn = $('.cs-skip');

    let W = 0, H = 0, dpr = 1;
    function tamanho() { dpr = Math.min(2, global.devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight; cv.width = W * dpr; cv.height = H * dpr; }
    tamanho(); global.addEventListener('resize', tamanho);

    let i = -1, cena = null, t0 = 0, digitados = 0, cheio = false, trocando = false, raf = 0, encerrado = false, esperaAte = 0, resolver;
    const VEL = 42; // letras por segundo
    const prom = new Promise((r) => { resolver = r; });

    function textoDa(cn) { return (cn.texto || '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m)); }

    function mostra(n) {
      i = n; cena = cenas[i]; t0 = performance.now(); digitados = 0; cheio = false;
      dots.forEach((d, k) => d.classList.toggle('on', k <= i));
      if (cena.flash && !reduz) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
      sfx(cena.som);
      if (cena.titulo) {
        box.classList.remove('on'); tit.querySelector('h1').textContent = cena.titulo; tit.querySelector('p').textContent = cena.sub || '';
        setTimeout(() => tit.classList.add('on'), 200); cheio = true; esperaAte = t0 + (cena.dur || 3) * 1000;
        return;
      }
      tit.classList.remove('on');
      const q = cena.quem || 'narrador', p = QUEM[q];
      panel.className = 'cs-panel' + (q === 'narrador' ? ' narr' : ' ' + q);
      nome.textContent = p.nome; nome.className = 'cs-name ' + q; nome.style.display = p.nome ? '' : 'none';
      port.innerHTML = RETRATO[q] || ''; port.style.display = RETRATO[q] ? '' : 'none';
      txt.textContent = ''; more.classList.remove('on');
      box.classList.add('on');
    }
    function proxima() {
      if (trocando || encerrado) return;
      if (i >= cenas.length - 1) { fim(false); return; }
      trocando = true; fade.style.opacity = '1'; box.classList.remove('on');
      setTimeout(() => { if (encerrado) return; mostra(i + 1); fade.style.opacity = '0'; trocando = false; }, 450);
    }
    function avancar() {
      if (trocando || encerrado || !cena) return;
      if (!cheio) { digitados = 1e9; return; }
      proxima();
    }
    function fim(pulada) {
      if (encerrado) return; encerrado = true;
      cancelAnimationFrame(raf); global.removeEventListener('resize', tamanho); document.removeEventListener('keydown', tecla, true);
      root.classList.remove('on'); fade.style.opacity = '1';
      if (rot.musicaFim !== undefined && som) try { som.musica(rot.musicaFim); } catch (e) { /* opcional */ }
      setTimeout(() => root.remove(), 520);
      if (atual === ctl) atual = null;
      const r = { id, pulada: !!pulada };
      if (typeof opts.onEnd === 'function') try { opts.onEnd(r); } catch (e) { console.warn(e); }
      resolver(r);
    }
    function tecla(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fim(true); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); avancar(); }
      else e.stopPropagation(); // não deixa as teclas do jogo (1-9, P, M...) agirem por trás
    }
    root.addEventListener('pointerdown', (e) => { if (e.target.closest('.cs-skip')) return; e.stopPropagation(); avancar(); });
    root.addEventListener('click', (e) => e.stopPropagation());
    btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => { e.stopPropagation(); fim(true); });
    document.addEventListener('keydown', tecla, true);

    function quadro(now) {
      if (encerrado) return;
      raf = requestAnimationFrame(quadro);
      if (!cena) return;
      const t = (now - t0) / 1000;
      // texto
      if (!cena.titulo && !cheio) {
        const full = textoDa(cena);
        digitados = Math.max(digitados, Math.floor(t * VEL));
        if (digitados >= full.length) { digitados = full.length; cheio = true; more.classList.add('on'); esperaAte = now + (1800 + full.length * 35) * (opts.lento || 1); }
        txt.textContent = full.slice(0, digitados);
      }
      if (cheio && opts.auto !== false && now > esperaAte && !trocando) proxima();
      // cenário
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.save();
      const tr = reduz ? 0 : (cena.tremor || 0);
      if (tr) { const k = tr * (0.6 + 0.4 * Math.sin(t * 7)) * 9; c.translate((Math.random() - 0.5) * k, (Math.random() - 0.5) * k); c.scale(1.02, 1.02); }
      try { (PALCOS[cena.palco] || PALCOS.ilha)(c, W, H, t, cena); } catch (e) { console.warn('[Cutscene]', e); }
      c.restore();
      // vinheta
      const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
    }

    if (rot.musica !== undefined && som) try { som.musica(rot.musica); } catch (e) { /* opcional */ }
    requestAnimationFrame(() => { root.classList.add('on'); mostra(0); fade.style.opacity = '0'; btn.focus({ preventScroll: true }); });
    raf = requestAnimationFrame(quadro);

    const ctl = { id, fim };
    atual = ctl;
    return prom;
  }

  global.Cutscene = {
    play,
    pular() { if (atual) atual.fim(true); },
    tocando() { return !!atual; },
    roteiros: ROTEIROS,
    palcos: PALCOS,
    personagens: QUEM,
    ids: () => Object.keys(ROTEIROS),
  };
})(typeof window !== 'undefined' ? window : this);
