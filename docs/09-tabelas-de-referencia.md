# Tabelas de referência

> Arquivo **gerado automaticamente** por `docs/ferramentas/gerar-tabelas.js` a partir do `index.html`. Não edite à mão: rode o script de novo quando o jogo mudar.

## Modos e o Dragão Ancestral

| Modo | O Ancestral invade | Ancestral na invasão (vida / ataque) | Se ferido na Arena (vida) | Ancestral adormecido na Arena (vida / ataque) |
|---|---|---|---|---|
| Rápida | aos 10 min | 1.200 / 48 | 840 | 960 / 38 |
| Padrão | aos 20 min | 2.400 / 70 | 1.680 | 1.920 / 56 |
| Longa | aos 30 min | 3.600 / 88 | 2.520 | 2.880 / 70 |
| Infinito | a cada 15 min | 1.800 / 60 na 1ª invasão | 1.260 | 1.440 / 48 |

No modo Infinito o Ancestral fica 35% mais forte (vida e ataque) a cada invasão repelida:

| Invasão | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Vida | 1.800 | 2.430 | 3.281 | 4.429 | 5.979 | 8.071 |
| Ataque | 60 | 81 | 109 | 148 | 199 | 269 |

## Elementos

| Elemento | Nível p/ comprar | Preço na loja | Raridade do puro | Forte contra (x1,5) | Fraco contra (x0,7) |
|---|---|---|---|---|---|
| 🔥 Fogo | 1 | 🪙 100 | Comum | 🌿 Planta, ❄️ Gelo, ⚙️ Metal | 💧 Água, 🪨 Terra |
| 💧 Água | 1 | 🪙 150 | Comum | 🔥 Fogo, 🪨 Terra | 🌿 Planta, ⚡ Elétrico |
| 🌿 Planta | 1 | 🪙 150 | Comum | 💧 Água, 🪨 Terra | 🔥 Fogo, ❄️ Gelo |
| 🪨 Terra | 2 | 🪙 250 | Comum | ⚡ Elétrico, 🔥 Fogo, ⚙️ Metal | 💧 Água, 🌿 Planta, ❄️ Gelo |
| ⚡ Elétrico | 3 | 🪙 600 | Comum | 💧 Água, ⚙️ Metal | 🪨 Terra, 🌑 Trevas |
| ❄️ Gelo | 4 | 🪙 900 | Comum | 🌿 Planta, 🪨 Terra | 🔥 Fogo, ⚙️ Metal, ✨ Luz |
| ⚙️ Metal | 6 | 🪙 2.500 | Raro | ❄️ Gelo, ✨ Luz | 🔥 Fogo, 🪨 Terra, ⚡ Elétrico |
| 🌑 Trevas | 8 | 🪙 6.000 | Raro | ✨ Luz, ⚡ Elétrico | ✨ Luz |
| ✨ Luz | 8 | 🪙 6.000 | Raro | 🌑 Trevas, ❄️ Gelo | ⚙️ Metal, 🌑 Trevas |

A coluna "fraco contra" lista os atacantes que causam x1,5 nele. Quando ele mesmo ataca um elemento que é forte contra o dele, o dano cai para x0,7.

## Matriz de dano elemental (atacante na linha, defensor na coluna)

| Atq \ Def | 🔥 | 💧 | 🌿 | 🪨 | ⚡ | ❄️ | ⚙️ | 🌑 | ✨ |
|---|---|---|---|---|---|---|---|---|---|
| 🔥 Fogo | · | 0,7 | 1,5 | 0,7 | · | 1,5 | 1,5 | · | · |
| 💧 Água | 1,5 | · | 0,7 | 1,5 | 0,7 | · | · | · | · |
| 🌿 Planta | 0,7 | 1,5 | · | 1,5 | · | 0,7 | · | · | · |
| 🪨 Terra | 1,5 | 0,7 | 0,7 | · | 1,5 | 0,7 | 1,5 | · | · |
| ⚡ Elétrico | · | 1,5 | · | 0,7 | · | · | 1,5 | 0,7 | · |
| ❄️ Gelo | 0,7 | · | 1,5 | 1,5 | · | · | 0,7 | · | 0,7 |
| ⚙️ Metal | 0,7 | · | · | 0,7 | 0,7 | 1,5 | · | · | 1,5 |
| 🌑 Trevas | · | · | · | · | 1,5 | · | · | · | 1,5 |
| ✨ Luz | · | · | · | · | · | 1,5 | 0,7 | 1,5 | · |

