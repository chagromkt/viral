import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// 15 FORMATS — DATA
// ═══════════════════════════════════════════════════════════════

const FORMATS = [
  {
    id:"tela-dividida", icon:"🖥️", label:"Tela Dividida", color:"#6366f1",
    desc:"Tela dividida: você fala embaixo, imagens ilustram em cima.",
    elementos:["Conflito universal + relevância emocional","Gancho visual que para o scroll","Alinhamento entre imagem e fala"],
    variations:[
      { id:"analisar", label:"Analisar alguém/algo", icon:"🔍",
        desc:"Você analisa um personagem real e conecta com a moral do seu nicho.",
        fields:[
          {id:"personagem",label:"Personagem real famoso no seu setor",placeholder:"Ex: Elon Musk, Syngenta, JBS, um fazendeiro conhecido do agro..."},
          {id:"conflito",label:"Conflito universal do personagem",placeholder:"Ex: Começou falido, foi traído, foi subestimado..."},
          {id:"virada",label:"Virada ou revelação da história",placeholder:"Ex: O que ninguém sabe que ele fez, a decisão que mudou tudo..."},
          {id:"moral",label:"Moral da história para o seu público",placeholder:"Ex: A lição que seu público deve tirar dessa história"},
        ]
      },
      { id:"ilustrar", label:"Imagens ilustrando a fala", icon:"🖼️",
        desc:"Você narra, imagens emocionantes aparecem em cima reforçando cada frase.",
        fields:[
          {id:"tema",label:"Tema central do vídeo",placeholder:"Ex: injustiça no mercado, quem trabalha invisível, meritocracia..."},
          {id:"conflito_universal",label:"Conflito universal que o tema ativa",placeholder:"Ex: Raiva de quem tem tudo fácil, indignação, injustiça..."},
          {id:"personagem_referencia",label:"Personagem ou situação de referência (real)",placeholder:"Ex: Um influencer, uma marca, um caso do seu setor..."},
          {id:"moral",label:"Moral para o seu público",placeholder:"Ex: O que você quer que seu público sinta/faça ao final"},
        ]
      },
      { id:"narrar", label:"Narrar cena que acontece", icon:"🎬",
        desc:"Você reage a um vídeo real enquanto ele passa, comentando ao vivo.",
        fields:[
          {id:"video_referencia",label:"Vídeo ou cena que você vai narrar",placeholder:"Ex: Um vídeo viral do seu setor, uma cena de programa, um caso real..."},
          {id:"ponto_central",label:"Ponto central que você quer extrair",placeholder:"Ex: O que nessa cena ensina algo pro seu público..."},
          {id:"conflito",label:"Conflito que a cena representa",placeholder:"Ex: arrogância vs confiança, teoria vs prática..."},
          {id:"moral",label:"Moral conectada com o que você vende/ensina",placeholder:"Ex: Como isso se aplica ao seu nicho..."},
        ]
      },
    ]
  },
  {
    id:"tela-verde", icon:"🟩", label:"Tela Verde", color:"#22c55e",
    desc:"Você fala em frente com imagens de fundo que ilustram o roteiro.",
    elementos:["Tom mais acelerado e ritmo de fala","Cortar respiros na edição","Imagens de fundo alinhadas com cada frase"],
    variations:[
      { id:"personagem-famoso", label:"Personagem famoso + moral", icon:"🎭",
        desc:"Conta história real de alguém conhecido e conecta com lição pro seu público.",
        fields:[
          {id:"personagem",label:"Personagem famoso real (do seu nicho ou universo do público)",placeholder:"Ex: Lady Gaga, Ayrton Senna, um empresário do agro conhecido..."},
          {id:"bullying_duvida",label:"O que fizeram/falaram contra essa pessoa",placeholder:"Ex: Duvidaram, zoaram, disseram que nunca ia dar certo..."},
          {id:"virada",label:"O que ela fez que provou todos errados",placeholder:"Ex: O que aconteceu depois, o resultado que surpreendeu..."},
          {id:"moral",label:"Moral para o seu público",placeholder:"Ex: Não desista quando duvidarem de você..."},
        ]
      },
      { id:"identificacao", label:"Identificação com comportamento", icon:"🏃",
        desc:"Usa referência cultural para validar quem se sente 'menos que' no seu nicho.",
        fields:[
          {id:"referencia_cultural",label:"Referência cultural que o público reconhece",placeholder:"Ex: Um atleta famoso, uma celebridade, alguém que 'não é perfeito'..."},
          {id:"comportamento_validado",label:"O comportamento 'imperfeito' que você vai validar",placeholder:"Ex: correr devagar, postar com medo, começar sem saber tudo..."},
          {id:"dor_do_publico",label:"A dor que o público sente",placeholder:"Ex: se sentir amador, ter medo do julgamento, achar que não está pronto..."},
          {id:"moral",label:"Moral que liberta o público",placeholder:"Ex: Não é sobre ser perfeito. É sobre aparecer..."},
        ]
      },
      { id:"segredo-cta", label:"Segredo + Desafio/CTA", icon:"🔑",
        desc:"Abre curiosidade sobre algo que funciona, prova com dados, convida à ação.",
        fields:[
          {id:"segredo",label:"O segredo ou metodologia que você descobriu",placeholder:"Ex: O padrão que todos os criadores que crescem têm em comum..."},
          {id:"resultado_real",label:"Seu resultado real usando esse segredo",placeholder:"Ex: Cresci X%, fechei Y clientes, minha conta saiu de A para B..."},
          {id:"exemplos_conhecidos",label:"Outros criadores/marcas que usam o mesmo princípio",placeholder:"Ex: Nomes famosos do seu nicho que aplicam isso..."},
          {id:"cta",label:"Convite à ação específico",placeholder:"Ex: Nome da comunidade, desafio, evento, palavra nos comentários..."},
        ]
      },
    ]
  },
  {
    id:"palestrinha", icon:"🎓", label:"Palestrinha", color:"#f59e0b",
    desc:"Você usa slide, TV, quadro ou notebook como apoio visual enquanto explica.",
    elementos:["Provar um ponto com visual + fala","Autoridade: quem dá palestra sabe do assunto","Ritmo cômico ou exagerado como camada opcional"],
    variations:[
      { id:"ensinar-vender", label:"Ensinar + Vender", icon:"🛒",
        desc:"Explica um problema do público em slides e resolve com seu produto/serviço.",
        fields:[
          {id:"problema_publico",label:"Problema cotidiano do público (que você resolve)",placeholder:"Ex: Não sabe o que a namorada quer, não sabe escolher o insumo certo..."},
          {id:"sinais_codigos",label:"Sinais/códigos que o público não sabe ler",placeholder:"Ex: As 'indiretas' que o cliente dá, os sinais que o mercado manda..."},
          {id:"produto_solucao",label:"Seu produto/serviço que resolve isso",placeholder:"Ex: Meu curso, minha consultoria, meu produto X..."},
          {id:"cta",label:"CTA final da palestrinha",placeholder:"Ex: Entre em contato hoje, acesse o link, clique agora..."},
        ]
      },
      { id:"traducao-cultural", label:"Tradução Cultural", icon:"📚",
        desc:"Pega algo complexo/clássico e traduz com linguagem familiar do seu público.",
        fields:[
          {id:"conceito_classico",label:"Conceito clássico, técnico ou difícil do seu nicho",placeholder:"Ex: Dom Casmurro, Análise SWOT, CAC vs LTV, ciclo da safra..."},
          {id:"referencias_familiares",label:"Referências populares que seu público conhece",placeholder:"Ex: Celebridades, memes, programas de TV, personalidades do setor..."},
          {id:"linguagem_familiar",label:"Termos e gírias do universo do público",placeholder:"Ex: direct, exposed, trend, shipar — ou termos do seu nicho..."},
          {id:"moral",label:"Punchline final (hashtag resumo)",placeholder:"Ex: #fuitraído #naduvidacancela ou equivalente do seu nicho..."},
        ]
      },
      { id:"contraste-ab", label:"Contraste A vs B", icon:"⚖️",
        desc:"Lista comparativa entre dois comportamentos opostos, cria identificação.",
        fields:[
          {id:"universo_comparacao",label:"Universo da comparação",placeholder:"Ex: Príncipe vs Princeso, Especialista vs Amador, Produtor que cresce vs que estagna..."},
          {id:"comportamento_a",label:"Comportamento A — o errado/fraco",placeholder:"Ex: Fica esperando reconhecimento, não faz follow-up, posta aleatoriamente..."},
          {id:"comportamento_b",label:"Comportamento B — o certo/forte",placeholder:"Ex: Toma iniciativa, tem sistema, publica com consistência..."},
          {id:"pergunta_final",label:"Pergunta final ao público",placeholder:"Ex: Você é mais qual? Com qual você se identifica?"},
        ]
      },
    ]
  },
  {
    id:"narrado", icon:"🎙️", label:"Narrado", color:"#a855f7",
    desc:"Sua voz na edição narra as imagens que estão passando no vídeo.",
    elementos:["Tom de áudio de WhatsApp — conversa com amigo","Corte a cada 3 segundos máximo","Contraste negativo/positivo cíclico"],
    variations:[
      { id:"telepatia", label:"Telepatia / Pensamento narrado", icon:"🧠",
        desc:"Você encena e a voz narra o que está pensando — como ler sua mente.",
        fields:[
          {id:"situacao",label:"Situação cotidiana que você vai encenar",placeholder:"Ex: Preparando uma entrega para cliente, arrumando um espaço, fazendo algo do dia a dia..."},
          {id:"pensamento_interno",label:"O que você está pensando enquanto faz isso",placeholder:"Ex: Sua preocupação real, o cálculo interno, a dúvida que ninguém vê..."},
          {id:"contraste",label:"O contraste entre aparência e pensamento",placeholder:"Ex: Por fora parece tranquilo, por dentro está calculando X..."},
          {id:"moral",label:"Moral / dica que fecha o vídeo",placeholder:"Ex: O que esse bastidor revela sobre o seu mercado..."},
        ]
      },
      { id:"galeria", label:"Imagens da galeria ilustrando", icon:"🖼️",
        desc:"Voz narra por cima de cenas da vida real — imagens aleatórias da galeria.",
        fields:[
          {id:"desafio_extremo",label:"Desafio ou situação extrema do seu nicho",placeholder:"Ex: Sofá de 25 anos, cliente que nunca higienizou X, problema crônico do setor..."},
          {id:"personagem_crenca_errada",label:"Personagem com crença errada (o 'marido que achava que era couro')",placeholder:"Ex: O cliente que acha que não precisa de X, o produtor que insiste em Y..."},
          {id:"momento_choque",label:"Momento de choque visual / surpreendente",placeholder:"Ex: O que aparece que ninguém espera, o dado nojento/absurdo..."},
          {id:"moral",label:"Dica prática + CTA",placeholder:"Ex: É por isso que você deve fazer X a cada Y meses. Me contrate para isso..."},
        ]
      },
      { id:"processo-historia", label:"Processo de uma história", icon:"📹",
        desc:"Câmera registra ao vivo, voz conta o que está acontecendo em tempo real.",
        fields:[
          {id:"historia_real",label:"História real acontecendo (que você vai gravar)",placeholder:"Ex: Entregando um projeto ao vivo, resolvendo um problema no campo, encontro inesperado..."},
          {id:"conflito_no_caminho",label:"Obstáculo ou conflito que aparece durante",placeholder:"Ex: O cliente foi embora antes, o equipamento falhou, o prazo era curto..."},
          {id:"resolucao",label:"Como você resolveu ou qual foi o desfecho",placeholder:"Ex: Você foi atrás, improvisou, encontrou uma solução criativa..."},
          {id:"moral",label:"Missão cumprida + reflexão",placeholder:"Ex: E foi isso. Missão parcialmente cumprida. O que isso ensina..."},
        ]
      },
    ]
  },
  {
    id:"cine", icon:"🎬", label:"CINE", color:"#06b6d4",
    desc:"Bordas cortadas, não ocupa a tela inteira. Estilo cinematográfico.",
    elementos:["Música que conversa com a emoção do roteiro","Tom de ligação de vídeo entre amigos","Remover respiros e pausas na edição"],
    variations:[
      { id:"fala-imagens", label:"Fala + Imagens ilustrativas", icon:"🎙️",
        desc:"Roteiro reflexivo com imagens que reforçam emoção. Estilo confessional.",
        fields:[
          {id:"crenca_popular",label:"Crença popular ou frase que todo mundo repete no seu nicho",placeholder:"Ex: 'O pobre nunca tem nada', 'Quem não aparece, esquece', 'Marketing é custo'..."},
          {id:"personagem_famoso",label:"Personagem famoso real para ancorar a história",placeholder:"Ex: CR7, um empresário do setor, uma liderança conhecida do seu mercado..."},
          {id:"conflito_universal",label:"Conflito universal que o público já sentiu",placeholder:"Ex: Querer mudar mas não conseguir, ter fome mas não ter estrutura..."},
          {id:"moral",label:"Moral — curta, direta, memorizável",placeholder:"Ex: Quem tem fome, determinação e não procura desculpa, sempre chega lá..."},
        ]
      },
      { id:"letterings", label:"Letterings dinâmicos", icon:"🔤",
        desc:"Textos chamativos em tela reforçam cada parte do roteiro.",
        fields:[
          {id:"tema_central",label:"Tema central do vídeo",placeholder:"Ex: Persistência, contradição, paradoxo do seu nicho..."},
          {id:"frases_chave",label:"3 frases-chave que aparecem na tela (uma por vez)",placeholder:"Ex: Frase 1 / Frase 2 / Frase 3 — cada uma um insight do seu tema"},
          {id:"contraste",label:"O contraste ou paradoxo principal",placeholder:"Ex: Era X, descobriu que era Y / Parecia simples, era complexo..."},
          {id:"punch_final",label:"Punch line final que fecha tudo",placeholder:"Ex: A frase que fica na cabeça depois que o vídeo acaba..."},
        ]
      },
      { id:"gravacao-crua", label:"Gravação crua estilo Zoom", icon:"📹",
        desc:"Sem edição, sustentado 100% pelo roteiro. Conversa direta.",
        fields:[
          {id:"objeto_conquista",label:"Algo que você conquistou com trabalho (seu 'moto')",placeholder:"Ex: Seu negócio, seu cliente, sua metodologia, algo tangível que você construiu..."},
          {id:"pressao_externa",label:"Pressão que outros fazem para você 'destruir' ou agir errado",placeholder:"Ex: 'Faz isso que dá dinheiro fácil', 'Todo mundo faz assim', 'Larga essa ideia'..."},
          {id:"seu_valor",label:"Por que você não vai na onda e o que te diferencia",placeholder:"Ex: Isso aqui não veio fácil. Só eu e Deus sabemos o trabalho que deu..."},
          {id:"moral",label:"Conselho final para quem trabalhou pra conquistar",placeholder:"Ex: Não vai na onda desse povo. Senão você nunca vai ter nada..."},
        ]
      },
    ]
  },
  {
    id:"storytelling-visual", icon:"🎭", label:"Storytelling Visual", color:"#ec4899",
    desc:"O vídeo expressa visualmente o que está sendo dito — encenação ou desenho.",
    elementos:["Cada frase vira uma ação visual","Objetos físicos representando conceitos abstratos","Alinhamento total visual + roteiro"],
    variations:[
      { id:"encenar-objetos", label:"Encenar / Objetos exagerados", icon:"🎪",
        desc:"Você age fisicamente o que está narrando, com humor ou drama.",
        fields:[
          {id:"conflito_universal",label:"Conflito universal do seu nicho",placeholder:"Ex: Traição, subestimação, promessa que não foi cumprida..."},
          {id:"twist",label:"O twist — o que o público achava ser X era na verdade Y",placeholder:"Ex: As '16 mulheres' eram na verdade 16 versões da mesma pessoa..."},
          {id:"jornada_criador",label:"Versões ou fases da sua própria jornada",placeholder:"Ex: Como você era antes vs quem você é agora — os marcos da mudança..."},
          {id:"moral",label:"Moral conectada com o que você ensina/vende",placeholder:"Ex: É disso que você precisa se lembrar quando criar seu próximo conteúdo..."},
        ]
      },
      { id:"desenhar-ilustrar", label:"Desenhar / Ilustrar a fala", icon:"✏️",
        desc:"Cada frase vira um desenho ou animação que representa o conceito.",
        fields:[
          {id:"metafora_visual",label:"Metáfora visual central do seu nicho",placeholder:"Ex: Lanterna no escuro (TDAH), sementes que crescem (agro), engrenagens (processo)..."},
          {id:"dado_contraintuitivo",label:"Dado ou fato contraintuitivo",placeholder:"Ex: Tomate tem 6x mais metanol que Coca Zero — qual é o equivalente do seu nicho?"},
          {id:"ritmo_repeticao",label:"Sequência lógica que se repete (cria ritmo)",placeholder:"Ex: Se A então B, se B então C, se C então D — o ciclo do seu tema"},
          {id:"moral",label:"Moral — a descoberta final",placeholder:"Ex: O que muda na cabeça do público depois de entender isso..."},
        ]
      },
    ]
  },
  {
    id:"conflito-situacional", icon:"💥", label:"Conflito Situacional", color:"#ef4444",
    desc:"O vídeo começa com a encenação de um conflito MUITO forte que parece real.",
    elementos:["Gancho visual extremo nos primeiros 3s","Conexão analógica com o conteúdo real","Familiaridade com situações que todos já viram"],
    variations:[
      { id:"porta-de-entrada", label:"Conflito como porta de entrada", icon:"🚪",
        desc:"Briga/acidente/roubo → vira explicação ou analogia com o nicho.",
        fields:[
          {id:"situacao_conflito",label:"Situação de conflito físico/urgente para encenar",placeholder:"Ex: Alguém sendo 'roubado' pelo mercado, uma 'batida' de expectativa vs realidade..."},
          {id:"conexao_nicho",label:"A conexão/analogia com o seu nicho",placeholder:"Ex: Assim como nesse roubo, muitos produtores estão sendo 'roubados' de X..."},
          {id:"desenvolvimento",label:"O conteúdo real que vem depois do conflito",placeholder:"Ex: O que você ensina, o dado, a solução, a metodologia..."},
          {id:"moral_cta",label:"Moral ou CTA final",placeholder:"Ex: Não deixe que isso aconteça com você. Me chame aqui..."},
        ]
      },
      { id:"conflito-conteudo", label:"Conflito É o conteúdo", icon:"🎭",
        desc:"A encenação dramática IS the content — humor, marca, música.",
        fields:[
          {id:"situacao_absurda",label:"Situação absurda ou dramática do seu nicho",placeholder:"Ex: Cliente que insiste no erro, o absurdo do dia a dia do seu setor..."},
          {id:"personagem_situacao",label:"Quem está no conflito e o que cada um representa",placeholder:"Ex: Você vs o mercado, o cliente vs a realidade, dois tipos opostos de profissional..."},
          {id:"punchline",label:"O punchline ou virada cômica/dramática",placeholder:"Ex: O que acontece no final que surpreende ou gera identificação..."},
          {id:"cta",label:"CTA de engajamento",placeholder:"Ex: Comenta se já passou por isso, marca quem vive isso..."},
        ]
      },
      { id:"conflito-produto", label:"Conflito + Produto/Serviço", icon:"🛒",
        desc:"Situação dramática que desemboca naturalmente em uma oferta.",
        fields:[
          {id:"situacao_dramatica",label:"Situação dramática que o seu produto/serviço resolve",placeholder:"Ex: O cliente X estava nessa situação crítica quando..."},
          {id:"ponto_virada",label:"O ponto de virada onde seu produto entrou",placeholder:"Ex: Foi quando ele entrou em contato / descobriu / aplicou..."},
          {id:"resultado",label:"O resultado após usar seu produto/serviço",placeholder:"Ex: O que mudou, o número, a transformação..."},
          {id:"cta",label:"CTA direto + urgência",placeholder:"Ex: Se você está nessa situação, entre em contato hoje..."},
        ]
      },
    ]
  },
  {
    id:"caixinha-polemica", icon:"❓", label:"Caixinha Polêmica", color:"#f97316",
    desc:"O vídeo gira em torno de uma pergunta polêmica que abre espaço para debate.",
    elementos:["Pergunta cria loop imediato de curiosidade","Conflito entre o que pode e o que vai dizer","Termos técnicos sempre traduzidos para o popular"],
    variations:[
      { id:"nao-posso-responder", label:'"Não posso responder isso, mas..."', icon:"🚫",
        desc:"Finge que não vai responder enquanto responde com riqueza de detalhes.",
        fields:[
          {id:"pergunta_proibida",label:"A pergunta que você 'não deveria' responder",placeholder:"Ex: Como as maiores empresas do agro escondem os custos reais? Como X funciona de verdade?"},
          {id:"resposta_detalhada",label:"A resposta que você vai dar mesmo assim, em detalhes",placeholder:"Ex: Os detalhes, o processo, o que realmente acontece por trás..."},
          {id:"termos_traducao",label:"Termos técnicos + tradução popular (pares)",placeholder:"Ex: 'Playground' = brinquedos de criança de shopping / 'CAC' = quanto custa trazer um cliente..."},
          {id:"imagem_mental",label:"Imagem mental que o público já conhece",placeholder:"Ex: Aquele tipo de loja de shopping que nunca tem ninguém mas nunca fecha..."},
        ]
      },
      { id:"opiniao-forte", label:"Pergunta absurda + opinião forte", icon:"😏",
        desc:"Criador dá uma resposta que divide opiniões e gera debate nos comentários.",
        fields:[
          {id:"pergunta_polemica",label:"A pergunta polêmica do seu nicho",placeholder:"Ex: Vale a pena contratar agência de marketing no agro? Marketing é custo ou investimento?"},
          {id:"posicao_clara",label:"Sua posição clara e sem rodeios",placeholder:"Ex: Não, a maioria não vale. E eu vou explicar por quê..."},
          {id:"argumentos",label:"3 argumentos para defender sua posição",placeholder:"Ex: Argumento 1 / Argumento 2 / Argumento 3"},
          {id:"cta_engajamento",label:"CTA de engajamento — pergunta para os comentários",placeholder:"Ex: Você concorda? Me fala nos comentários qual é sua experiência..."},
        ]
      },
      { id:"segredo-setor", label:"Segredo do setor revelado", icon:"🤫",
        desc:"Pergunta sobre algo que 'não deveria' ser respondido publicamente no seu setor.",
        fields:[
          {id:"segredo",label:"O segredo do setor que você vai revelar",placeholder:"Ex: O que as grandes agências de agro não te contam, o que as distribuidoras escondem..."},
          {id:"por_que_nao_falam",label:"Por que ninguém fala sobre isso",placeholder:"Ex: Porque é incômodo, porque protege quem está ganhando, porque o mercado prefere não saber..."},
          {id:"prova_validacao",label:"Prova ou validação do que você está dizendo",placeholder:"Ex: Dado, caso real, situação que você viveu ou viu..."},
          {id:"cta",label:"CTA: o que fazer com essa informação",placeholder:"Ex: Agora que você sabe disso, aqui está o que fazer..."},
        ]
      },
    ]
  },
  {
    id:"dinamismo", icon:"🚶", label:"Dinamismo", color:"#14b8a6",
    desc:"Câmera parada. Você se movimenta o tempo todo — cada frase em um lugar diferente.",
    elementos:["Cérebro presta atenção quando algo muda no ambiente","Cada posição cria micro-antecipação","A última posição é sempre a mais impactante"],
    variations:[
      { id:"frase-por-posicao", label:"Frase por posição", icon:"🎯",
        desc:"1 frase = 1 lugar diferente no ambiente. Câmera completamente parada.",
        fields:[
          {id:"tema",label:"Tema do vídeo",placeholder:"Ex: O erro que todo profissional de agro comete, a verdade sobre resultado..."},
          {id:"frases_posicoes",label:"5 a 7 frases (uma por posição, da abertura ao clímax)",placeholder:"Ex: Frase 1 (perto, gancho) / Frase 2 / Frase 3 / ... / Frase final (mais impactante)"},
          {id:"instrucao_postura",label:"Tom/expressão de cada posição",placeholder:"Ex: P1: sério, perto / P2: animado, lateral / P3: surpreso, afastado / ..."},
          {id:"punch_final",label:"Punch line da última posição",placeholder:"Ex: A frase mais poderosa do vídeo — a que vai nos comentários"},
        ]
      },
      { id:"reacao-exagerada", label:"Reação exagerada + movimento", icon:"😤",
        desc:"Expressão e postura muda radicalmente entre frases. Humor ou drama.",
        fields:[
          {id:"situacao_absurda",label:"Situação absurda ou irritante do seu nicho",placeholder:"Ex: Algo que acontece todo dia no seu setor que te incomoda profundamente..."},
          {id:"reacoes",label:"Sequência de reações (uma por posição)",placeholder:"Ex: Calmo / Surpreso / Indignado / Em choque / Conformado..."},
          {id:"objeto_ou_prop",label:"Objeto ou prop que aparece em alguma posição",placeholder:"Ex: Um papel, uma caneta, um produto do seu nicho — algo para gesticular com..."},
          {id:"punchline",label:"Punchline final + CTA",placeholder:"Ex: A frase que resume tudo com humor ou impacto..."},
        ]
      },
      { id:"personagem-posicao", label:"Personagem por posição", icon:"🎭",
        desc:"Cada lugar representa um personagem ou ponto de vista diferente.",
        fields:[
          {id:"conflito_central",label:"Conflito central entre dois lados",placeholder:"Ex: Cliente vs profissional, mercado vs produtor, antes vs depois..."},
          {id:"personagem_1",label:"Personagem 1 — lado A (quem é, o que diz)",placeholder:"Ex: O cliente cético / O produtor que não investe / O mercado antigo..."},
          {id:"personagem_2",label:"Personagem 2 — lado B (quem é, o que diz)",placeholder:"Ex: O especialista / O produtor evoluído / O mercado atual..."},
          {id:"virada",label:"Virada ou reconciliação no final",placeholder:"Ex: O momento em que um lado cede, entende ou se surpreende..."},
        ]
      },
    ]
  },
  {
    id:"comparacao", icon:"⚖️", label:"Comparação", color:"#8b5cf6",
    desc:"Tela dividida: de um lado o errado, do outro o certo. Contraste visual + narrativo.",
    elementos:["Contraste no roteiro E no visual","Situações familiares do cotidiano","Pergunta de auto-check que gera comentários"],
    variations:[
      { id:"erro-acerto", label:"Erro x Acerto", icon:"❌✅",
        desc:"Mesma situação, dois comportamentos opostos lado a lado.",
        fields:[
          {id:"situacao_central",label:"Situação cotidiana do seu nicho",placeholder:"Ex: Responder um cliente, publicar conteúdo, fechar uma venda, escolher um insumo..."},
          {id:"comportamento_errado",label:"3 comportamentos errados/fracos (Lado A)",placeholder:"Ex: Erra 1: diz 'tá caro'. Erra 2: não faz follow-up. Erra 3: posta sem estratégia..."},
          {id:"comportamento_certo",label:"3 comportamentos certos/fortes equivalentes (Lado B)",placeholder:"Ex: Certo 1: pergunta 'caro comparado com o quê?'. Certo 2: liga no dia seguinte..."},
          {id:"pergunta_autocheck",label:"Pergunta de auto-check final",placeholder:"Ex: Qual lado você é na hora de fechar uma venda?"},
        ]
      },
      { id:"pessoa1-pessoa2", label:"Pessoa 1 x Pessoa 2", icon:"👤👤",
        desc:"Dois perfis diferentes reagindo à mesma situação.",
        fields:[
          {id:"perfil_a",label:"Perfil A — o que não evoluiu",placeholder:"Ex: O produtor/profissional que ainda faz do jeito antigo..."},
          {id:"perfil_b",label:"Perfil B — o que evoluiu",placeholder:"Ex: O produtor/profissional que adotou a nova abordagem..."},
          {id:"situacoes_comparadas",label:"3 situações onde os perfis reagem diferente",placeholder:"Ex: Situação 1: como cada um reage ao preço / Sit. 2: ao cliente / Sit. 3: ao resultado..."},
          {id:"pergunta_final",label:"Pergunta final ao público",placeholder:"Ex: Você é mais qual? Qual você quer se tornar?"},
        ]
      },
      { id:"antes-depois", label:"Antes x Depois", icon:"📅",
        desc:"Mesma pessoa/situação em dois momentos distintos no tempo.",
        fields:[
          {id:"ponto_transformacao",label:"O que mudou — o ponto de transformação",placeholder:"Ex: O método, a decisão, o momento em que tudo mudou..."},
          {id:"antes_detalhes",label:"3 características do 'antes' (específicas)",placeholder:"Ex: Antes 1: fazia X / Antes 2: acreditava em Y / Antes 3: resultado era Z..."},
          {id:"depois_detalhes",label:"3 características do 'depois' (específicas)",placeholder:"Ex: Depois 1: faz A / Depois 2: acredita em B / Depois 3: resultado é C..."},
          {id:"cta",label:"CTA — como o público pode ter o mesmo 'depois'",placeholder:"Ex: Se você quer sair do 'antes' e chegar no 'depois', aqui está o caminho..."},
        ]
      },
    ]
  },
  {
    id:"dialogo", icon:"💬", label:"Diálogo", color:"#06b6d4",
    desc:"Você encena dois personagens conversando — um errado, um certo.",
    elementos:["Conflito do cotidiano do público","Contraste visual E de postura entre os personagens","Identificação: um personagem É o público"],
    variations:[
      { id:"razao-emocao", label:"Razão x Emoção", icon:"🧠",
        desc:"Dois lados internos do mesmo personagem conversando.",
        fields:[
          {id:"conflito_interno",label:"Conflito interno que o público vive",placeholder:"Ex: Querer investir em marketing mas ter medo do ROI, querer aparecer mas ter vergonha..."},
          {id:"voz_emocao",label:"Falas da Voz Emocional (medo, preguiça, resistência)",placeholder:"Ex: 'Não vai funcionar', 'É muito caro', 'Não é hora ainda'..."},
          {id:"voz_razao",label:"Falas da Voz Racional (clareza, dados, solução)",placeholder:"Ex: 'Você já fez X sem isso', 'O mercado cresceu Y% com isso', 'Cada mês é dinheiro perdido'..."},
          {id:"virada",label:"A virada — quando a razão vence",placeholder:"Ex: O argumento final que convence a voz emocional..."},
        ]
      },
      { id:"personagem-ab", label:"Personagem A x Personagem B", icon:"👤",
        desc:"Dois perfis opostos em situação real do cotidiano do nicho.",
        fields:[
          {id:"situacao_cotidiana",label:"Situação cotidiana real do nicho",placeholder:"Ex: Reunião com cliente, escolha de insumo, decisão de marketing..."},
          {id:"perfil_a",label:"Perfil A — quem erra / resiste (como é, o que fala)",placeholder:"Ex: O profissional que improvisa, responde na emoção, sem estratégia..."},
          {id:"perfil_b",label:"Perfil B — quem acerta / guia (como é, o que fala)",placeholder:"Ex: O profissional que tem método, responde com dados, tem processo..."},
          {id:"diferenca_visual",label:"Diferença visual entre os dois (roupa, postura, lado da tela)",placeholder:"Ex: A: casual, lado esquerdo, gesticulando / B: confiante, lado direito, calmo..."},
        ]
      },
      { id:"criador-audiencia", label:"Criador x Audiência", icon:"🪞",
        desc:"Criador faz as duas vozes — a dele e a da pessoa que está errando.",
        fields:[
          {id:"dor_audiencia",label:"A dor ou crença errada da audiência",placeholder:"Ex: 'Marketing no agro não funciona', 'Meu cliente não tem dinheiro para isso'..."},
          {id:"voz_audiencia",label:"Falas típicas da audiência (genuínas, não caricatas)",placeholder:"Ex: Frases reais que você ouve dos clientes / seguidores que resistem..."},
          {id:"voz_criador",label:"Suas respostas como criador (autoridade sem arrogância)",placeholder:"Ex: Como você responde a cada objeção com clareza e empatia..."},
          {id:"cta_identificacao",label:"CTA de identificação final",placeholder:"Ex: Você é mais qual? Manda pra quem ainda está do lado da audiência..."},
        ]
      },
    ]
  },
  {
    id:"trivial", icon:"☕", label:"Trivial", color:"#84cc16",
    desc:"Você fala com a câmera enquanto faz uma ação simples do dia a dia.",
    elementos:["A ação banal cria sensação de flagrante autêntico","Tom de áudio de WhatsApp com câmera ligada","Punch final é o que fica na memória"],
    variations:[
      { id:"acao-reflexao", label:"Ação + Reflexão", icon:"💭",
        desc:"Faz algo banal enquanto entrega um insight poderoso.",
        fields:[
          {id:"acao_trivial",label:"Ação trivial que você vai fazer enquanto fala",placeholder:"Ex: Passar café, caminhar no campo, arrumar a mesa, preparar algo..."},
          {id:"reflexao_central",label:"A reflexão/insight que você vai entregar",placeholder:"Ex: O que você pensou hoje de manhã que vale ouro pro seu público..."},
          {id:"conexao_acao_tema",label:"A conexão entre a ação e o tema",placeholder:"Ex: Assim como preparar o café leva tempo e ritual, um bom conteúdo também..."},
          {id:"punch_final",label:"Punch final — 1 frase memorável",placeholder:"Ex: A frase mais simples e mais forte do vídeo..."},
        ]
      },
      { id:"acao-provocacao", label:"Ação + Provocação", icon:"😏",
        desc:"Faz algo cotidiano enquanto lança uma opinião polêmica ou humor.",
        fields:[
          {id:"acao_trivial",label:"Ação trivial",placeholder:"Ex: Bebendo café, dirigindo, fazendo uma entrega..."},
          {id:"opiniao_polemica",label:"Sua opinião polêmica sobre o nicho",placeholder:"Ex: O que você acha que a maioria está fazendo errado e ninguém tem coragem de falar..."},
          {id:"frase_provocadora",label:"A frase provocadora de abertura",placeholder:"Ex: A frase que divide opiniões logo de cara — que gera 'verdade' ou 'discordo' nos comentários"},
          {id:"cta",label:"CTA orgânico final",placeholder:"Ex: Você concorda? Me conta aqui... / Marca alguém que precisa ouvir isso..."},
        ]
      },
      { id:"acao-ensinamento", label:"Ação + Ensinamento", icon:"🎙️",
        desc:"Ensina algo do nicho enquanto executa uma ação simples.",
        fields:[
          {id:"acao_trivial",label:"Ação trivial executada durante o vídeo",placeholder:"Ex: Preparando algo, organizando, fazendo uma tarefa rotineira do nicho..."},
          {id:"ensinamento",label:"O que você vai ensinar enquanto faz essa ação",placeholder:"Ex: Um passo, uma técnica, uma dica que parece simples mas a maioria ignora..."},
          {id:"dado_curioso",label:"Um dado ou fato curioso relacionado ao tema",placeholder:"Ex: Você sabia que X% de Y fazem isso errado? Ou: A ciência prova que..."},
          {id:"moral",label:"Moral prática — o que fazer com esse ensinamento",placeholder:"Ex: Da próxima vez que você for fazer X, lembra disso..."},
        ]
      },
    ]
  },
  {
    id:"the-office", icon:"📺", label:"The Office", color:"#eab308",
    desc:"Alterna entre cenas normais e confessionários olhando direto para a câmera.",
    elementos:["Confessionário cria cumplicidade — público recebe um 'segredo'","Alternância cena ↔ confessionário cria ritmo automático","Gancho sempre no confessionário, nunca na cena"],
    variations:[
      { id:"cena-confessionario", label:"Cena + Confessionário", icon:"🎭",
        desc:"Ação encenada alterna com 'segredo pra câmera'.",
        fields:[
          {id:"situacao_encenada",label:"Situação cotidiana do seu nicho para encenar",placeholder:"Ex: Atendendo um cliente difícil, preparando uma entrega, no campo com um produtor..."},
          {id:"segredo_confessionario",label:"O que você revela no confessionário (pensamento interno)",placeholder:"Ex: O que você está realmente pensando enquanto a situação acontece..."},
          {id:"tema_emocional",label:"Tema emocionalmente relevante (o que sustenta tudo)",placeholder:"Ex: Paternidade, lealdade, superação, injustiça — algo que todo mundo já viveu..."},
          {id:"quebra_expectativa",label:"A quebra de expectativa",placeholder:"Ex: O público espera X (algo negativo) mas você entrega Y (algo positivo/irônico)..."},
        ]
      },
      { id:"situacao-absurda", label:"Situação absurda + comentário", icon:"😏",
        desc:"Algo caótico acontece, você olha pra câmera e comenta.",
        fields:[
          {id:"situacao_caotica",label:"Situação caótica ou absurda do seu nicho",placeholder:"Ex: O cliente que pediu o impossível, o briefing que chegou errado, o imprevisto clássico..."},
          {id:"reacao_cena",label:"O que você faz NA cena (sem revelar o pensamento)",placeholder:"Ex: Você mantém a calma, responde profissionalmente, faz o que precisa..."},
          {id:"comentario_camera",label:"O que você revela para a câmera (o pensamento real)",placeholder:"Ex: O que você REALMENTE estava pensando naquele momento..."},
          {id:"punchline",label:"Punchline final — última olhada para a câmera",placeholder:"Ex: A frase final que resume tudo com humor ou sabedoria..."},
        ]
      },
      { id:"publi-narrativa", label:"Publi integrada à narrativa", icon:"🛒",
        desc:"A marca/produto entra como parte da história, não como anúncio.",
        fields:[
          {id:"problema_narrativa",label:"O problema que você está resolvendo na história",placeholder:"Ex: A situação que criava tensão antes da solução entrar..."},
          {id:"entrada_produto",label:"Como o produto/serviço entra naturalmente na história",placeholder:"Ex: Foi quando eu/ele/ela usou X que tudo mudou..."},
          {id:"resultado_historia",label:"O resultado que a história mostra",placeholder:"Ex: O que resolveu, o desfecho positivo, a transformação..."},
          {id:"cta_natural",label:"CTA natural que emerge da história",placeholder:"Ex: Link na bio, @marca, ou convite que flui da narrativa sem parecer anúncio..."},
        ]
      },
    ]
  },
  {
    id:"lo-fi", icon:"📱", label:"Lo-Fi", color:"#64748b",
    desc:"Simples, despretensioso e 'imperfeito' de propósito. Câmera na mão.",
    elementos:["A 'imperfeição' é o gancho — parece real","Linguagem 100% familiar — zero formalidade","Pode terminar sem resolução — a provocação gera comentários"],
    variations:[
      { id:"camera-mao", label:"Câmera na mão / Ambiente real", icon:"🤳",
        desc:"Gravado onde está, sem preparação. Como um story longo e honesto.",
        fields:[
          {id:"local_gravacao",label:"Onde você está enquanto grava",placeholder:"Ex: No carro, no campo, na varanda, no escritório bagunçado..."},
          {id:"pensamento_do_dia",label:"O pensamento que você teve hoje que vale conteúdo",placeholder:"Ex: Algo que você observou, sentiu ou descobriu hoje que é ouro pro seu público..."},
          {id:"expressao_familiar",label:"Uma expressão familiar do seu nicho para usar",placeholder:"Ex: Gíria, expressão, frase que seu público usa no dia a dia..."},
          {id:"punch_ou_pergunta",label:"Termina com punch ou com pergunta aberta?",placeholder:"Ex: Punch: 'E é isso.' / Pergunta: 'Ou será que sou eu que tô errado?'"},
        ]
      },
      { id:"pensamento-voz-alta", label:"Pensamento em voz alta", icon:"💭",
        desc:"Fala como se estivesse pensando — sem estrutura, sem formalidade.",
        fields:[
          {id:"contradição",label:"A contradição ou paradoxo que você quer explorar",placeholder:"Ex: Algo do seu nicho que parece X mas é Y, que funciona diferente do esperado..."},
          {id:"debate_mental",label:"A pergunta que fica na cabeça do espectador",placeholder:"Ex: Será que eu também faço isso? Será que é diferente para mim?"},
          {id:"tom",label:"Tom escolhido: confessional / reflexivo / absurdo",placeholder:"Ex: Confessional — 'Eu cometi esse erro por anos...' / Reflexivo — 'Comecei a pensar...'"},
          {id:"frase_final",label:"Frase final — simples, forte, sem explicação",placeholder:"Ex: A frase que ficaria bem num post estático. Uma linha. Sem contexto."},
        ]
      },
      { id:"texto-voz", label:"Texto na tela + Voz", icon:"🔤",
        desc:"Lo-fi extremo. Às vezes só texto, às vezes voz por cima.",
        fields:[
          {id:"tema_ativismo",label:"Tema que você quer abordar com impacto",placeholder:"Ex: Uma injustiça do mercado, um comportamento que precisa mudar, uma verdade incômoda..."},
          {id:"frases_tela",label:"3 a 5 frases que aparecerão na tela (uma por vez)",placeholder:"Ex: Frase 1 / Frase 2 / Frase 3 — simples, diretas, progressivas..."},
          {id:"musica_ou_silencio",label:"Música de fundo ou silêncio? Qual emoção quer criar?",placeholder:"Ex: Silêncio total (peso) / Música melancólica / Música provocativa..."},
          {id:"ultima_frase",label:"Última frase na tela — a mais impactante",placeholder:"Ex: A que vai nos stories, nos comentários, nos reposts..."},
        ]
      },
    ]
  },
  {
    id:"bastidores", icon:"🎥", label:"Bastidores", color:"#10b981",
    desc:"Mostra o 'como foi feito' antes do resultado final. Setup vs Shot.",
    elementos:["Curiosidade: público fica até o fim para ver o resultado","Bastidor com som ambiente — resultado com música","Quanto mais surpreendente o processo, maior o UAU"],
    variations:[
      { id:"setup-vs-shot", label:"Setup vs Shot", icon:"🎬",
        desc:"Mostra o processo caótico → corta para o resultado polido.",
        fields:[
          {id:"resultado_final",label:"O produto/resultado final que será revelado",placeholder:"Ex: O vídeo produzido, a foto, a peça criativa, a entrega ao cliente..."},
          {id:"bastidores_caoticos",label:"O caos/perrengue do processo que ninguém vê",placeholder:"Ex: Iluminação improvisada, take errado, equipamento que falhou, ambiente bagunçado..."},
          {id:"detalhe_surpresa",label:"O detalhe surpreendente do processo",placeholder:"Ex: Algo que o público não imaginava que era necessário para o resultado..."},
          {id:"cta_avaliacao",label:"CTA pedindo avaliação do público",placeholder:"Ex: Valeu a pena? O que você achou do resultado? Fiz certo?"},
        ]
      },
      { id:"erros-resultado", label:"Erros + Ajustes → Resultado", icon:"🔧",
        desc:"Mostra tentativas, erros e perseverança antes do produto final.",
        fields:[
          {id:"tentativa_erro",label:"O erro ou tentativa que não deu certo primeiro",placeholder:"Ex: O take que caiu, o produto que ficou errado, a abordagem que falhou..."},
          {id:"ajuste_persistencia",label:"O ajuste ou persistência que você demonstrou",placeholder:"Ex: O que você fez diferente na segunda tentativa, quanto levou, o que aprendeu..."},
          {id:"resultado_conquistado",label:"O resultado conquistado depois da persistência",placeholder:"Ex: O produto final, o número de tentativas, a transformação do 'feio' para o 'UAU'..."},
          {id:"moral_cta",label:"Moral sobre persistência + CTA",placeholder:"Ex: X tentativas depois, aqui está o resultado. Você contrataria para fazer o seu?"},
        ]
      },
      { id:"processo-criativo", label:"Processo criativo → Entrega", icon:"🧠",
        desc:"Mostra o raciocínio e a criação antes do que foi criado.",
        fields:[
          {id:"desafio_criativo",label:"O desafio criativo / briefing que você recebeu",placeholder:"Ex: Criar X em Y horas / com orçamento Z / com requisito incomum..."},
          {id:"processo_pensamento",label:"O processo de pensamento — como você chegou na solução",placeholder:"Ex: As referências que buscou, as ideias que descartou, o insight que definiu tudo..."},
          {id:"entrega_final",label:"A entrega final e a reação do cliente/público",placeholder:"Ex: O que saiu, como o cliente reagiu, o número que comprova o resultado..."},
          {id:"convite",label:"Convite ao público — como ter esse processo para si",placeholder:"Ex: Quer ter esse mesmo processo na sua marca? DM, link na bio..."},
        ]
      },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════
// FRAMEWORKS — DATA
// ═══════════════════════════════════════════════════════════════

const FRAMEWORKS = [
  {
    id:"aida", icon:"⚡", label:"AIDA", color:"#6366f1",
    tagline:"Estrutura universal de conversão",
    when:"Quando quer levar o público a uma ação clara",
    steps:["A — Atenção: Tema + Curiosidade ou Conflito (gancho)","I — Interesse: História, argumento, dado, ensinamento","D — Desejo: Moral da história — instala crença ou gera esperança","A — Ação: CTA direto (peça) ou indireto (subentendido)"],
    ctaTypes:"CTA DIRETO: 'Segue aqui', 'Comenta X', 'Clica no link' | CTA INDIRETO: Termina com punch que faz compartilhar sem pedir",
    colchetes:["[ATENÇÃO — gancho + conflito]","[INTERESSE — história / argumento / dado]","[DESEJO — moral / crença instalada]","[AÇÃO — CTA direto ou indireto]"],
    bestFor:["tela-dividida","tela-verde","palestrinha","caixinha-polemica","comparacao"],
  },
  {
    id:"ihc", icon:"❤️", label:"I.H.C", color:"#ec4899",
    tagline:"Estrutura de conexão emocional",
    when:"Quando quer criar vínculo sem parecer que está vendendo",
    steps:["I — Identificação: Entre na mente da pessoa. 'Você também já sentiu isso?' Use palavras que o público usaria. Escreva como se fosse um áudio de WhatsApp.","H — História: Compartilhe um momento com começo, meio e fim. Conflito → Virada → Consequência. Não é só o que aconteceu — é como aquilo te atravessou.","C — Conteúdo: Plante a semente. Insight, dica prática, provocação ou CTA escondido. Não precisa ser técnico — precisa ser emocionalmente relevante."],
    ctaTypes:"CTA ESCONDIDO: 'É por isso que eu ensino X com tanta paixão dentro da minha comunidade'",
    colchetes:["[I — IDENTIFICAÇÃO: público pensa 'sou eu']","[H — HISTÓRIA: conflito instalado]","[H — VIRADA: o que mudou]","[H — CONSEQUÊNCIA: o que isso ensinou]","[C — CONTEÚDO: semente plantada]","[C — CTA indireto/escondido]"],
    bestFor:["cine","lo-fi","trivial","storytelling-visual","the-office"],
  },
  {
    id:"jeito-e-c", icon:"🔄", label:"Jeito Errado x Certo", color:"#f59e0b",
    tagline:"Estrutura de autoridade contrastiva",
    when:"Quando quer corrigir uma crença e posicionar seu método",
    steps:["1. Conflito: O problema que desequilibra (dor do público)","2. Jeito Errado: A tentativa falha que o público já usou","3. Processo de Virada: O insight / descoberta / teste do criador","4. Jeito Certo: A nova abordagem prática e validada","5. Mudança: Os resultados visíveis — transformação emocional ou prática"],
    ctaTypes:"RESUMO EM 1 LINHA: 'Ao invés de [erro comum], faça [caminho inteligente]'",
    colchetes:["[CONFLITO — dor que o público reconhece]","[JEITO ERRADO — tentativa falha que já fizeram]","[VIRADA — insight / descoberta / teste]","[JEITO CERTO — nova abordagem prática]","[MUDANÇA — resultado / transformação]"],
    bestFor:["comparacao","palestrinha","narrado","cine","storytelling-visual"],
  },
  {
    id:"ele-eu-voce-futuro", icon:"🔁", label:"Ele → Eu → Você → Futuro", color:"#22c55e",
    tagline:"Narrativa progressiva sem se exibir",
    when:"Quando quer falar de conquistas sem parecer arrogante",
    steps:["ELE: Abre com história de outra pessoa (amigo, criador, personagem famoso, caso viral). Gera curiosidade sem se exibir.","EU: Você entra na história. Vulnerabilidade ou posicionamento: como aquilo te atravessou, te provocou, te ensinou.","VOCÊ: Traz o público pra dentro. Convite ou pergunta provocadora. É aqui que a audiência se identifica.","FUTURO: Projeta o que pode acontecer se aplicar (ou não) o que foi ensinado. O público como protagonista."],
    ctaTypes:"DICA: Antes de escrever, defina: Qual mensagem quero deixar? Qual ação ou reflexão quero provocar?",
    colchetes:["[ELE — distância segura: história de outro]","[EU — aproximação: como isso atravessou o criador]","[VOCÊ — espelho: o público entra na narrativa]","[FUTURO — porta aberta: projeção do que é possível]"],
    bestFor:["tela-verde","cine","storytelling-visual","trivial","the-office"],
  },
  {
    id:"analise-estrategica", icon:"🔍", label:"Análise Estratégica", color:"#a855f7",
    tagline:"Planta seu método via análise de outro",
    when:"Quando quer posicionar autoridade surfando uma tendência ou personagem",
    steps:["1. Conflito Universal: O que todo mundo pensa, julga ou comenta sobre o personagem analisado. Frase provocativa que cria curiosidade ou indignação.","2. Resultados: Dado expressivo ou marco alcançado (seguidores, alcance, reconhecimento, viralização).","3. Os 3 Motivos: Três razões que justificam o resultado — e que são os pilares do seu método disfarçados de análise. Linguagem estratégica, mas acessível.","4. Moral da História: A ideia que você quer plantar. Tom provocativo, emocional ou inspirador. CTA indireto natural."],
    ctaTypes:"OBJETIVO: Plantar os pilares do seu método sem parecer que está dando aula ou se exibindo",
    colchetes:["[CONFLITO UNIVERSAL — indignação / curiosidade sobre o personagem]","[RESULTADO — dado específico e verificável]","[MOTIVO 1 — pilar do método disfarçado de análise]","[MOTIVO 2 — pilar do método disfarçado de análise]","[MOTIVO 3 — pilar do método disfarçado de análise]","[MORAL — crença instalada / CTA indireto]"],
    bestFor:["tela-dividida","tela-verde","cine","palestrinha","bastidores"],
  },
  {
    id:"livre", icon:"🎯", label:"Livre (IA decide)", color:"#64748b",
    tagline:"A IA escolhe o melhor framework para o formato e variação",
    when:"Quando não quer escolher — deixa a IA combinar os frameworks ideais",
    steps:["A IA vai analisar o formato, a variação e os campos preenchidos","Vai escolher o framework ou combinação de frameworks mais adequada","Vai sinalizar qual framework está sendo aplicado em cada parte","Pode combinar dois frameworks quando fizer sentido (ex: AIDA + IHC)"],
    ctaTypes:"A IA sinaliza no início do roteiro qual framework escolheu e por quê",
    colchetes:["[FRAMEWORK ESCOLHIDO: X — motivo]","[+ labels específicos do framework selecionado]"],
    bestFor:["todos"],
  },
];

// ═══════════════════════════════════════════════════════════════
// ELEMENTOS VICIANTES — BASE DE CONHECIMENTO COMPLETA
// ═══════════════════════════════════════════════════════════════

const ELEMENTOS_VICIANTES = [
  {
    id:"relevancia-emocional",
    icon:"🔥",
    label:"Relevância Emocional",
    color:"#ef4444",
    principio:"Sem emoção não existe atenção. Fazer o público SENTIR é o primeiro passo para ENGAJAR.",
    teste:"Alguém vai desabar, rir, se indignar ou gritar 'É EXATAMENTE ISSO' ao ver esse vídeo?",
    emocoes:["Raiva","Indignação","Empatia / Tristeza","Esperança","Identificação profunda","Discordância acesa","Curiosidade"],
    regra_de_ouro:"Na primeira frase o público já precisa SENTIR algo. Abertura neutra = janela de atenção perdida.",
    prompt_instruction:"O gancho (primeiros 3–5 segundos) PRECISA despertar uma emoção imediata. Escolha UMA dessas emoções como alvo: Raiva, Indignação, Empatia, Esperança, Identificação ou Curiosidade visceral. Sinalize nos [colchetes] qual emoção está sendo ativada.",
  },
  {
    id:"linguagem-familiar",
    icon:"🧠",
    label:"Linguagem Familiar & Imagens Mentais",
    color:"#6366f1",
    principio:"A mente é preguiçosa. Fala difícil = ela abandona. Fala familiar = ela fica sem esforço.",
    teste:"Essa frase é algo que meu público fala no WhatsApp? Se não — reescreve.",
    regra_de_ouro:"Todo termo técnico precisa de uma tradução em linguagem cotidiana logo depois. Imagem Mental = Linguagem Familiar aplicada em modo visual. As duas sempre juntas.",
    exemplos:["'Consistência nas ações' → 'Repete todo dia, igual escovar os dentes'","'Tênis com ventilação técnica' → 'Ar condicionado pro pé'","'Autoridade parental' → 'Enquanto você morar na minha casa vai seguir as minhas regras'"],
    prompt_instruction:"Use APENAS linguagem que o público já usa no dia a dia. Para cada conceito técnico/abstrato, crie uma imagem mental com palavras do cotidiano do nicho. Nunca explique — mostre com uma cena que a pessoa pode visualizar na cabeça.",
  },
  {
    id:"tema-moral",
    icon:"🎯",
    label:"Tema & Moral da História",
    color:"#f59e0b",
    principio:"Tema é a porta de entrada. Moral da História é o destino. São coisas diferentes.",
    teste:"O Tema tem Relevância Emocional suficiente para prender o público ATÉ a Moral?",
    regra_de_ouro:"Nunca use o conteúdo real como Tema. O Tema precisa ter emoção. A Moral é onde mora o conteúdo real.",
    exemplos_transformacao:[
      {errado:"'Vou falar sobre storytelling'", certo:"Tema: 'Traição' → Moral: storytelling"},
      {errado:"'Vou ensinar pró-labore'", certo:"Tema: 'Ser bancada por homem' → Moral: pró-labore"},
      {errado:"'Marketing para agro'", certo:"Tema: 'Por que quem trabalha mais ganha menos' → Moral: marketing"},
    ],
    prompt_instruction:"Identifique qual é a Moral (conteúdo real) e qual é o Tema (gancho emocional). O roteiro deve começar pelo Tema com Relevância Emocional e CONDUZIR naturalmente até a Moral. A conexão entre Tema e Moral precisa ser honesta e lógica — nunca clickbait.",
  },
  {
    id:"conflito-mudanca",
    icon:"⚡",
    label:"Conflito & Mudança",
    color:"#22c55e",
    principio:"Sem conflito não tem história. Todo conflito gera uma mudança. Sempre.",
    teste:"Se eu tirar o conflito desse roteiro, ainda tem uma história? Se sim — o conflito não é forte o suficiente.",
    equacao:"CONFLITO → AÇÃO → MUDANÇA (obrigatória)",
    regra_de_ouro:"Conflito em cascata = máxima retenção. Cada Mudança abre um novo Conflito. C → M → C → M → C → M → Moral.",
    tipos:[
      {tipo:"Universal",escala:"Grande",ex:"Morte, traição, humilhação pública, ruína financeira"},
      {tipo:"Cotidiano",escala:"Menor",ex:"Brigar com chefe, não ter caderno, prazo estourado"},
    ],
    prompt_instruction:"O roteiro precisa ter pelo menos 1 Conflito claro. Recomendado: 3 pares de Conflito→Mudança em cascata (cada mudança abre o próximo conflito). O último par é o clímax — onde mora a Moral. Sinalize nos [colchetes]: [CONFLITO], [MUDANÇA].",
  },
  {
    id:"curiosidade-ahaa",
    icon:"🔍",
    label:"Curiosidade & Efeito A-HÁ",
    color:"#a855f7",
    principio:"Curiosidade abre o loop. A-HÁ fecha. Sem curiosidade ninguém assiste. Sem A-HÁ a pessoa se sente enganada.",
    metafora:"É igual uma coceira no meio das costas — você só sossega quando coça.",
    teste:"Se o público soubesse a resposta desde o início, ainda assistiria? Se sim — a curiosidade não é forte o suficiente.",
    tipos_curiosidade:[
      "De informação: 'O que é isso que eu não sei?'",
      "De personagem: 'O que vai acontecer com ele?'",
      "De processo: 'Como ele fez isso?'",
      "De revelação: 'Quem é essa pessoa?'",
      "De contradição: 'Como isso pode ser verdade?'",
    ],
    regra_de_ouro:"Nunca abra um loop que não vai fechar. O A-HÁ precisa surpreender — se a resposta é óbvia, não há satisfação. Múltiplos loops = múltiplos motivos para ficar.",
    prompt_instruction:"O gancho precisa abrir pelo menos 1 loop de curiosidade forte. Recomendado: 2–3 loops ao longo do roteiro (abrir → manter → fechar com A-HÁ). O último A-HÁ é o mais impactante — é onde mora a Moral. Sinalize: [CURIOSIDADE — loop aberto], [EFEITO A-HÁ — loop fechado].",
  },
  {
    id:"contraste",
    icon:"↔️",
    label:"Contraste",
    color:"#06b6d4",
    principio:"Opostos colocados lado a lado amplificam a emoção. Quanto maior a distância entre os opostos, mais intenso o impacto.",
    metafora:"Sair do chuveiro quente num dia frio faz o frio parecer mais intenso do que realmente é.",
    teste:"Se eu tirar o oposto do roteiro, a emoção ainda é tão forte? Se sim — o contraste não está sendo usado.",
    tipos:[
      {tipo:"Visual",ex:"Mostra sem precisar de palavras — o público sente só de ver"},
      {tipo:"Emocional em inversão",ex:"Começa num sentimento, termina no oposto: 'cobra' → 'diva'"},
      {tipo:"Ping-pong",ex:"Vai e vem entre positivo e negativo: fã → crítica → elogio → crítica"},
    ],
    regra_de_ouro:"O 'MAS' é a palavra do contraste. 'Ela parecia odiar a sogra, MAS arrumou o quarto inteiro pra ela.' Ping-pong = máxima retenção porque o público fica tentando resolver a tensão.",
    prompt_instruction:"O roteiro precisa de pelo menos 1 contraste central (antes/depois, certo/errado, esperado/surpreendente). Recomendado: use o ping-pong emocional — alterne entre positivo e negativo pelo menos 3x. Nunca comece e termine no mesmo estado emocional. Sinalize: [CONTRASTE — os dois opostos].",
  },
];

const ELEMENTOS_PROMPT_BLOCK = ELEMENTOS_VICIANTES.map(e =>
  `${e.icon} ${e.label.toUpperCase()}: ${e.prompt_instruction}`
).join("\n\n");



const MUSIC_BY_EMOTION = [
  { emotion:"melancolia suave / intimidade",   tracks:["Patrick Watson — Je te laisserai des mots"],           formats:["cine","lo-fi"] },
  { emotion:"nostalgia / leveza triste",        tracks:["Flawed Mangoes — Dramamine","505 (Arctic Monkeys)"],   formats:["storytelling-visual","narrado","trivial"] },
  { emotion:"nostalgia irônica / confiança",    tracks:["No. 1 Party Anthem (Arctic Monkeys)"],                 formats:["tela-verde","dinamismo"] },
  { emotion:"esperança delicada / emoção",      tracks:["Coldplay — Sparks"],                                   formats:["the-office","bastidores"] },
  { emotion:"introspecção / vazio / leveza",    tracks:["Bon Iver — Wash."],                                    formats:["lo-fi","caixinha-polemica"] },
  { emotion:"peso emocional / urgência baixa",  tracks:[".diedlonely — in the bleak midwinter"],               formats:["cine"] },
  { emotion:"tensão suave / misterioso",        tracks:["Charlito Lan — Dracula Flow","Me and the Devil"],     formats:["conflito-situacional","palestrinha"] },
  { emotion:"saudade intensa",                  tracks:["505 (Arctic Monkeys)"],                               formats:["dialogo","trivial"] },
  { emotion:"energia / movimento / confiança",  tracks:["Brenn! — 4Runner"],                                   formats:["dinamismo","tela-verde"] },
  { emotion:"calma profunda / peso cultural",   tracks:["Jacob and the Stone (Slowed) — Minari"],             formats:["storytelling-visual","bastidores"] },
  { emotion:"grandiosidade / tensão crescente", tracks:["Arcade Fire with Owen Pallett — Dimensions"],        formats:["tela-dividida","cine"] },
  { emotion:"conflito moral / peso dramático",  tracks:["Me and the Devil"],                                   formats:["conflito-situacional","comparacao"] },
];

const getMusicSuggestion = (formatId) => {
  const match = MUSIC_BY_EMOTION.filter(m => m.formats.includes(formatId));
  if(match.length === 0) return null;
  const pick = match[Math.floor(Math.random() * match.length)];
  return { emotion: pick.emotion, track: pick.tracks[0] };
};

// ═══════════════════════════════════════════════════════════════
// PROMPT ASSEMBLER — ENRIQUECIDO COM 6 FRAMEWORKS
// ═══════════════════════════════════════════════════════════════

const buildPrompt = (format, variation, framework, fieldValues, userData) => {
  const u = userData || {};
  const nicho = u.context || u.macroThemes?.[0] || "meu nicho";
  const nome = u.name || "o criador";
  const publico = u.audience || "meu público-alvo";
  const tom = u.toneOfVoice || "natural e direto";
  const produto = u.sellsProducts && u.productsServices ? u.productsServices : "";
  const fw = framework || FRAMEWORKS[FRAMEWORKS.length - 1];

  const varData = variation.fields.map(f => `• ${f.label}: ${fieldValues[f.id] || "(não preenchido)"}`).join("\n");

  const fwInstructions = fw.id === "livre"
    ? `FRAMEWORK: A IA deve escolher o framework mais adequado para esse formato e variação, ou combinar dois. Sinalize no início do roteiro qual framework escolheu e por quê.`
    : `FRAMEWORK OBRIGATÓRIO — ${fw.label} (${fw.tagline}):
${fw.steps.map((s,i) => `${s}`).join("\n")}

TIPO DE CTA: ${fw.ctaTypes}

ANOTAÇÕES OBRIGATÓRIAS — use esses [colchetes] ao longo do roteiro:
${fw.colchetes.join("\n")}`;

  const musicSugg = getMusicSuggestion(format.id);

  return `Você é um especialista em roteiros virais para criadores de conteúdo brasileiros. Sua missão é criar um roteiro COMPLETO, pronto para gravar, com alto potencial de viralização.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFIL DO CRIADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nome/Marca: ${nome}
• Nicho/Contexto: ${nicho}
• Público-alvo: ${publico}
• Tom de voz: ${tom}
${produto ? `• Produto/Serviço: ${produto}` : "• Não vende produto específico neste vídeo"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO — ${format.label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${format.desc}

ELEMENTOS VICIANTES QUE FAZEM ESSE FORMATO PERFORMAR:
${format.elementos.map(e => `• ${e}`).join("\n")}

VARIAÇÃO ESCOLHIDA — ${variation.label}:
${variation.desc}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${fwInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMAÇÕES PREENCHIDAS PELO CRIADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${varData}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ELEMENTOS VICIANTES — APLIQUE TODOS NO ROTEIRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${ELEMENTOS_PROMPT_BLOCK}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS INVIOLÁVEIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Use APENAS personagens reais e verificáveis — NUNCA invente histórias, dados ou situações fictícias
• Se não souber um personagem real, diga isso — nunca preencha com invenção
• Linguagem 100% em português brasileiro, tom de conversa, não de roteiro
• O gancho (primeiros 3 segundos) deve ser irresistível — sem introdução, sem contexto, direto no ponto
• Cada parte do roteiro deve ter [colchete] explicando o gatilho narrativo ativado
• CTA natural para o nicho — nunca genérico
• Ritmo: frases curtas, objetivas, respira entre as ideias
• O roteiro deve soar como algo que o criador falaria, não como texto de IA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENTREGUE NESSA ORDEM EXATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TÍTULO SUGERIDO (1 opção — clicável, específico)
2. ROTEIRO COMPLETO (com [colchetes] em cada parte)
3. DICA DE PRODUÇÃO (o que focar na hora de gravar esse formato)
4. TRILHA SONORA SUGERIDA: ${musicSugg ? `para a emoção "${musicSugg.emotion}", use "${musicSugg.track}" — explique em 1 frase por que essa trilha serve esse vídeo` : "sugira uma música que combine com a emoção central do roteiro"}
5. PALAVRAS-CHAVE TIKTOK (para busca de imagens, se o formato usar imagens)`;
};

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════

const T = { bg:"#070d1a", surface:"#0f172a", border:"rgba(255,255,255,0.08)", text:"#e2e8f0", muted:"#64748b", accent:"#6366f1" };

function Btn({ children, onClick, color = T.accent, outline = false, small = false, disabled = false, full = false, style: ex = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "transparent" : disabled ? "#1e293b" : color,
      border: `1.5px solid ${disabled ? "#334155" : color}`, borderRadius: 9,
      padding: small ? "7px 14px" : "12px 22px", color: outline ? color : "#fff",
      fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: small ? 12 : 14,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      width: full ? "100%" : "auto", transition: "all 0.15s", display: "flex",
      alignItems: "center", justifyContent: "center", gap: 6, ...ex,
    }}>{children}</button>
  );
}

function Field({ label, id, value, onChange, placeholder, multi = false }) {
  const s = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9, padding: "10px 13px", color: "#f1f5f9", fontSize: 12.5, outline: "none",
    fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", resize: "none", lineHeight: 1.6,
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.7px" }}>{label}</div>
      {multi
        ? <textarea rows={3} value={value} onChange={e => onChange(id, e.target.value)} placeholder={placeholder} style={s} />
        : <input value={value} onChange={e => onChange(id, e.target.value)} placeholder={placeholder} style={s} />
      }
    </div>
  );
}

