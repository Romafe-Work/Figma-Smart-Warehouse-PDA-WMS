/* =========================================================
   ARMAZÉM INTELIGENTE — que ecrã se vê

   Corre antes do editor, no fim do corpo, para o ecrã certo já estar à
   vista quando o editor monta o seletor e as camadas.

   Duas maneiras de abrir a página:
     web/index.html           a tela, no último ecrã em que se esteve
     web/index.html#so=a2     só o aparelho, sem editor nem moldura —
                              é o que importar/gerar.sh fotografa
     web/index.html#so=todos  os dezanove seguidos, um por página ao
                              imprimir — é o PDF de importar/
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

  if (so === 'todos') {
    document.body.classList.add('so-ecra', 'so-ecra--todos');
    var todos = document.querySelectorAll('.ecra');
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

  window.PdaEcras = { soUm: so === 'todos' || existe(so), lembrar: lembrar };
})();
