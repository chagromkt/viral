import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { signOut, getProfiles, upsertProfile, deleteProfile, saveScript, getScripts } from './lib/supabase'
import AuthScreen from './pages/AuthScreen'

// ─── LAZY IMPORTS (large components) ──────────────────────
// All screens come from the existing JSX files.
// We import them directly since this is a single-bundle app.

// NOTE FOR SETUP: copy your JSX files into src/screens/
// viral-os.jsx           → src/screens/MainApp.jsx
// viral-os-roteiro.jsx   → src/screens/RoteiroScreen.jsx
// viral-os-ob5.jsx       → src/screens/OB5Screen.jsx
// viral-os-profiles.jsx  → src/screens/ProfileManager.jsx
// viral-score-v3.jsx     → src/screens/ViralScore.jsx

// For now we import the main app shell which includes all screens
import MainApp from './screens/MainApp.jsx'

// ─── GLOBAL STYLES ────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #070d1a; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    textarea, input, select, button { font-family: inherit !important; }
    select option { background: #0f172a; }
  `}</style>
)

// ─── APP SHELL ────────────────────────────────────────────
function App() {
  const { user, account, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#070d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>✨</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (!user) return <AuthScreen onSuccess={() => window.location.reload()}/>

  return (
    <MainApp
      user={user}
      account={account}
      onSignOut={async () => { await signOut(); window.location.reload(); }}
      // Supabase helpers passed as props so screens can persist data
      db={{ getProfiles, upsertProfile, deleteProfile, saveScript, getScripts }}
    />
  )
}

// ─── ROOT ─────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle/>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </React.StrictMode>
)