function Card({ children, selected, color, onClick, style: ex = {} }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? `${color || T.accent}14` : "rgba(255,255,255,0.025)",
      border: `1.5px solid ${selected ? (color || T.accent) + "66" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 13, padding: 16, cursor: onClick ? "pointer" : "default",
      transition: "all 0.15s", ...ex,
    }}>{children}</div>
  );
}

function Tag({ children, color = "#64748b" }) {
  return (
    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: `${color}20`, color, border: `1px solid ${color}40`, fontWeight: 700, letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════

export default function RoteiroScreen({ go, userData }) {
  const [step, setStep] = useState(1); // 1=format, 2=variation, 3=framework, 4=fields, 5=result
  const [selFormat, setSelFormat] = useState(null);
  const [selVariation, setSelVariation] = useState(null);
  const [selFramework, setSelFramework] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const format = FORMATS.find(f => f.id === selFormat);
  const variation = format?.variations?.find(v => v.id === selVariation);
  const framework = FRAMEWORKS.find(fw => fw.id === selFramework);

  const setField = (id, val) => setFieldValues(p => ({ ...p, [id]: val }));
  const allFilled = variation?.fields?.every(f => (fieldValues[f.id] || "").trim().length > 2);

  const generate = async () => {
    setLoading(true);
    setStep(5);
    const prompt = buildPrompt(format, variation, framework, fieldValues, userData);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Você é um especialista em roteiros virais para criadores de conteúdo brasileiros. Crie roteiros com alta qualidade narrativa, baseados em gatilhos emocionais comprovados. Use linguagem natural e direta. Entregue SEMPRE na ordem exata solicitada: Título → Roteiro → Dica de produção → Trilha → Palavras-chave TikTok.",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const d = await r.json();
      setResult(d.content?.map(b => b.text).join("") || "Erro ao gerar roteiro.");
    } catch {
      setResult("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard?.writeText(result || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(1); setSelFormat(null); setSelVariation(null);
    setSelFramework(null); setFieldValues({}); setResult(null); setLoading(false);
  };

  const handleBack = () => {
    if(step === 2){ setSelFormat(null); setSelVariation(null); }
    if(step === 3){ setSelVariation(null); }
    if(step === 4){ setSelFramework(null); }
    if(step === 5 && !loading){ setResult(null); }
    setStep(s => Math.max(1, s - 1));
  };

  // Suggest best frameworks for current format
  const suggestedFws = format ? FRAMEWORKS.filter(fw => fw.id === "livre" || fw.bestFor.includes(format.id)) : FRAMEWORKS;
  };

  const reset = () => {
    setStep(1); setSelFormat(null); setSelVariation(null);
    setFieldValues({}); setResult(null); setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        textarea,input,button,select{font-family:'DM Sans',sans-serif!important}
        textarea{resize:vertical}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, marginInline: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {step > 1 && <button onClick={handleBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, padding: "4px 8px" }}>← Voltar</button>}
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "#f8fafc", letterSpacing: "-0.5px" }}>
              ✨ Gerador de Roteiros Virais
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[
              {n:1,l:"Formato"},
              {n:2,l:"Variação"},
              {n:3,l:"Framework"},
              {n:4,l:"Campos"},
              {n:5,l:"Roteiro"},
            ].map(({n,l}) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: n <= step ? 22 : 7, height: 4, borderRadius: 4, background: n < step ? "#22c55e" : n === step ? "#6366f1" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
                {n === step && <span style={{ fontSize: 9, color: "#6366f1", fontWeight: 700, letterSpacing: "0.5px" }}>{l}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, marginInline: "auto", padding: "24px 16px 80px" }}>

        {/* ── STEP 1: FORMAT SELECTION ── */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(18px,4vw,24px)", margin: "0 0 6px", letterSpacing: "-0.8px", color: "#f8fafc" }}>
                Escolha o Formato
              </h2>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
                15 formatos virais mapeados com estrutura, gatilhos e prompt validado.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 8 }}>
              {FORMATS.map(f => (
                <Card key={f.id} selected={selFormat === f.id} color={f.color}
                  onClick={() => { setSelFormat(f.id); setSelVariation(null); setSelFramework(null); setFieldValues({}); setStep(2); }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#f1f5f9", marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {f.variations.map(v => <Tag key={v.id} color={f.color}>{v.icon} {v.label}</Tag>)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── STEP 2: VARIATION SELECTION ── */}
        {step === 2 && format && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{format.icon}</span>
                <div>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, margin: 0, letterSpacing: "-0.8px", color: "#f8fafc" }}>{format.label}</h2>
                  <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{format.desc}</p>
                </div>
              </div>
              <div style={{ background: `${format.color}0d`, border: `1px solid ${format.color}28`, borderRadius: 10, padding: "11px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: format.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>⚡ Elementos viciantes</div>
                {format.elementos.map((e, i) => <div key={i} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>→ {e}</div>)}
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Escolha a variação</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {format.variations.map(v => (
                <Card key={v.id} selected={selVariation === v.id} color={format.color}
                  onClick={() => { setSelVariation(v.id); setSelFramework(null); setFieldValues({}); setStep(3); }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 5 }}>{v.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55 }}>{v.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 11, color: format.color, fontWeight: 600 }}>
                    {v.fields.length} campos → roteiro completo
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── STEP 3: FRAMEWORK SELECTION ── */}
        {step === 3 && format && variation && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <Tag color={format.color}>{format.icon} {format.label}</Tag>
                <Tag color={format.color}>{variation.icon} {variation.label}</Tag>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(18px,4vw,22px)", margin: "0 0 6px", letterSpacing: "-0.8px", color: "#f8fafc" }}>
                Escolha a Estrutura de Roteiro
              </h2>
              <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                A estrutura define como o cérebro da audiência vai ser conduzido. Escolha a que melhor se encaixa no seu objetivo.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              {suggestedFws.map(fw => {
                const isSugg = fw.bestFor.includes(format?.id);
                return (
                  <Card key={fw.id} selected={selFramework === fw.id} color={fw.color}
                    onClick={() => { setSelFramework(fw.id); setFieldValues({}); setStep(4); }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{fw.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>{fw.label}</span>
                          <Tag color={fw.color}>{fw.tagline}</Tag>
                          {isSugg && fw.id !== "livre" && <Tag color="#22c55e">✓ recomendado para {format?.label}</Tag>}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}><strong style={{ color: "#94a3b8" }}>Quando usar:</strong> {fw.when}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 4 }}>
                          {fw.steps.slice(0,3).map((s, i) => (
                            <div key={i} style={{ fontSize: 11, color: "#475569", background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "5px 8px", borderLeft: `2px solid ${fw.color}44` }}>
                              {s.length > 70 ? s.slice(0,70) + "..." : s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* ── STEP 4: FIELDS ── */}
        {step === 4 && format && variation && framework && (
          <>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                <Tag color={format.color}>{format.icon} {format.label}</Tag>
                <Tag color={format.color}>{variation.icon} {variation.label}</Tag>
                <Tag color={framework.color}>{framework.icon} {framework.label}</Tag>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: "0 0 5px", letterSpacing: "-0.8px", color: "#f8fafc" }}>
                Personalize o Roteiro
              </h2>
              <p style={{ color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                Preencha os campos abaixo. Quanto mais específico, mais viral o resultado.
              </p>
            </div>

            {/* Framework reminder */}
            <div style={{ background: `${framework.color}0d`, border: `1px solid ${framework.color}28`, borderRadius: 10, padding: "11px 14px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: framework.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 5 }}>
                {framework.icon} Estrutura: {framework.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {framework.colchetes.slice(0, 4).map((c, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: `${framework.color}15`, color: framework.color, fontFamily: "monospace" }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Elementos Viciantes compact panel */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "11px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
                🎯 Elementos Viciantes — todos serão aplicados no roteiro
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ELEMENTOS_VICIANTES.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 5, background: `${e.color}12`, border: `1px solid ${e.color}30`, borderRadius: 20, padding: "4px 10px" }}>
                    <span style={{ fontSize: 11 }}>{e.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: e.color }}>{e.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10.5, color: "#475569", marginTop: 8, lineHeight: 1.6 }}>
                A IA vai aplicar e anotar cada elemento com <span style={{ fontFamily: "monospace", color: "#64748b" }}>[colchetes]</span> ao longo do roteiro.
              </div>
            </div>

            {/* User context preview */}
            {userData?.name && (
              <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: "11px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>👤</span>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>Dados do Onboarding — pré-carregados</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {userData.name} · {userData.toneOfVoice || "tom natural"} · {userData.audience?.slice(0, 60) || "público definido"}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic fields */}
            {variation.fields.map(f => (
              <Field key={f.id} label={f.label} id={f.id}
                value={fieldValues[f.id] || ""}
                onChange={setField}
                placeholder={f.placeholder}
                multi={f.id.includes("frase") || f.id.includes("moral") || f.id.includes("argumento") || f.id.includes("reflexao") || f.id.includes("pensamento") || f.id.includes("voz")}
              />
            ))}

            {/* Prompt preview toggle */}
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setShowPrompt(p => !p)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "6px 0", display: "flex", alignItems: "center", gap: 6 }}>
                {showPrompt ? "▼" : "▶"} {showPrompt ? "Ocultar" : "Ver"} prompt que será enviado para a IA
              </button>
              {showPrompt && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, marginTop: 8, fontSize: 11, color: "#475569", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace", maxHeight: 280, overflow: "auto" }}>
                  {buildPrompt(format, variation, framework, fieldValues, userData)}
                </div>
              )}
            </div>

            <Btn onClick={generate} disabled={!allFilled} full color={format.color} style={{ fontSize: 15, padding: "14px 22px" }}>
              {allFilled ? `✨ Gerar Roteiro com IA →` : `Preencha todos os ${variation.fields.length} campos para continuar`}
            </Btn>
          </>
        )}

        {/* ── STEP 5: RESULT ── */}
        {step === 5 && (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 40, display: "inline-block", animation: "spin 0.8s linear infinite" }}>✨</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9", marginTop: 16, marginBottom: 8 }}>Gerando seu roteiro...</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>
                  {format?.icon} {format?.label} · {variation?.icon} {variation?.label} · {framework?.icon} {framework?.label}
                </div>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>Montando estrutura narrativa com gatilhos do formato + framework {framework?.label}</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", gap: 5, marginBottom: 6, flexWrap: "wrap" }}>
                      <Tag color={format?.color}>{format?.icon} {format?.label}</Tag>
                      <Tag color={format?.color}>{variation?.icon} {variation?.label}</Tag>
                      <Tag color={framework?.color}>{framework?.icon} {framework?.label}</Tag>
                    </div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0, color: "#f8fafc", letterSpacing: "-0.8px" }}>
                      🎬 Roteiro Pronto
                    </h2>
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <Btn onClick={copyResult} small color={format?.color || "#6366f1"}>{copied ? "✓ Copiado!" : "📋 Copiar"}</Btn>
                    <Btn onClick={reset} outline small color="#475569">Novo roteiro</Btn>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${format?.color || "#6366f1"}33`, borderRadius: 14, padding: "20px", marginBottom: 16 }}>
                  <pre style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.85, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                    {result}
                  </pre>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                  <Btn onClick={() => { setStep(4); setResult(null); }} outline color={format?.color || "#6366f1"} full>
                    🔄 Regenerar com mesmos campos
                  </Btn>
                  <Btn onClick={reset} color="#6366f1" full>
                    ✨ Criar novo roteiro
                  </Btn>
                </div>

                {/* ── CHECKLIST PRÉ-GRAVAÇÃO ── */}
                <ChecklistPreGravacao format={format} variation={variation} framework={framework}/>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHECKLIST PRÉ-GRAVAÇÃO — O Nome da Sua Ideia
