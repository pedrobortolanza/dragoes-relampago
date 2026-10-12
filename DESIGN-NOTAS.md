# Dragões Relâmpago — notas de design (fonte para a documentação)

Este arquivo descreve o que está **implementado** em `index.html`. Os números vêm das tabelas no topo do `<script>` (entre `DATA-START` e `DATA-END`) e das funções de fórmula logo abaixo. Se o código mudar, atualize aqui.

## Conceito
- Jogo de navegador de **uma sessão**: o estado vive só na memória da aba. Fechou, perdeu. Sem contas, sem servidor, sem localStorage.
- Inspirado em Dragon City, mas com tempos curtos (ovos de 8 a 40s, colheitas de 5 a 90s) para caber em 10 ou 20 minutos.
- **Motivo para acabar:** o Dragão Ancestral dorme sob a ilha e desperta quando o relógio zera. Aí começa a **Invasão Final**, uma batalha obrigatória contra ele. O resultado decide o final da história e pesa na pontuação.
- Ao fim, tela de placar com nota (S/A/B/C/D), texto do final, pontuação detalhada, conquistas da partida e todas as estatísticas.

## Modos de partida
| Modo | Ancestral desperta em | Ancestral na Invasão Final | Observação |
|---|---|---|---|
| Rápida | 10 min | 1.200 de vida, 48 de ataque | Faixas de nota e pontos da Invasão valem 50% |
| Padrão | 20 min | 2.400 de vida, 70 de ataque | Referência de balanceamento |
| Longa | 30 min | 3.600 de vida, 88 de ataque | Faixas de nota e pontos da Invasão valem 150% |
| Infinito | a cada 15 min | 1.800 de vida e 60 de ataque na 1ª invasão, x1,35 a cada invasão seguinte | Acaba na primeira invasão perdida |

Peso do modo (`modeFactor`): duração/20 min; no Infinito, tempo jogado/20 min (mínimo 0,5).

### Modo Infinito
- O Ancestral invade aos 15:00, 30:00, 45:00… O relógio mostra o tempo até a próxima invasão e o número da onda.
- Vencer uma invasão: +3.000 × número da onda em ouro, +20 gemas, +300 XP, e a ilha volta a funcionar normalmente. A próxima invasão fica 35% mais forte.
- Perder uma invasão encerra a partida.
- Pontos da Invasão no Infinito: 12.000 por invasão vencida + 3.000 por invasão vencida sem perder dragões + 6.000 × fração de dano na invasão perdida.

### Invasão Final
- Avisos de tremor faltando 5 min, 2 min, 1 min e 30s.
- No zero, o relógio para, a produção para, eventos acabam e abre o anúncio "O Dragão Ancestral despertou!". O jogador escolhe até 3 dragões na Arena e clica em "Defender a ilha".
- O Ancestral ataca com elemento aleatório a cada turno, é neutro na defesa (sem fraquezas) e usa o Sopro Ancestral (poder 2,0) com recarga de 3 turnos.
- Se o jogador venceu o **Ancestral adormecido** na Arena (liberado após a liga Campeões) depois da última invasão, a próxima invasão começa com 30% menos vida. O efeito é consumido quando a invasão começa.
- Vitória: final "A ilha resistiu". Derrota: final "O Ancestral tomou a ilha", mostrando a % de dano causada. Desistir conta como derrota. Encerrar antes do despertar dá o final "ilha sem defesa".

O jogo **pausa sozinho** quando a aba fica oculta. Botão Pausar e tecla `P` também pausam. "Encerrar" pede confirmação na própria tela.

## Recursos
- **Ouro (🪙)**: produzido pelos dragões dentro dos habitats; precisa ser coletado com clique.
- **Comida (🍖)**: colhida nas fazendas; usada para subir o nível dos dragões.
- **Gemas (💎)**: vêm de subir de nível, arena, missões, conquistas e do Mercador. Servem para acelerar ovos, trocar por ouro e comprar Ovo Misterioso.
- **XP / Nível do jogador** (máx. 30): XP necessário para passar do nível `l` = `round(40 · l^1,6)`. Cada nível dá `2 + floor(nível/5)` gemas.

Início: 250 ouro, 30 comida, 5 gemas, 1 Dragão de Fogo nv1, 1 habitat, 2 fazendas, 1 espaço de chocadeira.

