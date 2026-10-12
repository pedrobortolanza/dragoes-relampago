# Estatísticas e conquistas

## Onde aparecem

- **Painel 📊 Estatísticas** (tecla 9), atualizado ao vivo:
  - 6 indicadores no topo: ouro ganho, dragões, espécies, vitórias/batalhas, conquistas e pontos;
  - **gráfico de ouro ao longo da partida** (linha laranja = ouro ganho acumulado; tracejado azul = ouro por segundo), com um ponto a cada 5 segundos, redesenhado a cada 5 segundos;
  - barras de **dragões por elemento** (híbridos contam nos dois elementos);
  - tabelas de todas as estatísticas, por grupo.
- **Tela de fim de partida:** nota, pontuação detalhada, desfecho da ilha, indicadores (inclusive o dano causado ao Ancestral), conquistas da partida com o minuto de cada uma, e todas as estatísticas num painel expansível.

## Lista de estatísticas

### Geral
| Estatística | Significado |
|---|---|
| Tempo de jogo | Tempo de partida decorrido (pausas não contam) |
| Modo | Rápida, Padrão, Longa ou Infinito |
| Nível do jogador / XP total | Nível atual e todo XP ganho |
| Cliques | Todo clique em algo acionável durante a partida |
| Cliques por minuto | Cliques ÷ minutos jogados |
| Pontuação atual | Pontuação que você teria se a partida acabasse agora |

### Economia
Ouro ganho, ouro gasto, ouro por minuto (média), ouro por segundo agora, pico de ouro por segundo, coletas, maior coleta, gemas ganhas, gemas gastas.

### Fazenda
Plantios, colheitas, comida colhida, comida gasta, número de fazendas.

### Dragões
Dragões na ilha, comprados, vendidos, espécies descobertas (de 50), maior nível alcançado, alimentações, dragões obtidos por raridade (o dragão inicial conta como 1 Comum), poder total do time (soma do poder de todos os dragões).

### Cruzamento
Cruzamentos, ovos chocados, ovos acelerados, minuto do primeiro Lendário, ovos perdidos pegos.

### Arena
Liga atual, batalhas, vitórias, derrotas, taxa de vitória, sequência atual, melhor sequência, dano causado, dano recebido, maior golpe, golpes críticos, golpes super eficazes, nocautes, dragões nocauteados, vitórias perfeitas, selvagens derrotados, vitórias sobre o Ancestral adormecido e invasões repelidas e o resultado da Invasão Final (vencida, ou derrota com a % de dano).

### Progresso
Missões concluídas, eventos presenciados, conquistas desbloqueadas.

## Conquistas

São **65 conquistas** em 9 categorias, somando **301 gemas**. Cada conquista:

- é verificada várias vezes por segundo e logo após cada clique;
- dá suas gemas na hora e mostra um aviso dourado 🏆;
- registra o **minuto da partida** em que foi desbloqueada;
- vale **250 pontos** na pontuação final.

Como não há salvamento, as conquistas valem por partida: toda partida nova começa com todas bloqueadas.

| Categoria | Quantidade | Foco |
|---|---|---|
| Primeiros passos | 7 | Primeira vez de cada ação; guiam o jogador iniciante |
| Riqueza | 9 | Ouro total, ouro por segundo, gemas |
| Coleção | 11 | Quantidade de dragões, raridades, todos os elementos, espécies descobertas |
| Evolução | 6 | Níveis de dragão, alimentações, cruzamentos, acelerar ovos |
| Fazenda | 4 | Comida colhida, colheitas, número de fazendas |
| Arena | 12 | Vitórias, ligas, Ancestral adormecido, sequências, críticos, vitória perfeita, golpe de 300 |
| Ilha | 7 | Habitats, chocadeira, vender, missões, ovos perdidos, eventos |
| Jogador | 6 | Nível do jogador, desafios de tempo, cliques |
| Invasão | 3 | Vencer a Invasão Final, vencê-la sem perder dragões, tirar metade da vida do Ancestral |

Conquistas de destaque:

- **Golpe no sono** (20 gemas): derrotar o Ancestral adormecido na Arena, depois da liga Campeões.
- **Ilha intocável** (15): vencer a Invasão Final sem perder nenhum dragão.
- **Guardião da ilha** (10): vencer a Invasão Final.
- **Enciclopédia viva** (12): descobrir 40 das 50 espécies.
- **Relâmpago** (5): chegar ao nível 5 em até 5 minutos.
- **Sorte de principiante** (8): obter um Lendário em até 10 minutos.
- **Arco-íris elemental** (8): ter dragões dos 9 elementos ao mesmo tempo.

A tabela completa, com requisito e gemas de cada uma, está em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#conquistas-65-total-de-301-gemas).

## Como adicionar uma estatística ou conquista

Veja [08-arquitetura.md](08-arquitetura.md#como-estender).
