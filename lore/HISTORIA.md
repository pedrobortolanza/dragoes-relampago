# Dragões Relâmpago: a história

Este é o texto canônico da lore. As falas das cutscenes (`cutscene.js`) saem daqui. Se mudar algo, mude nos dois lugares.

## Em uma frase

Você é a nova guarda da **Ilha Relâmpago** e tem poucos minutos para criar dragões fortes o bastante antes que **Vorágon, o Dragão Ancestral**, rompa o selo que o prende sob a ilha.

## O Primeiro Relâmpago

No começo só havia mar e tempestade. Um dia caiu um relâmpago tão grande que o oceano ferveu e a rocha subiu do fundo: assim nasceu a Ilha Relâmpago.

Do clarão saltaram **nove faíscas**, uma para cada elemento: Fogo, Água, Planta, Terra, Elétrico, Gelo, Metal, Trevas e Luz. Cada faísca esfriou dentro de uma casca e virou um ovo. Foram os primeiros dragões. Todos os dragões que existem hoje descendem deles, e é por isso que dois dragões de elementos diferentes podem gerar um terceiro: as faíscas sempre quiseram se reencontrar.

## Vorágon, a sombra do clarão

Todo clarão deixa uma sombra. A parte do Primeiro Relâmpago que não virou luz virou **Vorágon**, "Aquele que Engole Tempestades".

Vorágon não tem elemento próprio. Ele cresceu comendo tempestades e quer as nove faíscas para si, porque só com elas seria completo. Por isso ele ataca com qualquer elemento e nenhum elemento é especialmente forte contra ele. *(Isso explica a mecânica da Invasão Final: o Ancestral usa um elemento aleatório por turno e é neutro na defesa.)*

## O Selo dos Nove

Os primeiros humanos da ilha chocaram os nove ovos e se tornaram os **Guardiões**. Quando Vorágon atacou, eles juntaram os nove elementos num só golpe e o arrastaram para debaixo da ilha. O círculo de runas que o prende chama-se **Selo dos Nove**.

O selo não é eterno. Ele bebe a força dos dragões que vivem na superfície, e a cada mil anos essa força se esgota. Quando o selo racha, Vorágon acorda, e só os dragões da ilha podem mandá-lo de volta para o sono.

## Os Guardiões e a Arena dos Ventos

Os Guardiões criaram as **Provas dos Ventos**: oito ligas de combate (Bronze, Prata, Ouro, Platina, Diamante, Mestre, Grão-Mestre e Campeões) para treinar dragões para o dia do despertar. A Arena dos Ventos ainda está de pé, e cada liga leva o nome de uma das antigas fileiras de Guardiões.

Quem vence a liga dos Campeões ganha o direito do ritual mais antigo: entrar no **sonho do Ancestral**. Lá dentro, ainda adormecido, ele pode ser ferido. Um golpe no sonho deixa uma cicatriz que continua aberta quando ele acorda. *(Mecânica: vencer o Ancestral adormecido tira 30% da vida dele na Invasão Final.)*

## A ilha hoje

Os Guardiões sumiram há gerações. Os habitats viraram ruínas, as fazendas viraram mato e a Arena ficou vazia. Só restou **Mestra Iara**, a última Guardiã, velha demais para lutar.

Os tremores começaram. Iara sabe que o selo está rachando e chama você. Ela entrega o último ovo de Fogo da ilha e ensina o que sabe:

- **Ouro-de-escama.** Dragões felizes soltam pó de ouro das escamas. Colete nos habitats e reconstrua a ilha.
- **Comida.** Fazendas alimentam os dragões, e dragões alimentados ficam mais fortes.
- **Montanha do Encontro.** Dois dragões juntos podem gerar uma faísca nova, um ovo de outra espécie. Algumas combinações chamam as faíscas lendárias (Eclipse, Aurora, Titã de Aço, Tempestade, Vulcano).
- **Gemas.** São faíscas solidificadas, raras e preciosas.

## Personagens

| Personagem | Quem é |
|---|---|
| **Você** | A nova guarda da ilha. Chegou com nada além de um ovo de Fogo. |
| **Mestra Iara** | A última Guardiã. Sábia, direta, um pouco cansada. Fala curto, porque o tempo é curto. |
| **Vorágon, o Dragão Ancestral** | A sombra do Primeiro Relâmpago. Fala em frases solenes e arrogantes. Acha que os dragões da ilha são dele por direito. |
| **Bartô, o Mercador Viajante** | Aparece de barco de vez em quando para trocar gemas por ouro. Diz que já viu três despertares e que "esse vai ser o pior". |

## Os finais

| Final | Quando | O que acontece |
|---|---|---|
| **A ilha resistiu** | Vencer a Invasão Final | Vorágon cai de volta na fenda, o Selo dos Nove se fecha brilhando nas nove cores e ele dorme por mais mil anos. Iara entrega a você o título de Guardiã ou Guardião da ilha. |
| **O Ancestral tomou a ilha** | Perder a Invasão Final | Vorágon pousa sobre a ilha e as nuvens ficam vermelhas. Iara diz que a cicatriz que você deixou nele vai lembrar a próxima guarda de onde mirar. |
| **Ilha sem defesa** | Encerrar antes do despertar | Vorágon encontra os habitats vazios. Ninguém ficou para lutar. |
| **O selo quebrado** (Infinito) | A cada invasão vencida | O selo não se fecha mais por inteiro. Vorágon afunda, mas promete voltar, e volta a cada quinze minutos, mais forte, porque come a tempestade que o derrubou. A partida acaba na primeira invasão perdida. |

## Cutscenes

| Cutscene | Quando passa | Duração aproximada |
|---|---|---|
| `abertura` | Ao começar a partida (depois de escolher o modo) | 7 cenas, cerca de 45 s, pode pular |
| `sonho` | Primeira vez que o jogador entra no Ancestral adormecido | 2 cenas |
| `despertar` | Quando o relógio zera e o Ancestral desperta (Invasão Final) | 4 cenas, cerca de 25 s |
| `despertarOnda` | Invasões 2, 3, 4... no Infinito | 3 cenas |
| `ondaVencida` | Invasão vencida no Infinito (a ilha volta a funcionar) | 2 cenas |
| `vitoria` | Antes da tela de placar, depois de vencer | 3 cenas |
| `derrota` | Antes da tela de placar, depois de perder | 2 cenas |
| `semDefesa` | Antes da tela de placar, quando encerrou antes do despertar | 1 cena |

Todas podem ser puladas com o botão **Pular**, com `Esc`, ou avançadas cena a cena com clique, `Espaço` ou `Enter`.
