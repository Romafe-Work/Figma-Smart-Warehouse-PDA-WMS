/* =========================================================
   ARMAZÉM INTELIGENTE — português e inglês

   O motor é o do Figma-WebShop-GoParts, sem mudar a ideia: o ecrã está
   escrito em português no HTML, e essa é a fonte. O inglês é uma camada
   por cima — um dicionário do que está escrito para o que se lê, aplicado
   aos nós de texto e aos atributos que se veem.

   Sem chaves no HTML: o ecrã continua a ler-se como o ecrã que é, uma peça
   acrescentada na paleta sai traduzida sem se lhe mexer, e o que falta
   aparece sozinho na consola com `PdaTraducao.porTraduzir()`.

   O preço é o mesmo do GoParts: duas frases iguais em sítios diferentes têm
   a mesma tradução. «Entrar» é «Sign in» no botão e no nome do ecrã, e está
   certo nos dois.

   ── O QUE NÃO SE TRADUZ ─────────────────────────────────────────────────────

   Códigos de posição (C02-E03-N01), números de guia, nomes de pessoas, de
   clientes e de transportadoras, e a versão. Não estão no dicionário, e o
   que não está no dicionário fica como está.

   ── O VOCABULÁRIO ───────────────────────────────────────────────────────────

   arrumação put-away · separação picking · expedição shipping · guia order ·
   posição location · volume parcel · cais dock · lote batch · prateleira de
   preparados staging shelf · leitura scan
   ========================================================= */
