import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CRITERIA DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const VIDEO_CRITERIA = [
  { id:"hook",      label:"Hook Point (0–3s)",         weight:0.20, icon:"⚡",    expert:"Brendan Kane · Hook Point",
    description:"O que acontece nos primeiros 3 segundos que faz o dedo parar?",
    low:"Começa com introdução ou contexto. Nenhuma razão para continuar.",
    mid:"Tem algo interessante, mas não é imediato ou diferenciado.",
    high:"Abre com estatística surpreendente, momento inesperado ou promessa irresistível." },
  { id:"story",     label:"Estrutura Narrativa",        weight:0.12, icon:"📖",    expert:"Brendan Kane · McKee · Freytag",
    description:"O vídeo tem início claro, conflito/tensão e desfecho satisfatório?",
    low:"Lista de informações jogadas. Sem arco narrativo.",
    mid:"Tem começo e fim, mas o conflito/tensão é fraco.",
    high:"Gancho → jornada → virada → takeaway. Prende do início ao fim." },
  { id:"emotion",   label:"Gatilho Emocional",          weight:0.12, icon:"❤️‍🔥",   expert:"Jonah Berger · STEPPS · HBR SPREAD",
    description:"Provoca emoção forte? (risos, surpresa, inspiração, indignação, curiosidade)",
    low:"Neutro, informativo. Não gera reação emocional.",
    mid:"Gera alguma resposta, mas não é intensa ou memorável.",
    high:"Faz rir, surpreender, arrepiar ou indignar. Emoção visceral e imediata." },
  { id:"mass",      label:"Apelo de Massa",             weight:0.10, icon:"🌐",    expert:"Brendan Kane · Graham Stephan principle",
    description:"Tópico de nicho com ângulo universal. Alguém de fora do nicho se interessa?",
    low:"Só faz sentido pra quem já é da área. Jargão sem tradução.",
    mid:"Algum apelo geral, mas ainda muito hermético.",
    high:"Assunto técnico com framing que qualquer pessoa quer assistir." },
  { id:"share",     label:"Impulso de Compartilhamento",weight:0.10, icon:"🔁",    expert:"Jonah Berger · Social Currency (STEPPS)",
    description:"Tem um momento que faz pensar: 'preciso mandar isso pra fulano'?",
    low:"Nada compartilhável. Serve apenas pra quem já segue.",
    mid:"Tem valor informativo, mas sem o impulso de repassar.",
    high:"Contém virada, dado ou cena que faz querer tagar alguém." },
  { id:"retention", label:"Retenção Estimada",          weight:0.10, icon:"⏱️",    expert:"YouTube Algorithm · TikTok FYP Logic",
    description:"O ritmo e a estrutura sustentam o watch time até o final?",
    low:"Lento, pausas longas, repetitivo ou sem progressão.",
    mid:"Mantém atenção até o meio, mas cai no final.",
    high:"Ritmo constante, sem queda de tensão. Espectador fica até o fim." },
  { id:"ctr",       label:"Força do CTR Visual",        weight:0.08, icon:"🖼️",    expert:"YouTube CTR Studies · MrBeast thumbnail principles",
    description:"Thumbnail + título são clicáveis? Geram curiosidade ou FOMO?",
    low:"Capa genérica. Título descritivo sem gancho. Nenhum motivo pra clicar.",
    mid:"Capa ok, título tem alguma promessa mas é previsível.",
    high:"Thumbnail para o scroll. Título abre loop que só fecha assistindo." },
  { id:"format",    label:"Formato Validado",           weight:0.08, icon:"🧩",    expert:"Brendan Kane · 220+ formatos mapeados",
    description:"Usa formato com histórico de performance? (Expert vs Novato, POV, Walking Talk...)",
    low:"Formato genérico ou indefinido. Sem estrutura reconhecível.",
    mid:"Usa formato razoável, mas sem execução consistente.",
    high:"Formato testado e replicável com clara identidade de estilo." },
  { id:"timing",    label:"Timing & Relevância",        weight:0.05, icon:"📅",    expert:"TikTok Trends · Moment Marketing",
    description:"Aproveita um momento cultural, tendência ou pauta quente?",
    low:"Sem relação com nada atual. Poderia ter sido feito há 2 anos.",
    mid:"Tangencia uma tendência, mas não de forma forte.",
    high:"Encaixa perfeitamente num momento quente. Zeitgeist na veia." },
  { id:"auth",      label:"Autenticidade",              weight:0.05, icon:"🎯",    expert:"Creator Economy Research · Edelman Trust",
    description:"Parece real, humano e confiável? Ou parece propaganda?",
    low:"Polido demais, corporativo, distante. Cara de anúncio.",
    mid:"Equilibrado, mas falta personalidade ou vulnerabilidade.",
    high:"Raw, genuíno, com personalidade marcante. Você acredita no criador." },
];

