import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// TYPES & SHARED UI
// ═══════════════════════════════════════════════════════════════

const ACCENT = "#6366f1";
const T = { bg:"#070d1a", surface:"#0f172a", border:"rgba(255,255,255,0.08)", text:"#e2e8f0", muted:"#64748b" };

const TABS = [
  { id:"autenticidade",  icon:"🎭", label:"Autenticidade",       color:"#ec4899" },
  { id:"mecanismo",      icon:"🔧", label:"Mecanismo Único",      color:"#f59e0b" },
  { id:"mercado",        icon:"📊", label:"O Mercado",            color:"#ef4444" },
  { id:"movimento",      icon:"🚀", label:"O Movimento",          color:"#a855f7" },
  { id:"empatia",        icon:"🔬", label:"Pesquisa de Empatia",  color:"#06b6d4" },
  { id:"sementes",       icon:"🌱", label:"Sementes para Venda",  color:"#22c55e" },
  { id:"intencao",       icon:"🎯", label:"Intenção de Comando",  color:"#6366f1" },
];

function Btn({children,onClick,color=ACCENT,outline=false,small=false,disabled=false,full=false}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:outline?"transparent":disabled?"#1e293b":color,
      border:`1.5px solid ${disabled?"#334155":color}`,borderRadius:9,
      padding:small?"7px 14px":"12px 22px",color:outline?color:"#fff",
      fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:small?12:14,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
      width:full?"100%":"auto",transition:"all 0.15s",display:"flex",
      alignItems:"center",justifyContent:"center",gap:6,
    }}>{children}</button>
  );
}

function SectionLabel({children,color="#94a3b8"}) {
  return <div style={{fontSize:10.5,fontWeight:700,color,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:8,marginTop:16}}>{children}</div>;
}

function Hint({children}) {
  return <div style={{fontSize:11,color:"#475569",lineHeight:1.6,marginBottom:10,fontStyle:"italic"}}>{children}</div>;
}

function TextArea({value,onChange,placeholder,rows=3}) {
  return (
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:9,padding:"10px 13px",color:"#f1f5f9",fontSize:12.5,outline:"none",resize:"vertical",
        lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
  );
}

function TextInput({value,onChange,placeholder}) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:9,padding:"10px 13px",color:"#f1f5f9",fontSize:12.5,outline:"none",
        fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
  );
}

function Field({label,children,hint}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.8px"}}>{label}</div>}
      {hint&&<Hint>{hint}</Hint>}
      {children}
    </div>
  );
}

