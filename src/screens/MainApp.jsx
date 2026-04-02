import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const FORMATS = [
  { id:"video",    icon:"🎬", label:"Vídeo",              sub:"Reels · TikTok · Shorts · YT",   color:"#a855f7", hasTikTok:true  },
  { id:"static",   icon:"🖼️", label:"Post Estático",      sub:"Feed · Stories · LinkedIn",       color:"#06b6d4", hasTikTok:false },
  { id:"carousel", icon:"🎠", label:"Carrossel",           sub:"Instagram · LinkedIn · Pinterest",color:"#f59e0b", hasTikTok:false },
  { id:"ad",       icon:"📣", label:"Criativo de Anúncio", sub:"Meta Ads · TikTok Ads · Google",  color:"#ef4444", hasTikTok:true  },
];

const FORMAT_EXAMPLES = {
  video:{
    bestPractices:["Hook visual nos primeiros 0–3s — sem introdução","Estrutura: Hook → Problema → Solução → Prova → CTA","Legendas em 100% dos vídeos (83% assistem sem som)","Ritmo acelerado — corte a cada 2–4 segundos","CTA verbal + textual no último terço do vídeo"],
    examples:[
      {title:"Expert vs Novato",desc:"Criador interpreta dois papéis — especialista e iniciante — para mostrar contraste de resultado",fmt:"📹 30–60s"},
      {title:"POV — Você está perdendo dinheiro se...",desc:"Câmera subjetiva como se o espectador fosse o personagem da história",fmt:"📹 15–30s"},
      {title:"Breakdown com bastidores",desc:"Mostrar o processo de trás pra frente — resultado primeiro, processo depois",fmt:"📹 45–90s"},
    ],
  },
  static:{
    bestPractices:["Texto visual principal em menos de 7 palavras","Contraste alto — fundo escuro + texto claro ou vice-versa","Uma única ideia por post — sem sobrecarga","Elemento de curiosidade que force ler a legenda","Salvar-friendly: dado, dica ou frase de guardar"],
    examples:[
      {title:"Citação com twist",desc:"Frase conhecida reinterpretada com ângulo do seu nicho",fmt:"🖼️ 1080×1080"},
      {title:"Dado chocante isolado",desc:"Um número ou estatística com contraste visual máximo",fmt:"🖼️ 1080×1080"},
      {title:"Antes vs Depois",desc:"Divisão visual mostrando transformação com sua metodologia",fmt:"🖼️ 1080×1350"},
    ],
  },
  carousel:{
    bestPractices:["Slide 1: promessa que só se resolve deslizando","Cada slide tem uma razão para ir ao próximo","7–15 slides = faixa de maior completion rate","Último slide com CTA específico + loop para o primeiro","Cada slide screenshottável e compartilhável sozinho"],
    examples:[
      {title:"Guia passo a passo",desc:"Cada slide é um passo. Capa mostra o resultado final. CTA = 'salva pra aplicar'",fmt:"🎠 10–12 slides"},
      {title:"Mitos vs Verdades",desc:"Alternância entre crença errada e correção. Cria ritmo e antecipação",fmt:"🎠 8–10 slides"},
      {title:"Checklist de X itens",desc:"Lista acionável. Alta propensão a save. Capa mostra quantos itens tem",fmt:"🎠 7–9 slides"},
    ],
  },
  ad:{
    bestPractices:["Parece conteúdo orgânico, não anúncio — pattern interrupt","Problem-first: começa com a dor do ICP, não com a solução","Prova social específica: número, nome, resultado real","CTA na temperatura da audiência — frio = descoberta, quente = compra","Message match perfeito entre anúncio e landing page"],
    examples:[
      {title:"Depoimento UGC",desc:"Cliente real falando sobre resultado. Parece orgânico. Melhor ROAS em Meta Ads",fmt:"📣 15–30s"},
      {title:"Problem-Agitate-Solve",desc:"Problema ultra-específico → amplifica a dor → apresenta a solução com prova",fmt:"📣 Estático ou vídeo"},
      {title:"Antes vs Depois com dado",desc:"Transformação visual + número concreto + CTA direto. Alta CTR em topo de funil",fmt:"📣 1080×1350"},
    ],
  },
};

const VOICES = [
  {id:"v1",name:"Renan",style:"Comunicativo, energia média, masculino"},
  {id:"v2",name:"Sofia",style:"Autoridade suave, feminino, profissional"},
  {id:"v3",name:"Bruno",style:"Descontraído, jovem, masculino"},
  {id:"v4",name:"Camila",style:"Energética, vendedora, feminino"},
];

const AVATARS = [
  {id:"a1",thumb:"👨‍💼",name:"Alex",style:"Formal · Escritório"},
  {id:"a2",thumb:"👩‍💼",name:"Marina",style:"Formal · Blazer neutro"},
  {id:"a3",thumb:"👨‍🌾",name:"Pedro",style:"Casual · Externo"},
  {id:"a4",thumb:"👩‍💻",name:"Julia",style:"Tech · Estúdio moderno"},
];

const MOCK_USERS = [
  {id:1,name:"Ana Paula Oliveira",email:"ana@agro.com",plan:"business",type:"business",status:"active",mrr:297,evals:124,joined:"2025-01-10"},
  {id:2,name:"Carlos Mendes",email:"carlos@fazenda.com",plan:"pro",type:"personal",status:"active",mrr:97,evals:67,joined:"2025-02-03"},
  {id:3,name:"Fernanda Lima",email:"fer@lima.com.br",plan:"pro",type:"business",status:"active",mrr:97,evals:89,joined:"2025-01-28"},
  {id:4,name:"Ricardo Santos",email:"ri@santos.net",plan:"free",type:"personal",status:"active",mrr:0,evals:12,joined:"2025-03-01"},
  {id:5,name:"Mariana Campos",email:"mari@campos.io",plan:"business",type:"business",status:"active",mrr:297,evals:201,joined:"2024-12-15"},
  {id:6,name:"João Pedro Silva",email:"jp@silva.agro",plan:"pro",type:"business",status:"churned",mrr:0,evals:34,joined:"2024-11-20"},
  {id:7,name:"Beatriz Costa",email:"bi@costa.com",plan:"enterprise",type:"business",status:"active",mrr:990,evals:445,joined:"2024-10-01"},
  {id:8,name:"Lucas Ferreira",email:"lucas@ferreira.br",plan:"free",type:"personal",status:"active",mrr:0,evals:5,joined:"2025-03-10"},
];

const PLAN_COLOR = {enterprise:"#ef4444",business:"#f59e0b",pro:"#a855f7",free:"#64748b"};
const PLAN_LABEL = {enterprise:"Enterprise",business:"Business",pro:"Pro",free:"Free"};
const MONTHLY_MRR = [
  {m:"Out",v:1280},{m:"Nov",v:1680},{m:"Dez",v:2100},
  {m:"Jan",v:2580},{m:"Fev",v:3020},{m:"Mar",v:1778},
];

// ═══════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════

async function ai(userMsg, systemMsg="Respond ONLY with valid JSON, no markdown, no explanation.") {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:systemMsg,messages:[{role:"user",content:userMsg}]}),
    });
    const d = await r.json();
    return (d.content?.map(b=>b.text).join("")||"").replace(/```json|```/g,"").trim();
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS & SHARED UI
// ═══════════════════════════════════════════════════════════════

const T = {bg:"#070d1a",surface:"#0f172a",border:"rgba(255,255,255,0.08)",text:"#e2e8f0",muted:"#64748b",accent:"#6366f1"};

function Btn({children,onClick,color=T.accent,outline=false,small=false,disabled=false,full=false,style:extra={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:outline?"transparent":disabled?"#1e293b":color,
      border:`1.5px solid ${disabled?"#334155":color}`,borderRadius:9,
      padding:small?"7px 14px":"12px 22px",color:outline?color:"#fff",
      fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:small?12:14,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
      width:full?"100%":"auto",transition:"opacity 0.15s",display:"flex",
      alignItems:"center",justifyContent:"center",gap:6,...extra,
    }}>{children}</button>
  );
}

function Field({label,value,onChange,placeholder,multi=false,type="text"}) {
  const s={width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:9,padding:"11px 14px",color:"#f1f5f9",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"};
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px"}}>{label}</div>}
      {multi?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{...s,resize:"none"}}/>
             :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
    </div>
  );
}

function Sel({label,value,onChange,options}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px"}}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        width:"100%",background:"#0f172a",border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:9,padding:"11px 14px",color:value?"#f1f5f9":"#64748b",
        fontSize:13,outline:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
      }}>
        <option value="">Selecione...</option>
        {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Card({children,onClick,selected,color,noPad=false,style:ex={}}) {
  return (
    <div onClick={onClick} style={{
      background:selected?`${color||T.accent}12`:"rgba(255,255,255,0.028)",
      border:`1.5px solid ${selected?color||T.accent:"rgba(255,255,255,0.07)"}`,
      borderRadius:14,padding:noPad?0:"18px",cursor:onClick?"pointer":"default",
      transition:"all 0.15s",...ex,
    }}>{children}</div>
  );
}

function Tag({children,color="#64748b"}) {
  return <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:`${color}20`,color,border:`1px solid ${color}40`,fontWeight:700,letterSpacing:"0.5px",whiteSpace:"nowrap"}}>{children}</span>;
}

function Steps({current,total}) {
  return (
    <div style={{display:"flex",gap:5,marginBottom:14}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{flex:1,height:3,borderRadius:3,background:i<current?T.accent:"rgba(255,255,255,0.1)",transition:"background 0.3s"}}/>
      ))}
    </div>
  );
}

