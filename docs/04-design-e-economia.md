# Design e economia

Este documento explica **como cada sistema funciona**. Os números exatos em tabela ficam em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md), gerado do código.

## Tempo

- O jogo roda num laço de 4 atualizações por segundo; cada atualização avança o relógio pelo tempo real decorrido (no máximo 2 segundos por passo, para não "pular" a partida se o navegador travar).
- Tudo é medido em **segundos de partida** (`S.t`), não em hora do relógio. Pausar congela tudo: produção, plantações, ovos, eventos e o cronômetro.
- O jogo pausa sozinho quando a aba fica oculta.
- O cronômetro (☠️) conta o tempo até o despertar do Dragão Ancestral (no Infinito, até a próxima invasão, com o número da onda). Avisos aparecem a 5 min, 2 min, 1 min e 30 s; no último minuto ele fica vermelho e pulsa.
- Ao zerar, começa a fase final: a ilha congela (sem produção, plantações, ovos ou eventos; buffs e o ovo perdido somem; uma batalha em andamento é cancelada sem contar) e só resta a Invasão Final.

## Habitats e ouro

- Cada habitat comporta **3 dragões**. Os dragões ocupam os habitats na ordem em que chegaram (os 3 primeiros no habitat 1, e assim por diante).
- Cada dragão produz ouro por segundo conforme raridade e nível: `ouro/s = base da raridade × (1 + 0,4 × (nível − 1))`.
- O ouro produzido fica **guardado no habitat** até ser coletado. O limite é **60 segundos de produção** daquele habitat (mínimo de 50 de ouro). Ao encher, o habitat ganha borda dourada e para de acumular.
- Coletar um habitat dá +2 XP. "Coletar tudo" (nível 5, tecla C) recolhe todos de uma vez e também dá +2 XP no total.
- Preço do próximo habitat: `150 × 2,1^(habitats − 1)`.
- A ilha tem lotes para no máximo **10 habitats** (30 dragões). O próximo lote livre aparece tracejado no mapa, com o preço.
- Sem espaço nos habitats você não pode comprar dragões nem chocar ovos.

## Fazendas e comida

- A partida começa com 2 fazendas, numa fileira na beira da ilha, e pode chegar a **12**. Preço da próxima: `100 × 1,8^(fazendas − 2)`.
- Escolha a semente no seletor sobre o mapa; clicar numa fazenda vazia planta (paga ouro), clicar numa fazenda pronta (balão ✋) colhe.
- Plantações liberam por nível do jogador: 🌾 Trigo (1), 🌽 Milho (2), 🎃 Abóbora (4), 🍇 Fruta-dragão (7).
- Colher dá `1 + comida ÷ 15` de XP.
- No nível 3 libera **Colher e replantar tudo**: colhe tudo o que estiver pronto e replanta a plantação selecionada em toda fazenda vazia, enquanto houver ouro.
- Comida serve para **alimentar dragões**. Cada alimentação sobe 1 nível; o custo é `10 × 1,5^(nível atual − 1)` e cresce rápido (do nível 14 para o 15 custa 1.946).

## Nível do jogador e XP

- XP necessário para passar do nível `L`: `40 × L^1,6`. Nível máximo: 30.
- Cada nível novo dá `2 + ⌊nível ÷ 5⌋` gemas e pode desbloquear elementos na loja, plantações e atalhos (veja a tabela de níveis).

**De onde vem o XP:**

| Ação | XP |
|---|---|
| Coletar um habitat (ou "coletar tudo") | 2 |
| Colher | 1 + comida ÷ 15 |
| Comprar dragão | 10 |
| Alimentar dragão | 3 + novo nível do dragão |
| Comprar habitat / espaço de chocadeira / fazenda | 8 / 8 / 5 |
| Cruzar | 5 |
| Chocar ovo | 10 × valor da raridade, +15 se for espécie nova |
| Vencer batalha de liga | 15 × liga + 5 × luta |
| Vencer Dragão Selvagem | o dobro de uma luta de liga |
| Vencer o Ancestral adormecido | 400 |
| Repelir uma invasão (só no Infinito) | 300 |
| Perder batalha | 5 |
| Resgatar missão | 20 + 8 × nível do jogador |

## Gemas

**Ganhar:** subir de nível, conquistas (1 a 20 cada), missões (1 a 3), vitórias na Arena (gemas = número da liga), Mercador Viajante (10), Ancestral adormecido (30), cada invasão repelida no Infinito (20).

**Gastar:**

| Uso | Custo |
|---|---|
| Acelerar ovo (choca na hora) | 1 gema a cada 8 segundos restantes, arredondando para cima |
| 🔮 Ovo misterioso | 20 gemas. Sorteia entre todos os Épicos e cerca de metade dos Lendários (cada Lendário entra no sorteio com 50% de chance), o que dá por volta de 10% de Lendário. Ocupa um espaço da chocadeira. |
| 💰 Saco de ouro | 5 gemas = `150 × nível do jogador + 30 segundos da produção atual` de ouro |

