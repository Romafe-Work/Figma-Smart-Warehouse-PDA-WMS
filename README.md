# Armazém Inteligente — ecrãs do PDA

Os sessenta e um ecrãs do PDA, desenhados com os tokens do sistema de design
(`pda-docs/05-design/03`), e uma tela para os editar.

## Abrir

`web/index.html` abre em modo de edição: camadas à esquerda, o aparelho ao
centro, propriedades à direita. Lê-se em português e em inglês. Não precisa de servidor, nem de build, nem de rede.

`web/documentacao.html` documenta o sistema — cor, tipografia, espaço, alvos de
toque e componentes — com exemplos vivos.

`web/como-funciona.html` explica o que isto é e porque não é o Figma.

## O que há aqui

| Pasta | O que é |
| --- | --- |
| `web/` | O código: HTML, CSS, JS e a Roboto |
| `importar/` | Os ecrãs em PNG e PDF, e o guião que os gera |
| `LEIA-ME.md` | Como se usa, e o que falta |

## A regra do editor

O painel só oferece o que o sistema de design tem: as vinte cores, os nove
tamanhos de letra, os seis degraus de espaço e os quatro raios. Um botão muda de
cor trocando de variante. Por isso o CSS que o editor exporta nunca traz um valor
inventado, e cada nome tem par em `core/design`.
