/* =========================================================
   ARMAZÉM INTELIGENTE — os caminhos das páginas de resumo

   As páginas `web/resumo-*.html` têm, debaixo do título de cada caso, a
   linha do caminho: os ecrãs por onde ele passa. Escrevê-la à mão dá o que
   deu — números sem nome («32 › 33 › 34») e caminhos a começar a meio.

   Isto reescreve-as a partir do próprio `index.html`:

   * o nome vem do `data-nome` do ecrã, sempre inteiro;
   * o caminho é o do percurso, e vem **completo** — se o percurso começa a
     meio, procura-se o caminho mais curto desde o início da função até lá,
     pelos botões que existem, e junta-se à frente.

   Os casos casam pelo título: o `<h3>` da página tem de ser igual ao nome do
   percurso no `<template id="percursos">`. Se algum não casar, isto diz-o e
   não lhe toca.

     node caminhos.js            escreve
     node caminhos.js --ver      só mostra
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const WEB = path.join(__dirname, '..', 'web');
const html = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8');
const soVer = process.argv.includes('--ver');

/* ---------- os ecrãs e as setas entre eles ---------- */
const nome = {}, setas = {};
for (const m of html.matchAll(/<div class="ecra[^>]*>/g)) {
  const a = (n) => (m[0].match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
  if (!a('ecra') || !a('nome')) continue;
  nome[a('ecra')] = a('nome');
}
for (const bloco of html.split(/(?=<div class="ecra[ "])/)) {
  const id = (bloco.match(/data-ecra="([^"]+)"/) || [])[1];
  if (!id) continue;
  setas[id] = [...new Set([...bloco.matchAll(/data-ir="([^"]+)"/g)].map((x) => x[1]))];
}

/* Os ecrãs de exceção não servem para lá chegar: passar pelo «Sair» para
   alcançar uma paragem é um caminho que existe no mapa e não existe na vida. */
const desvio = {}, ehMenu = {};
for (const bloco of html.split(/(?=<div class="ecra[ "])/)) {
  const id = (bloco.match(/data-ecra="([^"]+)"/) || [])[1];
  if (!id) continue;
  const fluxo = (bloco.match(/data-fluxo="([^"]*)"/) || [])[1] || '';
  const n = (bloco.match(/data-nome="([^"]*)"/) || [])[1] || '';
  desvio[id] = /não corre bem/.test(fluxo) || /^\d+ · Sair/.test(n);
  /* Um menu é um princípio: nunca se lhe põe nada à frente. */
  ehMenu[id] = /<div class="pda menu">/.test(bloco);
}

/* ---------- o caminho mais curto entre dois ecrãs ---------- */
function ate(origem, destino, proibidos) {
  if (origem === destino) return [origem];
  const visto = { [origem]: null };
  const fila = [origem];
  while (fila.length) {
    const aqui = fila.shift();
    for (const ali of setas[aqui] || []) {
      if (ali in visto) continue;
      if (ali !== destino && (desvio[ali] || (proibidos && proibidos.has(ali)))) continue;
      visto[ali] = aqui;
      if (ali === destino) {
        const caminho = [];
        for (let p = ali; p !== null; p = visto[p]) caminho.unshift(p);
        return caminho;
      }
      fila.push(ali);
    }
  }
  return null;
}

/* ---------- os percursos ---------- */
const INICIO = { arrumacao: 'e2', separacao: 'sp0', expedicao: 'xp0', gestor: 'gp0' };
const percursos = [];
const t = html.slice(html.indexOf('<template id="percursos">'));
for (const m of t.slice(0, t.indexOf('</template>')).matchAll(/<p ([^>]*?)>(.*?)<\/p>/gs)) {
  const a = (n) => (m[1].match(new RegExp('data-' + n + '="([^"]*)"')) || [])[1] || '';
  percursos.push({ funcao: a('funcao'), ecras: a('ecras').split(/\s+/).filter(Boolean), titulo: m[2], nota: a('nota') });
}

/* O caminho completo: o percurso, e à frente o que falta desde o início da
   função. Um percurso que já comece no início fica como está. */
function completo(p) {
  const inicio = INICIO[p.funcao];
  let ecras = p.ecras;
  if (inicio && ecras[0] !== inicio) {
    /* Primeiro pela linha principal — o turno normal daquela função —, que é
       o caminho que a pessoa faz de facto. Só se o ecrã não estiver lá é que
       se procura outro, sem passar pelas exceções nem por ecrãs do próprio
       percurso, para não andar em círculos. */
    const normal = percursos.find((x) => x.funcao === p.funcao && x.titulo === 'Um turno normal');
    const i = normal ? normal.ecras.indexOf(ecras[0]) : -1;
    if (i > 0) {
      ecras = normal.ecras.slice(0, i).concat(ecras);
    } else {
      const antes = ate(inicio, ecras[0], new Set(ecras.slice(1)));
      if (antes) ecras = antes.slice(0, -1).concat(ecras);
      else if (!desvio[ecras[0]] && !ehMenu[ecras[0]] && ecras[0] !== 't1') {
        /* Não há botão que lá chegue, e não é engano: a tarefa vem do motor.
           O caminho diz isso em vez de começar a meio, sem explicação. */
        return [nome[inicio], 'o motor dá a tarefa']
          .concat(ecras.map((id) => nome[id] || id)).join(' › ');
      }
    }
  }
  return ecras.map((id) => nome[id] || id).join(' › ');
}

/* ---------- reescrever as páginas ----------
   A lista de casos de cada página passa a ser a lista de percursos daquela
   função, toda e pela mesma ordem. O texto que já lá estava escrito à mão
   fica: só o caminho é que se refaz, e os casos que faltavam entram com a
   frase do percurso. */
const PAGINAS = { 'resumo-arrumacao.html': 'arrumacao', 'resumo-separacao.html': 'separacao',
                  'resumo-expedicao.html': 'expedicao', 'resumo-gestor.html': 'gestor' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const desescapar = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

for (const [ficheiro, funcao] of Object.entries(PAGINAS)) {
  const caminho = path.join(WEB, ficheiro);
  let pagina = fs.readFileSync(caminho, 'utf8');
  /* Só a lista dos casos: as regras, na mesma página, usam a classe
     «regras» precisamente para isto não se enganar outra vez. */
  const lista = pagina.match(/<ol class="casos" id="lista-casos">[\s\S]*?<\/ol>/);
  if (!lista) { console.log('  sem lista de casos: ' + ficheiro); continue; }

  /* o que já estava escrito, por título */
  const escrito = {};
  for (const m of lista[0].matchAll(/<h3>([^<]*)<\/h3>[\s\S]*?<p class="caminho">[^<]*<\/p>\s*([\s\S]*?)\s*<\/li>/g)) {
    escrito[m[1]] = m[2].trim();
  }

  const meus = percursos.filter((p) => p.funcao === funcao);
  const itens = meus.map((p) => {
    const texto = escrito[p.titulo] || '<p>' + esc(desescapar(p.nota)) + '</p>';
    return '        <li>\n' +
           '          <h3>' + p.titulo + '</h3>\n' +
           '          <p class="caminho">' + esc(completo(p)) + '</p>\n' +
           '          ' + texto + '\n' +
           '        </li>';
  });
  const novos = meus.filter((p) => !escrito[p.titulo]).map((p) => p.titulo);
  const fora = Object.keys(escrito).filter((t) => !meus.some((p) => p.titulo === t));

  pagina = pagina.replace(lista[0], '<ol class="casos" id="lista-casos">\n' + itens.join('\n') + '\n      </ol>');
  /* o título da secção conta os casos */
  pagina = pagina.replace(/<h2>Os (nove|sete|catorze|\d+) casos[^<]*<\/h2>/,
    '<h2>Os ' + meus.length + ' casos</h2>');
  pagina = pagina.replace(/<h2>Os casos do gestor<\/h2>/, '<h2>Os ' + meus.length + ' casos</h2>');
  if (!soVer) fs.writeFileSync(caminho, pagina);
  console.log('  ' + ficheiro + ': ' + meus.length + ' casos' +
    (novos.length ? ' · entraram: ' + novos.join(', ') : '') +
    (fora.length ? ' · sem percurso (saíram): ' + fora.join(', ') : ''));
}