Contra dragões de dois elementos os multiplicadores se **multiplicam** (ex.: 🔥 contra 🌿❄️ = 1,5 × 1,5 = 2,25).

## Raridades

| Raridade | Valor (rv) | Ouro/s no Nv 1 | Vida no Nv 1 | Ataque no Nv 1 | Chocagem (s) | Espécies |
|---|---|---|---|---|---|---|
| Comum | 1 | 1 | 100 | 20 | 8 | 6 |
| Raro | 2 | 2,5 | 125 | 25 | 15 | 18 |
| Épico | 3 | 6 | 160 | 33 | 25 | 21 |
| Lendário | 5 | 15 | 230 | 46 | 40 | 5 |

## Atributos por nível de dragão

Fórmulas: ouro/s = base × (1 + 0,4 × (nv − 1)); vida = base × (1 + 0,2 × (nv − 1)); ataque = base × (1 + 0,16 × (nv − 1)); poder = vida/4 + ataque × 2. Nível máximo: 15.

**Comum**

| Nível | 1 | 3 | 5 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|---|
| Ouro/s | 1 | 1,8 | 2,6 | 3,8 | 4,6 | 5,4 | 6,6 |
| Vida | 100 | 140 | 180 | 240 | 280 | 320 | 380 |
| Ataque | 20 | 26 | 33 | 42 | 49 | 55 | 65 |
| Poder | 65 | 87 | 111 | 144 | 168 | 190 | 225 |
| Valor de venda | 25 | 75 | 125 | 200 | 250 | 300 | 375 |

**Raro**

| Nível | 1 | 3 | 5 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|---|
| Ouro/s | 2,5 | 4,5 | 6,5 | 9,5 | 11,5 | 13,5 | 16,5 |
| Vida | 125 | 175 | 225 | 300 | 350 | 400 | 475 |
| Ataque | 25 | 33 | 41 | 53 | 61 | 69 | 81 |
| Poder | 81 | 110 | 138 | 181 | 210 | 238 | 281 |
| Valor de venda | 50 | 150 | 250 | 400 | 500 | 600 | 750 |

**Épico**

| Nível | 1 | 3 | 5 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|---|
| Ouro/s | 6 | 10,8 | 15,6 | 22,8 | 27,6 | 32,4 | 39,6 |
| Vida | 160 | 224 | 288 | 384 | 448 | 512 | 608 |
| Ataque | 33 | 44 | 54 | 70 | 81 | 91 | 107 |
| Poder | 106 | 144 | 180 | 236 | 274 | 310 | 366 |
| Valor de venda | 75 | 225 | 375 | 600 | 750 | 900 | 1125 |

**Lendário**

| Nível | 1 | 3 | 5 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|---|
| Ouro/s | 15 | 27 | 39 | 57 | 69 | 81 | 99 |
| Vida | 230 | 322 | 414 | 552 | 644 | 736 | 874 |
| Ataque | 46 | 61 | 75 | 98 | 112 | 127 | 149 |
| Poder | 150 | 203 | 254 | 334 | 385 | 438 | 517 |
| Valor de venda | 125 | 375 | 625 | 1000 | 1250 | 1500 | 1875 |

## Custo para alimentar (comida)

| Do nível | 1→2 | 2→3 | 3→4 | 4→5 | 5→6 | 6→7 | 7→8 | 8→9 | 9→10 | 10→11 | 11→12 | 12→13 | 13→14 | 14→15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🍖 | 10 | 15 | 23 | 34 | 51 | 76 | 114 | 171 | 256 | 384 | 577 | 865 | 1297 | 1946 |

Total de comida do nível 1 ao 15: **5.819**.

