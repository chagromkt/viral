import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, getSession, onAuthChange, getUserAccount } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadAccount = async (userId) => {
    const { data } = await getUserAccount(userId)
    setAccount(data)
  }

  useEffect(() => {
    getSession().then(s => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) loadAccount(s.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = onAuthChange(s => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) loadAccount(s.user.id)
      else setAccount(null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = { session, user, account, loading, refreshAccount: () => user && loadAccount(user.id) }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
