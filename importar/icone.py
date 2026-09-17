# -*- coding: utf-8 -*-
"""
ARMAZÉM INTELIGENTE — o ícone da app, em SVG

Desenho de 17 de setembro: o armazém em traço branco, a caixa e a palete a
laranja, ROMAFE e «Armazém Inteligente» por baixo, num quadrado azul.

Gera dois ficheiros em web/assets/img/:
  icone-app.svg      o ícone inteiro, com o nome — loja, ecrã de entrar, documentos
  simbolo-app.svg    só o armazém e a caixa — favicon, faixa, ícone do Android

As letras vão embutidas no SVG (Motor e Roboto em base64). Um SVG usado num
<img> não carrega ficheiros de fora, e sem isto o nome saía em Arial.

As cores são as de tokens.css: o invertido a esbater para o azul do logótipo
no fundo, a ação na caixa e na palete. Correr: python3 importar/icone.py
"""
import base64, os

AQUI = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(AQUI, '..', 'web', 'assets')

INVERTIDO = '#012338'
LOGOTIPO = '#2762a8'   # o azul da palavra ROMAFE, --c-logotipo
ACAO = '#ef7b10'
ACAO_PREMIDO = '#d26c0e'
BRANCO = '#ffffff'

def fonte(nome):
    with open(os.path.join(WEB, 'fonts', nome), 'rb') as f:
        return base64.b64encode(f.read()).decode()

def fundo():
    return f'''  <defs>
    <radialGradient id="fundo" cx=".5" cy=".5" r=".72">
      <stop offset=".45" stop-color="{INVERTIDO}"/>
      <stop offset="1" stop-color="{LOGOTIPO}"/>
    </radialGradient>
    <linearGradient id="caixa" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{ACAO}"/>
      <stop offset="1" stop-color="{ACAO_PREMIDO}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="230" fill="url(#fundo)"/>'''

def armazem(dy=0, escala=1.0, cx=512):
    """O armazém, a caixa e a palete, desenhados à volta de x=512."""
    t = f'translate({cx} {dy}) scale({escala}) translate(-512 0)'
    return f'''  <g transform="{t}">
    <path d="M278 588V306L512 167l233 139v282" fill="none" stroke="{BRANCO}" stroke-width="66" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="380" y="327" width="261" height="167" rx="16" fill="url(#caixa)"/>
    <rect x="472" y="327" width="73" height="83" rx="8" fill="{BRANCO}" opacity=".95"/>
    <path d="M355 512h311a10 10 0 0 1 10 10v55a10 10 0 0 1-10 10h-45a8 8 0 0 1-8-8v-24H408v24a8 8 0 0 1-8 8h-45a10 10 0 0 1-10-10v-55a10 10 0 0 1 10-10Z" fill="{ACAO}"/>
  </g>'''

icone = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-label="ROMAFE Armazém Inteligente">
  <style>
    @font-face {{ font-family: 'Motor'; src: url(data:font/woff2;base64,{fonte('motor-latin.woff2')}) format('woff2'); }}
    @font-face {{ font-family: 'Roboto'; font-weight: 400 700; src: url(data:font/woff2;base64,{fonte('roboto-latin.woff2')}) format('woff2'); }}
    .nome {{ font-family: 'Motor', 'Roboto', sans-serif; font-weight: 700; }}
    .sub  {{ font-family: 'Roboto', sans-serif; font-weight: 500; }}
  </style>
{fundo()}
{armazem()}
  <text class="nome" x="512" y="782" font-size="200" fill="{BRANCO}" text-anchor="middle" textLength="712" lengthAdjust="spacingAndGlyphs">ROMAFE</text>
  <text class="sub" x="512" y="856" font-size="42" fill="{BRANCO}" text-anchor="middle" textLength="712" lengthAdjust="spacing">ARMAZÉM INTELIGENTE</text>
</svg>
'''

# O símbolo sem o nome: a 48 px as letras não se leem, e o Android põe o nome
# da app por baixo do ícone. O armazém sobe e cresce para ocupar o quadrado.
simbolo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-label="ROMAFE Armazém Inteligente">
{fundo()}
{armazem(dy=115, escala=1.25)}
</svg>
'''

for nome, svg in (('icone-app.svg', icone), ('simbolo-app.svg', simbolo)):
    with open(os.path.join(WEB, 'img', nome), 'w', encoding='utf-8') as f:
        f.write(svg)
    print('  web/assets/img/' + nome)
