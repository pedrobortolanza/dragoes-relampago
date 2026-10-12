# Batalhas

As batalhas acontecem no painel ⚔️ **Arena** (clique no coliseu da ilha ou tecla 5). São por turnos e rápidas. A Arena serve para ganhar recursos e treinar o time para o momento que encerra a partida: a **Invasão Final** contra o Dragão Ancestral, quando o relógio zera.

## Tipos de batalha

| Tipo | Quando aparece | Oponentes | Recompensa |
|---|---|---|---|
| **Liga** | Sempre, até vencer a liga Campeões | 1 a 3 dragões, conforme liga e luta | Ouro, gemas e XP crescentes; avança a escada |
| **Dragão Selvagem** | Durante o evento de mesmo nome (45 s) | 1 dragão um nível acima, com 160% de vida | x3 ouro e gemas, x2 XP; não avança a liga |
| **Ancestral adormecido** | Depois de vencer a liga Campeões | O Ancestral com 80% da vida e do ataque da Invasão Final | 8.000 ouro × peso do modo (4.000 na Rápida, 12.000 na Longa), 30 gemas, 400 XP; 2.000 pontos (uma vez); deixa o Ancestral ferido para a próxima invasão; pode ser repetido |
| **Invasão Final** | Quando o relógio zera (no Infinito, a cada 15 min) | O Dragão Ancestral, com força conforme o modo | Vale a maior fatia da pontuação; no Infinito, cada invasão repelida também dá ouro, gemas e XP |

## A escada de ligas

Bronze → Prata → Ouro → Platina → Diamante → Mestre → Grão-Mestre → Campeões → ☠️ Ancestral adormecido

- Cada liga tem **3 lutas**. Vencer a 3ª promove para a próxima liga.
- Perder não rebaixa nem tira nada: só zera a sequência de vitórias e dá 5 XP de consolo.
- Oponentes por luta: `mínimo(3, ⌈(liga + luta) ÷ 2⌉)`, com a luta contando de 0.
- Nível dos oponentes: `1 + 2 × (liga − 1) + luta`, limitado entre 1 e 15.
- A raridade de cada oponente é sorteada de uma lista por liga (só Comuns no Bronze, Lendários possíveis a partir do Grão-Mestre).
- Oponentes de liga têm 95% da vida e do ataque de um dragão normal da mesma espécie e nível.
- Ouro por vitória: `90 × liga^1,9 × (1 + 0,5 × luta)`; gemas = número da liga; XP = `15 × liga + 5 × luta`.

Valores liga a liga em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#arena-ligas).

## Seu time

- Até **3 dragões**, escolhidos na Arena (lista ordenada por poder ⚡). Escolher um 4º tira o mais antigo da seleção; não dá para ficar com zero.
- Se nenhum dragão escolhido existir mais (por exemplo, foi vendido), o jogo monta o time com os 3 mais fortes.
- Vida e ataque vêm do nível e raridade do dragão. **A vida volta cheia a cada batalha**; não há cura nem dano persistente.
- Lutam um de cada vez, na ordem do time. Quando um cai, entra o próximo vivo.

## O turno

1. Você escolhe um golpe; seu dragão ataca primeiro.
2. Se o oponente cair, entra o próximo dele e o turno acaba (ele não contra-ataca).
3. Se não cair, ele responde: usa o Especial com 70% de chance quando está disponível; senão, o Ataque.
4. Se o seu cair, entra o próximo do seu time.
5. Vence quem derrubar todos os dragões do outro lado.

## Golpes

| Golpe | Elemento | Potência | Recarga |
|---|---|---|---|
| **Ataque** | 1º elemento do dragão | x1 | nenhuma |
| **Especial** | 2º elemento (ou o único, se for puro) | x1,7 (x2 para Lendários e o Ancestral) | 3 turnos |

A recarga só diminui quando o dragão usa o Ataque comum: depois de um Especial são necessários 3 Ataques para liberá-lo de novo. O botão mostra os turnos restantes e se o golpe está **forte** ou **fraco** contra o oponente atual.

## Fórmula de dano

```
dano = ataque × potência do golpe × multiplicador elemental × crítico × variação
```

- **Multiplicador elemental:** x1,5 para cada elemento do defensor contra o qual o golpe é forte; x0,7 para cada elemento do defensor que é forte contra o golpe. Contra dois elementos, os fatores se multiplicam (x2,25, x1,05, x0,49...). Matriz completa em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#matriz-de-dano-elemental-atacante-na-linha-defensor-na-coluna).
- **Crítico:** 12% de chance, x1,5.
- **Variação:** aleatória entre 0,9 e 1,1.
- Dano mínimo de 1.

Exemplo: um Pirofolius (Raro, nível 10, ataque 61) usa o Especial 🌿 (x1,7) num Dragão de Água: 61 × 1,7 × 1,5 ≈ **156** de dano (sem crítico).

## O Dragão Ancestral

