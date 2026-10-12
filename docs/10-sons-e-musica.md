# Sons e música

Todo o áudio do jogo é **sintetizado no navegador** com a Web Audio API. Não há arquivos de som nem bibliotecas: notas, ruídos, tambores e o reverb são gerados por código na hora.

## Para quem joga

- O som liga no **primeiro clique ou tecla** (regra dos navegadores: nenhuma página pode tocar som antes de você interagir).
- **Botão de som** 🔊 no canto superior direito do mapa: um clique liga ou desliga; passando o mouse aparecem os volumes de música e de efeitos.
- **Tecla M** liga e desliga o som.
- O som pausa junto com o jogo (botão Pausar ou tecla P) e quando a aba fica oculta.
- Nada é salvo: volume e mudo voltam ao padrão numa página nova.

## Músicas

| Faixa | Quando toca | Clima |
|---|---|---|
| **Ilha** | Durante a partida e ao voltar de uma batalha | Alegre, em Dó maior |
| **Batalha** | Lutas na Arena (ligas, Dragão Selvagem, Ancestral adormecido) | Agitada |
| **Invasão** | Do despertar do Ancestral até o fim da Invasão Final | Sombria, com tambores taiko |
| **Placar** | Tela de fim de partida | Calma |

As trocas de faixa têm um fade de cerca de 1 segundo.

**Tensão:** conforme o Ancestral se aproxima, a música da ilha fica mais tensa. A cada aviso de tremor (5 min, 2 min, 1 min e 30 s antes da invasão) ela ganha camadas de batimento grave, drone e chimbal, com intensidade 0,25, 0,5, 0,75 e 1. A tensão volta a zero no fim da partida e, no modo Infinito, depois de cada invasão repelida.

## Efeitos sonoros

| Grupo | Momento | Efeito |
|---|---|---|
| Interface | Clique em qualquer botão ou construção | `clique` |
| | Trocar de painel | `aba` |
| | Ação negada (todo aviso vermelho: sem ouro, ilha cheia...) | `erro` |
| | Pausar / retomar | `pausar` / `retomar` |
| Economia | Coletar ouro de um habitat (mais moedas tilintando quanto maior a coleta, de 1 a 5) | `coletar` |
| | Coletar tudo | `coletarTudo` |
| | Plantar / colher / colher e replantar tudo | `plantar` / `colher` / `colherTudo` |
| | Comprar (dragão, habitat, fazenda, espaço de chocadeira, saco de ouro) | `comprar` |
| | Vender dragão | `vender` |
| | Trocar ouro por gemas com o Mercador Viajante | `gemas` |
| Progresso | Alimentar dragão / dragão sobe de nível | `alimentar` / `nivelDragao` |
| | Jogador sobe de nível | `nivelJogador` |
| | Conquista desbloqueada | `conquista` |
| | Missão resgatada | `missao` |
| Ovos | Ovo entra na chocadeira | `ovoColocado` |
| | Ovo fica pronto | `ovoPronto` |
| | Chocar | `chocar` |
| | Tela de revelação (espécie nova, Épico ou Lendário), com variação por raridade | `revelacao` |
| Cruzamento | Cruzar | `cruzar` |
| Batalha | Início da luta | `batalhaInicio` |
| | Ataque e Especial, com timbre próprio para cada um dos 9 elementos | `ataque` / `especial` |
| | Sopro Ancestral | `soproAncestral` |
| | Golpe acerta / acerto crítico | `acerto` / `critico` |
| | Golpe super eficaz / pouco eficaz (soma ao acerto) | `superEficaz` / `poucoEficaz` |
| | Dragão nocauteado | `nocaute` |
| | Vitória / derrota | `vitoria` / `derrota` |
| Eventos | Chuva de Ouro, Colheita Farta, Ovo Perdido, Dragão Selvagem, Mercador Viajante | um som para cada |
| | Pegar o Ovo Perdido | `ovoPego` |
| Ancestral | Avisos de tremor, cada vez mais fortes | `tremor` |
| | O Ancestral desperta | `despertar` |
| | Fim da partida com a ilha defendida / tomada | `finalVitoria` / `finalDerrota` |

