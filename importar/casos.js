/* =========================================================
   ARMAZÉM INTELIGENTE — os casos de uso com os ecrãs

   Escreve o HTML que o gerar.sh manda imprimir para
   `04-casos-de-uso.pdf`: uma página por caso de uso, com quem o faz, a
   decisão que ficou escrita, e os ecrãs em que ele acontece.

   A ligação caso → ecrãs é o `data-refs` de cada ecrã (CU-07 · RF-33 …),
   e os ficheiros são os mesmos PNG que o gerar.sh acabou de tirar. Nada
   se escreve à mão aqui: muda-se o ecrã ou o caso no index.html e volta-se
   a correr.

     node casos.js pt ecras  > .casos.html
     node casos.js en ecras-en > .casos-en.html
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const lingua = process.argv[2] || 'pt';
const pasta = process.argv[3] || 'ecras';
const WEB = path.join(__dirname, '..', 'web');
const html = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8');

/* ---------- o inglês: o mesmo dicionário do ecrã ---------- */
let EN = {};
if (lingua === 'en') {
  const src = fs.readFileSync(path.join(WEB, 'assets/js/traducao.js'), 'utf8');
  const i = src.indexOf('var EN = {');
  EN = eval('(' + src.slice(i + 9, src.indexOf('\n  };', i) + 4) + ')');
}
const t = (s) => (lingua === 'en' && EN[s]) || s;
/* «10 · Lê o artigo» traduz-se pela parte depois do número */
const tNome = (s) => {
  const p = s.split(' · ');
  return p.length > 1 ? p[0] + ' · ' + t(p.slice(1).join(' · ')) : t(s);
};

/* ---------- os ficheiros: id do ecrã → NN-nome.png ---------- */
const ficheiro = {};
fs.readFileSync(path.join(__dirname, 'gerar.sh'), 'utf8')
  .split('\n').filter((l) => /^[a-z0-9]+\|[0-9]/.test(l))
  .forEach((l) => { const [id, nome] = l.split('|'); ficheiro[id] = nome; });