## Plantações

| Plantação | Nível | Custo | Tempo | Comida | Comida por segundo | Lucro de comida por ouro |
|---|---|---|---|---|---|---|
| 🌾 Trigo | 1 | 🪙 10 | 5s | 12 | 2,4 | 1,2 |
| 🌽 Milho | 2 | 🪙 40 | 20s | 60 | 3 | 1,5 |
| 🎃 Abóbora | 4 | 🪙 120 | 45s | 180 | 4 | 1,5 |
| 🍇 Fruta-dragão | 7 | 🪙 350 | 90s | 520 | 5,78 | 1,49 |

## Construções

A partida começa com 1 habitat (3 vagas de dragão) e 2 fazendas. A ilha tem lotes para no máximo 10 habitats e 12 fazendas. Custo de cada nova unidade:

| Habitat | Custo | Fazenda | Custo |
|---|---|---|---|
| 2º habitat | 🪙 150 | 3ª fazenda | 🪙 100 |
| 3º habitat | 🪙 315 | 4ª fazenda | 🪙 180 |
| 4º habitat | 🪙 662 | 5ª fazenda | 🪙 324 |
| 5º habitat | 🪙 1.389 | 6ª fazenda | 🪙 583 |
| 6º habitat | 🪙 2.917 | 7ª fazenda | 🪙 1.050 |
| 7º habitat | 🪙 6.126 | 8ª fazenda | 🪙 1.890 |
| 8º habitat | 🪙 12.865 | 9ª fazenda | 🪙 3.401 |
| 9º habitat | 🪙 27.016 | 10ª fazenda | 🪙 6.122 |
| 10º habitat | 🪙 56.734 | 11ª fazenda | 🪙 11.020 |
|  |  | 12ª fazenda | 🪙 19.836 |

| Espaço da chocadeira | 2º | 3º | 4º |
|---|---|---|---|
| Custo | 🪙 300 | 🪙 1.500 | 🪙 6.000 |

## Nível do jogador

| Nível | XP para o próximo | XP acumulado | Gemas ao subir | Desbloqueia |
|---|---|---|---|---|
| 1→2 | 40 | 40 | 2 | 🪨 Terra, 🌽 Milho |
| 2→3 | 121 | 161 | 2 | ⚡ Elétrico, Colher e replantar tudo |
| 3→4 | 232 | 393 | 2 | ❄️ Gelo, 🎃 Abóbora |
| 4→5 | 368 | 761 | 3 | Coletar tudo (tecla C) |
| 5→6 | 525 | 1.286 | 3 | ⚙️ Metal |
| 6→7 | 703 | 1.989 | 3 | 🍇 Fruta-dragão |
| 7→8 | 900 | 2.889 | 3 | 🌑 Trevas, ✨ Luz |
| 8→9 | 1.114 | 4.003 | 3 |  |
| 9→10 | 1.345 | 5.348 | 4 |  |
| 10→11 | 1.592 | 6.940 | 4 |  |
| 11→12 | 1.855 | 8.795 | 4 |  |
| 12→13 | 2.132 | 10.927 | 4 |  |
| 13→14 | 2.423 | 13.350 | 4 |  |
| 14→15 | 2.728 | 16.078 | 5 |  |
| 15→16 | 3.047 | 19.125 | 5 |  |
| 16→17 | 3.378 | 22.503 | 5 |  |
| 17→18 | 3.722 | 26.225 | 5 |  |
| 18→19 | 4.078 | 30.303 | 5 |  |
| 19→20 | 4.447 | 34.750 | 6 |  |
| 20→21 | 4.827 | 39.577 | 6 |  |
| 21→22 | 5.219 | 44.796 | 6 |  |
| 22→23 | 5.623 | 50.419 | 6 |  |
| 23→24 | 6.037 | 56.456 | 6 |  |
| 24→25 | 6.462 | 62.918 | 7 |  |
| 25→26 | 6.899 | 69.817 | 7 |  |
| 26→27 | 7.345 | 77.162 | 7 |  |
| 27→28 | 7.803 | 84.965 | 7 |  |
| 28→29 | 8.270 | 93.235 | 7 |  |
| 29→30 | 8.748 | 101.983 | 8 |  |

