# Armazém Inteligente — ecrãs do PDA

Feito como o `Figma-WebShop-GoParts`: o mesmo editor, apontado ao PDA.

| Ficheiro | Para quê |
| --- | --- |
| `importar/01-ecras.pdf` | **Importar no Figma ou no Canva.** Os 36 ecrãs, uma página de 320 × 533 cada, em vetor e com o texto editável |
| `importar/02-ecras-com-titulo.pdf` | Para ler e mostrar: cada ecrã com o nome por cima |
| `importar/ecras/*.png` | Cada ecrã a 480 × 800, o tamanho real do EDA61K |
| `importar/03-fluxo.png`, `importar/03-fluxo.pdf` | **O mapa de navegação.** Os 36 ecrãs numa folha, uma linha por fluxo, com uma seta de cada botão ou leitura para o ecrã a que leva |
| `importar/03-fluxo-arrumacao.*` | O mesmo mapa, só com o que a arrumação vê, de ponta a ponta |
| `importar/*-en.pdf`, `importar/ecras-en/` | O mesmo, em inglês |
| `importar/icone/*.png` | O ícone da app: o inteiro a 512 e 1024 para a loja, o símbolo nas cinco densidades do Android (48 a 192) |
| `importar/icone.py` | Gera os dois SVG do ícone em `web/assets/img/` |
| `importar/gerar.sh` | Gera tudo, nas duas línguas. Mudar um token, um ecrã ou uma tradução e voltar a correr |

## O código: `web/`

```
web/
  index.html                 os 36 ecrãs, em modo de edição
  documentacao.html          o sistema documentado, com exemplos vivos
  como-funciona.html         o que é e como está montado
  assets/css/tokens.css      os valores, copiados de 05-design/03 sem alterar
  assets/css/base.css        faixa, barra, passos, cartão, selo, botões, leitor, alerta, tarefa, vazio, folha
  assets/css/entrada.css     só entrar e o menu
  assets/css/arrumar.css     só arrumar
  assets/css/separar.css     só separar
  assets/css/expedir.css     só expedir
  assets/css/gestor.css      só o gestor
  assets/css/editor.css      a moldura do editor e a tela
  assets/css/documentacao.css só as duas páginas de documentação
  assets/js/ecras.js         que ecrã se vê, e os modos #so= das capturas
  assets/js/fluxo.js         o mapa de navegação (#so=fluxo, as abas «Fluxo» e «Texto»)
  assets/js/vendor/          o Mermaid, que desenha os diagramas da aba «Texto»
  assets/js/editor.js        o editor
  assets/js/pecas.js         a paleta: acrescentar peças ao ecrã
  assets/js/traducao.js      português e inglês, por dicionário
  assets/js/documentacao.js  constrói as grelhas a partir dos tokens
  assets/fonts/              Roboto, Roboto Mono e Motor (a letra da marca) em woff2
```

Abre `web/index.html` no navegador. A documentação e o como funciona abrem
dentro dele, nas abas do topo do painel esquerdo — `index.html#doc=documentacao`
vai direto. As duas páginas também abrem sozinhas.

## Português e inglês

O ecrã lê-se nas duas línguas, e o painel do editor muda com ele: camadas,
propriedades e paleta. Os botões *Português* e *English* estão por baixo de
*Repor tudo*. O que fica em português é o CSS do diálogo, que se cola num projeto
escrito em português.

O HTML continua em português e o inglês é um dicionário por cima, como no GoParts.
Uma peça acrescentada na paleta aparece traduzida sem se lhe mexer, e
`PdaTraducao.porTraduzir()`, na consola e com a página em português, diz o que
falta. Não se traduzem nomes de pessoas, códigos de posição e de guia,
transportadoras nem a marca.

`index.html#so=a2&lingua=en` mostra um ecrã só, em inglês.

| Português | Inglês |
| --- | --- |
| arrumação | put-away |
| separação | picking |
| expedição | shipping |
| guia | order |
| posição | location |
| volume | parcel |
| cais | dock |
| lote | batch |
| prateleira de preparados | staging shelf |
| ler (com o gatilho) | scan |

## Os ecrãs