function Wrap({children,back,title,sub,step,total}) {
  return (
    <div style={{maxWidth:680,marginInline:"auto",padding:"24px 16px 60px"}}>
      {(back||title)&&(
        <div style={{marginBottom:22}}>
          {back&&<button onClick={back} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:13,padding:"0 0 10px",display:"block"}}>← Voltar</button>}
          {step&&<Steps current={step} total={total}/>}
          {title&&<h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(19px,4vw,26px)",margin:"0 0 5px",letterSpacing:"-0.8px",color:"#f8fafc"}}>{title}</h2>}
          {sub&&<p style={{color:"#64748b",fontSize:13,margin:0,lineHeight:1.6}}>{sub}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{textAlign:"center",padding:"48px 0"}}>
      <div style={{fontSize:36,display:"inline-block",animation:"spin 0.8s linear infinite"}}>⚡</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: WELCOME
// ═══════════════════════════════════════════════════════════════

function Welcome({go,setAdminMode}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:500,background:"radial-gradient(ellipse at 50% -5%,rgba(99,102,241,0.22) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div style={{marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,color:"#6366f1",letterSpacing:"2px",textTransform:"uppercase",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:6,padding:"4px 12px"}}>Beta v1.0</span>
      </div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(36px,8vw,64px)",margin:"16px 0 10px",letterSpacing:"-2.5px",background:"linear-gradient(135deg,#f8fafc 0%,#94a3b8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
        Viral OS™
      </h1>
      <p style={{color:"#64748b",fontSize:15,maxWidth:400,margin:"0 auto 36px",lineHeight:1.7}}>
        O sistema operacional do conteúdo orgânico e pago que realmente performa.
      </p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
        <Btn onClick={()=>go("register")} color="#6366f1">Criar conta grátis →</Btn>
        <Btn onClick={()=>go("dashboard")} outline color="#6366f1">Entrar na conta</Btn>
      </div>
      <div style={{display:"flex",gap:16,marginTop:16}}>
        {["🎬 Vídeo","🖼️ Post","🎠 Carrossel","📣 Anúncio"].map(f=>(
          <Tag key={f} color="#475569">{f}</Tag>
        ))}
      </div>
      <button onClick={()=>{setAdminMode(true);go("admin");}} style={{background:"none",border:"none",color:"#1e293b",cursor:"pointer",fontSize:11,marginTop:32}}>⚙️ Acesso Admin</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: REGISTER — Account Type
// ═══════════════════════════════════════════════════════════════

function Register({go,setU}) {
  const [type,setType]=useState("");
  return (
    <Wrap back={()=>go("welcome")} title="Qual é o seu perfil?" sub="Isso vai personalizar toda a sua experiência na plataforma." step={1} total={6}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        {[
          {id:"personal",icon:"👤",label:"Pessoal",desc:"Criador, profissional liberal, personal brand"},
          {id:"business",icon:"🏢",label:"Empresarial",desc:"Agência, empresa, marca ou time de marketing"},
        ].map(({id,icon,label,desc})=>(
          <Card key={id} selected={type===id} color="#6366f1" onClick={()=>setType(id)}>
            <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#f1f5f9",marginBottom:4}}>{label}</div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{desc}</div>
            {type===id&&<div style={{fontSize:11,color:"#6366f1",marginTop:10,fontWeight:700}}>✓ Selecionado</div>}
          </Card>
        ))}
      </div>
      <Btn onClick={()=>{setU(p=>({...p,accountType:type}));go("ob1");}} disabled={!type} full color="#6366f1">Continuar →</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING STEPS 1–4
// ═══════════════════════════════════════════════════════════════

function OB1({go,u,setU}) {
  const [name,setName]=useState(u.name);
  const [tone,setTone]=useState(u.toneOfVoice);
  return (
    <Wrap back={()=>go("register")} title="Identidade & Tom de Voz" sub="Como você se chama e como você fala com seu público?" step={2} total={6}>
      <Field label="Nome / Nome da marca" value={name} onChange={setName} placeholder="Ex: Ben Martin Balik ou CHA AgroMkt"/>
      <Sel label="Tom de Voz" value={tone} onChange={setTone} options={[
        {v:"autoritativo",l:"Autoritativo — Especialista confiante"},
        {v:"educativo",l:"Educativo — Professor acessível"},
        {v:"descontraido",l:"Descontraído — Amigo que entende do assunto"},
        {v:"provocador",l:"Provocador — Questiona o status quo"},
        {v:"inspiracional",l:"Inspiracional — Motiva e eleva"},
        {v:"direto",l:"Direto — Vai direto ao ponto, sem rodeios"},
      ]}/>
      <Btn onClick={()=>{setU(p=>({...p,name,toneOfVoice:tone}));go("ob2");}} disabled={!name||!tone} full color="#6366f1">Continuar →</Btn>
    </Wrap>
  );
}

function OB2({go,u,setU}) {
  const [audience,setAudience]=useState(u.audience);
  const [skill,setSkill]=useState(u.technicalSkill);
  return (
    <Wrap back={()=>go("ob1")} title="Público & Habilidade" sub="Para quem você fala e qual o seu nível técnico?" step={3} total={6}>
      <Field label="Público-alvo" value={audience} onChange={setAudience} placeholder="Ex: Produtores rurais do Centro-Oeste, 35–55 anos, interessados em tecnologia para o campo" multi/>
      <Sel label="Habilidade técnica em conteúdo" value={skill} onChange={setSkill} options={[
        {v:"iniciante",l:"Iniciante — Estou começando agora"},
        {v:"intermediario",l:"Intermediário — Já publico, mas quero melhorar"},
        {v:"avancado",l:"Avançado — Produção profissional de conteúdo"},
        {v:"especialista",l:"Especialista — Trabalho com conteúdo há anos"},
      ]}/>
      <Btn onClick={()=>{setU(p=>({...p,audience,technicalSkill:skill}));go("ob3");}} disabled={!audience||!skill} full color="#6366f1">Continuar →</Btn>
    </Wrap>
  );
}

function OB3({go,u,setU}) {
  const [ctx,setCtx]=useState(u.context);
  const [themes,setThemes]=useState(u.macroThemes||["","","","",""]);
  const setTheme=(i,v)=>{ const n=[...themes]; n[i]=v; setThemes(n); };
  return (
    <Wrap back={()=>go("ob2")} title="Contexto & Macro Temas" sub="Conte mais sobre o que você faz e seus 5 grandes temas de conteúdo." step={4} total={6}>
      <Field label="Contexto relevante" value={ctx} onChange={setCtx} placeholder="Ex: Sou fundador da CHA AgroMkt, agência especializada em marketing e vendas para o agronegócio. Trabalho com insumos, distribuidoras, cooperativas e maquinário." multi/>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px"}}>5 Macro Temas de Conteúdo</div>
        {themes.map((t,i)=>(
          <input key={i} value={t} onChange={e=>setTheme(i,e.target.value)} placeholder={`Tema ${i+1} — ex: Marketing para o agronegócio`}
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"10px 14px",color:"#f1f5f9",fontSize:13,outline:"none",marginBottom:6,boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
        ))}
      </div>
      <Btn onClick={()=>{setU(p=>({...p,context:ctx,macroThemes:themes}));go("ob4");}} disabled={!ctx||!themes[0]} full color="#6366f1">Continuar →</Btn>
    </Wrap>
  );
}

function OB4({go,u,setU}) {
  const [sells,setSells]=useState(u.sellsProducts||false);
  const [ps,setPs]=useState(u.productsServices||"");
  return (
    <Wrap back={()=>go("ob3")} title="Produtos & Serviços" sub="O que você vende? Isso vai personalizar CTAs e estratégia de funil." step={5} total={6}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.8px"}}>Você vende produto ou serviço?</div>
        <div style={{display:"flex",gap:8}}>
          {["Sim","Não"].map(opt=>(
            <button key={opt} onClick={()=>setSells(opt==="Sim")} style={{flex:1,padding:"11px",borderRadius:9,background:(opt==="Sim"?sells:!sells)?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.04)",border:`1.5px solid ${(opt==="Sim"?sells:!sells)?"#6366f1":"rgba(255,255,255,0.08)"}`,color:(opt==="Sim"?sells:!sells)?"#6366f1":"#64748b",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{opt}</button>
          ))}
        </div>
      </div>
      {sells&&<Field label="Descreva seus produtos/serviços" value={ps} onChange={setPs} placeholder="Ex: Método S.A.F.R.A.™ — consultoria de marketing e vendas para agronegócio. Planos mensais de R$2.500 a R$8.000. Também treinamentos online (Leadcultura Insights)." multi/>}
      <Btn onClick={()=>{setU(p=>({...p,sellsProducts:sells,productsServices:ps}));go("research");}} full color="#6366f1">🔬 Iniciar Deep Research →</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: DEEP RESEARCH
// ═══════════════════════════════════════════════════════════════

function Research({go,u,setResearch}) {
  const [phase,setPhase]=useState(0);
  const [prog,setProg]=useState({g:0,p:0,c:0});
  const [status,setStatus]=useState({g:"Iniciando...",p:"Iniciando...",c:"Iniciando..."});
  const [insights,setInsights]=useState(null);

  const MSGS={
    g:["Analisando tendências de conteúdo...","Mapeando concorrentes do segmento...","Identificando lacunas de conteúdo...","Cruzando dados de engajamento...","Concluído ✓"],
    p:["Pesquisando comportamento do público...","Analisando copy dos top performers...","Identificando gatilhos de conversão...","Mapeando objeções do ICP...","Concluído ✓"],
    c:["Sintetizando estratégia de conteúdo...","Criando ângulos editoriais únicos...","Identificando oportunidades de posicionamento...","Gerando recomendações personalizadas...","Concluído ✓"],
  };

  useEffect(()=>{
    let t=0;
    const iv=setInterval(()=>{
      t++;
      setProg({g:Math.min(t*4.2+Math.random()*4,100),p:Math.min(t*3.8+Math.random()*5+8,100),c:Math.min(t*5.1+Math.random()*3-3,100)});
      setStatus({g:MSGS.g[Math.min(Math.floor(t/6),4)],p:MSGS.p[Math.min(Math.floor(t/5.5),4)],c:MSGS.c[Math.min(Math.floor(t/4.5),4)]});
      if(t>=26)clearInterval(iv);
    },200);

    const prompt=`Deep research for a content creator profile. Return ONLY valid JSON:
Profile: Name=${u.name}, Type=${u.accountType}, Tone=${u.toneOfVoice}, Audience=${u.audience}, Skill=${u.technicalSkill}, Context=${u.context}, Themes=${(u.macroThemes||[]).filter(Boolean).join(", ")}, Sells=${u.sellsProducts?u.productsServices:"nothing"}

{"positioning":"one-sentence unique positioning","topOpportunities":["opp1","opp2","opp3"],"audienceInsights":["i1","i2","i3"],"contentAngles":["angle1","angle2","angle3"],"competitiveEdge":"what makes them stand out","recommendedFormats":["fmt1","fmt2"],"keyMessages":["msg1","msg2","msg3"],"warnings":["warn1","warn2"]}

Respond in Brazilian Portuguese.`;

    ai(prompt).then(txt=>{
      try{ setInsights(JSON.parse(txt)); }
      catch{ setInsights({
        positioning:`${u.name||"Você"} é referência em conteúdo estratégico para ${u.audience||"seu mercado"}`,
        topOpportunities:["Conteúdo educativo sobre transformação de resultados","Cases e provas sociais do seu mercado","Conteúdo de bastidores que humaniza a marca"],
        audienceInsights:["Seu público busca resultados práticos, não teoria","Alta sensibilidade a provas sociais do mesmo setor","Prefere conteúdo curto e denso a longos e superficiais"],
        contentAngles:["Antes/depois com dados reais","Mitos do setor que você derruba","O que os top 1% fazem diferente"],
        competitiveEdge:"Combinação única de expertise técnica com comunicação acessível",
        recommendedFormats:["Vídeo curto (Reels/TikTok)","Carrossel educativo"],
        keyMessages:["Resultado > processo","Simplicidade é sofisticação","Dados vencem opiniões"],
        warnings:["Evitar conteúdo muito técnico sem tradução para o público","Manter frequência consistente de publicação"],
      });}
      setTimeout(()=>setPhase(1),800);
    });
    return()=>clearInterval(iv);
  },[]);

  if(phase===1&&insights) return (
    <Wrap title="🧠 Deep Research Concluído" sub="3 agentes de IA mapearam seu mercado, público e oportunidades.">
      <div style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6366f1",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>📍 Posicionamento</div>
        <div style={{fontSize:14,color:"#f1f5f9",lineHeight:1.7}}>{insights.positioning}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[
          {label:"🎯 Top Oportunidades",items:insights.topOpportunities,color:"#22c55e"},
          {label:"👥 Insights do Público",items:insights.audienceInsights,color:"#f59e0b"},
        ].map(({label,items,color})=>(
          <Card key={label}>
            <div style={{fontSize:10,fontWeight:700,color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>{label}</div>
            {items?.map((o,i)=><div key={i} style={{fontSize:12,color:"#94a3b8",marginBottom:5,paddingLeft:8,borderLeft:`2px solid ${color}`,lineHeight:1.5}}>{o}</div>)}
          </Card>
        ))}
      </div>
      <Card style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:"#a855f7",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>💡 Ângulos de Conteúdo</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {insights.contentAngles?.map((a,i)=><Tag key={i} color="#a855f7">{a}</Tag>)}
        </div>
      </Card>
      {insights.warnings?.length>0&&(
        <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#ef4444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>⚠️ Atenção</div>
          {insights.warnings.map((w,i)=><div key={i} style={{fontSize:12,color:"#94a3b8",marginBottom:3}}>• {w}</div>)}
        </div>
      )}
      <Btn onClick={()=>{setResearch(insights);go("dashboard");}} full color="#6366f1">Ir para o Dashboard →</Btn>
    </Wrap>
  );

  return (
    <Wrap title="🔬 Deep Research em andamento" sub="3 agentes de IA pesquisando seu mercado, público e oportunidades de conteúdo.">
      <div style={{marginBottom:20}}>
        {[
          {id:"g",name:"Gemini",logo:"🌟",color:"#4285f4",s:status.g,p:prog.g},
          {id:"p",name:"GPT-4o",logo:"🤖",color:"#10a37f",s:status.p,p:prog.p},
          {id:"c",name:"Claude",logo:"🧠",color:"#a855f7",s:status.c,p:prog.c},
        ].map(({id,name,logo,color,s,p})=>(
          <div key={id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>{logo}</span>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9"}}>{name}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{s}</div>
                </div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color}}>{Math.round(Math.min(p,100))}%</div>
            </div>
            <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(p,100)}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:3,transition:"width 0.3s"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",color:"#475569",fontSize:13}}>Analisando seu perfil e mercado em tempo real...</div>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: DASHBOARD
// ═══════════════════════════════════════════════════════════════

function Dashboard({go,u,research}) {
  return (
    <Wrap>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#f8fafc",letterSpacing:"-0.8px"}}>Viral OS™</div>
          <div style={{fontSize:12,color:"#64748b"}}>Olá, {u.name||"Criador"} 👋</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Tag color={u.accountType==="business"?"#f59e0b":"#a855f7"}>{u.accountType==="business"?"Business":"Personal"}</Tag>
          <Tag color="#6366f1">Pro</Tag>
        </div>
      </div>

      <div style={{marginBottom:28}}>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#f1f5f9",margin:"0 0 14px",letterSpacing:"-0.4px"}}>O que você quer fazer hoje?</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {icon:"🔬",label:"Avaliar Conteúdo",sub:"Analise o potencial viral antes de publicar",color:"#06b6d4",screen:"format-eval"},
            {icon:"✨",label:"Criar Conteúdo",sub:"Gere conteúdo completo com IA, do tema ao produto final",color:"#6366f1",screen:"format-select"},
          ].map(({icon,label,sub,color,screen})=>(
            <Card key={label} color={color} onClick={()=>go(screen)} style={{padding:"22px"}}>
              <div style={{fontSize:30,marginBottom:10}}>{icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#f1f5f9",marginBottom:5}}>{label}</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{sub}</div>
            </Card>
          ))}
        </div>
      </div>

      {research&&(
        <div style={{background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:14,padding:"16px",marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6366f1",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>🧠 Seu posicionamento</div>
          <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.65}}>{research.positioning}</div>
        </div>
      )}

      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#334155",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Último conteúdo criado</div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22}}>🎬</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:"#94a3b8"}}>Nenhum conteúdo criado ainda</div>
            <div style={{fontSize:11,color:"#475569"}}>Seus conteúdos criados aparecerão aqui</div>
          </div>
          <Btn onClick={()=>go("format-select")} small color="#6366f1">Criar</Btn>
        </div>
      </div>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: FORMAT SELECT (Avaliar ou Criar)
// ═══════════════════════════════════════════════════════════════

function FormatSelect({go,setFmt,mode="create"}) {
  return (
    <Wrap back={()=>go("dashboard")} title={mode==="create"?"Escolha o formato":"Qual formato avaliar?"} sub={mode==="create"?"Que tipo de conteúdo você quer criar agora?":"Escolha o formato do conteúdo que você quer analisar."}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {FORMATS.map(({id,icon,label,sub,color})=>(
          <Card key={id} color={color} onClick={()=>{setFmt(id);go(mode==="create"?"fmt-examples":"score");}}>
            <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:4}}>{label}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{sub}</div>
          </Card>
        ))}
      </div>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: FORMAT EXAMPLES
// ═══════════════════════════════════════════════════════════════

function FmtExamples({go,fmt}) {
  const f=FORMATS.find(x=>x.id===fmt);
  const ex=FORMAT_EXAMPLES[fmt];
  if(!f||!ex)return null;
  return (
    <Wrap back={()=>go("format-select")} title={`${f.icon} ${f.label}`} sub="Exemplos de formatos virais e boas práticas validadas pelo mercado.">
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>✅ Boas Práticas</div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px"}}>
          {ex.bestPractices.map((bp,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <span style={{color:f.color,fontSize:12,minWidth:16,marginTop:1}}>→</span>
              <span style={{fontSize:13,color:"#94a3b8",lineHeight:1.5}}>{bp}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>🎯 3 Formatos Virais</div>
        {ex.examples.map((e,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"14px 16px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9"}}>{e.title}</div>
              <Tag color={f.color}>{e.fmt}</Tag>
            </div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{e.desc}</div>
          </div>
        ))}
      </div>
      <Btn onClick={()=>go("content-theme")} full color={f.color}>Criar com este formato →</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: CONTENT THEME
// ═══════════════════════════════════════════════════════════════

function ContentTheme({go,fmt,theme,setTheme,funnel,setFunnel}) {
  const f=FORMATS.find(x=>x.id===fmt);
  const FUNNEL=[
    {v:"topo",l:"🔝 Topo de Funil — Descoberta & Consciência",d:"Para quem nunca ouviu falar de você. Conteúdo amplo, inspiracional ou educativo."},
    {v:"meio",l:"⚙️ Meio de Funil — Consideração & Engajamento",d:"Para quem já te conhece. Mais técnico, aprofundado, que gera confiança."},
    {v:"fundo",l:"🎯 Fundo de Funil — Decisão & Conversão",d:"Para quem está pronto para agir. Cases, provas, comparações, CTAs diretos."},
  ];
  return (
    <Wrap back={()=>go("fmt-examples")} title="Tema & Funil" sub={`Defina o tema do seu ${f?.label.toLowerCase()||"conteúdo"} e em qual etapa do funil ele se encaixa.`}>
      <Field label="Tema do Conteúdo" value={theme} onChange={setTheme} placeholder="Ex: Por que 90% dos produtores rurais erram na hora de escolher o insumo"/>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.8px"}}>Foco do Funil</div>
        {FUNNEL.map(({v,l,d})=>(
          <div key={v} onClick={()=>setFunnel(v)} style={{background:funnel===v?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.025)",border:`1.5px solid ${funnel===v?"#6366f1":"rgba(255,255,255,0.07)"}`,borderRadius:11,padding:"13px 15px",cursor:"pointer",marginBottom:8}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,color:funnel===v?"#6366f1":"#f1f5f9",marginBottom:3}}>{l}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{d}</div>
          </div>
        ))}
      </div>
      <Btn onClick={()=>go("titles")} disabled={!theme||!funnel} full color={f?.color||"#6366f1"}>Gerar Títulos com IA →</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: TITLE GENERATION
// ═══════════════════════════════════════════════════════════════

function Titles({go,fmt,theme,funnel,u,titles,setTitles,selTitle,setSelTitle}) {
  const [loading,setLoading]=useState(!titles?.length);
  const [editIdx,setEditIdx]=useState(null);
  const [editVal,setEditVal]=useState("");
  const f=FORMATS.find(x=>x.id===fmt);

  useEffect(()=>{
    if(titles?.length)return;
    const prompt=`Generate 3 high-performing ${fmt} content titles for:
Name=${u.name}, Tone=${u.toneOfVoice}, Audience=${u.audience}, Theme="${theme}", Funnel=${funnel}, Context=${u.context}

Return ONLY JSON:
{"titles":[{"title":"...","why":"1 sentence why this works","type":"hook type"},{"title":"...","why":"...","type":"..."},{"title":"...","why":"...","type":"..."}]}

Brazilian Portuguese. Make titles highly clickable, specific to theme and funnel stage.`;

    ai(prompt).then(txt=>{
      try{const p=JSON.parse(txt);setTitles(p.titles||[]);}
      catch{setTitles([
        {title:`${theme} — e o que ninguém te contou sobre isso`,why:"Curiosidade + promessa de informação exclusiva",type:"Curiosity Gap"},
        {title:`Eu testei isso por 90 dias. Os resultados foram surpreendentes`,why:"Prova social + especificidade temporal + surpresa",type:"Social Proof"},
        {title:`3 erros que estão destruindo seus resultados com ${theme.split(" ").slice(-3).join(" ")}`,why:"Gatilho de perda + número específico",type:"Loss Aversion"},
      ]);}
      setLoading(false);
    });
  },[]);

  if(loading)return<Wrap title="⚡ Gerando títulos..." sub="A IA está criando 3 opções baseadas no seu perfil e tema."><Spinner/></Wrap>;

  return (
    <Wrap back={()=>go("content-theme")} title="Escolha o Título" sub="3 títulos gerados pela IA. Você pode editar qualquer um antes de escolher.">
      <div style={{marginBottom:20}}>
        {titles.map((t,i)=>(
          <div key={i} onClick={()=>editIdx!==i&&setSelTitle(t.title)} style={{background:selTitle===t.title?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.025)",border:`1.5px solid ${selTitle===t.title?"#6366f1":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:"15px",marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Tag color="#6366f1">{t.type}</Tag>
              <button onClick={e=>{e.stopPropagation();setEditIdx(editIdx===i?null:i);setEditVal(t.title);}} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:12}}>
                {editIdx===i?"✕ Cancelar":"✏️ Editar"}
              </button>
            </div>
            {editIdx===i?(
              <div onClick={e=>e.stopPropagation()}>
                <textarea value={editVal} onChange={e=>setEditVal(e.target.value)} rows={3} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"10px 12px",color:"#f1f5f9",fontSize:13,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
                <button onClick={e=>{e.stopPropagation();const n=[...titles];n[i]={...n[i],title:editVal};setTitles(n);setEditIdx(null);if(selTitle)setSelTitle(editVal);}} style={{marginTop:5,background:"#6366f1",border:"none",borderRadius:7,padding:"7px 14px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>Salvar</button>
              </div>
            ):(
              <>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#f1f5f9",lineHeight:1.4,marginBottom:7}}>{t.title}</div>
                <div style={{fontSize:11,color:"#64748b",fontStyle:"italic"}}>💡 {t.why}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <Btn onClick={()=>go("production")} disabled={!selTitle} full color={f?.color||"#6366f1"}>Produzir com este título →</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: CONTENT PRODUCTION
// ═══════════════════════════════════════════════════════════════

function Production({go,fmt,selTitle,theme,funnel,u}) {
  const [content,setContent]=useState(null);
  const [loading,setLoading]=useState(true);
  const f=FORMATS.find(x=>x.id===fmt);

  useEffect(()=>{
    const sys="You are a viral content specialist. Return ONLY valid JSON.";
    const prompts={
      video:`Video script for: Title="${selTitle}", Theme="${theme}", Funnel=${funnel}, Creator=${u.name}, Tone=${u.toneOfVoice}, Audience=${u.audience}
{"hook":"First 3s script","segments":[{"label":"Hook (0-3s)","duration":"3s","script":"...","note":"direction"},{"label":"Problema (3-15s)","duration":"12s","script":"...","note":"..."},{"label":"Solução (15-35s)","duration":"20s","script":"...","note":"..."},{"label":"Prova (35-50s)","duration":"15s","script":"...","note":"..."},{"label":"CTA (50-60s)","duration":"10s","script":"...","note":"..."}],"caption":"full caption with emojis and hashtags","keywords":["kw1","kw2","kw3"]}`,
      static:`Static post for: Title="${selTitle}", Theme="${theme}", Funnel=${funnel}, Creator=${u.name}, Tone=${u.toneOfVoice}
{"visual_brief":"what image should show","headline":"max 7 words for image","caption":"full caption with hook, body, CTA, hashtags","cta":"specific CTA","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"]}`,
      carousel:`Carousel for: Title="${selTitle}", Theme="${theme}", Funnel=${funnel}, Creator=${u.name}, Tone=${u.toneOfVoice}
{"slides":[{"number":1,"role":"Capa","headline":"...","visual":"...","note":"..."},{"number":2,"role":"Problema","headline":"...","visual":"...","note":"..."},{"number":3,"role":"Solução 1","headline":"...","visual":"...","note":"..."},{"number":4,"role":"Solução 2","headline":"...","visual":"...","note":"..."},{"number":5,"role":"Solução 3","headline":"...","visual":"...","note":"..."},{"number":6,"role":"Prova Social","headline":"...","visual":"...","note":"..."},{"number":7,"role":"CTA + Loop","headline":"...","visual":"...","note":"..."}],"caption":"carousel caption","cta":"main CTA"}`,
      ad:`Ad creative for: Title="${selTitle}", Theme="${theme}", Funnel=${funnel}, Creator=${u.name}, Audience=${u.audience}
{"hook":"first frame hook max 8 words","headline":"ad headline","body":"PAS structure body copy","cta_button":"CTA text","visual_brief":"what creative shows","format_recommendation":"recommended format and size","audience_note":"targeting note"}`,
    };

    ai(prompts[fmt],sys).then(txt=>{
      try{setContent(JSON.parse(txt));}
      catch{setContent({error:true});}
      setLoading(false);
    });
  },[]);

  if(loading)return<Wrap title={`✨ Gerando ${f?.label}...`} sub="A IA está produzindo seu conteúdo completo."><Spinner/></Wrap>;

  const Sec=({label,value,color="#64748b"})=>value&&(
    <div style={{background:`${color}0d`,border:`1px solid ${color}22`,borderRadius:10,padding:"13px 15px",marginBottom:10}}>
      <div style={{fontSize:10,fontWeight:700,color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <div style={{fontSize:13,color:"#f1f5f9",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{value}</div>
    </div>
  );

  return (
    <Wrap back={()=>go("titles")} title={`${f?.icon} Conteúdo Pronto`} sub={`"${selTitle}"`}>
      {fmt==="video"&&content?.segments&&(
        <>
          <div style={{background:"rgba(168,85,247,0.1)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#a855f7",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>⚡ Hook — primeiros 3 segundos</div>
            <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontStyle:"italic",lineHeight:1.5}}>"{content.hook}"</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>📹 Roteiro</div>
            {content.segments.map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"13px 15px",marginBottom:7}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:6}}>
                  <Tag color="#a855f7">{s.label}</Tag>
                  <span style={{fontSize:10,color:"#475569"}}>{s.duration}</span>
                </div>
                <div style={{fontSize:13,color:"#f1f5f9",lineHeight:1.65,marginBottom:5}}>{s.script}</div>
                {s.note&&<div style={{fontSize:11,color:"#64748b",fontStyle:"italic"}}>📽️ {s.note}</div>}
              </div>
            ))}
          </div>
          {content.caption&&<Sec label="💬 Legenda" value={content.caption} color="#a855f7"/>}
          <Btn onClick={()=>go("video-voice")} full color="#a855f7">🎙️ Gravar ou Clonar Voz →</Btn>
        </>
      )}
      {fmt==="carousel"&&content?.slides&&(
        <>
          <div style={{marginBottom:14}}>
            {content.slides.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 14px",marginBottom:7,alignItems:"flex-start"}}>
                <div style={{minWidth:28,height:28,borderRadius:"50%",background:"#f59e0b18",border:"1px solid #f59e0b44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#f59e0b",flexShrink:0}}>{s.number}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,marginBottom:4}}><Tag color="#f59e0b">{s.role}</Tag></div>
                  <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9",marginBottom:4,lineHeight:1.4}}>{s.headline}</div>
                  {s.visual&&<div style={{fontSize:11,color:"#64748b"}}>{s.visual}</div>}
                  {s.note&&<div style={{fontSize:11,color:"#475569",fontStyle:"italic",marginTop:3}}>{s.note}</div>}
                </div>
              </div>
            ))}
          </div>
          {content.caption&&<Sec label="💬 Legenda" value={content.caption} color="#f59e0b"/>}
          <Btn onClick={()=>go("dashboard")} full color="#f59e0b">✅ Conteúdo concluído →</Btn>
        </>
      )}
      {fmt==="static"&&content&&(
        <>
          <Sec label="📸 Brief Visual" value={content.visual_brief} color="#06b6d4"/>
          <Sec label="📝 Headline (texto da imagem)" value={content.headline} color="#06b6d4"/>
          <Sec label="🔗 CTA" value={content.cta} color="#06b6d4"/>
          {content.caption&&<Sec label="💬 Legenda Completa" value={content.caption} color="#06b6d4"/>}
          <Btn onClick={()=>go("dashboard")} full color="#06b6d4">✅ Conteúdo concluído →</Btn>
        </>
      )}
      {fmt==="ad"&&content&&(
        <>
          <Sec label="🚨 Hook (frame 1)" value={content.hook} color="#ef4444"/>
          <Sec label="📣 Headline" value={content.headline} color="#ef4444"/>
          <Sec label="📝 Copy do Anúncio" value={content.body} color="#ef4444"/>
          <Sec label="🔘 Botão CTA" value={content.cta_button} color="#ef4444"/>
          <Sec label="🎨 Brief Visual" value={content.visual_brief} color="#ef4444"/>
          <Sec label="📐 Formato Recomendado" value={content.format_recommendation} color="#ef4444"/>
          <Sec label="🎯 Nota de Segmentação" value={content.audience_note} color="#ef4444"/>
          <Btn onClick={()=>go("dashboard")} full color="#ef4444">✅ Criativo concluído →</Btn>
        </>
      )}
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: VIDEO — VOICE
// ═══════════════════════════════════════════════════════════════

function VideoVoice({go,voiceMode,setVoiceMode,selVoice,setSelVoice}) {
  return (
    <Wrap back={()=>go("production")} title="🎙️ Configurar Voz" sub="Escolha como você quer narrar o vídeo.">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {id:"clone",icon:"🧬",label:"Clonar Minha Voz",desc:"Envie um áudio de 30s e a IA clona com 98% de fidelidade",color:"#a855f7"},
          {id:"choose",icon:"🎙️",label:"Escolher Voz Pronta",desc:"Selecione entre vozes profissionais treinadas e disponíveis",color:"#6366f1"},
        ].map(({id,icon,label,desc,color})=>(
          <Card key={id} color={color} selected={voiceMode===id} onClick={()=>setVoiceMode(id)}>
            <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:4}}>{label}</div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{desc}</div>
          </Card>
        ))}
      </div>

      {voiceMode==="clone"&&(
        <div style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.25)",borderRadius:12,padding:"18px",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#a855f7",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>Como clonar sua voz</div>
          {["Grave um áudio de pelo menos 30 segundos lendo um texto neutro","Use ambiente silencioso e microfone de qualidade","Fale no tom natural, sem forçar","Processamento em ~2 minutos — sua voz estará disponível"].map((s,i)=>
            <div key={i} style={{fontSize:13,color:"#94a3b8",marginBottom:6,paddingLeft:10,borderLeft:"2px solid #a855f777"}}>→ {s}</div>
          )}
          <div style={{marginTop:14,background:"rgba(255,255,255,0.04)",border:"2px dashed rgba(168,85,247,0.4)",borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer"}}>
            <div style={{fontSize:24,marginBottom:6}}>🎤</div>
            <div style={{fontSize:13,color:"#a855f7",fontWeight:600,marginBottom:4}}>Arraste o áudio aqui ou clique para enviar</div>
            <div style={{fontSize:11,color:"#64748b"}}>MP3, WAV ou M4A · Mínimo 30 segundos</div>
          </div>
        </div>
      )}

      {voiceMode==="choose"&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>Vozes Disponíveis</div>
          {VOICES.map(v=>(
            <div key={v.id} onClick={()=>setSelVoice(v.id)} style={{background:selVoice===v.id?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.025)",border:`1.5px solid ${selVoice===v.id?"#6366f1":"rgba(255,255,255,0.07)"}`,borderRadius:10,padding:"12px 14px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:22}}>🎙️</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#f1f5f9"}}>{v.name}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{v.style}</div>
              </div>
              <button style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:6,padding:"5px 10px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>▶ Ouvir</button>
            </div>
          ))}
        </div>
      )}

      <Btn onClick={()=>go("video-avatar")} disabled={!voiceMode||(voiceMode==="choose"&&!selVoice)} full color="#a855f7">
        Configurar Avatar →
      </Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: VIDEO — AVATAR
// ═══════════════════════════════════════════════════════════════

function VideoAvatar({go,avatarMode,setAvatarMode,selAvatar,setSelAvatar}) {
  const [createStep,setCreateStep]=useState(0);

  const CREATE_STEPS=[
    {icon:"🎥",title:"Grave o vídeo de treinamento",desc:"5–10 min · Iluminação frontal · Fundo limpo · Roupa profissional",detail:"Fale olhando para a câmera, varie gestos naturalmente. Frases completas com pausas."},
    {icon:"📐",title:"Enquadramento correto",desc:"Câmera na altura dos olhos · Cabeça e ombros · 60cm de distância",detail:"Use tripé. Ring light à frente. Evite janelas atrás de você."},
    {icon:"☁️",title:"Upload e processamento",desc:"Envie o MP4 · IA processa em 10–30 min · Notificação por email",detail:"O sistema extrai movimentos labiais, expressões e gestos para o avatar."},
    {icon:"✅",title:"Verificação de consentimento",desc:"Assine o termo de avatar digital · 100% LGPD/GDPR compliant",detail:"Seu avatar é privado e exclusivo. Nenhum terceiro tem acesso."},
    {icon:"👁️",title:"Preview e aprovação",desc:"Prévia de 30s com lipSync · Aprove ou solicite ajustes",detail:"Até 2 ajustes gratuitos antes da aprovação final."},
    {icon:"🚀",title:"Avatar ativado",desc:"Pronto para gerar vídeos com lipSync em segundos",detail:"Tempo médio de geração: 2–5 min por minuto de vídeo."},
  ];

  if(!avatarMode) return (
    <Wrap back={()=>go("video-voice")} title="🎭 Configurar Avatar" sub="Escolha um avatar existente ou crie o seu com realismo máximo.">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {id:"choose",icon:"🎭",label:"Avatar Pronto",desc:"Avatares profissionais disponíveis imediatamente",color:"#6366f1"},
          {id:"create",icon:"🧬",label:"Criar Meu Avatar",desc:"Avatar ultra-realista com o seu rosto em 6 passos",color:"#f59e0b"},
        ].map(({id,icon,label,desc,color})=>(
          <Card key={id} color={color} onClick={()=>setAvatarMode(id)}>
            <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:4}}>{label}</div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{desc}</div>
          </Card>
        ))}
      </div>
      <Btn onClick={()=>go("video-generate")} disabled full color="#f59e0b">Selecione uma opção acima</Btn>
    </Wrap>
  );

  if(avatarMode==="choose") return (
    <Wrap back={()=>setAvatarMode("")} title="🎭 Avatares Disponíveis">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {AVATARS.map(a=>(
          <div key={a.id} onClick={()=>setSelAvatar(a.id)} style={{background:selAvatar===a.id?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.025)",border:`1.5px solid ${selAvatar===a.id?"#6366f1":"rgba(255,255,255,0.07)"}`,borderRadius:11,padding:"16px",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>{a.thumb}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12,color:"#f1f5f9",marginBottom:3}}>{a.name}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{a.style}</div>
          </div>
        ))}
      </div>
      <Btn onClick={()=>go("video-generate")} disabled={!selAvatar} full color="#6366f1">Gerar Vídeo com HeyGen →</Btn>
    </Wrap>
  );

  if(avatarMode==="create") return (
    <Wrap back={()=>setAvatarMode("")} title="🧬 Criar Avatar Ultra-Realista" sub="6 passos validados para qualidade de vídeo profissional.">
      <div style={{marginBottom:16}}>
        {CREATE_STEPS.map(({icon,title,desc,detail},idx)=>{
          const step=idx+1;
          const done=createStep>=step;
          const current=createStep===step-1;
          return (
            <div key={idx} style={{background:done?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.02)",border:`1px solid ${done?"rgba(245,158,11,0.3)":"rgba(255,255,255,0.06)"}`,borderRadius:10,padding:"13px 15px",marginBottom:7}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{minWidth:32,height:32,borderRadius:"50%",background:done?"#f59e0b18":"rgba(255,255,255,0.04)",border:`1.5px solid ${done?"#f59e0b":"rgba(255,255,255,0.09)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:done?"#f59e0b":"#334155",flexShrink:0}}>
                  {createStep>step?"✓":icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:done?"#f1f5f9":"#475569",marginBottom:3}}>Passo {step}: {title}</div>
                  <div style={{fontSize:12,color:done?"#94a3b8":"#334155",marginBottom:done?4:0}}>{desc}</div>
                  {done&&<div style={{fontSize:11,color:"#64748b",fontStyle:"italic"}}>{detail}</div>}
                </div>
                {current&&<button onClick={()=>setCreateStep(step)} style={{background:"#f59e0b",border:"none",borderRadius:7,padding:"6px 12px",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>Iniciar</button>}
              </div>
            </div>
          );
        })}
      </div>
      <Btn onClick={()=>go("video-generate")} disabled={createStep<5} full color="#f59e0b">
        {createStep<5?`Conclua o passo ${createStep+1} para continuar`:"Gerar Vídeo com HeyGen →"}
      </Btn>
    </Wrap>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: VIDEO — GENERATE
// ═══════════════════════════════════════════════════════════════

function VideoGenerate({go}) {
  const [tiktokImgs,setTiktokImgs]=useState([]);
  const [generating,setGenerating]=useState(false);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    setTimeout(()=>setTiktokImgs(["Campo verde com trator ao pôr do sol","Agricultor usando tablet na lavoura","Gráfico de crescimento de vendas rurais","Cooperativa com produtores reunidos","Drone sobrevoando plantação"]),1500);
  },[]);

  return (
    <Wrap back={()=>go("video-avatar")} title="🎬 Gerar Vídeo" sub="Últimos passos antes do seu vídeo ficar pronto.">
      <div style={{marginBottom:18}}>
        <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>📱 Imagens para Insert — TikTok Search</div>
        <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px"}}>
          {tiktokImgs.length===0?(
            <div style={{textAlign:"center",color:"#64748b",padding:"14px 0",fontSize:13}}>
              <div style={{fontSize:22,marginBottom:6,animation:"spin 1s linear infinite",display:"inline-block"}}>🔍</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{marginTop:8}}>Buscando imagens relevantes no TikTok...</div>
            </div>
          ):(
            <>
              <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>5 imagens encontradas baseadas nas palavras-chave do roteiro:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {tiktokImgs.map((img,i)=>(<div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}>🖼️ {img}</div>))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{background:"rgba(255,69,0,0.08)",border:"1px solid rgba(255,69,0,0.25)",borderRadius:12,padding:"16px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:22}}>🎬</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9"}}>HeyGen · LipSync Generation</div>
            <div style={{fontSize:11,color:"#64748b"}}>Conectado via API</div>
          </div>
          <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#22c55e"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Online
          </span>
        </div>
        {!generating&&!done&&<Btn onClick={()=>{setGenerating(true);setTimeout(()=>{setGenerating(false);setDone(true);},4000);}} full color="#FF4500">🚀 Gerar Vídeo com Avatar + LipSync</Btn>}
        {generating&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12,color:"#94a3b8"}}>
              <span>Gerando vídeo...</span><span style={{color:"#FF4500"}}>Processando</span>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",background:"linear-gradient(90deg,#FF450066,#FF4500)",borderRadius:3,animation:"loading 3.8s ease-out forwards"}}/>
            </div>
            <style>{`@keyframes loading{from{width:0%}to{width:100%}}`}</style>
            <div style={{fontSize:11,color:"#64748b",marginTop:5}}>Aplicando lipSync · Inserindo imagens · Renderizando...</div>
          </div>
        )}
      </div>

      {done&&(
        <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:14,padding:"24px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>✅</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#22c55e",marginBottom:6}}>Vídeo Pronto!</div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>Gerado com sucesso e pronto para download.</div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            <Btn color="#22c55e">⬇️ Baixar Vídeo</Btn>
            <Btn outline color="#22c55e" onClick={()=>go("dashboard")}>Ir ao Dashboard</Btn>
          </div>
        </div>
      )}
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

function Admin({go}) {
  const [tab,setTab]=useState("overview");
  const [search,setSearch]=useState("");

  const active=MOCK_USERS.filter(u=>u.status==="active");
  const totalMRR=active.reduce((s,u)=>s+u.mrr,0);
  const totalARR=totalMRR*12;
  const churnCount=MOCK_USERS.filter(u=>u.status==="churned").length;
  const arpu=Math.round(totalMRR/active.length);

  const planDist=["enterprise","business","pro","free"].reduce((acc,p)=>{
    acc[p]=active.filter(u=>u.plan===p).length;return acc;
  },{});

  const filteredUsers=MOCK_USERS.filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));
  const maxMRR=Math.max(...MONTHLY_MRR.map(m=>m.v));

  return (
    <div>
      {/* Admin Header */}
      <div style={{background:"#0f172a",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 24px"}}>
        <div style={{maxWidth:1080,marginInline:"auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#f8fafc",letterSpacing:"-0.8px"}}>Viral OS™</div>
            <Tag color="#ef4444">Admin</Tag>
          </div>
          <button onClick={()=>go("welcome")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13}}>← Sair do Admin</button>
        </div>
      </div>

      <div style={{maxWidth:1080,marginInline:"auto",padding:"24px 16px 60px"}}>
        {/* Tabs */}
        <div style={{display:"flex",gap:3,marginBottom:24,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,width:"fit-content"}}>
          {[{id:"overview",l:"📊 Overview"},{id:"users",l:"👥 Usuários"},{id:"revenue",l:"💰 Receita"}].map(({id,l})=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?"#1e293b":"transparent",border:tab===id?"1px solid rgba(255,255,255,0.1)":"1px solid transparent",borderRadius:8,padding:"8px 18px",cursor:"pointer",color:tab===id?"#f1f5f9":"#64748b",fontWeight:tab===id?600:400,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
              {[
                {l:"MRR",v:`R$ ${totalMRR.toLocaleString("pt-BR")}`,s:"+18% vs mês anterior",c:"#22c55e",i:"💰"},
                {l:"ARR Projetado",v:`R$ ${totalARR.toLocaleString("pt-BR")}`,s:"Anualização do MRR atual",c:"#6366f1",i:"📈"},
                {l:"Usuários Ativos",v:active.length,s:`${churnCount} churned este mês`,c:"#f59e0b",i:"👥"},
                {l:"ARPU",v:`R$ ${arpu}`,s:"Receita média por usuário",c:"#a855f7",i:"🎯"},
              ].map(({l,v,s,c,i})=>(
                <div key={l} style={{background:`${c}0d`,border:`1px solid ${c}30`,borderRadius:14,padding:"18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1.5px",textTransform:"uppercase"}}>{l}</div>
                    <span style={{fontSize:18}}>{i}</span>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:c,marginBottom:4}}>{v}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"20px"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:20}}>Crescimento MRR</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:8,height:140,paddingTop:10}}>
                  {MONTHLY_MRR.map(({m,v},idx)=>(
                    <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <div style={{fontSize:9,color:"#64748b"}}>R${Math.round(v/1000)}k</div>
                      <div style={{width:"100%",borderRadius:"4px 4px 0 0",height:`${(v/maxMRR)*108}px`,background:idx===MONTHLY_MRR.length-1?"linear-gradient(180deg,#6366f1,#a855f7)":"rgba(99,102,241,0.3)",transition:"height 0.5s"}}/>
                      <div style={{fontSize:9,color:"#475569"}}>{m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"20px"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:18}}>Planos Ativos</div>
                {Object.entries(planDist).map(([plan,count])=>(
                  <div key={plan} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:7,height:7,borderRadius:"50%",background:PLAN_COLOR[plan],display:"inline-block"}}/>
                        <span style={{fontSize:12,color:"#94a3b8"}}>{PLAN_LABEL[plan]}</span>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:PLAN_COLOR[plan]}}>{count}</span>
                    </div>
                    <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                      <div style={{height:"100%",width:`${(count/active.length)*100}%`,background:PLAN_COLOR[plan],borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* USERS */}
        {tab==="users"&&(
          <>
            <div style={{marginBottom:14}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome ou email..." style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"11px 14px",color:"#f1f5f9",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
            </div>
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1.8fr 1fr 0.8fr 0.7fr 0.7fr 0.5fr",gap:10,padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.03)"}}>
                {["Usuário","Email","Plano","Tipo","Status","MRR","Evals"].map(h=>(
                  <div key={h} style={{fontSize:9.5,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>
                ))}
              </div>
              {filteredUsers.map(u=>(
                <div key={u.id} style={{display:"grid",gridTemplateColumns:"2fr 1.8fr 1fr 0.8fr 0.7fr 0.7fr 0.5fr",gap:10,padding:"13px 16px",borderBottom:"1px solid rgba(255,255,255,0.035)",alignItems:"center"}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:"#f1f5f9"}}>{u.name}</div></div>
                  <div style={{fontSize:11,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                  <Tag color={PLAN_COLOR[u.plan]}>{PLAN_LABEL[u.plan]}</Tag>
                  <Tag color={u.type==="business"?"#f59e0b":"#a855f7"}>{u.type==="business"?"🏢":"👤"}</Tag>
                  <Tag color={u.status==="active"?"#22c55e":"#ef4444"}>{u.status==="active"?"Ativo":"Churn"}</Tag>
                  <div style={{fontSize:12,fontWeight:600,color:u.mrr>0?"#22c55e":"#475569"}}>{u.mrr>0?`R$${u.mrr}`:"—"}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>{u.evals}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REVENUE */}
        {tab==="revenue"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"20px"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#f1f5f9",marginBottom:18}}>Receita por Plano</div>
              {[{plan:"enterprise",price:990},{plan:"business",price:297},{plan:"pro",price:97},{plan:"free",price:0}].map(({plan,price})=>{
                const count=active.filter(u=>u.plan===plan).length;
                const rev=count*price;
                return(
                  <div key={plan} style={{marginBottom:13}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <Tag color={PLAN_COLOR[plan]}>{PLAN_LABEL[plan]}</Tag>
                        <span style={{fontSize:11,color:"#64748b"}}>{count} usuários</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>R${rev.toLocaleString("pt-BR")}/mês</span>
                    </div>
                    <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                      <div style={{height:"100%",width:totalMRR?`${(rev/totalMRR)*100}%`:"0%",background:PLAN_COLOR[plan],borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {l:"Churn Rate",v:`${Math.round((churnCount/MOCK_USERS.length)*100)}%`,n:"Meta: <5%",c:churnCount>1?"#f97316":"#22c55e"},
                {l:"LTV Médio — Pro",v:"R$ 1.164",n:"R$97 × 12 meses médios",c:"#a855f7"},
                {l:"LTV Médio — Business",v:"R$ 4.158",n:"R$297 × 14 meses médios",c:"#f59e0b"},
                {l:"CAC Estimado",v:"R$ 380",n:"Baseado em aquisição orgânica",c:"#6366f1"},
                {l:"Payback Period",v:"4 meses",n:"CAC ÷ ARPU mensal",c:"#22c55e"},
              ].map(({l,v,n,c})=>(
                <div key={l} style={{background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:12,padding:"13px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1px",textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{n}</div>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:c}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VIRAL SCORE — CRITERIA DATA
// ═══════════════════════════════════════════════════════════════

const SCORE_CRITERIA = {
  video:[
    {id:"hook",     label:"Hook Point (0–3s)",          weight:0.20,icon:"⚡",expert:"Brendan Kane",
     description:"O que acontece nos primeiros 3s que faz o dedo parar?",
     low:"Começa com introdução ou contexto.",mid:"Tem algo interessante, mas não é imediato.",
     high:"Abre com estatística surpreendente, momento inesperado ou promessa irresistível."},
    {id:"story",    label:"Estrutura Narrativa",         weight:0.12,icon:"📖",expert:"McKee · Freytag",
     description:"Tem início claro, conflito/tensão e desfecho satisfatório?",
     low:"Lista de informações. Sem arco narrativo.",mid:"Tem começo e fim, mas o conflito é fraco.",
     high:"Gancho → jornada → virada → takeaway. Prende do início ao fim."},
    {id:"emotion",  label:"Gatilho Emocional",           weight:0.12,icon:"❤️‍🔥",expert:"Jonah Berger · STEPPS",
     description:"Provoca emoção forte? (risos, surpresa, inspiração, indignação)",
     low:"Neutro, informativo. Sem reação emocional.",mid:"Gera alguma resposta, mas não é intensa.",
     high:"Faz rir, surpreender, arrepiar ou indignar. Emoção visceral."},
    {id:"mass",     label:"Apelo de Massa",              weight:0.10,icon:"🌐",expert:"Brendan Kane",
     description:"Tópico de nicho com ângulo universal?",
     low:"Só faz sentido para quem já é da área.",mid:"Tem algum apelo geral, mas hermético.",
     high:"Assunto técnico com framing que qualquer pessoa quer assistir."},
    {id:"share",    label:"Impulso de Compartilhamento", weight:0.10,icon:"🔁",expert:"Jonah Berger",
     description:"Tem um momento que faz pensar: 'preciso mandar pra fulano'?",
     low:"Nada compartilhável.",mid:"Tem valor informativo, mas sem impulso.",
     high:"Virada ou dado que faz querer tagar alguém."},
    {id:"retention",label:"Retenção Estimada",           weight:0.10,icon:"⏱️",expert:"YouTube · TikTok FYP",
     description:"O ritmo sustenta o watch time até o final?",
     low:"Lento, pausas longas, sem progressão.",mid:"Mantém atenção até o meio.",
     high:"Ritmo constante sem queda de tensão. Espectador fica até o fim."},
    {id:"ctr",      label:"Força do CTR Visual",         weight:0.08,icon:"🖼️",expert:"MrBeast thumbnail",
     description:"Thumbnail + título são clicáveis? Geram curiosidade ou FOMO?",
     low:"Capa genérica. Título descritivo sem gancho.",mid:"Capa ok, mas promessa previsível.",
     high:"Para o scroll. Título abre loop que só fecha assistindo."},
    {id:"format",   label:"Formato Validado",            weight:0.08,icon:"🧩",expert:"Brendan Kane",
     description:"Usa formato com histórico de performance?",
     low:"Genérico. Sem estrutura reconhecível.",mid:"Formato razoável sem execução consistente.",
     high:"Formato testado e replicável com identidade de estilo."},
    {id:"timing",   label:"Timing & Relevância",         weight:0.05,icon:"📅",expert:"TikTok Trends",
     description:"Aproveita tendência ou pauta quente?",
     low:"Sem relação com nada atual.",mid:"Tangencia uma tendência, mas não forte.",
     high:"Encaixa perfeitamente num momento quente."},
    {id:"auth",     label:"Autenticidade",               weight:0.05,icon:"🎯",expert:"Edelman Trust",
     description:"Parece real, humano e confiável? Ou parece propaganda?",
     low:"Polido demais, corporativo. Cara de anúncio.",mid:"Equilibrado, mas falta personalidade.",
     high:"Raw, genuíno, com personalidade marcante."},
  ],
  static:[
    {id:"scroll_stop",   label:"Parada de Scroll Visual",  weight:0.22,icon:"🛑",expert:"Instagram · Thumb-Stop Rate",
     description:"A imagem para o polegar em menos de 0,3s?",
     low:"Visual genérico. Não se diferencia do feed.",mid:"Algo visual interessante, mas não irresistível.",
     high:"Cor ou elemento tão fora do padrão que para qualquer scroll."},
    {id:"save_value",    label:"Valor de Salvamento",       weight:0.18,icon:"🔖",expert:"Adam Mosseri · Later",
     description:"Alguém vai salvar para usar depois?",
     low:"Consumível e esquecível.",mid:"Algum valor informativo, mas não o suficiente.",
     high:"Tipo: 'preciso guardar isso'. Lista, dado raro, framework."},
    {id:"caption_hook",  label:"Primeira Linha da Legenda", weight:0.15,icon:"✍️",expert:"Eugene Schwartz",
     description:"A primeira linha força o 'ver mais'?",
     low:"Começa com introdução ou contexto. Sem gancho.",mid:"Alguma promessa, mas previsível.",
     high:"Pergunta, tensão ou dado que força clicar 'ver mais'."},
    {id:"emotion",       label:"Gatilho Emocional",         weight:0.12,icon:"❤️‍🔥",expert:"Jonah Berger",
     description:"Provoca emoção? (indignação, inspiração, identificação)",
     low:"Neutro. Informativo puro.",mid:"Gera alguma resposta, mas não intensa.",
     high:"'É EXATAMENTE ISSO.' Identificação imediata."},
    {id:"share_tag",     label:"Impulso de Marcar/Enviar",  weight:0.10,icon:"📤",expert:"Social Currency",
     description:"Faz pensar em alguém específico?",
     low:"Nenhuma razão para marcar ou enviar.",mid:"Pode enviar, mas sem urgência.",
     high:"Identificação tão forte que taga antes de terminar de ler."},
    {id:"message_clarity",label:"Clareza em 2 Segundos",   weight:0.08,icon:"👁️",expert:"Nielsen Norman Group",
     description:"A mensagem principal é absorvida sem esforço em 2s?",
     low:"Confuso, sobrecarregado.",mid:"Dá pra entender com esforço.",
     high:"Uma lida já entrega o valor. Zero atrito cognitivo."},
    {id:"comment_trigger",label:"Gatilho de Comentário",   weight:0.07,icon:"💬",expert:"Instagram Algorithm",
     description:"Provoca debate nos comentários?",
     low:"Sem abertura para comentar.",mid:"Pode gerar alguns, mas sem impulso.",
     high:"Abre pergunta ou contradiz algo popular."},
    {id:"visual_identity",label:"Identidade Visual",       weight:0.05,icon:"🎨",expert:"Marty Neumeier",
     description:"Dá pra saber de quem é antes de ler o nome?",
     low:"Sem identidade. Poderia ser de qualquer conta.",mid:"Alguma consistência, mas não marcante.",
     high:"Inconfundível. Cor ou layout que já é uma assinatura."},
    {id:"caption_depth", label:"Profundidade da Legenda",  weight:0.02,icon:"📝",expert:"Content Marketing",
     description:"A legenda entrega valor que a imagem não entrega?",
     low:"Legenda genérica. Não agrega nada.",mid:"Relevante mas repete a imagem.",
     high:"A imagem para o scroll. A legenda faz ficar."},
    {id:"timing",        label:"Timing & Relevância",      weight:0.01,icon:"📅",expert:"Moment Marketing",
     description:"Aproveita um momento, data ou tendência atual?",
     low:"Sem relação com nada atual.",mid:"Tangencia tendência, mas não forte.",
     high:"Zeitgeist na veia."},
  ],
  carousel:[
    {id:"capa",        label:"Capa Irresistível (Slide 1)",     weight:0.20,icon:"🎯",expert:"Adam Mosseri · Later",
     description:"O primeiro slide para o scroll E cria promessa que só resolve deslizando?",
     low:"Capa genérica. Sem tensão.",mid:"Visual ok, mas a promessa não é forte.",
     high:"A capa entrega gancho visual E textual: 'eu preciso ver o próximo'."},
    {id:"swipe_pull",  label:"Tração de Passagem (Swipe Pull)",  weight:0.18,icon:"👆",expert:"Carousel Engagement Studies",
     description:"Cada slide tem razão para ir ao próximo?",
     low:"Slides autocontidos. Para no slide 2 ou 3.",mid:"Alguma progressão, mas tração cai no meio.",
     high:"Cada slide abre micro-promessa que fecha no próximo."},
    {id:"progressao",  label:"Progressão Narrativa",             weight:0.15,icon:"📈",expert:"StoryBrand · Donald Miller",
     description:"O carrossel tem início, meio e fim? A informação cresce?",
     low:"Informações aleatórias sem ordem lógica.",mid:"Tem sequência, mas sem clímax.",
     high:"Cada slide constrói sobre o anterior. Tem pico e desfecho satisfatório."},
    {id:"valor_slide", label:"Valor por Slide",                  weight:0.12,icon:"💎",expert:"Content Density Studies",
     description:"Cada slide entrega valor próprio?",
     low:"Slides vazios, repetitivos.",mid:"Alguns bons, outros de enchimento.",
     high:"Cada slide pode ser screenshottado e compartilhado sozinho."},
    {id:"save_share",  label:"Save Rate Estimado",               weight:0.12,icon:"🔖",expert:"Creator IQ Data",
     description:"O conjunto tem valor de referência para salvar?",
     low:"Consumível e esquecível.",mid:"Algum valor, mas não suficiente.",
     high:"Um 'guia' ou 'checklist' que se salva e reenvia."},
    {id:"ultimo_slide",label:"Último Slide / CTA",               weight:0.08,icon:"🏁",expert:"CRO · CTA Copywriting",
     description:"O último slide tem CTA claro ou fecha com impacto?",
     low:"Termina sem conclusão ou CTA.",mid:"Tem algo, mas é genérico.",
     high:"CTA específico e coerente com a jornada do carrossel."},
    {id:"loop_efeito", label:"Efeito Loop (Último → Primeiro)",  weight:0.05,icon:"🔄",expert:"Instagram Loop Hack",
     description:"O último slide conecta de volta ao primeiro?",
     low:"Nenhuma conexão.",mid:"Tem alguma continuidade, mas não intencional.",
     high:"O último referencia o primeiro. Força rever do início."},
    {id:"visual_coh",  label:"Coesão Visual entre Slides",       weight:0.05,icon:"🎨",expert:"Brand Design",
     description:"Os slides têm identidade visual consistente?",
     low:"Estilos diferentes, fontes misturadas.",mid:"Alguma consistência mas com variações.",
     high:"Identidade limpa. Parece produto editorial profissional."},
    {id:"caption_car", label:"Legenda da Capa",                  weight:0.03,icon:"✍️",expert:"Hook Point",
     description:"A legenda reforça o gancho da capa?",
     low:"Legenda genérica.",mid:"Tem relação, mas não amplia o interesse.",
     high:"Expande a tensão da capa e torna o conjunto irresistível."},
    {id:"tamanho",     label:"Tamanho Ideal (Nº de Slides)",     weight:0.02,icon:"📏",expert:"Later · Buffer 2024",
     description:"Número de slides na faixa de maior retenção? (7–15 ideal)",
     low:"Menos de 4 ou mais de 20.",mid:"Entre 5–6 ou 16–19 slides.",
     high:"Entre 7–15 slides. Maior completion e save rate."},
  ],
  ad:[
    {id:"pattern",    label:"Pattern Interrupt",                  weight:0.20,icon:"🚨",expert:"Meta Blueprint · Jon Loomer",
     description:"Quebra o padrão visual do feed em menos de 1 segundo?",
     low:"Claramente um anúncio. Banner blindness imediato.",mid:"Algo diferente, mas não disruptivo.",
     high:"Indistinguível de conteúdo orgânico ou visualmente único."},
    {id:"hook_ad",    label:"Hook (0–3s ou Frame 1)",             weight:0.18,icon:"⚡",expert:"Harmon Brothers · Brendan Kane",
     description:"O primeiro frame entrega a proposta de forma irresistível?",
     low:"Começa com logo ou contexto. Nenhum motivo para continuar.",mid:"Tem gancho, mas não urgente.",
     high:"Problema ultra-específico do ICP em menos de 3 segundos."},
    {id:"icp",        label:"Relevância para o ICP",              weight:0.15,icon:"🎯",expert:"Eugene Schwartz",
     description:"Fala com a pessoa certa, no nível certo de consciência?",
     low:"Mensagem genérica. Poderia ser para qualquer pessoa.",mid:"Alguma especificidade, mas não cirúrgico.",
     high:"'É como se soubessem exatamente o meu problema.'"},
    {id:"oferta",     label:"Clareza da Oferta",                  weight:0.12,icon:"💡",expert:"David Ogilvy · Direct Response",
     description:"Em um olhar está claro O QUÊ é oferecido e PARA QUEM?",
     low:"Mensagem confusa. Não dá pra entender a oferta.",mid:"Dá pra entender com esforço.",
     high:"Oferta cristalina em menos de 3 segundos."},
    {id:"prova",      label:"Prova Social / Credibilidade",       weight:0.10,icon:"⭐",expert:"Robert Cialdini",
     description:"Tem prova social, resultado, número ou autoridade?",
     low:"Nenhum elemento de credibilidade.",mid:"Tem alguma prova, mas fraca.",
     high:"Número concreto, depoimento real ou dado de mercado validado."},
    {id:"cta_ad",     label:"CTA (Call to Action)",               weight:0.08,icon:"🔘",expert:"ConversionXL · CRO",
     description:"O CTA é claro, específico e coerente com a temperatura da audiência?",
     low:"Sem CTA ou CTA genérico ('saiba mais').",mid:"CTA existe mas não alinhado com a jornada.",
     high:"CTA específico, sem atrito, na medida certa."},
    {id:"urgencia",   label:"Urgência / Escassez Real",           weight:0.06,icon:"⏰",expert:"Robert Cialdini",
     description:"Tem elemento real de urgência que acelera a decisão?",
     low:"Nenhuma urgência implícita.",mid:"Tem urgência, mas parece artificial.",
     high:"Urgência genuína e específica que acelera o clique."},
    {id:"visual_ad",  label:"Qualidade Visual / Produção",        weight:0.05,icon:"🎬",expert:"Meta Creative Research",
     description:"O visual está no nível certo da audiência?",
     low:"Abaixo do nível mínimo de credibilidade.",mid:"Visual ok, mas não diferencia.",
     high:"Visual que, sozinho, eleva a percepção de valor."},
    {id:"congruencia",label:"Congruência Anúncio → Landing",     weight:0.04,icon:"🔗",expert:"Larry Kim · Message Match",
     description:"A mensagem do criativo é idêntica à da landing page?",
     low:"Criativo e landing parecem produtos diferentes.",mid:"Tem relação, mas há quebra de expectativa.",
     high:"Message match perfeito. Quem clica chega onde esperava."},
    {id:"formato_ad", label:"Adequação ao Formato/Plataforma",   weight:0.02,icon:"📱",expert:"Meta Blueprint",
     description:"Feito para o formato? (vertical, legível sem som)",
     low:"Horizontal em plataforma vertical, depende 100% do áudio.",mid:"Adequado, mas não otimizado.",
     high:"Nativo ao formato. Vertical, legível sem som."},
  ],
};

const SCORE_INSIGHTS = {
  video:{color:"#a855f7",title:"Lógica do Vídeo",text:"O algoritmo distribui baseado em retenção. O Hook vale 20% porque sem ele nenhum outro critério importa. A primeira hora determina 80% do potencial de distribuição."},
  static:{color:"#06b6d4",title:"Lógica do Post Estático",text:"Salvamento e Compartilhamento pesam mais que curtida. Um post salvo vale ~3× mais que uma curtida no algoritmo do Instagram."},
  carousel:{color:"#f59e0b",title:"Lógica do Carrossel",text:"O algoritmo mede o tempo gasto no post. Carrosséis têm 3× mais saves e 2× mais alcance que posts estáticos. O segredo: cada slide deve criar a necessidade de ver o próximo."},
  ad:{color:"#ef4444",title:"Lógica do Anúncio",text:"O criativo é responsável por até 70% do resultado da campanha. Pattern interrupt é o critério #1. O segundo é o message match: anúncio e landing precisam contar a mesma história."},
};

const getLevel=(s)=>{
  if(s>=90)return{label:"🔥 VIRAL MACHINE",  color:"#FF4500",bg:"rgba(255,69,0,0.13)"};
  if(s>=75)return{label:"🟢 ALTO POTENCIAL", color:"#22c55e",bg:"rgba(34,197,94,0.10)"};
  if(s>=60)return{label:"🟡 MODERADO",       color:"#eab308",bg:"rgba(234,179,8,0.10)"};
  if(s>=40)return{label:"⚠️ PRECISA AJUSTES",color:"#f97316",bg:"rgba(249,115,22,0.10)"};
  return         {label:"❌ SEM POTENCIAL",  color:"#ef4444",bg:"rgba(239,68,68,0.08)"};
};
const calcScore=(criteria,scores)=>Math.round(criteria.reduce((s,c)=>s+(scores[c.id]||5)*c.weight*10,0));
const initScores=(criteria)=>Object.fromEntries(criteria.map(c=>[c.id,5]));
const barColor=(v)=>v>=8?"#FF4500":v>=6?"#eab308":v>=4?"#6366f1":"#475569";

// ═══════════════════════════════════════════════════════════════
// SCREEN: VIRAL SCORE (Avaliação de Conteúdo)
// ═══════════════════════════════════════════════════════════════

function ViralScore({go,fmt}) {
  const criteria = SCORE_CRITERIA[fmt]||SCORE_CRITERIA.video;
  const fmtCfg   = FORMATS.find(f=>f.id===fmt)||FORMATS[0];
  const [scores,setScores]=useState(()=>initScores(criteria));
  const [title,setTitle]=useState("");
  const [diag,setDiag]=useState(null);
  const [loading,setLoading]=useState(false);
  const [animated,setAnimated]=useState(0);

  const finalScore=calcScore(criteria,scores);
  const level=getLevel(finalScore);
  const insight=SCORE_INSIGHTS[fmt];
  const topC=[...criteria].sort((a,b)=>scores[b.id]-scores[a.id]).slice(0,3);
  const weakC=[...criteria].sort((a,b)=>scores[a.id]-scores[b.id]).slice(0,3);

  useEffect(()=>{
    let v=animated;const end=finalScore;if(v===end)return;
    const step=end>v?1:-1;
    const t=setInterval(()=>{v+=step;setAnimated(v);if(v===end)clearInterval(t);},12);
    return()=>clearInterval(t);
  },[finalScore]);

  const handleAI=async()=>{
    setLoading(true);
    const weakLabels=weakC.map(c=>`${c.label} (${scores[c.id]}/10)`).join(", ");
    const txt=await(async()=>{
      try{
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Você é um especialista em conteúdo viral. Retorne APENAS JSON válido, sem markdown.",messages:[{role:"user",content:`Formato: ${fmtCfg.label}. Conteúdo: "${title||"sem título"}". Score: ${finalScore}/100. Pontos fracos: ${weakLabels}. Retorne JSON: {"diagnostico":"2 frases sobre o estado geral","acoes":["ação específica 1","ação específica 2","ação específica 3"],"reescrever":"1 sugestão de reescrita do maior ponto fraco","potencial":"frase curta sobre o potencial se melhorar"}`}]})});
        const d=await r.json();return(d.content?.map(b=>b.text).join("")||"").replace(/```json|```/g,"").trim();
      }catch{return null;}
    })();
    try{setDiag(JSON.parse(txt||""));}
    catch{setDiag({diagnostico:`Este ${fmtCfg.label.toLowerCase()} está com nota ${finalScore}/100. ${finalScore>=75?"Bom potencial com ajustes pontuais.":"Precisa de rework nos critérios críticos antes de publicar."}`,acoes:[`Melhorar ${weakC[0]?.label}: foque em ${weakC[0]?.high||"aumentar a nota deste critério"}`,`Ajustar ${weakC[1]?.label}: ${weakC[1]?.high||"trabalhe este ponto"}`,`Revisar ${weakC[2]?.label}: ${weakC[2]?.high||"este critério precisa atenção"}`],reescrever:"Reescreva o gancho principal focando em especificidade e urgência para o público-alvo.",potencial:`Com os ajustes, este conteúdo pode atingir ${Math.min(finalScore+18,97)}/100 e dobrar o alcance orgânico.`});}
    setLoading(false);
  };

  return (
    <Wrap back={()=>go("format-eval")} title={`${fmtCfg.icon} Avaliar ${fmtCfg.label}`} sub="Avalie seu conteúdo em cada critério para obter o Viral Score e um diagnóstico personalizado.">

      {/* Title input */}
      <input type="text" placeholder={`Descreva o ${fmtCfg.label.toLowerCase()} que está avaliando...`} value={title} onChange={e=>setTitle(e.target.value)}
        style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 14px",color:"#f1f5f9",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",marginBottom:14}}/>

      {/* Score display */}
      <div style={{background:level.bg,border:`1.5px solid ${level.color}44`,borderRadius:16,padding:"20px 18px",marginBottom:14,textAlign:"center"}}>
        <Tag color={fmtCfg.color}>{fmtCfg.icon} {fmtCfg.label}</Tag>
        {title&&<div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#f1f5f9",margin:"8px 0 4px"}}>"{title}"</div>}
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(52px,12vw,76px)",color:level.color,lineHeight:1,textShadow:`0 0 32px ${level.color}55`,margin:"4px 0"}}>
          {animated}
        </div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:level.color}}>{level.label}</div>
        <div style={{marginTop:12,height:5,background:"rgba(255,255,255,0.07)",borderRadius:6,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${animated}%`,background:`linear-gradient(90deg,${level.color}77,${level.color})`,borderRadius:6,transition:"width 0.1s"}}/>
        </div>
      </div>

      {/* Insight banner */}
      <div style={{background:`${insight.color}0d`,border:`1px solid ${insight.color}28`,borderRadius:11,padding:"12px 14px",marginBottom:16,display:"flex",gap:10}}>
        <span style={{fontSize:16,flexShrink:0}}>💡</span>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:insight.color,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>{insight.title}</div>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{insight.text}</div>
        </div>
      </div>

      {/* Criteria sliders */}
      <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>
        Critérios de Avaliação
      </div>
      {criteria.map(c=>{
        const v=scores[c.id]||5;
        const desc=v>=7?c.high:v>=4?c.mid:c.low;
        const sc=v>=7?"#22c55e":v>=4?"#eab308":"#ef4444";
        const bc=barColor(v);
        return(
          <div key={c.id} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 15px",marginBottom:7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:15}}>{c.icon}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#f1f5f9"}}>{c.label}</span>
                  <span style={{fontSize:9,padding:"2px 5px",borderRadius:20,background:"rgba(255,255,255,0.07)",color:"#94a3b8",fontFamily:"monospace"}}>{Math.round(c.weight*100)}%</span>
                </div>
                <div style={{fontSize:10.5,color:"#64748b"}}>↳ {c.expert} · {c.description}</div>
              </div>
              <div style={{minWidth:40,height:40,borderRadius:"50%",background:`conic-gradient(${bc} ${v*10}%,rgba(255,255,255,0.06) 0%)`,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:10,flexShrink:0}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:bc}}>{v}</div>
              </div>
            </div>
            <input type="range" min={0} max={10} value={v} onChange={e=>setScores(p=>({...p,[c.id]:Number(e.target.value)}))}
              style={{width:"100%",height:4,borderRadius:4,WebkitAppearance:"none",cursor:"pointer",background:`linear-gradient(to right,${bc} ${v*10}%,rgba(255,255,255,0.1) ${v*10}%)`,outline:"none",marginTop:8,marginBottom:5}}/>
            <div style={{fontSize:11,color:sc,fontStyle:"italic",borderLeft:`2px solid ${sc}44`,paddingLeft:8}}>{desc}</div>
          </div>
        );
      })}

      {/* Strengths & Weaknesses */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16,marginBottom:16}}>
        {[{label:"✅ Pontos Fortes",items:topC,c:"#22c55e"},{label:"🔧 A Melhorar",items:weakC,c:"#ef4444"}].map(({label,items,c})=>(
          <div key={label} style={{background:`${c}08`,border:`1px solid ${c}20`,borderRadius:12,padding:14}}>
            <div style={{fontSize:10,fontWeight:700,color:c,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>{label}</div>
            {items.map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                <span style={{fontSize:13}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#f1f5f9"}}>{item.label}</div>
                  <div style={{fontSize:10,color:c}}>{scores[item.id]||5}/10</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Radar bar chart */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:14,marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>Radar de Desempenho</div>
        {criteria.map(c=>{
          const v=scores[c.id]||5;
          const pts=Math.round(v*c.weight*10);
          const max=Math.round(c.weight*100);
          return(
            <div key={c.id} style={{marginBottom:5,display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:10,minWidth:16}}>{c.icon}</span>
              <div style={{fontSize:9.5,color:"#64748b",minWidth:130,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.label}</div>
              <div style={{flex:1,height:4,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${v*10}%`,background:barColor(v),borderRadius:3,transition:"width 0.3s"}}/>
              </div>
              <span style={{fontSize:9.5,fontFamily:"monospace",color:barColor(v),minWidth:42,textAlign:"right"}}>{pts}/{max}pts</span>
            </div>
          );
        })}
      </div>

      {/* AI Diagnosis CTA */}
      {!diag&&(
        <Btn onClick={handleAI} disabled={loading} full color={fmtCfg.color}>
          {loading?"🧠 Analisando com IA...":"🧠 Gerar Diagnóstico Personalizado com IA"}
        </Btn>
      )}

      {/* AI Diagnosis Result */}
      {diag&&(
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"20px",marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6366f1",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>🧠 Diagnóstico IA</div>
          <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7,marginBottom:14,borderLeft:"2px solid #6366f144",paddingLeft:12}}>{diag.diagnostico}</div>
          <div style={{fontSize:10,fontWeight:700,color:"#f59e0b",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>⚡ 3 Ações Prioritárias</div>
          {diag.acoes?.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <span style={{background:"#f59e0b22",color:"#f59e0b",borderRadius:"50%",minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
              <span style={{fontSize:12,color:"#94a3b8",lineHeight:1.55}}>{a}</span>
            </div>
          ))}
          {diag.reescrever&&(
            <div style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:9,padding:"11px 13px",marginTop:12,marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#a855f7",letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>✏️ Sugestão de Reescrita</div>
              <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{diag.reescrever}</div>
            </div>
          )}
          {diag.potencial&&(
            <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:9,padding:"10px 13px"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#22c55e"}}>🚀 Potencial: </span>
              <span style={{fontSize:12,color:"#94a3b8"}}>{diag.potencial}</span>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Btn onClick={()=>go("format-select")} color="#6366f1" small>✨ Criar versão melhorada</Btn>
            <Btn onClick={()=>go("dashboard")} outline color="#6366f1" small>← Dashboard</Btn>
          </div>
        </div>
      )}

      <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:white;cursor:pointer}input[type=range]::-moz-range-thumb{width:13px;height:13px;border:none;border-radius:50%;background:white;cursor:pointer}`}</style>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [screen,setScreen]=useState("welcome");
  const [adminMode,setAdminMode]=useState(false);

  // User state
  const [u,setU]=useState({name:"",accountType:"",toneOfVoice:"",audience:"",technicalSkill:"",context:"",macroThemes:["","","","",""],sellsProducts:false,productsServices:""});
  const [research,setResearch]=useState(null);

  // Content creation state
  const [fmt,setFmt]=useState("video");
  const [theme,setTheme]=useState("");
  const [funnel,setFunnel]=useState("");
  const [titles,setTitles]=useState([]);
  const [selTitle,setSelTitle]=useState("");

  // Video production state
  const [voiceMode,setVoiceMode]=useState("");
  const [selVoice,setSelVoice]=useState(null);
  const [avatarMode,setAvatarMode]=useState("");
  const [selAvatar,setSelAvatar]=useState(null);

  const go=(s)=>{ setScreen(s); if(typeof window!=="undefined")window.scrollTo(0,0); };

  const props={go,u,setU,research,setResearch,fmt,setFmt,theme,setTheme,funnel,setFunnel,titles,setTitles,selTitle,setSelTitle,voiceMode,setVoiceMode,selVoice,setSelVoice,avatarMode,setAvatarMode,selAvatar,setSelAvatar,setAdminMode};

  const SCREENS={
    welcome:       <Welcome go={go} setAdminMode={setAdminMode}/>,
    register:      <Register go={go} setU={setU}/>,
    ob1:           <OB1 go={go} u={u} setU={setU}/>,
    ob2:           <OB2 go={go} u={u} setU={setU}/>,
    ob3:           <OB3 go={go} u={u} setU={setU}/>,
    ob4:           <OB4 go={go} u={u} setU={setU}/>,
    research:      <Research go={go} u={u} setResearch={setResearch}/>,
    dashboard:     <Dashboard go={go} u={u} research={research}/>,
    "format-eval": <FormatSelect go={go} setFmt={setFmt} mode="eval"/>,
    "format-select":<FormatSelect go={go} setFmt={setFmt} mode="create"/>,
    "fmt-examples":<FmtExamples go={go} fmt={fmt}/>,
    "content-theme":<ContentTheme go={go} fmt={fmt} theme={theme} setTheme={setTheme} funnel={funnel} setFunnel={setFunnel}/>,
    titles:        <Titles go={go} fmt={fmt} theme={theme} funnel={funnel} u={u} titles={titles} setTitles={setTitles} selTitle={selTitle} setSelTitle={setSelTitle}/>,
    production:    <Production go={go} fmt={fmt} selTitle={selTitle} theme={theme} funnel={funnel} u={u}/>,
    "video-voice": <VideoVoice go={go} voiceMode={voiceMode} setVoiceMode={setVoiceMode} selVoice={selVoice} setSelVoice={setSelVoice}/>,
    "video-avatar":<VideoAvatar go={go} avatarMode={avatarMode} setAvatarMode={setAvatarMode} selAvatar={selAvatar} setSelAvatar={setSelAvatar}/>,
    "video-generate":<VideoGenerate go={go}/>,
    score:         <ViralScore go={go} fmt={fmt}/>,
    admin:         <Admin go={go}/>,
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#070d1a",minHeight:"100vh",color:"#e2e8f0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        select option{background:#0f172a}
        textarea,input,select,button{font-family:'DM Sans',sans-serif!important}
      `}</style>
      {SCREENS[screen]||SCREENS.welcome}
    </div>
  );
}
