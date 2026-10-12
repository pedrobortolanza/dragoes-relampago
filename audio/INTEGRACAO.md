# Sons e música — como integrar no jogo

`audio.js` gera todos os efeitos e músicas no navegador com a Web Audio API. Não há arquivos de áudio nem dependências. Ele cria um objeto global `Som` (o nome `Audio` foi evitado porque já é um construtor nativo do navegador).

Para ouvir tudo antes de integrar, abra `demo.html` (na mesma pasta). Cada botão mostra a chamada exata.

## 1. Incluir

Como o jogo é um único `index.html`, cole o conteúdo de `audio.js` num `<script>` **antes** do script do jogo. (Durante o desenvolvimento também funciona `<script src="audio/audio.js"></script>`.)

O áudio só liga no primeiro clique ou tecla (regra dos navegadores). O próprio `audio.js` escuta esse primeiro gesto. Se `Som.musica('ilha')` for chamado antes, a música começa sozinha no primeiro clique. Nada é salvo em localStorage, seguindo a decisão de "uma sessão só".

## 2. Botão de mudo e volume

```js
Som.criarControles(document.querySelector('#hud-direita'));            // 🔊 + volumes de música e efeitos
Som.criarControles(el, { compacto: true });                             // só o botão; volumes aparecem ao passar o mouse
Som.ligarTeclaM();                                                      // tecla M liga/desliga (livre: o jogo usa 1–8, P e C)
```

O controle para a propagação de `pointerdown`, então não dispara o ouvinte global `data-a` do jogo. Como a interface é refeita pelo `morph`, crie o controle **uma vez** num elemento que o `morph` não recria (por exemplo, um contêiner fixo fora da raiz renderizada) ou reanexe o mesmo elemento retornado por `criarControles`. Para desenhar um botão próprio: `Som.alternarMudo()`, `Som.estado().mudo` e `Som.aoMudar(fn)`.

## 3. Pausa

`audio.js` já suspende o som quando a aba fica oculta. Para o botão Pausar / tecla P, em `togglePause()`:

```js
S.paused ? Som.pausar() : Som.retomar();
```

## 4. Onde chamar cada som

Os nomes de função são os do `index.html` atual. Se a interface nova mudar os nomes, o ponto equivalente serve.