## Elementos (9)
| Elemento | Nível p/ comprar | Preço | Forte contra (x1,5) |
|---|---|---|---|
| 🔥 Fogo | 1 | 100 | Planta, Gelo, Metal |
| 💧 Água | 1 | 150 | Fogo, Terra |
| 🌿 Planta | 1 | 150 | Água, Terra |
| 🪨 Terra | 2 | 250 | Elétrico, Fogo, Metal |
| ⚡ Elétrico | 3 | 600 | Água, Metal |
| ❄️ Gelo | 4 | 900 | Planta, Terra |
| ⚙️ Metal | 6 | 2.500 | Gelo, Luz |
| 🌑 Trevas | 8 | 6.000 | Luz, Elétrico |
| ✨ Luz | 8 | 6.000 | Trevas, Gelo |

Se o defensor é forte contra o elemento do golpe, o dano é x0,7. Com dois elementos no defensor, os multiplicadores se multiplicam.

## Espécies e raridade (50 no Dragonário)
- **Puros (9)**: um elemento. Comum, exceto Metal/Trevas/Luz que são Raros.
- **Híbridos (36)**: dois elementos. Nome = prefixo do 1º + sufixo do 2º (ex.: Fogo+Água = *Piromaris*). Raro; Épico se tiver Metal, Trevas ou Luz.
- **Lendários (5)**, por receita: se os elementos dos dois pais juntos contêm a receita, há chance de lendário.

| Lendário | Receita | Chance |
|---|---|---|
| Eclipse | Luz + Trevas | 25% |
| Aurora | Gelo + Luz | 20% |
| Titã de Aço | Terra + Metal | 18% |
| Tempestade | Água + Elétrico | 15% |
| Vulcano | Fogo + Terra | 12% |

| Raridade | Ouro/s base | Vida base | Ataque base | Tempo de ovo |
|---|---|---|---|---|
| Comum | 1 | 100 | 20 | 8s |
| Raro | 2,5 | 125 | 25 | 15s |
| Épico | 6 | 160 | 33 | 25s |
| Lendário | 15 | 230 | 46 | 40s |

## Fórmulas dos dragões (nível 1 a 15)
- Ouro/s = base · (1 + 0,4 · (nível − 1))
- Vida = base · (1 + 0,2 · (nível − 1))
- Ataque = base · (1 + 0,16 · (nível − 1))
- Poder (para ordenar o time) = vida/4 + ataque·2
- Alimentar do nível `n` para `n+1` custa `round(10 · 1,5^(n−1))` de comida
- Vender rende `25 · valorRaridade · nível` (valor: Comum 1, Raro 2, Épico 3, Lendário 5). Pede confirmação com um segundo clique.

## Ilha
- **Habitat**: 3 dragões cada. Acumula até 60s da produção dos seus dragões (mínimo 50). Clique para coletar. Custo do próximo: `150 · 2,1^(habitats − 1)`.
- **Coletar tudo**: libera no nível 5 (tecla `C`).
- **Fazendas**: custo `100 · 1,8^(fazendas − 2)`.

| Plantação | Tempo | Comida | Custo | Nível |
|---|---|---|---|---|
| 🌾 Trigo | 5s | 12 | 10 | 1 |
| 🌽 Milho | 20s | 60 | 40 | 2 |
| 🎃 Abóbora | 45s | 180 | 120 | 4 |
| 🍇 Fruta-dragão | 90s | 520 | 350 | 7 |

- **Colher e replantar tudo**: libera no nível 3.
- **Chocadeira**: 1 espaço inicial; compra do 2º, 3º e 4º por 300 / 1.500 / 6.000. Ovo pronto precisa de vaga no habitat para chocar. Acelerar custa `ceil(segundos restantes / 8)` gemas.

## Cruzamento
- Os dois pais precisam de **nível 3+**. Custo: `30 · (valorRaridadeA + valorRaridadeB)` de ouro.
- O filhote herda um elemento sorteado de cada pai. A tela mostra as probabilidades de cada resultado antes de cruzar.
- Ordem do sorteio: primeiro cada receita lendária aplicável, em sequência; o restante é dividido igualmente entre as combinações de elementos.

