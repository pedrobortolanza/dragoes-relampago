# Visão geral

**Dragões Relâmpago** é um jogo de navegador inspirado em Dragon City, feito para caber numa única sessão de jogo. O Dragão Ancestral dorme sob a ilha e vai despertar quando o relógio zerar. Até lá, você cria, alimenta, cruza e coleciona dragões, treina na Arena e monta o exército que vai defender a ilha na batalha final.

## A proposta em uma frase

Tudo o que Dragon City faz em semanas, comprimido em 10, 20 ou 30 minutos, numa ilha isométrica clicável, com um placar final cheio de números.

## Pilares de design

| Pilar | O que significa na prática |
|---|---|
| **Sessão única** | Nada é salvo. Fechou a aba, a partida acabou. Por isso tudo é rápido: ovos chocam em segundos, plantações crescem em segundos, missões se renovam na hora. |
| **Tempo finito com motivo para acabar** | O relógio (10, 20 ou 30 minutos) é a contagem para o **despertar do Dragão Ancestral**. Quando zera, começa a **Invasão Final**: uma única batalha contra ele, que vale a maior fatia da pontuação. Ao fim, você recebe uma nota de **S a D**. |
| **Visual de Dragon City** | A tela principal é a ilha vista em diagonal (isométrica), com construções clicáveis, balões de coleta e dragões em 3D animados passeando e voando. |
| **Som** | Música que muda com o momento (ilha, batalha, invasão, placar) e fica tensa quando o Ancestral se aproxima, mais efeitos para cada ação. Tudo gerado no navegador. Veja [10-sons-e-musica.md](10-sons-e-musica.md). |
| **Dinâmico** | Sempre há algo para clicar: ouro acumulando nos habitats, comida pronta, ovos chocando, missões para resgatar e eventos surpresa a cada 1 a 2 minutos. |
| **Muitas estatísticas** | Cerca de 60 números acompanhados ao vivo (ouro por minuto, taxa de vitória, maior golpe, cliques por minuto...), um gráfico de ouro ao longo do tempo e um relatório completo no fim. |
| **Muitas conquistas** | 65 conquistas em 9 categorias, cada uma pagando gemas. |
| **Coleção** | 50 espécies de dragão (9 puras, 36 híbridas, 5 lendárias) para descobrir no Dragonário. |

## O ciclo do jogo

```
 Habitats geram OURO ──► compre dragões, habitats, fazendas, plantações
        ▲                                   │
        │                                   ▼
 mais dragões e níveis          Fazendas geram COMIDA
        ▲                                   │
        │                                   ▼
 Chocadeira ◄── Cruzamento ◄── Alimentar dragões (sobe de nível)
                                            │
                                            ▼
                 ARENA: ligas Bronze → Campeões → Ancestral adormecido
                                            │
                                            ▼
                         ouro, gemas e XP ──► nível do jogador ──► desbloqueios

  ⏱ relógio zera ──► ☠️ INVASÃO FINAL: seu melhor time contra o Dragão Ancestral ──► placar
```

Missões, eventos e conquistas correm em paralelo e alimentam o ciclo com ouro, gemas e XP extras.

## Recursos

| Recurso | Para que serve | Como ganhar |
|---|---|---|
| 🪙 **Ouro** | Quase tudo: dragões, habitats, fazendas, plantações, cruzamentos | Coletar dos habitats, vitórias na Arena, missões, vender dragões |
| 🍖 **Comida** | Alimentar dragões (subir de nível) | Colher plantações |
| 💎 **Gemas** | Acelerar ovos, ovo misterioso, trocar por ouro | Subir de nível, conquistas, missões, Arena, Mercador Viajante |
| ⭐ **XP** | Subir o nível do jogador, que desbloqueia elementos e plantações | Praticamente toda ação dá um pouco |

## Modos de partida

| Modo | O Ancestral invade | Como termina |
|---|---|---|
| Rápida | aos 10 minutos | Na Invasão Final |
| Padrão | aos 20 minutos | Na Invasão Final |
| Longa | aos 30 minutos | Na Invasão Final |
| Infinito | a cada 15 minutos, 35% mais forte a cada vez | Na primeira invasão perdida |

Quanto mais longo o modo, mais forte o Ancestral e maiores as faixas de nota. No Infinito, a ilha volta a funcionar depois de cada invasão repelida, e as faixas de nota crescem com o tempo jogado.

## Como a partida termina

1. Avisos aparecem quando faltam 5 min, 2 min, 1 min e 30 s para o despertar.
2. Quando o relógio zera, **o Dragão Ancestral desperta** (no Infinito, a cada 15 minutos): a ilha para (sem produção, eventos nem outras batalhas) e o jogo leva você à Arena para escolher até 3 dragões.
3. Acontece a **Invasão Final**, uma batalha única. Vencer vale muitos pontos; perder ainda pontua pela porcentagem de vida que você tirou dele. No Infinito, vencer devolve a ilha ao normal até a próxima invasão; perder encerra a partida.
4. Depois da batalha, a tela de fim mostra a nota, a pontuação detalhada, o desfecho da ilha, as conquistas da partida e todas as estatísticas.

O jogador também pode clicar em **Encerrar** antes disso, mas aí a ilha fica sem defesa e a Invasão Final não pontua. Detalhes em [06-batalhas.md](06-batalhas.md#a-invasão-final) e [04-design-e-economia.md](04-design-e-economia.md#pontuação-e-nota-final).

## Tecnologia em uma linha

Um único arquivo `index.html` com HTML, CSS e JavaScript, sem servidor e sem nada a instalar. A única biblioteca, three.js (para os modelos 3D), e os próprios modelos 3D (CC0, de Quaternius e Kay Lousberg) vêm embutidos no arquivo; o áudio é sintetizado por código. Detalhes em [08-arquitetura.md](08-arquitetura.md).
