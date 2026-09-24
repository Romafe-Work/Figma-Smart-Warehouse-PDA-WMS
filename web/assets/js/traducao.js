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

   Códigos de posição (60300301), números de guia, nomes de pessoas, de
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
    'Início da arrumação': 'Put-away home',
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
    'Trabalho': 'Work',
    'Começar tarefas': 'Start tasks',
    'Escolhe uma peça': 'Pick an element',
    'Clica numa peça do ecrã, ou escolhe-a nas camadas à esquerda, para ver e mudar o que ela tem.': 'Click an element on the screen, or pick it in the layers on the left, to see and change what it has.',
    'Dica': 'Tip',
    'As camadas à esquerda são o caminho mais rápido para chegar a uma peça pequena.': 'The layers on the left are the quickest way to reach a small element.',
    'Prevista sair': 'Due out',
    'hoje · 11h30 · DPD': 'today · 11:30 · DPD',
    'Ver como está uma guia: o que falta, onde ficou, e quando está prevista sair.': 'See how an order is doing: what is missing, where it is, and when it is due out.',
    'Guia': 'Order',
    'Corrigir': 'Fix',
    'Trabalhar como — fica registado em nome dele': 'Work as — recorded under their name',
    'Dar ao gestor tudo: trabalhar como qualquer função, e todas as operações delas.': 'Give the manager everything: work as any role, and all of their operations.',
    'Números e sinais': 'Figures and signals',
    'Todas as operações': 'All operations',
    'Insights': 'Insights',
    'Dar ao gestor tudo o que as funções fazem, num sítio só.': 'Give the manager everything the roles do, in one place.',
    'Mostrar o que os dados dizem: onde se perde tempo, o que falha e o que o motor aprendeu.': 'Show what the data says: where time is lost, what fails and what the engine learned.',
    'O gestor faz tudo o que as funções fazem. Fica registado com o nome dele.': 'The manager does everything the roles do. It is recorded under their name.',
    'Separação e expedição': 'Picking and shipping',
    'Posições recusadas, por zona': 'Locations refused, by zone',
    'Zona 30': 'Zone 30',
    'Zona 20': 'Zone 20',
    'Zona 10': 'Zone 10',
    'por arrumação': 'per put-away',
    '12 min': '12 min',
    'O que o motor aprendeu': 'What the engine learned',
    'Atribuições do gestor': "The manager's assignments",
    '4 esta semana': '4 this week',
    'Padrão': 'Pattern',
    'óleos ao fim da manhã': 'oils late in the morning',
    'O motor propõe mudar a ordem dos óleos. Quem muda a régua é a direção.': 'The engine proposes changing the order of the oils. It is management who changes the rule.',
    'Está na coluna ao lado': 'It is in the next column',
    'Comunicar um problema': 'Report a problem',
    'Qualquer função comunica o que a impede de seguir: fica registado com quem o disse e a que horas, e o gestor é avisado.': 'Any role reports what is stopping them: it is recorded with who said it and when, and the manager is told.',
    '2 paletes por receber': '2 pallets to receive',
    '3 guias · 22 volumes carregados': '3 orders · 22 parcels loaded',
    '4 volumes': '4 parcels',
    '9 volumes': '9 parcels',
    '8 de 9 volumes': '8 of 9 parcels',
    'Início da expedição': 'Shipping home',
    'Saída fechada': 'Dispatch closed',
    'Escreve o cais': 'Type the dock',
    'Sair com uma saída por fechar': 'Leave with a dispatch still open',
    'Ver a prateleira de preparados': 'See the staging shelf',
    'Início do gestor': 'Manager home',
    'Atribuir uma tarefa': 'Assign a task',
    'O que está a acontecer': 'What is going on',
    'A expedição entra, vê os camiões do turno pela hora de fecho e começa a carregar.': 'Shipping signs in, sees the shift trucks by closing time and starts loading.',
    'A quem': 'To whom',
    'A saída': 'The dispatch',
    'A seguir: camião DPD · fecha 11h30': 'Next: DPD truck · closes 11:30',
    'A separação é avisada. O gestor vê a guia incompleta no relatório do turno.': 'Picking is told. The manager sees the incomplete order in the shift report.',
    'Atribuir': 'Assign',
    'Avisar que há uma saída aberta antes de a pessoa sair do turno.': 'Warn that a dispatch is still open before the person ends the shift.',
    'Bom dia, Ana': 'Good morning, Ana',
    'Bom dia, Paulo': 'Good morning, Paulo',
    'Cais': 'Dock',
    'Carregar o camião DPD': 'Load the DPD truck',
    'Com o motivo escrito · às 10h22': 'With the reason written · at 10:22',
    'Começar a carregar': 'Start loading',
    'Começar o turno na expedição': 'Starting the shipping shift',
    'Como vão os números e os sinais': 'How the figures and signals are doing',
    'Conferidos': 'Checked',
    'Conferir': 'Check',
    'Confirmar o que o gestor mandou fazer, e dizer onde isso vai dar.': 'Confirm what the manager ordered, and say where it lands.',
    'Confirmar que a saída ficou fechada e o que foi carregado.': 'Confirm the dispatch is closed and what was loaded.',
    'Consultar na expedição': 'Look up (shipping)',
    'Continuar a carregar': 'Carry on loading',
    'Dar uma tarefa a uma pessoa, com o motivo escrito; o motor aprende com isso.': 'Give a task to a person, with the reason written; the engine learns from it.',
    'Dizer, com um toque, o que impede o carregamento.': 'Say, with one tap, what is stopping the loading.',
    'Ela recebe-a como a seguinte da fila. O motor aprende com a atribuição.': 'She gets it as the next one in the queue. The engine learns from the assignment.',
    'Escreve o CAIS': 'Type the DOCK',
    'Está lá': 'On the shelf',
    'Está na fila da arrumação há 2h10': 'It has been in the put-away queue for 2h10',
    'Falta o volume V4/9': 'Parcel V4/9 is missing',
    'Falta um volume na prateleira': 'A parcel is missing from the shelf',
    'Falta um volume na prateleira, o camião não chegou, a etiqueta não se lê — e sair do turno com uma saída aberta.': 'A parcel missing from the shelf, the truck has not arrived, a label that will not scan — and ending the shift with a dispatch still open.',
    'Faltam 2 volumes por carregar': '2 parcels still to load',
    'Fecha às': 'Closes at',
    'Ficou registado': 'Recorded',
    'Guias por fechar': 'Orders still open',
    'Hoje': 'Today',
    'Identificar o cais quando a etiqueta não se lê.': 'Identify the dock when the label won\'t scan.',
    'Lê a posição da prateleira': 'Scan the shelf location',
    'Mostrar ao gestor como vai o turno e dar acesso ao que só ele faz.': 'Show the manager how the shift is going and give access to what only they do.',
    'Mostrar o que a expedição tem para fazer, por ordem de fecho dos camiões.': 'Show what shipping has to do, by truck closing time.',
    'Mostrar o que pede atenção, e deixar o gestor agir num toque.': 'Show what needs attention, and let the manager act with one tap.',
    'Mostrar os camiões do turno e pôr a pessoa a carregar com um toque; dá acesso às consultas.': 'Show the shift trucks and get the person loading with one tap; gives access to the look-ups.',
    'Na fila': 'In the queue',
    'No cais': 'At the dock',
    'Não cabe no camião': 'It doesn\'t fit in the truck',
    'O PDA trabalha ligado à Rolgest. Sem ligação diz que parou, e mostra o que ficou gravado.': 'The PDA works connected to Rolgest. With no connection it says it stopped, and shows what was saved.',
    'O camião': 'The truck',
    'O camião não chegou': 'The truck has not arrived',
    'O gestor': 'The manager',
    'O gestor vê como vai o turno, lê os sinais, atribui tarefas com motivo escrito e vê o armazém todo.': 'The manager sees how the shift is going, reads the signals, assigns tasks with a written reason and sees the whole warehouse.',
    'O motor regista o padrão das atribuições e propõe mudar a ordem, mas quem muda a régua é a direção.': 'The engine records the pattern of assignments and proposes changing the order, but it is management who changes the rule.',
    'O número do cais onde o camião está a encostar': 'The number of the dock the truck is backing into',
    'O que vai': 'What goes',
    'O resto': 'The rest',
    'Os documentos de transporte saem no computador da expedição.': 'The transport documents print on the shipping computer.',
    'Por ordem de fecho. A de cima é a seguinte.': 'By closing time. The top one is next.',
    'Porquê: fecha às 11h30 e já está no cais': 'Why: it closes at 11:30 and is already at the dock',
    'Porquê: vai no camião GLS das 14h00': 'Why: it goes on the 2 pm GLS truck',
    'Prateleira': 'Shelf',
    'Quando a expedição não corre bem': 'When shipping goes wrong',
    'Quando falta a ligação': 'When the connection drops',
    'Quem entrar a seguir apanha a saída onde a deixaste. O gestor vê quem saiu com trabalho aberto.': 'Whoever comes next picks the dispatch up where you left it. The manager sees who left with open work.',
    'Registar o volume que falta e dizer o que acontece à guia.': 'Record the missing parcel and say what happens to the order.',
    'Saída DPD fechada às 11h28': 'DPD dispatch closed at 11:28',
    'Se seguir assim': 'If it goes like this',
    'Tarefa atribuída a Marta Silva': 'Task assigned to Marta Silva',
    'Tens a saída DPD por fechar': 'The DPD dispatch is still open',
    'Ver a guia': 'See the order',
    'Ver como está uma guia, e o que está na prateleira de preparados.': 'See how an order is doing, and what is on the staging shelf.',
    'Ver o armazém todo: quem está a trabalhar, o que falta e o que sai hoje.': 'See the whole warehouse: who is working, what is missing and what goes out today.',
    'Ver o que está na prateleira e para que camião vai cada guia.': 'See what is on the shelf and which truck each order goes on.',
    'Ver o turno': 'See the shift',
    'Volume danificado': 'Damaged parcel',
    'a arrumar 60300401': 'putting away 60300401',
    'a carregar o DPD': 'loading the DPD',
    'espera no cais': 'waits at the dock',
    'espera pelo camião seguinte': 'waits for the next truck',
    'fica aberta': 'stays open',
    'fica incompleta': 'stays incomplete',
    'incompleta': 'incomplete',
    'paragem 4 de 18': 'stop 4 of 18',
    'Um turno normal': 'A normal shift',
    'Chega mercadoria ao cais': 'Goods arrive at the dock',
    'A posição proposta está ocupada': 'The suggested location is taken',
    'A etiqueta não se lê': 'The label will not scan',
    'O motor manda corrigir uma posição': 'The engine sends a location to fix',
    'Na paragem falta quantidade': 'Short quantity at the stop',
    'Ver como está uma guia': 'Checking how an order is doing',
    'Percursos': 'Paths',
    /* ── 1 tarefa = 1 guia (24 set.) ── */
    'Agora: guia G-24187 · 9 volumes · DPD': 'Now: order G-24187 · 9 parcels · DPD',
    'O motor deu-te esta guia. Quando a carregares, dá a seguinte.': 'The engine gave you this order. When you load it, it gives you the next.',
    'Guia G-24187 · 9 volumes · camião DPD': 'Order G-24187 · 9 parcels · DPD truck',
    'Porquê: o camião fecha às 11h30 e já está no cais': 'Why: the truck closes at 11:30 and is already at the dock',
    'A serem carregadas agora': 'Being loaded right now',
    'Neste camião': 'On this truck',
    'G-24187 · a tua': 'G-24187 · yours',
    'A saída fecha quando a última guia do camião subir. Documentos de transporte: no computador da expedição.': 'The dispatch closes when the truck\'s last order goes up. Transport paperwork: on the shipping desk computer.',
    'Guia carregada': 'Order loaded',
    'Fechar a saída': 'Close the dispatch',
    'Armazém': 'Warehouse',
    'Está à espera de alguém há 2h10': 'Waiting for someone for 2h10',
    'G-24187 · paragem 4 de 9': 'G-24187 · stop 4 of 9',
    'G-24187 · a carregar': 'G-24187 · loading',
    'Uma tarefa é uma guia: levanta-se na prateleira, confere-se volume a volume e leva-se ao camião. A saída só fecha quando a última guia dele subir.': 'A task is one order: collected from the shelf, checked parcel by parcel and taken to the truck. The dispatch only closes when its last order goes up.',
    'Ver os camiões de hoje': 'See today\'s trucks',
    'Ver o risco de cada camião — o que já está pronto e o que falta. Não é por aqui que se escolhe trabalho.': 'See the risk on each truck — what is ready and what is missing. This is not where work gets picked.',
    'Agora: guia GA-4471 · 3 paletes': 'Now: note GA-4471 · 3 pallets',
    'Guia GA-4471 · 3 paletes': 'Note GA-4471 · 3 pallets',
    'GA-4471 · palete 1 de 3': 'GA-4471 · pallet 1 of 3',
    'GA-4471 · palete 2 de 3': 'GA-4471 · pallet 2 of 3',
    'Palete arrumada em 60300401': 'Pallet put away in 60300401',
    'Esta guia': 'This note',
    'Paletes arrumadas': 'Pallets put away',
    'Falta': 'Left',
    'Quando a última ficar arrumada, a guia fecha e o motor dá a seguinte.': 'When the last one is put away, the note closes and the engine gives you the next.',
    'Palete seguinte': 'Next pallet',
    'Ver a tarefa': 'See the task',
    'Turno das 8h · o motor dá-te uma guia de cada vez': '8 am shift · the engine gives you one order at a time',
    'Agora: guia G-24187 · 9 linhas': 'Now: order G-24187 · 9 lines',
    'O motor deu-te esta guia. Quando a fechares, dá a seguinte.': 'The engine gave you this order. When you close it, it gives you the next.',
    'Guia G-24187 · Auto Peças Norte · 9 linhas': 'Order G-24187 · Auto Peças Norte · 9 lines',
    'A serem recolhidas agora': 'Being picked right now',
    'O motor reparte pela atividade dos PDA. Ninguém escolhe, e ninguém apanha a guia de outro.': 'The engine shares them out by what the PDAs are doing. Nobody picks, and nobody takes someone else\'s order.',
    'A tua guia': 'Your order',
    'G-24187 · 9 linhas · 3 colunas': 'G-24187 · 9 lines · 3 aisles',
    'Apertado: faltam 27 min de trabalho': 'Tight: 27 min of work left',
    'As primeiras paragens': 'The first stops',
    '6 × Filtro W712': '6 × W712 filter',
    '4 × Óleo 5W30': '4 × 5W30 oil',
    '2 × Pastilhas': '2 × brake pads',
    'Mais 6 paragens. O motor ordenou-as pelo caminho mais curto.': '6 more stops. The engine put them in the shortest order.',
    'Fim da guia': 'End of the order',
    'Se tivesse ficado alguma linha por recolher, a guia ia marcada como incompleta e esperava pelo stock.': 'Had a line been left unpicked, the order would go marked incomplete and wait for stock.',
    'Guia fechada às 11h02': 'Order closed at 11:02',
    'G-24187 · completa · 9 volumes': 'G-24187 · complete · 9 parcels',
    'Onde': 'Where',
    'DPD · 11h30': 'DPD · 11:30',
    'A expedição leva-a quando o camião chegar. Incompleta, esperava pelo stock e não entrava na fila da expedição.': 'Shipping takes it when the truck arrives. Incomplete, it would wait for stock and never reach shipping.',
    'A G-24187 tem 4 linhas por recolher': 'G-24187 has 4 lines still to pick',
    'O camião DPD': 'The DPD truck',
    'Continuar a guia': 'Carry on with the order',
    'Uma tarefa é uma guia de arrumação, que pode ter várias paletes: o 14 volta ao 10 até à última. Só então o motor dá a guia seguinte.': 'A task is one put-away note, which may hold several pallets: 14 goes back to 10 until the last one. Only then does the engine give the next note.',
    'Uma tarefa é uma guia de separação. O motor ordena as paragens pelo caminho mais curto; fechada a guia na prateleira, dá a seguinte.': 'A task is one picking order. The engine puts the stops in the shortest order; once the order is closed on the shelf, it gives the next.',
    'A tua guia, paragem a paragem': 'Your order, stop by stop',
    'Guia fechada': 'Order closed',
    /* ── o motor entrega uma tarefa de cada vez (24 set.) ── */
    'Turno das 8h · o motor dá-te uma tarefa de cada vez': '8 am shift · the engine gives you one task at a time',
    'Agora: Arrumar palete': 'Now: Put away a pallet',
    'A tua próxima tarefa': 'Your next task',
    '1 de cada vez': 'one at a time',
    'O motor deu-te esta. Quando acabares, dá a seguinte.': 'The engine gave you this one. When you finish, it gives you the next.',
    'No armazém': 'In the warehouse',
    'À espera de alguém': 'Waiting for someone',
    '8 tarefas': '8 tasks',
    'A ser feitas agora': 'Being done right now',
    'O motor reparte pela atividade dos PDA. Ninguém escolhe, e ninguém apanha a tarefa de outro.': 'The engine shares them out by what the PDAs are doing. Nobody picks, and nobody takes someone else\'s task.',
    'Conferir esta chegada': 'Check this arrival',
    'Picar outra chegada': 'Scan another arrival',
    'Recebido às 10h18': 'Booked in at 10:18',
    'GR-58213 · Castrol Portugal · 2 paletes': 'GR-58213 · Castrol Portugal · 2 pallets',
    'Entrou em stock': 'Into stock',
    'As 2 paletes ficam no cais até serem arrumadas.': 'The 2 pallets stay at the dock until they are put away.',
    'Começar a arrumar': 'Start putting away',
    'Picar mais uma chegada': 'Scan one more arrival',
    'A tua seguinte': 'Your next one',
    'Começar a seguinte': 'Start the next one',
    'A tarefa deixa de ser tua. O motor dá-te a seguinte.': 'The task is no longer yours. The engine gives you the next one.',
    'O motor deu-te esta volta. Quando a fechares, dá a seguinte.': 'The engine gave you this round. When you close it, it gives you the next.',
    'Guias à espera': 'Orders waiting',
    'Voltas a decorrer': 'Rounds under way',
    'O motor reparte pela atividade dos PDA. Ninguém escolhe, e ninguém apanha a volta de outro.': 'The engine shares them out by what the PDAs are doing. Nobody picks, and nobody takes someone else\'s round.',
    'O motor deu-te este camião. Quando fechares a saída, dá o seguinte.': 'The engine gave you this truck. When you close the dispatch, it gives you the next.',
    'Camiões por fechar hoje': 'Trucks still to close today',
    'Guias na prateleira': 'Orders on the shelf',
    'O motor reparte pela atividade dos PDA. Ninguém escolhe, e ninguém apanha o camião de outro.': 'The engine shares them out by what the PDAs are doing. Nobody picks, and nobody takes someone else\'s truck.',
    'Ela recebe-a como a seguinte. O motor aprende com a atribuição.': 'She gets it as her next one. The engine learns from the assignment.',
    'O sistema não sabe o que vem: quem está no cais pica, confere e recebe, tudo seguido. No fim escolhe — arrumar o que chegou, ou picar mais uma chegada.': 'The system does not know what is coming: whoever is at the dock scans, checks and books in, all in one go. At the end they choose — put away what arrived, or scan another arrival.',
    '…e a quantidade não bate': '…and the quantity does not match',
    'Desvio do fluxo de cima: regista-se o que chegou de facto, e é isso que entra em stock.': 'A detour off the flow above: what actually arrived is recorded, and that is what goes into stock.',
    'A arrumação não bloqueia nada: diz o que se passa e o gestor decide. A tarefa deixa de ser tua.': 'Put-away blocks nothing: it says what is going on and the manager decides. The task is no longer yours.',
    'O gestor manda corrigir uma posição': 'The manager sends a location to be fixed',
    'Nasce de um sinal no relatório do gestor: é ele que manda corrigir. O motor não descobre nada sozinho — só dá a tarefa a quem estiver livre.': 'It is born from a signal in the manager\'s report: they are the one who orders the fix. The engine finds nothing on its own — it only gives the task to whoever is free.',
    'Também é tarefa: o motor dá-a quando uma posição fica vazia.': 'It is a task too: the engine gives it when a location is emptied.',
    'A mesma tarefa da arrumação; também calha à separação.': 'The same task as in put-away; it falls to picking as well.',
    'Cada sinal traz o que fazer a seguir. Se mandar corrigir uma posição, é aqui que nasce a tarefa que a arrumação vai receber.': 'Each signal carries what to do next. If they order a location fixed, this is where the task put-away will get is born.',
    /* ── os percursos: o título e a linha de contexto de cada caso ── */
    'Um caso por linha, só por botões que existem e sem repetir ecrãs. O turno começa sempre no 01 · Entrar, que abre no início de cada função. Clica num ecrã para o abrir.': 'One case per line, only through buttons that exist, with no screen repeated. A shift always starts at 01 · Sign in, which opens on the home screen of each role. Click a screen to open it.',
    'Um turno normal': 'A normal shift',
    'Um toque em «Começar tarefas» e o motor dá a primeira. Acabada uma, dá a seguinte.': 'One tap on «Start tasks» and the engine gives you the first. Finish one, it gives you the next.',
    'Chega mercadoria ao cais': 'Goods arrive at the dock',
    'O sistema não sabe o que vem. Pica-se cada entrega e passa-se à seguinte; a fila é com o motor.': 'The system does not know what is coming. Each delivery is scanned and then the next; the queue is the engine\'s business.',
    'Receber o que chegou': 'Book in what arrived',
    'Vem pela fila e pode calhar a outra pessoa. Quando fecha, nascem as tarefas de arrumar.': 'It comes through the queue and may fall to someone else. When it closes, the put-away tasks are born.',
    'A quantidade que chegou não bate': 'The quantity that arrived does not match',
    'Regista-se o que chegou de facto. É isso que entra em stock.': 'What actually arrived is recorded. That is what goes into stock.',
    'A posição proposta está ocupada': 'The suggested location is taken',
    'A posição fica marcada como ocupada e o sistema propõe logo a seguinte.': 'The location is marked as taken and the system suggests the next one straight away.',
    'A etiqueta do artigo não se lê': 'The item label will not scan',
    'Escreve-se o código. O sistema conta as leituras à mão.': 'The code is typed in. The system counts the manual entries.',
    'A etiqueta da posição não se lê': 'The location label will not scan',
    'O mesmo na prateleira. À terceira vez, o sistema aconselha o gestor a renovar a etiqueta.': 'The same on the rack. On the third time, the system advises the manager to replace the label.',
    'Um problema que não é da arrumação': 'A problem that is not put-away\'s to solve',
    'A arrumação não bloqueia nada: diz o que se passa e o gestor decide. A tarefa volta à fila.': 'Put-away blocks nothing: it says what is going on and the manager decides. The task goes back to the queue.',
    'Corrigir uma posição, por tarefa': 'Fixing a location, as a task',
    'O motor não descobre o erro. Alguém dá por ele — a separação, uma leitura, ou o gestor — e o motor põe a tarefa na fila.': 'The engine does not find the error. Someone does — picking, a scan, or the manager — and the engine puts the task in the queue.',
    'Dar com uma posição errada': 'Spotting a location that is wrong',
    'Ninguém conta o armazém. Quem vê uma posição que não bate, corrige-a ali.': 'Nobody counts the warehouse. Whoever sees a location that does not match fixes it there.',
    'Consultar um artigo': 'Look up an item',
    'Ver onde está e quanto há. Não muda nada.': 'See where it is and how much there is. Changes nothing.',
    'Consultar uma posição e corrigi-la': 'Look up a location and fix it',
    'Se o que lá está não bate, corrige-se sem sair da consulta.': 'If what is there does not match, it is fixed without leaving the look-up.',
    'Levar a palete vazia': 'Take the empty pallet away',
    'Também é tarefa: aparece na fila quando uma posição fica vazia.': 'It is a task too: it shows up in the queue when a location is emptied.',
    'Sair do turno': 'End the shift',
    'Na arrumação nada fica a meio. Sair é um toque.': 'In put-away nothing is left half done. Signing out is one tap.',
    'O lote é do motor: as guias do mesmo camião, pela ordem mais curta. No fim da volta vem outra.': 'The batch is the engine\'s: the orders for the same truck, in the shortest order. After one round comes another.',
    'Na paragem falta quantidade': 'Short quantity at the stop',
    'Regista-se o que se tirou e fica uma correção na posição. A guia não sai sem o resto.': 'What was taken is recorded and a correction is left on the location. The order does not leave without the rest.',
    'A etiqueta não se lê': 'The label will not scan',
    'Escreve-se o código e a volta segue.': 'The code is typed in and the round carries on.',
    'Um problema na paragem': 'A problem at the stop',
    'Fica registado, o gestor decide, e a volta continua na paragem seguinte.': 'It is recorded, the manager decides, and the round carries on at the next stop.',
    'Ver como está uma guia': 'Checking how an order is doing',
    'O que falta, onde ficou e para que camião vai.': 'What is missing, where it ended up and which truck it goes on.',
    'Onde está e quanto há, sem largar a volta.': 'Where it is and how much there is, without dropping the round.',
    'Consultar uma posição': 'Look up a location',
    'O que está lá, sem largar a volta.': 'What is in it, without dropping the round.',
    'A mesma tarefa da arrumação, na fila da separação.': 'The same task as in put-away, in picking\'s queue.',
    'Sair com guias por fechar': 'Leaving with orders still open',
    'O PDA diz o que fica por fechar. Quem sai, sai; o gestor fica a saber.': 'The PDA says what is left open. Whoever leaves, leaves; the manager gets to know.',
    'Levanta na prateleira, confere volume a volume, leva ao cais e fecha. A ordem é a hora dos camiões.': 'Collect from the shelf, check parcel by parcel, take to the dock and close. The order is the trucks\' times.',
    'Falta um volume na prateleira': 'A parcel is missing from the shelf',
    'A guia fica incompleta e espera. O resto do camião segue.': 'The order stays incomplete and waits. The rest of the truck goes on.',
    'A etiqueta do cais não se lê': 'The dock label will not scan',
    'Escreve-se o cais e o carregamento segue.': 'The dock is typed in and loading carries on.',
    'Consultar uma guia': 'Look up an order',
    'O que falta, onde ficou e quando sai.': 'What is missing, where it ended up and when it leaves.',
    'Ver o que está na prateleira': 'See what is on the shelf',
    'A prateleira toda, e para que camião vai cada guia.': 'The whole shelf, and which truck each order goes on.',
    'Sair com uma saída por fechar': 'Leaving with a dispatch still open',
    'O PDA diz que camião fica aberto antes de deixar sair.': 'The PDA says which truck is left open before letting anyone go.',
    'Os números do turno e, por baixo, os insights: onde se perde tempo e o que falha.': 'The shift\'s numbers and, below them, the insights: where time is lost and what fails.',
    'Agir sobre um sinal': 'Acting on a signal',
    'Cada sinal traz o que fazer a seguir. O gestor manda dali.': 'Each signal carries what to do next. The manager gives the order from there.',
    'Atribuir uma tarefa a alguém': 'Assign a task to someone',
    'Com o motivo escrito. Passa à frente na fila dessa pessoa e o motor aprende.': 'With the reason written down. It jumps the queue for that person and the engine learns.',
    'Ver o armazém todo': 'See the whole warehouse',
    'Quem está a trabalhar, o que falta, o que sai hoje — e atribuir a partir daí.': 'Who is working, what is missing, what goes out today — and assign from there.',
    'Trabalhar como qualquer função': 'Work as any of the roles',
    'O gestor entra em qualquer função e trabalha como ela.': 'The manager steps into any role and works as it.',
    'O gestor não tem trabalho por fechar no PDA.': 'The manager has no open work on the PDA.',
    'A palete vazia de 60100201': 'The empty pallet from 60100201',
    'Aponta à guia e carrega no gatilho': 'Aim at the note and press the trigger',
    'Começar o turno na separação': 'Starting the picking shift',
    'Quando a separação não corre bem': 'When picking goes wrong',
    'Consultar na separação': 'Look up (picking)',
    'A separação entra, vê a volta que o motor lhe deu e começa. O lote enche-se sozinho e a guia entra inteira.': 'Picking signs in, sees the round the engine gave them and starts. The batch fills itself and an order goes in whole.',
    'Os desvios da volta: não há nada na posição, está lá menos do que a guia pede, a etiqueta não se lê — e sair do turno com guias por fechar.': 'The detours of the round: nothing in the location, less than the order asks for, a label that will not scan — and leaving the shift with orders still open.',
    'Ver como está uma guia, onde está um artigo, ou o que está numa posição, sem mexer em nada.': 'See how an order is doing, where an item is, or what is in a location, without changing anything.',
    'Início da separação': 'Picking home',
    'Volta fechada': 'Round closed',
    'Consultar guia': 'Look up an order',
    'Mostrar a volta do turno e pôr a pessoa a andar com um toque; dá acesso às consultas.': 'Show the shift\'s round and get the person moving with one tap; gives access to the look-ups.',
    'Mostrar o que a separação tem para fazer, por ordem do motor.': 'Show what picking has to do, in the engine\'s order.',
    'Confirmar que as guias ficaram na prateleira e que a volta acabou.': 'Confirm the orders are on the shelf and the round is over.',
    'Dizer, com um toque, o que impede a recolha.': 'Say, with one tap, what is stopping the pick.',
    'Avisar que há trabalho por acabar antes de a pessoa sair do turno.': 'Warn that there is unfinished work before the person ends the shift.',
    'Ver como está uma guia: o que falta, onde ficou e para que camião vai.': 'See how an order is doing: what is missing, where it is and which truck it goes on.',
    'Bom dia, Rui': 'Good morning, Rui',
    'Turno das 8h · 3 guias na tua volta': '8 am shift · 3 orders in your round',
    'O teu lote: 3 guias · 18 linhas': 'Your batch: 3 orders · 18 lines',
    '2 tarefas': '2 tasks',
    'Volta · 3 guias · 18 linhas': 'Round · 3 orders · 18 lines',
    'Porquê: o camião DPD fecha às 11h30': 'Why: the DPD truck closes at 11:30',
    'Porquê: esvaziada às 9h50 em 60201503': 'Why: emptied at 9:50 in 60201503',
    'Volta fechada às 11h02': 'Round closed at 11:02',
    '3 guias na prateleira de preparados': '3 orders on the staging shelf',
    'Deixaste': 'You left',
    'G-24187 · completa': 'G-24187 · complete',
    'G-24193 · completa': 'G-24193 · complete',
    'G-24190 · incompleta': 'G-24190 · incomplete',
    'fica à espera': 'waiting',
    'PP-GLS-01': 'PP-GLS-01',
    'A expedição leva as completas. A incompleta espera pelo stock e não entra na fila da expedição.': 'Shipping takes the complete ones. The incomplete one waits for stock and does not enter the shipping queue.',
    'Não há nada na posição': 'Nothing in the location',
    'Está lá menos do que a guia pede': 'Less there than the order asks for',
    'Está lá outro artigo': 'A different item is there',
    'Tens 1 guia por fechar': 'You have 1 order still open',
    'A G-24190 tem 4 linhas por recolher': 'G-24190 has 4 lines left to pick',
    'Se saíres agora': 'If you leave now',
    'A guia': 'The order',
    'volta à fila': 'goes back to the queue',
    'O camião GLS': 'The GLS truck',
    '14h00': '2 pm',
    'Quem entrar a seguir apanha-a onde a deixaste. O gestor vê quem saiu com trabalho aberto.': 'Whoever comes next picks it up where you left it. The manager sees who left with open work.',
    'Continuar a volta': 'Carry on with the round',
    'Sair mesmo': 'Leave anyway',
    'Lê a guia ou escreve o número': 'Scan the order or type its number',
    'Auto Peças Norte · camião DPD · 11h30': 'Auto Peças Norte · DPD truck · 11:30',
    'Linhas': 'Lines',
    'Recolhidas': 'Picked',
    'completa': 'complete',
    'W712 · zona 20': 'W712 · zone 20',
    '6 un.': '6 pcs',
    'Reservado para guias': 'Reserved for orders',
    'Zona 20 · Coluna 02 · Prateleira 01': 'Zone 20 · Column 02 · Shelf 01',
    'Última saída': 'Last out',
    '9h40 · Rui Costa': '9:40 · Rui Costa',
    'Escrever': 'Type it',
    'Paragem 4 de 18': 'Stop 4 of 18',
    'Fornecedor': 'Supplier',
    'As paletes da SKF continuam a ser picadas no PDA antigo.': 'SKF pallets are still logged on the old PDA.',
    'Registar chegada': 'Log the arrival',
    'Picar a seguinte': 'Scan the next one',
    'Passou ao motor': 'Sent to the engine',
    'Chegada': 'Arrival',
    'Picar a chegada': 'Log the arrival',
    'Chegada registada': 'Arrival logged',
    'Picar a chegada: o sistema não sabe o que vem a caminho, por isso é aqui que a mercadoria entra no sistema.': 'Log the arrival: the system does not know what is coming, so this is where the goods enter the system.',
    'Confirmar que a chegada ficou registada e que a tarefa de receção foi para o motor.': 'Confirm the arrival is logged and the receiving task went to the engine.',
    'Chegou o quê?': 'What arrived?',
    'O sistema não sabe o que vem a caminho. Diz quem trouxe e quantas paletes.': 'The system does not know what is coming. Say who brought it and how many pallets.',
    'Esperado hoje': 'Expected today',
    'Castrol Portugal': 'Castrol Portugal',
    '2 paletes': '2 pallets',
    'Filtros Mann': 'Mann filters',
    '1 palete': '1 pallet',
    'Chegada registada às 10h05': 'Arrival logged at 10:05',
    'Castrol Portugal · 2 paletes no cais': 'Castrol Portugal · 2 pallets at the dock',
    'Tarefa de receção': 'Receiving task',
    '1 nova': '1 new',
    'O motor avalia o que chegou e põe a receção na fila pela prioridade, sozinho. Pica o resto do que veio: a mercadoria fica no cais até alguém começar a tarefa.': 'The engine weighs up what arrived and puts the goods-in task in the queue by priority, on its own. Scan the rest of what came: the goods stay at the dock until someone starts the task.',
    'O motor põe-na na fila pela prioridade. Enquanto ninguém a começa, a mercadoria fica no cais.': 'The engine puts it in the queue by priority. Until someone starts it, the goods stay at the dock.',
    'Ver a fila': 'See the queue',
    'Registar a chegada de uma encomenda': 'Log the arrival of a delivery',
    'O sistema não sabe o que vem a caminho (23 set.): a arrumação pica a chegada no PDA e é daí que nasce a tarefa de receção. Só as paletes da SKF são picadas noutro PDA.': 'The system does not know what is coming (23 Sep): put-away logs the arrival on the PDA and that is what creates the receiving task. Only SKF pallets are logged on another PDA.',
    'É uma tarefa: vem pela fila, na ordem do motor. Nasce quando a arrumação pica a chegada (CU-40).': 'It is a task: it comes through the queue, in the engine\'s order. It is created when put-away logs the arrival (CU-40).',
    'O sistema não sabe o que vem a caminho: quando chega mercadoria ao cais, a arrumação pica a chegada. Daí nasce a tarefa de receção, que o motor põe na fila pela prioridade. Confere-se com a guia do fornecedor, entra no stock, e as tarefas de arrumar voltam ao motor.': 'The system does not know what is coming: when goods reach the dock, put-away logs the arrival. That creates the receiving task, which the engine puts in the queue by priority. It is checked against the supplier note, goes into stock, and the put-away tasks go back to the engine.',
    'Começar as tarefas': 'Start the tasks',
    'Novo — não está no dossiê. A pessoa carrega em «Começar» e o motor entrega a tarefa seguinte da fila; ao acabar uma, entrega a seguinte (22 set.).': 'New — not in the dossier. The person presses «Start» and the engine hands over the next task in the queue; when one ends, it hands over the next (22 Sep).',
    'Não é para quem trabalha no armazém — arrumação, separação e expedição não o veem; só o gestor (22 set.).': "Not for warehouse staff — put-away, picking and shipping don't see it; only the manager (22 Sep).",
    'Desliza para o lado →': 'Scroll sideways →',
    'Entrar no turno': 'Start the shift',
    'Ler um código': 'Scan a code',
    'Consultar um artigo': 'Look up an item',
    'Ver onde fica uma posição': 'See where a location is',
    'Bloquear um artigo danificado': 'Block a damaged item',
    'Contar uma posição': 'Count a location',
    'Corrigir uma posição errada': 'Fix a wrong location',
    'Receber o lote de guias': 'Receive the batch of orders',
    'Sair com guias por fechar': 'Leave with orders still open',
    'Ver o risco dos camiões': 'See the trucks\' risk',
    'Uma encomenda incompleta espera': 'An incomplete order waits',
    'Carregar e fechar uma saída': 'Load and close a dispatch',
    'Ver o relatório do turno': 'See the shift report',
    'Ler os sinais': 'Read the signals',
    'Fixar a prioridade de uma tarefa': 'Set a task\'s priority',
    'Ver o que sai e o que vai sair': 'See what is going out and what will',
    'Atribuir uma tarefa a uma pessoa': 'Assign a task to a person',
    'Ver a fila e saber o que fazer a seguir': 'See the queue and know what to do next',
    'Comunicar uma exceção': 'Report an exception',
    'Ver os movimentos': 'See the movements',
    'Desbloquear um artigo': 'Unblock an item',
    'Sair do turno': 'End the shift',
    'Ver o que este terminal consegue provar': 'See what this terminal can prove',
    'Ficar sem ligação': 'Lose the connection',
    'Extrair o registo de uma pessoa': 'Export a person\'s record',
    'Lançar uma contagem': 'Launch a count',
    'Ver as exceções comunicadas': 'See the reported exceptions',
    'Corrigir a localização de uma ficha': 'Fix a record\'s location',
    'Criar e gerir utilizadores': 'Create and manage users',
    'Ler e atribuir um código de barras': 'Scan and assign a barcode',
    'Ver o que já se decidiu antes': 'See what was decided before',
    'Pedir uma etiqueta de posição': 'Request a location label',
    'Levar a palete vazia ao parque': 'Take the empty pallet to the yard',
    'Receber uma devolução': 'Receive a return',
    'Levar uma guia preparada ao cais': 'Take a prepared order to the dock',
    'Precisa do mapa, que é da v2.': 'Needs the map, which is v2.',
    'A arrumação não bloqueia: diz «Artigo danificado» no «O que se passa?», e o gestor decide (22 set.).': 'Put-away doesn\'t block: it reports «Damaged item» in «What\'s wrong?», and the manager decides (22 Sep).',
    'É uma tarefa: vem pela fila, na ordem do motor. Quem dá a chegada do camião ainda está em aberto.': 'It is a task: it comes through the queue, in the engine\'s order. Who records the truck\'s arrival is still open.',
    'Ninguém conta: a falta de quantidade corrige-se na posição, no PDA (18 set.).': 'Nobody counts: a short quantity is fixed at the location, on the PDA (18 Sep).',
    'O motor aprende com as atribuições do gestor.': 'The engine learns from the manager\'s assignments.',
    'Sem ligação o PDA não trabalha: diz-o, e mostra o que ficou gravado.': 'Without a connection the PDA doesn\'t work: it says so, and shows what was saved.',
    'Ninguém conta (18 set.).': 'Nobody counts (18 Sep).',
    'Só o gestor, ou quem ele autorizar.': 'Only the manager, or whoever they authorise.',
    'A arrumação não pede: o sistema aconselha renovar a etiqueta quando a posição é escrita à mão muitas vezes (RF-92), e o gestor vê o sinal.': 'Put-away doesn\'t request it: the system advises renewing the label when the location is typed in too often (RF-92), and the manager sees the signal.',
    'A arrumação na zona de máquina; a separação na zona de mão.': 'Put-away in the forklift zone; picking in the hand zone.',
    'Saiu das operações da arrumação (22 set.). Falta decidir quem recebe; o gestor valida.': 'Removed from put-away\'s operations (22 Sep). Who receives it is still to decide; the manager validates.',
    'Casos de uso': 'Use cases',
    'Diagrama de casos de uso': 'Use case diagram',
    'Quem faz o quê: cada ator ligado aos casos de uso que faz. «Todos» são as quatro funções. Os que ficaram fora, ou são da v2, estão só na lista, riscados.': 'Who does what: each actor linked to the use cases they do. «Everyone» is the four roles. Those left out, or v2, are only in the list, struck through.',
    'Atores': 'Actors',
    'Nota': 'Note',
    'Ainda sem ecrã.': 'No screen yet.',
    'Fora': 'Out',
    'v2': 'v2',
    'Todos': 'Everyone',
    'Motor': 'Engine',
    'Transversais': 'Cross-cutting',
    'Os casos de uso do dossiê, com as decisões tomadas desde então. Cada um diz quem o faz e em que ecrãs está.': 'The use cases from the dossier, with the decisions taken since. Each one says who does it and which screens it is on.',
    'Porquê: espera há 2h10, a mais antiga': 'Why: waiting 2h10, the oldest',
    'Porquê: esvaziada às 10h02 em 60100201': 'Why: emptied at 10:02 in 60100201',
    'Porquê: chegaram ao cais às 10h05 e ocupam-no': 'Why: they arrived at the dock at 10:05 and are taking it up',
    'Receber 2 paletes · Castrol Portugal': 'Receive 2 pallets · Castrol Portugal',
    'Diagrama de fluxo — visão geral': 'Flow diagram — overview',
    'Os fluxos e para onde se segue de cada um. As setas tracejadas são as voltas à fila ou ao início, juntas na caixa de baixo. Cada fluxo, mais abaixo, tem o seu diagrama com todas as situações: cada caixa é um ecrã, cada seta é um botão ou uma leitura, com o que se carrega escrito nela. As caixas tracejadas são ecrãs de outro fluxo.': 'The flows and where each one leads. Dashed arrows are the returns to the queue or the home screen, gathered in the box at the bottom. Each flow, further down, has its own diagram with every situation: each box is a screen, each arrow is a button or a scan, with what is pressed written on it. Dashed boxes are screens from another flow.',
    'A desenhar…': 'Drawing…',
    'leitura': 'scan',
    'O fluxo do PDA, por escrito': 'The PDA flow, written out',
    'Cada fluxo, o que é, e cada ecrã: para que serve e para onde leva cada botão ou leitura. Clica num ecrã para o abrir.': 'Each flow, what it is, and each screen: what it is for and where each button or scan leads. Click a screen to open it.',
    'Leitura': 'Scan',
    'Não leva a lado nenhum.': 'Leads nowhere.',
    'Passaram ao motor': 'Sent to the engine',
    'Onde estão as paletes': 'Where the pallets are',
    'O motor põe-nas na fila pela prioridade — a seguinte a fazer pode ser outra. Vê a ordem na fila.': 'The engine puts them in the queue by priority — the next one to do may be another. See the order in the queue.',
    'Objetivo': 'Purpose',
    'Identificar quem está a usar o PDA, com utilizador e palavra-passe.': 'Identify who is using the PDA, with username and password.',
    'Mostrar o trabalho do turno e pôr a pessoa a trabalhar com um toque; dá acesso às consultas e correções que ela faz por iniciativa própria.': 'Show the shift\'s work and get the person working with one tap; gives access to the look-ups and fixes they do on their own initiative.',
    'Mostrar as tarefas por ordem, e porque é que cada uma está onde está.': 'Show the tasks in order, and why each one is where it is.',
    'Começar a tarefa de receção: identificar a entrega pela guia do fornecedor.': 'Start the receiving task: identify the delivery by the supplier\'s note.',
    'Comparar o que era esperado com o que chegou.': 'Compare what was expected with what arrived.',
    'Registar quanto chegou de facto, quando não é o esperado.': 'Record how much actually arrived, when it isn\'t what was expected.',
    'Confirmar que entrou no stock, e que as tarefas de arrumar foram para o motor, que lhes dá a prioridade na fila.': 'Confirm it is in stock, and that the put-away tasks went to the engine, which sets their priority in the queue.',
    'Confirmar que a palete que a pessoa tem à frente é a da tarefa.': 'Confirm that the pallet in front of the person is the one in the task.',
    'Dizer para onde levar a palete, e porquê.': 'Say where to take the pallet, and why.',
    'Registar a posição ocupada e passar à proposta seguinte.': 'Record the location as taken and move on to the next suggestion.',
    'Confirmar, pela leitura, que a palete ficou na posição certa.': 'Confirm, by scanning, that the pallet is in the right location.',
    'Confirmar o registo e passar à tarefa seguinte.': 'Confirm the record and move on to the next task.',
    'Dizer, com um toque, o que impede a arrumação.': 'Say, with one tap, what is stopping the put-away.',
    'Identificar o artigo quando a etiqueta não se lê.': 'Identify the item when the label won\'t scan.',
    'Identificar a posição quando a etiqueta não se lê; conta para aconselhar a renovar a etiqueta.': 'Identify the location when the label won\'t scan; counts towards advising a new label.',
    'Confirmar que o problema ficou registado e que o gestor foi avisado.': 'Confirm the problem is recorded and the manager has been told.',
    'Confirmar a posição e o artigo que saem.': 'Confirm the location and the item that come out.',
    'Dizer para onde vai o stock, e confirmar pela leitura.': 'Say where the stock goes, and confirm by scanning.',
    'Confirmar que o stock mudou de sítio, num só registo.': 'Confirm the stock has moved, in a single record.',
    'Identificar a posição que não bate com o sistema.': 'Identify the location that doesn\'t match the system.',
    'Dizer quantas unidades estão de facto na posição.': 'Say how many pieces are actually in the location.',
    'Confirmar a correção; o gestor vê a diferença.': 'Confirm the correction; the manager sees the difference.',
    'Levar a palete vazia ao parque, e confirmar lendo a etiqueta.': 'Take the empty pallet to the yard, and confirm by scanning the label.',
    'Confirmar que a posição ficou livre.': 'Confirm the location is now free.',
    'Ver onde está um artigo, e quanto há em cada sítio.': 'See where an item is, and how much is in each place.',
    'Ver o que está numa posição e, se não bater, corrigir.': 'See what is in a location and, if it doesn\'t match, fix it.',
    'Mostrar as guias da volta, já escolhidas pelo motor.': 'Show the orders for the round, already chosen by the engine.',
    'Levar a pessoa à posição e dizer o que tirar.': 'Take the person to the location and say what to pick.',
    'Registar o que falta e corrigir o stock ali mesmo.': 'Record what is missing and fix the stock right there.',
    'Deixar as guias na prateleira de preparados, e dizer onde ficaram.': 'Leave the orders on the staging shelf, and say where they are.',
    'Mostrar os camiões por hora de fecho, e o que está pronto.': 'Show the trucks by closing time, and what is ready.',
    'Confirmar cada volume antes de sair da prateleira.': 'Confirm each parcel before it leaves the shelf.',
    'Levar os volumes ao cais do camião.': 'Take the parcels to the truck\'s dock.',
    'Confirmar cada volume que sobe, e fechar a saída.': 'Confirm each parcel that is loaded, and close the dispatch.',
    'Mostrar ao gestor os números do turno e os sinais que pedem atenção.': 'Show the manager the shift figures and the signals that need attention.',
    'Dizer que o PDA não está ligado, e o que ficou gravado.': 'Say the PDA isn\'t connected, and what was saved.',
    'A pessoa entra, vê o que tem para fazer e começa. O motor já escolheu a tarefa seguinte.': 'The person signs in, sees what there is to do and starts. The engine has already chosen the next task.',
    'Quando chega mercadoria ao cais, nasce uma tarefa de receção, e o motor põe-na na fila pela prioridade. Confere-se com a guia do fornecedor, entra no stock, e as tarefas de arrumar voltam ao motor.': 'When goods arrive at the dock, a receiving task is created and the engine puts it in the queue by priority. It is checked against the supplier\'s note, goes into stock, and the put-away tasks go back to the engine.',
    'Levar a palete do cais à posição que o motor propõe, e confirmar lendo o artigo e a posição.': 'Take the pallet from the dock to the location the engine suggests, and confirm by scanning the item and the location.',
    'Os desvios — posição ocupada, não cabe, artigo danificado, etiqueta que não se lê. Tudo fica registado e o gestor vê.': 'The detours — location taken, doesn\'t fit, damaged item, label that won\'t scan. Everything is recorded and the manager sees it.',
    'O motor encontrou stock fora do sítio e manda-o mudar. Tira-se da origem e põe-se no destino, num só registo.': 'The engine found stock in the wrong place and has it moved. It comes out of the source and goes into the destination, in a single record.',
    'Por iniciativa própria: quem vê que uma posição não bate com o sistema corrige ali mesmo. Ninguém conta.': 'On their own initiative: whoever sees a location doesn\'t match the system fixes it right there. Nobody counts.',
    'A palete que ficou vazia sai da posição e vai para o parque; a posição fica livre.': 'The pallet that became empty leaves the location and goes to the yard; the location is freed.',
    'Saber onde está um artigo, ou o que está numa posição, sem mexer em nada.': 'Find out where an item is, or what is in a location, without changing anything.',
    'A separação faz a volta ao armazém com o lote de guias, e deixa-as na prateleira de preparados.': 'Picking does the round of the warehouse with the batch of orders, and leaves them on the staging shelf.',
    'A expedição confere os volumes, leva-os ao cais e carrega o camião.': 'Shipping checks the parcels, takes them to the dock and loads the truck.',
    'O gestor acompanha o turno e os sinais; qualquer pessoa vê quando o PDA perde a ligação.': 'The manager follows the shift and the signals; anyone sees when the PDA loses its connection.',
    'Caminho:': 'Route:',
    'sai do cais para a zona 30, coluna 03 à direita.': 'leave the dock for zone 30, column 03 on the right.',
    'Filtro de óleo W712': 'W712 oil filter',
    'Alternativa (azul, 48 dp)': 'Alternative (blue, 48 dp)',
    'Recurso (transparente, contorno azul, 48 dp)': 'Fallback (transparent, blue outline, 48 dp)',
    'Receber o que chega': 'Receive what arrives',
    'Quando a arrumação não corre bem': 'When put-away goes wrong',
    'Corrigir uma posição (tarefa)': 'Fix a location (task)',
    'Corrigir o que está numa posição': 'Fix what is in a location',
    'Levar a palete vazia': 'Take the empty pallet away',
    'Consultar': 'Look up',
    'Lê a guia do fornecedor': 'Scan the supplier\'s delivery note',
    'Confere o que chegou': 'Check what arrived',
    'A quantidade não bate': 'The quantity doesn\'t match',
    'Recebido': 'Received',
    'Escreve o artigo': 'Type the item',
    'Escreve a posição': 'Type the location',
    'Problema registado': 'Problem recorded',
    'Tira da origem': 'Take from the source',
    'Põe no destino': 'Put in the destination',
    'Corrigida': 'Fixed',
    'Lê a posição do erro': 'Scan the wrong location',
    'O que está lá?': 'What\'s there?',
    'Correção registada': 'Correction recorded',
    'Leva ao parque': 'Take it to the pallet yard',
    'No parque': 'In the pallet yard',
    'Lê a GUIA': 'Scan the NOTE',
    'O documento que veio com a mercadoria, ou a referência do fornecedor': 'The document that came with the goods, or the supplier\'s reference',
    'No cais de entrada': 'At the inbound dock',
    '2 paletes · Castrol Portugal': '2 pallets · Castrol Portugal',
    'Chegaram às 10h05': 'Arrived at 10:05',
    'Lê a guia, se ela tiver código de barras': 'Scan the note, if it has a barcode',
    'Guia GR-58213 · Castrol Portugal': 'Note GR-58213 · Castrol Portugal',
    '40 un.': '40 pcs',
    '24 un.': '24 pcs',
    '12 un.': '12 pcs',
    'Se bate certo, confirma. Se não, diz quanto chegou.': 'If it matches, confirm. If not, say how many arrived.',
    'Está tudo — confirmar': 'It\'s all here — confirm',
    'Óleo 5W30 · 5 L · esperadas 40': '5W30 oil · 5 L · 40 expected',
    'Quantas chegaram?': 'How many arrived?',
    'Faltam 4 unidades': '4 pieces missing',
    'Fica registado como divergência da receção. A receção segue.': 'Recorded as a receiving discrepancy. Receiving goes on.',
    'Só entra no stock o que chegou.': 'Only what arrived goes into stock.',
    'Entrou no stock': 'Now in stock',
    '36 × Óleo 5W30 e 24 × Filtro W712 · às 10h09': '36 × 5W30 oil and 24 × W712 filter · at 10:09',
    'Na tua fila': 'In your queue',
    'Tarefas de arrumar': 'Put-away tasks',
    '2 novas': '2 new',
    'Onde estão': 'Where they are',
    'Cais de entrada': 'Inbound dock',
    'A palete de óleo vai à máquina; o motor procura-lhe sítio na zona 30.': 'The oil pallet goes by forklift; the engine looks for a spot in zone 30.',
    'Arrumar agora': 'Put away now',
    'Voltar ao início': 'Back to home',
    'Escreve o ARTIGO': 'Type the ITEM',
    'A etiqueta não se lê. Escreve a referência que está na caixa.': 'The label won\'t scan. Type the reference on the box.',
    'Referência do artigo': 'Item reference',
    'Fica registado como escrito à mão.': 'Recorded as typed in.',
    'Confirmar': 'Confirm',
    'Escreve a POSIÇÃO': 'Type the LOCATION',
    'Os oito algarismos da etiqueta da prateleira': 'The eight digits on the shelf label',
    'Código da posição': 'Location code',
    'Fica registada como leitura à mão. Se a etiqueta falhar muitas vezes, o sistema aconselha a renová-la.': 'Recorded as typed in. If the label keeps failing, the system will advise renewing it.',
    'Registado às 10h16 com o teu nome': 'Recorded at 10:16 under your name',
    'O gestor foi avisado. A palete fica onde está até ele decidir.': 'The manager has been told. The pallet stays where it is until they decide.',
    'A tarefa sai da tua fila.': 'The task leaves your queue.',
    'Lê a ORIGEM': 'Scan the SOURCE',
    '6 × Óleo 5W30 · 5 L': '6 × 5W30 oil · 5 L',
    'Estão fora do sítio': 'They are in the wrong place',
    'Lê a posição, depois o artigo': 'Scan the location, then the item',
    'Já não está lá': 'It\'s no longer there',
    'Zona 30 · Coluna 04 · Prateleira 01': 'Zone 30 · Column 04 · Shelf 01',
    'Já tem o mesmo artigo — junta-se ao que lá está.': 'It already holds the same item — it joins what is there.',
    'Lê a posição onde pousas': 'Scan the location where you put it',
    '6 × Óleo 5W30 mudaram de sítio': '6 × 5W30 oil moved',
    'De 60300302 para 60300401 · às 10h31': 'From 60300302 to 60300401 · at 10:31',
    'Sair e entrar foram um só registo. Não se criou stock novo.': 'Out and in were a single record. No new stock was created.',
    'A etiqueta da posição onde o que está não bate com o sistema': 'The label of the location where what\'s there doesn\'t match the system',
    'O sistema diz': 'The system says',
    'Quantas estão lá?': 'How many are there?',
    'Conta para o limite de correções abertas.': 'Counts towards the limit of open corrections.',
    'Registar correção': 'Record the correction',
    '60300302 corrigida': '60300302 fixed',
    'Óleo 5W30: de 12 para 6 un. · às 10h40': '5W30 oil: from 12 to 6 pcs · at 10:40',
    'O gestor vê a diferença no relatório do turno.': 'The manager sees the difference in the shift report.',
    'Leva ao PARQUE': 'Take it to the YARD',
    'A palete vazia de 60100201 (zona de máquina)': 'The empty pallet from 60100201 (forklift zone)',
    'Parque de paletes': 'Pallet yard',
    'Junto ao cais de entrada': 'Next to the inbound dock',
    'Lê a etiqueta do parque': 'Scan the pallet yard label',
    'Palete vazia no parque': 'Empty pallet in the yard',
    '60100201 ficou livre às 10h45': '60100201 became free at 10:45',
    'Lê o artigo, ou escreve a referência': 'Scan the item, or type the reference',
    'OL5W30-5 · vai para a zona 30': 'OL5W30-5 · goes to zone 30',
    'Onde está': 'Where it is',
    '36 a arrumar': '36 to put away',
    'Artigo': 'Item',
    'Quantidade': 'Quantity',
    'Última entrada': 'Last in',
    '10h14 · Marta Silva': '10:14 · Marta Silva',
    'Não é isto que lá está? Corrige aqui.': 'Isn\'t this what\'s there? Fix it here.',
    'Não bate certo — corrigir': 'Doesn\'t match — fix it',
    'Outro problema': 'Another problem',
    'Menos': 'Less',
    'Mais': 'More',
    'Todas': 'All',
    'Função': 'Role',
    'Começar trabalho': 'Start work',
    'Voltar': 'Back',
    'A tua fila': 'Your queue',
    '4 tarefas': '4 tasks',
    'Total de tarefas: 4': 'Total tasks: 4',
    'Operações': 'Operations',
    'Consultar posição': 'Look up a location',
    'A seguinte: Arrumar palete': 'Next: Put away pallet',
    'Prioridades de hoje': "Today's priorities",
    'Ações rápidas': 'Quick actions',
    'Ver todas': 'See all',
    'Navegação': 'Navigation',
    'Fila': 'Queue',
    '12 tarefas': '12 tasks',
    'Início': 'Home',
    'Sair': 'Sign out',
    'Turno das 8h · 4 tarefas na tua fila': '8 am shift · 4 tasks in your queue',
    'Receber': 'Receive',
    '3 paletes no cais': '3 pallets at the dock',
    'Arrumar': 'Put away',
    '5 por arrumar': '5 to put away',
    'Paletes': 'Pallets',
    '1 vazia': '1 empty',
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
    'Correção': 'Correction',
    'Corrigir 60300302': 'Fix 60300302',
    'Porquê: leram esta posição e o que lá está não bate': 'Why: this location was scanned and what is in it does not match',
    'Palete vazia': 'Empty pallet',
    'Levar palete vazia ao parque': 'Take the empty pallet to the pallet yard',
    'Porquê: esvaziada às 10h02 em 60100201 (zona de máquina)': 'Why: emptied at 10:02 in 60100201 (forklift zone)',
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
    'Zona 30 · Coluna 03 · Prateleira 01': 'Zone 30 · Column 03 · Shelf 01',
    'Porquê aqui': 'Why here',
    'Sai muito — 34 por dia — e fica a 8 m do cais. É pesado para ir mais alto.': 'It moves fast — 34 a day — and is 8 m from the dock. Too heavy to go higher.',
    'Caminho: sai do cais para a zona 30, coluna 03 à direita.': 'Route: leave the dock for zone 30, column 03 on the right.',
    'Ler a posição': 'Scan the location',
    'Está ocupada': "It's taken",
    'Não cabe': "It doesn't fit",
    '60300301 ficou registada como ocupada': '60300301 was recorded as taken',
    'O gestor vai ver porque é que o sistema a julgava livre.': 'The manager will look into why the system thought it was free.',
    'É a seguinte mais perto do cais que aguenta o peso.': 'It is the next closest to the dock that takes the weight.',
    'Só podes escolher outra posição se a 3.ª também estiver ocupada.': 'You can only choose another location if the 3rd is taken too.',
    'Lê a POSIÇÃO': 'Scan the LOCATION',
    'A etiqueta na prateleira onde pousaste a palete': 'The label on the shelf where you placed the pallet',
    'Deve ser': 'Should be',
    'O sistema confirma de novo, ao ler, que a posição ainda serve': 'When you scan, the system checks again that the location still fits',
    'Arrumada em 60300401': 'Put away in 60300401',
    '40 × Óleo 5W30 · registado com o teu nome às 10h14': '40 × 5W30 oil · recorded under your name at 10:14',
    'Estado do stock': 'Stock status',
    'Antes': 'Before',
    'Agora': 'Now',
    'A aguardar arrumação · cais': 'Waiting for put-away · dock',
    'Armazenado · 60300401': 'Stored · 60300401',
    'Seguinte na fila: Corrigir 60300302 — stock fora do sítio.': 'Next in the queue: Fix 60300302 — stock in the wrong place.',
    'Próxima tarefa': 'Next task',

    /* ── separar ── */
    'O teu lote': 'Your batch',
    '3 guias · 18 linhas · 3 colunas': '3 orders · 18 lines · 3 columns',
    'Camião DPD · fecha 11h30': 'DPD truck · closes 11:30',
    'G-24187 · Auto Peças Norte': 'G-24187 · Auto Peças Norte',
    '9 linhas · apertado: faltam 27 min de trabalho': '9 lines · tight: 27 min of work left',
    'Camião GLS · 14h00': 'GLS truck · 14:00',
    '6 linhas': '6 lines',
    '3 linhas': '3 lines',
    'Começar a recolher': 'Start picking',
    'Tira': 'Take',
    '6 × Filtro de óleo W712': '6 × W712 oil filter',
    'Para G-24187 · o stock já está reservado para ti': 'For G-24187 · the stock is already reserved for you',
    'A seguir': 'Next',
    '60200502 · 5 m': '60200502 · 5 m',
    'Lê a POSIÇÃO, depois o ARTIGO': 'Scan the LOCATION, then the ITEM',
    'Aqui há 2 das 6': 'Only 2 of the 6 are here',
    'Regista o que tiraste. A guia fica incompleta e não sai sem o resto.': 'Record what you took. The order stays incomplete and does not ship without the rest.',
    'Pedidas': 'Ordered',
    'Tiraste': 'Taken',
    'Faltam': 'Missing',
    'Fica registada como correção desta posição.': 'It is recorded as a correction to this location.',
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
    '60300301 recusada 3 vezes': '60300301 refused 3 times',
    'O sistema julgava-a livre. Mandar corrigir?': 'The system thought it was free. Order a fix?',
    'Stock': 'Stock',
    '60200502 com 2 correções abertas': '60200502 has 2 open corrections',
    '60300401 · 3 de 10 à mão': '60300401 · 3 of 10 typed',
    'A etiqueta já não se lê bem. Renovar?': 'The label no longer scans well. Renew it?',
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
    'Fluxo': 'Flow',
    'Leva a': 'Goes to',
    '— não leva a lado nenhum —': '— goes nowhere —',
    'Já não leva a lado nenhum': 'It no longer goes anywhere',
    'Afastar': 'Zoom out',
    'Aproximar': 'Zoom in',
    'Ajustar': 'Fit',
    'Mapa de navegação do PDA': 'PDA navigation map',
    'Contornado a azul: o botão ou a leitura que leva a outro ecrã. A seta diz a qual.': 'Outlined in blue: the button or scan that leads to another screen. The arrow shows which.',
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
    [/^Agora leva a (.+)$/, function (m) { var t = traduzir(m[1]); return 'Now goes to ' + (t === null ? m[1] : t); }],
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