const STATIC_CRITERIA = [
  { id:"scroll_stop",      label:"Parada de Scroll Visual",   weight:0.22, icon:"🛑",    expert:"Instagram Algorithm · Colin & Samir · Thumb-Stop Rate",
    description:"A imagem para o polegar em menos de 0,3 segundos? Contraste, cor ou elemento inesperado?",
    low:"Visual genérico, previsível. Não se diferencia do feed ao redor.",
    mid:"Algo visual de interessante, mas não é imediato nem irresistível.",
    high:"Cor, composição ou elemento tão fora do padrão que para qualquer scroll." },
  { id:"save_value",       label:"Valor de Salvamento",       weight:0.18, icon:"🔖",    expert:"Instagram Save Signal · Adam Mosseri · Later Research",
    description:"Alguém vai salvar para usar depois? (lista, dica, referência, template, dado útil)",
    low:"Nenhum valor prático de guardar. Consumível e esquecível.",
    mid:"Tem algum valor informativo, mas não o suficiente pra salvar.",
    high:"Tipo: 'preciso guardar isso'. Lista, dado raro, framework, cheat sheet." },
  { id:"caption_hook",     label:"Primeira Linha da Legenda", weight:0.15, icon:"✍️",    expert:"Copywriting · Brendan Kane · Eugene Schwartz",
    description:"A primeira linha (above the fold) abre um loop que força o 'ver mais'?",
    low:"Começa com introdução, CTA ou contexto. Sem gancho.",
    mid:"Tem alguma promessa, mas é previsível ou fraca.",
    high:"Pergunta, tensão ou dado que força clicar 'ver mais'." },
  { id:"emotion",          label:"Gatilho Emocional",         weight:0.12, icon:"❤️‍🔥",   expert:"Jonah Berger · STEPPS",
    description:"O post provoca emoção ao ser visto? (indignação, inspiração, identificação, humor)",
    low:"Neutro. Informativo puro. Não gera reação.",
    mid:"Gera alguma resposta, mas não é intensa.",
    high:"Tipo: 'É EXATAMENTE ISSO'. Identificação imediata ou emoção visceral." },
  { id:"share_tag",        label:"Impulso de Marcar/Enviar",  weight:0.10, icon:"📤",    expert:"Jonah Berger · Social Currency · WhatsApp Share Behavior",
    description:"O post faz pensar em alguém específico? ('Isso é o fulano')",
    low:"Nenhuma razão para marcar ou enviar no privado.",
    mid:"Alguém pode enviar, mas sem urgência ou identificação clara.",
    high:"Identificação tão forte que a pessoa taga antes de terminar de ler." },
  { id:"message_clarity",  label:"Clareza em 2 Segundos",     weight:0.08, icon:"👁️",    expert:"Nielsen Norman Group · Visual Hierarchy",
    description:"A mensagem principal é absorvida sem esforço em 2 segundos?",
    low:"Confuso, sobrecarregado ou sem hierarquia visual.",
    mid:"Dá pra entender com esforço, mas não é imediato.",
    high:"Uma lida rápida já entrega o valor central. Zero atrito cognitivo." },
  { id:"comment_trigger",  label:"Gatilho de Comentário",     weight:0.07, icon:"💬",    expert:"Instagram Algorithm · Engagement Rate Studies",
    description:"O post provoca debate nos comentários? Pergunta, polêmica, opinião?",
    low:"Sem nenhuma abertura para comentar. Post fechado.",
    mid:"Pode gerar alguns comentários, mas sem impulso forte.",
    high:"Abre pergunta, contradiz algo popular ou pede opinião do seguidor." },
  { id:"visual_identity",  label:"Identidade Visual",         weight:0.05, icon:"🎨",    expert:"Brand Strategy · Marty Neumeier",
    description:"Dá pra saber de quem é o post antes de ler o nome?",
    low:"Sem identidade. Poderia ser de qualquer conta.",
    mid:"Tem alguma consistência, mas não é marcante.",
    high:"Inconfundível. Cor, fonte ou layout que já é uma assinatura." },
  { id:"caption_depth",    label:"Profundidade da Legenda",   weight:0.02, icon:"📝",    expert:"Content Marketing · Long-form Caption Studies",
    description:"A legenda entrega valor que a imagem não entrega? Complementa sem repetir.",
    low:"Legenda genérica ou vazia. Não agrega nada ao visual.",
    mid:"Tem conteúdo relevante mas repete o que a imagem já diz.",
    high:"A imagem para o scroll. A legenda faz ficar. Dois layers de valor." },
  { id:"timing",           label:"Timing & Relevância",       weight:0.01, icon:"📅",    expert:"Moment Marketing · Newsjacking",
    description:"Aproveita um momento, data, tendência ou pauta atual?",
    low:"Sem relação com nada atual. Poderia ter sido publicado há 1 ano.",
    mid:"Tangencia uma tendência, mas não de forma forte.",
    high:"Encaixa perfeitamente num momento quente. Zeitgeist na veia." },
];

