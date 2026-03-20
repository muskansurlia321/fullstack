import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function init() {
      const { data, error } = await supabase.auth.getSession()
      if (!ignore) {
        if (error) {
          // eslint-disable-next-line no-console
          console.warn('supabase.auth.getSession error', error)
        }
        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
        setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      ignore = true
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    async function signUp({ email, password }) {
      return supabase.auth.signUp({ email, password })
    }

    async function signIn({ email, password }) {
      return supabase.auth.signInWithPassword({ email, password })
    }

    async function signOut() {
      return supabase.auth.signOut()
    }

    return {
      session,
      user,
      loading,
      signUp,
      signIn,
      signOut,
    }
  }, [session, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