| Fluxo | Ecrãs | De onde vêm |
| --- | --- | --- |
| Entrar e começar o turno | 01 Entrar · 02 Início da arrumação · 03 A fila, com o porquê | CU-01 · RF-01 · RF-20 · RF-95 |
| Receber o que chega (tarefa da fila) | 04 Lê a guia do fornecedor · 05 Confere o que chegou · 06 A quantidade não bate · 07 Recebido | CU-06 · RF-30 · CU-22 |
| Arrumar uma palete | 08 Lê o artigo · 09 Proposta 1 de 3 · 10 A 1 estava ocupada · 11 Lê a posição · 12 Arrumada | CU-07 · RF-31 a RF-35 |
| Quando a arrumação não corre bem | 13 O que se passa? · 14 Escreve o artigo · 15 Escreve a posição · 16 Problema registado | CU-22 · CU-02 · RF-92 |
| Corrigir uma posição (tarefa) | 17 Tira da origem · 18 Põe no destino · 19 Corrigida | CU-09 · RF-38 · RF-39 |
| Corrigir o que está numa posição | 20 Lê a posição do erro · 21 O que está lá? · 22 Correção registada | RF-114 · RF-121 |
| Levar a palete vazia | 23 Leva ao parque · 24 No parque | CU-36 |
| Consultar | 25 Consultar artigo · 26 Consultar posição | CU-03 |
| Recolher uma guia | 27 O lote · 28 Paragem · 29 Falta quantidade · 30 Prateleira de preparados | CU-10 · CU-11 · RF-44 · RF-115 |
| Da prateleira ao camião | 31 Camiões de hoje · 32 Confere volumes · 33 Leva ao cais · 34 Carregar | CU-13 · CU-38 · CU-15 · RF-118 a RF-120 |
| O gestor e as exceções | 35 Relatório do turno · 36 Sem ligação | CU-16 · RNF-01 |

O mapa do *Fluxo* mostra, por baixo de cada ecrã, o nome e **para que serve**
(`data-objetivo` no `index.html`), e ao lado de cada linha **o que é o fluxo**
(`<template id="fluxos">`, no início do `index.html`). Mudar o texto é mudar lá;
o inglês está no `traducao.js`.

A aba **Texto** (`index.html#doc=texto`) escreve o fluxo todo: cada fluxo com o que
é, cada ecrã com o objetivo e para onde leva cada botão ou leitura. É gerada no
momento a partir dos ecrãs (`PdaFluxo.texto()` no `fluxo.js`): não há texto para manter.
Tem também os **diagramas de fluxo**: uma visão geral dos fluxos no topo, e em cada
fluxo o seu diagrama com todas as situações (cada ecrã, cada botão e leitura; as
caixas tracejadas são ecrãs de outro fluxo). Clicar numa caixa abre o ecrã. São
desenhados pelo Mermaid 11 (MIT), guardado em `web/assets/js/vendor/` para abrir
sem rede, e só carregado quando a aba *Texto* abre.

No fim da aba *Texto* estão os **casos de uso**: o diagrama (os atores ligados aos
casos que fazem) e a lista, com os atores, os ecrãs de cada um (tirados do
`data-refs` dos ecrãs) e uma nota quando uma decisão o mudou. A lista está no
`<template id="casos-de-uso">` do `index.html`: é o dossiê com as decisões já
aplicadas (CU-08 e CU-29 fora, CU-04 na v2, CU-35 do gestor, …).

Cada ecrã tem `data-funcao` (`arrumacao`, `separacao`, `expedicao`, `gestor` ou `todas`):
é o que o filtro do *Fluxo* usa, e o que o `gerar.sh` usa para o `03-fluxo-arrumacao`.
As posições escrevem-se com oito algarismos — armazém · zona · coluna · prateleira
(`60300401`); não há corredor nem nível.

Acrescentar um ecrã é acrescentar um `<div class="ecra" data-ecra="…"
data-fluxo="…" data-nome="…">` ao `index.html`, com um `<div class="pda">` lá
dentro, e uma linha em `importar/gerar.sh`. Um `data-ir="…"` num botão diz para
que ecrã ele leva no protótipo.

As setas do mapa de navegação saem destes `data-ir`. A aba *Fluxo* do editor
mostra os ecrãs todos de uma vez e edita-se como a dos ecrãs; no painel da
direita, *Protótipo › Leva a* muda o destino de qualquer peça, e a seta vai
atrás. O zoom é o do Figma: Ctrl + roda (ou pinça), Ctrl + = e Ctrl + −,
Ctrl + 0 para 100 %, Shift + 1 para ajustar, e espaço + arrastar (ou a roda do
meio) para andar pela tela; a barra em baixo ao centro faz o mesmo. As setas
arrastam-se pelo meio (o corredor e a faixa por onde passam; as pontas ficam
presas), e um duplo clique devolve-as ao traçado automático. Para criar uma seta, escolhe-se a peça e
arrasta-se a bolinha azul que lhe aparece à direita para um ecrã; para a mudar
de ecrã, arrasta-se a ponta. Grava-se como o *Leva a* do painel (Ctrl + Z desfaz). Como o resto do editor, isto fica no navegador e sai em *Ver o CSS*:
para entrar no `index.html` (e no `03-fluxo` do `gerar.sh`) passa-se à mão.

