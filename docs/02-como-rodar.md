# Como rodar

O jogo é um único arquivo, `dragoncity/index.html` (cerca de 2,6 MB, porque os modelos 3D vêm dentro dele). Não precisa instalar nada.

## Jeito mais simples

1. Baixe ou copie a pasta `dragoncity/`.
2. Dê dois cliques em `index.html`. Ele abre no navegador padrão.
3. Escolha um modo (Rápida, Padrão, Longa ou Infinito) e jogue.

Funciona em qualquer navegador atual (Chrome, Edge, Firefox, Safari), no computador ou no celular. No celular, o mapa da ilha rola para os lados e os painéis sobem de baixo.

## Com um servidor local (opcional)

Útil para testar no celular pela rede local ou para evitar restrições de `file://`:

```bash
cd dragoncity
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou, com Node instalado:

```bash
npx serve dragoncity
```

## Internet

O jogo funciona offline, com som e modelos 3D (o three.js e os modelos vêm embutidos no arquivo, e o áudio é gerado no navegador). A única coisa carregada da internet são as fontes (Lilita One e Nunito, do Google Fonts). Sem internet, o navegador usa fontes de reserva e o jogo continua igual.

## Publicar na web

Como é um arquivo estático, qualquer hospedagem de arquivos serve: GitHub Pages, Netlify, Vercel ou um Artifact do Claude. Basta publicar o `index.html`.

## Dados e privacidade

O jogo não salva nada: nem no navegador (`localStorage`), nem em servidor. Toda a partida vive na memória da aba. Fechar ou recarregar a página apaga a partida, por design.

## Testes automatizados

O jogo expõe `window.__game` para testes (estado, `startGame`, `tick`, ações e `endGame`). Veja [08-arquitetura.md](08-arquitetura.md#ganchos-para-testes).

## Regenerar as tabelas da documentação

As tabelas de [09-tabelas-de-referencia.md](09-tabelas-de-referencia.md) são extraídas do próprio código. Depois de mudar números no jogo:

```bash
cd dragoncity
node docs/ferramentas/gerar-tabelas.js
```
