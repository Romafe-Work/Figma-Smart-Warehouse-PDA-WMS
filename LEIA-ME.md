# Armazém Inteligente — ecrãs do PDA

Feito como o `Figma-WebShop-GoParts`: o mesmo editor, apontado ao PDA.

| Ficheiro | Para quê |
| --- | --- |
| `importar/01-ecras.pdf` | **Importar no Figma ou no Canva.** Os 19 ecrãs, uma página de 320 × 533 cada, em vetor e com o texto editável |
| `importar/02-ecras-com-titulo.pdf` | Para ler e mostrar: cada ecrã com o nome por cima |
| `importar/ecras/*.png` | Cada ecrã a 480 × 800, o tamanho real do EDA61K |
| `importar/gerar.sh` | Gera os três. Mudar um token ou um ecrã e voltar a correr |

## O código: `web/`

```
web/
  index.html                 os 19 ecrãs, em modo de edição
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
  assets/js/editor.js        o editor
  assets/js/pecas.js         a paleta: acrescentar peças ao ecrã
  assets/js/documentacao.js  constrói as grelhas a partir dos tokens
  assets/fonts/              Roboto e Roboto Mono em woff2
```

Abre `web/index.html` no navegador.

## Os ecrãs

| Fluxo | Ecrãs | De onde vêm |
| --- | --- | --- |
| Entrar e começar o turno | 01 Entrar · 02 Menu da arrumação · 03 A fila, com o porquê | CU-01 · RF-01 · RF-20 · RF-95 |
| Arrumar uma palete | 04 Lê o artigo · 05 Proposta 1 de 3 · 06 A 1 estava ocupada · 07 Lê a posição · 08 Arrumada | CU-07 · RF-31 a RF-35 |
| Recolher uma guia | 09 O lote · 10 Paragem · 11 Falta quantidade · 12 Prateleira de preparados | CU-10 · CU-11 · RF-44 · RF-115 |
| Da prateleira ao camião | 13 Camiões de hoje · 14 Confere volumes · 15 Leva ao cais · 16 Carregar | CU-13 · CU-38 · CU-15 · RF-118 a RF-120 |
| O gestor e as exceções | 17 Relatório do turno · 18 O que se passa? · 19 Sem ligação | CU-16 · CU-22 · RNF-01 |

Acrescentar um ecrã é acrescentar um `<div class="ecra" data-ecra="…"
data-fluxo="…" data-nome="…">` ao `index.html`, com um `<div class="pda">` lá
dentro, e uma linha em `importar/gerar.sh`. Um `data-ir="…"` num botão diz para
que ecrã ele leva no protótipo.

Os nomes, as posições e as horas são de exemplo.

## O que difere do protótipo de `pda-docs`

| Peça | Protótipo | Aqui | Porquê |
| --- | --- | --- | --- |
| «Simular leitura» | Botão laranja | Não existe | No aparelho lê-se com o gatilho; o leitor é que leva ao ecrã seguinte |
| Código de posição | 40 sp | 46 sp (`colossal`) | 03 §3: o colossal é para o código de posição |
| «Sem ligação» na faixa | Vermelho claro | Palavra em maiúsculas | Vermelho sobre o invertido não se lê, e a cor não diz estado sozinha |
| Cores do aro e do fundo | Dentro da página | Só no `editor.css` | O aro é da tela, não do ecrã |

## Dois acréscimos ao sistema de design

| Token | Valor | Onde |
| --- | --- | --- |
| `--c-veu` | o invertido a 45% | O fundo da folha de exceção |
| `--espessura-progresso` | 4 dp | Os traços dos passos |

Nenhum é uma cor nova. Ou entram no `Theme.kt`, ou saem daqui.

## O que falta

- Ecrãs que o dossiê pede e ainda não estão: receber, contar, pedir etiqueta,
  corrigir posição, devolução, e o computador da expedição.
- Passos, leitor, alerta, tarefa, linha e folha ainda não são componentes em
  `core/design`.