const CAROUSEL_CRITERIA = [
  { id:"capa",        label:"Capa Irresistível (Slide 1)",    weight:0.20, icon:"🎯",    expert:"Instagram Algorithm · Later Research · Adam Mosseri",
    description:"O primeiro slide para o scroll E cria uma promessa que só se resolve deslizando?",
    low:"Capa genérica, poderia ser um post estático qualquer. Sem tensão.",
    mid:"Tem um visual ok, mas a promessa de continuar não é forte.",
    high:"A capa entrega um gancho visual E textual: 'eu preciso ver o próximo slide'." },
  { id:"swipe_pull",  label:"Tração de Passagem (Swipe Pull)",weight:0.18, icon:"👆",    expert:"Carousel Engagement Studies · Hootsuite · Later 2024",
    description:"Cada slide tem uma razão para ir ao próximo? Loop de antecipação constante?",
    low:"Slides autocontidos. Não há razão para passar. Para no slide 2 ou 3.",
    mid:"Tem alguma progressão, mas a tração cai no meio.",
    high:"Cada slide abre uma micro-promessa que só se fecha no próximo. Impossível parar." },
  { id:"progressao",  label:"Progressão Narrativa",           weight:0.15, icon:"📈",    expert:"StoryBrand · Donald Miller · McKee",
    description:"O carrossel tem início, meio e fim? A informação cresce do slide 1 ao último?",
    low:"Informações aleatórias sem ordem lógica ou crescimento.",
    mid:"Tem sequência, mas sem clímax ou virada no caminho.",
    high:"Cada slide constrói sobre o anterior. Tem pico de tensão e desfecho satisfatório." },
  { id:"valor_slide", label:"Valor por Slide",                weight:0.12, icon:"💎",    expert:"Carrd UX Research · Content Density Studies",
    description:"Cada slide entrega valor próprio? Ou é rellotivo e dependente dos outros?",
    low:"Slides vazios, repetitivos ou com informação insuficiente.",
    mid:"Alguns slides são bons, outros são de enchimento.",
    high:"Cada slide pode ser screenshottado e compartilhado sozinho. Denso e útil." },
  { id:"save_share",  label:"Save Rate Estimado",             weight:0.12, icon:"🔖",    expert:"Instagram Saves Algorithm · Creator IQ Data",
    description:"O conjunto todo tem valor de referência? Alguém vai salvar pra consultar depois?",
    low:"Conteúdo consumível e esquecível. Sem valor de arquivo.",
    mid:"Tem algum valor, mas não o suficiente pra salvar.",
    high:"Um 'manual', 'guia', 'checklist' ou 'referência' que se salva e reenvia." },
  { id:"ultimo_slide",label:"Último Slide / CTA",             weight:0.08, icon:"🏁",    expert:"Conversion Rate Optimization · CTA Copywriting",
    description:"O último slide tem um CTA claro ou fecha com impacto? Ou some sem deixar rastro?",
    low:"Termina sem conclusão, sem CTA, sem nada. Fade out total.",
    mid:"Tem algo no final, mas é genérico ('me siga', 'curta o post').",
    high:"CTA específico, natural e coerente com a jornada do carrossel. Convida a agir." },
  { id:"loop_efeito", label:"Efeito Loop (Último → Primeiro)", weight:0.05, icon:"🔄",    expert:"Instagram Carousel Loop Hack · Content Creators Research",
    description:"O último slide conecta de volta ao primeiro, criando um loop que força rever?",
    low:"Nenhuma conexão entre último e primeiro slide.",
    mid:"Tem alguma continuidade, mas não é intencional.",
    high:"O último slide referencia o primeiro de forma que faz rever do início. Algoritmo ama." },
  { id:"visual_coh",  label:"Coesão Visual entre Slides",     weight:0.05, icon:"🎨",    expert:"Brand Design · Visual Identity Systems",
    description:"Os slides têm identidade visual consistente? Parece uma obra ou um Frankenstein?",
    low:"Slides com estilos diferentes, fontes misturadas, sem coesão.",
    mid:"Tem alguma consistência, mas com variações incomodas.",
    high:"Identidade visual limpa e consistente. Parece um produto editorial profissional." },
  { id:"caption_car", label:"Legenda da Capa",                weight:0.03, icon:"✍️",    expert:"Copywriting · Eugene Schwartz · Hook Point",
    description:"A legenda reforça o gancho da capa? Primeira linha força o 'ver mais'?",
    low:"Legenda genérica ou descritiva. Não agrega ao gancho da capa.",
    mid:"Tem alguma relação com a capa, mas não amplia o interesse.",
    high:"Legenda que expande a tensão da capa e torna o conjunto irresistível." },
  { id:"tamanho",     label:"Tamanho Ideal (Nº de Slides)",   weight:0.02, icon:"📏",    expert:"Later Research · Hootsuite · Buffer 2024 Carousel Studies",
    description:"O número de slides está dentro da faixa de maior retenção? (7–15 slides = ideal)",
    low:"Menos de 4 ou mais de 20. Curto demais ou longo demais.",
    mid:"Entre 5–6 ou 16–19 slides. Funciona, mas não é ideal.",
    high:"Entre 7–15 slides. Faixa de maior completion e save rate segundo os dados." },
];

