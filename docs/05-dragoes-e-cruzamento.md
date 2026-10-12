# Dragões e cruzamento

## Elementos

São 9 elementos. Os 6 primeiros são **básicos**; Metal, Trevas e Luz são **especiais** (puros já nascem Raros e qualquer híbrido com eles é Épico).

| Elemento | Tipo | Libera na loja no nível |
|---|---|---|
| 🔥 Fogo | básico | 1 |
| 💧 Água | básico | 1 |
| 🌿 Planta | básico | 1 |
| 🪨 Terra | básico | 2 |
| ⚡ Elétrico | básico | 3 |
| ❄️ Gelo | básico | 4 |
| ⚙️ Metal | especial | 6 |
| 🌑 Trevas | especial | 8 |
| ✨ Luz | especial | 8 |

Vantagens elementais e preços: [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#elementos).

## Raridades

| Raridade | Como acontece | Quantas espécies |
|---|---|---|
| Comum | Dragão puro de elemento básico | 6 |
| Raro | Dragão puro especial, ou híbrido de dois básicos | 18 |
| Épico | Híbrido com pelo menos um elemento especial | 21 |
| Lendário | Só por receitas de cruzamento (ou sorte no Ovo misterioso) | 5 |

A raridade define os atributos base (ouro/s, vida, ataque), o tempo de chocagem (8, 15, 25 e 40 segundos), o custo de cruzar e o valor de venda.

## As 50 espécies

- **9 puras**, uma por elemento: "Dragão de Fogo", "Dragão das Trevas" etc.
- **36 híbridas**, uma para cada par de elementos diferentes. O nome junta o **prefixo** do elemento que vem primeiro na lista acima e o **sufixo** do outro (Água + Terra = Hidropetrus, nunca Geomaris):

| Elemento | Prefixo | Sufixo |
|---|---|---|
| Fogo | Piro | flar |
| Água | Hidro | maris |
| Planta | Fito | folius |
| Terra | Geo | petrus |
| Elétrico | Eletro | voltar |
| Gelo | Crio | glacius |
| Metal | Ferro | ferrum |
| Trevas | Umbro | noctis |
| Luz | Lumo | lumen |

  Exemplos: Fogo + Água = **Piromaris**; Terra + Gelo = **Geoglacius**; Trevas + Luz = **Umbrolumen**.
- **5 lendárias**, com nome próprio e receita:

| Lendário | Receita (elementos somados dos dois pais) | Chance |
|---|---|---|
| Eclipse | ✨ Luz + 🌑 Trevas | 25% |
| Aurora | ❄️ Gelo + ✨ Luz | 20% |
| Titã de Aço | 🪨 Terra + ⚙️ Metal | 18% |
| Tempestade | 💧 Água + ⚡ Elétrico | 15% |
| Vulcano | 🔥 Fogo + 🪨 Terra | 12% |

A lista completa, com como obter cada uma, está em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#espécies-50).

## Atributos e evolução

Cada dragão tem nível de 1 a 15. Alimentar sobe 1 nível por vez, gastando comida.

| Atributo | Fórmula |
|---|---|
| Ouro por segundo | base × (1 + 0,4 × (nível − 1)) |
| Vida | base × (1 + 0,2 × (nível − 1)) |
| Ataque | base × (1 + 0,16 × (nível − 1)) |
| Poder (usado para ordenar o time) | vida ÷ 4 + ataque × 2 |

Bases por raridade (nível 1):

| | Comum | Raro | Épico | Lendário |
|---|---|---|---|---|
| Ouro/s | 1 | 2,5 | 6 | 15 |
| Vida | 100 | 125 | 160 | 230 |
| Ataque | 20 | 25 | 33 | 46 |

## Cruzamento

**Requisitos**

- Dois dragões diferentes, ambos com **nível 3 ou mais**.
- Um espaço livre na chocadeira (ovos de bônus do evento Ovo Perdido não contam).
- Ouro: `30 × (valor da raridade do pai A + valor da raridade do pai B)`. Dois Comuns custam 60; dois Lendários, 300.

Os pais **não** são consumidos e podem cruzar de novo na hora.

**Como o filhote é sorteado**

1. **Lendários primeiro.** Junta-se o conjunto de elementos dos dois pais. Para cada receita lendária coberta por esse conjunto, na ordem da tabela acima (Eclipse, Aurora, Titã, Tempestade, Vulcano), há a chance indicada, aplicada **sobre a probabilidade que sobrou** das receitas anteriores.
2. **Depois, a combinação de elementos.** A probabilidade restante é dividida igualmente entre todas as combinações "um elemento do pai A + um elemento do pai B". Se os dois elementos forem iguais, nasce o dragão puro; se forem diferentes, o híbrido.

**Exemplos**

| Pai A | Pai B | Resultado |
|---|---|---|
| 🔥 Fogo | 💧 Água | 100% Piromaris |
| 🔥 Fogo | 🔥 Fogo | 100% Dragão de Fogo |
| 🔥💧 Piromaris | 🌿 Planta | 50% Pirofolius, 50% Hidrofolius |
| 🔥💧 Piromaris | 🔥🌿 Pirofolius | 25% Dragão de Fogo, 25% Pirofolius, 25% Piromaris, 25% Hidrofolius |
| 🔥🪨 Piropetrus | 💧 Água | 12% Vulcano, 44% Piromaris, 44% Hidropetrus |
| 🌑✨ Umbrolumen | ❄️⚙️ Crioferrum | 25% Eclipse, 15% Aurora (20% dos 75% que sobraram), 15% cada para Crionoctis, Ferronoctis, Criolumen e Ferrolumen |

O painel **Cruzar** (Montanha do Amor) mostra a tabela exata de chances para o par escolhido antes de gastar ouro. Espécies ainda não descobertas aparecem como "???".

## Chocadeira

- Começa com 1 espaço; dá para comprar até 4 (300, 1.500 e 6.000 de ouro).
- Cada ovo choca em segundos de acordo com a raridade: Comum 8, Raro 15, Épico 25, Lendário 40.
- Ovo pronto balança; é preciso clicar em **Chocar**, e é preciso ter vaga nos habitats.
- **Acelerar:** 1 gema a cada 8 segundos que faltam.
- O ovo mostra a raridade, mas o nome só aparece se a espécie já estiver no Dragonário.
- Chocar uma espécie nova dá +15 XP extra e a registra no Dragonário.
- Quando nasce uma espécie nova ou um Épico/Lendário, uma tela de revelação mostra o dragão surgindo; os demais nascimentos aparecem só num aviso.
- No mapa, a construção da Chocadeira mostra os ovos na frente, coloridos pela raridade, e um balão 🐣 quando algum está pronto.

## Outras formas de ganhar dragões

| Fonte | O que vem |
|---|---|
| Loja | Dragões puros, nascem nível 1 direto no habitat |
| Ovo misterioso (20 gemas) | Épico garantido, com cerca de 10% de chance de Lendário |
| Evento Ovo Perdido | Raro ou Épico, sem ocupar espaço da chocadeira |

## Dragonário

Registro das espécies descobertas na partida (por compra, chocagem ou ovo). Mostra as 50 silhuetas; as desconhecidas ficam escuras e com "???". Descobrir espécies vale 150 pontos cada e destrava as conquistas Colecionador (10), Naturalista (25) e Enciclopédia viva (40).

## Aparência e animações

Cada dragão é **desenhado em vetor (SVG)** de corpo inteiro, de perfil: cabeça com chifres e olho, corpo com barriga e escamas, duas asas, cauda e patas com garras. O desenho é montado a partir dos elementos e da raridade, então cada uma das 50 espécies tem uma aparência própria.

**Cores:** o corpo usa a cor do primeiro elemento; asas e barriga usam tons do segundo, sempre em degradê. Um dragão puro fica todo em tons de uma cor.

**Acabamento:** placas na barriga, escamas, brilho no dorso, asas com ossos e garra, ponta de lança na cauda (quando o elemento não põe outro acessório ali), cabeça com dentes, narina e sobrancelha, e olho com íris na cor do elemento e pupila em fenda.

**Raridade muda o corpo:**

| Raridade | O que muda |
|---|---|
| Comum | Forma básica, base cinza |
| Raro | Espinhos nas costas e na cauda, base azul |
| Épico | Asas maiores e crista atrás da cabeça, base roxa |
| Lendário | Crista, chifres e espinhos dourados, aura pulsante, coroa dourada com gema sobre a cabeça, base dourada |

**Cada elemento acrescenta detalhes:**

| Elemento | Detalhes |
|---|---|
| 🔥 Fogo | Chama tremulando na ponta da cauda, fumacinha saindo do focinho |
| 💧 Água | Nadadeiras na cauda, nas costas e na cabeça, gota pingando da boca |
| 🌿 Planta | Folhas nas costas e na ponta da cauda |
| 🪨 Terra | Pedras nas costas |
| ⚡ Elétrico | Raio piscando na cauda e faísca perto do peito |
| ❄️ Gelo | Cristais de gelo nas costas e nos chifres |
| ⚙️ Metal | Placa de armadura com rebites no corpo e capacete |
| 🌑 Trevas | Ponta de cauda afiada, fumaça roxa ao redor, pupila roxa |
| ✨ Luz | Estrelas cintilando ao redor, pupila dourada |

**Animações contínuas:** todo dragão flutua com a sombra acompanhando, bate as asas, balança a cauda, acena a cabeça e pisca. Os acessórios também se mexem (chamas tremulam, raios piscam, estrelas cintilam, fumaça sobe, gotas caem). Cada dragão começa as animações num ponto diferente do ciclo, então um habitat cheio não se mexe em sincronia.

**Onde aparecem:** passeando nos habitats da ilha (até 3 por habitat) e voando em volta dela (os 2 mais raros, ou 1 se você tiver de 3 a 5 dragões); pequenos nas listas e no Dragonário; médios nas cartas e na loja; grandes no cruzamento e na Arena (o oponente aparece espelhado, de frente para o seu, e o Dragão Ancestral é ainda maior). Espécies não descobertas aparecem como silhueta escura.

**Outras animações:** ovos prontos balançam, fazendas prontas flutuam, números de ouro sobem ao coletar, e na Arena cada golpe tem investida, projétil do elemento e impacto (veja [06-batalhas.md](06-batalhas.md#animações-de-combate)).

Com "reduzir movimento" ligado no sistema, todas as animações são desligadas.
