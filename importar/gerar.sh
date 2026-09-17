#!/usr/bin/env bash
# =========================================================
# ARMAZÉM INTELIGENTE — gerar o que se importa
#
# Tudo sai de web/index.html. Mudar um token ou um ecrã lá e voltar a
# correr isto: não há um segundo desenho para manter à mão.
#
#   ecras/NN-nome.png         cada ecrã a 480 × 800 px, o tamanho real do EDA61K
#   01-ecras.pdf              os 19 ecrãs, uma página de 320 × 533 cada, em vetor
#   02-ecras-com-titulo.pdf   os 19 com o nome por cima, para ler e mostrar
# =========================================================
set -euo pipefail
cd "$(dirname "$0")"
CH=$(ls ~/.cache/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell | head -1)
INDEX="$(cd ../web && pwd)/index.html"

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

mkdir -p ecras
rm -f ecras/*.png
PAGINAS=""
while IFS='|' read -r id nome; do
  # 1,5 × 320 × 533 = 480 × 800: os píxeis do ecrã do aparelho
  correr --force-device-scale-factor=1.5 --window-size=320,533 \
    --screenshot="$PWD/ecras/$nome.png" "file://$INDEX#so=$id"
  titulo=$(grep -o "data-ecra=\"$id\"[^>]*data-nome=\"[^\"]*\"" "$INDEX" | sed 's/.*data-nome="\([^"]*\)"/\1/')
  echo "  ecras/$nome.png"
  PAGINAS+="<section><h1>$titulo · PDA 320×533</h1><img src=\"ecras/$nome.png\" alt=\"$titulo\"></section>"
done <<< "$ECRAS"

correr --no-pdf-header-footer --print-to-pdf="$PWD/01-ecras.pdf" "file://$INDEX#so=todos"
echo "  01-ecras.pdf ($(pdfinfo 01-ecras.pdf 2>/dev/null | awk '/^Pages/{print $2}') páginas)"

cat > .titulos.html <<H
<!doctype html><meta charset="utf-8">
<style>
@page{size:1200px 900px;margin:0}
body{margin:0;font-family:Roboto,"DejaVu Sans",Arial,sans-serif}
section{width:1200px;height:900px;display:flex;flex-direction:column;align-items:center;break-after:page;background:#fff}
h1{font-weight:400;font-size:24px;letter-spacing:.04em;color:#444;margin:28px 0 22px}
img{height:780px;border:1px solid #e3e5e8}
</style>
$PAGINAS
H
correr --no-pdf-header-footer --print-to-pdf="$PWD/02-ecras-com-titulo.pdf" "file://$PWD/.titulos.html"
rm -f .titulos.html
echo "  02-ecras-com-titulo.pdf"