(function () {
  'use strict';

  var CHAVE = 'pda:idioma';

  /* Os atributos que uma pessoa lê. `value` fica de fora de propósito: num
     <input> é conteúdo escrito por quem usa o ecrã, não rótulo da casa. */
  var ATRIBUTOS = ['placeholder', 'aria-label', 'title', 'alt', 'data-nome', 'data-ed-dica'];

  var EN = {
    /* ── a página ── */
    'Ecrãs do PDA — Armazém Inteligente': 'PDA screens — Smart Warehouse',

    /* ── fluxos e nomes dos ecrãs (seletor) ── */
    'Entrar e começar o turno': 'Sign in and start the shift',
    'Arrumar uma palete': 'Put away a pallet',
    'Recolher uma guia': 'Pick an order',
    'Da prateleira ao camião': 'From the shelf to the truck',
    'O gestor e as exceções': 'The manager and exceptions',
    'Entrar': 'Sign in',
    'Menu da arrumação': 'Put-away menu',
    'A fila, com o porquê': 'The queue, with the why',
    'Lê o artigo': 'Scan the item',
    'Vai à proposta 1 de 3': 'Go to suggestion 1 of 3',
    'A 1 estava ocupada': 'Number 1 was taken',
    'Lê a posição': 'Scan the location',
    'Arrumada': 'Put away',
    'O lote, já cheio': 'The batch, already full',
    'Paragem: lê a posição': 'Stop: scan the location',
    'Falta quantidade': 'Short quantity',
    'Leva à prateleira de preparados': 'Take it to the staging shelf',
    'Os camiões de hoje': "Today's trucks",
    'Confere volume a volume': 'Check parcel by parcel',
    'Leva ao cais': 'Take it to the dock',
    'Carregar e fechar a saída': 'Load and close the dispatch',
    'Relatório do turno': 'Shift report',
    'O que se passa?': "What's wrong?",
    'Sem ligação': 'No connection',

    /* ── 01 entrar ── */
    'Corredor do armazém da Romafe': 'Aisle in the Romafe warehouse',
    'Armazém Inteligente': 'Smart Warehouse',
    'Rede boa': 'Good signal',
    'Bem-vindo': 'Welcome',
    'Acede ao sistema para começar a trabalhar.': 'Sign in to start working.',
    'Iniciar sessão': 'Sign in',
    'Utiliza o teu utilizador e palavra-passe.': 'Use your username and password.',
    'Utilizador': 'Username',
    'Ex.: 1042 ou marta.silva': 'E.g. 1042 or marta.silva',
    'Palavra-passe': 'Password',
    'Introduz a tua palavra-passe': 'Enter your password',
    'Mostrar a palavra-passe': 'Show the password',
    'Receção': 'Receiving',
    'Armazenamento': 'Storage',
    'Expedição': 'Shipping',

    /* ── faixa ── */
    'Arrumação': 'Put-away',
    'Separação': 'Picking',
    'Gestor': 'Manager',
    'ligado': 'online',

    /* ── 02 e 03 ── */
    'Bom dia, Marta': 'Good morning, Marta',
    'Prioridades de hoje': "Today's priorities",
    'Ações rápidas': 'Quick actions',
    'Ver todas': 'See all',
    'Navegação': 'Navigation',
    'Fila': 'Queue',
    '12 tarefas': '12 tasks',
    'Início': 'Home',
    'Sair': 'Sign out',
    'Turno das 8h · 12 tarefas na tua fila': '8 am shift · 12 tasks in your queue',
    'Receber': 'Receive',
    '3 paletes no cais': '3 pallets at the dock',
    'Arrumar': 'Put away',
    '5 por arrumar': '5 to put away',
    'Contar': 'Count',
    '2 posições': '2 locations',
    'Corrigir posição': 'Fix a location',
    '1 por corrigir': '1 to fix',
    'Consultar artigo': 'Look up an item',
    'Mapa': 'Map',
    'Pedir etiqueta': 'Request a label',
    'Bloquear artigo': 'Block an item',
    'O teu trabalho': 'Your work',
    'Por ordem. A de cima é a seguinte.': 'In order. The top one is next.',
    'Seguinte': 'Next',
    'Arrumar palete · Óleo 5W30 (40 un.)': 'Put away pallet · 5W30 oil (40 pcs)',
    'Porquê: espera há 2h10 — sobe para não ficar esquecida': 'Why: waiting for 2h10 — moved up so it is not forgotten',
    'Contagem': 'Count',
    'Contar C02-E03-N02': 'Count C02-E03-N02',
    'Porquê: houve uma rutura aqui às 9h40': 'Why: this location ran out at 9:40',
    'Palete vazia': 'Empty pallet',
    'Levar palete vazia ao parque': 'Take the empty pallet to the pallet yard',
    'Porquê: esvaziada às 10h02 em C01-E02 (zona de máquina)': 'Why: emptied at 10:02 in C01-E02 (forklift zone)',
    'Com outra pessoa: 2 tarefas · João (Arrumação)': 'With someone else: 2 tasks · João (Put-away)',

    /* ── arrumar ── */
    'Arrumar palete': 'Put away pallet',
    'Lê o ARTIGO': 'Scan the ITEM',
    'A etiqueta da caixa ou da palete que tens à frente': 'The label on the box or pallet in front of you',
    'Esperado': 'Expected',
    'Óleo 5W30 · 5 L': '5W30 oil · 5 L',
    '40 unidades · do cais de entrada': '40 pieces · from the inbound dock',
    'Aponta e carrega no gatilho': 'Aim and press the trigger',
    'Não consigo ler — escrever': "Can't scan — type it",
    'Vai a': 'Go to',
    'Proposta 1 de 3': 'Suggestion 1 of 3',
    'Proposta 2 de 3': 'Suggestion 2 of 3',
    'Zona 10 · Corredor 2 · Estante 3 · Prateleira de baixo': 'Zone 10 · Aisle 2 · Rack 3 · Bottom shelf',
    'Porquê aqui': 'Why here',
    'Sai muito — 34 por dia — e fica a 8 m do cais. É pesado para ir mais alto.': 'It moves fast — 34 a day — and is 8 m from the dock. Too heavy to go higher.',
    'Caminho: sai do cais, segue o corredor 2, terceira estante à direita.': 'Route: leave the dock, follow aisle 2, third rack on the right.',
    'Cheguei': "I'm here",
    'Está ocupada': "It's taken",
    'Não cabe': "It doesn't fit",
    'C02-E03-N01 ficou registada como ocupada': 'C02-E03-N01 was recorded as taken',
    'O gestor vai ver porque é que o sistema a julgava livre.': 'The manager will look into why the system thought it was free.',
    'É a seguinte mais perto do cais que aguenta o peso.': 'It is the next closest to the dock that takes the weight.',
    'Só podes escolher outra posição se a 3.ª também estiver ocupada.': 'You can only choose another location if the 3rd is taken too.',
    'Lê a POSIÇÃO': 'Scan the LOCATION',
    'A etiqueta na prateleira onde pousaste a palete': 'The label on the shelf where you placed the pallet',
    'Deve ser': 'Should be',
    'O sistema confirma de novo, ao ler, que a posição ainda serve': 'When you scan, the system checks again that the location still fits',
    'Arrumada em C02-E04-N01': 'Put away in C02-E04-N01',
    '40 × Óleo 5W30 · registado com o teu nome às 10h14': '40 × 5W30 oil · recorded under your name at 10:14',
    'Estado do stock': 'Stock status',
    'Antes': 'Before',
    'Agora': 'Now',
    'A aguardar arrumação · cais': 'Waiting for put-away · dock',
    'Armazenado · C02-E04-N01': 'Stored · C02-E04-N01',
    'Seguinte na fila: Contar C02-E03-N02 — porque houve uma rutura aqui.': 'Next in the queue: Count C02-E03-N02 — because this location ran out.',
    'Próxima tarefa': 'Next task',

    /* ── separar ── */
    'O teu lote': 'Your batch',
    '3 guias · 18 linhas · 3 corredores': '3 orders · 18 lines · 3 aisles',
    'Camião DPD · fecha 11h30': 'DPD truck · closes 11:30',
    'G-24187 · Auto Peças Norte': 'G-24187 · Auto Peças Norte',
    '9 linhas · apertado: faltam 27 min de trabalho': '9 lines · tight: 27 min of work left',
    'Camião GLS · 14h00': 'GLS truck · 14:00',
    '6 linhas': '6 lines',
    '3 linhas': '3 lines',
    'Começar a volta': 'Start the round',
    'Tira': 'Take',
    '6 × Filtro de óleo W712': '6 × W712 oil filter',
    'Para G-24187 · o stock já está reservado para ti': 'For G-24187 · the stock is already reserved for you',
    'A seguir': 'Next',
    'C01-E05-N02 · 5 m': 'C01-E05-N02 · 5 m',
    'Lê a POSIÇÃO, depois o ARTIGO': 'Scan the LOCATION, then the ITEM',
    'Aqui há 2 das 6': 'Only 2 of the 6 are here',
    'Regista o que tiraste. A guia fica incompleta e não sai sem o resto.': 'Record what you took. The order stays incomplete and does not ship without the rest.',
    'Pedidas': 'Ordered',
    'Tiraste': 'Taken',
    'Faltam': 'Missing',
    'Vai nascer uma tarefa para contar esta posição.': 'A task to count this location will be created.',
    'Registar e seguir': 'Record and continue',
    'Fim da volta': 'End of round',
    'Parte do camião DPD · 11h30 · junto ao cais de saída': 'For the DPD truck · 11:30 · next to the outbound dock',
    'completa · 9 volumes': 'complete · 9 parcels',
    'G-24190 fica marcada como incompleta': 'G-24190 is marked as incomplete',
    'Vai para PP-GLS-01 e não entra na fila da expedição.': 'It goes to PP-GLS-01 and stays out of the shipping queue.',
    'Lê a posição da prateleira onde a pousas': 'Scan the location of the shelf where you place it',

    /* ── expedir ── */
    'Camiões de hoje': "Today's trucks",
    'Por ordem de fecho': 'By closing time',
    '1 guia na prateleira · 0 no cais ·': '1 order on the shelf · 0 at the dock ·',
    'Apertado': 'Tight',
    '1 completa · 1 incompleta na prateleira': '1 complete · 1 incomplete on the shelf',
    '4 guias por recolher': '4 orders to pick',
    'Na prateleira': 'On the shelf',
    'Lê cada VOLUME': 'Scan each PARCEL',
    'Caixa 1 · filtros': 'Box 1 · filters',
    'Caixa 2 · óleos': 'Box 2 · oils',
    'Caixa 3 · óleos': 'Box 3 · oils',
    'Caixa 4 · pastilhas': 'Box 4 · brake pads',
    '… mais 5 volumes': '… 5 more parcels',
    '3 de 9 lidos': '3 of 9 scanned',
    'Falta um volume': 'A parcel is missing',
    '9 de 9 volumes conferidos': '9 of 9 parcels checked',
    'A guia está completa.': 'The order is complete.',
    'Onde o camião DPD está a encostar': 'Where the DPD truck is backing in',
    'Lê a etiqueta do cais onde pousas': 'Scan the label of the dock where you place it',
    'Saída DPD · 11h30': 'DPD dispatch · 11:30',
    'Lê ao carregar': 'Scan while loading',
    '9/9 carregados': '9/9 loaded',
    '4/4 carregados': '4/4 loaded',
    'Lê cada volume quando sobe ao camião': 'Scan each parcel as it goes onto the truck',
    'Documentos de transporte e observações longas: no computador da expedição.': 'Transport documents and long notes: on the shipping computer.',
    'Fechar saída — faltam 2 volumes': 'Close dispatch — 2 parcels missing',

    /* ── gestor e exceções ── */
    'Turno das 8h': '8 am shift',
    'Até agora · 10h20': 'So far · 10:20',
    'tarefas feitas': 'tasks done',
    'leituras à mão': 'typed instead of scanned',
    'posições ocupadas': 'locations taken',
    'guia incompleta': 'incomplete order',
    'Sinais': 'Signals',
    'C02-E03-N01 recusada 3 vezes': 'C02-E03-N01 refused 3 times',
    'O sistema julgava-a livre. Mandar contar?': 'The system thought it was free. Order a count?',
    'Stock': 'Stock',
    'C01-E05-N02 diverge há 2 contagens': 'C01-E05-N02 has not matched for 2 counts',
    'Pode sair stock sem registo': 'Stock may be leaving unrecorded',
    'Posição ocupada': 'Location taken',
    'Posição inacessível': "Can't reach the location",
    'Artigo danificado': 'Damaged item',
    'Etiqueta ilegível': 'Unreadable label',
    'Outro motivo — escrever': 'Other reason — type it',
    'Desde as 10h22': 'Since 10:22',
    'O PDA não está ligado ao servidor': 'The PDA is not connected to the server',
    'Não podes começar nem fechar operações até a ligação voltar.': 'You cannot start or close anything until the connection is back.',
    'Ficou gravado': 'Saved',
    'confirmada às 10h21': 'confirmed at 10:21',
    'por confirmar': 'not confirmed',
    'Aproxima-te do corredor principal. Quando a ligação voltar, retomas na paragem 4.': 'Move towards the main aisle. When the connection is back, you resume at stop 4.',
    'Números do lote: da última ligação, às 10h21.': 'Batch figures: from the last connection, at 10:21.',
    'Tentar de novo': 'Try again',

    /* ── o editor ── */
    'Camadas': 'Layers',
    'Propriedades': 'Properties',
    'Ecrã': 'Screen',
    'Ver o CSS': 'View the CSS',
    'Anular': 'Undo',
    'Repor tudo': 'Reset all',
    'Documentação': 'Documentation',
    'Ecrãs': 'Screens',
    'Como funciona': 'How it works',
    'Fechar este painel': 'Close this panel',
    'Fechar o painel': 'Close the panel',
    'Abrir as camadas': 'Open the layers',
    'Abrir as propriedades': 'Open the properties',
    'O que mudaste': 'What you changed',
    'Fechar': 'Close',
    'Copiar': 'Copy',
    'Clica numa peça do ecrã, ou escolhe-a nas camadas à esquerda.': 'Click an element on the screen, or pick it in the layers on the left.',
    'Protótipo': 'Prototype',
    'Alt + clique numa peça destas faz o mesmo sem a escolher.': 'Alt + click on one of these elements does the same without selecting it.',
    'Variante': 'Variant',
    'Categoria': 'Category',
    'Ação principal (laranja, 62 dp)': 'Primary action (orange, 62 dp)',
    'Secundária (contorno azul, 48 dp)': 'Secondary (blue outline, 48 dp)',
    'Neutra (48 dp)': 'Neutral (48 dp)',
    'A cor e a altura vêm da variante. A ação principal é uma por ecrã — 03 §5.':
      'Colour and height come from the variant. There is one primary action per screen — 03 §5.',
    'Texto': 'Text',
    'Tinta': 'Ink',
    'Não há laranja nesta paleta: o laranja é o fundo da ação principal, e como texto não se lê — 03 §2.1.':
      'There is no orange in this palette: orange is the primary action background, and as text it is unreadable — 03 §2.1.',
    'Sem cor própria — herda de quem está por cima': 'No colour of its own — inherits from its parent',
    'Fundo': 'Background',
    'Letra': 'Type',
    'Tamanho': 'Size',
    'Peso': 'Weight',
    'Nove tamanhos, e não há décimo — 03 §3.': 'Nine sizes, and there is no tenth — 03 §3.',
    'Forma e folga': 'Shape and spacing',
    'Raio': 'Radius',
    'Folga': 'Padding',
    'Espaço': 'Gap',
    'Seis degraus, de 2 a 26 dp — 03 §4.': 'Six steps, from 2 to 26 dp — 03 §4.',
    'Peça': 'Element',
    'Visível': 'Visible',
    'Esconder': 'Hide',
    'Mostrar': 'Show',
    'Tira a peça do ecrã sem a apagar. Volta por aqui ou pelas camadas.': 'Removes the element from the screen without deleting it. Bring it back here or from the layers.',
    'Traz a peça de volta ao ecrã': 'Brings the element back to the screen',
    'Alinhar': 'Align',
    'esq': 'left',
    'centro': 'centre',
    'dir': 'right',
    'Posição': 'Position',
    'Deslocamento em píxeis a partir do sítio de origem': 'Offset in pixels from the original position',
    'Repor': 'Reset',
    'Devolve a peça ao sítio de origem': 'Puts the element back where it was',
    'CSS da peça': 'Element CSS',
    'Copiar este CSS': 'Copy this CSS',
    'Repor esta peça': 'Reset this element',
    'Não há nada para anular': 'There is nothing to undo',
    'Anulado': 'Undone',
    'Voltou tudo ao original — texto, variantes e peças': 'Everything is back to the original — text, variants and elements',
    'CSS copiado': 'CSS copied',
    'CSS da peça copiado': 'Element CSS copied',
    'Normal': 'Regular',
    'Médio': 'Medium',
    'Forte': 'Bold',

    /* os valores da casa, como aparecem nas grelhas */
    'Texto secundário': 'Secondary text',
    'Texto ténue': 'Faint text',
    'Acento': 'Accent',
    'Sobre a marca': 'On brand',
    'Bom': 'Good',
    'Aviso': 'Warning',
    'Sério': 'Serious',
    'Erro': 'Error',
    'Neutro': 'Neutral',
    'Cartão': 'Card',
    'Invertido': 'Inverted',
    'Ação': 'Action',
    'Ação carregada': 'Action pressed',
    'Cinzento da marca': 'Brand grey',
    'Bom suave': 'Soft good',
    'Aviso suave': 'Soft warning',
    'Erro suave': 'Soft error',
    'Neutro suave': 'Soft neutral',

    /* a paleta */
    'Acrescentar': 'Add',
    'Estado': 'Status',
    'Blocos': 'Blocks',
    'Botões': 'Buttons',
    'Ordem': 'Instruction',
    'Código de posição': 'Location code',
    'Destaque': 'Highlight',
    'Secundário': 'Secondary',
    'Legenda': 'Caption',
    'Rótulo': 'Label',
    'Selo neutro': 'Neutral badge',
    'Selo bom': 'Good badge',
    'Selo aviso': 'Warning badge',
    'Selo erro': 'Error badge',
    'Alerta bom': 'Good alert',
    'Alerta aviso': 'Warning alert',
    'Alerta erro': 'Error alert',
    'Tarefa': 'Task',
    'Linha': 'Row',
    'Leitor': 'Scanner',
    'Vazio': 'Empty state',
    'Ação principal': 'Primary action',
    'Secundária': 'Secondary',
    'Neutra': 'Neutral',
    'Peça acrescentada no fim do bloco': 'Element added at the end of the block',
    'O bloco onde esta peça estava já não existe neste ecrã.': 'The block this element was in no longer exists on this screen.',
    /* o que a paleta escreve nas peças novas */
    'Primeira linha de um cartão': 'First line of a card',
    'Texto corrente. Duplo clique para escrever.': 'Body text. Double-click to type.',
    'Atenção': 'Attention',
    'Feito': 'Done',
    'O que ficou registado.': 'What was recorded.',
    'O que a pessoa tem de saber.': 'What the person needs to know.',
    'Não deu': "Didn't work",
    'O que correu mal e o que fazer.': 'What went wrong and what to do.',
    'Primeira linha': 'First line',
    'Segunda linha': 'Second line',
    'Tipo': 'Type',
    'O que há a fazer': 'What needs doing',
    'Porquê: a razão da ordem': 'Why: the reason for the order',
    'Valor': 'Value',
    'Não há nada na tua fila': 'Your queue is empty',
    'Quando entrar trabalho para a tua função, aparece aqui.': 'When work comes in for your role, it shows up here.',
    'Nova ação': 'New action',
    'Outra ação': 'Other action',
    'Opção': 'Option',

    /* nomes das camadas */
    'Ecrã do PDA': 'PDA screen',
    'Faixa': 'Status strip',
    'Perfil': 'Role',
    'Nome': 'Name',
    'Rede': 'Network',
    'Barra de topo': 'Top bar',
    'Título': 'Title',
    'Subtítulo': 'Subtitle',
    'Passos': 'Steps',
    'Linha dos passos': 'Steps row',
    'Progresso': 'Progress',
    'Traço': 'Segment',
    'Corpo': 'Body',
    'Rodapé': 'Footer',
    'Selo': 'Badge',
    'Botão': 'Button',
    'Par de botões': 'Button pair',
    'Ícone do leitor': 'Scanner icon',
    'Alerta': 'Alert',
    'Título da tarefa': 'Task title',
    'Porquê': 'Why',
    'Folha': 'Sheet',
    'Caixa da folha': 'Sheet box',
    'Código': 'Code',
    'Campo': 'Field',
    'Tecla': 'Key',
    'Teclado': 'Keypad',
    'Menu': 'Menu',
    'Mosaico': 'Tile',
    'Proposta': 'Suggestion',
    'Camião': 'Truck',
    'Volumes': 'Parcels',
    'Volume': 'Parcel',
    'Números': 'Figures',
    'Número': 'Figure',
    'Texto de destaque': 'Highlight text',
    'Fotografia': 'Photo',
    'Topo': 'Top',
    'Marca ROMAFE': 'ROMAFE lockup',
    'Risco': 'Rule',
    'Aparelho': 'Device',
    'Rede e bateria': 'Signal and battery',
    'Boas-vindas': 'Welcome',
    'Lema': 'Tagline',
    'Risco laranja': 'Orange rule',
    'Cartão de sessão': 'Sign-in card',
    'Caixa': 'Box',
    'Caixa de texto': 'Text box',
    'Mostrar palavra-passe': 'Show password',
    'Áreas': 'Areas',
    'Área': 'Area',
    'Versão': 'Version',
    'Ícone': 'Icon',
    'Seleção': 'Select',
    'Etiqueta': 'Label',
    'Marca': 'Brand',
    'Divisor': 'Divider',
    'Ícone da app': 'App icon',
    'Símbolo': 'Symbol',
    'Tamanhos': 'Sizes',
    'Ponto': 'Dot',
    'Saudação': 'Greeting',
    'Secção': 'Section',
    'Cabeça da secção': 'Section head',
    'Título da secção': 'Section title',
    'Atalhos': 'Shortcuts',
    'Atalho': 'Shortcut',
    'Círculo': 'Circle',
    'Seta': 'Arrow',
    'Contador': 'Counter',

    /* Os sufixos das classes, que o editor põe a seguir ao nome da peça nas
       camadas — «Área · nome». */
    'nome': 'name',
    'icone': 'icon',
    'seta': 'arrow'
  };

  /* Textos que só mudam no número */
  var PADROES = [
    [/^(\d+) · (.+)$/, function (m) { var t = directo(m[2]); return t === null ? null : m[1] + ' · ' + t; }],
    [/^(\d{1,2})h(\d{2})$/, function (m) { return m[1] + ':' + m[2]; }],
    [/^Passo (\d+) de (\d+)$/, function (m) { return 'Step ' + m[1] + ' of ' + m[2]; }],
    [/^Paragem (\d+) de (\d+)$/, function (m) { return 'Stop ' + m[1] + ' of ' + m[2]; }],
    [/^(\d+) de (\d+)$/, function (m) { return m[1] + ' of ' + m[2]; }],
    [/^Ir para (.+)$/, function (m) { var t = traduzir(m[1]); return 'Go to ' + (t === null ? m[1] : t); }],
    [/^Abrir (.+)$/, function (m) { var t = directo(m[1]); return 'Open ' + (t === null ? m[1] : t); }],
    [/^Peso (\d+)$/, function (m) { return 'Weight ' + m[1]; }],
    [/^Acrescentadas \((\d+)\)$/, function (m) { return 'Added (' + m[1] + ')'; }],
    [/^Apagar a peça (.+)$/, function (m) { return 'Delete the element ' + m[1]; }],
    [/^Acrescentar no fim do bloco escolhido: (.+)$/, function (m) {
      var nome = directo(m[1]);
      return 'Add to the end of the chosen block: ' + (nome === null ? m[1] : nome);
    }]
  ];

  /* O que estava escrito antes de traduzir. Um Map com o nó como chave, para
     não sujar o HTML com atributos de estado, e porque a volta ao português tem
     de devolver exatamente o original — incluindo o que o editor lhe mudou. */
  var originais = new Map();

  var idioma = 'pt';

  function directo(texto) {
    var limpo = texto.trim();
    if (!limpo) return null;
    if (Object.prototype.hasOwnProperty.call(EN, limpo)) return EN[limpo];
    for (var i = 0; i < PADROES.length; i++) {
      var m = limpo.match(PADROES[i][0]);
      if (m) return PADROES[i][1](m);
    }
    return null;
  }

  /**
   * Traduz por partes o que vem separado por «·».
   *
   * O editor escreve os nomes das camadas assim — «Marca ROMAFE · nome» — e os
   * rótulos dos valores também: «Superfície · --c-superficie · #ffffff». São
   * dezenas de combinações, e pô-las todas no dicionário era escrever à mão o
   * que o editor já compõe sozinho. Traduz-se cada bocado e devolve-se a
   * pontuação onde estava; o que não estiver no dicionário — um token, uma cor,
   * um nome de etiqueta — fica como está.
   */
  function traduzir(texto) {
    var certo = directo(texto);
    if (certo !== null) return certo;

    var limpo = texto.trim();
    if (limpo.indexOf('\u00b7') < 0) return null;

    var partes = limpo.split(/(\s+\u00b7\s+)/);
    var mudou = false;
    var saida = partes.map(function (parte, i) {
      if (i % 2) return parte;
      var t = directo(parte);
      if (t === null) return parte;
      mudou = true;
      return t;
    }).join('');

    return mudou ? saida : null;
  }

  /* O espaço à volta do texto não é decoração: num `<span>Ver</span> todas` é
     ele que separa as duas palavras. Traduz-se o miolo e devolve-se a moldura. */
  function trocar(texto, novo) {
    var antes = texto.match(/^\s*/)[0];
    var depois = texto.match(/\s*$/)[0];
    return antes + novo + depois;
  }

  /**
   * O QUE FICA DE FORA.
   *
   * A moldura do editor — camadas, propriedades, paleta — É traduzida: quem
   * trabalha o ecrã em inglês não devia ter de ler os botões em português.
   *
   * O que continua de fora é o CÓDIGO dentro do diálogo do CSS. Esse texto não
   * é rótulo, é o que se copia para colar no projeto — e o projeto está escrito
   * em português. Traduzir ali era pôr comentários ingleses num ficheiro que
   * ninguém mais escreveu em inglês.
   */
  function foraDeAlcance(no) {
    var pai = no.parentElement;
    if (!pai) return true;
    if (pai.closest('.ed-dialogo pre, .ed-dialogo code, .ed-css')) return true;
    /* O nome de uma língua escreve-se na própria língua, e não se traduz. */
    if (pai.closest('[data-ed-idioma]')) return true;
    var tag = pai.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE';
  }

  function nosDeTexto() {
    var lista = [];
    var andarilho = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var no;
    while ((no = andarilho.nextNode())) {
      if (no.nodeValue.trim() && !foraDeAlcance(no)) lista.push(no);
    }
    return lista;
  }

  function traduzirAtributos(elementos) {
    for (var i = 0; i < elementos.length; i++) {
      var elemento = elementos[i];
      ATRIBUTOS.forEach(function (nome) {
        if (!elemento.hasAttribute(nome)) return;
        var guarda = 'ptOriginal' + nome.replace(/[^a-z]/gi, '');
        if (elemento.dataset[guarda]) return;
        var novo = traduzir(elemento.getAttribute(nome));
        if (novo === null) return;
        elemento.dataset[guarda] = elemento.getAttribute(nome);
        elemento.setAttribute(nome, novo);
      });
    }
  }

  function paraIngles() {
    nosDeTexto().forEach(function (no) {
      var novo = traduzir(no.nodeValue);
      if (novo === null) return;
      if (!originais.has(no)) originais.set(no, no.nodeValue);
      no.nodeValue = trocar(no.nodeValue, novo);
    });

    traduzirAtributos(document.querySelectorAll('body *'));

    document.documentElement.lang = 'en';
    var titulo = traduzir(document.title);
    if (titulo) document.title = titulo;
  }

  function paraPortugues() {
    originais.forEach(function (valor, no) {
      if (no.isConnected) no.nodeValue = valor;
    });
    originais.clear();

    var todos = document.querySelectorAll('[data-pt-originalplaceholder], [data-pt-originalarialabel], [data-pt-originaltitle], [data-pt-originalalt], [data-pt-originaldatanome], [data-pt-originaldataeddica]');
    for (var i = 0; i < todos.length; i++) {
      var elemento = todos[i];
      ATRIBUTOS.forEach(function (nome) {
        var guarda = 'ptOriginal' + nome.replace(/[^a-z]/gi, '');
        if (elemento.dataset[guarda]) {
          elemento.setAttribute(nome, elemento.dataset[guarda]);
          delete elemento.dataset[guarda];
        }
      });
    }

    document.documentElement.lang = 'pt';
  }

  function aplicar(novo) {
    var alvo = novo || idioma;
    // Volta-se sempre ao português primeiro. Traduzir por cima de traduzido
    // deixava o dicionário a olhar para inglês e a não encontrar nada — e o
    // segundo clique no botão não fazia nada, que é o género de erro que só
    // aparece quando alguém carrega duas vezes.
    paraPortugues();
    if (alvo === 'en') paraIngles();

    idioma = alvo;
    try { localStorage.setItem(CHAVE, alvo); } catch (e) {}
    marcar();
  }

  function marcar() {
    /* Os degraus do painel do editor marcam-se aqui, e não no clique deles:
       a língua guardada também se aplica ao abrir a página. */
    var degraus = document.querySelectorAll('[data-ed-idioma]');
    for (var k = 0; k < degraus.length; k++) {
      degraus[k].setAttribute('aria-pressed', String(degraus[k].dataset.edIdioma === idioma));
    }
  }

  function guardado() {
    var pedido = (location.hash.match(/lingua=(pt|en)/) || [])[1];
    if (pedido) return pedido;
    try { return localStorage.getItem(CHAVE) || 'pt'; } catch (e) { return 'pt'; }
  }

  /**
   * O QUE FALTA TRADUZIR.
   *
   * Corre-se na consola. Devolve o que está escrito no ecrã, não está no
   * dicionário e não é uma marca nem um número — que é a lista de trabalho de
   * quem for acrescentar um ecrã.
   */
  function porTraduzir() {
    var vistos = {};
    nosDeTexto().forEach(function (no) {
      var t = no.nodeValue.trim();
      if (!t || traduzir(t) !== null) return;
      if (/^[\s\W\d]+$/.test(t)) return;
      vistos[t] = true;
    });
    return Object.keys(vistos).sort();
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Depois do editor: é ele que repõe os textos guardados, e traduzir antes
    // disso era traduzir o que estava prestes a ser substituído.
    window.setTimeout(function () { aplicar(guardado()); }, 0);
  });

  /**
   * TRADUZ UM RAMO SÓ.
   *
   * O painel das propriedades é redesenhado a cada peça escolhida, e o que
   * nasce depois da tradução nasce em português. Chamar `aplicar()` a cada
   * clique percorria a página inteira; isto percorre só o painel.
   *
   * Em português não faz nada, porque o que nasceu já nasceu certo.
   */
  function traduzirRamo(raiz) {
    if (!raiz || idioma !== 'en') return;

    var andarilho = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null);
    var no;
    while ((no = andarilho.nextNode())) {
      if (!no.nodeValue.trim() || foraDeAlcance(no)) continue;
      if (originais.has(no)) continue;
      var novo = traduzir(no.nodeValue);
      if (novo === null) continue;
      originais.set(no, no.nodeValue);
      no.nodeValue = trocar(no.nodeValue, novo);
    }

    traduzirAtributos(raiz.querySelectorAll('*'));
  }

  window.PdaTraducao = {
    aplicar: aplicar,
    traduzirRamo: traduzirRamo,
    actual: function () { return idioma; },
    porTraduzir: porTraduzir
  };
})();
