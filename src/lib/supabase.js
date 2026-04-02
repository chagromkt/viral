import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars missing. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ─── AUTH HELPERS ─────────────────────────────────────────────

export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// ─── PROFILE HELPERS ──────────────────────────────────────────

export const getProfiles = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  return { data, error }
}

export const upsertProfile = async (profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  return { data, error }
}

export const deleteProfile = async (profileId) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId)
  return { error }
}

// ─── SCRIPT HELPERS ───────────────────────────────────────────

export const getScripts = async (profileId, limit = 20) => {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export const saveScript = async (script) => {
  const { data, error } = await supabase
    .from('scripts')
    .insert(script)
    .select()
    .single()
  return { data, error }
}

export const deleteScript = async (scriptId) => {
  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', scriptId)
  return { error }
}

// ─── USER ACCOUNT HELPERS ─────────────────────────────────────

export const getUserAccount = async (userId) => {
  const { data, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserAccount = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_accounts')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}