- Aparece com as cores de 🌑 Trevas e 🔥 Fogo, desenhado maior que os outros dragões, mas **não tem elemento**: todo golpe contra ele é neutro (x1). Vence quem tiver vida e ataque brutos.
- A cada golpe ele usa um **elemento aleatório** dos 9, então pode acertar fraquezas do seu time.
- O especial "Sopro Ancestral" tem potência x2.
- Seus números dependem do modo; veja [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#modos-e-o-dragão-ancestral).

### Ancestral adormecido (opcional)

Depois de vencer a liga Campeões, a Arena oferece **☠️ Atacar o Ancestral adormecido**: ele com 80% da vida e do ataque da próxima invasão. Vencer deixa o Ancestral **ferido**: a próxima invasão começa com 30% menos vida. O efeito não acumula (lutar de novo antes da invasão não fere mais) e é consumido quando a invasão começa; no Infinito, dá para feri-lo de novo antes de cada onda. A primeira vitória dá a conquista **Golpe no sono** (20 gemas) e 2.000 pontos; toda vitória rende ouro, gemas e XP.

## A Invasão Final

1. O relógio é a contagem para o despertar; avisos aparecem a 5 min, 2 min, 1 min e 30 s.
2. Ao zerar, a ilha congela, eventos e bônus somem, e uma batalha que estivesse em andamento é cancelada (sem contar nas estatísticas).
3. Uma tela anuncia o despertar e o jogo abre a Arena, que agora só mostra a escolha do time (até 3 dragões) e a vida e o ataque do Ancestral.
4. Clique em **🛡️ Defender a ilha**. A batalha segue as regras normais, com batalha automática disponível. Desistir conta como derrota.
5. Há **uma única tentativa** por invasão. No fim, o resultado mostra a % de vida que você tirou dele.

**Força do Ancestral por modo:**

| Modo | Invade | Vida / ataque |
|---|---|---|
| Rápida | aos 10 min | 1.200 / 48 |
| Padrão | aos 20 min | 2.400 / 70 |
| Longa | aos 30 min | 3.600 / 88 |
| Infinito | a cada 15 min | 1.800 / 60 na 1ª invasão, +35% a cada invasão repelida |

**Rápida, Padrão e Longa:** depois da batalha, o botão **Ver placar final** encerra a partida. Pontos (multiplicados pelo peso do modo): vitória 12.000, mais 3.000 se nenhum dragão seu cair; derrota, 6.000 × fração da vida tirada.

**Infinito:** vencer uma invasão dá `3.000 × número da onda` de ouro, 20 gemas e 300 XP, e a ilha volta a funcionar normalmente até a próxima invasão, 15 minutos depois e 35% mais forte. A primeira invasão perdida encerra a partida. Pontos: 12.000 por invasão repelida, +3.000 por invasão repelida sem perder dragões, e 6.000 × fração de dano na invasão perdida. Valores por onda em [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md#modos-e-o-dragão-ancestral).

Conquistas ligadas: **Guardião da ilha** (vencer uma invasão), **Ilha intocável** (vencer sem perder dragões) e **Cicatriz no Ancestral** (tirar metade da vida dele).

Encerrar a partida antes do despertar deixa a ilha sem defesa: a Invasão Final vale zero.

## Batalha automática

O botão **▶ Batalha automática** faz o jogo escolher um golpe a cada 1,1 segundo (tempo para ver as animações de ataque): usa o Especial sempre que estiver disponível e render pelo menos o mesmo que o Ataque (considerando a vantagem elemental). Só funciona com o painel da Arena aberto; ao fechá-lo a batalha espera por você.

## Visual da Arena

Cada liga tem o seu cenário de fundo, sempre com arquibancada, torcida e bandeiras:

| Liga | Cenário |
|---|---|
| Bronze | deserto |
| Prata | neve |
| Ouro | campo dourado |
| Platina | verde-água |
| Diamante | cristais |
| Mestre | noite roxa |
| Grão-Mestre | vulcão |
| Campeões | aurora |
| Ancestral adormecido e Invasão Final | céu de tempestade com raios |

- **Fora da luta:** uma faixa mostra a liga atual, o time aparece em pódios (as vagas vazias também) e um botão grande **Lutar!** começa a próxima batalha. A escada de ligas é desenhada como escudos, cada um na cor da sua liga.
- **Na luta:** cada lado tem uma placa com o nome e a barra de vida, com o número dentro dela. Os dragões ficam em pódios, com um selo **VS** no meio, e os controles e o registro de golpes ficam em caixas escuras sobre o cenário.

## Animações de combate

- Os dois dragões aparecem grandes, frente a frente em pódios (o oponente espelhado); o Dragão Ancestral é desenhado ainda maior.
- A cada golpe, o atacante dá uma **investida** curta, um **projétil com o emoji do elemento** do golpe voa em arco até o alvo, e o alvo **treme e pisca** com o impacto.
- O dano sobe sobre o alvo como número: verde quando é super eficaz, dourado com "CRÍTICO" em acertos críticos, vermelho nos demais.
- Golpes do mesmo turno (o seu e a resposta do oponente) são mostrados em sequência, com cerca de meio segundo entre eles.

## Desistir

"Desistir" encerra a batalha como derrota (sem perda além de zerar a sequência).

## O que é registrado

Cada batalha alimenta as estatísticas: batalhas, vitórias, derrotas, taxa de vitória, sequência atual e melhor, dano causado e recebido, maior golpe, críticos, golpes super eficazes, nocautes feitos e sofridos, vitórias perfeitas, selvagens derrotados, vitórias sobre o Ancestral adormecido e o resultado da Invasão Final (vitórias, vitórias sem perdas e maior % de dano). Uma **vitória perfeita** é vencer sem perder nenhum dragão, contando só a partir da liga Platina (ou contra o selvagem e o Ancestral).