## Arena: ligas

| Liga | Raridades sorteadas | Oponentes (luta 1/2/3) | Nível dos oponentes (luta 1/2/3) | Ouro por vitória (luta 1/2/3) | Gemas | XP (luta 1/2/3) |
|---|---|---|---|---|---|---|
| Bronze | Comum | 1 / 1 / 2 | 1 / 2 / 3 | 90 / 135 / 180 | 1 | 15 / 20 / 25 |
| Prata | Comum, Comum, Raro | 1 / 2 / 2 | 3 / 4 / 5 | 336 / 504 / 672 | 2 | 30 / 35 / 40 |
| Ouro | Raro, Comum | 2 / 2 / 3 | 5 / 6 / 7 | 726 / 1.089 / 1.451 | 3 | 45 / 50 / 55 |
| Platina | Raro, Raro, Épico | 2 / 3 / 3 | 7 / 8 / 9 | 1.254 / 1.880 / 2.507 | 4 | 60 / 65 / 70 |
| Diamante | Épico, Raro | 3 / 3 / 3 | 9 / 10 / 11 | 1.916 / 2.873 / 3.831 | 5 | 75 / 80 / 85 |
| Mestre | Épico, Épico, Raro | 3 / 3 / 3 | 11 / 12 / 13 | 2.709 / 4.063 / 5.417 | 6 | 90 / 95 / 100 |
| Grão-Mestre | Épico, Lendário, Épico | 3 / 3 / 3 | 13 / 14 / 15 | 3.630 / 5.445 / 7.260 | 7 | 105 / 110 / 115 |
| Campeões | Lendário, Épico | 3 / 3 / 3 | 15 / 15 / 15 | 4.679 / 7.018 / 9.357 | 8 | 120 / 125 / 130 |

As raridades sorteadas têm o mesmo peso cada; repetições na lista aumentam a chance (ex.: "Raro, Raro, Épico" = 2/3 Raro, 1/3 Épico). Oponentes de liga têm 95% da vida e do ataque de um dragão normal do mesmo nível.

## Espécies (50)