// ═══════════════════════════════════════════════════════════════

function ChecklistPreGravacao({ format, variation, framework }) {
  const [checks, setChecks] = useState({});
  const [bolha, setBolha] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const toggle = (id) => setChecks(p => ({ ...p, [id]: !p[id] }));
  const checked = (id) => !!checks[id];

  const GATILHOS = [
    { id:"contraste",   label:"Contraste de emoções",    desc:"O roteiro brinca com emoções opostas ao longo dele" },
    { id:"tema",        label:"Tema Interessante",        desc:"Cultura pop, tema universal, abrangente, em alta ou polêmico" },
    { id:"identificacao",label:"Identificação",          desc:"Crenças, valores, sentimentos ou situações da audiência" },
    { id:"conflito",    label:"Conflito & Mudança",       desc:"A história tem pelo menos 1 par de Conflito → Mudança" },
    { id:"lacuna",      label:"Lacuna de Curiosidade",   desc:"Criou curiosidade em cima de algo interessante para o público" },
    { id:"fofoca",      label:"Efeito Fofoca",           desc:"Passa a sensação de estar contando algo exclusivo ou proibido" },
    { id:"relatavel",   label:"Situação Relatável",      desc:"Mostra uma situação que a maioria das pessoas já passou" },
  ];

  const INTENCAO = [
    { id:"lider",    label:"Aumentou consciência para o Líder / Personagem" },
    { id:"produto",  label:"Aumentou consciência para o Produto / Método" },
    { id:"movimento",label:"Aumentou consciência para o Movimento / Narrativa" },
    { id:"cta",      label:"Tem CTA Escondida no meio do roteiro" },
    { id:"moral",    label:"Moral da História clara e simples no final" },
  ];

  const LAPIDAR = [
    { id:"lap1", label:"Ver outros criadores falando dessa bolha / tema" },
    { id:"lap2", label:"Ver outros criadores usando esse formato visual" },
    { id:"lap3", label:"Reduzir o roteiro — remover o que não serve a Intenção de Comando" },
  ];

  const EDICAO = [
    { id:"ed1", label:"Cortes dinâmicos",          desc:"Sem respiração desnecessária" },
    { id:"ed2", label:"Método Comendo Palavras",   desc:"Elimina espaço entre frases — cria velocidade" },
    { id:"ed3", label:"Trilha Sonora",             desc:"Reforça a emoção do roteiro — não é só fundo" },
    { id:"ed4", label:"Transições e Overlays",     desc:"Reforçam contraste visual" },
    { id:"ed5", label:"Letterings",                desc:"Destacam ideias-chave na tela" },
    { id:"ed6", label:"Filtro de cor",             desc:"Reforça identidade visual e emoção da cena" },
  ];

  const totalItems = 1 + 3 + GATILHOS.length + INTENCAO.length + LAPIDAR.length + EDICAO.length;
  const doneItems = Object.values(checks).filter(Boolean).length + (bolha.trim().length>3?1:0);
  const progress = Math.round((doneItems/totalItems)*100);
  const ready = progress >= 75;

  const Section = ({label,color,children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:10.5,fontWeight:700,color,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        {label}
      </div>
      {children}
    </div>
  );

  const CheckItem = ({id,label,desc,color="#6366f1"}) => (
    <div onClick={()=>toggle(id)} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"9px 12px",borderRadius:9,cursor:"pointer",
      background:checked(id)?`${color}0d`:"rgba(255,255,255,0.015)",border:`1px solid ${checked(id)?color+"33":"rgba(255,255,255,0.05)"}`,marginBottom:5,transition:"all 0.15s"}}>
      <div style={{minWidth:18,height:18,borderRadius:5,border:`1.5px solid ${checked(id)?color:"rgba(255,255,255,0.2)"}`,background:checked(id)?color:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.15s"}}>
        {checked(id)&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:12.5,fontWeight:checked(id)?600:400,color:checked(id)?"#f1f5f9":"#94a3b8"}}>{label}</div>
        {desc&&<div style={{fontSize:11,color:"#475569",marginTop:2}}>{desc}</div>}
      </div>
    </div>
  );

  return (
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,overflow:"hidden"}}>
      {/* Header */}
      <div onClick={()=>setCollapsed(p=>!p)} style={{padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>✅</span>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#f8fafc"}}>Checklist Pré-Gravação</div>
            <div style={{fontSize:11,color:"#64748b"}}>O Nome da Sua Ideia — 5 estágios antes de gravar</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:12,fontWeight:700,color:ready?"#22c55e":progress>50?"#f59e0b":"#64748b"}}>{progress}% pronto</div>
          <span style={{fontSize:14,color:"#475569"}}>{collapsed?"▼":"▲"}</span>
        </div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.04)"}}>
        <div style={{height:"100%",width:`${progress}%`,background:ready?"#22c55e":progress>50?"#f59e0b":"#6366f1",transition:"width 0.3s"}}/>
      </div>

      {!collapsed&&(
        <div style={{padding:"18px"}}>

          {/* 1 — BOLHA */}
          <Section label="1️⃣  Qual bolha você quer furar?" color="#6366f1">
            <input value={bolha} onChange={e=>setBolha(e.target.value)} placeholder="Ex: Produtores rurais que acham que marketing é frescura / Empreendedores iniciantes do agro..."
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"10px 13px",color:"#f1f5f9",fontSize:12.5,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
          </Section>

          {/* 2 — FORMATO */}
          <Section label="2️⃣  Formato Criativo confirmado" color="#a855f7">
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {format&&<div style={{background:`${format.color}14`,border:`1px solid ${format.color}44`,borderRadius:8,padding:"6px 12px",fontSize:12,color:format.color,fontWeight:700}}>
                {format.icon} {format.label} — {variation?.label}
              </div>}
              {framework&&<div style={{background:`${framework.color}14`,border:`1px solid ${framework.color}44`,borderRadius:8,padding:"6px 12px",fontSize:12,color:framework.color,fontWeight:700}}>
                {framework.icon} {framework.label}
              </div>}
            </div>
            {[
              {id:"f1",label:"Visual escolhido e confirmado para o tema",color:"#a855f7"},
              {id:"f2",label:"Estrutura narrativa clara (framework aplicado)",color:"#a855f7"},
              {id:"f3",label:"Elementos viciantes mapeados no roteiro",color:"#a855f7"},
            ].map(item=><CheckItem key={item.id} {...item}/>)}
          </Section>

          {/* 2.3 — GATILHOS */}
          <Section label="🎯  Gatilhos presentes no roteiro" color="#f59e0b">
            {GATILHOS.map(g=><CheckItem key={g.id} {...g} color="#f59e0b"/>)}
          </Section>

          {/* 3 — INTENÇÃO */}
          <Section label="3️⃣  Intenção de Comando" color="#ec4899">
            {INTENCAO.map(i=><CheckItem key={i.id} {...i} color="#ec4899"/>)}
          </Section>

          {/* 4 — LAPIDAR */}
          <Section label="4️⃣  Lapidar — antes de gravar" color="#06b6d4">
            {LAPIDAR.map(l=><CheckItem key={l.id} {...l} color="#06b6d4"/>)}
          </Section>

          {/* 5 — EDIÇÃO */}
          <Section label="5️⃣  Edição — camadas de produção" color="#22c55e">
            {EDICAO.map(e=><CheckItem key={e.id} {...e} color="#22c55e"/>)}
          </Section>

          {/* READY STATE */}
          {ready&&(
            <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:12,padding:"14px 16px",textAlign:"center",marginTop:8}}>
              <div style={{fontSize:24,marginBottom:6}}>🎬</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#22c55e",marginBottom:4}}>Pronto para gravar!</div>
              <div style={{fontSize:12,color:"#64748b"}}>Seu roteiro passou pelo checklist. Its time for Action.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