const AD_CRITERIA = [
  { id:"pattern",     label:"Pattern Interrupt (Quebra de Feed)", weight:0.20, icon:"🚨",    expert:"Facebook Ads · Meta Blueprint · Jon Loomer",
    description:"O criativo quebra o padrão visual do feed em menos de 1 segundo? Parece um anúncio?",
    low:"Parece claramente um anúncio. Ativam o 'banner blindness' imediatamente.",
    mid:"Tem algo diferente, mas não é disruptivo o suficiente.",
    high:"Indistinguível de conteúdo orgânico ou visualmente tão diferente que para o scroll." },
  { id:"hook_ad",     label:"Hook (0–3s ou Frame 1)",            weight:0.18, icon:"⚡",    expert:"Meta Ads Research · Brendan Kane · Harmon Brothers",
    description:"O primeiro frame/texto entrega a proposta de valor ou problema de forma irresistível?",
    low:"Começa com logo, nome da empresa ou contexto. Nenhum motivo para continuar.",
    mid:"Tem algum gancho, mas não é urgente ou específico.",
    high:"Problema ultra-específico do ICP ou promessa de resultado em menos de 3 segundos." },
  { id:"icp",         label:"Relevância para o ICP",             weight:0.15, icon:"🎯",    expert:"Eugene Schwartz · Audience Awareness Levels · David Ogilvy",
    description:"O criativo fala com a pessoa certa, no nível certo de consciência? Ela se reconhece?",
    low:"Mensagem genérica. Poderia ser para qualquer pessoa.",
    mid:"Tem alguma especificidade, mas não é cirúrgico.",
    high:"'É como se soubessem exatamente o meu problema.' Nível de consciência correto." },
  { id:"oferta",      label:"Clareza da Oferta",                 weight:0.12, icon:"💡",    expert:"David Ogilvy · Direct Response · Copywriting Hall of Fame",
    description:"Em um olhar, está claro O QUE está sendo oferecido e PARA QUEM?",
    low:"Mensagem confusa. Não dá pra entender o que é ofertado.",
    mid:"Dá pra entender com esforço ou lendo tudo.",
    high:"Oferta cristalina em menos de 3 segundos. O quê, para quem e o benefício central." },
  { id:"prova",       label:"Prova Social / Credibilidade",      weight:0.10, icon:"⭐",    expert:"Robert Cialdini · Influence · Social Proof",
    description:"Tem prova social, resultado de cliente, número, certificação ou autoridade?",
    low:"Nenhum elemento de credibilidade. Só afirmações sem respaldo.",
    mid:"Tem alguma prova, mas é fraca ou não específica.",
    high:"Número concreto, depoimento real, resultado de cliente ou dado de mercado validado." },
  { id:"cta_ad",      label:"CTA (Call to Action)",              weight:0.08, icon:"🔘",    expert:"CRO · Landing Page Optimization · ConversionXL",
    description:"O CTA é claro, específico e coerente com o nível de consciência da audiência?",
    low:"Sem CTA, CTA genérico ('saiba mais', 'clique aqui') ou CTA de venda direta para frio.",
    mid:"CTA existe e é razoável, mas não está alinhado com a jornada.",
    high:"CTA específico, sem atrito e na medida certa da temperatura da audiência." },
  { id:"urgencia",    label:"Urgência / Escassez Real",          weight:0.06, icon:"⏰",    expert:"Robert Cialdini · Scarcity Principle · Direct Response",
    description:"Tem um elemento real de urgência ou escassez que acelera a decisão?",
    low:"Nenhuma urgência. 'Quando você puder' implícito.",
    mid:"Tem alguma urgência, mas parece artificial ou fabricada.",
    high:"Urgência ou escassez genuína e específica que acelera o clique." },
  { id:"visual_ad",   label:"Qualidade Visual / Produção",       weight:0.05, icon:"🎬",    expert:"Meta Creative Research · Creative Best Practices 2024",
    description:"O visual está no nível certo da audiência? Nem superproduzido nem amador demais?",
    low:"Visual abaixo do nível mínimo de credibilidade da oferta.",
    mid:"Visual ok, mas não diferencia nem eleva a percepção de valor.",
    high:"Visual que, sozinho, já eleva a percepção de valor e credibilidade do produto." },
  { id:"congruencia",label:"Congruência Anúncio → Landing",     weight:0.04, icon:"🔗",    expert:"Larry Kim · WordStream · Message Match Theory",
    description:"A mensagem do criativo é idêntica à mensagem da landing page ou próximo passo?",
    low:"Criativo e landing page parecem de produtos diferentes. Dissonância total.",
    mid:"Tem relação, mas há quebra de expectativa ao clicar.",
    high:"Message match perfeito. Quem clica chega exatamente onde esperava." },
  { id:"formato_ad",  label:"Adequação ao Formato/Plataforma",  weight:0.02, icon:"📱",    expert:"Meta Blueprint · TikTok for Business · Creative Specs",
    description:"O criativo foi feito para o formato? (vertical mobile, aspect ratio, legível sem som)",
    low:"Horizontal em plataforma vertical, texto ilegível, depende 100% do áudio.",
    mid:"Adequado, mas não otimizado. Poderia ser melhor para o formato.",
    high:"Nativo ao formato. Vertical, legível sem som, thumb-friendly, aspect ratio ideal." },
];