| # | Espécie | Elementos | Raridade | Como obter |
|---|---|---|---|---|
| 1 | Dragão de Fogo | 🔥 Fogo | Comum | Loja (nível 1) ou cruzamento |
| 2 | Dragão de Água | 💧 Água | Comum | Loja (nível 1) ou cruzamento |
| 3 | Dragão de Planta | 🌿 Planta | Comum | Loja (nível 1) ou cruzamento |
| 4 | Dragão de Terra | 🪨 Terra | Comum | Loja (nível 2) ou cruzamento |
| 5 | Dragão Elétrico | ⚡ Elétrico | Comum | Loja (nível 3) ou cruzamento |
| 6 | Dragão de Gelo | ❄️ Gelo | Comum | Loja (nível 4) ou cruzamento |
| 7 | Dragão de Metal | ⚙️ Metal | Raro | Loja (nível 6) ou cruzamento |
| 8 | Dragão das Trevas | 🌑 Trevas | Raro | Loja (nível 8) ou cruzamento |
| 9 | Dragão de Luz | ✨ Luz | Raro | Loja (nível 8) ou cruzamento |
| 10 | Piromaris | 🔥 Fogo + 💧 Água | Raro | Cruzar um pai com 🔥 Fogo e outro com 💧 Água |
| 11 | Pirofolius | 🔥 Fogo + 🌿 Planta | Raro | Cruzar um pai com 🔥 Fogo e outro com 🌿 Planta |
| 12 | Piropetrus | 🔥 Fogo + 🪨 Terra | Raro | Cruzar um pai com 🔥 Fogo e outro com 🪨 Terra |
| 13 | Pirovoltar | 🔥 Fogo + ⚡ Elétrico | Raro | Cruzar um pai com 🔥 Fogo e outro com ⚡ Elétrico |
| 14 | Piroglacius | 🔥 Fogo + ❄️ Gelo | Raro | Cruzar um pai com 🔥 Fogo e outro com ❄️ Gelo |
| 15 | Piroferrum | 🔥 Fogo + ⚙️ Metal | Épico | Cruzar um pai com 🔥 Fogo e outro com ⚙️ Metal |
| 16 | Pironoctis | 🔥 Fogo + 🌑 Trevas | Épico | Cruzar um pai com 🔥 Fogo e outro com 🌑 Trevas |
| 17 | Pirolumen | 🔥 Fogo + ✨ Luz | Épico | Cruzar um pai com 🔥 Fogo e outro com ✨ Luz |
| 18 | Hidrofolius | 💧 Água + 🌿 Planta | Raro | Cruzar um pai com 💧 Água e outro com 🌿 Planta |
| 19 | Hidropetrus | 💧 Água + 🪨 Terra | Raro | Cruzar um pai com 💧 Água e outro com 🪨 Terra |
| 20 | Hidrovoltar | 💧 Água + ⚡ Elétrico | Raro | Cruzar um pai com 💧 Água e outro com ⚡ Elétrico |
| 21 | Hidroglacius | 💧 Água + ❄️ Gelo | Raro | Cruzar um pai com 💧 Água e outro com ❄️ Gelo |
| 22 | Hidroferrum | 💧 Água + ⚙️ Metal | Épico | Cruzar um pai com 💧 Água e outro com ⚙️ Metal |
| 23 | Hidronoctis | 💧 Água + 🌑 Trevas | Épico | Cruzar um pai com 💧 Água e outro com 🌑 Trevas |
| 24 | Hidrolumen | 💧 Água + ✨ Luz | Épico | Cruzar um pai com 💧 Água e outro com ✨ Luz |
| 25 | Fitopetrus | 🌿 Planta + 🪨 Terra | Raro | Cruzar um pai com 🌿 Planta e outro com 🪨 Terra |
| 26 | Fitovoltar | 🌿 Planta + ⚡ Elétrico | Raro | Cruzar um pai com 🌿 Planta e outro com ⚡ Elétrico |
| 27 | Fitoglacius | 🌿 Planta + ❄️ Gelo | Raro | Cruzar um pai com 🌿 Planta e outro com ❄️ Gelo |
| 28 | Fitoferrum | 🌿 Planta + ⚙️ Metal | Épico | Cruzar um pai com 🌿 Planta e outro com ⚙️ Metal |
| 29 | Fitonoctis | 🌿 Planta + 🌑 Trevas | Épico | Cruzar um pai com 🌿 Planta e outro com 🌑 Trevas |
| 30 | Fitolumen | 🌿 Planta + ✨ Luz | Épico | Cruzar um pai com 🌿 Planta e outro com ✨ Luz |
| 31 | Geovoltar | 🪨 Terra + ⚡ Elétrico | Raro | Cruzar um pai com 🪨 Terra e outro com ⚡ Elétrico |
| 32 | Geoglacius | 🪨 Terra + ❄️ Gelo | Raro | Cruzar um pai com 🪨 Terra e outro com ❄️ Gelo |
| 33 | Geoferrum | 🪨 Terra + ⚙️ Metal | Épico | Cruzar um pai com 🪨 Terra e outro com ⚙️ Metal |
| 34 | Geonoctis | 🪨 Terra + 🌑 Trevas | Épico | Cruzar um pai com 🪨 Terra e outro com 🌑 Trevas |
| 35 | Geolumen | 🪨 Terra + ✨ Luz | Épico | Cruzar um pai com 🪨 Terra e outro com ✨ Luz |
| 36 | Eletroglacius | ⚡ Elétrico + ❄️ Gelo | Raro | Cruzar um pai com ⚡ Elétrico e outro com ❄️ Gelo |
| 37 | Eletroferrum | ⚡ Elétrico + ⚙️ Metal | Épico | Cruzar um pai com ⚡ Elétrico e outro com ⚙️ Metal |
| 38 | Eletronoctis | ⚡ Elétrico + 🌑 Trevas | Épico | Cruzar um pai com ⚡ Elétrico e outro com 🌑 Trevas |
| 39 | Eletrolumen | ⚡ Elétrico + ✨ Luz | Épico | Cruzar um pai com ⚡ Elétrico e outro com ✨ Luz |
| 40 | Crioferrum | ❄️ Gelo + ⚙️ Metal | Épico | Cruzar um pai com ❄️ Gelo e outro com ⚙️ Metal |
| 41 | Crionoctis | ❄️ Gelo + 🌑 Trevas | Épico | Cruzar um pai com ❄️ Gelo e outro com 🌑 Trevas |
| 42 | Criolumen | ❄️ Gelo + ✨ Luz | Épico | Cruzar um pai com ❄️ Gelo e outro com ✨ Luz |
| 43 | Ferronoctis | ⚙️ Metal + 🌑 Trevas | Épico | Cruzar um pai com ⚙️ Metal e outro com 🌑 Trevas |
| 44 | Ferrolumen | ⚙️ Metal + ✨ Luz | Épico | Cruzar um pai com ⚙️ Metal e outro com ✨ Luz |
| 45 | Umbrolumen | 🌑 Trevas + ✨ Luz | Épico | Cruzar um pai com 🌑 Trevas e outro com ✨ Luz |
| 46 | Eclipse | ✨ Luz + 🌑 Trevas | Lendário | Cruzar pais que somem ✨ Luz + 🌑 Trevas (25%) |
| 47 | Aurora | ❄️ Gelo + ✨ Luz | Lendário | Cruzar pais que somem ❄️ Gelo + ✨ Luz (20%) |
| 48 | Titã de Aço | 🪨 Terra + ⚙️ Metal | Lendário | Cruzar pais que somem 🪨 Terra + ⚙️ Metal (18%) |
| 49 | Tempestade | 💧 Água + ⚡ Elétrico | Lendário | Cruzar pais que somem 💧 Água + ⚡ Elétrico (15%) |
| 50 | Vulcano | 🔥 Fogo + 🪨 Terra | Lendário | Cruzar pais que somem 🔥 Fogo + 🪨 Terra (12%) |