## Loja

- **Dragões puros** dos 9 elementos, liberados por nível do jogador. Cada compra dá 10 XP.
- **Habitat**, **Fazenda** e **Espaço na chocadeira** (até 4 espaços: 300, 1.500 e 6.000 de ouro).
- **Saco de ouro** e **Ovo misterioso**, pagos com gemas.

Vender um dragão (painel Dragões, com confirmação em dois cliques) devolve `25 × valor da raridade × nível` de ouro. É preciso manter pelo menos um dragão.

## Missões

- Sempre há **3 missões ativas**. As 3 primeiras são fixas e fáceis (coletar 1 vez, colher 2 vezes, alimentar 2 vezes).
- Ao resgatar uma missão, ela é trocada na hora por uma nova de um **tipo diferente** das que estão na tela. A meta e a recompensa escalam com o nível do jogador **no momento em que a missão é criada**.
- O progresso conta a partir da criação da missão (o que você fez antes não vale).

| Tipo | Meta no nível L |
|---|---|
| 🪙 Ganhar ouro | `250 × 1,55^(L−1)` |
| 🌾 Colher comida | `60 × 1,45^(L−1)` |
| 🥚 Chocar ovos | `1 + ⌊L ÷ 4⌋` |
| ⚔️ Vencer batalhas | `1 + ⌊L ÷ 3⌋` |
| 🍖 Alimentar dragões | `3 + L` |
| 💞 Cruzar | `1 + ⌊L ÷ 4⌋` |
| 🧺 Fazer colheitas | `4 + L` |
| 🏛️ Coletar ouro | `5 + 2 × L` |

**Recompensa:** ouro `80 × 1,45^(L−1)`, gemas 1 (2 a partir do nível 6, 3 a partir do 12) e XP `20 + 8 × L`. Metas e ouro acima de 50 são arredondados para múltiplos de 5.

## Eventos aleatórios

O primeiro evento chega aos **50 segundos**; depois, um novo a cada **60 a 100 segundos** (sorteado). Cada um dos 5 tipos tem a mesma chance.

| Evento | Efeito | Duração |
|---|---|---|
| 🌧️ Chuva de Ouro | Habitats produzem o dobro | 30 s |
| 🌻 Colheita Farta | Plantações crescem 3x mais rápido | 30 s |
| 🥚 Ovo Perdido | Um ovo aparece num ponto aleatório da tela; clique nele para ganhar um ovo **Raro ou Épico** de bônus, que **não ocupa** espaço na chocadeira | 10 s |
| 🐲 Dragão Selvagem | Botão especial na Arena: um único oponente com 160% de vida e recompensa x3 em ouro e gemas, x2 em XP. Some ao ser enfrentado. | 45 s |
| 🧳 Mercador Viajante | Troque `400 × nível do jogador` de ouro por 10 gemas (uma vez) | 30 s |

Os efeitos ativos aparecem como selos na barra superior, com contagem regressiva.

## Pontuação e nota final

A pontuação é calculada a qualquer momento (aparece nas estatísticas) e fechada no fim da partida.

| Parte | Cálculo |
|---|---|
| Ouro ganho | ouro ganho no total ÷ 10 |
| Dragões | para cada dragão na ilha: 100 × valor da raridade + 15 × nível |
| Espécies descobertas | 150 por espécie |
| Conquistas | 250 por conquista |
| Arena | 600 por liga concluída + 200 por luta vencida na liga atual + 40 por vitória (qualquer batalha) |
| Ancestral adormecido | 2.000 se vencido ao menos uma vez na Arena |
| **Invasão Final** | Rápida, Padrão e Longa: vitória 12.000, +3.000 se nenhum dragão cair; derrota 6.000 × fração da vida que você tirou; tudo multiplicado pelo peso do modo. Zero se você encerrou antes. Infinito: 12.000 por invasão repelida + 3.000 por invasão repelida sem perder dragões + 6.000 × fração de dano na invasão perdida (sem multiplicar). |
| Nível do jogador | 200 por nível |
| Missões | 100 por missão concluída |

Valor da raridade: Comum 1, Raro 2, Épico 3, Lendário 5.

**Peso do modo:** duração ÷ 20 minutos (Rápida 0,5; Padrão 1; Longa 1,5). No Infinito, tempo jogado ÷ 20 minutos, com mínimo de 0,5.

**Nota:** compara a pontuação com limites multiplicados pelo peso do modo.

| Nota | Padrão (peso 1) | Rápida (0,5) | Longa (1,5) | Infinito |
|---|---|---|---|---|
| **S** | 60.000+ | 30.000+ | 90.000+ | 60.000 × peso |
| **A** | 35.000+ | 17.500+ | 52.500+ | 35.000 × peso |
| **B** | 18.000+ | 9.000+ | 27.000+ | 18.000 × peso |
| **C** | 8.000+ | 4.000+ | 12.000+ | 8.000 × peso |
| **D** | abaixo disso | abaixo disso | abaixo disso | abaixo disso |
