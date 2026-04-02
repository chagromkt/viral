import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase'

export default function AuthScreen({ onSuccess }) {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email || !password) {
      setError('Preencha email e senha.')
      setLoading(false)
      return
    }

    if (mode === 'signup') {
      if (!name) { setError('Preencha seu nome.'); setLoading(false); return }
      const { error: e } = await signUp(email, password, { full_name: name })
      if (e) setError(e.message)
      else setSuccess('Conta criada! Verifique seu email para confirmar.')
    } else {
      const { error: e } = await signIn(email, password)
      if (e) setError('Email ou senha incorretos.')
      else onSuccess?.()
    }

    setLoading(false)
  }

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9,
    padding: '12px 14px', color: '#f1f5f9', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    marginBottom: 12,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070d1a', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: '#f8fafc', letterSpacing: '-1px' }}>AiPosting</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>by Leadcultura</div>
        </div>

        {/* Card */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: '#f8fafc', marginBottom: 20, letterSpacing: '-0.5px' }}>
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta grátis'}
          </h2>

          {mode === 'signup' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" style={inp}/>
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={inp}/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" style={inp}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>

          {error && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 7 }}>{error}</div>}
          {success && <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 12, padding: '8px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: 7 }}>{success}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', background: loading ? '#1e293b' : '#6366f1',
            border: '1.5px solid #6366f1', borderRadius: 9, padding: '13px',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar →' : 'Criar conta →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tenho conta — entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