## Conquistas (65, total de 301 gemas)

### Primeiros passos

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🪙 | Primeira coleta | Colete ouro de um habitat. | 1 |
| 🌾 | Mãos na terra | Faça sua primeira colheita. | 1 |
| 🛒 | Novo amigo | Compre um dragão na loja. | 1 |
| 🍖 | Hora do lanche | Alimente um dragão. | 1 |
| 💞 | Casamenteiro | Cruze dois dragões. | 2 |
| 🐣 | Choca-ovos | Choque seu primeiro ovo. | 2 |
| ⚔️ | Primeira vitória | Vença uma batalha na Arena. | 2 |

### Riqueza

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 💰 | Cofrinho | Ganhe 1.000 de ouro no total. | 1 |
| 💰 | Tesouro | Ganhe 10.000 de ouro no total. | 2 |
| 👑 | Montanha de ouro | Ganhe 100.000 de ouro no total. | 5 |
| 🏰 | Dragão milionário | Ganhe 1.000.000 de ouro no total. | 10 |
| 📈 | Renda passiva | Alcance 10 de ouro por segundo. | 1 |
| 🏭 | Fábrica de ouro | Alcance 50 de ouro por segundo. | 3 |
| 🏦 | Banco dracônico | Alcance 200 de ouro por segundo. | 5 |
| 💎 | Economia lendária | Alcance 500 de ouro por segundo. | 10 |
| 💠 | Joalheiro | Ganhe 100 gemas no total. | 5 |