## Arena
- 8 ligas: Bronze, Prata, Ouro, Platina, Diamante, Mestre, Grão-Mestre, Campeões. 3 lutas por liga.
- Oponentes: quantidade `min(3, ceil((liga + luta)/2))`, nível `1 + (liga−1)·2 + luta` (máx. 15), stats x0,95. Raridades por liga: Bronze C; Prata C/R; Ouro R/C; Platina R/E; Diamante E/R; Mestre E/R; Grão-Mestre E/L; Campeões L/E.
- Time de até 3 dragões (padrão: os 3 mais fortes). Todos começam com vida cheia.
- Turnos: você ataca primeiro, depois o oponente. Ataque = elemento principal, poder 1,0. Especial = segundo elemento (ou o principal), poder 1,7 (2,0 em Lendários), recarga de 3 turnos.
- Dano = ataque · poder · vantagem · (1,5 se crítico, chance 12%) · aleatório 0,9–1,1.
- **Batalha automática** escolhe o melhor golpe a cada 0,6s.
- Vitória: ouro `90 · liga^1,9 · (1 + 0,5·luta)`, gemas = liga, XP `15·liga + 5·luta`. Derrota: 5 XP, sem perda.
- **Ancestral adormecido**: após vencer Campeões, luta opcional contra o Ancestral com 80% da vida e do ataque da Invasão Final do modo. Vitória: 8.000 ouro (4.000 no Rápido), 30 gemas, 400 XP e, na primeira vez, deixa o Ancestral com 30% menos vida na Invasão Final. Pode ser repetido, mas o enfraquecimento não acumula.

## Missões
3 ativas. As iniciais são tutoriais (coletar 1x, colher 2x, alimentar 2x). Depois sorteadas entre: ganhar ouro, colher comida, chocar ovos, vencer batalhas, alimentar, cruzar, colher, coletar. Meta e recompensa crescem com o nível do jogador (ouro `80 · 1,45^(nível−1)`, 1–3 gemas, XP `20 + 8·nível`).

## Eventos (a cada 60–100s, o primeiro aos 50s)
| Evento | Efeito | Duração |
|---|---|---|
| 🌧️ Chuva de Ouro | ouro dos habitats x2 | 30s |
| 🌻 Colheita Farta | fazendas x3 mais rápidas | 30s |
| 🥚 Ovo Perdido | ovo Raro/Épico flutua na tela; clicar coloca na chocadeira sem ocupar vaga | 10s |
| 🐲 Dragão Selvagem | luta especial na Arena com recompensa x3 | 45s |
| 🧳 Mercador Viajante | 10 gemas por `400 · nível` de ouro | 30s |

## Loja
Dragões puros por elemento, habitat, fazenda, espaço de chocadeira, Saco de ouro (5 gemas → `150·nível + 30s de produção`), Ovo misterioso (20 gemas → Épico garantido, chance de Lendário).

## Conquistas (65, em 9 categorias)
Cada uma dá gemas ao desbloquear (1 a 20). Lista completa com condições está no array `ACH` em `index.html`. Categorias: Primeiros passos (7), Riqueza (9), Coleção (11), Evolução (6), Fazenda (4), Arena (12), Ilha (7), Jogador (6), Invasão (3). Destaques: *Guardião da ilha* (vencer a Invasão Final), *Ilha intocável* (vencer sem perder dragões), *Cicatriz no Ancestral* (tirar 50% da vida dele), *Golpe no sono* (vencer o Ancestral adormecido), *Enciclopédia viva* (40 espécies), *Relâmpago* (nível 5 em 5 min), *Sorte de principiante* (Lendário em 10 min), *Arco-íris elemental* (9 elementos ao mesmo tempo).

## Estatísticas rastreadas
Aba Estatísticas (e tela final): gráfico de ouro acumulado e ouro/s ao longo da partida, dragões por elemento e tabelas em 7 grupos: Geral (tempo, modo, nível, XP, cliques, cliques/min, pontuação), Economia (ouro ganho/gasto, média por minuto, ouro/s atual e pico, coletas, maior coleta, gemas), Fazenda, Dragões (inclusive obtidos por raridade e poder total), Cruzamento (inclusive tempo do primeiro Lendário), Arena (liga, vitórias, derrotas, taxa, sequências, dano, maior golpe, críticos, super eficazes, nocautes, vitórias perfeitas, selvagens, chefe) e Progresso.

## Pontuação e nota
Pontos = ouro ganho/10 + Σ dragões (100·valorRaridade + 15·nível) + 150 por espécie + 250 por conquista + Arena ((liga−1)·600 + 200 por luta da liga atual + 40 por vitória) + 2.000 se venceu o Ancestral adormecido + **Invasão Final** + 200 por nível do jogador + 100 por missão.

