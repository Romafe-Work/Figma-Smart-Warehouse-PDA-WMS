/* =========================================================
   ARMAZÉM INTELIGENTE — que ecrã se vê

   Corre antes do editor, no fim do corpo, para o ecrã certo já estar à
   vista quando o editor monta o seletor e as camadas.

   Duas maneiras de abrir a página:
     web/index.html           a tela, no último ecrã em que se esteve
     web/index.html#so=a2     só o aparelho, sem editor nem moldura —
                              é o que importar/gerar.sh fotografa
     web/index.html#so=todos  os ecrãs todos seguidos, um por página ao
                              imprimir — é o PDF de importar/
     web/index.html#so=fluxo  o mapa de navegação, que monta o fluxo.js
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'pda:editor:ecra';

  function existe(id) {
    return !!(id && document.querySelector('.ecra[data-ecra="' + id + '"]'));
  }

  function mostrar(id) {
    var ecras = document.querySelectorAll('.ecra');
    for (var i = 0; i < ecras.length; i++) ecras[i].hidden = ecras[i].dataset.ecra !== id;
  }

  function lembrar(id) {
    try { localStorage.setItem(CHAVE, id); } catch (e) {}
  }

  var so = (location.hash.match(/so=([a-z0-9]+)/) || [])[1];

  /* Ao imprimir, cada ecrã é uma página do tamanho do aparelho. É o que faz
     do PDF uma coisa que o Figma e o Canva abrem em peças. */
  function paginaDoAparelho() {
    var st = document.createElement('style');
    st.textContent = '@page { size: 320px 533px; margin: 0 }';
    document.head.appendChild(st);
  }

  if (so === 'fluxo') {
    // o fluxo.js arruma os ecrãs e dá à página o tamanho do mapa
  } else if (so === 'todos') {
    document.body.classList.add('so-ecra', 'so-ecra--todos');
    // o ícone não é um ecrã do aparelho, e não entra no PDF dos ecrãs
    var todos = document.querySelectorAll('.ecra:not(.ecra--marca)');
    for (var i = 0; i < todos.length; i++) todos[i].hidden = false;
    paginaDoAparelho();
  } else if (existe(so)) {
    mostrar(so);
    document.body.classList.add('so-ecra');
    paginaDoAparelho();
  } else {
    var guardado = null;
    try { guardado = localStorage.getItem(CHAVE); } catch (e) {}
    if (existe(guardado)) mostrar(guardado);
  }

  /* Por cima do aparelho, na aba dos ecrãs: de que fluxo é o ecrã, o que é
     esse fluxo, e para que serve o ecrã. O texto vem do data-objetivo e do
     <template id="fluxos">, os mesmos que o mapa do Fluxo mostra. Nas
     capturas (#so=…) não aparece: o PNG é só o aparelho. */
  if (!so) {
    var fluxos = document.getElementById('fluxos');
    var ecrasTodos = document.querySelectorAll('.ecra:not(.ecra--marca)');
    for (var k = 0; k < ecrasTodos.length; k++) {
      var e = ecrasTodos[k];
      var desc = null;
      if (fluxos) {
        var ps = fluxos.content.querySelectorAll('p');
        for (var q = 0; q < ps.length; q++) if (ps[q].dataset.fluxo === e.dataset.fluxo) desc = ps[q].textContent;
      }
      var caixa = document.createElement('div');
      caixa.className = 'ecra__contexto';
      caixa.innerHTML =
        '<p class="ecra__contexto-fluxo"><span class="ecra__contexto-rotulo">Fluxo</span><b></b></p>' +
        (desc ? '<p class="ecra__contexto-descricao"></p>' : '') +
        '<p class="ecra__contexto-nome"></p>' +
        (e.dataset.objetivo ? '<p class="ecra__contexto-objetivo"><span class="ecra__contexto-rotulo">Objetivo</span><span></span></p>' : '');
      caixa.querySelector('.ecra__contexto-fluxo b').textContent = e.dataset.fluxo || '';
      if (desc) caixa.querySelector('.ecra__contexto-descricao').textContent = desc;
      caixa.querySelector('.ecra__contexto-nome').textContent = e.dataset.nome || '';
      if (e.dataset.objetivo) caixa.querySelector('.ecra__contexto-objetivo span:last-child').textContent = e.dataset.objetivo;
      e.insertBefore(caixa, e.firstChild);
    }
  }

  window.PdaEcras = { soUm: so === 'todos' || so === 'fluxo' || existe(so), lembrar: lembrar };
})();
