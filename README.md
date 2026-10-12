# Dragões Relâmpago

Jogo de navegador no estilo Dragon City, feito para caber numa sessão: crie, cruze, evolua e batalhe com dragões em partidas de 10 ou 20 minutos, até o Dragão Ancestral despertar e invadir a ilha. Não há salvamento: fechou a aba, a partida acaba.

## Como jogar
- Abra `index.html` direto no navegador (duplo clique). Não precisa instalar nada nem rodar servidor.
- Ou sirva a pasta, se preferir: `python3 -m http.server` e acesse `http://localhost:8000`.

## Arquivos
- `index.html`: o jogo inteiro (HTML, CSS e JavaScript puro, com o three.js embutido para os modelos 3D; funciona sem internet).
- `DESIGN-NOTAS.md`: mecânicas, fórmulas, números de balanceamento e conquistas implementados.
- `docs/`: documentação completa.

## Primeiros passos no jogo
1. Clique no habitat para coletar ouro.
2. Plante trigo nas fazendas e colha a comida.
3. Alimente os dragões até o nível 3 e cruze dois deles na aba Cruzar.
4. Monte um time de até 3 dragões e suba as 8 ligas da Arena.
5. Quando o tempo acabar, defenda a ilha do Dragão Ancestral na Invasão Final.