// ─────────────────────────────────────────────────────────────────────────────
// SOURCES PER MODE
// ─────────────────────────────────────────────────────────────────────────────
const SOURCES = {
  video: [
    ["⚡ Brendan Kane", "Hook Point + The Guide to Going Viral — 60B+ views, 220+ formatos mapeados"],
    ["📊 Jonah Berger", "Contagious — Framework STEPPS (Social Currency, Triggers, Emotion...)"],
    ["🧠 HBR / David Dubois", "A New Framework for Going Viral — SPREAD model (Mai 2025)"],
    ["📱 YouTube + TikTok", "Algorithm docs, FYP logic — retenção como principal métrica de distribuição"],
    ["🔬 Marketing LTB", "Short Form Video Stats 2025 — first-hour engagement determina 80% do potencial"],
  ],
  static: [
    ["🔖 Adam Mosseri / Instagram", "Saves e shares são os sinais de maior peso para posts estáticos"],
    ["📊 Jonah Berger", "Contagious — Social Currency: compartilhamos o que nos faz parecer conectados"],
    ["✍️ Eugene Schwartz", "Breakthrough Advertising — a primeira linha é a única que decide continuar"],
    ["👁️ Nielsen Norman Group", "Eye-tracking — 2 segundos para decidir sobre um post"],
    ["🎨 Marty Neumeier", "The Brand Gap — identidade reconhecível reduz esforço cognitivo e aumenta recall"],
    ["🔬 Later Research", "Posts com alta taxa de salvamento têm 3× mais alcance orgânico"],
  ],
  carousel: [
    ["📊 Later Research 2024", "Carrosséis têm 3× mais saves e 2× mais alcance que posts estáticos no Instagram"],
    ["📈 Hootsuite / Buffer", "7–15 slides = faixa de maior completion rate e save rate em carrosséis"],
    ["🔄 Instagram Carousel Loop", "O efeito loop (último → primeiro slide) é o hack mais subestimado do algoritmo"],
    ["🎯 Adam Mosseri", "O sinal de 'tempo gasto no post' é o mais pesado para carrosséis na distribuição"],
    ["📖 Donald Miller", "StoryBrand — narrativa com tensão e resolução é a estrutura de maior retenção"],
    ["💎 Creator IQ Data", "Carrosséis educativos têm save rate 4× maior que carrosséis promocionais"],
  ],
  ad: [
    ["🚨 Meta Blueprint / Jon Loomer", "Pattern interrupt é o critério #1 de performance criativa em Meta Ads"],
    ["🎯 Eugene Schwartz", "Breakthrough Advertising — níveis de consciência do ICP determinam o ângulo do criativo"],
    ["⭐ Robert Cialdini", "Influence — Prova social e escassez são os gatilhos de conversão mais robustos"],
    ["🔗 Larry Kim / WordStream", "Message match anúncio → landing é responsável por até 40% da taxa de conversão"],
    ["📱 Meta Creative Research", "Criativos nativos ao formato mobile têm CPL 60% menor que adaptações de desktop"],
    ["💡 David Ogilvy", "Confessions of an Advertising Man — clareza da oferta > criatividade sem propósito"],
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MODE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const MODES = [
  { key:"video",    icon:"🎬", label:"Vídeo",        sub:"Reels · TikTok · Shorts · YT", color:"#a855f7", criteria: VIDEO_CRITERIA },
  { key:"static",   icon:"🖼️", label:"Post Estático",sub:"Feed · Stories · Imagem",      color:"#06b6d4", criteria: STATIC_CRITERIA },
  { key:"carousel", icon:"🎠", label:"Carrossel",    sub:"Instagram · LinkedIn",          color:"#f59e0b", criteria: CAROUSEL_CRITERIA },
  { key:"ad",       icon:"📣", label:"Anúncio",      sub:"Meta · TikTok Ads · Google",   color:"#ef4444", criteria: AD_CRITERIA },
];

const INSIGHTS = {
  video: {
    color:"#a855f7",
    title:"Lógica do Vídeo Orgânico",
    text: <>O algoritmo distribui baseado em <strong style={{color:"#e2e8f0"}}>retenção e watch time</strong>. O Hook (0–3s) vale 20% da nota porque sem ele nenhum outro critério importa. O engajamento da <strong style={{color:"#a855f7"}}>primeira hora determina 80%</strong> do potencial de distribuição.</>,
  },
  static: {
    color:"#06b6d4",
    title:"Lógica do Post Estático",
    text: <>No post estático, os sinais mais pesados são <strong style={{color:"#06b6d4"}}>Salvamento</strong> e <strong style={{color:"#06b6d4"}}>Compartilhamento</strong> — não curtida. Um post salvo vale <strong style={{color:"#e2e8f0"}}>~3× mais que uma curtida</strong> no algoritmo do Instagram.</>,
  },
  carousel: {
    color:"#f59e0b",
    title:"Lógica do Carrossel",
    text: <>O algoritmo mede o <strong style={{color:"#f59e0b"}}>tempo gasto no post</strong> — e o carrossel é o formato que mais o maximiza. Carrosséis têm <strong style={{color:"#e2e8f0"}}>3× mais saves e 2× mais alcance</strong> que posts estáticos. O segredo: cada slide deve <em>criar a necessidade</em> de ver o próximo.</>,
  },
  ad: {
    color:"#ef4444",
    title:"Lógica do Criativo de Anúncio",
    text: <>No tráfego pago, o criativo é responsável por <strong style={{color:"#ef4444"}}>até 70% do resultado</strong> da campanha. A <strong style={{color:"#e2e8f0"}}>quebra de pattern</strong> é o critério #1. O segundo é o <em>message match</em>: anúncio e landing page precisam contar a mesma história.</>,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getLevel = (s) => {
  if (s >= 90) return { label:"🔥 VIRAL MACHINE",       color:"#FF4500", bg:"rgba(255,69,0,0.15)",    border:"#FF4500" };
  if (s >= 75) return { label:"🟢 ALTO POTENCIAL",      color:"#22c55e", bg:"rgba(34,197,94,0.12)",   border:"#22c55e" };
  if (s >= 60) return { label:"🟡 POTENCIAL MODERADO",  color:"#eab308", bg:"rgba(234,179,8,0.12)",   border:"#eab308" };
  if (s >= 40) return { label:"⚠️ PRECISA DE AJUSTES",  color:"#f97316", bg:"rgba(249,115,22,0.12)",  border:"#f97316" };
  return           { label:"❌ SEM POTENCIAL",          color:"#ef4444", bg:"rgba(239,68,68,0.10)",   border:"#ef4444" };
};

const barColor = (v) => v >= 8 ? "#FF4500" : v >= 6 ? "#eab308" : v >= 4 ? "#6366f1" : "#475569";

const calcScore = (criteria, scores) =>
  Math.round(criteria.reduce((s, c) => s + scores[c.id] * c.weight * 10, 0));

const initScores = (criteria) => Object.fromEntries(criteria.map((c) => [c.id, 5]));

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function CriterionRow({ criterion, value, onChange }) {
  const desc  = value >= 7 ? criterion.high : value >= 4 ? criterion.mid : criterion.low;
  const bc    = barColor(value);
  const sc    = value >= 7 ? "#22c55e" : value >= 4 ? "#eab308" : "#ef4444";
  return (
    <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"15px 17px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
            <span style={{ fontSize:16 }}>{criterion.icon}</span>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13.5, color:"#f1f5f9", letterSpacing:"-0.3px" }}>{criterion.label}</span>
            <span style={{ fontSize:9.5, padding:"2px 6px", borderRadius:20, background:"rgba(255,255,255,0.07)", color:"#94a3b8", fontFamily:"monospace" }}>
              {Math.round(criterion.weight * 100)}%
            </span>
          </div>
          <div style={{ fontSize:11, color:"#64748b", marginBottom:2 }}>↳ {criterion.expert}</div>
          <div style={{ fontSize:11.5, color:"#94a3b8" }}>{criterion.description}</div>
        </div>
        <div style={{ minWidth:46, height:46, borderRadius:"50%", background:`conic-gradient(${bc} ${value*10}%, rgba(255,255,255,0.06) 0%)`, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:12, flexShrink:0, boxShadow:`0 0 10px ${bc}44` }}>
          <div style={{ width:33, height:33, borderRadius:"50%", background:"#0f172a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:bc }}>
            {value}
          </div>
        </div>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={(e) => onChange(criterion.id, Number(e.target.value))}
        style={{ width:"100%", height:4, borderRadius:4, WebkitAppearance:"none", cursor:"pointer", background:`linear-gradient(to right,${bc} ${value*10}%,rgba(255,255,255,0.1) ${value*10}%)`, outline:"none", marginTop:8, marginBottom:6 }} />
      <div style={{ fontSize:11.5, color:sc, fontStyle:"italic", borderLeft:`2px solid ${sc}`, paddingLeft:8 }}>{desc}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function ViralScorer() {
  const [mode, setMode]       = useState("video");
  const [title, setTitle]     = useState("");
  const [animated, setAnimated] = useState(50);
  const [allScores, setAllScores] = useState(() =>
    Object.fromEntries(MODES.map((m) => [m.key, initScores(m.criteria)]))
  );

  const modeConfig  = MODES.find((m) => m.key === mode);
  const scores      = allScores[mode];
  const finalScore  = calcScore(modeConfig.criteria, scores);

  // Animate score counter
  useEffect(() => {
    let v = animated;
    const end = finalScore;
    if (v === end) return;
    const step = end > v ? 1 : -1;
    const t = setInterval(() => { v += step; setAnimated(v); if (v === end) clearInterval(t); }, 10);
    return () => clearInterval(t);
  }, [finalScore]);

  useEffect(() => { setAnimated(finalScore); }, [mode]);

  const handleChange = (id, val) =>
    setAllScores((p) => ({ ...p, [mode]: { ...p[mode], [id]: val } }));

  const criteria   = modeConfig.criteria;
  const accentColor = modeConfig.color;
  const level      = getLevel(animated);
  const topC       = [...criteria].sort((a,b) => scores[b.id]-scores[a.id]).slice(0,3);
  const weakC      = [...criteria].sort((a,b) => scores[a.id]-scores[b.id]).slice(0,3);
  const insight    = INSIGHTS[mode];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#070d1a", minHeight:"100vh", padding:"0 0 60px", color:"#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 0 8px rgba(255,255,255,0.4)}
        input[type=range]::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:50%;background:white;cursor:pointer}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        *{box-sizing:border-box}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e1035 50%,#0f172a 100%)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"32px 24px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:400, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,69,0,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"inline-block", background:"rgba(255,69,0,0.12)", border:"1px solid rgba(255,69,0,0.3)", borderRadius:6, padding:"3px 10px", fontSize:10, fontWeight:600, color:"#FF4500", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
          Sistema de Avaliação · v3.0
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,5vw,38px)", margin:"0 0 6px", letterSpacing:"-1.5px", background:"linear-gradient(135deg,#f8fafc 0%,#94a3b8 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Viral Score™
        </h1>
        <p style={{ color:"#64748b", fontSize:12, margin:0, maxWidth:440, marginInline:"auto" }}>
          Brendan Kane · Jonah Berger · Adam Mosseri · Eugene Schwartz · David Ogilvy · Meta Blueprint
        </p>
      </div>

      <div style={{ maxWidth:720, marginInline:"auto", padding:"0 16px" }}>

        {/* ── MODE TOGGLE ── */}
        <div style={{ marginTop:20, marginBottom:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:3, gap:3 }}>
            {MODES.map(({ key, icon, label, sub, color }) => (
              <button key={key} onClick={() => setMode(key)} style={{ background: mode===key ? `linear-gradient(135deg,${color}22,${color}0d)` : "transparent", border: mode===key ? `1.5px solid ${color}55` : "1.5px solid transparent", borderRadius:9, padding:"11px 6px", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                <div style={{ fontSize:19, marginBottom:3 }}>{icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11.5, color: mode===key ? color : "#64748b", letterSpacing:"-0.2px" }}>{label}</div>
                <div style={{ fontSize:9, color: mode===key ? `${color}88` : "#2d3748", marginTop:1, lineHeight:1.3 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── TITLE INPUT ── */}
        <div style={{ marginBottom:14 }}>
          <input type="text" placeholder={`Descreva o ${modeConfig.label.toLowerCase()} que está avaliando (opcional)...`} value={title} onChange={(e) => setTitle(e.target.value)}
            style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
        </div>

        {/* ── SCORE DISPLAY ── */}
        <div style={{ background:level.bg, border:`1.5px solid ${level.border}`, borderRadius:16, padding:"22px 18px", marginBottom:16, textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:`repeating-linear-gradient(90deg,${level.color} 0px,${level.color} 1px,transparent 1px,transparent 40px)` }} />
          <div style={{ display:"inline-block", fontSize:10, fontWeight:700, color:accentColor, letterSpacing:"1.5px", textTransform:"uppercase", background:`${accentColor}22`, border:`1px solid ${accentColor}44`, borderRadius:5, padding:"3px 10px", marginBottom:8 }}>
            {modeConfig.icon} {modeConfig.label}
          </div>
          {title && <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#f1f5f9", marginBottom:8, letterSpacing:"-0.3px" }}>"{title}"</div>}
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(52px,13vw,80px)", color:level.color, lineHeight:1, textShadow:`0 0 40px ${level.color}66` }}>
            {animated}
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:level.color, marginTop:4 }}>{level.label}</div>
          <div style={{ marginTop:14, height:5, background:"rgba(255,255,255,0.07)", borderRadius:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${animated}%`, background:`linear-gradient(90deg,${level.color}88,${level.color})`, borderRadius:6, transition:"width 0.1s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, color:"#475569", marginTop:4 }}>
            <span>0 — Sem potencial</span><span>100 — Viral garantido</span>
          </div>
        </div>

        {/* ── SCALE LEGEND ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4, marginBottom:16 }}>
          {[
            {range:"0–39",  label:"Sem potencial", color:"#ef4444"},
            {range:"40–59", label:"Precisa ajustes",color:"#f97316"},
            {range:"60–74", label:"Moderado",       color:"#eab308"},
            {range:"75–89", label:"Alto potencial", color:"#22c55e"},
            {range:"90–100",label:"Viral Machine",  color:"#FF4500"},
          ].map((i) => (
            <div key={i.range} style={{ background:`${i.color}14`, border:`1px solid ${i.color}44`, borderRadius:7, padding:"7px 4px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11.5, color:i.color }}>{i.range}</div>
              <div style={{ fontSize:8.5, color:"#64748b", marginTop:2 }}>{i.label}</div>
            </div>
          ))}
        </div>

        {/* ── INSIGHT BANNER ── */}
        <div style={{ background:`${insight.color}0d`, border:`1px solid ${insight.color}30`, borderRadius:12, padding:"13px 15px", marginBottom:16, display:"flex", gap:11, alignItems:"flex-start" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, color:insight.color, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>{insight.title}</div>
            <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.65 }}>{insight.text}</div>
          </div>
        </div>

        {/* ── CRITERIA HEADER ── */}
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10.5, color:"#475569", letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>
          Critérios — {modeConfig.label}
        </div>

        {/* ── CRITERIA ROWS ── */}
        {criteria.map((c) => (
          <CriterionRow key={c.id} criterion={c} value={scores[c.id]} onChange={handleChange} />
        ))}

        {/* ── ANALYSIS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:18 }}>
          <div style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:12, padding:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#22c55e", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>✅ Pontos Fortes</div>
            {topC.map((c) => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <span style={{ fontSize:13 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#f1f5f9" }}>{c.label}</div>
                  <div style={{ fontSize:10, color:"#22c55e" }}>{scores[c.id]}/10</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:14 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#ef4444", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>🔧 A Melhorar</div>
            {weakC.map((c) => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <span style={{ fontSize:13 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#f1f5f9" }}>{c.label}</div>
                  <div style={{ fontSize:10, color:"#ef4444" }}>{scores[c.id]}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RADAR ── */}
        <div style={{ marginTop:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#475569", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Radar de Desempenho</div>
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:14 }}>
            {criteria.map((c) => {
              const v = scores[c.id];
              const pts = Math.round(v * c.weight * 10);
              const max = Math.round(c.weight * 100);
              return (
                <div key={c.id} style={{ marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontSize:11, minWidth:17 }}>{c.icon}</span>
                  <div style={{ fontSize:9.5, color:"#64748b", minWidth:145, maxWidth:145, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.label}</div>
                  <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${v*10}%`, background:barColor(v), borderRadius:3, transition:"width 0.3s" }} />
                  </div>
                  <span style={{ fontSize:9.5, fontFamily:"monospace", color:barColor(v), minWidth:44, textAlign:"right" }}>{pts}/{max}pts</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MULTI-MODE COMPARATIVO ── */}
        <div style={{ marginTop:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#475569", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Comparativo — Todos os Formatos</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
            {MODES.map(({ key, icon, label, color, criteria: crit }) => {
              const s = calcScore(crit, allScores[key]);
              const lv = getLevel(s);
              return (
                <div key={key} onClick={() => setMode(key)} style={{ background: key===mode ? `${color}14` : "rgba(255,255,255,0.02)", border:`1.5px solid ${key===mode ? color+"55" : "rgba(255,255,255,0.05)"}`, borderRadius:12, padding:12, textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ fontSize:17, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:10, color: key===mode ? color : "#475569", marginBottom:5 }}>{label}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:lv.color, lineHeight:1, textShadow:`0 0 16px ${lv.color}55` }}>{s}</div>
                  <div style={{ fontSize:8.5, color:lv.color, marginTop:4, lineHeight:1.3 }}>{lv.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SOURCES ── */}
        <div style={{ marginTop:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:12, padding:14 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#334155", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>
            Fontes & Referências · {modeConfig.label}
          </div>
          {SOURCES[mode].map(([t, d]) => (
            <div key={t} style={{ marginBottom:7, display:"flex", gap:8 }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:"#475569", minWidth:170, flexShrink:0 }}>{t}</span>
              <span style={{ fontSize:10.5, color:"#334155", lineHeight:1.55 }}>{d}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
