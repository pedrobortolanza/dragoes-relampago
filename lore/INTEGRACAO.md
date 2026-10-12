# Integração das cutscenes no `index.html`

Arquivos desta pasta:

| Arquivo | O que é |
|---|---|
| `HISTORIA.md` | A lore completa (mundo, personagens, finais). Fonte para a documentação. |
| `cutscene.js` | Módulo das cutscenes. Autossuficiente: injeta o próprio CSS, desenha os cenários em `<canvas>` e os retratos em SVG. Sem imagens externas e sem emojis. Cerca de 45 KB. |
| `demo.html` | Página para assistir a todas as cenas, com seletor de modo. |

## 1. Embutir

O jogo é um arquivo único, então cole o conteúdo de `cutscene.js` num `<script>` depois do `audio.js` (ele usa `window.Som` se existir, para tremor, despertar e música). Ele cria `window.Cutscene`.

## 2. API

```js
Cutscene.play(id, { modo, vars, auto, som, onEnd })  // devolve Promise<{ id, pulada }>
Cutscene.pular()      // encerra a cena atual
Cutscene.tocando()    // true enquanto uma cena está na tela
```

- `modo`: `'rapido' | 'padrao' | 'longa' | 'infinito'` (as chaves de `MODES`). Troca o `{tempo}` da fala da Iara e escolhe a fala do Infinito.
- `vars.onda`: número da invasão, usado em `despertarOnda`.
- `auto: false` só avança no clique. O padrão avança sozinho depois de cada fala.
- `som: false` desliga o som da cena.

Controles: clique, `Espaço`, `Enter` ou `→` avançam; `Esc` ou o botão **Pular** encerram. Enquanto a cena está aberta, ela segura os cliques e as teclas, então os atalhos do jogo (1 a 9, P, M, C) não disparam por trás.

## 3. Onde chamar

O jogo precisa ficar **pausado** durante a cena para o relógio não andar. O jeito mais simples é marcar `S.paused = true` antes e restaurar no `then`.

| Momento | Função atual | Chamada |
|---|---|---|
| Começo da partida | `startGame(mode)` | Depois de montar `S`, pausar e chamar `Cutscene.play('abertura', { modo: mode })`; no `then`, despausar e mostrar o toast de boas-vindas. |
| Ancestral desperta | `startFinal()` | Antes do `overlay(...)` "O Dragão Ancestral despertou!": `Cutscene.play(S.mode === 'infinito' && S.wave > 0 ? 'despertarOnda' : 'despertar', { modo: S.mode, vars: { onda: S.wave + 1 } })`, e abrir o overlay no `then`. A cena já toca `Som.play('despertar')` e `Som.musica('invasao')`, então tire o `sfx('despertar')` e o `music('invasao')` de lá para o som não tocar duas vezes. |
| Invasão vencida no Infinito | `endBattle` com `B.kind === 'final'` e `S.mode === 'infinito'` | `Cutscene.play('ondaVencida')` ao fechar o resultado. |
| Primeira luta contra o Ancestral adormecido | início da luta `kind === 'boss'` quando `!S.weakened` | `Cutscene.play('sonho')` antes de abrir a batalha. |
| Fim da partida | `endGame()` antes de `renderEnd` | `Cutscene.play(sem invasão ? 'semDefesa' : S.finalResult.win ? 'vitoria' : 'derrota')`, e mostrar o placar no `then`. |

## 4. Textos que podem acompanhar a lore no jogo (opcional)

Para o jogo inteiro falar a mesma língua da história:

- Overlay do despertar: "Vorágon, o Dragão Ancestral, despertou!"
- Final de vitória: "A ilha resistiu! Vorágon voltou a dormir sob o Selo dos Nove por mais mil anos."
- Final de derrota: "Vorágon tomou a ilha, mas leva uma cicatriz de X%. A próxima guarda vai saber onde mirar."
- Botão do Ancestral adormecido na Arena: "Entrar no sonho do Ancestral".

## 5. Editar falas

As falas ficam no objeto `ROTEIROS` no topo de `cutscene.js` (também acessível em `Cutscene.roteiros`). Cada cena tem `palco` (cenário), `quem` (`narrador`, `iara` ou `voragon`), `texto`, e opcionais `flash`, `tremor`, `som`, `so`/`exceto` (filtro por modo). Se mudar uma fala, atualize `HISTORIA.md` também.
