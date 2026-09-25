/* =========================================================
   ARMAZÉM INTELIGENTE — escrever nas páginas de resumo

   Duplo clique em qualquer texto e escreve-se por cima, como nos ecrãs. É a
   mesma ideia do editor (`editor.js`), reduzida ao que estas páginas
   precisam: sem camadas, sem propriedades, só o texto.

   ── ONDE É QUE ISTO FICA GUARDADO ───────────────────────────────────────────

   No `localStorage` do navegador de quem escreve, e mais lado nenhum. Na
   página publicada isso quer dizer: fica na máquina dela, não chega ao
   ficheiro nem a quem abrir o mesmo endereço. Por isso a barra tem o
   «Copiar o que mudei» — o texto sai dali e vai para o ficheiro à mão, que é
   o que o torna permanente.

   O seletor de cada texto é o caminho de posições desde o <main>. Se a página
   for reescrita, os que já não casarem são ignorados sem estragar nada.
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'pda:resumo:' + location.pathname.split('/').pop();
  var mudado = {};
  try { mudado = JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch (e) { mudado = {}; }

  var raiz = document.querySelector('.doc-conteudo');
  if (!raiz) return;

  /* ---------- o nome de cada texto ---------- */
  function seletor(no) {
    var partes = [];
    while (no && no !== raiz) {
      var pai = no.parentNode;
      if (!pai) return null;
      partes.unshift([].indexOf.call(pai.children, no));
      no = pai;
    }
    return partes.join('.');
  }
  function porSeletor(s) {
    var no = raiz;
    var passos = s.split('.');
    for (var i = 0; i < passos.length; i++) {
      no = no && no.children[+passos[i]];
      if (!no) return null;
    }
    return no;
  }

  /* ---------- as folhas: o que se pode escrever ---------- */
  function folha(no) {
    return no && no.nodeType === 1 && !no.querySelector('*') &&
           no.textContent.trim() && !no.closest('.barra-escrita');
  }

  /* ---------- repor o que já se tinha escrito ---------- */
  Object.keys(mudado).forEach(function (s) {
    var no = porSeletor(s);
    if (no) no.textContent = mudado[s];
  });

  /* ---------- escrever ---------- */
  document.addEventListener('dblclick', function (ev) {
    var no = ev.target;
    if (!folha(no)) return;
    var s = seletor(no);
    if (!s) return;
    var antes = no.textContent;
    no.setAttribute('contenteditable', 'true');
    no.focus();
    no.addEventListener('blur', function sair() {
      no.removeAttribute('contenteditable');
      no.removeEventListener('blur', sair);
      if (no.textContent === antes) return;
      mudado[s] = no.textContent;
      guardar();
    });
  });

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(mudado)); } catch (e) {}
    pintar();
  }

  /* ---------- a barra ---------- */
  var barra = document.createElement('div');
  barra.className = 'barra-escrita';
  var conta = document.createElement('span');
  conta.className = 'barra-escrita__conta';
  var copiar = document.createElement('button');
  copiar.type = 'button';
  copiar.className = 'barra-escrita__botao barra-escrita__botao--acao';
  copiar.textContent = 'Copiar o que mudei';
  var repor = document.createElement('button');
  repor.type = 'button';
  repor.className = 'barra-escrita__botao';
  repor.textContent = 'Repor';
  barra.appendChild(conta);
  barra.appendChild(copiar);
  barra.appendChild(repor);
  document.body.appendChild(barra);

  function pintar() {
    var n = Object.keys(mudado).length;
    barra.hidden = false;
    conta.textContent = n
      ? n + (n === 1 ? ' texto mudado' : ' textos mudados') + ' — só neste navegador'
      : 'Duplo clique num texto para escrever por cima';
    copiar.hidden = !n;
    repor.hidden = !n;
  }

  copiar.addEventListener('click', function () {
    var linhas = ['Alterações em ' + location.pathname.split('/').pop() + ':', ''];
    Object.keys(mudado).forEach(function (s) {
      var no = porSeletor(s);
      linhas.push('— ' + (no ? (no.tagName.toLowerCase() + (no.className ? '.' + no.className : '')) : s));
      linhas.push('  ' + mudado[s]);
      linhas.push('');
    });
    var texto = linhas.join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(texto);
    copiar.textContent = 'Copiado';
    window.setTimeout(function () { copiar.textContent = 'Copiar o que mudei'; }, 1600);
  });

  repor.addEventListener('click', function () {
    if (!window.confirm('Repor todos os textos como estavam?')) return;
    mudado = {};
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    location.reload();
  });

  pintar();
}());
