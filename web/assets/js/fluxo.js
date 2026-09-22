/* =========================================================
   ARMAZÉM INTELIGENTE — o mapa de navegação

   Põe os ecrãs todos numa tela, uma linha por fluxo, e desenha uma seta
   de cada peça com data-ir para o ecrã a que leva. Não há um segundo
   desenho: mudar um data-ir no ecrã muda a seta.

   Duas maneiras de o abrir:
     index.html#doc=fluxo   a aba «Fluxo» do editor. Edita-se como na aba
                            dos ecrãs — escolher, mudar, escrever, ligar —
                            e as setas refazem-se a cada mudança
     index.html#so=fluxo    só o mapa, sem editor: é o que importar/gerar.sh
                            fotografa para 03-fluxo.png e 03-fluxo.pdf

   Como no protótipo do Figma, a peça que leva a algum lado fica contornada
   a azul, e a seta sai dela. Uma seta para o ecrã ao lado vai direita a
   ele; uma que vai mais longe, volta atrás ou muda de linha segue pelos
   corredores entre os ecrãs, para não os tapar.
   ========================================================= */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var CHAVE_ZOOM = 'pda:fluxo:zoom';
  var ZOOMS = [0.1, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3];
  var MIN = 0.1, MAX = 3;

  var CHAVE_SETAS = 'pda:fluxo:setas';
  var FUNCOES = [['todas', 'Todas'], ['arrumacao', 'Arrumação'], ['separacao', 'Separação'],
                 ['expedicao', 'Expedição'], ['gestor', 'Gestor']];

  var mapa = null, svg = null, observador = null, pedido = 0;
  var editavel = false;   // no editor as setas arrastam-se; na captura, não
  var desvios = {};       // chave da seta -> { x, y } em px do mapa
  var ordem = [];      // os ecrãs pela ordem do index.html, para os devolver
  var zoom = 1;

  function ligar(comZoom) {
    if (mapa) return;
    editavel = !!comZoom;
    try { desvios = JSON.parse(localStorage.getItem(CHAVE_SETAS) || '{}'); } catch (e) { desvios = {}; }
    var tela = document.getElementById('tela');
    document.body.classList.add('com-fluxo');

    mapa = document.createElement('div');
    mapa.className = 'fluxo';

    var cabeca = document.createElement('header');
    cabeca.className = 'fluxo__cabeca';
    cabeca.innerHTML =
      '<h1 class="fluxo__titulo">Mapa de navegação do PDA<span class="fluxo__funcao"></span></h1>' +
      '<p class="fluxo__legenda"><span class="fluxo__amostra" aria-hidden="true"></span>' +
      'Contornado a azul: o botão ou a leitura que leva a outro ecrã. A seta diz a qual.</p>';
    /* Ver só os ecrãs de uma função: o que a arrumação vê, de ponta a ponta.
       Os ecrãs de todas (entrar, sem ligação) ficam em qualquer uma. */
    var filtro = document.createElement('div');
    filtro.className = 'fluxo__filtro';
    filtro.setAttribute('role', 'group');
    filtro.setAttribute('aria-label', 'Função');
    FUNCOES.forEach(function (par) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.funcao = par[0];
      b.textContent = par[1];
      filtro.appendChild(b);
    });
    filtro.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (b) filtrar(b.dataset.funcao);
    });
    cabeca.appendChild(filtro);
    mapa.appendChild(cabeca);

    /* As linhas, pela ordem dos fluxos no index.html. O ícone é a marca, e
       não um ecrã do aparelho: fica de fora, onde estava. */
    ordem = [].slice.call(tela.querySelectorAll('.ecra'));
    var linha = null, nomeLinha = null;
    ordem.forEach(function (ecra) {
      ecra.dataset.fluxoEscondido = ecra.hidden ? '1' : '';
      if (ecra.classList.contains('ecra--marca')) return;
      ecra.hidden = false;
      if (ecra.dataset.fluxo !== nomeLinha) {
        nomeLinha = ecra.dataset.fluxo;
        linha = document.createElement('section');
        linha.className = 'fluxo__linha';
        var rotulo = document.createElement('h2');
        rotulo.className = 'fluxo__rotulo';
        rotulo.textContent = nomeLinha;
        // o que é o fluxo, por baixo do nome: vem do <template id="fluxos">
        var cabecaLinha = document.createElement('div');
        cabecaLinha.className = 'fluxo__cabeca-linha';
        cabecaLinha.appendChild(rotulo);
        var desc = document.querySelector('#fluxos') &&
          [].slice.call(document.querySelector('#fluxos').content.querySelectorAll('p'))
            .filter(function (q) { return q.dataset.fluxo === nomeLinha; })[0];
        if (desc) {
          var d = document.createElement('p');
          d.className = 'fluxo__descricao';
          d.textContent = desc.textContent;
          cabecaLinha.appendChild(d);
        }
        linha.appendChild(cabecaLinha);
        var fila = document.createElement('div');
        fila.className = 'fluxo__fila';
        linha.appendChild(fila);
        mapa.appendChild(linha);
      }
      // o nome fica fora do .pda: não entra nas camadas nem no CSS exportado
      var nome = document.createElement('p');
      nome.className = 'fluxo__nome';
      nome.textContent = ecra.dataset.nome;
      /* O nome e para que serve ficam por baixo do ecrã: por cima passam as
         faixas das setas, e assim não riscam o texto. */
      ecra.appendChild(nome);
      if (ecra.dataset.objetivo) {
        var obj = document.createElement('p');
        obj.className = 'fluxo__objetivo';
        obj.textContent = ecra.dataset.objetivo;
        ecra.appendChild(obj);
      }
      linha.querySelector('.fluxo__fila').appendChild(ecra);
    });

    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fluxo__setas');
    svg.innerHTML =
      '<defs><marker id="fluxo-ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>';
    mapa.appendChild(svg);

    tela.insertBefore(mapa, tela.firstChild);

    // o link abre com todos os ecrãs; uma função só com #…&funcao=arrumacao
    filtrar((location.hash.match(/funcao=([a-z]+)/) || [])[1] || 'todas');

    if (comZoom) {
      try { zoom = parseFloat(localStorage.getItem(CHAVE_ZOOM)) || 0; } catch (e) { zoom = 0; }
      montarZoom();
      if (zoom) aplicarZoom(zoom); else ajustar();
    }

    /* Qualquer mudança nos ecrãs — um estilo, um texto, uma peça nova, uma
       ligação — pode mexer nas setas. Refazem-se uma vez por fotograma. */
    observador = new MutationObserver(function (lista) {
      for (var i = 0; i < lista.length; i++) {
        var alvo = lista[i].target;
        var no = alvo.nodeType === 1 ? alvo : alvo.parentNode;
        if (no && no.closest && no.closest('.fluxo__setas')) continue;
        agendar();
        return;
      }
    });
    observador.observe(mapa, { subtree: true, childList: true, characterData: true,
                               attributes: true, attributeFilter: ['class', 'style', 'data-ir', 'hidden', 'data-ed-sel'] });
    // as alterações de estilo do editor vivem numa folha no <head>
    var folha = document.getElementById('ed-alteracoes');
    if (folha) observador.observe(folha, { childList: true, characterData: true, subtree: true });

    agendar();
  }

  function filtrar(funcao) {
    if (!FUNCOES.some(function (par) { return par[0] === funcao; })) funcao = 'todas';
    [].slice.call(mapa.querySelectorAll('.fluxo__filtro button')).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.funcao === funcao));
    });
    [].slice.call(mapa.querySelectorAll('.fluxo__linha')).forEach(function (linha) {
      var algum = false;
      [].slice.call(linha.querySelectorAll('.ecra')).forEach(function (e) {
        var f = e.dataset.funcao || 'todas';
        var fica = funcao === 'todas' || f === 'todas' || f === funcao;
        e.classList.toggle('fluxo--fora', !fica);
        algum = algum || fica;
      });
      linha.classList.toggle('fluxo--fora', !algum);
    });
    var nome = FUNCOES.filter(function (par) { return par[0] === funcao; })[0][1];
    mapa.querySelector('.fluxo__funcao').textContent = funcao === 'todas' ? '' : nome;
    if (window.PdaTraducao) window.PdaTraducao.aplicar();

    agendar();
  }

  function desligar() {
    if (!mapa) return;
    observador.disconnect(); observador = null;
    var tela = document.getElementById('tela');
    ordem.forEach(function (ecra) {
      var nome = ecra.querySelector(':scope > .fluxo__nome');
      if (nome) nome.remove();
      var obj = ecra.querySelector(':scope > .fluxo__objetivo');
      if (obj) obj.remove();
      ecra.hidden = ecra.dataset.fluxoEscondido === '1';
      delete ecra.dataset.fluxoEscondido;
      tela.appendChild(ecra);
    });
    mapa.remove(); mapa = null; svg = null;
    var z = document.querySelector('.fluxo__zoom');
    if (z) z.remove();
    document.body.classList.remove('com-fluxo');
    var pagina = document.getElementById('fluxo-pagina');
    if (pagina) pagina.remove();
  }

  /* ---------- zoom ----------
     Dezanove ecrãs a 1 px por dp não cabem ao lado dos painéis. O zoom é da
     tela, e não do ecrã: as medidas do CSS continuam em dp.

     Os gestos são os do Figma:
       Ctrl + roda (ou pinça no touchpad)   aproxima ou afasta onde está o rato
       Ctrl + =  ·  Ctrl + −                um degrau para cada lado
       Ctrl + 0                             100 %
       Shift + 1                            ajustar à janela
       Espaço + arrastar, ou roda do meio   andar pela tela */
  var comGestos = false;

  function gestos() {
    var tela = document.getElementById('tela');

    tela.addEventListener('wheel', function (ev) {
      if (!mapa || !(ev.ctrlKey || ev.metaKey)) return;
      ev.preventDefault();
      // a pinça do touchpad chega em passos pequenos; a roda, em passos de 100
      aplicarZoom(zoom * Math.exp(-ev.deltaY * (Math.abs(ev.deltaY) < 50 ? 0.01 : 0.002)), ev.clientX, ev.clientY);
    }, { passive: false });

    window.addEventListener('keydown', function (ev) {
      if (!mapa || ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      var ctrl = ev.ctrlKey || ev.metaKey;
      if (ctrl && (ev.key === '=' || ev.key === '+')) { ev.preventDefault(); degrau(1); }
      else if (ctrl && (ev.key === '-' || ev.key === '_')) { ev.preventDefault(); degrau(-1); }
      else if (ctrl && ev.key === '0') { ev.preventDefault(); aplicarZoom(1); }
      else if (ev.shiftKey && ev.code === 'Digit1') { ev.preventDefault(); ajustar(); }
      else if (ev.code === 'Space' && !ev.repeat) { ev.preventDefault(); document.body.classList.add('fluxo-mao'); }
    }, true);
    window.addEventListener('keyup', function (ev) {
      if (ev.code === 'Space') document.body.classList.remove('fluxo-mao');
    }, true);

    /* Andar pela tela. Corre na captura da janela, antes do editor: com o
       espaço carregado, arrastar não pode mover a peça que está por baixo. */
    var mao = null;
    window.addEventListener('mousedown', function (ev) {
      if (!mapa || !tela.contains(ev.target)) return;
      var espaco = document.body.classList.contains('fluxo-mao');
      if (!(espaco && ev.button === 0) && ev.button !== 1) return;
      ev.preventDefault(); ev.stopPropagation();
      mao = { x: ev.clientX, y: ev.clientY, l: tela.scrollLeft, t: tela.scrollTop };
      document.body.classList.add('fluxo-agarrado');
    }, true);
    window.addEventListener('mousemove', function (ev) {
      if (!mao) return;
      ev.stopPropagation();
      tela.scrollLeft = mao.l - (ev.clientX - mao.x);
      tela.scrollTop = mao.t - (ev.clientY - mao.y);
    }, true);
    window.addEventListener('mouseup', function (ev) {
      if (!mao) return;
      mao = null;
      ev.stopPropagation();
      document.body.classList.remove('fluxo-agarrado');
      // o clique que fecha o arrasto não escolhe nada
      window.addEventListener('click', function engolir(e) { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
    }, true);
  }

  function montarZoom() {
    // sai-se e volta-se ao fluxo muitas vezes: os gestos ligam-se uma só vez
    if (!comGestos) { comGestos = true; gestos(); moverSetas(); }

    var barra = document.createElement('div');
    barra.className = 'fluxo__zoom';
    barra.innerHTML =
      '<button type="button" data-z="-" title="Afastar (Ctrl + −)">−</button>' +
      '<button type="button" data-z="100" class="fluxo__zoom-valor" title="Voltar a 100 % (Ctrl + 0)"></button>' +
      '<button type="button" data-z="+" title="Aproximar (Ctrl + =)">+</button>' +
      '<button type="button" data-z="ajustar" title="Shift + 1">Ajustar</button>';
    barra.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      if (b.dataset.z === '+') degrau(1);
      else if (b.dataset.z === '-') degrau(-1);
      else if (b.dataset.z === '100') aplicarZoom(1);
      else ajustar();
    });
    document.body.appendChild(barra);
  }

  /* o degrau seguinte da lista, para cima ou para baixo, a partir de onde se está */
  function degrau(sentido) {
    var lista = sentido > 0 ? ZOOMS : ZOOMS.slice().reverse();
    for (var i = 0; i < lista.length; i++) {
      if (sentido > 0 ? lista[i] > zoom + 0.001 : lista[i] < zoom - 0.001) return aplicarZoom(lista[i]);
    }
  }

  function ajustar() {
    var livre = document.getElementById('tela').clientWidth - 24;
    aplicarZoom(Math.min(1, Math.floor(livre / (mapa.offsetWidth || 1) * 100) / 100));
    document.getElementById('tela').scrollTo(0, 0);
  }

  /* (cx, cy): o ponto da janela que fica parado — o rato, ou o meio da tela */
  function aplicarZoom(z, cx, cy) {
    z = Math.max(MIN, Math.min(MAX, Math.round(z * 100) / 100));
    var tela = document.getElementById('tela');
    var r = tela.getBoundingClientRect();
    if (cx === undefined) { cx = r.left + tela.clientWidth / 2; cy = r.top + tela.clientHeight / 2; }
    var px = (tela.scrollLeft + cx - r.left) / zoom, py = (tela.scrollTop + cy - r.top) / zoom;
    zoom = z;
    if (mapa) mapa.style.zoom = String(z);
    tela.scrollLeft = px * z - (cx - r.left);
    tela.scrollTop = py * z - (cy - r.top);
    var v = document.querySelector('.fluxo__zoom-valor');
    if (v) v.textContent = Math.round(z * 100) + '%';
    try { localStorage.setItem(CHAVE_ZOOM, String(z)); } catch (e) {}
    agendar();
  }

  /* quanto vale um px do mapa no ecrã do computador */
  function escala() {
    if (!mapa || !mapa.offsetWidth) return 1;
    return mapa.getBoundingClientRect().width / mapa.offsetWidth;
  }

  /* ---------- as setas ---------- */
  function agendar() {
    if (pedido || !mapa) return;
    pedido = requestAnimationFrame(function () { pedido = 0; desenhar(); });
  }

  function caixa(el, m, k) {
    var r = el.getBoundingClientRect();
    return { x: (r.left - m.left) / k, y: (r.top - m.top) / k, l: r.width / k, a: r.height / k };
  }

  function seta(d, chave) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('marker-end', 'url(#fluxo-ponta)');
    if (desvios[chave]) p.setAttribute('class', 'fluxo__seta--movida');
    if (chave === aArrastar) p.setAttribute('class', 'fluxo__seta--agarrada');
    svg.appendChild(p);
    if (!editavel) return;
    // a linha tem 2 px; agarra-se por uma mais larga e invisível por cima
    var toque = document.createElementNS(NS, 'path');
    toque.setAttribute('d', d);
    toque.setAttribute('class', 'fluxo__toque');
    toque.dataset.chave = chave;
    svg.appendChild(toque);
  }

  /* ---------- mover as setas ----------
     Arrasta-se a seta pelo meio: na horizontal muda o corredor por onde
     desce, na vertical a faixa por onde passa (ou a altura a que entra no
     ecrã do lado). As pontas ficam presas à peça e ao ecrã. Duplo clique
     devolve-a ao traçado automático. Fica no navegador, como o resto do
     editor. */
  var aArrastar = null, arrasto = null;
  var pecas = {};       // chave da seta -> a peça de onde sai (refeito a cada desenho)
  var ligando = null;   // a arrastar uma seta nova, ou a ponta de uma que já existe

  function bolinha(x, y, classe, chave) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 7);
    c.setAttribute('class', classe);
    if (chave) c.dataset.chave = chave;
    svg.appendChild(c);
  }

  /* ---------- criar setas e mudá-las de ecrã ----------
     Como no protótipo do Figma: a peça escolhida ganha uma bolinha à direita,
     e arrastá-la para um ecrã cria a ligação. A ponta de uma seta que já
     existe arrasta-se para outro ecrã, e a seta passa a levar lá. Quem grava
     é o editor (mudarLigacao): fica no histórico, no navegador e no CSS. */
  function pontoNoMapa(ev) {
    var m = mapa.getBoundingClientRect(), k = escala();
    return [(ev.clientX - m.left) / k, (ev.clientY - m.top) / k];
  }

  function ecraSob(ev) {
    var el = document.elementFromPoint(ev.clientX, ev.clientY);
    return el && el.closest ? el.closest('.fluxo .ecra') : null;
  }

  function marcarAlvo(ecra) {
    var antes = mapa.querySelector('.ecra--alvo-seta');
    if (antes && antes !== ecra) antes.classList.remove('ecra--alvo-seta');
    if (ecra) ecra.classList.add('ecra--alvo-seta');
  }

  function comecarLigacao(ev, peca) {
    var m = mapa.getBoundingClientRect(), k = escala(), r = peca.getBoundingClientRect();
    ligando = { peca: peca, x: (r.right - m.left) / k + 2, y: (r.top + r.height / 2 - m.top) / k };
    ligando.linha = document.createElementNS(NS, 'path');
    ligando.linha.setAttribute('class', 'fluxo__provisoria');
    ligando.linha.setAttribute('marker-end', 'url(#fluxo-ponta)');
    svg.appendChild(ligando.linha);
    document.body.classList.add('fluxo-a-ligar');
    duranteLigacao(ev);
  }

  function duranteLigacao(ev) {
    var q = pontoNoMapa(ev);
    var meio = (ligando.x + q[0]) / 2;
    ligando.linha.setAttribute('d', 'M' + ligando.x + ' ' + ligando.y + ' C' + meio + ' ' + ligando.y + ' ' + meio + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]);
    var alvo = ecraSob(ev);
    // o próprio ecrã da peça não é destino: uma seta para si mesmo não leva a lado nenhum
    marcarAlvo(alvo && !alvo.contains(ligando.peca) ? alvo : null);
  }

  function acabarLigacao(ev) {
    var alvo = ecraSob(ev), l = ligando;
    ligando = null;
    marcarAlvo(null);
    document.body.classList.remove('fluxo-a-ligar');
    if (l.linha.parentNode) l.linha.remove();
    if (alvo && !alvo.contains(l.peca) && window.PdaEditor && window.PdaEditor.mudarLigacao) {
      window.PdaEditor.mudarLigacao(l.peca, alvo.dataset.ecra);
    }
    agendar();
  }

  function guardarDesvios() {
    try { localStorage.setItem(CHAVE_SETAS, JSON.stringify(desvios)); } catch (e) {}
  }

  function moverSetas() {
    // criar (bolinha da peça escolhida) ou mudar o destino (ponta da seta)
    window.addEventListener('mousedown', function (ev) {
      var h = ev.target.closest && ev.target.closest('.fluxo__nova, .fluxo__ponta');
      if (!mapa || !h || ev.button !== 0) return;
      ev.preventDefault(); ev.stopPropagation();
      var peca = h.classList.contains('fluxo__nova')
        ? document.querySelector('[data-ed-sel]') && (document.querySelector('[data-ed-sel]').closest('[data-ir]') || document.querySelector('[data-ed-sel]'))
        : pecas[h.dataset.chave];
      if (peca) comecarLigacao(ev, peca);
    }, true);
    window.addEventListener('mousemove', function (ev) {
      if (!ligando) return;
      ev.stopPropagation();
      duranteLigacao(ev);
    }, true);
    window.addEventListener('mouseup', function (ev) {
      if (!ligando) return;
      ev.stopPropagation();
      acabarLigacao(ev);
      window.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
    }, true);

    window.addEventListener('mousedown', function (ev) {
      var t = ev.target.closest && ev.target.closest('.fluxo__toque');
      if (!mapa || !t || ev.button !== 0 || document.body.classList.contains('fluxo-mao')) return;
      ev.preventDefault(); ev.stopPropagation();
      var base = desvios[t.dataset.chave] || { x: 0, y: 0 };
      arrasto = { chave: t.dataset.chave, x0: ev.clientX, y0: ev.clientY, bx: base.x, by: base.y, moveu: false };
    }, true);
    window.addEventListener('mousemove', function (ev) {
      if (!arrasto) return;
      ev.stopPropagation();
      if (!arrasto.moveu && Math.abs(ev.clientX - arrasto.x0) + Math.abs(ev.clientY - arrasto.y0) < 4) return;
      if (!arrasto.moveu) { arrasto.moveu = true; aArrastar = arrasto.chave; document.body.classList.add('fluxo-a-mover'); }
      var k = escala();
      desvios[aArrastar] = { x: Math.round(arrasto.bx + (ev.clientX - arrasto.x0) / k),
                             y: Math.round(arrasto.by + (ev.clientY - arrasto.y0) / k) };
      agendar();
    }, true);
    window.addEventListener('mouseup', function (ev) {
      if (!arrasto) return;
      ev.stopPropagation();
      var moveu = arrasto.moveu;
      arrasto = null; aArrastar = null;
      // um clique sem arrastar não redesenha: senão o duplo clique perdia a seta
      if (!moveu) return;
      document.body.classList.remove('fluxo-a-mover');
      guardarDesvios(); agendar();
      window.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
    }, true);
    window.addEventListener('dblclick', function (ev) {
      var t = ev.target.closest && ev.target.closest('.fluxo__toque');
      if (!t) return;
      ev.stopPropagation(); ev.preventDefault();
      delete desvios[t.dataset.chave];
      guardarDesvios(); agendar();
    }, true);
  }

  /* Uma linha quebrada com os cantos arredondados. */
  function recto(pts, r) {
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++) {
      var a = pts[i - 1], b = pts[i], c = pts[i + 1];
      var r1 = Math.min(r, dist(a, b) / 2, dist(b, c) / 2);
      var p1 = rumo(b, a, r1), p2 = rumo(b, c, r1);
      d += ' L' + p1[0] + ' ' + p1[1] + ' Q' + b[0] + ' ' + b[1] + ' ' + p2[0] + ' ' + p2[1];
    }
    var f = pts[pts.length - 1];
    return d + ' L' + f[0] + ' ' + f[1];
  }
  function dist(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }
  function rumo(de, para, r) {
    var l = dist(de, para) || 1;
    return [de[0] + (para[0] - de[0]) / l * r, de[1] + (para[1] - de[1]) / l * r];
  }

  function desenhar() {
    if (!mapa) return;
    [].slice.call(svg.childNodes).forEach(function (n) {
      if (n.nodeName !== 'defs' && !(ligando && n === ligando.linha)) n.remove();
    });
    pecas = {};
    svg.setAttribute('width', mapa.offsetWidth);
    svg.setAttribute('height', mapa.offsetHeight);

    /* O mapa como página: o PDF sai numa folha só, do tamanho do mapa. */
    var pagina = document.getElementById('fluxo-pagina') || document.head.appendChild(document.createElement('style'));
    pagina.id = 'fluxo-pagina';
    pagina.textContent = '@page { size: ' + mapa.offsetWidth + 'px ' + mapa.offsetHeight + 'px; margin: 0 }';

    var m = mapa.getBoundingClientRect(), k = escala();
    // várias peças para o mesmo ecrã chegam-lhe em sítios diferentes
    var chegadas = {}, saidas = {}, faixas = {};

    [].slice.call(mapa.querySelectorAll('[data-ir]')).forEach(function (peca) {
      var destino = mapa.querySelector('.ecra[data-ecra="' + peca.dataset.ir + '"] > .pda');
      var origem = peca.closest('.ecra > .pda');
      if (!destino || !origem || destino === origem) return;
      // um ecrã escondido pelo filtro não recebe nem dá setas
      if (destino.closest('.fluxo--fora') || origem.closest('.fluxo--fora')) return;
      var p = caixa(peca, m, k), o = caixa(origem, m, k), d = caixa(destino, m, k);

      var alvo = document.createElementNS(NS, 'rect');
      alvo.setAttribute('x', p.x - 2); alvo.setAttribute('y', p.y - 2);
      alvo.setAttribute('width', p.l + 4); alvo.setAttribute('height', p.a + 4);
      alvo.setAttribute('rx', 6);
      alvo.setAttribute('class', 'fluxo__alvo');
      svg.appendChild(alvo);

      var n = chegadas[peca.dataset.ir] = (chegadas[peca.dataset.ir] || 0) + 1;
      // a chave: de que ecrã, qual das ligações dele, para onde
      var ligacoes = [].slice.call(origem.querySelectorAll('[data-ir]'));
      var chave = origem.parentNode.dataset.ecra + '#' + ligacoes.indexOf(peca) + '>' + peca.dataset.ir;
      var dv = desvios[chave] || { x: 0, y: 0 };
      pecas[chave] = peca;
      var x1 = p.x + p.l + 2, y1 = p.y + p.a / 2;
      var mesmaLinha = Math.abs(o.y - d.y) < 4;
      var vizinho = mesmaLinha && d.x > o.x && d.x - (o.x + o.l) < 200;
      // uma peça que não encosta à direita do ecrã sai por baixo dele, senão riscava as do lado
      var aDireita = o.x + o.l - (p.x + p.l) < 40;

      if (vizinho && aDireita) {
        // para o ecrã ao lado: sai pela direita e entra à mesma altura, se puder
        var y2 = Math.max(d.y + 12, Math.min(d.y + d.a - 12,
                 Math.max(d.y + 24, Math.min(y1, d.y + d.a - 24)) + (n - 1) * 26 + dv.y));
        var meio = Math.max(x1 + 26, Math.min(d.x - 26, o.x + o.l + (d.x - o.x - o.l) / 2 + dv.x));
        seta('M' + x1 + ' ' + y1 + ' H' + (meio - 24) +
             ' C' + (meio + 8) + ' ' + y1 + ' ' + (meio - 8) + ' ' + y2 + ' ' + (d.x - 3) + ' ' + y2, chave);
        if (editavel) bolinha(d.x - 3, y2, 'fluxo__ponta', chave);
      } else {
        /* Para longe, para trás ou para outra linha: sai para o corredor à
           direita da origem, segue por ele até à faixa por cima da linha do
           destino, depois por ela, e desce ao ecrã. Nunca passa por cima de um. */
        var id = origem.parentNode.dataset.ecra;
        var s = saidas[id] = (saidas[id] || 0) + 1;
        var xc = o.x + o.l + 16 + (s - 1) * 10 + dv.x;
        var yf = d.y - 22 - ((faixas[d.y] = (faixas[d.y] || 0) + 1) - 1) * 5 + dv.y;
        var xd = d.x + d.l / 2 + (n - 1) * 24;
        // por baixo do ecrã há uma faixa livre antes do nome: é por ela que se sai
        var yb = o.y + o.a + 10 + (s - 1) * 6;
        var inicio = aDireita ? [[x1, y1], [xc, y1]]
          : [[p.x + p.l / 2, p.y + p.a + 2], [p.x + p.l / 2, yb], [xc, yb]];
        seta(recto(inicio.concat([[xc, yf], [xd, yf], [xd, d.y - 3]]), 10), chave);
        if (editavel) bolinha(xd, d.y - 3, 'fluxo__ponta', chave);
      }
    });

    // a peça escolhida ganha a bolinha de onde se puxa uma seta nova
    var escolhida = editavel && mapa.querySelector('.ecra > .pda [data-ed-sel]');
    if (escolhida) {
      var de = escolhida.closest('[data-ir]') || escolhida;
      var cx = caixa(de, m, k);
      bolinha(cx.x + cx.l + 2, cx.y + cx.a / 2, 'fluxo__nova');
    }
  }

  function mostrar(id) {
    var e = mapa && mapa.querySelector('.ecra[data-ecra="' + id + '"]');
    if (e) e.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
  }

  window.addEventListener('resize', agendar);
  // a tradução corre no fim do DOMContentLoaded e mexe no tamanho do texto
  // Aqui por temporizador e não por fotograma: o Chrome sem ecrã do gerar.sh
  // não chega a pintar um fotograma antes de fotografar.
  window.addEventListener('load', function () {
    setTimeout(desenhar, 50);
    if (document.fonts) document.fonts.ready.then(function () { setTimeout(desenhar, 50); });
  });

  /* ---------- o fluxo por escrito ----------
     O mesmo que o mapa, em texto: cada fluxo com o que é, cada ecrã com para
     que serve e para onde leva cada botão ou leitura. Lê os ecrãs no momento
     (data-fluxo, data-objetivo, data-ir), por isso não há texto para manter
     à parte. É o que a aba «Texto» do editor mostra. */
  function limpo(no) {
    return (no.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function rotuloDe(el) {
    var n = el.querySelector('.tarefa__titulo, .fazer__nome, .quadrado__nome, .atalho__nome, .camiao__nome, .folha__opcao');
    if (n) return limpo(n);
    var c = el.cloneNode(true);
    [].slice.call(c.querySelectorAll('svg, .navegacao__contador, .abas-fundo__contador, .camiao__linha')).forEach(function (x) { x.remove(); });
    return limpo(c) || 'Voltar';
  }

  function texto() {
    var ecras = [].slice.call(document.querySelectorAll('.ecra:not(.ecra--marca)'));
    var nomes = {};
    ecras.forEach(function (e) { nomes[e.dataset.ecra] = e.dataset.nome || e.dataset.ecra; });
    var fluxos = document.getElementById('fluxos');
    function descricao(f) {
      if (!fluxos) return '';
      var ps = [].slice.call(fluxos.content.querySelectorAll('p'));
      for (var i = 0; i < ps.length; i++) if (ps[i].dataset.fluxo === f) return ps[i].textContent;
      return '';
    }
    function el(tag, classe, txt) {
      var n = document.createElement(tag);
      if (classe) n.className = classe;
      if (txt != null) n.textContent = txt;
      return n;
    }
    function ligacao(id) {
      var b = el('button', 'texto-fluxo__ecra', nomes[id] || id);
      b.type = 'button';
      b.dataset.irEcra = id;
      return b;
    }

    var art = el('article', 'texto-fluxo');
    art.appendChild(el('h1', 'texto-fluxo__titulo', 'O fluxo do PDA, por escrito'));
    art.appendChild(el('p', 'texto-fluxo__intro', 'Cada fluxo, o que é, e cada ecrã: para que serve e para onde leva cada botão ou leitura. Clica num ecrã para o abrir.'));

    var filtro = el('div', 'texto-fluxo__filtro');
    FUNCOES.forEach(function (par) {
      var b = el('button', null, par[1]);
      b.type = 'button';
      b.dataset.funcao = par[0];
      b.setAttribute('aria-pressed', String(par[0] === 'todas'));
      filtro.appendChild(b);
    });
    art.appendChild(filtro);

    var diagrama = el('section', 'texto-fluxo__diagrama');
    diagrama.appendChild(el('h2', null, 'Diagrama de fluxo — visão geral'));
    diagrama.appendChild(el('p', 'texto-fluxo__descricao', 'Os fluxos e para onde se segue de cada um. As setas tracejadas são as voltas à fila ou ao início, juntas na caixa de baixo. Cada fluxo, mais abaixo, tem o seu diagrama com todas as situações: cada caixa é um ecrã, cada seta é um botão ou uma leitura, com o que se carrega escrito nela. As caixas tracejadas são ecrãs de outro fluxo.'));
    var tela = el('div', 'texto-fluxo__tela');
    tela.appendChild(el('p', 'texto-fluxo__sem', 'A desenhar…'));
    diagrama.appendChild(tela);
    art.appendChild(diagrama);

    var seccao = null, atual = null;
    ecras.forEach(function (e) {
      if (e.dataset.fluxo !== atual) {
        atual = e.dataset.fluxo;
        seccao = el('section', 'texto-fluxo__seccao');
        seccao.appendChild(el('h2', null, atual));
        var d = descricao(atual);
        if (d) seccao.appendChild(el('p', 'texto-fluxo__descricao', d));
        var telaFluxo = el('div', 'texto-fluxo__tela texto-fluxo__tela--fluxo');
        telaFluxo.appendChild(el('p', 'texto-fluxo__sem', 'A desenhar…'));
        seccao.appendChild(telaFluxo);
        desenharEm(telaFluxo, codigoFluxo(atual, ecras));
        art.appendChild(seccao);
      }
      var bloco = el('div', 'texto-fluxo__bloco');
      bloco.dataset.funcao = e.dataset.funcao || 'todas';
      var h = el('h3');
      h.appendChild(ligacao(e.dataset.ecra));
      bloco.appendChild(h);
      if (e.dataset.objetivo) {
        var obj = el('p', 'texto-fluxo__objetivo');
        obj.appendChild(el('span', 'texto-fluxo__rotulo', 'Objetivo'));
        obj.appendChild(el('span', null, e.dataset.objetivo));
        bloco.appendChild(obj);
      }
      var saidas = [].slice.call(e.querySelectorAll('.pda [data-ir]'));
      if (saidas.length) {
        var ul = el('ul', 'texto-fluxo__saidas');
        saidas.forEach(function (s) {
          var li = el('li');
          if (s.classList.contains('leitor')) {
            li.appendChild(el('span', 'texto-fluxo__leitura', 'Leitura'));
            li.appendChild(el('span', null, limpo(s)));
          } else {
            li.appendChild(el('span', 'texto-fluxo__botao', rotuloDe(s)));
          }
          li.appendChild(el('span', 'texto-fluxo__seta', '→'));
          li.appendChild(ligacao(s.dataset.ir));
          ul.appendChild(li);
        });
        bloco.appendChild(ul);
      } else {
        bloco.appendChild(el('p', 'texto-fluxo__sem', 'Não leva a lado nenhum.'));
      }
      seccao.appendChild(bloco);
    });

    // ---- no fim: os casos de uso, com o diagrama e quem faz o quê
    var casos = casosDeUso(ecras, el, ligacao);
    if (casos) art.appendChild(casos.seccao);

    filtro.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      var f = b.dataset.funcao;
      if (casos) casos.filtrar(f);
      [].slice.call(filtro.children).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      desenharDiagrama(tela, ecras, f);
      // as secções dos fluxos; a dos casos de uso filtra-se a si mesma
      [].slice.call(art.querySelectorAll('.texto-fluxo__seccao:not(.texto-fluxo__casos)')).forEach(function (sec) {
        var algum = false;
        [].slice.call(sec.querySelectorAll('.texto-fluxo__bloco')).forEach(function (bl) {
          var fica = f === 'todas' || bl.dataset.funcao === 'todas' || bl.dataset.funcao === f;
          bl.hidden = !fica;
          algum = algum || fica;
        });
        sec.hidden = !algum;
      });
    });
    desenharDiagrama(tela, ecras, 'todas');
    return art;
  }

  /* ---------- os casos de uso ----------
     Vêm do <template id="casos-de-uso"> (o dossiê, com as decisões tomadas
     depois); os ecrãs de cada um saem do data-refs de cada ecrã. */
  var NOME_ATOR = { arrumacao: 'Arrumação', separacao: 'Separação', expedicao: 'Expedição',
                    gestor: 'Gestor', motor: 'Motor', todas: 'Todos' };
  var AREAS = [['arrumacao', 'Arrumação'], ['separacao', 'Separação'], ['expedicao', 'Expedição'],
               ['gestor', 'Gestor'], ['todas', 'Transversais'], ['fora', 'Fora ou v2']];

  function lerCasos() {
    var t = document.getElementById('casos-de-uso');
    if (!t) return [];
    return [].slice.call(t.content.querySelectorAll('p')).map(function (p) {
      var atores = (p.dataset.atores || '').split(/\s+/).filter(Boolean);
      var estado = p.dataset.estado || '';
      var area = estado ? 'fora' : (atores.filter(function (a) { return a !== 'motor'; })[0] || 'todas');
      return { id: p.dataset.cu, nome: p.textContent, atores: atores, estado: estado, nota: p.dataset.nota || '', area: area };
    });
  }

  function casoServe(c, funcao) {
    return funcao === 'todas' || c.atores.indexOf('todas') >= 0 || c.atores.indexOf(funcao) >= 0;
  }

  /* Como um diagrama de casos de uso: os atores à esquerda, os casos numa
     coluna à direita, uma linha de cada ator para cada caso que faz. Os que
     ficaram fora (ou são da v2) não entram: estão na lista, riscados. */
  function codigoCasos(casos, funcao) {
    var dentro = casos.filter(function (c) { return !c.estado && casoServe(c, funcao); });
    var linhas = ['flowchart LR'], atores = [];
    ['arrumacao', 'separacao', 'expedicao', 'gestor', 'todas', 'motor'].forEach(function (a) {
      if (funcao !== 'todas' && a !== funcao && a !== 'todas' && a !== 'motor') return;
      if (!dentro.some(function (c) { return c.atores.indexOf(a) >= 0; })) return;
      atores.push(a);
      linhas.push('  A_' + a + '([' + aspas(NOME_ATOR[a]) + ']):::ator');
    });
    dentro.forEach(function (c) {
      linhas.push('  ' + c.id.replace('-', '') + '(' + aspas(c.id + ' · ' + c.nome) + '):::caso');
    });
    dentro.forEach(function (c) {
      c.atores.forEach(function (a) {
        if (atores.indexOf(a) >= 0) linhas.push('  A_' + a + ' --- ' + c.id.replace('-', ''));
      });
    });
    linhas.push('  classDef ator fill:#00537e,stroke:#00537e,color:#ffffff,font-weight:bold');
    linhas.push('  classDef caso fill:#ffffff,stroke:#00537e,stroke-width:1.5px');
    return linhas.join('\n');
  }

  function casosDeUso(ecras, el, ligacao) {
    var casos = lerCasos();
    if (!casos.length) return null;
    var seccao = el('section', 'texto-fluxo__seccao texto-fluxo__casos');
    seccao.appendChild(el('h2', null, 'Casos de uso'));
    seccao.appendChild(el('p', 'texto-fluxo__descricao', 'Os casos de uso do dossiê, com as decisões tomadas desde então. Cada um diz quem o faz e em que ecrãs está.'));
    seccao.appendChild(el('h3', 'texto-fluxo__sub', 'Diagrama de casos de uso'));
    seccao.appendChild(el('p', 'texto-fluxo__descricao', 'Quem faz o quê: cada ator ligado aos casos de uso que faz. «Todos» são as quatro funções. Os que ficaram fora, ou são da v2, estão só na lista, riscados.'));
    var tela = el('div', 'texto-fluxo__tela');
    tela.appendChild(el('p', 'texto-fluxo__sem', 'A desenhar…'));
    seccao.appendChild(tela);

    var blocos = [];
    casos.forEach(function (c) {
      var b = el('div', 'texto-fluxo__bloco texto-fluxo__caso' + (c.estado ? ' texto-fluxo__caso--fora' : ''));
      var h = el('h3');
      h.appendChild(el('span', 'texto-fluxo__cu', c.id));
      h.appendChild(el('span', null, c.nome));
      if (c.estado) h.appendChild(el('span', 'texto-fluxo__estado', c.estado === 'v2' ? 'v2' : 'Fora'));
      b.appendChild(h);
      if (c.atores.length) {
        var pa = el('p', 'texto-fluxo__objetivo');
        pa.appendChild(el('span', 'texto-fluxo__rotulo', 'Atores'));
        pa.appendChild(el('span', null, c.atores.map(function (a) { return NOME_ATOR[a] || a; }).join(' · ')));
        b.appendChild(pa);
      }
      var usados = ecras.filter(function (e) { return (' ' + (e.dataset.refs || '') + ' ').indexOf(' ' + c.id + ' ') >= 0; });
      var pe = el('p', 'texto-fluxo__objetivo');
      pe.appendChild(el('span', 'texto-fluxo__rotulo', 'Ecrãs'));
      if (usados.length) usados.forEach(function (e, i) {
        if (i) pe.appendChild(document.createTextNode(' '));
        pe.appendChild(ligacao(e.dataset.ecra));
      });
      else pe.appendChild(el('span', 'texto-fluxo__sem', c.estado ? '—' : 'Ainda sem ecrã.'));
      b.appendChild(pe);
      if (c.nota) {
        var pn = el('p', 'texto-fluxo__objetivo');
        pn.appendChild(el('span', 'texto-fluxo__rotulo', 'Nota'));
        pn.appendChild(el('span', null, c.nota));
        b.appendChild(pn);
      }
      blocos.push({ el: b, caso: c });
      seccao.appendChild(b);
    });

    function filtrar(funcao) {
      blocos.forEach(function (x) { x.el.hidden = !casoServe(x.caso, funcao); });
      desenharEm(tela, codigoCasos(casos, funcao));
    }
    filtrar('todas');
    return { seccao: seccao, filtrar: filtrar };
  }

  /* ---------- o diagrama ----------
     Escrito em Mermaid a partir dos mesmos dados (data-fluxo, data-ir) e
     desenhado por ele. A biblioteca está em assets/js/vendor e só se carrega
     quando o diagrama é preciso: sem rede e sem pesar no editor. */
  var aCarregar = null;
  function comMermaid(depois) {
    if (window.mermaid) return depois(window.mermaid);
    if (!aCarregar) {
      aCarregar = [];
      var sc = document.createElement('script');
      sc.src = 'assets/js/vendor/mermaid.min.js';
      sc.onload = function () {
        window.mermaid.initialize({
          startOnLoad: false, securityLevel: 'strict', theme: 'base',
          fontFamily: 'Roboto, Arial, sans-serif',
          themeVariables: {
            primaryColor: '#ffffff', primaryBorderColor: '#00537e', primaryTextColor: '#222428',
            lineColor: '#1a73e8', clusterBkg: '#f4f5f7', clusterBorder: '#bfc0c2',
            edgeLabelBackground: '#ffffff', fontSize: '14px'
          },
          flowchart: { curve: 'basis', nodeSpacing: 36, rankSpacing: 56, padding: 10, htmlLabels: true }
        });
        aCarregar.forEach(function (fn) { fn(window.mermaid); });
        aCarregar = null;
      };
      document.head.appendChild(sc);
    }
    aCarregar.push(depois);
  }

  function aspas(t) {
    return '"' + String(t).replace(/"/g, '#quot;').replace(/[<>]/g, '') + '"';
  }

  var CLASSES = [
    '  classDef arrumacao fill:#ffffff,stroke:#00537e,stroke-width:2px',
    '  classDef separacao fill:#ffffff,stroke:#367c2b,stroke-width:2px',
    '  classDef expedicao fill:#ffffff,stroke:#a2451c,stroke-width:2px',
    '  classDef gestor fill:#ffffff,stroke:#52514e,stroke-width:2px',
    '  classDef todas fill:#eceff3,stroke:#012338,stroke-width:2px',
    '  classDef fora fill:#f4f5f7,stroke:#bfc0c2,color:#52514e,stroke-dasharray:4 3'
  ];

  function rotuloSeta(s) {
    var r = s.classList.contains('leitor') ? 'leitura' : rotuloDe(s);
    return r.length > 28 ? r.slice(0, 27) + '…' : r;
  }

  /* A visão geral: os fluxos, e por onde se passa de um para outro. */
  function codigoGeral(ecras) {
    var fluxoDe = {}, ordem = [], ids = {};
    ecras.forEach(function (e) {
      fluxoDe[e.dataset.ecra] = e.dataset.fluxo;
      if (ordem.indexOf(e.dataset.fluxo) < 0) ordem.push(e.dataset.fluxo);
    });
    ordem.forEach(function (f, i) { ids[f] = 'F' + i; });
    var linhas = ['flowchart TD'], vistas = {};
    ordem.forEach(function (f) { linhas.push('  ' + ids[f] + '[' + aspas(f) + ']'); });
    /* As voltas ao princípio (à fila e ao início) vão para uma caixa própria,
       em baixo: assim tudo corre de cima para baixo e nenhuma seta sobe. */
    var principio = ordem[0], comVolta = false;
    ecras.forEach(function (e) {
      [].slice.call(e.querySelectorAll('.pda [data-ir]')).forEach(function (s) {
        var de = e.dataset.fluxo, para = fluxoDe[s.dataset.ir];
        if (!para || para === de || vistas[de + '>' + para]) return;
        vistas[de + '>' + para] = true;
        if (para === principio) { comVolta = true; linhas.push('  ' + ids[de] + ' -.-> VOLTA'); }
        else linhas.push('  ' + ids[de] + ' --> ' + ids[para]);
      });
    });
    if (comVolta) {
      linhas.push('  VOLTA([' + aspas('↩ Volta à fila ou ao início · ' + principio) + ']):::volta');
      linhas.push('  classDef volta fill:#eceff3,stroke:#00537e,stroke-dasharray:4 3,color:#00537e');
    }
    linhas.push('  classDef fluxo fill:#ffffff,stroke:#00537e,stroke-width:2px,font-weight:bold');
    linhas.push('  class ' + ordem.map(function (f) { return ids[f]; }).join(',') + ' fluxo');
    return linhas.join('\n');
  }

  /* Um fluxo por inteiro: os seus ecrãs, cada botão e leitura. O que vem de
     outro fluxo, ou vai para outro, fica numa caixa tracejada à parte. */
  function codigoFluxo(fluxo, ecras) {
    var nomes = {}, fluxoDe = {};
    ecras.forEach(function (e) { nomes[e.dataset.ecra] = e.dataset.nome || e.dataset.ecra; fluxoDe[e.dataset.ecra] = e.dataset.fluxo; });
    var meus = ecras.filter(function (e) { return e.dataset.fluxo === fluxo; });
    var linhas = ['flowchart TD'], fora = {}, n = 0;
    function caixaFora(chave, texto) {
      if (!fora[chave]) { fora[chave] = 'x' + (++n); linhas.push('  ' + fora[chave] + '([' + aspas(texto) + ']):::fora'); }
      return fora[chave];
    }
    meus.forEach(function (e) {
      linhas.push('  ' + e.dataset.ecra + '[' + aspas(nomes[e.dataset.ecra]) + ']:::' + (e.dataset.funcao || 'todas'));
    });
    /* De onde se vem, de outros fluxos. No primeiro fluxo voltam todos, por
       isso lá as voltas juntam-se numa caixa por fluxo de origem, com os ecrãs
       dele («↩ de Receber o que chega · 07»), e uma seta por destino. */
    var principio = ecras.length ? ecras[0].dataset.fluxo : null;
    // o primeiro fluxo lê-se da esquerda para a direita: de onde se volta, o
    // início e a fila, e para onde se vai
    if (fluxo === principio) linhas[0] = 'flowchart LR';
    if (fluxo === principio) {
      var grupos = {}, ordemGrupos = [];
      ecras.forEach(function (e) {
        if (e.dataset.fluxo === fluxo) return;
        [].slice.call(e.querySelectorAll('.pda [data-ir]')).forEach(function (s) {
          if (fluxoDe[s.dataset.ir] !== fluxo) return;
          var g = grupos[e.dataset.fluxo];
          if (!g) { g = grupos[e.dataset.fluxo] = { ecras: [], setas: {} }; ordemGrupos.push(e.dataset.fluxo); }
          var num = (nomes[e.dataset.ecra] || '').split(' · ')[0];
          if (g.ecras.indexOf(num) < 0) g.ecras.push(num);
          var r = rotuloSeta(s);
          g.setas[s.dataset.ir] = g.setas[s.dataset.ir] || [];
          if (g.setas[s.dataset.ir].indexOf(r) < 0) g.setas[s.dataset.ir].push(r);
        });
      });
      ordemGrupos.forEach(function (nomeFluxo) {
        var g = grupos[nomeFluxo];
        var caixa = caixaFora('grupo' + nomeFluxo, '↩ de ' + nomeFluxo + ' · ' + g.ecras.join(', '));
        Object.keys(g.setas).forEach(function (alvo) {
          linhas.push('  ' + caixa + ' -. ' + aspas(g.setas[alvo].join(' / ')) + ' .-> ' + alvo);
        });
      });
    }
    ecras.forEach(function (e) {
      if (e.dataset.fluxo === fluxo || fluxo === principio) return;
      [].slice.call(e.querySelectorAll('.pda [data-ir]')).forEach(function (s) {
        if (fluxoDe[s.dataset.ir] !== fluxo) return;
        var de = caixaFora('de' + e.dataset.ecra, nomes[e.dataset.ecra]);
        linhas.push('  ' + de + ' -. ' + aspas(rotuloSeta(s)) + ' .-> ' + s.dataset.ir);
      });
    });
    // dentro do fluxo, e para fora; dois botões para o mesmo sítio são uma seta só
    meus.forEach(function (e) {
      var setas = {}, ordemSetas = [];
      [].slice.call(e.querySelectorAll('.pda [data-ir]')).forEach(function (s) {
        var alvo = s.dataset.ir;
        if (!nomes[alvo] || alvo === e.dataset.ecra) return;
        var r = rotuloSeta(s);
        if (!setas[alvo]) { setas[alvo] = []; ordemSetas.push(alvo); }
        if (setas[alvo].indexOf(r) < 0) setas[alvo].push(r);
      });
      ordemSetas.forEach(function (alvo) {
        var r = aspas(setas[alvo].join(' / '));
        if (fluxoDe[alvo] === fluxo) linhas.push('  ' + e.dataset.ecra + ' -- ' + r + ' --> ' + alvo);
        else linhas.push('  ' + e.dataset.ecra + ' -. ' + r + ' .-> ' + caixaFora('para' + alvo, '→ ' + nomes[alvo]));
      });
    });
    return linhas.concat(CLASSES).join('\n');
  }

  /* Desenha os diagramas um a um: o Mermaid não gosta de dois ao mesmo tempo. */
  var fila = Promise.resolve(), numeroDiagrama = 0;
  function desenharEm(tela, codigo) {
    tela.dataset.codigo = codigo;
    fila = fila.then(function () {
      return new Promise(function (acabou) {
        comMermaid(function (mm) {
          mm.render('diagrama-fluxo-' + (++numeroDiagrama), codigo).then(function (r) {
            tela.innerHTML = r.svg;
            var svg = tela.querySelector('svg');
            if (svg) {
              // ao tamanho natural, para se ler; o que for mais largo desliza para o lado
              var vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
              if (vb.length === 4) { svg.style.width = vb[2] + 'px'; svg.style.maxWidth = 'none'; }
              svg.removeAttribute('height');
            }
            avisarDeslizar(tela);
            // cada caixa de ecrã abre o ecrã, como os nomes do texto
            [].slice.call(tela.querySelectorAll('g.node')).forEach(function (g) {
              var m = (g.id || '').match(/flowchart-([a-z]\d)-/);
              if (m && document.querySelector('.ecra[data-ecra="' + m[1] + '"]')) {
                g.setAttribute('data-ir-ecra', m[1]); g.style.cursor = 'pointer';
              }
            });
            acabou();
          }).catch(function (e) {
            tela.textContent = 'O diagrama não se desenhou: ' + (e && e.message ? e.message : e);
            acabou();
          });
        });
      });
    });
  }

  /* Se o diagrama não cabe, diz-se por cima que desliza — e arrasta-se com o
     rato, como uma folha. */
  function avisarDeslizar(tela) {
    var aviso = tela.previousElementSibling;
    if (!aviso || !aviso.classList.contains('texto-fluxo__deslizar')) {
      aviso = document.createElement('p');
      aviso.className = 'texto-fluxo__deslizar';
      aviso.textContent = 'Desliza para o lado →';
      tela.parentNode.insertBefore(aviso, tela);
    }
    requestAnimationFrame(function () {
      aviso.hidden = tela.scrollWidth <= tela.clientWidth + 2;
      if (window.PdaTraducao) window.PdaTraducao.aplicar();
    });
    if (tela.dataset.arrasto) return;
    tela.dataset.arrasto = '1';
    var ini = null;
    tela.addEventListener('mousedown', function (ev) {
      if (ev.button !== 0 || ev.target.closest('[data-ir-ecra]')) return;
      ini = { x: ev.clientX, y: ev.clientY, l: tela.scrollLeft, t: tela.scrollTop };
      tela.classList.add('a-arrastar');
      ev.preventDefault();
    });
    window.addEventListener('mousemove', function (ev) {
      if (!ini) return;
      tela.scrollLeft = ini.l - (ev.clientX - ini.x);
      tela.scrollTop = ini.t - (ev.clientY - ini.y);
    });
    window.addEventListener('mouseup', function () {
      if (!ini) return;
      ini = null;
      tela.classList.remove('a-arrastar');
    });
  }

  function desenharDiagrama(tela, ecras, funcao) {
    var dentro = ecras.filter(function (e) {
      var f = e.dataset.funcao || 'todas';
      return funcao === 'todas' || f === 'todas' || f === funcao;
    });
    desenharEm(tela, codigoGeral(dentro));
  }

  window.PdaFluxo = {
    texto: texto,
    ligar: ligar, desligar: desligar, desenhar: agendar, mostrar: mostrar, filtrar: filtrar,
    // para levar as setas movidas para o gerar.sh: copiar isto e passar ao ficheiro
    desvios: function () { return JSON.parse(JSON.stringify(desvios)); },
    activo: function () { return !!mapa; },
    escala: escala
  };

  /* #so=fluxo: só o mapa, a 100%, para as capturas */
  if (/so=fluxo\b/.test(location.hash)) {
    document.body.classList.add('so-fluxo');
    ligar(false);
  }
})();