Invasão Final (Padrão; metade no Rápido): vitória = 12.000 (+3.000 sem perder dragões); derrota = 6.000 × fração da vida do Ancestral removida; sem invasão = 0.

Nota no modo Padrão: S ≥ 60.000 · A ≥ 35.000 · B ≥ 18.000 · C ≥ 8.000 · D abaixo. No modo Rápido as faixas valem metade.

## Controles
Clique/toque em tudo. Teclas: `1`–`9` abrem os painéis do dock (1 = Ilha), `Esc` fecha o painel, `P` pausa, `C` coleta tudo (nível 5+), `M` liga/desliga o som, `Tab` + `Enter` ativam as construções do mapa.

## Interface (visão isométrica, estilo Dragon City)
- A tela principal é a **ilha em visão isométrica**: um mapa SVG de 14×14 lotes em losango (proporção 2:1), com mar animado, ondas, nuvens passando, praia, penhasco de terra, caminhos e árvores.
- **Construções clicáveis:**
  - **Habitats** (até 10 lotes): mostram até 3 dragões passeando. O balão de moeda mostra o ouro acumulado e pulsa quando está cheio. Clique para coletar. O próximo lote livre aparece tracejado, com o preço para comprar.
  - **Fazendas** (até 12 lotes, numa fileira na beira da ilha): terra arada, broto que cresce com o progresso, barra de progresso e a planta com o balão ✋ quando pronta. O próximo lote livre aparece tracejado.
  - **Mural de Missões**: tem balão com o número de missões prontas para resgatar.
  - **Montanha do Amor** (cruzamento): coração pulsando.
  - **Chocadeira**: mostra os ovos na frente, coloridos pela raridade, e um balão 🐣 quando algum está pronto.
  - **Mercado** (loja).
  - **Arena**: coliseu com bandeiras. Mostra balão 🐲 quando há Dragão Selvagem, ⚔️ quando há batalha em andamento e ☠️ quando o Ancestral desperta.
- Os 2 dragões mais raros voam em volta da ilha (com 6+ dragões; 1 com 3 a 5 dragões).
- Rótulos e balões ficam numa camada acima de tudo. As construções são desenhadas em ordem de profundidade (x+y).
- **HUD sobre o mapa:** escolha da semente; botões Colher e replantar (nível 3+) e Coletar tudo (nível 5+).
- **Barra inferior (dock):** Ilha, Dragões, Cruzar, Chocadeira, Arena, Missões, Loja, Conquistas, Estatísticas, com selos de contagem na Chocadeira e nas Missões. Cada item, ou um clique na construção, abre um **painel** sobre a ilha. No celular, o painel sobe de baixo. Fecha com ✕, com clique fora ou com Esc.
- **Celular:** o mapa mantém 920px de largura e rola de lado dentro da própria área, começando centralizado.

