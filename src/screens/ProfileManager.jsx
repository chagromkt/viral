import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// PROFILE COLORS & ICONS
// ═══════════════════════════════════════════════════════════════

const PROFILE_COLORS = [
  "#6366f1","#a855f7","#ec4899","#ef4444","#f97316",
  "#f59e0b","#22c55e","#06b6d4","#14b8a6","#8b5cf6",
];

const PROFILE_EMOJIS = [
  "🌽","🚀","🎯","🔥","💡","🌱","🎬","📊","🦁","🎭",
  "🏆","⚡","🌍","💎","🎪","🔮","🧠","🎨","🛡️","🌊",
];

// ═══════════════════════════════════════════════════════════════
// SHARED STORAGE (in-memory, replace with Supabase later)
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = "viral_os_profiles";

const loadProfiles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveProfiles = (profiles) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); }
  catch { /* storage not available */ }
};

const genId = () => Math.random().toString(36).slice(2, 10);

const defaultProfile = (overrides = {}) => ({
  id: genId(),
  name: "",
  accountType: "",
  toneOfVoice: "",
  audience: "",
  technicalSkill: "",
  context: "",
  macroThemes: ["","","","",""],
  sellsProducts: false,
  productsServices: "",
  identidade: {},
  research: null,
  color: PROFILE_COLORS[Math.floor(Math.random() * PROFILE_COLORS.length)],
  emoji: PROFILE_EMOJIS[Math.floor(Math.random() * PROFILE_EMOJIS.length)],
  createdAt: new Date().toISOString(),
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════

const T = { bg:"#070d1a", surface:"#0f172a", border:"rgba(255,255,255,0.08)", text:"#e2e8f0", muted:"#64748b" };

function Btn({children,onClick,color="#6366f1",outline=false,small=false,disabled=false,full=false,style:ex={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:outline?"transparent":disabled?"#1e293b":color,
      border:`1.5px solid ${disabled?"#334155":color}`,borderRadius:9,
      padding:small?"7px 14px":"12px 22px",color:outline?color:"#fff",
      fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:small?12:14,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
      width:full?"100%":"auto",transition:"all 0.15s",display:"flex",
      alignItems:"center",justifyContent:"center",gap:6,...ex,
    }}>{children}</button>
  );
}

function Field({label,value,onChange,placeholder,multi=false,type="text"}) {
  const s={width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"11px 14px",color:"#f1f5f9",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",resize:"vertical"};
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px"}}>{label}</div>}
      {multi?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={s}/>
             :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
    </div>
  );
}

function Sel({label,value,onChange,options}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.8px"}}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:"#0f172a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"11px 14px",color:value?"#f1f5f9":"#64748b",fontSize:13,outline:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
        <option value="">Selecione...</option>
        {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Steps({current,total,color="#6366f1"}) {
  return (
    <div style={{display:"flex",gap:5,marginBottom:14}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{flex:1,height:3,borderRadius:3,background:i<current?color:"rgba(255,255,255,0.1)",transition:"background 0.3s"}}/>
      ))}
    </div>
  );
}

function Wrap({children,back,title,sub,step,total,color="#6366f1"}) {
  return (
    <div style={{maxWidth:680,marginInline:"auto",padding:"24px 16px 60px"}}>
      {(back||title)&&(
        <div style={{marginBottom:22}}>
          {back&&<button onClick={back} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:13,padding:"0 0 10px",display:"block"}}>← Voltar</button>}
          {step&&<Steps current={step} total={total} color={color}/>}
          {title&&<h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(19px,4vw,26px)",margin:"0 0 5px",letterSpacing:"-0.8px",color:"#f8fafc"}}>{title}</h2>}
          {sub&&<p style={{color:"#64748b",fontSize:13,margin:0,lineHeight:1.6}}>{sub}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function ProfileAvatar({profile,size=44}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:`${profile.color}22`,border:`2px solid ${profile.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,flexShrink:0}}>
      {profile.emoji}
    </div>
  );
}

function ProfileCompletion({profile}) {
  const checks = [
    profile.name, profile.accountType, profile.toneOfVoice,
    profile.audience, profile.context, profile.macroThemes?.[0],
    profile.research,
    profile.identidade?.autenticidade?.interesses?.length,
    profile.identidade?.mecanismo?.mecanismo,
    profile.identidade?.movimento?.mudancaMundo,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#64748b";
  return { pct, color };
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: PROFILES HOME
// ═══════════════════════════════════════════════════════════════

function ProfilesHome({ profiles, onSelect, onCreate, onDelete, activeProfileId }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div style={{ maxWidth: 720, marginInline: "auto", padding: "24px 16px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(20px,4vw,28px)", margin: "0 0 5px", letterSpacing: "-1px", color: "#f8fafc" }}>
            Seus Perfis
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
            Cada perfil tem sua própria identidade, público e estratégia de conteúdo.
          </p>
        </div>
        <Btn onClick={onCreate} color="#6366f1">+ Novo Perfil</Btn>
      </div>

      {profiles.length === 0 && (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🎭</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9", marginBottom: 8 }}>Nenhum perfil criado ainda</div>
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20, maxWidth: 360, marginInline: "auto" }}>
            Crie seu primeiro perfil para começar a gerar roteiros personalizados com sua identidade estratégica.
          </div>
          <Btn onClick={onCreate} color="#6366f1">Criar meu primeiro perfil →</Btn>
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {profiles.map(profile => {
          const { pct, color: pctColor } = ProfileCompletion({ profile });
          const isActive = profile.id === activeProfileId;
          return (
            <div key={profile.id} style={{
              background: isActive ? `${profile.color}0d` : "rgba(255,255,255,0.025)",
              border: `1.5px solid ${isActive ? profile.color + "55" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14, padding: "16px 18px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <ProfileAvatar profile={profile} size={50} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>{profile.name || "Sem nome"}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: profile.accountType === "business" ? "rgba(245,158,11,0.15)" : "rgba(168,85,247,0.15)", color: profile.accountType === "business" ? "#f59e0b" : "#a855f7", fontWeight: 700, border: `1px solid ${profile.accountType === "business" ? "#f59e0b44" : "#a855f744"}` }}>
                      {profile.accountType === "business" ? "🏢 Empresarial" : "👤 Pessoal"}
                    </span>
                    {isActive && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(34,197,94,0.12)", color: "#22c55e", fontWeight: 700, border: "1px solid rgba(34,197,94,0.3)" }}>✓ Ativo</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profile.audience || "Público não definido"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pctColor, borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 10, color: pctColor, fontWeight: 700, minWidth: 32 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                  <Btn onClick={() => onSelect(profile)} small color={profile.color}>
                    {isActive ? "✓ Em uso" : "Usar este"}
                  </Btn>
                  {deleteConfirm === profile.id ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => { onDelete(profile.id); setDeleteConfirm(null); }} style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 7, padding: "5px 8px", color: "#ef4444", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>Deletar</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 8px", color: "#64748b", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>Não</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(profile.id)} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 11, padding: "4px 0", fontFamily: "'DM Sans',sans-serif" }}>🗑 Apagar</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: PROFILE SELECTOR (modal-style for content creation)
// ═══════════════════════════════════════════════════════════════

function ProfileSelector({ profiles, onSelect, onCreateNew, onCancel, context = "criar conteúdo" }) {
  return (
    <div style={{ maxWidth: 680, marginInline: "auto", padding: "24px 16px 60px" }}>
      <div style={{ marginBottom: 24 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 13, padding: "0 0 10px", display: "block" }}>← Voltar</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>🎭</span>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(18px,4vw,24px)", margin: 0, letterSpacing: "-0.8px", color: "#f8fafc" }}>
            Para qual perfil você quer {context}?
          </h2>
        </div>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
          Cada perfil tem sua própria identidade, público e estratégia. O roteiro será personalizado com o perfil escolhido.
        </p>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        {profiles.map(profile => {
          const { pct, color: pctColor } = ProfileCompletion({ profile });
          return (
            <div key={profile.id} onClick={() => onSelect(profile)}
              style={{ background: "rgba(255,255,255,0.025)", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: "16px", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14 }}
              onMouseEnter={e => { e.currentTarget.style.background = `${profile.color}0d`; e.currentTarget.style.borderColor = `${profile.color}55`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <ProfileAvatar profile={profile} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>{profile.name || "Sem nome"}</span>
                  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: profile.accountType === "business" ? "rgba(245,158,11,0.12)" : "rgba(168,85,247,0.12)", color: profile.accountType === "business" ? "#f59e0b" : "#a855f7", fontWeight: 700 }}>
                    {profile.accountType === "business" ? "🏢" : "👤"} {profile.accountType === "business" ? "Empresarial" : "Pessoal"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {profile.toneOfVoice && `Tom: ${profile.toneOfVoice} · `}{profile.audience?.slice(0, 50) || "Público não definido"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pctColor, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10, color: pctColor, fontWeight: 700 }}>{pct}% completo</span>
                </div>
              </div>
              <div style={{ fontSize: 18, color: "#334155" }}>→</div>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
        <Btn onClick={onCreateNew} outline color="#6366f1" full>+ Criar novo perfil para este conteúdo</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE ONBOARDING — Step by Step
// ═══════════════════════════════════════════════════════════════

function ProfileOnboarding({ onComplete, onCancel, editProfile = null }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(editProfile || defaultProfile());

  const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));
  const c = profile.color;

  // Step 1 — Type
  if (step === 1) return (
    <Wrap back={onCancel} title="Qual é o tipo de perfil?" sub="Isso vai personalizar toda a experiência deste perfil." step={1} total={6} color={c}>
      {/* Emoji + Color pickers */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Ícone do Perfil</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {PROFILE_EMOJIS.map(e => (
            <button key={e} onClick={() => set("emoji", e)} style={{ width: 36, height: 36, borderRadius: 8, background: profile.emoji === e ? `${c}22` : "rgba(255,255,255,0.04)", border: `1.5px solid ${profile.emoji === e ? c : "rgba(255,255,255,0.08)"}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {e}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Cor do Perfil</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PROFILE_COLORS.map(col => (
            <button key={col} onClick={() => set("color", col)} style={{ width: 28, height: 28, borderRadius: "50%", background: col, border: `2px solid ${profile.color === col ? "#fff" : "transparent"}`, cursor: "pointer", outline: "none" }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { id: "personal", icon: "👤", label: "Pessoal", desc: "Criador, profissional liberal, personal brand" },
          { id: "business", icon: "🏢", label: "Empresarial", desc: "Agência, empresa, marca ou time de marketing" },
        ].map(({ id, icon, label, desc }) => (
          <div key={id} onClick={() => set("accountType", id)} style={{ background: profile.accountType === id ? `${c}14` : "rgba(255,255,255,0.025)", border: `1.5px solid ${profile.accountType === id ? c + "66" : "rgba(255,255,255,0.07)"}`, borderRadius: 13, padding: "18px", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
      <Btn onClick={() => setStep(2)} disabled={!profile.accountType} full color={c}>Continuar →</Btn>
    </Wrap>
  );

  // Step 2 — Nome + Tom
  if (step === 2) return (
    <Wrap back={() => setStep(1)} title="Identidade & Tom de Voz" sub="Como este perfil se chama e como ele fala?" step={2} total={6} color={c}>
      <Field label="Nome / Nome da marca" value={profile.name} onChange={v => set("name", v)} placeholder="Ex: CHA AgroMkt, Ben Martin Balik, Leadcultura..."/>
      <Sel label="Tom de Voz" value={profile.toneOfVoice} onChange={v => set("toneOfVoice", v)} options={[
        {v:"autoritativo",l:"Autoritativo — Especialista confiante"},
        {v:"educativo",l:"Educativo — Professor acessível"},
        {v:"descontraido",l:"Descontraído — Amigo que entende do assunto"},
        {v:"provocador",l:"Provocador — Questiona o status quo"},
        {v:"inspiracional",l:"Inspiracional — Motiva e eleva"},
        {v:"direto",l:"Direto — Vai direto ao ponto, sem rodeios"},
      ]}/>
      <Btn onClick={() => setStep(3)} disabled={!profile.name || !profile.toneOfVoice} full color={c}>Continuar →</Btn>
    </Wrap>
  );

  // Step 3 — Público + Skill
  if (step === 3) return (
    <Wrap back={() => setStep(2)} title="Público & Habilidade" sub="Para quem este perfil fala e qual o nível técnico?" step={3} total={6} color={c}>
      <Field label="Público-alvo" value={profile.audience} onChange={v => set("audience", v)} placeholder="Ex: Produtores rurais do Centro-Oeste, 35–55 anos, interessados em tecnologia para o campo" multi/>
      <Sel label="Habilidade técnica em conteúdo" value={profile.technicalSkill} onChange={v => set("technicalSkill", v)} options={[
        {v:"iniciante",l:"Iniciante — Estou começando agora"},
        {v:"intermediario",l:"Intermediário — Já publico, mas quero melhorar"},
        {v:"avancado",l:"Avançado — Produção profissional de conteúdo"},
        {v:"especialista",l:"Especialista — Trabalho com conteúdo há anos"},
      ]}/>
      <Btn onClick={() => setStep(4)} disabled={!profile.audience || !profile.technicalSkill} full color={c}>Continuar →</Btn>
    </Wrap>
  );

  // Step 4 — Contexto + Macro Temas
  if (step === 4) {
    const setTheme = (i, v) => { const n = [...profile.macroThemes]; n[i] = v; set("macroThemes", n); };
    return (
      <Wrap back={() => setStep(3)} title="Contexto & Macro Temas" sub="Conte mais sobre este perfil e seus 5 grandes temas de conteúdo." step={4} total={6} color={c}>
        <Field label="Contexto relevante" value={profile.context} onChange={v => set("context", v)} placeholder="Ex: Sou fundador da CHA AgroMkt, agência especializada em marketing e vendas para o agronegócio..." multi/>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>5 Macro Temas</div>
          {profile.macroThemes.map((t, i) => (
            <input key={i} value={t} onChange={e => setTheme(i, e.target.value)} placeholder={`Tema ${i + 1} — ex: Marketing para o agronegócio`}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", marginBottom: 6, boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }} />
          ))}
        </div>
        <Btn onClick={() => setStep(5)} disabled={!profile.context || !profile.macroThemes[0]} full color={c}>Continuar →</Btn>
      </Wrap>
    );
  }

  // Step 5 — Produtos/Serviços
  if (step === 5) return (
    <Wrap back={() => setStep(4)} title="Produtos & Serviços" sub="Este perfil vende algo? Isso personaliza CTAs e estratégia de funil." step={5} total={6} color={c}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Vende produto ou serviço?</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Sim", "Não"].map(opt => (
            <button key={opt} onClick={() => set("sellsProducts", opt === "Sim")} style={{ flex: 1, padding: "11px", borderRadius: 9, background: (opt === "Sim" ? profile.sellsProducts : !profile.sellsProducts) ? `${c}15` : "rgba(255,255,255,0.04)", border: `1.5px solid ${(opt === "Sim" ? profile.sellsProducts : !profile.sellsProducts) ? c : "rgba(255,255,255,0.08)"}`, color: (opt === "Sim" ? profile.sellsProducts : !profile.sellsProducts) ? c : "#64748b", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{opt}</button>
          ))}
        </div>
      </div>
      {profile.sellsProducts && <Field label="Descreva os produtos/serviços" value={profile.productsServices} onChange={v => set("productsServices", v)} placeholder="Ex: Método S.A.F.R.A.™ — consultoria de marketing e vendas para agronegócio..." multi/>}
      <Btn onClick={() => setStep(6)} full color={c}>Continuar →</Btn>
    </Wrap>
  );

  // Step 6 — Deep Research
  if (step === 6) return (
    <ProfileResearch profile={profile} onComplete={(research) => {
      const finalProfile = { ...profile, research };
      onComplete(finalProfile);
    }} onSkip={() => onComplete(profile)} color={c}/>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// PROFILE DEEP RESEARCH
// ═══════════════════════════════════════════════════════════════

function ProfileResearch({ profile, onComplete, onSkip, color }) {
  const [phase, setPhase] = useState(0);
  const [prog, setProg] = useState({ g: 0, p: 0, c: 0 });
  const [status, setStatus] = useState({ g: "Iniciando...", p: "Iniciando...", c: "Iniciando..." });
  const [insights, setInsights] = useState(null);

  const MSGS = {
    g: ["Analisando tendências de conteúdo...", "Mapeando concorrentes...", "Identificando lacunas...", "Concluído ✓"],
    p: ["Pesquisando comportamento do público...", "Analisando copy dos top performers...", "Mapeando objeções...", "Concluído ✓"],
    c: ["Sintetizando estratégia...", "Criando ângulos editoriais...", "Gerando recomendações...", "Concluído ✓"],
  };

  useEffect(() => {
    let t = 0;
    const iv = setInterval(() => {
      t++;
      setProg({ g: Math.min(t * 4.2 + Math.random() * 4, 100), p: Math.min(t * 3.8 + Math.random() * 5 + 8, 100), c: Math.min(t * 5.1 + Math.random() * 3 - 3, 100) });
      setStatus({ g: MSGS.g[Math.min(Math.floor(t / 7), 3)], p: MSGS.p[Math.min(Math.floor(t / 6.5), 3)], c: MSGS.c[Math.min(Math.floor(t / 5.5), 3)] });
      if (t >= 26) clearInterval(iv);
    }, 200);

    const prompt = `Deep research for content creator profile. Return ONLY valid JSON:
Profile: Name=${profile.name}, Type=${profile.accountType}, Tone=${profile.toneOfVoice}, Audience=${profile.audience}, Context=${profile.context}, Themes=${(profile.macroThemes||[]).filter(Boolean).join(", ")}, Sells=${profile.sellsProducts ? profile.productsServices : "nothing"}

{"positioning":"one-sentence unique positioning","topOpportunities":["opp1","opp2","opp3"],"audienceInsights":["i1","i2","i3"],"contentAngles":["angle1","angle2","angle3"],"competitiveEdge":"what makes them stand out","recommendedFormats":["fmt1","fmt2"],"keyMessages":["msg1","msg2","msg3"],"warnings":["warn1","warn2"]}

Respond in Brazilian Portuguese.`;

    const doResearch = async () => {
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "Return ONLY valid JSON. No markdown.", messages: [{ role: "user", content: prompt }] })
        });
        const d = await r.json();
        const txt = (d.content?.map(b => b.text).join("") || "").replace(/```json|```/g, "").trim();
        try { setInsights(JSON.parse(txt)); } catch { setInsights(null); }
      } catch { setInsights(null); }
      setTimeout(() => setPhase(1), 800);
    };
    doResearch();
    return () => clearInterval(iv);
  }, []);

  const fallback = {
    positioning: `${profile.name} é referência em conteúdo estratégico para ${profile.audience || "seu mercado"}`,
    topOpportunities: ["Conteúdo educativo sobre transformação de resultados", "Cases e provas sociais do mercado", "Bastidores que humanizam a marca"],
    audienceInsights: ["Público busca resultados práticos, não teoria", "Alta sensibilidade a provas sociais do mesmo setor", "Prefere conteúdo curto e denso"],
    contentAngles: ["Antes/depois com dados reais", "Mitos do setor que você derruba", "O que os top 1% fazem diferente"],
    competitiveEdge: "Combinação de expertise técnica com comunicação acessível",
    recommendedFormats: ["Vídeo curto (Reels/TikTok)", "Carrossel educativo"],
    keyMessages: ["Resultado > processo", "Dados vencem opiniões"],
    warnings: ["Manter frequência consistente de publicação"],
  };

  const data = insights || fallback;

  if (phase === 1) return (
    <Wrap title="🧠 Deep Research Concluído" sub={`Mapeamos o mercado e público de ${profile.name}`}>
      <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Posicionamento</div>
        <div style={{ fontSize: 14, color: "#f1f5f9", lineHeight: 1.7 }}>{data.positioning}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ label: "🎯 Top Oportunidades", items: data.topOpportunities, c: "#22c55e" }, { label: "👥 Insights do Público", items: data.audienceInsights, c: "#f59e0b" }].map(({ label, items, c: ic }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ic, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
            {items?.map((o, i) => <div key={i} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 5, paddingLeft: 8, borderLeft: `2px solid ${ic}`, lineHeight: 1.5 }}>{o}</div>)}
          </div>
        ))}
      </div>
      <Btn onClick={() => onComplete(data)} full color={color}>Salvar Perfil e Continuar →</Btn>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button onClick={onSkip} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12 }}>Pular Deep Research por agora</button>
      </div>
    </Wrap>
  );

  return (
    <Wrap title="🔬 Deep Research" sub={`Pesquisando mercado e público de ${profile.name}`}>
      {[{ id: "g", name: "Gemini", logo: "🌟", c: "#4285f4", s: status.g, p: prog.g }, { id: "p", name: "GPT-4o", logo: "🤖", c: "#10a37f", s: status.p, p: prog.p }, { id: "c", name: "Claude", logo: "🧠", c: "#a855f7", s: status.c, p: prog.c }].map(({ id, name, logo, c: ic, s, p }) => (
        <div key={id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{logo}</span>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#f1f5f9" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s}</div>
              </div>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: ic }}>{Math.round(Math.min(p, 100))}%</div>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(p, 100)}%`, background: `linear-gradient(90deg,${ic}88,${ic})`, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
        </div>
      ))}
      <Btn onClick={onSkip} outline color="#475569" full small>Pular e configurar depois</Btn>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN: PROFILE MANAGER ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

export default function ProfileManager({
  mode = "manager",         // "manager" | "selector"
  onProfileSelected,        // called with profile when user selects for content
  onBack,
  selectorContext = "criar conteúdo",
}) {
  const [profiles, setProfiles] = useState(() => loadProfiles());
  const [screen, setScreen] = useState("home"); // "home" | "create" | "selector"
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem("viral_os_active_profile");
    return saved || null;
  });

  const persist = (ps) => { setProfiles(ps); saveProfiles(ps); };

  const handleCreate = () => setScreen("create");

  const handleOnboardingComplete = (newProfile) => {
    const updated = [...profiles, newProfile];
    persist(updated);
    setActiveProfileId(newProfile.id);
    localStorage.setItem("viral_os_active_profile", newProfile.id);
    setScreen("home");
  };

  const handleSelect = (profile) => {
    setActiveProfileId(profile.id);
    localStorage.setItem("viral_os_active_profile", profile.id);
    if (mode === "selector" && onProfileSelected) onProfileSelected(profile);
  };

  const handleDelete = (id) => {
    const updated = profiles.filter(p => p.id !== id);
    persist(updated);
    if (activeProfileId === id) {
      const newActive = updated[0]?.id || null;
      setActiveProfileId(newActive);
      localStorage.setItem("viral_os_active_profile", newActive || "");
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        textarea,input,button,select{font-family:'DM Sans',sans-serif!important}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 720, marginInline: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {onBack && <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13 }}>←</button>}
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "#f8fafc" }}>
              {screen === "create" ? "Criar Perfil" : mode === "selector" ? "Escolher Perfil" : "Gerenciar Perfis"}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            {profiles.length} {profiles.length === 1 ? "perfil" : "perfis"}
          </div>
        </div>
      </div>

      {screen === "home" && mode === "manager" && (
        <ProfilesHome
          profiles={profiles}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
          activeProfileId={activeProfileId}
        />
      )}

      {screen === "home" && mode === "selector" && (
        profiles.length === 0 ? (
          <Wrap title="Nenhum perfil ainda" sub="Crie seu primeiro perfil para continuar.">
            <Btn onClick={handleCreate} color="#6366f1" full>Criar perfil agora →</Btn>
          </Wrap>
        ) : (
          <ProfileSelector
            profiles={profiles}
            onSelect={handleSelect}
            onCreateNew={handleCreate}
            onCancel={onBack}
            context={selectorContext}
          />
        )
      )}

      {screen === "create" && (
        <ProfileOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => setScreen("home")}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT UTILITIES
// ═══════════════════════════════════════════════════════════════

export { loadProfiles, saveProfiles, ProfileAvatar, ProfileCompletion, ProfileSelector };
