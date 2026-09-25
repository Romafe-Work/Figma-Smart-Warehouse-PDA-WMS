#!/usr/bin/env bash
# =========================================================
# ARMAZÉM INTELIGENTE — gerar o que se importa
#
# Tudo sai de web/index.html. Mudar um token, um ecrã ou uma tradução lá e
# voltar a correr isto: não há um segundo desenho para manter à mão.
#
#   ecras/NN-nome.png            cada ecrã a 480 × 800 px, o tamanho real do EDA61K
#   ecras-en/NN-nome.png         o mesmo, em inglês
#   01-ecras.pdf                 os 62 ecrãs, uma página de 320 × 533 cada, em vetor
#   01-ecras-en.pdf              o mesmo, em inglês
#   02-ecras-com-titulo.pdf      os 19 com o nome por cima, para ler e mostrar
#   04-casos-de-uso.pdf          um caso de uso por página, com os ecrãs em que acontece (só em português)
#   02-ecras-com-titulo-en.pdf   o mesmo, em inglês
#   03-fluxo.png, 03-fluxo.pdf   o mapa de navegação: os ecrãs por fluxo, com as setas
#   03-fluxo-arrumacao.*         só os ecrãs da arrumação, com as setas
#   03-fluxo-en.*, …-arrumacao-en.*  o mesmo, em inglês
#   icone/                       o ícone da app em PNG, para o Android e a loja
# =========================================================
set -euo pipefail
cd "$(dirname "$0")"
CH=$(ls ~/.cache/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell | head -1)
WEB="$(cd ../web && pwd)"
INDEX="$WEB/index.html"

correr() { "$CH" --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=5000 "$@" >/dev/null 2>&1; }

# id|ficheiro — o título vem do data-nome de cada ecrã
ECRAS=$(cat <<'L'
e1|01-entrar
e2|02-inicio-arrumacao
n1|04-receber-picar-chegada
n2|05-receber-chegada-registada
r1|06-receber-le-guia
r2|07-receber-confere
r3|08-receber-diferenca
r4|09-receber-recebido
a1|10-arrumar-le-artigo
a2|11-arrumar-proposta-1
a3|12-arrumar-proposta-ocupada
a4|13-arrumar-le-posicao
a5|14-arrumar-concluida
g2|15-arrumar-o-que-se-passa
a6|16-arrumar-escreve-artigo
a7|17-arrumar-escreve-posicao
a8|18-arrumar-problema-registado
k1|19-corrigir-tira-origem
k2|20-corrigir-poe-destino
k3|21-corrigir-concluida
k4|22-acertar-le-posicao
k5|23-acertar-o-que-esta-la
k6|24-acertar-registado
p1|25-palete-vazia-leva
p2|26-palete-vazia-no-parque
q1|27-consultar-artigo
q2|28-consultar-posicao
sp0|29-separacao-inicio
sp1|30-separacao-tarefa
s1|31-separacao-guia
s2|32-separacao-paragem
s3|33-separacao-falta-quantidade
s4|34-separacao-prateleira-preparados
s7|35-separacao-guia-fechada
s5|36-separacao-o-que-se-passa
s6|37-separacao-escreve-posicao
s8|38-separacao-sair-guia-a-meio
s9|39-separacao-consultar-guia
sq1|40-separacao-consultar-artigo
sq2|41-separacao-consultar-posicao
xp0|42-expedicao-inicio
xp1|43-expedicao-tarefa
x1|44-expedicao-camioes
x2|45-expedicao-conferir-volumes
x3|46-expedicao-levar-ao-cais
x4|47-expedicao-carregar
x5|48-expedicao-saida-fechada
x6|49-expedicao-o-que-se-passa
x7|50-expedicao-falta-volume
x8|51-expedicao-escreve-cais
x9|52-expedicao-sair-guia-a-meio
xq1|53-expedicao-consultar-guia
xq2|54-expedicao-prateleira
gp0|55-gestor-inicio
g1|56-gestor-relatorio
g5|57-gestor-atribuir
g6|58-gestor-agora
g8|59-gestor-feito
g9|60-gestor-todas-operacoes
g10|61-gestor-insights
g11|67-gestor-chegou-um-camiao
e4|68-arrumacao-fim-do-turno
g3|62-sem-ligacao
d1|63-expedicao-fechar-saida-dialogo
d2|64-arrumacao-corrigir-stock-dialogo
t1|65-aviso-tarefa-nova
d3|66-arrumacao-sair-guia-a-meio
L
)

# O título em inglês sai do mesmo dicionário que traduz o ecrã.
titulo_en() {
  node -e '
    const fs = require("fs");
    const src = fs.readFileSync(process.argv[1], "utf8");
    const EN = eval("(" + src.slice(src.indexOf("var EN = {") + 9, src.indexOf("\n  };", src.indexOf("var EN = {")) + 4) + ")");
    const [n, nome] = process.argv[2].split(" · ");
    console.log(n + " · " + (EN[nome] || nome));
  ' "$WEB/assets/js/traducao.js" "$1"
}