### Coleção

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🐉 | Bando | Tenha 5 dragões ao mesmo tempo. | 1 |
| 🐉 | Revoada | Tenha 10 dragões ao mesmo tempo. | 3 |
| 🐉 | Céu lotado | Tenha 20 dragões ao mesmo tempo. | 5 |
| 🔷 | Raridade | Obtenha um dragão Raro. | 1 |
| 🔮 | Épico! | Obtenha um dragão Épico. | 3 |
| 🌟 | Lenda viva | Obtenha um dragão Lendário. | 5 |
| 🏛️ | Panteão | Obtenha 3 dragões Lendários. | 10 |
| 🌈 | Arco-íris elemental | Tenha dragões dos 9 elementos ao mesmo tempo. | 8 |
| 📗 | Colecionador | Descubra 10 espécies. | 3 |
| 📘 | Naturalista | Descubra 25 espécies. | 6 |
| 📕 | Enciclopédia viva | Descubra 40 espécies. | 12 |

### Evolução

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| ⬆️ | Crescendo | Leve um dragão ao nível 5. | 1 |
| ⏫ | Adolescente feroz | Leve um dragão ao nível 10. | 3 |
| 🔱 | Forma máxima | Leve um dragão ao nível 15. | 6 |
| 🍗 | Banquete | Alimente dragões 50 vezes. | 3 |
| 🧬 | Genética avançada | Cruze dragões 20 vezes. | 5 |
| ⏩ | Apressado | Acelere 5 ovos com gemas. | 2 |

### Fazenda

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🧺 | Celeiro cheio | Colha 1.000 de comida. | 2 |
| 🚜 | Agronegócio | Colha 10.000 de comida. | 5 |
| 👩‍🌾 | Fazendeiro dedicado | Faça 100 colheitas. | 4 |
| 🌱 | Latifúndio | Tenha 6 fazendas. | 3 |

### Arena

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🛡️ | Gladiador | Vença 10 batalhas. | 3 |
| 🏆 | Campeão de arena | Vença 30 batalhas. | 8 |
| 🥉 | Subindo de liga | Chegue à liga Ouro. | 2 |
| 🥈 | Elite | Chegue à liga Diamante. | 5 |
| 🥇 | Liga dos Campeões | Chegue à liga Campeões. | 8 |
| ☠️ | Golpe no sono | Derrote o Ancestral adormecido na Arena, após a liga Campeões. | 20 |
| 🔥 | Invicto | Vença 5 batalhas seguidas. | 3 |
| ☄️ | Imparável | Vença 10 batalhas seguidas. | 6 |
| 🎯 | Golpe certeiro | Acerte 50 golpes críticos. | 4 |
| 🧪 | Mestre elemental | Acerte 50 golpes super eficazes. | 4 |
| 💯 | Vitória perfeita | Vença sem perder nenhum dragão (liga Platina ou acima). | 4 |
| 💥 | Golpe devastador | Cause 300 de dano em um único golpe. | 4 |

### Ilha

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🏘️ | Condomínio | Tenha 5 habitats. | 3 |
| 🪺 | Maternidade | Tenha 4 espaços na chocadeira. | 4 |
| 👋 | Desapego | Venda um dragão. | 1 |
| 📜 | Prestativo | Conclua 5 missões. | 3 |
| 🎖️ | Herói da ilha | Conclua 15 missões. | 8 |
| 🥚 | Caçador de ovos | Pegue 3 ovos perdidos. | 4 |
| 📣 | Sempre alerta | Presencie 5 eventos. | 2 |

### Jogador

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| ⭐ | Aprendiz | Chegue ao nível 5. | 2 |
| 🌟 | Domador | Chegue ao nível 10. | 5 |
| 💫 | Mestre dos dragões | Chegue ao nível 20. | 10 |
| ⚡ | Relâmpago | Chegue ao nível 5 em até 5 minutos. | 5 |
| 🍀 | Sorte de principiante | Obtenha um Lendário em até 10 minutos. | 8 |
| 👆 | Dedo nervoso | Faça 500 cliques. | 2 |

### Invasão

|  | Conquista | Requisito | Gemas |
|---|---|---|---|
| 🛡️ | Guardião da ilha | Vença a Invasão Final. | 10 |
| 🏰 | Ilha intocável | Vença a Invasão Final sem perder nenhum dragão. | 15 |
| 🩸 | Cicatriz no Ancestral | Tire metade da vida do Ancestral na Invasão Final. | 5 |