Os nomes, as posições e as horas são de exemplo.

## O que difere do protótipo de `pda-docs`

| Peça | Protótipo | Aqui | Porquê |
| --- | --- | --- | --- |
| «Simular leitura» | Botão laranja | Não existe | No aparelho lê-se com o gatilho; o leitor é que leva ao ecrã seguinte |
| Código de posição | 40 sp | 46 sp (`colossal`) | 03 §3: o colossal é para o código de posição |
| «Sem ligação» na faixa | Vermelho claro | Palavra em maiúsculas | Vermelho sobre o invertido não se lê, e a cor não diz estado sozinha |
| Cores do aro e do fundo | Dentro da página | Só no `editor.css` | O aro é da tela, não do ecrã |

## O ecrã de entrar

Segue o desenho de 17 de setembro (segunda versão): fotografia do armazém,
«Bem-vindo» e cartão de sessão com utilizador e palavra-passe. A linha das três
áreas (Receção, Armazenamento, Expedição) que vinha por baixo foi tirada a 21 de
setembro.

Levado a 320 × 533 dp, o desenho dava letra de 8 sp e campos de 30 dp. Aqui
ficam no mínimo do sistema — 10 sp e 48 dp — e o que se apertou foram as folgas.
A fotografia é um corte de `armazem.png` do GoParts, até haver uma do armazém.
A marca é a do GoParts: ROMAFE em Motor, o risco laranja e o subtítulo.

**Não bate certo com os requisitos.** O RF-01 diz «entrar com código de utilizador
e PIN», e o RF-03 «não guardar a palavra-passe no dispositivo». O desenho pede
utilizador e palavra-passe. Ou muda o RF-01, ou muda o ecrã.

## O ícone da app

Desenho de 17 de setembro: o armazém em traço branco, a caixa e a palete a
laranja, ROMAFE e «Armazém Inteligente» por baixo, num quadrado azul.

| Ficheiro | Onde |
| --- | --- |
| `web/assets/img/icone-app.svg` | O inteiro, com o nome — loja, documentos, apresentações |
| `web/assets/img/simbolo-app.svg` | Sem o nome — ícone no Android, favicon e a faixa dos ecrãs |

Na tela, o ícone é mais um «ecrã» no seletor — grupo *Marca*, *Ícone da app* —
montado com peças (símbolo, nome, subtítulo) para se afinar como os outros. Não
entra nos PDF dos ecrãs. Se se mudar ali, leva-se a mudança para `importar/icone.py`.

Abaixo de uns 100 px as letras deixam de se ler, e o Android já escreve o nome da
app por baixo do ícone; daí o símbolo. As letras vão embutidas no SVG, senão
num `<img>` o nome saía em Arial. O fundo vai do invertido ao azul da palavra
ROMAFE, e a caixa é o laranja de ação.

## O menu da arrumação

Segue o desenho de 17 de setembro: a saudação, *Prioridades de hoje* (as quatro
tarefas da função, com a contagem), *Ações rápidas* (as consultas) e a barra do
fundo com *Fila*, *Início* e *Sair*. No protótipo, *Arrumar* e *Fila* levam à fila,
e *Sair* volta a entrar.

Com 145 dp por mosaico, «3 paletes no cais» e «Corrigir posição» partem em duas
linhas a 12 e 13 sp — o desenho só cabia numa linha com letra de 10 sp.

**A faixa mudou em todos os ecrãs**, porque é a mesma peça: ganhou o ícone do
armazém, o divisor laranja e o ponto verde antes de «ligado». Sem rede, o ponto
fica cinzento e a palavra diz SEM LIGAÇÃO.

## Três acréscimos ao sistema de design

| Token | Valor | Onde |
| --- | --- | --- |
| `--c-logotipo` | `#2762a8` | A palavra ROMAFE, o azul do GoParts |
| `--c-veu` | o invertido a 45% | O fundo da folha de exceção e o escuro sobre a fotografia |
| `--espessura-progresso` | 4 dp | Os traços dos passos |

O azul da marca sobre escuro vem do manual de UI da ROMAFE e não do sistema do PDA. Ou entram no `Theme.kt`, ou saem daqui.

## O que falta

- Ecrãs que o dossiê pede e ainda não estão: receber, contar, pedir etiqueta,
  corrigir posição, devolução, e o computador da expedição.
- Passos, leitor, alerta, tarefa, linha e folha ainda não são componentes em
  `core/design`.