Os sons de golpe acompanham a animação: o lançamento toca quando o projétil sai, e o impacto (acerto, crítico, eficácia, nocaute) quando ele chega no alvo.

## Detalhes de mixagem

- Volumes padrão: geral 0,8, música 0,5, efeitos 0,85.
- Tudo passa por um compressor, então vários sons ao mesmo tempo não estouram.
- Sons de clique rápido (`coletar`, `colher`, `clique`, `acerto`) têm um intervalo mínimo entre repetições, para não empilhar em rajadas.
- São 48 efeitos, mais as variações de elemento para ataque e especial, e 4 faixas de música.

## Para quem programa

**Onde está:** o módulo de áudio fica em `dragoncity/audio/audio.js`, com uma página de teste em `audio/demo.html` (cada botão toca um som e mostra a chamada). Como o jogo é um arquivo só, o conteúdo de `audio.js` está **copiado dentro do `index.html`**, num primeiro `<script>` entre os comentários `AUDIO-START` e `AUDIO-END`. Para atualizar o áudio, substitua esse trecho pela versão nova do arquivo.

**API do objeto global `Som`** (o nome `Audio` foi evitado porque já é nativo do navegador):

| Chamada | O que faz |
|---|---|
| `Som.play(nome, opções)` | Toca um efeito. Opções: `elemento` (ataque/especial), `quantidade` (coletar), `raridade` (revelação), `intensidade` (tremor) |
| `Som.musica(nome)` | Troca a música com fade (`'ilha'`, `'batalha'`, `'invasao'`, `'placar'` ou `null` para silêncio) |
| `Som.tensao(0 a 1)` | Camadas de tensão na música da ilha |
| `Som.pausar()` / `Som.retomar()` | Suspende e retoma todo o som |
| `Som.alternarMudo()`, `Som.estado()`, `Som.aoMudar(fn)` | Mudo e estado atual |
| `Som.volume()`, `Som.volumeMusica()`, `Som.volumeEfeitos()` | Volumes de 0 a 1 |
| `Som.criarControles(el, { compacto })` | Cria o botão de som com volumes dentro de `el` |
| `Som.ligarTeclaM()` | Liga a tecla M |
| `Som.efeitos`, `Som.faixas`, `Som.elementos` | Listas de nomes válidos |

**Integração no jogo:** o script do jogo nunca chama `Som` diretamente; usa três atalhos que ignoram qualquer erro, para o jogo funcionar mesmo se o áudio falhar ou não existir:

```js
const sfx = (nome, opts) => { try { window.Som && Som.play(nome, opts); } catch (e) {} };
const music = nome => { try { window.Som && Som.musica(nome); } catch (e) {} };
const tension = v => { try { window.Som && Som.tensao(v); } catch (e) {} };
```

Principais pontos de chamada: `startBattle` (início e música de batalha), `closeBattle` (volta à música da ilha ou da invasão), o laço `tick` (tremor e tensão nos avisos, ovo pronto), `startFinal` (despertar e música da invasão), `startGame` (música da ilha, tensão zero), `endGame` (final de vitória ou derrota e música do placar), `playFx`/`fxSound` (sons de golpe sincronizados com a animação). O controle de som é criado uma vez, na inicialização, dentro de `#somctl`, um contêiner fixo que o `morph` não recria; o controle impede que seus cliques cheguem ao despachante de ações do jogo.

**Novo som:** adicione o efeito em `audio.js`, teste em `demo.html`, copie o arquivo para o trecho `AUDIO-START`/`AUDIO-END` do `index.html` e chame `sfx('nome')` no ponto do jogo.
