#!/usr/bin/env bash
# =========================================================
# ARMAZÉM INTELIGENTE — gerar o que se importa
#
# Tudo sai de web/index.html. Mudar um token, um ecrã ou uma tradução lá e
# voltar a correr isto: não há um segundo desenho para manter à mão.
#
#   ecras/NN-nome.png            cada ecrã a 480 × 800 px, o tamanho real do EDA61K
#   ecras-en/NN-nome.png         o mesmo, em inglês
#   01-ecras.pdf                 os 19 ecrãs, uma página de 320 × 533 cada, em vetor
#   01-ecras-en.pdf              o mesmo, em inglês
#   02-ecras-com-titulo.pdf      os 19 com o nome por cima, para ler e mostrar
#   02-ecras-com-titulo-en.pdf   o mesmo, em inglês
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
e2|02-menu-arrumacao
e3|03-fila-arrumacao
a1|04-arrumar-le-artigo
a2|05-arrumar-proposta-1
a3|06-arrumar-proposta-ocupada
a4|07-arrumar-le-posicao
a5|08-arrumar-concluida
s1|09-separacao-lote
s2|10-separacao-paragem
s3|11-separacao-falta-quantidade
s4|12-separacao-prateleira-preparados
x1|13-expedicao-camioes
x2|14-expedicao-conferir-volumes
x3|15-expedicao-levar-ao-cais
x4|16-expedicao-carregar
g1|17-gestor-relatorio
g2|18-excecao-o-que-se-passa
g3|19-sem-ligacao
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
