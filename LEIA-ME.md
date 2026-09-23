# Armazém Inteligente — ecrãs do PDA

Feito como o `Figma-WebShop-GoParts`: o mesmo editor, apontado ao PDA.

| Ficheiro | Para quê |
| --- | --- |
| `importar/01-ecras.pdf` | **Importar no Figma ou no Canva.** Os 63 ecrãs, uma página de 320 × 533 cada, em vetor e com o texto editável |
| `importar/02-ecras-com-titulo.pdf` | Para ler e mostrar: cada ecrã com o nome por cima |
| `importar/ecras/*.png` | Cada ecrã a 480 × 800, o tamanho real do EDA61K |
| `importar/03-fluxo.png`, `importar/03-fluxo.pdf` | **O mapa de navegação.** Os 63 ecrãs numa folha, uma linha por fluxo, com uma seta de cada botão ou leitura para o ecrã a que leva |
| `importar/03-fluxo-arrumacao.*` | O mesmo mapa, só com o que a arrumação vê, de ponta a ponta |
| `importar/*-en.pdf`, `importar/ecras-en/` | O mesmo, em inglês |
| `importar/icone/*.png` | O ícone da app: o inteiro a 512 e 1024 para a loja, o símbolo nas cinco densidades do Android (48 a 192) |
| `importar/icone.py` | Gera os dois SVG do ícone em `web/assets/img/` |
| `importar/gerar.sh` | Gera tudo, nas duas línguas. Mudar um token, um ecrã ou uma tradução e voltar a correr |

## O código: `web/`

```
web/
  index.html                 os 63 ecrãs, em modo de edição
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
| Entrar e começar o turno | 01 Entrar · 02 Início da arrumação · 03 A fila | CU-01 · CU-39 · RF-20 |
| Receber o que chega | 04 Picar a chegada · 05 Chegada registada · 06 Lê a guia · 07 Confere · 08 A quantidade não bate · 09 Recebido | CU-40 · CU-06 |
| Arrumar uma palete | 10 a 14 | CU-07 · RF-31 a RF-35 |
| Quando a arrumação não corre bem | 15 O que se passa? · 16 Escreve o artigo · 17 Escreve a posição | CU-22 · RF-92 |
| Comunicar um problema (todas) | 18 Problema registado | CU-22 |
| Corrigir uma posição (tarefa) | 19 a 21 | CU-09 |
| Corrigir o que está numa posição | 22 a 24 | RF-114 · RF-121 |
| Levar a palete vazia (arrumação e separação) | 25 · 26 | CU-36 |
| Consultar (arrumação) | 27 · 28 | CU-03 · CU-23 |
| Começar o turno na separação | 29 Início da separação · 30 A tua fila | CU-39 · CU-10 |
| Recolher uma guia | 31 a 35 | CU-11 · CU-14 · RF-44 |
| Quando a separação não corre bem | 36 a 38 | CU-22 · CU-12 |
| Consultar na separação | 39 a 41 | CU-03 · CU-23 |
| Começar o turno na expedição | 42 Início da expedição · 43 A tua fila | CU-39 · CU-13 |
| Da prateleira ao camião | 44 a 48 | CU-13 · CU-38 · CU-15 |
| Quando a expedição não corre bem | 49 a 52 | CU-22 · CU-14 · CU-12 |
| Consultar na expedição | 53 · 54 | CU-03 · RF-115 |
| O gestor | 55 Início do gestor · 56 Relatório · 57 Sinais · 58 Atribuir · 59 O que está a acontecer · 60 Feito · 61 Todas as operações · 62 Insights | CU-16 a CU-20 · CU-30 · CU-32 |
| Quando falta a ligação (todas) | 63 Sem ligação | CU-27 · RNF-01 |

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