gerar() {
  local lingua=$1 pasta=$2 sufixo=$3 paginas=""
  mkdir -p "$pasta"
  rm -f "$pasta"/*.png
  while IFS='|' read -r id nome; do
    # 1,5 × 320 × 533 = 480 × 800: os píxeis do ecrã do aparelho
    correr --force-device-scale-factor=1.5 --window-size=320,533 \
      --screenshot="$PWD/$pasta/$nome.png" "file://$INDEX#so=$id&lingua=$lingua"
    titulo=$(grep -o "data-ecra=\"$id\"[^>]*data-nome=\"[^\"]*\"" "$INDEX" | sed 's/.*data-nome="\([^"]*\)"/\1/')
    [ "$lingua" = en ] && titulo=$(titulo_en "$titulo")
    echo "  $pasta/$nome.png"
    paginas+="<section><h1>$titulo · PDA 320×533</h1><img src=\"$pasta/$nome.png\" alt=\"$titulo\"></section>"
  done <<< "$ECRAS"

  correr --no-pdf-header-footer --print-to-pdf="$PWD/01-ecras$sufixo.pdf" "file://$INDEX#so=todos&lingua=$lingua"
  echo "  01-ecras$sufixo.pdf ($(pdfinfo "01-ecras$sufixo.pdf" 2>/dev/null | awk '/^Pages/{print $2}') páginas)"

  cat > .titulos.html <<H
<!doctype html><meta charset="utf-8">
<style>
@page{size:1200px 900px;margin:0}
body{margin:0;font-family:Roboto,"DejaVu Sans",Arial,sans-serif}
section{width:1200px;height:900px;display:flex;flex-direction:column;align-items:center;break-after:page;background:#fff}
h1{font-weight:400;font-size:24px;letter-spacing:.04em;color:#444;margin:28px 0 22px}
img{height:780px;border:1px solid #e3e5e8}
</style>
$paginas
H
  correr --no-pdf-header-footer --print-to-pdf="$PWD/02-ecras-com-titulo$sufixo.pdf" "file://$PWD/.titulos.html"
  rm -f .titulos.html
  echo "  02-ecras-com-titulo$sufixo.pdf"

  # 04-casos-de-uso: um caso de uso por página, com os ecrãs em que acontece.
  # Só em português: é para ler na Romafe, e ela pediu-o assim (24 set.).
  if [ "$lingua" = pt ]; then
    node casos.js pt "$pasta" > .casos.html
    correr --no-pdf-header-footer --print-to-pdf="$PWD/04-casos-de-uso.pdf" "file://$PWD/.casos.html"
    rm -f .casos.html
    echo "  04-casos-de-uso.pdf ($(pdfinfo 04-casos-de-uso.pdf 2>/dev/null | awk '/^Pages/{print $2}') páginas)"
  fi

  # O mapa mede-se a si próprio (fluxo.js escreve o @page); a janela da captura
  # tem de ter esse tamanho, senão o PNG corta ou sobra.
  # 03-fluxo: todos os ecrãs; 03-fluxo-arrumacao: só os que a arrumação vê
  local funcao nome url medida
  for funcao in todas arrumacao; do
    nome=03-fluxo; [ "$funcao" = todas ] || nome=03-fluxo-$funcao
    url="file://$INDEX#so=fluxo&funcao=$funcao&lingua=$lingua"
    medida=$("$CH" --no-sandbox --disable-gpu --virtual-time-budget=5000 --window-size=6000,6000 --dump-dom "$url" 2>/dev/null \
      | grep -o 'size: [0-9]*px [0-9]*px' | head -1 | tr -dc '0-9 ' | awk '{print $1","$2}')
    correr --window-size="$medida" --screenshot="$PWD/$nome$sufixo.png" "$url"
    correr --no-pdf-header-footer --print-to-pdf="$PWD/$nome$sufixo.pdf" "$url"
    echo "  $nome$sufixo.png ($medida) e $nome$sufixo.pdf"
  done
}

gerar pt ecras ""
gerar en ecras-en "-en"

# ---------- o ícone ----------
# Os SVG saem de icone.py; aqui só se passam a PNG. O inteiro para a loja
# (512 e 1024); o símbolo para o launcher do Android, nas densidades do mipmap.
python3 icone.py >/dev/null
mkdir -p icone
rm -f icone/*.png
png() {  # svg tamanho destino
  printf '<body style="margin:0;background:transparent"><img src="file://%s" width="%s" height="%s" style="display:block">' "$WEB/assets/img/$1" "$2" "$2" > .icone.html
  correr --window-size="$2,$2" --default-background-color=00000000 --screenshot="$PWD/icone/$3" "file://$PWD/.icone.html"
  echo "  icone/$3"
}
png icone-app.svg 1024 icone-app-1024.png
png icone-app.svg 512 icone-app-512.png
for par in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  png simbolo-app.svg "${par#*:}" "simbolo-${par%%:*}-${par#*:}.png"
done
rm -f .icone.html
