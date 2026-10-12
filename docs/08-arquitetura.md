# Arquitetura do código

## Escolha de tecnologia

| Decisão | Motivo |
|---|---|
| **Um único `index.html`** com HTML, CSS e JavaScript juntos | Roda com dois cliques, sem instalar nada, sem servidor e sem build. Fácil de publicar e de compartilhar. |
| **JavaScript puro**, sem framework | O jogo é uma interface de painéis e botões; um laço de render simples dá conta e mantém o arquivo leve. |
| **Estado só em memória** | Requisito do design: partida de sessão única. Nada de `localStorage` ou servidor. |
| **Interface em HTML/CSS**, gráfico em `<canvas>` | Botões e textos acessíveis por teclado e leitor de tela; o canvas só para o gráfico de ouro. |

## Estrutura do arquivo

O `index.html` está dividido em blocos, na ordem:

| Bloco | Conteúdo |
|---|---|
| `<head>` (implícito) | Título, descrição, fontes do Google Fonts |
| `<style>` | Tema escuro com variáveis CSS em `:root`, componentes (barra superior, mapa isométrico, HUD, dock, painéis, cartas de dragão, arena), animações (`@keyframes`) e ajustes para celular |
| Esqueleto HTML | `#top` (barra de recursos), `#stage` com `#mapwrap`/`#map` (ilha), `#hud` e `#somctl` (botão de som), `#sheet` (painel aberto), `#tabs` (dock inferior), `#toasts`, `#overlay` (início, pausa, despertar, revelação, fim), `#lostEgg` |
| 1º `<script>`: áudio | Cópia de `audio/audio.js` entre `AUDIO-START` e `AUDIO-END`; cria o objeto global `Som`. Veja [10-sons-e-musica.md](10-sons-e-musica.md#para-quem-programa) |
| 2º `<script>`: `DADOS DO JOGO` | Todas as tabelas de balanceamento, entre os marcadores `DATA-START` e `DATA-END` |
| `UTILITÁRIOS` | `$`, `rnd`, `pick`, `clamp`, `round5`, `fmt` (números em pt-BR com k/M/B), `fmtTime` |
| `ESPÉCIES E ATRIBUTOS` | Geração das 50 espécies e as fórmulas de atributos, custos e eficácia elemental |
| `ESTADO` | `newStats()`, `newState()`, `addDragon()` e helpers de capacidade e produção |
| `AÇÕES BÁSICAS` | Ouro, gemas, XP, coletar, plantar, colher, comprar, alimentar, vender |
| `CRUZAMENTO E CHOCADEIRA` | `breedOutcomes`, `rollBreed`, `layEgg`, `breed`, `hatch`, `speedEgg` |
| `ARENA` | Montagem de times, `startBattle`, `doAttack`, `playerMove`, `endBattle`, IA (`bestMove`) |
| `MISSÕES, EVENTOS E CONQUISTAS` | `newMission`, `claimMission`, `triggerEvent`, `checkAchievements`, `score`, `rankFor` |
| `LAÇO PRINCIPAL` | `tick()`, `startFinal`, `startGame`, `endGame`, `togglePause`, pausa automática ao ocultar a aba |
| `INTERFACE` | `render()`, `morph()`, desenho dos dragões (`dragonSVG`), a ilha isométrica (`viewMap`, `viewHud`), uma função `view*()` por painel, toasts, textos flutuantes, gráfico e telas de início e fim |
| `ENTRADA` | Tabela `ACTIONS`, despacho de eventos de ponteiro e teclado |
| Inicialização | `boot()`, suporte a recarga ao vivo e `window.__game` para testes |

## Dados do jogo

Tudo que é número de balanceamento mora em constantes no topo do script:

| Constante | O que define |
|---|---|
| `EL` | 9 elementos: nome, emoji, cor, prefixo/sufixo de nome, nível de desbloqueio, preço |
| `STRONG` | Para cada elemento, contra quais ele é forte |
| `RARITY` | Bases por raridade: valor, ouro/s, vida, ataque, tempo de ovo |
| `LEGENDS` | 5 receitas lendárias e suas chances |
| `CROPS` | Plantações: tempo, comida, custo, nível |
| `MODES` | Modos de partida: duração e vida/ataque do Dragão Ancestral (`boss`) |
| `LEAGUES`, `LEAGUE_RARITY` | Nomes das ligas e raridades sorteadas em cada uma |
| `MAX_DLVL`, `MAX_PLVL`, `HAB_CAP`, `HATCH_COSTS` | Limites e custos fixos |
| `EVENTS` | 5 eventos aleatórios |
| `MISSION_TPL` | Tipos de missão: estatística que medem, texto e meta por nível |
| `ACH` | Conquistas: categoria, id, ícone, nome, descrição, gemas e condição |

As fórmulas que escalam (custo de habitat, de fazenda, de alimentar, XP por nível, atributos por nível) ficam logo abaixo, em `ESPÉCIES E ATRIBUTOS`.

## Estado da partida

Um único objeto global `S`, criado por `newState(modo)`:

```js
S = {
  mode, t, running, paused, ended,          // relógio e situação
  gold, food, gems, xp, level,              // recursos
  dragons: [{ id, key, name, els, rar, lvl, born }],
  habitats: [{ stored }], farms: [{ crop, prog }],
  eggs: [{ id, sp, prog, dur, free }], hatchSlots, selCrop,
  league, leagueFight, battle, team, autoBattle, lastResult,
  missions, ach: { idConquista: segundoDesbloqueio }, dex: { chaveEspécie: segundoDescoberta },
  stats,                                    // ~50 contadores, ver newStats()
  buffs, event, nextEvent, lostEgg,         // eventos
  warned, finalPhase, finalResult,          // avisos de despertar, fase final e resultado da Invasão
  history: [{ t, earned, gps }],            // pontos do gráfico (um a cada 5 s, até 800)
  nextId, tab, breedA, breedB,              // interface
}
```

Os dragões não guardam habitat: o habitat de cada um é a sua posição na lista (`habDragons(i)` pega a fatia `i × 3` a `i × 3 + 3`).

Espécies são identificadas por uma **chave**: o elemento (`fogo`), dois elementos ordenados (`fogo+agua`) ou `L:` + id do lendário (`L:eclipse`).

## Laço principal

`tick()` roda a cada 250 ms via `setInterval` e:

0. se `S.finalPhase` estiver ligado, só roda a batalha automática, as conquistas e o render (a ilha fica congelada);
1. calcula `dt` real (máx. 2 s) e soma em `S.t`;
2. acumula ouro nos habitats (com o limite de 60 s), avança plantações e ovos;
3. atualiza o pico de ouro/s e grava um ponto no histórico a cada 5 s;
4. dispara eventos quando `S.t ≥ S.nextEvent` e expira o ovo perdido;
5. executa um golpe da batalha automática a cada 1,1 s (só com o painel Arena aberto);
6. verifica conquistas;
7. mostra os avisos de despertar (300, 120, 60 e 30 s antes de `invadeAt()`) e, quando o tempo chega lá, chama `startFinal()`;
8. chama `render()` e depois `runFx()`, que toca as animações de ataque pendentes.

## Fase final

`invadeAt()` devolve o momento da invasão: a duração do modo, ou `S.nextInvasion` no Infinito. `startFinal()` liga `S.finalPhase`, trava `S.t` nesse momento, cancela a batalha em andamento (descontando-a de `stats.battles`), limpa eventos, bônus e o ovo perdido, abre o painel Arena e mostra o cartão do despertar. Na Arena, `viewArena()` passa a exibir só a escolha do time e o botão da batalha `final`; `startBattle()` recusa qualquer outro tipo nessa fase, e a batalha final recusa ser iniciada fora dela. `bossTeam(final)` monta o Ancestral a partir de `MODES[modo].boss`, multiplicado por `1,35^S.wave` no Infinito (x0,8 no adormecido; vida x0,7 na invasão se `S.weakened` estiver ligado, flag que vencer o adormecido liga e o início da invasão desliga). Na derrota (ou nos modos com fim), `endBattle()` grava `S.finalResult = { win, dmgPct, lost }`, que alimenta a pontuação, as conquistas da categoria Invasão e o texto da tela de fim, e o botão "Ver placar final" chama `endGame()`. No Infinito, uma vitória incrementa `S.wave`, paga a recompensa, desliga `finalPhase`, agenda `S.nextInvasion = S.t + 900` e zera os avisos.

`modeFactor()` é o peso do modo: duração ÷ 1.200 s, ou no Infinito `max(0,5; S.t ÷ 1.200)`. Ele multiplica as faixas de nota, os pontos da Invasão (exceto no Infinito) e o ouro do Ancestral adormecido.

## Renderização

- Cada parte da tela é gerada como **string HTML/SVG** por uma função pura: `renderTop` (barra), `renderTabs` (dock), `viewMap` (ilha), `viewHud` (sementes e botões sobre o mapa) e, quando `S.tab` não é `ilha`, um painel `#sheet` com o conteúdo de `renderView` → `viewDragons`, `viewBreed`, `viewArena`, ... O painel tem um fundo clicável que o fecha.
- `render()` só mexe no DOM quando a string mudou em relação à última vez, e mesmo assim não substitui o `innerHTML`: a função `morph()` compara a árvore nova com a atual e altera só os nós, atributos e textos diferentes. Assim os elementos que não mudaram (como os desenhos dos dragões) continuam os mesmos e suas animações CSS não reiniciam a cada atualização.
- O gráfico é desenhado em `<canvas>` por `drawChart()`, sempre que o painel Estatísticas é redesenhado e a cada 5 s.
- Toasts (avisos) e textos flutuantes ("+120") são elementos criados e removidos por `setTimeout`.
- Os dragões são desenhados por `dIcon(elementos, raridade, tamanho, classes, semente)`, que envolve o SVG de `dragonSVG()`. Veja abaixo.

## Ilha isométrica

O mapa é um único SVG de 1000 × 600 gerado por `viewMap()`:

- **Grade:** 14 × 14 lotes em losango na proporção 2:1. `iso(x, y)` converte coordenadas da grade em pixels (`TW = 64`, `TH = 32`, origem `OX = 500`, `OY = 68`).
- **Lotes:** `HAB_LOTS` (10 posições de habitat), `FARM_LOTS` (12 fazendas numa fileira na beira sul), `SPOTS` (Mural de Missões, Montanha do Amor, Chocadeira, Mercado e Arena, esta com 3 × 3 lotes) e `TREES`.
- **Peças de desenho:** `diamond()` calcula o losango de um lote; `slab()` desenha o lote com as faces laterais (base de toda construção); `isoHabitat`, `isoFarm`, `isoSpecial`, `isoGhost` (próximo lote livre, tracejado, com o preço) e `isoTree`. Cenário: mar com ondas animadas, nuvens, praia, penhasco e caminhos.
- **Profundidade:** cada objeto entra numa lista com `d = x + y` e é desenhado em ordem crescente, para que o que está mais "à frente" cubra o de trás.
- **Camada de cima:** rótulos (`pill`) e balões (`bubble`) não são escritos no lugar; vão para `topLayer` e são desenhados por último, para nunca ficarem escondidos atrás de outra construção.
- **Dragões no mapa:** `placeDragon()` encaixa o SVG de cada dragão dentro do mapa; até 3 passeiam por habitat e os mais raros voam em volta da ilha.
- **Cliques:** cada construção é um `<g class="bld" data-a="...">`, tratado pelo mesmo despacho de ações dos botões.
- **Celular:** o mapa mantém 920 px de largura dentro de `#mapwrap`, que rola de lado; no primeiro render ele é centralizado.

## Desenho dos dragões

`dragonSVG(els, rar, seed)` monta um **SVG vetorial** (viewBox 120 × 100, dragão olhando para a direita) a partir de três dados: elementos, raridade e uma semente.

- **Cores:** o corpo usa a cor do 1º elemento; asas e barriga, tons da cor do 2º (`shade()` clareia ou escurece um hex).
- **Partes:** sombra, base colorida pela raridade, asa de trás, cauda, pata de trás, corpo e barriga com escamas, pata da frente com garras, cabeça com chifres, olho e focinho, asa da frente.
- **Raridade:** Raro+ ganha espinhos nas costas e na cauda; Épico+ ganha asas 18% maiores e um babado na cabeça; Lendário ganha chifres e espinhos dourados, aura pulsante e uma coroa flutuante.
- **Acessórios por elemento:** cada elemento acrescenta peças (chama na cauda, folhas, pedras, cristais de gelo, placas de metal, nadadeiras de água, raios, fumaça de trevas, brilhos de luz, cor da pupila).
- **Classes animadas por CSS:** `.all` (flutuar), `.wing` (bater asas), `.tail` (balançar), `.head` (aceno), `.eye` (piscar), `.flame`, `.zap`, `.spark`, `.wisp`, `.aura`, `.halo`, `.drip`.
- **Semente:** vira um atraso negativo de animação (`--dl`), para que dragões lado a lado não se mexam em sincronia. Nas listas a semente é o `id` do dragão.
- **Cache:** o SVG gerado é guardado num `Map` por elementos + raridade + semente, então cada combinação é montada uma vez só.
- Espécie desconhecida (`unknown`) vira silhueta escura; `flip` espelha o desenho (oponente na Arena).

## Animações de ataque

`doAttack()` não mexe no DOM: empilha `{ de, para, elemento, dano, crítico, multiplicador }` em `fxQueue`. Depois de cada render, `runFx()` esvazia a fila e toca cada efeito com 480 ms de intervalo, usando a Web Animations API (`element.animate`): investida do atacante, projétil com o emoji do elemento, tremida e brilho no alvo e o número de dano flutuante.

## Entrada

- Todo elemento clicável tem `data-a="ação"` e parâmetros em `data-*`. Um único ouvinte global encontra o elemento e chama a função correspondente em `ACTIONS`.
- **Mouse** age no `pointerdown` (para não perder cliques se a tela re-renderizar entre o apertar e o soltar). **Toque** age no `pointerup`, só se o dedo não arrastou mais de 12 px, para não acionar ao rolar. **Teclado** (Enter/Espaço) chega como `click` com `detail = 0`.
- Depois de cada ação: conta o clique, verifica conquistas e re-renderiza.
- Tecla M: liga/desliga o som (registrada pelo próprio módulo de áudio).
- Teclas globais: 1–9 (painéis; 1 fecha o painel e volta à ilha), Esc (fecha o painel), P (pausa), C (coletar tudo), Enter sobre uma construção focada no mapa (as construções são `<g data-a>` focáveis com Tab).

## Acessibilidade

- Abas com `role="tab"` e `aria-selected`; toasts em região `aria-live`.
- Todos os controles são `<button>` reais, com foco visível.
- `prefers-reduced-motion` desliga todas as animações.
- Layout responsivo: em telas estreitas, cruzamento e arena viram uma coluna e a escada de ligas quebra em 4 colunas.

## Ganchos para testes

```js
window.__game = { S, startGame, tick, ACTIONS, endGame, ALL_SPECIES }
```

Permite, por exemplo, iniciar uma partida, avançar o tempo chamando `tick()`, disparar ações com `ACTIONS.collect({dataset:{i:0}})` e inspecionar `__game.S.stats`.

O jogo também aceita `window.claude.hot` (quando publicado como Artifact): ao atualizar o arquivo, a partida em andamento é preservada.

## Como estender

**Novo elemento:** adicionar em `EL` (com prefixo, sufixo, cor, desbloqueio e preço) e em `STRONG`. As espécies puras e híbridas são geradas sozinhas. Se for especial, incluir em `SPECIAL_EL`.

**Novo lendário:** adicionar em `LEGENDS` com elementos e chance. A ordem da lista define a prioridade do sorteio.

**Nova plantação / evento / modo:** adicionar em `CROPS`, `EVENTS` (e tratar o efeito em `triggerEvent`) ou `MODES`.

**Nova estatística:** adicionar o contador em `newStats()`, incrementá-lo na ação correspondente e incluir a linha em `statRows()`.

**Nova conquista:** adicionar um objeto em `ACH` com `cat`, `id` único, `i`, `n`, `d`, `g` e a condição `c: stats => booleano`. Ela aparece sozinha no painel, no fim de partida e na pontuação.

**Novo tipo de missão:** adicionar em `MISSION_TPL` apontando para um campo de `stats` e com a função de meta `tgt(nível)`.

Depois de qualquer mudança de números, rode `node docs/ferramentas/gerar-tabelas.js` para atualizar as tabelas desta documentação.