## Visual dos dragões
- Cada dragão é desenhado em SVG (função `dragonSVG`), de perfil e olhando para a direita: asas de morcego, cauda, corpo com barriga listrada, patas com garras, cabeça com chifres, focinho, presa e olho.
- **Cores:** corpo na cor do 1º elemento; asas e barriga na cor do 2º.
- **Acabamento (v2):** corpo, asas e barriga com gradientes por elemento (definidos uma vez em um `<svg><defs>` oculto no topo da página, função `buildDefs()`), placas na barriga, escamas, brilho no dorso, ossos e garra nas asas, ponta de lança na cauda quando o elemento não tem acessório na ponta, crânio e focinho em um só traço com dentes, narina e sobrancelha, e íris na cor do elemento com pupila em fenda. Épico e acima ganham crista; Lendário ganha coroa dourada com gema.
- **Acessórios por elemento:** Fogo (chama na cauda e fumaça no focinho), Água (barbatanas e gota), Planta (folhas nas costas e na cauda), Terra (placas de pedra), Elétrico (raio na cauda e faísca), Gelo (cristais nas costas e nos chifres), Metal (armadura com rebites e elmo), Trevas (fumaça roxa e olhos roxos), Luz (brilhos ao redor e olhos dourados).
- **Por raridade:** Comum é simples; Raro ganha espinhos nas costas e na cauda; Épico ganha asas 18% maiores e crista; Lendário ganha coroa, chifres e espinhos dourados e aura pulsante. Uma base colorida pela raridade fica sob os pés.
- **Animações (CSS):** flutuar, bater asas, balançar a cauda, mover a cabeça, piscar, chama tremulando, raio piscando, brilhos e fumaça. Cada dragão tem um atraso próprio, para não se mexerem em sincronia. Tudo é desligado com `prefers-reduced-motion`.
- **Batalha:** o atacante dá uma investida, um projétil com o emoji do elemento voa até o alvo, o alvo pisca e treme, e o dano sobe em número (verde se super eficaz, dourado se crítico). O oponente aparece espelhado; o Ancestral aparece em tamanho maior.
- **Nascimento:** espécie nova ou raridade Épica ou Lendária abre uma tela de revelação com o dragão surgindo.
- Dragonário: espécies não descobertas aparecem como silhueta.
- **Ilha (v2):** mar em gradiente com espuma animada na borda, areia e penhascos com camadas de rocha, grama com textura, caminhos de pedra, árvores frutíferas e pinheiros, flores, pedras e arbustos. Cada habitat ganha o tema do elemento da maioria dos seus dragões: lago de lava (Fogo), lagoa (Água), arbustos e flores (Planta), rochas (Terra), bobina elétrica (Elétrico), cristais de gelo (Gelo), engrenagem (Metal), cristais roxos (Trevas) e pilares dourados (Luz). Construções com sombras e gradientes (Arena de pedra, Montanha do Amor, cúpula da Chocadeira, Mercado com toldo, Mural de Missões com telhado).
- **Correção:** os dragões dentro do mapa são `<svg>` aninhados e recebem `width`/`height` também como atributos, além do CSS. Sem isso, alguns navegadores mostravam um dragão gigante flutuando no canto.

## Sons e música
- Tudo é sintetizado com a Web Audio API (`audio/audio.js`, objeto global `Som`), sem arquivos de áudio. O conteúdo de `audio.js` está **embutido** no `index.html`, entre os comentários `AUDIO-START` e `AUDIO-END`. Para atualizar o áudio, substitua esse trecho pela versão nova do arquivo.
- O som liga no primeiro clique ou tecla (regra dos navegadores). Há um botão de mudo com volumes no canto superior direito do mapa, e a tecla `M` também liga/desliga. O som pausa junto com o jogo e quando a aba fica oculta.
- **Músicas:** `ilha` (partida normal; fica mais tensa com `Som.tensao` nos avisos de tremor), `batalha` (lutas na Arena), `invasao` (Invasão Final) e `placar` (tela final). As trocas são feitas com fade.
- **Efeitos ligados no jogo:**
  - Interface: clique, troca de aba e erro (todo aviso vermelho).
  - Economia: coletar (mais moedas quanto maior a coleta), coletar tudo, plantar, colher, colher tudo, comprar, vender, gemas (Mercador).
  - Progresso: alimentar e nível do dragão, nível do jogador, conquista e missão.
  - Ovos: ovo colocado, ovo pronto, chocar, e revelação por raridade na tela de espécie nova, Épico ou Lendário.
  - Cruzamento.
  - Batalha: início, ataque e especial por elemento, Sopro Ancestral, acerto, crítico, super eficaz, pouco eficaz, nocaute, vitória e derrota. Os sons de golpe seguem a animação: o lançamento sai junto com o projétil, e o impacto toca quando ele chega.
  - Eventos: um som próprio para cada evento, mais ovo pego.
  - Ancestral: tremor com intensidade crescente aos 5 min, 2 min, 1 min e 30 s, despertar, e o final de vitória ou de derrota.

## Arquitetura técnica
- Um único `index.html` com HTML, CSS e JavaScript puro, sem dependências nem build. Fontes do Google Fonts (com fallback).
- Laço de jogo a cada 250ms (`tick`), tempo real com `dt` limitado a 2s.
- Interface gerada como strings de HTML e aplicada com um "morph" próprio (`morph`/`patchNode`), que só altera os nós e atributos que mudaram. Isso mantém as animações dos dragões rodando sem reiniciar a cada quadro. Ações via atributos `data-a` com um único ouvinte: mouse age no `pointerdown` (para não perder cliques durante a re-renderização), toque age no `pointerup` sem arrasto (para não disparar ao rolar).
- `window.__game` expõe o estado e as ações para testes automatizados.