function TagInput({values,onChange,placeholder,color="#6366f1"}) {
  const [input,setInput]=useState("");
  const add=()=>{ if(input.trim()&&!values.includes(input.trim())){onChange([...values,input.trim()]);setInput(""); }};
  const remove=(i)=>onChange(values.filter((_,idx)=>idx!==i));
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}}
          placeholder={placeholder} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <button onClick={add} style={{background:`${color}22`,border:`1px solid ${color}55`,borderRadius:8,padding:"8px 14px",color,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>+</button>
      </div>
      {values.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {values.map((v,i)=>(
            <div key={i} style={{background:`${color}14`,border:`1px solid ${color}33`,borderRadius:20,padding:"4px 10px",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12,color}}>{v}</span>
              <button onClick={()=>remove(i)} style={{background:"none",border:"none",color:`${color}77`,cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressBar({value,color}) {
  const pct=Math.min(100,Math.max(0,value));
  return (
    <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden",marginTop:4}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width 0.4s"}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB CONTENTS
// ═══════════════════════════════════════════════════════════════

function TabAutenticidade({d,set}) {
  const c="#ec4899";
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Filtros da Autenticidade</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Autenticidade = agir em alinhamento com quem você realmente é. As pessoas não compram só pelo produto — compram pela conexão com quem você é.
        </div>
      </div>

      <SectionLabel color={c}>🎲 Interesses Aleatórios</SectionLabel>
      <Hint>Assuntos aleatórios que você tem interesse — mesmo que pareçam não ter relação com o seu nicho.</Hint>
      <TagInput values={d.interesses||[]} onChange={v=>set("interesses",v)} placeholder="Ex: aprender código morse, maquiagem artística..." color={c}/>

      <SectionLabel color={c}>📚 Livros & Filmes</SectionLabel>
      <Hint>O que você gosta de ler e assistir? Esses referencias aparecem naturalmente na sua linguagem.</Hint>
      <TagInput values={d.livrosFilmes||[]} onChange={v=>set("livrosFilmes",v)} placeholder="Ex: O Alquimista, Django Livre, Harry Potter..." color={c}/>

      <SectionLabel color={c}>⭐ Criadores, Artistas & Marcas</SectionLabel>
      <Hint>Pessoas famosas ou marcas que você acompanha. Revelam estética, valores e referências de linguagem.</Hint>
      <TagInput values={d.referencias||[]} onChange={v=>set("referencias",v)} placeholder="Ex: Whindersson, Nike, Tarantino, Linkin Park..." color={c}/>

      <SectionLabel color={c}>💔 Vulnerabilidades</SectionLabel>
      <Hint>Quais vulnerabilidades você se sente confortável em expor? Criam identificação real.</Hint>
      <TagInput values={d.vulnerabilidades||[]} onChange={v=>set("vulnerabilidades",v)} placeholder="Ex: tenho ansiedade, me comparo muito, sou procrastinador..." color={c}/>

      <SectionLabel color={c}>👁️ Como Quer Ser Visto (5 palavras)</SectionLabel>
      <Hint>Escreva 5 palavras que definem como você quer que sua audiência te veja.</Hint>
      <TagInput values={d.comoSerVisto||[]} onChange={v=>set("comoSerVisto",v)} placeholder="Ex: mentora, aventureira, real, disciplinada, criativa..." color={c}/>

      <SectionLabel color={c}>🧒 Sua Criança Responde</SectionLabel>
      <Hint>O que você amava fazer e como agia na infância? Esses traços são autênticos e naturais.</Hint>
      <TextArea value={d.crianca||""} onChange={v=>set("crianca",v)} placeholder="Ex: sonhava em ser astronauta, adorava subir em árvores, amava brincar de Barbie..." rows={3}/>
    </div>
  );
}

function TabMecanismo({d,set}) {
  const c="#f59e0b";
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Mecanismo Único de Diferenciação</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Seu mecanismo é seu método — como você mostra que sua solução é uma oportunidade nova e única. Precisa ter nome exclusivo, fácil de lembrar e que conecte emocionalmente.
        </div>
      </div>

      <Field label="Seu Mecanismo / Metodologia" hint="Nome exclusivo do seu método. Ex: Método S.A.F.R.A.™, IHC, Tríade AEI, Método CDF...">
        <TextInput value={d.mecanismo||""} onChange={v=>set("mecanismo",v)} placeholder="Ex: Método S.A.F.R.A.™ — Sistema de Atração, Funil, Resultado, Alcance"/>
      </Field>

      <Field label="O que seu método entrega?" hint="A promessa central do seu mecanismo em 1 frase.">
        <TextInput value={d.promessa||""} onChange={v=>set("promessa",v)} placeholder="Ex: Transforma produtores rurais em referências digitais do agronegócio"/>
      </Field>

      <SectionLabel color={c}>🏆 Maiores Concorrentes</SectionLabel>
      <TagInput values={d.concorrentes||[]} onChange={v=>set("concorrentes",v)} placeholder="Ex: Hyeser, Pedro Sobral, Luana Carolina..." color={c}/>

      <SectionLabel color={c}>📣 O que eles prometem?</SectionLabel>
      <TagInput values={d.promessasConcorrentes||[]} onChange={v=>set("promessasConcorrentes",v)} placeholder="Ex: Viver a liberdade digital, explodir o engajamento..." color={c}/>

      <SectionLabel color={c}>⚙️ Mecanismos dos Concorrentes</SectionLabel>
      <TagInput values={d.mecanismosConcorrentes||[]} onChange={v=>set("mecanismosConcorrentes",v)} placeholder="Ex: Método COCA, Light Copy, Sequência Pé na Porta..." color={c}/>

      <SectionLabel color={c}>✅ O que as pessoas gostam?</SectionLabel>
      <TagInput values={d.oQueGostam||[]} onChange={v=>set("oQueGostam",v)} placeholder="Ex: vender sem ser chato, autenticidade nos conteúdos..." color={c}/>

      <SectionLabel color={c}>❌ O que as pessoas não gostam?</SectionLabel>
      <TagInput values={d.oQueNaoGostam||[]} onChange={v=>set("oQueNaoGostam",v)} placeholder="Ex: comunicação agressiva, lançamentos com 3 aulas gratuitas..." color={c}/>

      <SectionLabel color={c}>🚫 O que você discorda do mercado?</SectionLabel>
      <Hint>Essas discordâncias são o seu posicionamento — o que te diferencia dos outros.</Hint>
      <TagInput values={d.discordancias||[]} onChange={v=>set("discordancias",v)} placeholder="Ex: trends, linha editorial, conteúdo de dicas, blazer obrigatório..." color={c}/>
    </div>
  );
}

function TabMercado({d,set}) {
  const c="#ef4444";
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Títulos que Viralizam</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Pesquise títulos que já viralizaram no seu nicho. As respostas estão em páginas de venda, títulos de posts, comentários, YouTube, fóruns e anúncios.
        </div>
      </div>
      <SectionLabel color={c}>🔥 Títulos Virais do Seu Nicho</SectionLabel>
      <Hint>Cole títulos reais de vídeos/posts que já viralizaram no seu mercado. São ouro para criar seus próprios ganchos.</Hint>
      <TagInput values={d.titulosVirais||[]} onChange={v=>set("titulosVirais",v)} placeholder="Ex: 'Se começasse hoje, eu faria isso', 'O grande motivo das pessoas ficarem ricas criando conteúdo'..." color={c}/>

      <SectionLabel color={c}>💡 Temas em Alta no Seu Nicho</SectionLabel>
      <TagInput values={d.temasEmAlta||[]} onChange={v=>set("temasEmAlta",v)} placeholder="Ex: IA no agro, rastreabilidade, mercado sustentável..." color={c}/>

      <SectionLabel color={c}>😤 Polêmicas do Setor</SectionLabel>
      <Hint>O que divide opiniões no seu mercado? Polêmicas geram engajamento e lados.</Hint>
      <TagInput values={d.polemicas||[]} onChange={v=>set("polemicas",v)} placeholder="Ex: insumo caro vs barato, cooperativa vs trader, orgânico vs convencional..." color={c}/>

      <SectionLabel color={c}>📖 Casos Reais de Sucesso do Nicho</SectionLabel>
      <Hint>Personagens reais do seu setor que tiveram resultados notáveis. Ouro para Análise Estratégica.</Hint>
      <TagInput values={d.casosReais||[]} onChange={v=>set("casosReais",v)} placeholder="Ex: Produtor X que triplicou vendas com digital, Cooperativa Y que virou referência..." color={c}/>
    </div>
  );
}

function TabMovimento({d,set}) {
  const c="#a855f7";
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Construindo seu Movimento</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Um movimento é a transformação que você deseja provocar. Seu público compra você, seu movimento E seu produto. Defina os 4 pilares: mudança, inimigo, comunidade, linguagem.
        </div>
      </div>

      <Field label="🌍 Mudança de Mundo" hint="O que você quer mudar? Seu ideal — mesmo que pareça grande demais.">
        <TextArea value={d.mudancaMundo||""} onChange={v=>set("mudancaMundo",v)} placeholder="Ex: Um agronegócio onde produtores são protagonistas da própria história digital, não só do campo." rows={2}/>
      </Field>

      <SectionLabel color={c}>👹 Inimigo em Comum</SectionLabel>
      <Hint>Quem ou o que impede sua mudança de acontecer? O inimigo une a comunidade.</Hint>
      <TagInput values={d.inimigos||[]} onChange={v=>set("inimigos",v)} placeholder="Ex: o improviso, a normose, o achismo, quem trata marketing como custo..." color={c}/>

      <Field label="👥 Identidade da Comunidade" hint="Como seu grupo se chama? A frase de identidade que une quem faz parte.">
        <TextInput value={d.identidadeComunidade||""} onChange={v=>set("identidadeComunidade",v)} placeholder="Ex: Eu sou CDF / Somos AgroMKT / Criadores do Futuro"/>
      </Field>

      <SectionLabel color={c}>🔮 Símbolos & Ícones</SectionLabel>
      <TagInput values={d.simbolos||[]} onChange={v=>set("simbolos",v)} placeholder="Ex: 🌽 espiga, 🎯 alvo, 🔥 fogo — o emoji da sua tribo..." color={c}/>

      <SectionLabel color={c}>🔁 Rituais</SectionLabel>
      <Hint>Ações recorrentes que transmitem crenças e criam pertencimento.</Hint>
      <TagInput values={d.rituais||[]} onChange={v=>set("rituais",v)} placeholder="Ex: 'Its time for action', dancinha, frase de encerramento..." color={c}/>

      <SectionLabel color={c}>💬 Linguagem do Movimento</SectionLabel>
      <Hint>Palavras e frases que só quem é do grupo usa. Criam reconhecimento imediato.</Hint>
      <TagInput values={d.linguagem||[]} onChange={v=>set("linguagem",v)} placeholder="Ex: 'Safra de Vendas', 'A-HÁAAA', 'SALVE SALVE', 'Anti-Improviso'..." color={c}/>

      <SectionLabel color={c}>💡 Crenças do Movimento</SectionLabel>
      <Hint>O que as pessoas que fazem parte do seu movimento acreditam sobre o mundo?</Hint>
      <TagInput values={d.crencas||[]} onChange={v=>set("crencas",v)} placeholder="Ex: 'Posts aleatórios geram resultados aleatórios', 'Quem não aparece, esquece'..." color={c}/>
    </div>
  );
}

function TabEmpatia({d,set}) {
  const c="#06b6d4";
  const campos=[
    {key:"medos",       label:"😨 Medos",          hint:"O que o cliente teme em relação ao seu mercado?",          ph:"Ex: ser julgado, não conseguir pagar as contas, postar e não engajar..."},
    {key:"desejos",     label:"💛 Desejos",         hint:"O que ele mais quer?",                                     ph:"Ex: vender sem ser chato, ser reconhecido, ter liberdade..."},
    {key:"objecoes",    label:"🚧 Objeções",        hint:"O que impede de comprar ou acreditar?",                   ph:"Ex: 'não sou bom o suficiente', 'será que funciona no meu nicho'..."},
    {key:"problemas",   label:"😰 Problemas",       hint:"O que ele vive no dia a dia?",                             ph:"Ex: posta todo dia mas não cresce, não sabe o que falar..."},
    {key:"crencas",     label:"💭 Crenças",         hint:"O que já acredita sobre o seu mercado?",                  ph:"Ex: mercado saturado, algoritmo me odeia, sucesso é sorte..."},
    {key:"perguntas",   label:"❓ Perguntas",        hint:"Principais dúvidas sobre o seu mercado.",                 ph:"Ex: por onde começar? funciona pro meu nicho? quanto tempo leva?"},
    {key:"motiva",      label:"🔥 O que motiva",    hint:"O que deixa ele empolgado e cheio de energia?",           ph:"Ex: histórias de superação, pequenos resultados, ver outro criando..."},
    {key:"entristece",  label:"😔 O que entristece",hint:"O que desanima e desmotiva?",                             ph:"Ex: muito esforço com pouco resultado, ver concorrente crescendo..."},
    {key:"ouve",        label:"👂 O que ouve",       hint:"O que as pessoas ao redor falam sobre o seu mercado?",   ph:"Ex: 'tem que parecer autoridade', 'isso não dá dinheiro'..."},
    {key:"ve",          label:"👁️ O que vê",         hint:"O que passa diante dos olhos dele?",                     ph:"Ex: pessoas viralizando com trends, concorrentes crescendo..."},
    {key:"pensaFala",   label:"💬 O que pensa e fala",hint:"O que passa pela cabeça dele sobre o mercado?",        ph:"Ex: 'eu não nasci pra isso', 'me sinto perdido', 'tô ficando pra trás'..."},
    {key:"faz",         label:"🏃 O que faz",        hint:"Quais atitudes ele toma diante dos problemas?",         ph:"Ex: desiste, compra o próximo curso, tenta de novo sozinho..."},
  ];
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Mapa de Empatia do Público</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Quanto mais você preencher, mais ideias de conteúdo vai ter. As respostas estão nos comentários, YouTube, fóruns, no que clientes te falam. Não seja econômico na pesquisa.
        </div>
      </div>
      {campos.map(({key,label,hint,ph})=>(
        <div key={key} style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:3,letterSpacing:"0.5px"}}>{label}</div>
          <Hint>{hint}</Hint>
          <TagInput values={d[key]||[]} onChange={v=>set(key,v)} placeholder={ph} color={c}/>
        </div>
      ))}
    </div>
  );
}

function TabSementes({d,set}) {
  const c="#22c55e";
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Sementes para Venda</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Seu público compra 3 coisas: <strong style={{color:"#f1f5f9"}}>você (líder)</strong>, <strong style={{color:"#f1f5f9"}}>seu movimento</strong> e <strong style={{color:"#f1f5f9"}}>seu produto</strong>. Cada semente aponta para um desses 3 — nunca os três de uma vez.
        </div>
      </div>

      <SectionLabel color={c}>🌱 Sementes para o Produto</SectionLabel>
      <Hint>Histórias e ideias que provam que seu produto funciona, quebram objeções e aumentam consciência da solução.</Hint>
      <TagInput values={d.sementeProduto||[]} onChange={v=>set("sementeProduto",v)} placeholder="Ex: caso do cliente X que fechou Y safras depois de implementar o método..." color={c}/>

      <SectionLabel color={c}>🌱 Sementes para o Líder</SectionLabel>
      <Hint>Histórias pessoais, vulnerabilidades e características que aproximam o público de você como pessoa.</Hint>
      <TagInput values={d.sementeLider||[]} onChange={v=>set("sementeLider",v)} placeholder="Ex: quando quase fechei a agência e o que me fez continuar..." color={c}/>

      <SectionLabel color={c}>🌱 Sementes para o Movimento</SectionLabel>
      <Hint>Histórias, fatos históricos e referências que provam que o seu movimento faz sentido e é real.</Hint>
      <TagInput values={d.sementeMovimento||[]} onChange={v=>set("sementeMovimento",v)} placeholder="Ex: história de produtor que virou referência digital no agro sem sair do campo..." color={c}/>

      <SectionLabel color={c}>🤫 CTAs Escondidas</SectionLabel>
      <Hint>Frases que deixam subentendido que você tem algo a oferecer — sem pedir diretamente.</Hint>
      <TagInput values={d.ctaEscondida||[]} onChange={v=>set("ctaEscondida",v)} placeholder="Ex: 'foi exatamente isso que ensinei no meu último workshop...', 'é por isso que meus clientes...'" color={c}/>
    </div>
  );
}

function TabIntencao({d,set}) {
  const c="#6366f1";
  const OPTIONS = [
    {id:"lider",    label:"🎭 Aumentar consciência para o Líder",    desc:"Esse vídeo aproxima o público de você como pessoa"},
    {id:"produto",  label:"🔧 Aumentar consciência para o Produto",  desc:"Esse vídeo planta que sua solução é a melhor opção"},
    {id:"movimento",label:"🚀 Aumentar consciência para o Movimento", desc:"Esse vídeo fortalece a causa e a comunidade"},
    {id:"cta",      label:"🤫 CTA Escondida",                         desc:"Convida sem empurrar — subentendido no roteiro"},
  ];
  const toggle=(id)=>{
    const cur=d.tiposIntencao||[];
    set("tiposIntencao",cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]);
  };
  return (
    <div>
      <div style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Intenção de Comando</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.65}}>
          Antes de criar qualquer vídeo, defina: <strong style={{color:"#f1f5f9"}}>O que você quer que o público acredite, sinta ou faça depois de assistir?</strong> Isso é o norte de tudo que vem depois.
        </div>
      </div>

      <Field label="Intenção Principal do Próximo Vídeo" hint="Escreva em 1 frase o que você quer que o público sinta, acredite ou faça ao terminar de assistir.">
        <TextArea value={d.intencaoPrincipal||""} onChange={v=>set("intencaoPrincipal",v)}
          placeholder="Ex: Quero que o produtor pare de achar que marketing é custo e comece a ver como investimento obrigatório para quem quer escalar as vendas da safra." rows={3}/>
      </Field>

      <SectionLabel color={c}>🎯 Tipo de Consciência a Plantar</SectionLabel>
      <Hint>Selecione um ou mais (máx. 2 por vídeo — foco é fundamental).</Hint>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {OPTIONS.map(({id,label,desc})=>{
          const sel=(d.tiposIntencao||[]).includes(id);
          return (
            <div key={id} onClick={()=>toggle(id)} style={{background:sel?`${c}14`:"rgba(255,255,255,0.025)",border:`1.5px solid ${sel?c:"rgba(255,255,255,0.07)"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:sel?c:"#f1f5f9",marginBottom:3}}>{label}</div>
              <div style={{fontSize:11,color:"#64748b"}}>{desc}</div>
            </div>
          );
        })}
      </div>

      <Field label="Moral da História" hint="A ideia que você quer plantar — em 1 frase simples e direta.">
        <TextInput value={d.moralHistoria||""} onChange={v=>set("moralHistoria",v)} placeholder="Ex: Feito é melhor que perfeito. Aparecer sempre supera ser perfeito de vez em quando."/>
      </Field>

      <Field label="Semente que vai estar no roteiro" hint="Qual das suas sementes vai ser plantada nesse vídeo?">
        <TextInput value={d.sementeEscolhida||""} onChange={v=>set("sementeEscolhida",v)} placeholder="Ex: Plantar que meu método S.A.F.R.A. é diferente porque parte da realidade do produtor rural"/>
      </Field>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS CALCULATOR
// ═══════════════════════════════════════════════════════════════

const calcProgress = (data, tabId) => {
  const d = data[tabId] || {};
  const checks = {
    autenticidade: ()=>[d.interesses?.length,d.livrosFilmes?.length,d.referencias?.length,d.vulnerabilidades?.length,d.comoSerVisto?.length,d.crianca].filter(Boolean).length/6,
    mecanismo:     ()=>[d.mecanismo,d.promessa,d.concorrentes?.length,d.discordancias?.length].filter(Boolean).length/4,
    mercado:       ()=>[d.titulosVirais?.length,d.temasEmAlta?.length,d.casosReais?.length].filter(Boolean).length/3,
    movimento:     ()=>[d.mudancaMundo,d.inimigos?.length,d.identidadeComunidade,d.crencas?.length,d.linguagem?.length].filter(Boolean).length/5,
    empatia:       ()=>["medos","desejos","objecoes","problemas","crencas","perguntas","motiva","entristece","ouve","ve","pensaFala","faz"].filter(k=>d[k]?.length>0).length/12,
    sementes:      ()=>[d.sementeProduto?.length,d.sementeLider?.length,d.sementeMovimento?.length,d.ctaEscondida?.length].filter(Boolean).length/4,
    intencao:      ()=>[d.intencaoPrincipal,d.moralHistoria,d.tiposIntencao?.length].filter(Boolean).length/3,
  };
  return Math.round((checks[tabId]?.() || 0) * 100);
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function OB5Screen({ go, u, setU }) {
  const [activeTab, setActiveTab] = useState("autenticidade");
  const [data, setData] = useState(u?.identidade || {});
  const [saved, setSaved] = useState(false);

  const setTabField = (tab) => (key, val) => {
    setData(p => ({ ...p, [tab]: { ...(p[tab]||{}), [key]: val } }));
  };

  const save = () => {
    setU(p => ({ ...p, identidade: data }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalProgress = Math.round(TABS.reduce((sum, t) => sum + calcProgress(data, t.id), 0) / TABS.length);
  const activeColor = TABS.find(t => t.id === activeTab)?.color || ACCENT;
  const tabData = data[activeTab] || {};
  const setField = setTabField(activeTab);

  const CONTENTS = {
    autenticidade: <TabAutenticidade d={tabData} set={setField}/>,
    mecanismo:     <TabMecanismo    d={tabData} set={setField}/>,
    mercado:       <TabMercado      d={tabData} set={setField}/>,
    movimento:     <TabMovimento    d={tabData} set={setField}/>,
    empatia:       <TabEmpatia      d={tabData} set={setField}/>,
    sementes:      <TabSementes     d={tabData} set={setField}/>,
    intencao:      <TabIntencao     d={tabData} set={setField}/>,
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,minHeight:"100vh",color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        textarea,input,button{font-family:'DM Sans',sans-serif!important}
        textarea{resize:vertical}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0f172a",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 20px",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:840,marginInline:"auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {go&&<button onClick={()=>go("dashboard")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13}}>← Dashboard</button>}
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#f8fafc",letterSpacing:"-0.5px"}}>
              🧠 Identidade Estratégica
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:11,color:"#64748b"}}>Perfil completo: <span style={{color:totalProgress>70?"#22c55e":totalProgress>40?"#f59e0b":"#ef4444",fontWeight:700}}>{totalProgress}%</span></div>
            <Btn onClick={save} small color={ACCENT}>{saved?"✓ Salvo!":"💾 Salvar"}</Btn>
          </div>
        </div>
        {/* Overall progress */}
        <div style={{maxWidth:840,marginInline:"auto",paddingBottom:8}}>
          <ProgressBar value={totalProgress} color={ACCENT}/>
        </div>
      </div>

      <div style={{maxWidth:840,marginInline:"auto",padding:"20px 16px 80px"}}>

        {/* INTRO */}
        <div style={{background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:ACCENT,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>
            Para que serve esse módulo
          </div>
          <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7}}>
            Tudo que você preencher aqui vai ser injetado automaticamente nos seus roteiros. A IA vai conhecer sua autenticidade, seu método, seu público e seu movimento — e vai criar conteúdo que realmente soa como você.
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{marginBottom:20,overflowX:"auto",paddingBottom:4}}>
          <div style={{display:"flex",gap:6,minWidth:"max-content"}}>
            {TABS.map(({id,icon,label,color})=>{
              const pct=calcProgress(data,id);
              const active=activeTab===id;
              return (
                <button key={id} onClick={()=>setActiveTab(id)} style={{
                  background:active?`${color}14`:"rgba(255,255,255,0.025)",
                  border:`1.5px solid ${active?color+"66":"rgba(255,255,255,0.07)"}`,
                  borderRadius:10,padding:"8px 12px",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",minWidth:90,
                }}>
                  <div style={{fontSize:16,marginBottom:3}}>{icon}</div>
                  <div style={{fontSize:10.5,fontWeight:700,color:active?color:"#64748b",marginBottom:4,whiteSpace:"nowrap"}}>{label}</div>
                  <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:active?color:`${color}66`,borderRadius:3,transition:"width 0.3s"}}/>
                  </div>
                  <div style={{fontSize:9,color:pct>60?color:"#475569",marginTop:2,fontWeight:700}}>{pct}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{background:"rgba(255,255,255,0.015)",border:`1px solid ${activeColor}22`,borderRadius:14,padding:"20px"}}>
          {CONTENTS[activeTab]}
        </div>

        {/* SAVE + NAVIGATION */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:7}}>
            {TABS.findIndex(t=>t.id===activeTab)>0&&(
              <Btn onClick={()=>setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)-1].id)} outline color={activeColor} small>← Anterior</Btn>
            )}
            {TABS.findIndex(t=>t.id===activeTab)<TABS.length-1&&(
              <Btn onClick={()=>setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)+1].id)} color={activeColor} small>Próximo →</Btn>
            )}
          </div>
          <Btn onClick={save} color={ACCENT}>{saved?"✓ Perfil Salvo!":"💾 Salvar Perfil"}</Btn>
        </div>

        {/* COMPLETION MESSAGE */}
        {totalProgress>=80&&(
          <div style={{marginTop:16,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:6}}>🚀</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#22c55e",marginBottom:4}}>Identidade Estratégica Completa</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>A IA agora conhece quem você é, o que vende, para quem fala e qual movimento lidera. Seus roteiros vão soar como você.</div>
            {go&&<Btn onClick={()=>go("roteiro")} color="#22c55e">✨ Criar Roteiro com meu perfil →</Btn>}
          </div>
        )}
      </div>
    </div>
  );
}
