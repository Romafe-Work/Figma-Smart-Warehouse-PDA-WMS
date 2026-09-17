/* =========================================================
   ARMAZÉM INTELIGENTE — acrescentar peças ao ecrã do PDA

   O editor deixa mudar o que já lá está. Isto deixa pôr o que não está:
   um selo, um alerta, um cartão, um leitor, um botão.

   ── AS PEÇAS SAEM DO SISTEMA DE DESIGN, NÃO DO NADA ─────────────────────────

   Cada peça é escrita com as classes de base.css — `.cartao`, `.selo`,
   `.leitor`, `.btn` — e não com estilo próprio. Nasce já com a cor, a altura,
   o raio e o tamanho de letra de 05-design/03, que são os de core/design. É a
   mesma regra do painel das propriedades: aqui não se inventa nada que o
   Kotlin não tenha já como componente.

   ── ONDE A PEÇA ENTRA, E PORQUE É SEMPRE NO FIM ─────────────────────────────

   A peça entra no FIM do bloco escolhido, nunca a meio. Não é preguiça.

   O editor identifica cada peça por um caminho de classes com `:nth-of-type`
   quando há irmãos iguais — três campos seguidos são `div:nth-of-type(1..3)`.
   Enfiar um campo novo entre o primeiro e o segundo empurra os de baixo, e
   todas as regras de CSS já guardadas para eles passam a apontar para o campo
   errado. **As cores e as folgas que alguém afinou mudavam de peça sozinhas**,
   sem erro nenhum à vista.

   Acrescentar no fim não empurra ninguém. Depois arrasta-se para o sítio, que é
   o que o editor já sabe fazer.
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'pda:editor:pecas';

  /* Igual ao do editor: a paleta tem de funcionar mesmo que a tradução falhe. */
  function traduzirRamo(raiz) {
    if (!window.PdaTraducao || typeof window.PdaTraducao.traduzirRamo !== 'function') return;
    try { window.PdaTraducao.traduzirRamo(raiz); } catch (e) {}
  }

  /* As peças acrescentadas, por ordem de entrada. A ordem importa: uma peça
     posta dentro de outra peça acrescentada só se repõe depois dela. */
  var pecas = [];
  var contador = 0;

  /* ---------------- o catálogo ---------------- */

  /* Um `id` por peça, porque é o que dá ao editor um seletor que não depende da
     posição — e a posição é precisamente o que muda quando se acrescenta. */
  function idNovo(prefixo) {
    contador += 1;
    return prefixo + '-' + contador;
  }

  var LEITOR = '<span class="leitor__icone"><i></i><i></i><i></i><i></i><i></i></span>';

  function peca(tag, classe, dentro) {
    return '<' + tag + ' class="' + classe + '" id="' + idNovo('peca') + '">' + dentro + '</' + tag + '>';
  }

  var CATALOGO = [
    {
      grupo: 'Texto',
      itens: [
        ['Ordem', function () { return peca('p', 'ordem', 'Lê o ARTIGO'); }],
        ['Código de posição', function () { return peca('p', 'codigo', 'C01-E01-N01'); }],
        ['Destaque', function () { return peca('p', 'txt-lead', 'Primeira linha de um cartão'); }],
        ['Texto', function () { return peca('p', 'txt-corpo', 'Texto corrente. Duplo clique para escrever.'); }],
        ['Secundário', function () { return peca('p', 'txt-sec', 'Texto secundário'); }],
        ['Legenda', function () { return peca('p', 'txt-legenda', 'Legenda'); }],
        ['Rótulo', function () { return peca('p', 'rotulo', 'Rótulo'); }]
      ]
    },
    {
      grupo: 'Estado',
      itens: [
        ['Selo neutro', function () { return peca('span', 'selo', 'Neutro'); }],
        ['Selo bom', function () { return peca('span', 'selo selo--bom', 'Seguinte'); }],
        ['Selo aviso', function () { return peca('span', 'selo selo--aviso', 'Atenção'); }],
        ['Selo erro', function () { return peca('span', 'selo selo--erro', 'Apertado'); }],
        ['Alerta bom', function () { return peca('div', 'alerta alerta--bom', '<b class="alerta__titulo">Feito</b>O que ficou registado.'); }],
        ['Alerta aviso', function () { return peca('div', 'alerta alerta--aviso', '<b class="alerta__titulo">Atenção</b>O que a pessoa tem de saber.'); }],
        ['Alerta erro', function () { return peca('div', 'alerta alerta--erro', '<b class="alerta__titulo">Não deu</b>O que correu mal e o que fazer.'); }]
      ]
    },
    {
      grupo: 'Blocos',
      itens: [
        ['Cartão', function () { return peca('div', 'cartao', '<span class="rotulo">Rótulo</span><span class="txt-lead">Primeira linha</span><span class="txt-sec">Segunda linha</span>'); }],
        ['Tarefa', function () { return peca('div', 'tarefa', '<span class="selo">Tipo</span><span class="tarefa__titulo">O que há a fazer</span><span class="tarefa__porque">Porquê: a razão da ordem</span>'); }],
        ['Linha', function () { return peca('div', 'linha', 'Rótulo<span class="linha__valor">Valor</span>'); }],
        ['Leitor', function () { return peca('div', 'leitor', LEITOR + 'Aponta e carrega no gatilho'); }],
        ['Vazio', function () { return peca('div', 'vazio', '<p class="vazio__titulo">Não há nada na tua fila</p><p class="vazio__texto">Quando entrar trabalho para a tua função, aparece aqui.</p>'); }]
      ]
    },
    {
      grupo: 'Botões',
      itens: [
        ['Ação principal', function () { return peca('button', 'btn btn--acao', 'Nova ação'); }],
        ['Secundária', function () { return peca('button', 'btn btn--secundario', 'Outra ação'); }],
        ['Neutra', function () { return peca('button', 'btn', 'Opção'); }]
      ]
    }
  ];

  /* ---------------- onde a peça entra ---------------- */

  /* Blocos que já são feitos para levar peças lá dentro. Procura-se um destes
     a subir a partir do que está escolhido: quem clica num selo quer o selo
     novo ao lado, e não dentro do selo antigo. */
  var RECIPIENTES = '.corpo, .rodape, .cartao, .folha__caixa, .volumes, .atalhos, .numeros';

  function ecraActual() {
    return document.querySelector('.ecra:not([hidden])') || document.querySelector('.ecra');
  }

  function recipiente() {
    var ed = window.PdaEditor;
    var alvo = ed && ed.alvo && ed.alvo();

    if (alvo) {
      var bloco = alvo.closest(RECIPIENTES);
      if (bloco) return bloco;
      // O que está escolhido pode ser ele próprio um contentor — uma secção, um
      // painel. Um botão ou um campo não são, e aí serve o pai.
      if (/^(DIV|SECTION|FORM|FIELDSET|MAIN|ASIDE|NAV|UL|OL)$/.test(alvo.tagName)) return alvo;
      if (alvo.parentElement) return alvo.parentElement;
    }

    var ecra = ecraActual();
    return ecra.querySelector('.corpo') || ecra.querySelector(RECIPIENTES) || ecra;
  }

  /* ---------------- acrescentar, apagar, repor ---------------- */

  function acrescentar(fabrica) {
    var destino = recipiente();
    var html = fabrica();

    destino.insertAdjacentHTML('beforeend', html);
    var novo = destino.lastElementChild;

    var ed = window.PdaEditor;
    pecas.push({
      // O recipiente é guardado pelo seletor do editor, que é o mesmo que as
      // regras de CSS usam. Um seletor próprio aqui era um segundo sítio para
      // a mesma verdade, e os dois um dia discordavam.
      recipiente: ed && ed.seletor ? ed.seletor(destino) : null,
      ecra: destino.closest('.ecra') ? destino.closest('.ecra').dataset.ecra : null,
      html: novo.outerHTML
    });
    guardar();

    if (window.PdaTraducao) window.PdaTraducao.aplicar();
    if (ed && ed.seleccionar) ed.seleccionar(novo);
    if (ed && ed.refrescar) ed.refrescar();
    if (ed && ed.aviso) ed.aviso('Peça acrescentada no fim do bloco');

    novo.scrollIntoView({ block: 'center' });
    pintarLista();
  }

  function apagar(indice) {
    var peca = pecas[indice];
    if (!peca) return;

    var no = document.getElementById(idDe(peca.html));
    if (no) no.remove();

    pecas.splice(indice, 1);
    guardar();

    var ed = window.PdaEditor;
    if (ed && ed.seleccionar) ed.seleccionar(null);
    if (ed && ed.refrescar) ed.refrescar();
    pintarLista();
  }

  function idDe(html) {
    var m = html.match(/\bid="([^"]+)"/);
    return m ? m[1] : '';
  }

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify({ contador: contador, pecas: pecas })); } catch (e) {}
  }

  /**
   * REPÕE AS PEÇAS GUARDADAS.
   *
   * Chamada pelo editor ANTES de ele aplicar os estilos e os textos guardados.
   * A ordem não é detalhe: uma regra de CSS guardada para uma peça que ainda
   * não existe não se aplica a nada, e a peça voltava sem a cor que alguém lhe
   * tinha dado.
   */
  function repor() {
    var guardadas;
    try { guardadas = JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch (e) { guardadas = {}; }

    contador = guardadas.contador || 0;
    pecas = [];

    (guardadas.pecas || []).forEach(function (peca) {
      var destino = null;
      try { destino = peca.recipiente ? document.querySelector(peca.recipiente) : null; } catch (e) {}
      // O ecrã pode ter mudado desde que a peça foi posta. Sem recipiente, a
      // peça não volta — e não volta em silêncio: fica escrito na lista.
      if (!destino) { peca.perdida = true; pecas.push(peca); return; }
      destino.insertAdjacentHTML('beforeend', peca.html);
      pecas.push(peca);
    });

    pintarLista();
  }

  function limpar() {
    pecas.forEach(function (peca) {
      var no = document.getElementById(idDe(peca.html));
      if (no) no.remove();
    });
    pecas = [];
    contador = 0;
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    pintarLista();
  }

  /* ---------------- o painel ---------------- */

  var caixa, lista;

  function montar(onde) {
    caixa = document.createElement('div');
    caixa.className = 'ed-pecas';

    var titulo = document.createElement('p');
    titulo.className = 'ed-seccao__titulo';
    titulo.textContent = 'Acrescentar';
    caixa.appendChild(titulo);

    CATALOGO.forEach(function (grupo) {
      var g = document.createElement('p');
      g.className = 'ed-pecas__grupo';
      g.textContent = grupo.grupo;
      caixa.appendChild(g);

      var grelha = document.createElement('div');
      grelha.className = 'ed-pecas__grelha';
      grupo.itens.forEach(function (item) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ed-peca';
        b.textContent = item[0];
        b.dataset.edDica = 'Acrescentar no fim do bloco escolhido: ' + item[0];
        b.addEventListener('click', function () { acrescentar(item[1]); });
        grelha.appendChild(b);
      });
      caixa.appendChild(grelha);
    });

    lista = document.createElement('div');
    lista.className = 'ed-pecas__lista';
    caixa.appendChild(lista);

    onde.appendChild(caixa);
    pintarLista();
    traduzirRamo(caixa);
  }

  function pintarLista() {
    if (!lista) return;
    lista.textContent = '';
    if (!pecas.length) return;

    var t = document.createElement('p');
    t.className = 'ed-pecas__grupo';
    t.textContent = 'Acrescentadas (' + pecas.length + ')';
    lista.appendChild(t);

    pecas.forEach(function (peca, i) {
      var linha = document.createElement('div');
      linha.className = 'ed-pecas__linha';

      var nome = document.createElement('button');
      nome.type = 'button';
      nome.className = 'ed-pecas__nome';
      nome.textContent = (peca.perdida ? '⚠ ' : '') + idDe(peca.html);
      if (peca.perdida) nome.title = 'O bloco onde esta peça estava já não existe neste ecrã.';
      nome.addEventListener('click', function () {
        var no = document.getElementById(idDe(peca.html));
        if (!no) return;
        if (window.PdaEditor && window.PdaEditor.seleccionar) window.PdaEditor.seleccionar(no);
        no.scrollIntoView({ block: 'center' });
      });

      var fora = document.createElement('button');
      fora.type = 'button';
      fora.className = 'ed-pecas__apagar';
      fora.textContent = '×';
      fora.setAttribute('aria-label', 'Apagar a peça ' + idDe(peca.html));
      fora.addEventListener('click', function () { apagar(i); });

      linha.appendChild(nome);
      linha.appendChild(fora);
      lista.appendChild(linha);
    });
    traduzirRamo(lista);

  }

  /**
   * O HTML das peças acrescentadas, para colar no ficheiro.
   *
   * O editor exporta CSS; isto exporta o que não é CSS. Uma peça nova não é uma
   * regra de estilo — é marcação, e tem de ir para o `index.html` à mão.
   */
  function html() {
    if (!pecas.length) return '';
    return pecas.map(function (peca) {
      return '<!-- no fim de: ' + peca.recipiente + ' -->\n' + peca.html;
    }).join('\n\n');
  }

  window.PdaPecas = {
    montar: montar,
    repor: repor,
    limpar: limpar,
    html: html
  };
})();