| Momento no jogo | Função atual | Chamada |
|---|---|---|
| Clique genérico em botão | `handle` | `Som.play('clique')` |
| Trocar de aba | `renderTabs` / tecla 1–8 | `Som.play('aba')` |
| Ação negada (sem ouro, ilha cheia, toast `bad`) | `spendGold` falhou, `toast(..., 'bad')` | `Som.play('erro')` |
| Coletar ouro de um habitat | `collect` | `Som.play('coletar', { quantidade: 1 a 5 })` (maior coleta = mais moedas) |
| Coletar tudo | `collectAll` | `Som.play('coletarTudo')` |
| Plantar / colher / colher tudo | `plant` / `harvest` / `harvestAll` | `'plantar'` / `'colher'` / `'colherTudo'` |
| Comprar (dragão, habitat, fazenda, chocadeira) | `buyDragon`, `buyHabitat`, `buyFarm`, `buyHatch` | `Som.play('comprar')` |
| Vender dragão | `sell` | `Som.play('vender')` |
| Ganhar gemas | `addGems` | `Som.play('gemas')` |
| Alimentar / dragão sobe de nível | `feed` | `'alimentar'`, e `'nivelDragao'` quando sobe |
| Jogador sobe de nível | `addXp` | `Som.play('nivelJogador')` |
| Ovo entra na chocadeira | `layEgg` | `Som.play('ovoColocado')` |
| Ovo fica pronto | `tick` (quando o tempo zera) | `Som.play('ovoPronto')` |
| Chocar | `hatch` | `Som.play('chocar')` |
| Tela de revelação (espécie nova, Épico, Lendário) | `hatch` → overlay | `Som.play('revelacao', { raridade: 'comum'·'raro'·'epico'·'lendario' })` |
| Cruzar | `breed` | `Som.play('cruzar')` |
| Início de batalha | `startBattle` | `Som.play('batalhaInicio')` + `Som.musica('batalha')` |
| Ataque normal | `doAttack` | `Som.play('ataque', { elemento })` |
| Especial | `doAttack` | `Som.play('especial', { elemento })` |
| Golpe acerta | `doAttack` (ao aplicar dano) | `'acerto'`, ou `'critico'`; somar `'superEficaz'` / `'poucoEficaz'` conforme a vantagem |
| Dragão nocauteado | `doAttack` | `Som.play('nocaute')` |
| Fim da luta | `endBattle` | `'vitoria'` ou `'derrota'`, depois `Som.musica('ilha')` ao fechar (`closeBattle`) |
| Conquista desbloqueada | `checkAchievements` | `Som.play('conquista')` |
| Missão resgatada | `claimMission` | `Som.play('missao')` |
| Evento aleatório | `triggerEvent` | `'chuvaOuro'`, `'colheitaFarta'`, `'ovoPerdido'`, `'dragaoSelvagem'`, `'mercador'` (ou `'evento'` genérico) |
| Pegar o Ovo Perdido | `catchEgg` | `Som.play('ovoPego')` |
| Comprar do Mercador | `buyMerchant` | `Som.play('comprar')` |
| Avisos de tremor (5 min, 2 min, 1 min, 30 s) | `tick` | `Som.play('tremor', { intensidade: 0.25 · 0.5 · 0.75 · 1 })` e `Som.tensao(mesmo valor)` |
| Ancestral desperta | `startFinal` | `Som.play('despertar')` + `Som.musica('invasao')` |
| Ancestral usa o Sopro Ancestral | `doAttack` (inimigo chefe) | `Som.play('soproAncestral')` |
| Ancestral ataca normalmente | `doAttack` | `Som.play('ataque', { elemento })` como os outros |
| Tela final | `endGame` / `renderEnd` | `'finalVitoria'` ou `'finalDerrota'`, depois `Som.musica('placar')` |
| Pausar / retomar | `togglePause` | `'pausar'` / `'retomar'` (antes de `Som.pausar()`) |

Elementos aceitos: `fogo, agua, planta, terra, eletrico, gelo, metal, trevas, luz` (com ou sem acento; também `neutro`).

## 5. Música

| Faixa | Quando |
|---|---|
| `Som.musica('ilha')` | Ao começar a partida e ao voltar da Arena. Alegre, em Dó maior. |
| `Som.musica('batalha')` | Durante lutas na Arena (inclusive Dragão Selvagem e Ancestral adormecido). |
| `Som.musica('invasao')` | Na Invasão Final. Sombria, com tambores taiko. |
| `Som.musica('placar')` | Tela de placar no fim. Calma. |
| `Som.musica(null)` | Silêncio. |

A troca é com fade de cerca de 1 s. `Som.tensao(0..1)` só afeta a faixa da ilha: acrescenta batimento grave, drone e chimbal à medida que o Ancestral se aproxima. Volte para `Som.tensao(0)` numa partida nova.

## 6. Detalhes

- Cliques em rajada não empilham: `coletar`, `colher`, `clique` e `acerto` têm um intervalo mínimo entre repetições.
- Tudo passa por um compressor, então vários sons juntos não estouram.
- Volumes padrão: geral 0,8, música 0,5, efeitos 0,85. Ajuste com `Som.volume()`, `Som.volumeMusica()`, `Som.volumeEfeitos()` (0 a 1).
- `Som.efeitos`, `Som.faixas` e `Som.elementos` listam os nomes válidos. Nome desconhecido só gera um aviso no console.
- Testado no Chromium: todos os 48 efeitos (mais 9 variações de elemento para ataque e especial) e as 4 faixas tocam sem erros no console e sem clipping.