/* ---------- os ecrãs ---------- */
const ecras = [];
const reEcra = /<div class="ecra[ "][^>]*data-ecra="([^"]+)"[^>]*>/g;
for (const m of html.matchAll(/<div class="ecra[^>]*>/g)) {
  const a = (n) => (m[0].match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
  if (!a('ecra') || !a('nome')) continue;
  ecras.push({ id: a('ecra'), nome: a('nome'), objetivo: a('objetivo'), refs: a('refs') });
}

/* ---------- os casos de uso ---------- */
const bloco = html.slice(html.indexOf('<template id="casos-de-uso">'));
const casos = [];
for (const m of bloco.slice(0, bloco.indexOf('</template>')).matchAll(/<p ([^>]*)>([^<]*)<\/p>/g)) {
  const a = (n) => (m[1].match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
  casos.push({
    id: a('cu'), nome: m[2], estado: a('estado'), nota: a('nota'),
    atores: a('atores').split(/\s+/).filter(Boolean),
    ecras: ecras.filter((e) => e.refs.split(' · ').includes(a('cu'))),
  });
}

const NOME_ATOR = { arrumacao: 'Arrumação', separacao: 'Separação', expedicao: 'Expedição',
                    gestor: 'Gestor', motor: 'Motor', todas: 'Todas as funções' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- a folha ----------
   Por função, na ordem em que o armazém trabalha: arrumação, separação,
   expedição, gestor. Depois os transversais, e no fim os que ficaram de
   fora. Dentro de cada grupo, pelo número do caso. A função é a primeira
   dos atores (o motor não conta), como no mapa. */
const AREAS = ['arrumacao', 'separacao', 'expedicao', 'gestor', 'todas', 'fora'];
const areaDe = (c) => c.estado ? 'fora'
  : (c.atores.filter((a) => a !== 'motor' && a !== 'todas')[0] || 'todas');
casos.sort((a, b) => (AREAS.indexOf(areaDe(a)) - AREAS.indexOf(areaDe(b)))
  || ((parseInt(a.id.slice(3), 10) || 0) - (parseInt(b.id.slice(3), 10) || 0)));

/* A página é fixa (1200 × 900). Até 12 ecrãs cabem numa; daí para cima o
   caso continua na página seguinte, para as miniaturas ficarem legíveis. */
const POR_PAGINA = 12;
function folhas(c) {
  const p = [];
  for (let i = 0; i < c.ecras.length; i += POR_PAGINA) p.push(c.ecras.slice(i, i + POR_PAGINA));
  return p.length ? p : [[]];
}
function medida(ecras, temNota) {
  const n = ecras.length;
  const linhas = n <= 6 ? 1 : 2;
  const porLinha = Math.ceil(n / linhas);
  const largura = (1200 - 96 - 20 * (porLinha - 1)) / porLinha;
  const espaco = (900 - 80 - 120 - (temNota ? 60 : 0) - 28 * linhas - 20 * (linhas - 1)) / linhas;
  return Math.floor(Math.min(largura * 800 / 480, espaco));
}

let paginas = casos.map((c) => folhas(c).map((ecras, i, todas) => `
<section>
  <header class="cabeca">
    <h1>${esc(c.id)} · ${esc(t(c.nome))}${todas.length > 1 ? ` (${i + 1}/${todas.length})` : ''}</h1>
    <p class="atores">${c.atores.map((x) => `<span>${esc(t(NOME_ATOR[x] || x))}</span>`).join('')}${
      c.estado ? `<span class="fora">${esc(t(c.estado === 'v2' ? 'v2' : 'Fora da v1'))}</span>` : ''}</p>
  </header>
  ${c.nota && i === 0 ? `<p class="nota">${esc(t(c.nota))}</p>` : ''}
  <div class="ecras">
    ${ecras.length ? '' : `<p class="sem">${esc(t(c.estado === 'v2'
      ? 'Não tem ecrã: fica para a v2.'
      : c.estado
        ? 'Não tem ecrã: ficou de fora da v1.'
        : 'Ainda não tem ecrã desenhado.'))}</p>`}
    ${ecras.map((e) => `<figure style="width:${Math.round(medida(ecras, c.nota && i === 0) * 480 / 800)}px">
      <img src="${pasta}/${ficheiro[e.id]}.png" alt="${esc(tNome(e.nome))}" style="height:${medida(ecras, c.nota && i === 0)}px">
      <figcaption>${esc(tNome(e.nome))}</figcaption>
    </figure>`).join('')}
  </div>
</section>`).join('')).join('');



process.stdout.write(`<!doctype html><meta charset="utf-8">
<title>${esc(t('Casos de uso e ecrãs'))}</title>
<style>
@page { size: 1200px 900px; margin: 0 }
body { margin: 0; font-family: Roboto, "DejaVu Sans", Arial, sans-serif; color: #17212e }
section { width: 1200px; height: 900px; box-sizing: border-box; padding: 40px 48px;
          break-after: page; background: #fff; display: flex; flex-direction: column;
          overflow: hidden }
.cabeca { border-bottom: 2px solid #00537e; padding-bottom: 12px }
h1 { font-size: 30px; font-weight: 700; margin: 0 0 8px; color: #00537e }
.atores { margin: 0; display: flex; gap: 8px; flex-wrap: wrap }
.atores span { font-size: 14px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
               background: #eaf1f6; color: #00537e; border-radius: 999px; padding: 4px 12px }
.atores .fora { background: #fdeceb; color: #a4201a }
.nota { margin: 16px 0 0; font-size: 17px; line-height: 1.5; color: #3a3b3d; max-width: 95ch }
.ecras { flex: 1; display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;
         align-content: flex-start; padding-top: 20px; overflow: hidden }
figure { margin: 0; text-align: center }
img { width: 100% }
img { border: 1px solid #e3e5e8; display: block }
figcaption { font-size: 13px; color: #6b6e74; margin-top: 6px }
.sem { margin: 0; font-size: 17px; color: #6b6e74; font-style: italic }
</style>
${paginas}
`);
