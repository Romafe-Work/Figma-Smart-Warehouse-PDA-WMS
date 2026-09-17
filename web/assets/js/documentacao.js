/* =========================================================
   ARMAZÉM INTELIGENTE — página de documentação
   Constrói as grelhas a partir dos tokens, lidos ao navegador:
   o que se vê é o que está em tokens.css, e não uma cópia.
   ========================================================= */
(function () {
  'use strict';

  var CORES = {
    marca: [
      ['--c-acento', 'Cabeçalhos, ligações, seleção'],
      ['--c-acao', 'O botão principal — um por ecrã'],
      ['--c-acao-premido', 'O botão principal carregado'],
      ['--c-cinzento', 'Separadores, molduras'],
      ['--c-invertido', 'Faixas e barras']
    ],
    superficie: [
      ['--c-fundo', 'Fundo do ecrã'],
      ['--c-cartao', 'Cartões, barras, botões neutros'],
      ['--c-texto', 'Texto'],
      ['--c-texto-2', 'Texto secundário'],
      ['--c-texto-3', 'Texto ténue'],
      ['--c-sobre-marca', 'Texto sobre a marca']
    ],
    estado: [
      ['--c-bom', 'Bom'], ['--c-bom-suave', 'Fundo bom'],
      ['--c-aviso', 'Aviso'], ['--c-aviso-suave', 'Fundo aviso'],
      ['--c-serio', 'Sério'],
      ['--c-erro', 'Erro'], ['--c-erro-suave', 'Fundo erro'],
      ['--c-neutro', 'Neutro'], ['--c-neutro-suave', 'Fundo neutro']
    ]
  };

  var TAMANHOS = [
    ['--t-micro', 'Etiquetas de canto'], ['--t-tiny', 'Legendas'], ['--t-small', 'Texto secundário'],
    ['--t-body', 'Texto corrente'], ['--t-lead', 'Primeira linha de um cartão'], ['--t-big', 'Títulos de secção'],
    ['--t-huge', 'Números do relatório'], ['--t-giant', 'A ordem do passo'], ['--t-colossal', 'O código de posição']
  ];
  var ESPACOS = ['--e-xs', '--e-sm', '--e-md', '--e-lg', '--e-xl', '--e-xxl'];

  function valor(t) { return getComputedStyle(document.documentElement).getPropertyValue(t).trim(); }
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  Object.keys(CORES).forEach(function (grupo) {
    var alvo = document.querySelector('[data-cores="' + grupo + '"]');
    if (!alvo) return;
    CORES[grupo].forEach(function (par) {
      var b = el('button', 'cor');
      b.type = 'button';
      b.title = 'Copiar ' + par[0];
      var amostra = el('span', 'cor__amostra');
      amostra.style.background = 'var(' + par[0] + ')';
      var texto = el('span', 'cor__texto');
      texto.appendChild(el('span', 'cor__nome', par[0]));
      texto.appendChild(el('span', 'cor__valor', valor(par[0])));
      texto.appendChild(el('span', 'cor__uso', par[1]));
      b.appendChild(amostra); b.appendChild(texto);
      b.addEventListener('click', function () {
        if (navigator.clipboard) navigator.clipboard.writeText('var(' + par[0] + ')');
      });
      alvo.appendChild(b);
    });
  });

  var tipos = document.querySelector('[data-escala="tipo"]');
  if (tipos) TAMANHOS.forEach(function (par) {
    var linha = el('div', 'degrau');
    linha.appendChild(el('span', 'degrau__nome', par[0] + ' · ' + valor(par[0])));
    var amostra = el('span', 'degrau__amostra', par[1]);
    amostra.style.fontSize = 'var(' + par[0] + ')';
    linha.appendChild(amostra);
    tipos.appendChild(linha);
  });

  var espacos = document.querySelector('[data-escala="espaco"]');
  if (espacos) ESPACOS.forEach(function (t) {
    var linha = el('div', 'degrau');
    linha.appendChild(el('span', 'degrau__nome', t + ' · ' + valor(t)));
    var barra = el('span', 'degrau__barra');
    barra.style.width = 'calc(var(' + t + ') * 4)';
    linha.appendChild(barra);
    espacos.appendChild(linha);
  });
})();
