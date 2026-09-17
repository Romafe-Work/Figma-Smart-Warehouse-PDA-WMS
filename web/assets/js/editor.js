/* =========================================================
   ARMAZÉM INTELIGENTE — editor dos ecrãs do PDA
   Clicar numa peça e mudá-la no sítio, como numa tela de desenho.

   Veio do editor da entrada da ROMAFE (Figma-WebShop-GoParts) e muda
   só no que o PDA tem de diferente: os tokens, as peças e o facto de
   haver dezanove ecrãs ligados uns aos outros.

   A regra que manda: o editor só oferece o que o sistema de design tem.
   Não há selecionador de cor livre, não há caixa para escrever um
   número de folga. Escolhe-se um token, e o que sai é um token —
   por isso o CSS exportado nunca traz um valor inventado.
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'pda:editor:v1';
  var CHAVE_PAINEIS = 'pda:editor:paineis';

  /* ---------------- o que o sistema de design permite ----------------
     Tudo o que está nestas listas está em pda-docs/05-design/03. Os números
     entre parênteses nas dicas são as secções desse documento. */

  /* O laranja de ação não é tinta. Sobre branco dá 2,6:1, e um texto que só
     se lê de perto não serve num corredor. */
  var TINTAS = [
    ['--c-texto', 'Texto'],
    ['--c-texto-2', 'Texto secundário'],
    ['--c-texto-3', 'Texto ténue'],
    ['--c-acento', 'Acento'],
    ['--c-sobre-marca', 'Sobre a marca'],
    ['--c-bom', 'Bom'],
    ['--c-aviso', 'Aviso'],
    ['--c-serio', 'Sério'],
    ['--c-erro', 'Erro'],
    ['--c-neutro', 'Neutro']
  ];

  var FUNDOS = [
    ['--c-fundo', 'Fundo'],
    ['--c-cartao', 'Cartão'],
    ['--c-invertido', 'Invertido'],
    ['--c-acento', 'Acento'],
    ['--c-acao', 'Ação'],
    ['--c-acao-premido', 'Ação carregada'],
    ['--c-cinzento', 'Cinzento da marca'],
    ['--c-bom-suave', 'Bom suave'],
    ['--c-aviso-suave', 'Aviso suave'],
    ['--c-erro-suave', 'Erro suave'],
    ['--c-neutro-suave', 'Neutro suave']
  ];

  var TAMANHOS = ['--t-micro', '--t-tiny', '--t-small', '--t-body', '--t-lead',
                  '--t-big', '--t-huge', '--t-giant', '--t-colossal'];
  var PESOS    = [['400', 'Normal'], ['500', 'Médio'], ['700', 'Forte']];
  var RAIOS    = ['0', '--r-sm', '--r-md', '--r-lg', '--r-pill'];
  var FOLGAS   = ['0', '--e-xs', '--e-sm', '--e-md', '--e-lg', '--e-xl', '--e-xxl'];

  /* 03 §5 — a AcaoPrincipal é uma por ecrã. Trocar de variante troca a
     classe, e a cor e a altura vêm atrás. */
  var VARIANTES = [
    ['btn--acao',       'Ação principal (laranja, 62 dp)'],
    ['btn--secundario', 'Secundária (contorno azul, 48 dp)'],
    ['',                'Neutra (48 dp)']
  ];
  var CLASSES_VARIANTE = ['btn--acao', 'btn--secundario'];

  /* nomes legíveis para o painel de camadas */
  var NOMES = {
    'pda': 'Ecrã do PDA', 'faixa': 'Faixa', 'faixa__perfil': 'Perfil', 'faixa__nome': 'Nome',
    'faixa__rede': 'Rede', 'faixa__icone': 'Ícone', 'faixa__divisor': 'Divisor', 'faixa__ponto': 'Ponto', 'barra': 'Barra de topo', 'barra__titulo': 'Título', 'barra__sub': 'Subtítulo',
    'passos': 'Passos', 'passos__linha': 'Linha dos passos', 'passos__barra': 'Progresso',
    'passos__traco': 'Traço', 'corpo': 'Corpo', 'rodape': 'Rodapé', 'cartao': 'Cartão',
    'rotulo': 'Rótulo', 'selo': 'Selo', 'btn': 'Botão', 'par': 'Par de botões',
    'leitor': 'Leitor', 'leitor__icone': 'Ícone do leitor', 'alerta': 'Alerta', 'tarefa': 'Tarefa',
    'tarefa__titulo': 'Título da tarefa', 'tarefa__porque': 'Porquê', 'linha': 'Linha',
    'linha__valor': 'Valor', 'vazio': 'Vazio', 'folha': 'Folha', 'folha__caixa': 'Caixa da folha',
    'folha__opcao': 'Opção', 'ordem': 'Ordem', 'codigo': 'Código', 'marca-app': 'Marca',
    'campo': 'Campo', 'pin': 'PIN', 'teclado': 'Teclado', 'tecla': 'Tecla',
    'mosaicos': 'Menu', 'mosaico': 'Mosaico', 'saudacao': 'Saudação', 'saudacao__titulo': 'Título',
    'saudacao__sub': 'Subtítulo', 'seccao-menu': 'Secção', 'seccao-menu__cabeca': 'Cabeça da secção',
    'seccao-menu__titulo': 'Título da secção', 'seccao-menu__traco': 'Traço', 'seccao-menu__ver': 'Ver todas',
    'atalhos': 'Atalhos', 'atalho': 'Atalho', 'atalho__circulo': 'Círculo', 'atalho__texto': 'Texto',
    'atalho__nome': 'Nome', 'atalho__conta': 'Contagem', 'atalho__seta': 'Seta', 'navegacao': 'Navegação',
    'navegacao__botao': 'Botão', 'navegacao__contador': 'Contador', 'proposta': 'Proposta', 'camiao': 'Camião',
    'volumes': 'Volumes', 'volume': 'Volume', 'numeros': 'Números', 'numero': 'Número',
    'txt-lead': 'Texto de destaque', 'txt-corpo': 'Texto', 'txt-sec': 'Texto secundário',
    'txt-legenda': 'Legenda', 'entrar__foto': 'Fotografia', 'entrar__topo': 'Topo',
    'lockup': 'Marca ROMAFE', 'lockup__nome': 'ROMAFE', 'lockup__risco': 'Risco', 'lockup__sub': 'Subtítulo',
    'aparelho': 'Aparelho', 'aparelho__estado': 'Rede e bateria', 'entrar__boas-vindas': 'Boas-vindas',
    'entrar__titulo': 'Título', 'entrar__lema': 'Lema', 'entrar__risco': 'Risco laranja',
    'sessao': 'Cartão de sessão', 'sessao__titulo': 'Título', 'sessao__sub': 'Subtítulo',
    'entrada-texto': 'Campo', 'entrada-texto__rotulo': 'Rótulo', 'entrada-texto__caixa': 'Caixa',
    'entrada-texto__campo': 'Caixa de texto', 'entrada-texto__ver': 'Mostrar palavra-passe',
    'areas': 'Áreas', 'area': 'Área', 'versao': 'Versão',
    'icone-app': 'Ícone da app', 'icone-app__simbolo': 'Símbolo', 'icone-app__nome': 'Nome',
    'icone-app__sub': 'Subtítulo', 'icone-app__tamanhos': 'Tamanhos', 'icone-app__tamanho': 'Tamanho'
  };

  /* o texto de um botão diz mais do que a palavra "Botão" */
  function rotuloCurto(alvo) {
    var t = (alvo.textContent || '').trim().replace(/\s+/g, ' ');
    if (!t || t.length > 24) return '';
    return t;
  }

  /* ---------------- estado ---------------- */
  /* Como no Figma: o primeiro clique escolhe a peça inteira, e só o
     clique seguinte entra lá dentro. Sem isto, clicar num botão escolhia
     o texto do botão e a variante não aparecia. */
  var COMPONENTES = '.faixa, .barra, .passos, .cartao, .selo, .btn, .leitor, .alerta, .tarefa, ' +
    '.linha, .atalho, .navegacao__botao, .saudacao, .seccao-menu__cabeca, .lockup, .aparelho, .sessao, .entrada-texto, .area, .camiao, .volume, .numero, .vazio, .folha__opcao, .proposta';

  var estilos = {};   // seletor -> { propriedade: valor }
  var textos  = {};   // seletor -> texto
  var classes = {};   // seletor -> lista de classes (a variante do botão)
  var historico = [];
  /* O que a página era antes de o editor lhe tocar. Fica só em memória, e é
     apanhado antes de qualquer alteração, incluindo as que vêm guardadas do
     navegador — senão "repor tudo" repunha o estado guardado e não o original. */
  var originais = { textos: {}, classes: {} };

  function lembrar(tipo, sel, valor) {
    if (originais[tipo][sel] === undefined) originais[tipo][sel] = valor;
  }
  var seleccionado = null;
  var ligado = false;

  var folha, painelEsq, painelDir, listaCamadas, corpoProps, dialogo, avisoEl;

  /* ---------------- o que a peça já tem ----------------
     O painel abria em branco: as grelhas só marcavam o que TU tinhas mudado,
     e uma peça acabada de escolher não tinha nada mudado. Quem olhava não
     ficava a saber que tamanho, que peso ou que folga a peça tem — que é a
     primeira coisa que se quer saber ao clicar nela.

     Descobrir isso não se faz a ler o CSS: o valor vem de uma folha, de uma
     classe, de quem está por cima, e pode ser um `var()` que só o navegador
     sabe resolver. Pergunta-se ao navegador — põe-se uma sonda ao lado da peça,
     dá-se-lhe o valor da casa, e vê-se se o que sai é igual ao que a peça tem.

     A sonda vai para o PAI da peça e não para o corpo, porque os valores da
     casa mudam com o tema e o tema muda-os na raiz: ao lado da peça, o que a
     sonda lê é o que a peça leria. */

  var sonda = null;

  function porSonda(alvo) {
    if (!sonda) {
      sonda = document.createElement('span');
      sonda.setAttribute('aria-hidden', 'true');
      // `display:block` porque numa caixa em linha a largura não se computa, e
      // a grelha das medidas dos ícones ficava sem nada marcado.
      sonda.style.cssText = 'position:absolute;left:-9999px;top:0;display:block;' +
        'width:0;height:0;overflow:hidden;pointer-events:none';
    }
    (alvo.parentElement || document.body).appendChild(sonda);
    return sonda;
  }

  /**
   * Qual dos valores da lista é o que a peça mostra neste momento.
   *
   * Devolve o valor tal como entra no CSS — `var(--t-md)` ou `16px` — ou `null`
   * quando o que a peça tem não é nenhum deles. Isso acontece, e é informação:
   * quer dizer que aquela medida não saiu do manual.
   */
  function valorEmUso(alvo, propriedade, lista) {
    if (!alvo) return null;
    var tem = getComputedStyle(alvo).getPropertyValue(propriedade);
    if (!tem) return null;

    // A sonda entra e sai UMA vez por grelha, e não uma vez por valor. Com nove
    // folgas e treze cores, eram sessenta idas ao documento por cada peça
    // escolhida, e cada ida obriga o navegador a recalcular tudo outra vez.
    var s2 = porSonda(alvo);
    var achado = null;
    for (var i = 0; i < lista.length && achado === null; i++) {
      var v = valorToken(lista[i]);
      s2.style.setProperty(propriedade, v);
      if (getComputedStyle(s2).getPropertyValue(propriedade) === tem) achado = v;
      s2.style.removeProperty(propriedade);
    }
    s2.remove();
    return achado;
  }

  /* ---------------- utilitários ---------------- */

  /* A tradução é um extra: o editor tem de funcionar sem ela, e uma exceção
     lá dentro não pode deixar o painel das propriedades a meio. */
  function traduzirRamo(raiz) {
    if (!window.PdaTraducao || typeof window.PdaTraducao.traduzirRamo !== 'function') return;
    try {
      window.PdaTraducao.traduzirRamo(raiz);
    } catch (e) {
      if (window.console) console.warn('A tradução falhou neste ramo:', e);
    }
  }

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  function valorToken(v) {
    return v.indexOf('--') === 0 ? 'var(' + v + ')' : v;
  }

  function corDoToken(token) {
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || '#888';
  }

  /* O rótulo que segue o rato. Os quadrados de cor e os degraus de escala
     não dizem o que são; a etiqueta diz o nome, o token e o valor. */
  var dicaEl;
  function montarDica() {
    dicaEl = el('div', 'ed-dica-flutuante');
    dicaEl.setAttribute('role', 'tooltip');
    dicaEl.hidden = true;
    document.body.appendChild(dicaEl);

    document.addEventListener('mouseover', function (ev) {
      var alvo = ev.target.closest && ev.target.closest('[data-ed-dica]');
      if (!alvo) { dicaEl.hidden = true; return; }
      dicaEl.textContent = alvo.dataset.edDica;
      dicaEl.hidden = false;
      posicionar(alvo);
    }, true);

    document.addEventListener('mouseout', function (ev) {
      if (ev.target.closest && ev.target.closest('[data-ed-dica]')) dicaEl.hidden = true;
    }, true);
  }

  function posicionar(alvo) {
    var r = alvo.getBoundingClientRect();
    var l = dicaEl.getBoundingClientRect();
    var x = r.left + r.width / 2 - l.width / 2;
    var y = r.top - l.height - 8;
    if (y < 4) y = r.bottom + 8;
    dicaEl.style.left = Math.max(6, Math.min(x, window.innerWidth - l.width - 6)) + 'px';
    dicaEl.style.top = y + 'px';
  }

  function aviso(texto) {
    if (avisoEl) avisoEl.remove();
    avisoEl = el('p', 'ed-aviso', texto);
    avisoEl.setAttribute('role', 'status');
    document.body.appendChild(avisoEl);
    traduzirRamo(avisoEl);
    window.setTimeout(function () { if (avisoEl) { avisoEl.remove(); avisoEl = null; } }, 1800);
  }

  /* Um seletor estável para o elemento: id se houver, senão o caminho
     de classes até ao ecrã, com :nth-of-type só quando é preciso. */
  function ecraDe(alvo) {
    var e = alvo.closest ? alvo.closest('.ecra') : null;
    if (e) return e.dataset.ecra;
    var primeiro = document.querySelector('.ecra');
    return primeiro ? primeiro.dataset.ecra : '';
  }

  function seletor(alvo) {
    var ambito = '[data-ecra="' + ecraDe(alvo) + '"] ';
    if (alvo.id) return ambito + '#' + alvo.id;

    var partes = [];
    var n = alvo;
    while (n && n !== document.body) {
      var parte = n.tagName.toLowerCase();
      /* num <svg>, className é um SVGAnimatedString e não uma string:
         lê-se o atributo, senão o seletor sai com "[object SVGAnimatedString]" */
      var classes = (n.getAttribute('class') || '').split(/\s+/)
        .filter(function (c) { return c && c.indexOf('ed-') !== 0 && c !== 'editando'; })
        .slice(0, 2);
      if (classes.length) parte += '.' + classes.join('.');

      /* Irmãos com o mesmo nome e as mesmas classes — três painéis
         iguais, três vantagens iguais — precisam da posição, senão a
         regra exportada apanha os três. */
      var pai = n.parentElement;
      if (pai) {
        var atual = n;
        var iguais = Array.prototype.filter.call(pai.children, function (f) {
          if (f.tagName !== atual.tagName) return false;
          if (!classes.length) return true;
          return classes.every(function (c) { return f.classList.contains(c); });
        });
        if (iguais.length > 1) parte += ':nth-of-type(' + (iguais.indexOf(n) + 1) + ')';
      }
      partes.unshift(parte);

      if (n.id) { partes[0] = '#' + n.id; break; }
      if (n.classList && n.classList.contains('ecra')) { partes.shift(); break; }
      n = pai;
    }

    var s = ambito + partes.join(' > ');
    // se ainda apanhar mais do que um, desempata pela posição
    try {
      if (document.querySelectorAll(s).length > 1) {
        var pai2 = alvo.parentElement;
        var irmaos = Array.prototype.filter.call(pai2.children, function (f) { return f.tagName === alvo.tagName; });
        s += ':nth-of-type(' + (irmaos.indexOf(alvo) + 1) + ')';
      }
    } catch (e) {}
    return s;
  }

  function nomeDe(alvo) {
    if (alvo.dataset.edNome) return alvo.dataset.edNome;

    var classes = (alvo.getAttribute('class') || '').split(/\s+/);
    var base = '';
    for (var i = 0; i < classes.length && !base; i++) {
      var c = classes[i];
      if (NOMES[c]) base = NOMES[c];
      else {
        var raiz = c.split('__')[0].split('--')[0];
        if (NOMES[raiz]) base = NOMES[raiz] + (c.indexOf('__') > 0 ? ' · ' + c.split('__')[1] : '');
      }
    }

    if (!base) {
      if (alvo.tagName === 'svg') base = 'Ícone';
      else if (alvo.tagName === 'INPUT') base = 'Caixa de texto';
      else if (alvo.tagName === 'SELECT') base = 'Seleção';
      else if (alvo.tagName === 'BUTTON') base = 'Botão';
      else if (/^H[1-4]$/.test(alvo.tagName)) base = 'Título';
      else if (alvo.tagName === 'LABEL') base = 'Etiqueta';
    }

    var curto = rotuloCurto(alvo);
    if (!base) return curto || alvo.tagName.toLowerCase();
    if (curto && (alvo.tagName === 'BUTTON' || alvo.tagName === 'A' || alvo.children.length === 0)) {
      return base + ' · ' + curto;
    }
    return base;
  }

  /* ---------------- aplicar e guardar ---------------- */
  function escrever() {
    var linhas = [];
    Object.keys(estilos).forEach(function (s) {
      var props = estilos[s];
      var corpo = Object.keys(props).map(function (p) { return '  ' + p + ': ' + props[p] + ';'; });
      if (corpo.length) linhas.push('.editando ' + s + ',\n' + s + ' {\n' + corpo.join('\n') + '\n}');
    });
    folha.textContent = linhas.join('\n\n');
    guardar();
  }

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify({ estilos: estilos, textos: textos, classes: classes })); } catch (e) {}
  }

  function carregar() {
    /* PRIMEIRO as peças, depois os estilos. Uma regra guardada para uma peça
       que ainda não existe não se aplica a nada, e a peça voltava sem a cor
       que alguém lhe tinha dado. */
    if (window.PdaPecas) window.PdaPecas.repor();

    try {
      var g = JSON.parse(localStorage.getItem(CHAVE) || '{}');
      estilos = g.estilos || {};
      textos  = g.textos  || {};
      classes = g.classes || {};
    } catch (e) { estilos = {}; textos = {}; classes = {}; }

    Object.keys(classes).forEach(function (s) {
      try {
        var n = document.querySelector(s);
        if (n) { lembrar('classes', s, n.getAttribute('class') || ''); n.className = classes[s]; }
      } catch (e) {}
    });

    Object.keys(textos).forEach(function (s) {
      try {
        var n = document.querySelector(s);
        if (n) { lembrar('textos', s, n.textContent); n.textContent = textos[s]; }
      } catch (e) {}
    });
    escrever();
  }

  function definir(alvo, propriedade, valor) {
    /* num ícone, mudar a largura sem mudar a altura deforma o desenho */
    if (propriedade === 'width' && alvo.tagName === 'svg') definir(alvo, 'height', valor);
    var s = seletor(alvo);
    if (!estilos[s]) estilos[s] = {};
    historico.push({ tipo: 'estilo', seletor: s, propriedade: propriedade, antes: estilos[s][propriedade] });
    if (valor === null) delete estilos[s][propriedade];
    else estilos[s][propriedade] = valor;
    escrever();
  }

  function anular() {
    var passo = historico.pop();
    if (!passo) { aviso('Não há nada para anular'); return; }

    if (passo.tipo === 'estilo') {
      if (!estilos[passo.seletor]) estilos[passo.seletor] = {};
      if (passo.antes === undefined) delete estilos[passo.seletor][passo.propriedade];
      else estilos[passo.seletor][passo.propriedade] = passo.antes;
      escrever();
    } else if (passo.tipo === 'texto') {
      var n = document.querySelector(passo.seletor);
      if (n) n.textContent = passo.antes;
      if (passo.antes === undefined) delete textos[passo.seletor];
      else textos[passo.seletor] = passo.antes;
      guardar();
    } else if (passo.tipo === 'classe') {
      var m = document.querySelector(passo.seletor);
      if (m) m.className = passo.antes;
      classes[passo.seletor] = passo.antes;
      guardar();
    }
    pintarProps();
    aviso('Anulado');
  }

  function reporTudo() {
    /* devolve o texto e as classes ao que eram */
    Object.keys(originais.textos).forEach(function (s) {
      try { var n = document.querySelector(s); if (n) n.textContent = originais.textos[s]; } catch (e) {}
    });
    Object.keys(originais.classes).forEach(function (s) {
      try { var n = document.querySelector(s); if (n) n.className = originais.classes[s]; } catch (e) {}
    });

    if (window.PdaPecas) window.PdaPecas.limpar();

    estilos = {}; textos = {}; classes = {};
    originais = { textos: {}, classes: {} };
    historico = [];
    try { localStorage.removeItem(CHAVE); } catch (e) {}

    escrever();
    seleccionar(null);
    construirCamadas();
    aviso('Voltou tudo ao original — texto, variantes e peças');
  }

  /* ---------------- mover ----------------
     A peça move-se com transform: translate, e não com margens ou com
     position. Assim nada à volta se desarruma, e o que sai no CSS é uma
     linha só que se pode copiar para o produto. */
  function lerPosicao(alvo) {
    var v = (estilos[seletor(alvo)] || {})['transform'] || '';
    var m = v.match(/translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 };
  }

  function mover(alvo, x, y) {
    if (!x && !y) definir(alvo, 'transform', null);
    else definir(alvo, 'transform', 'translate(' + Math.round(x) + 'px, ' + Math.round(y) + 'px)');
  }

  var arrasto = null, engoleClique = false, mudouNoMousedown = false;

  function comecarArrasto(ev) {
    if (!ligado || ev.button !== 0) return;
    if (ehMoldura(ev.target)) return;
    if (ev.target.getAttribute && ev.target.getAttribute('contenteditable') === 'true') return;
    if (ev.altKey && ev.target.closest('[data-ir]')) return;

    var alvo = candidata(ev.target);
    if (!alvo) return;

    /* O mousedown já escolhe. Se escolheu agora, o clique que vem a seguir
       não pode entrar dentro da peça: seria escolher e entrar no mesmo gesto. */
    mudouNoMousedown = alvo !== seleccionado;
    if (mudouNoMousedown) seleccionar(alvo);

    var base = lerPosicao(alvo);
    arrasto = { alvo: alvo, x0: ev.clientX, y0: ev.clientY, bx: base.x, by: base.y, moveu: false };
    ev.preventDefault();
  }

  function durante(ev) {
    if (!arrasto) return;
    var dx = ev.clientX - arrasto.x0, dy = ev.clientY - arrasto.y0;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) arrasto.moveu = true;
    /* enquanto se arrasta é estilo em linha: é mais rápido do que reescrever
       a folha a cada pixel, e no fim apaga-se */
    arrasto.alvo.style.transform = 'translate(' + (arrasto.bx + dx) + 'px, ' + (arrasto.by + dy) + 'px)';
  }

  function largar(ev) {
    if (!arrasto) return;
    var a = arrasto; arrasto = null;
    a.alvo.style.transform = '';
    if (!a.moveu) return;
    engoleClique = true;
    mover(a.alvo, a.bx + (ev.clientX - a.x0), a.by + (ev.clientY - a.y0));
    pintarProps();
  }

  /* ---------------- seleção ---------------- */
  function seleccionar(alvo) {
    if (seleccionado) seleccionado.removeAttribute('data-ed-sel');
    seleccionado = alvo || null;
    if (seleccionado) seleccionado.setAttribute('data-ed-sel', '');
    marcarCamada();
    pintarProps();
  }

  function marcarCamada() {
    var botoes = listaCamadas.querySelectorAll('.ed-camada');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].setAttribute('aria-current', String(botoes[i].alvo === seleccionado));
    }
  }

  /* ---------------- painel de camadas ---------------- */
  var IGNORAR = { SCRIPT: 1, STYLE: 1, BR: 1, PATH: 1, CIRCLE: 1, RECT: 1, LINE: 1, DIALOG: 1 };

  function construirCamadas() {
    listaCamadas.textContent = '';
    /* As camadas começam no aparelho e não no ecrã: o que está fora do
       <div class="pda"> é a tela, e não se leva para o Kotlin. */
    var ecra = ecraVisivel();
    var raiz = ecra.querySelector('.pda') || ecra;

    (function andar(no, nivel) {
      for (var i = 0; i < no.children.length; i++) {
        var f = no.children[i];
        if (IGNORAR[f.tagName]) continue;
        if (f.closest('.ed-painel')) continue;

        f.setAttribute('data-ed-alvo', '');

        if (nivel <= 3) {
          var b = el('button', 'ed-camada');
          b.type = 'button';
          b.style.paddingLeft = (12 + nivel * 12) + 'px';
          b.alvo = f;
          b.appendChild(el('span', 'ed-camada__icone', f.tagName === 'svg' ? '◇' : '▢'));
          b.appendChild(el('span', 'ed-camada__nome', nomeDe(f)));
          b.addEventListener('click', function () { seleccionar(this.alvo); this.alvo.scrollIntoView({ block: 'center' }); });
          listaCamadas.appendChild(b);
        }
        if (f.tagName !== 'svg') andar(f, nivel + 1);
      }
    })(raiz, 0);

    traduzirRamo(listaCamadas);

  }

  function ecraVisivel() {
    var e = document.querySelector('.ecra:not([hidden])');
    return e || document.querySelector('.ecra');
  }

  function trocarEcra(nome) {
    var ecras = document.querySelectorAll('.ecra');
    for (var i = 0; i < ecras.length; i++) {
      ecras[i].hidden = ecras[i].dataset.ecra !== nome;
    }
    seleccionar(null);
    construirCamadas();
    if (window.PdaEcras) window.PdaEcras.lembrar(nome);
    // escolher um ecrã é querer vê-lo: a documentação, se estiver aberta, sai
    abrirLeitura('');
    // uma peça acrescentada num ecrã escondido ainda não passou pela tradução
    if (window.PdaTraducao) window.PdaTraducao.aplicar();
    window.scrollTo(0, 0);
  }

  /* ---------------- painel de propriedades ---------------- */
  function seccao(titulo) {
    var s = el('div', 'ed-seccao');
    s.appendChild(el('p', 'ed-seccao__titulo', titulo));
    return s;
  }

  function grelhaTokens(lista, propriedade, comNenhum) {
    var g = el('div', 'ed-tokens');
    var s = seletor(seleccionado);
    var actual = (estilos[s] || {})[propriedade];
    /* O que a peça mostra, venha de onde vier. Só se procura quando não há
       valor teu: se mudaste a cor, a que está em uso és tu. */
    var emUso = actual ? null : valorEmUso(
      seleccionado, propriedade, lista.map(function (par) { return par[0]; })
    );

    if (comNenhum) {
      var nada = el('button', 'ed-token ed-token--nenhum');
      nada.type = 'button';
      nada.dataset.edDica = 'Sem cor própria — herda de quem está por cima';
      nada.setAttribute('aria-pressed', String(!actual));
      nada.addEventListener('click', function () { definir(seleccionado, propriedade, null); pintarProps(); });
      g.appendChild(nada);
    }

    lista.forEach(function (par) {
      var token = par[0], nome = par[1];
      var b = el('button', 'ed-token');
      b.type = 'button';
      b.dataset.edDica = nome + '  ·  ' + token + '  ·  ' + corDoToken(token);
      b.style.background = 'var(' + token + ')';
      b.setAttribute('aria-pressed', String(actual === 'var(' + token + ')'));
      /* Marca diferente da tua: esta diz «é o que a peça já tinha», e o que
         tem de sair no CSS exportado continua a ser só o que mudaste. */
      if (emUso === 'var(' + token + ')') b.dataset.edActual = '';
      b.addEventListener('click', function () { definir(seleccionado, propriedade, 'var(' + token + ')'); pintarProps(); });
      g.appendChild(b);
    });
    return g;
  }

  function degraus(lista, propriedade, rotulo) {
    var linha = el('div', 'ed-degraus');
    var s = seletor(seleccionado);
    var actual = (estilos[s] || {})[propriedade];
    var emUso = actual ? null : valorEmUso(seleccionado, propriedade, lista);

    lista.forEach(function (v) {
      var b = el('button', 'ed-degrau', rotulo ? rotulo(v) : v.replace('--', '').replace(/^[te]-/, ''));
      b.type = 'button';
      b.dataset.edDica = descreverDegrau(v, propriedade);
      b.setAttribute('aria-pressed', String(actual === valorToken(v)));
      if (emUso === valorToken(v)) b.dataset.edActual = '';
      b.addEventListener('click', function () { definir(seleccionado, propriedade, valorToken(v)); pintarProps(); });
      linha.appendChild(b);
    });
    return linha;
  }

  /* "--t-lg · 1.125rem · 18px" — o nome, o valor e o que isso dá em píxeis */
  function descreverDegrau(v, propriedade) {
    if (v.indexOf('--') !== 0) {
      return propriedade === 'font-weight' ? 'Peso ' + v : v + 'px';
    }
    var bruto = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    var px = '';
    if (bruto.indexOf('rem') > 0) px = '  ·  ' + Math.round(parseFloat(bruto) * 16) + 'px';
    return v + '  ·  ' + bruto + px;
  }

  function pintarProps() {
    corpoProps.textContent = '';

    var alvoEl = document.querySelector('.ed-painel--dir .ed-alvo-nome');

    if (!seleccionado) {
      if (alvoEl) alvoEl.textContent = '—';
      corpoProps.appendChild(el('p', 'ed-vazio', 'Clica numa peça do ecrã, ou escolhe-a nas camadas à esquerda.'));
      traduzirRamo(painelDir);
      return;
    }

    if (alvoEl) alvoEl.textContent = nomeDe(seleccionado);

    /* --- variante, só para botões (09 §2) --- */
    if (seleccionado.classList.contains('btn')) {
      var sv = seccao('Variante');
      var sel = el('select', 'ed-select');
      VARIANTES.forEach(function (par) {
        var o = el('option', null, par[1]);
        o.value = par[0];
        var tem = par[0] ? seleccionado.classList.contains(par[0]) : CLASSES_VARIANTE.every(function (c) { return !seleccionado.classList.contains(c); });
        if (tem) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () {
        var sc2 = seletor(seleccionado);
        lembrar('classes', sc2, seleccionado.getAttribute('class') || '');
        historico.push({ tipo: 'classe', seletor: sc2, antes: seleccionado.getAttribute('class') || '' });
        CLASSES_VARIANTE.forEach(function (c) { seleccionado.classList.remove(c); });
        if (sel.value) seleccionado.classList.add(sel.value);
        classes[sc2] = seleccionado.className;
        guardar();
        pintarProps();
      });
      var l = el('div', 'ed-linha');
      l.appendChild(el('label', null, 'Categoria'));
      l.appendChild(sel);
      sv.appendChild(l);
      sv.appendChild(el('p', 'ed-dica', 'A cor e a altura vêm da variante. A ação principal é uma por ecrã — 03 §5.'));
      corpoProps.appendChild(sv);
    }

    /* --- texto --- */
    var so = seleccionado.children.length === 0 && (seleccionado.textContent || '').trim();
    if (so) {
      var st = seccao('Texto');
      var ta = el('textarea', 'ed-texto');
      ta.value = seleccionado.textContent;
      ta.addEventListener('change', function () {
        var s2 = seletor(seleccionado);
        lembrar('textos', s2, seleccionado.textContent);
        historico.push({ tipo: 'texto', seletor: s2, antes: textos[s2] !== undefined ? textos[s2] : seleccionado.textContent });
        seleccionado.textContent = ta.value;
        textos[s2] = ta.value;
        guardar();
        construirCamadas();
        marcarCamada();
      });
      st.appendChild(ta);
      corpoProps.appendChild(st);
    }

    /* --- tinta --- */
    var sc = seccao('Tinta');
    sc.appendChild(grelhaTokens(TINTAS, 'color', true));
    sc.appendChild(el('p', 'ed-dica', 'Não há laranja nesta paleta: o laranja é o fundo da ação principal, e como texto não se lê — 03 §2.1.'));
    corpoProps.appendChild(sc);

    /* --- fundo --- */
    var sf = seccao('Fundo');
    sf.appendChild(grelhaTokens(FUNDOS, 'background-color', true));
    corpoProps.appendChild(sf);

    /* --- letra --- */
    var sl = seccao('Letra');
    var lt = el('div', 'ed-linha');
    lt.appendChild(el('label', null, 'Tamanho'));
    lt.appendChild(degraus(TAMANHOS, 'font-size', function (v) { return v.replace('--t-', ''); }));
    sl.appendChild(lt);

    var lp = el('div', 'ed-linha');
    lp.appendChild(el('label', null, 'Peso'));
    lp.appendChild(degraus(PESOS.map(function (p) { return p[0]; }), 'font-weight'));
    sl.appendChild(lp);
    sl.appendChild(el('p', 'ed-dica', 'Nove tamanhos, e não há décimo — 03 §3.'));
    corpoProps.appendChild(sl);

    /* --- forma e folga --- */
    var sg = seccao('Forma e folga');
    var lr = el('div', 'ed-linha');
    lr.appendChild(el('label', null, 'Raio'));
    lr.appendChild(degraus(RAIOS, 'border-radius', function (v) { return v === '0' ? '0' : v.replace('--r-', ''); }));
    sg.appendChild(lr);

    var lf = el('div', 'ed-linha');
    lf.appendChild(el('label', null, 'Folga'));
    lf.appendChild(degraus(FOLGAS, 'padding', function (v) { return v === '0' ? '0' : v.replace('--e-', ''); }));
    sg.appendChild(lf);

    var estilo = getComputedStyle(seleccionado);
    if (estilo.display === 'flex' || estilo.display === 'grid' || estilo.display === 'inline-flex') {
      var lg = el('div', 'ed-linha');
      lg.appendChild(el('label', null, 'Espaço'));
      lg.appendChild(degraus(FOLGAS, 'gap', function (v) { return v === '0' ? '0' : v.replace('--e-', ''); }));
      sg.appendChild(lg);
    }
    sg.appendChild(el('p', 'ed-dica', 'Seis degraus, de 2 a 26 dp — 03 §4.'));
    corpoProps.appendChild(sg);

    /* --- a peça em si --- */
    var sp = seccao('Peça');

    var lv = el('div', 'ed-linha');
    lv.appendChild(el('label', null, 'Visível'));
    var escondida = getComputedStyle(seleccionado).display === 'none';
    var bv = el('button', 'ed-degrau', escondida ? 'Mostrar' : 'Esconder');
    bv.type = 'button';
    bv.dataset.edDica = escondida
      ? 'Traz a peça de volta ao ecrã'
      : 'Tira a peça do ecrã sem a apagar. Volta por aqui ou pelas camadas.';
    bv.addEventListener('click', function () {
      definir(seleccionado, 'display', escondida ? 'block' : 'none');
      pintarProps();
    });
    lv.appendChild(bv);
    sp.appendChild(lv);

    var la = el('div', 'ed-linha');
    la.appendChild(el('label', null, 'Alinhar'));
    la.appendChild(degraus(['left', 'center', 'right'], 'text-align', function (v) {
      return v === 'left' ? 'esq' : v === 'center' ? 'centro' : 'dir';
    }));
    sp.appendChild(la);

    var pos = lerPosicao(seleccionado);
    var lpos = el('div', 'ed-linha');
    lpos.appendChild(el('label', null, 'Posição'));
    var caixaPos = el('div', 'ed-coords');

    /* X e Y escrevem-se à mão. Arrastar é o mesmo valor, com o rato. */
    function coord(eixo, valor) {
      var env = el('label', 'ed-coord');
      env.appendChild(el('span', null, eixo.toUpperCase()));
      var campo = el('input', 'ed-select');
      campo.type = 'number';
      campo.step = '1';
      campo.value = valor;
      campo.dataset.edDica = 'Deslocamento em píxeis a partir do sítio de origem';
      campo.addEventListener('change', function () {
        var p3 = lerPosicao(seleccionado);
        var x = eixo === 'x' ? parseFloat(campo.value || 0) : p3.x;
        var y = eixo === 'y' ? parseFloat(campo.value || 0) : p3.y;
        mover(seleccionado, x, y);
        pintarProps();
      });
      env.appendChild(campo);
      return env;
    }

    caixaPos.appendChild(coord('x', pos.x));
    caixaPos.appendChild(coord('y', pos.y));
    var bpos = el('button', 'ed-degrau', 'Repor');
    bpos.type = 'button';
    bpos.dataset.edDica = 'Devolve a peça ao sítio de origem';
    bpos.addEventListener('click', function () { mover(seleccionado, 0, 0); pintarProps(); });
    caixaPos.appendChild(bpos);
    lpos.appendChild(caixaPos);
    sp.appendChild(lpos);

    corpoProps.appendChild(sp);

    var ligada = seleccionado.closest('[data-ir]');
    if (ligada) corpoProps.insertBefore(seccaoPrototipo(ligada), corpoProps.firstChild);

    corpoProps.appendChild(seccaoCss());



    /* --- repor esta peça --- */
    var sr = el('div', 'ed-seccao');
    var br = el('button', 'ed-botao', 'Repor esta peça');
    br.type = 'button';
    br.addEventListener('click', function () {
      var s3 = seletor(seleccionado);
      historico.push({ tipo: 'estilo', seletor: s3, propriedade: '*', antes: undefined });
      delete estilos[s3];
      escrever(); pintarProps();
    });
    sr.appendChild(br);
    corpoProps.appendChild(sr);

    /* O painel nasceu em português. Em inglês, traduz-se só ele, e não a
       página toda a cada clique. */
    traduzirRamo(painelDir);
  }

  /* ---------------- o protótipo ----------------
     Na tela, um clique escolhe; não navega. Uma peça com data-ir diz para
     onde levava no aparelho, e daqui vai-se lá — ou com Alt + clique. */
  function nomeDoEcra(id) {
    var e = document.querySelector('.ecra[data-ecra="' + id + '"]');
    return e ? (e.dataset.nome || id) : id;
  }

  function seccaoPrototipo(ligada) {
    var s = seccao('Protótipo');
    var destino = ligada.dataset.ir;
    var b = el('button', 'ed-botao ed-botao--accao', 'Ir para ' + nomeDoEcra(destino));
    b.type = 'button';
    b.addEventListener('click', function () { irPara(destino); });
    s.appendChild(b);
    s.appendChild(el('p', 'ed-dica', 'Alt + clique numa peça destas faz o mesmo sem a escolher.'));
    return s;
  }

  function irPara(nome) {
    var picker = painelEsq && painelEsq.querySelector('.ed-ecras select');
    if (picker) picker.value = nome;
    trocarEcra(nome);
  }

  /* ---------------- o CSS da peça escolhida ----------------
     Mostra o que a peça é agora, não o que o editor lhe fez. Onde o valor
     bater certo com um token, aparece o nome do token: é assim que se vê
     se uma peça está no sistema ou fora dele. */
  var PROPRIEDADES = [
    ['font-family', 'font-family'], ['font-size', 'font-size'], ['font-weight', 'font-weight'],
    ['line-height', 'line-height'], ['letter-spacing', 'letter-spacing'],
    ['color', 'color'], ['background-color', 'background-color'],
    ['border', 'border'], ['border-radius', 'border-radius'],
    ['box-shadow', 'box-shadow'], ['padding', 'padding'], ['gap', 'gap'],
    ['display', 'display'], ['width', 'width'], ['height', 'height'],
    ['stroke-width', 'stroke-width'], ['transform', 'transform']
  ];
  var VAZIOS = ['none', 'normal', '0px', 'auto', 'rgba(0, 0, 0, 0)', 'matrix(1, 0, 0, 1, 0, 0)', '0', ''];

  function hexParaRgb(h) {
    h = h.trim();
    if (h.indexOf('#') !== 0 || (h.length !== 7 && h.length !== 4)) return null;
    if (h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    return 'rgb(' + parseInt(h.slice(1, 3), 16) + ', ' + parseInt(h.slice(3, 5), 16) + ', ' + parseInt(h.slice(5, 7), 16) + ')';
  }

  /* Uma família por propriedade. Sem isto, 16px de altura de linha vinha
     dado como var(--r-lg), que é um raio, só porque calha ter o mesmo valor. */
  var FAMILIAS = {
    'color':            function () { return TINTAS.map(function (p) { return p[0]; }); },
    'background-color': function () { return FUNDOS.map(function (p) { return p[0]; }); },
    'font-size':        function () { return TAMANHOS; },
    'border-radius':    function () { return RAIOS; },
    'padding':          function () { return FOLGAS; },
    'gap':              function () { return FOLGAS; }
  };

  function tokenPara(propriedade, valor) {
    var fam = FAMILIAS[propriedade];
    if (!fam) return null;
    var nomes = fam();
    for (var i = 0; i < nomes.length; i++) {
      var t = nomes[i];
      if (t.indexOf('--') !== 0) continue;
      var v = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
      if (!v) continue;
      if (v === valor) return t;
      if (hexParaRgb(v) === valor) return t;
      if (v.indexOf('rem') > 0 && (parseFloat(v) * 16) + 'px' === valor) return t;
    }
    return null;
  }

  function cssDaPeca(alvo) {
    var estilo = getComputedStyle(alvo);
    var linhas = [seletor(alvo) + ' {'];

    PROPRIEDADES.forEach(function (par) {
      var v = estilo.getPropertyValue(par[1]);
      if (!v) return;
      v = v.trim();
      if (VAZIOS.indexOf(v) >= 0) return;
      if (par[1] === 'font-family') v = v.split(',')[0].replace(/["']/g, '');
      if (par[1] === 'border' && v.indexOf('0px') === 0) return;
      var token = tokenPara(par[1], v);
      linhas.push('  ' + par[0] + ': ' + (token ? 'var(' + token + ')  /* ' + v + ' */' : v) + ';');
    });

    linhas.push('}');

    var meus = estilos[seletor(alvo)];
    if (meus && Object.keys(meus).length) {
      linhas.push('', '/* do que mudaste aqui: */');
      Object.keys(meus).forEach(function (k) { linhas.push('  ' + k + ': ' + meus[k] + ';'); });
    }
    return linhas.join('\n');
  }

  function seccaoCss() {
    var sc = seccao('CSS da peça');
    var pre = el('pre', 'ed-css');
    pre.textContent = cssDaPeca(seleccionado);
    sc.appendChild(pre);

    var b = el('button', 'ed-botao', 'Copiar este CSS');
    b.type = 'button';
    b.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(function () { aviso('CSS da peça copiado'); });
    });
    sc.appendChild(b);
    return sc;
  }

  /* ---------------- exportar ---------------- */
  function cssFinal() {
    /* As peças acrescentadas não são CSS — são marcação, e vão para o
       `index.html` à mão. Aparecem aqui em cima porque quem abre esta janela
       quer levar daqui tudo o que mudou, e não só metade. */
    var marcacao = window.PdaPecas ? window.PdaPecas.html() : '';
    if (marcacao) {
      marcacao = '/* ── PEÇAS ACRESCENTADAS ─────────────────────────────────\n' +
        '   Isto é HTML, não é CSS. Colar no index.html, no sítio indicado.\n' +
        '   ──────────────────────────────────────────────────────── */\n' +
        marcacao + '\n\n';
    }
    return marcacao + cssDasRegras();
  }

  function cssDasRegras() {
    var partes = ['/* PDA — alterações feitas no editor.',
                  '   Só tokens: nenhum valor aqui foi inventado. */', ''];

    Object.keys(estilos).forEach(function (s) {
      var props = estilos[s];
      var chaves = Object.keys(props);
      if (!chaves.length) return;
      partes.push(s + ' {');
      chaves.forEach(function (p) { partes.push('  ' + p + ': ' + props[p] + ';'); });
      partes.push('}', '');
    });

    var chavesClasse = Object.keys(classes);
    if (chavesClasse.length) {
      partes.push('/* Variante trocada — isto muda a classe no HTML, não o CSS:');
      chavesClasse.forEach(function (s) { partes.push('   ' + s + '  →  class="' + classes[s] + '"'); });
      partes.push('*/', '');
    }

    var chavesTexto = Object.keys(textos);
    if (chavesTexto.length) {
      partes.push('/* Texto alterado — isto muda no HTML, não no CSS:');
      chavesTexto.forEach(function (s) { partes.push('   ' + s + '  →  "' + textos[s] + '"'); });
      partes.push('*/');
    }

    if (partes.length <= 3) partes.push('/* Ainda não mudaste nada. */');
    return partes.join('\n');
  }

  /* ---------------- abrir e fechar os painéis ----------------
     Fechado, o painel sai do caminho e a tela fica com o ecrã inteiro.
     Fica um botão encostado à margem para o trazer de volta. */
  function estadoPaineis() {
    try { return JSON.parse(localStorage.getItem(CHAVE_PAINEIS) || '{}'); } catch (e) { return {}; }
  }

  function alternarPainel(lado, fechar) {
    var e = estadoPaineis();
    if (fechar === undefined) fechar = !e[lado];
    e[lado] = fechar;
    try { localStorage.setItem(CHAVE_PAINEIS, JSON.stringify(e)); } catch (err) {}
    document.body.classList.toggle('ed-sem-' + lado, !!fechar);
  }

  function botaoFechar(lado, seta) {
    var b = el('button', 'ed-fechar', seta);
    b.type = 'button';
    b.dataset.edDica = 'Fechar este painel';
    b.setAttribute('aria-label', 'Fechar o painel');
    b.addEventListener('click', function () { alternarPainel(lado, true); });
    return b;
  }

  function botaoAbrir(lado, seta, titulo) {
    var b = el('button', 'ed-abrir ed-abrir--' + lado, seta);
    b.type = 'button';
    b.dataset.edDica = 'Abrir ' + titulo;
    b.setAttribute('aria-label', 'Abrir ' + titulo);
    b.addEventListener('click', function () { alternarPainel(lado, false); });
    document.body.appendChild(b);
  }

  /* ---------------- montagem ---------------- */
  function montar() {
    folha = el('style');
    folha.id = 'ed-alteracoes';
    document.head.appendChild(folha);

    /* painel esquerdo: ecrãs e camadas */
    painelEsq = el('aside', 'ed-painel ed-painel--esq');
    var cabecaE = el('div', 'ed-cabeca');
    var marca = el('p', 'ed-cabeca__marca', 'PDA');
    marca.style.margin = '0';
    var simbolo = el('img', 'ed-cabeca__simbolo');
    simbolo.src = 'assets/img/simbolo-app.svg';
    simbolo.alt = '';
    marca.insertBefore(simbolo, marca.firstChild);
    cabecaE.appendChild(marca);
    cabecaE.appendChild(el('h2', null, 'Camadas'));
    cabecaE.appendChild(botaoFechar('esq', '‹'));
    painelEsq.appendChild(cabecaE);

    /* Os ecrãs, a documentação e o como funciona vivem na mesma tela. A
       documentação abre ao lado das camadas, e não noutra página: quem está a
       afinar um ecrã quer ver a regra sem perder o sítio onde estava. */
    var abas = el('div', 'ed-abas');
    abas.setAttribute('role', 'tablist');
    ABAS.forEach(function (par) {
      var b = el('button', 'ed-aba', par[1]);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.edAba = par[0];
      b.addEventListener('click', function () { abrirLeitura(par[0]); });
      abas.appendChild(b);
    });
    painelEsq.appendChild(abas);

    var barraEcras = el('div', 'ed-ecras');
    barraEcras.appendChild(el('label', null, 'Ecrã'));
    var selEcras = el('select', 'ed-select');
    /* Dezanove ecrãs numa lista corrida não se encontram. Agrupam-se pelo
       fluxo a que pertencem, que é como se fala deles nos casos de uso. */
    var ecras = document.querySelectorAll('.ecra');
    var grupo = null;
    for (var i = 0; i < ecras.length; i++) {
      var fluxo = ecras[i].dataset.fluxo || '';
      if (!grupo || grupo.label !== fluxo) {
        grupo = el('optgroup');
        grupo.label = fluxo;
        selEcras.appendChild(grupo);
      }
      var o = el('option', null, ecras[i].dataset.nome || ecras[i].dataset.ecra);
      o.value = ecras[i].dataset.ecra;
      if (!ecras[i].hidden) o.selected = true;
      grupo.appendChild(o);
    }
    selEcras.addEventListener('change', function () { trocarEcra(selEcras.value); });
    barraEcras.appendChild(selEcras);
    painelEsq.appendChild(barraEcras);

    listaCamadas = el('div', 'ed-corpo');
    painelEsq.appendChild(listaCamadas);

    /* A paleta de peças vive noutro ficheiro e monta-se aqui. Se não estiver
       carregada, o editor continua a servir para tudo o resto — uma paleta em
       falta não pode tirar o painel das camadas a ninguém. */
    if (window.PdaPecas) window.PdaPecas.montar(painelEsq);

    var peE = el('div', 'ed-pe');
    var bCss = el('button', 'ed-botao ed-botao--accao', 'Ver o CSS');
    bCss.type = 'button';
    // Um id, porque o rótulo muda de língua e procurar um botão pelo texto
    // deixou de funcionar no dia em que o texto passou a ser traduzido.
    bCss.id = 'ed-ver-css';
    bCss.addEventListener('click', abrirDialogo);
    var bAnular = el('button', 'ed-botao', 'Anular');
    bAnular.type = 'button';
    bAnular.addEventListener('click', anular);
    var bRepor = el('button', 'ed-botao', 'Repor tudo');
    bRepor.type = 'button';
    bRepor.addEventListener('click', reporTudo);
    peE.appendChild(bCss); peE.appendChild(bAnular); peE.appendChild(bRepor);

    /* O PDA não tem tema escuro — 03 §2 só define um jogo de cores —, por
       isso aqui não há a barra do tema que o editor da entrada tinha. Há a do
       idioma, e as duas páginas que explicam o que se está a ver. */
    var idiomaBarra = el('div', 'ed-degraus');
    [['pt', 'Português'], ['en', 'English']].forEach(function (par) {
      var b = el('button', 'ed-degrau', par[1]);
      b.type = 'button';
      b.dataset.edIdioma = par[0];
      /* quem marca o degrau é a tradução, que também aplica a língua guardada */
      b.addEventListener('click', function () {
        if (window.PdaTraducao) window.PdaTraducao.aplicar(par[0]);
      });
      idiomaBarra.appendChild(b);
    });
    peE.appendChild(idiomaBarra);

    painelEsq.appendChild(peE);

    /* painel direito: propriedades */
    painelDir = el('aside', 'ed-painel ed-painel--dir');
    var cabecaD = el('div', 'ed-cabeca');
    cabecaD.appendChild(el('h2', null, 'Propriedades'));
    var nome = el('span', 'ed-alvo-nome', '—');
    nome.style.color = 'var(--ed-tinta-3)';
    cabecaD.appendChild(nome);
    cabecaD.appendChild(botaoFechar('dir', '›'));
    painelDir.appendChild(cabecaD);

    corpoProps = el('div', 'ed-corpo');
    painelDir.appendChild(corpoProps);

    document.body.appendChild(painelEsq);
    document.body.appendChild(painelDir);

    botaoAbrir('esq', '›', 'as camadas');
    botaoAbrir('dir', '‹', 'as propriedades');
    var guardado = estadoPaineis();
    alternarPainel('esq', !!guardado.esq);
    alternarPainel('dir', !!guardado.dir);

    /* diálogo do CSS */
    dialogo = el('dialog', 'ed-dialogo');
    var topoD = el('div', 'ed-dialogo__topo');
    topoD.appendChild(el('h2', null, 'O que mudaste'));
    var bFechar = el('button', 'ed-botao', 'Fechar');
    bFechar.type = 'button';
    bFechar.addEventListener('click', function () { dialogo.close(); });
    topoD.appendChild(bFechar);
    var pre = el('pre');
    var code = el('code');
    pre.appendChild(code);
    var accoesD = el('div', 'ed-dialogo__accoes');
    var bCopiar = el('button', 'ed-botao ed-botao--accao', 'Copiar');
    bCopiar.type = 'button';
    bCopiar.addEventListener('click', function () {
      var t = code.textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { aviso('CSS copiado'); });
    });
    accoesD.appendChild(bCopiar);
    dialogo.appendChild(topoD); dialogo.appendChild(pre); dialogo.appendChild(accoesD);
    dialogo.codigo = code;
    document.body.appendChild(dialogo);
  }

  /* ---------------- documentação dentro da tela ---------------- */
  var ABAS = [['', 'Ecrãs'], ['documentacao', 'Documentação'], ['como-funciona', 'Como funciona']];
  var leitura = null;

  function abrirLeitura(qual) {
    if (qual && !ABAS.some(function (par) { return par[0] === qual; })) qual = '';

    if (!qual) {
      if (leitura) { leitura.remove(); leitura = null; }
    } else {
      if (!leitura) {
        leitura = el('div', 'ed-leitura');
        var moldura = el('iframe');
        moldura.title = 'Documentação';
        leitura.appendChild(moldura);
        document.body.appendChild(leitura);
      }
      var alvo = qual + '.html';
      var frame = leitura.querySelector('iframe');
      if ((frame.getAttribute('src') || '') !== alvo) frame.setAttribute('src', alvo);
    }
    document.body.classList.toggle('ed-lendo', !!qual);

    var botoes = document.querySelectorAll('[data-ed-aba]');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].setAttribute('aria-selected', String(botoes[i].dataset.edAba === qual));
    }

    // fica no endereço, para voltar ao mesmo sítio ao recarregar
    try { history.replaceState(null, '', qual ? '#doc=' + qual : location.pathname); } catch (e) {}
  }

  /* As páginas de documentação, dentro da moldura, pedem para trocar de aba
     em vez de navegarem sozinhas — senão o editor abria-se dentro de si mesmo. */
  window.addEventListener('message', function (ev) {
    if (ev.data && ev.data.pda === 'aba') abrirLeitura(ev.data.qual || '');
  });

  function abrirDialogo() {
    dialogo.codigo.textContent = cssFinal();
    dialogo.showModal();
  }

  /* Enquanto se edita, o ecrã não funciona como ecrã: um clique escolhe
     a peça e mais nada. Senão o botão submetia o formulário a cada escolha. */
  /* A moldura do editor não é tela: cliques nela passam como cliques normais.
     Sem isto, o botão de reabrir um painel ficava morto, porque o editor
     engolia o clique antes de ele chegar lá. */
  function ehMoldura(no) {
    return !!(no && no.closest && (no.closest('.ed-painel') || no.closest('.ed-dialogo') ||
              no.closest('.ed-abrir') || no.closest('.ed-leitura') || no.closest('.ed-aviso') || no.closest('.ed-dica-flutuante')));
  }

  /* a peça que um clique aqui escolheria */
  function candidata(destino) {
    var fundo = destino.closest('[data-ed-alvo]');
    if (!fundo) return null;
    var peca = destino.closest(COMPONENTES);
    var jaLaDentro = peca && seleccionado && (seleccionado === peca || peca.contains(seleccionado));
    return jaLaDentro || !peca ? fundo : peca;
  }

  var sobre = null;
  function realcar(ev) {
    if (!ligado) return;
    if (sobre) { sobre.removeAttribute('data-ed-hover'); sobre = null; }
    if (ehMoldura(ev.target)) return;
    var c = candidata(ev.target);
    if (c && c !== seleccionado) { c.setAttribute('data-ed-hover', ''); sobre = c; }
  }

  function interceptar(ev) {
    if (!ligado) return;
    if (ehMoldura(ev.target)) return;
    if (ev.target.getAttribute && ev.target.getAttribute('contenteditable') === 'true') return;

    ev.preventDefault();
    ev.stopPropagation();

    /* Alt + clique segue a ligação do protótipo, em vez de escolher */
    var ligada = ev.altKey && ev.target.closest && ev.target.closest('[data-ir]');
    if (ligada) { irPara(ligada.dataset.ir); return; }

    /* o clique que fecha um arrasto não muda a seleção */
    if (engoleClique) { engoleClique = false; return; }
    if (mudouNoMousedown) { mudouNoMousedown = false; return; }

    var escolha = candidata(ev.target);
    if (escolha) seleccionar(escolha);

  }

  document.addEventListener('DOMContentLoaded', function () {
    /* #so=<ecrã> mostra só o aparelho, sem editor: é o que importar/gerar.sh
       fotografa. */
    if (window.PdaEcras && window.PdaEcras.soUm) return;

    /* A tela abre em edição. Não há modo de ver: para ver o ecrã a
       funcionar existe o produto, não esta página. */
    ligado = true;
    document.body.classList.add('editando');

    montar();
    montarDica();
    carregar();
    construirCamadas();
    pintarProps();
    abrirLeitura((location.hash.match(/doc=([a-z-]+)/) || [])[1] || '');

    document.addEventListener('click', interceptar, true);
    document.addEventListener('mouseover', realcar, true);
    document.addEventListener('mousedown', comecarArrasto, true);
    document.addEventListener('mousemove', durante, true);
    document.addEventListener('mouseup', largar, true);
    document.addEventListener('submit', function (ev) { if (ligado) ev.preventDefault(); }, true);

    /* duplo clique escreve no sítio */
    document.addEventListener('dblclick', function (ev) {
      if (!ligado) return;
      var alvo = ev.target.closest('[data-ed-alvo]');
      if (!alvo || alvo.children.length) return;
      alvo.setAttribute('contenteditable', 'true');
      alvo.focus();
      var s = seletor(alvo);
      var antes = alvo.textContent;
      lembrar('textos', s, antes);
      alvo.addEventListener('blur', function sair() {
        alvo.removeAttribute('contenteditable');
        alvo.removeEventListener('blur', sair);
        if (alvo.textContent !== antes) {
          historico.push({ tipo: 'texto', seletor: s, antes: antes });
          textos[s] = alvo.textContent;
          guardar();
        }
      });
    }, true);

    window.PdaEditor = {
      /* O que a paleta de peças precisa de saber do editor. Nada disto é novo:
         é o que o editor já usava por dentro, agora com nome. */
      seletor: seletor,
      alvo: function () { return seleccionado; },
      seleccionar: seleccionar,
      refrescar: function () { construirCamadas(); pintarProps(); },
      aviso: aviso,

      irPara: irPara
    };

    document.addEventListener('keydown', function (ev) {
      if (!ligado) return;
      if (ev.key === 'Escape') seleccionar(null);
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'z') { ev.preventDefault(); anular(); }

      /* setas movem a peça: um pixel, ou oito com Shift */
      var setas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (seleccionado && setas[ev.key] && !ev.target.closest('.ed-painel')) {
        ev.preventDefault();
        var passo = ev.shiftKey ? 8 : 1;
        var p2 = lerPosicao(seleccionado);
        mover(seleccionado, p2.x + setas[ev.key][0] * passo, p2.y + setas[ev.key][1] * passo);
        pintarProps();
      }
    });
  });
})();
