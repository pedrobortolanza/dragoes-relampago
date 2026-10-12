# Dragões Relâmpago: documentação

Jogo de navegador inspirado em Dragon City, para uma única sessão: crie, cruze, evolua e batalhe com dragões antes que o relógio zere e o Dragão Ancestral desperte para a Invasão Final. Nada é salvo; ao fim você recebe nota, pontuação e um relatório completo de estatísticas e conquistas.

**Para jogar:** abra `dragoncity/index.html` no navegador.

## Índice

| Documento | Para quem | Conteúdo |
|---|---|---|
| [01 · Visão geral](01-visao-geral.md) | Todos | Proposta, pilares de design, ciclo do jogo, recursos, modos e fim da partida |
| [02 · Como rodar](02-como-rodar.md) | Todos | Abrir, servir localmente, publicar, regenerar tabelas |
| [03 · Guia do jogador](03-guia-do-jogador.md) | Jogadores | A ilha e suas construções, painéis, atalhos, roteiro dos primeiros minutos, estratégia |
| [04 · Design e economia](04-design-e-economia.md) | Design | Tempo, habitats, fazendas, XP, gemas, loja, missões, eventos, pontuação e nota |
| [05 · Dragões e cruzamento](05-dragoes-e-cruzamento.md) | Design | Elementos, raridades, 50 espécies, atributos, regras de cruzamento, chocadeira, aparência |
| [06 · Batalhas](06-batalhas.md) | Design | Ligas, time, turnos, golpes, fórmula de dano, Ancestral adormecido, Invasão Final, animações |
| [07 · Estatísticas e conquistas](07-estatisticas-e-conquistas.md) | Design | Todas as estatísticas e as 65 conquistas |
| [08 · Arquitetura](08-arquitetura.md) | Programadores | Estrutura do código, estado, laço, mapa isométrico, render, entrada, como estender |
| [09 · Tabelas de referência](09-tabelas-de-referencia.md) | Balanceamento | Números exatos, gerados do código |
| [10 · Sons e música](10-sons-e-musica.md) | Todos | Músicas, efeitos sonoros, controle de som e como o áudio é integrado |

## Números do jogo

| | |
|---|---|
| Visão | Ilha isométrica clicável, estilo Dragon City, com dragões e construções em 3D (modelos CC0 renderizados em sprites com three.js) e menus com cara de jogo: botões em relevo, molduras douradas e um cenário de fundo por menu e por liga |
| Elementos | 9 (6 básicos, 3 especiais) |
| Espécies | 50 (6 Comuns, 18 Raras, 21 Épicas, 5 Lendárias) |
| Nível máximo do dragão / do jogador | 15 / 30 |
| Ligas da Arena | 8, com 3 lutas cada, mais o Ancestral adormecido |
| Conquistas | 65, em 9 categorias (301 gemas no total) |
| Estatísticas acompanhadas | cerca de 60 |
| Eventos aleatórios | 5 tipos, um a cada 60 a 100 s |
| Áudio | 4 músicas e 48 efeitos sintetizados no navegador, sem arquivos de som |
| Modos | Rápida (10 min), Padrão (20 min) e Longa (30 min), terminando na Invasão Final; Infinito, com invasões a cada 15 min até a primeira derrota |

## Créditos

- Dragão: "Dragon Evolved", do pacote Ultimate Monsters, de [Quaternius](https://quaternius.com) (CC0).
- Construções e decoração: KayKit Medieval Hexagon Pack, de [Kay Lousberg](https://kaylousberg.com) (CC0).
- [three.js](https://threejs.org) r147, com GLTFLoader e SkeletonUtils (licença MIT).

## Manutenção

- O código é dono da verdade. Esta pasta descreve a versão do `index.html` que está ao lado dela.
- As tabelas do documento 09 são geradas por `docs/ferramentas/gerar-tabelas.js`. Rode de novo depois de mudar números do jogo.
