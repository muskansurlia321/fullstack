import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn({ email, password })
    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.15]" />
      <div className="absolute left-1/2 top-[-220px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute right-[-140px] top-[80px] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 ring-1 ring-white/15">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-white">
                TrustHire
              </div>
              <div className="text-xs text-slate-300">AI Scam Detection Platform</div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-12">
        <div className="hidden max-w-md flex-1 flex-col gap-4 pr-8 text-left md:flex">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI-powered protection for students & job-seekers
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Detect fake job & internship offers before they waste your time.
          </h1>
          <p className="text-sm text-slate-300">
            TrustHire uses advanced AI models and scam-pattern heuristics to score risk,
            highlight red flags, and keep your job search safe.
          </p>
        </div>

        <div className="w-full max-w-md flex-1 rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 backdrop-blur">
          <div className="mb-6">
            <div className="text-sm font-medium text-slate-200">Sign in</div>
            <p className="mt-1 text-xs text-slate-400">
              Continue to your dashboard to analyze offers and review history.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <div className="mb-1 text-xs font-medium text-slate-300">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-slate-950/40 px-3 py-2.5 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-medium text-slate-300">Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950/40 px-3 py-2.5 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
              />
            </label>

            {error ? (
              <div className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-500/20">
                {error}
              </div>
            ) : null}

            <button
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/10 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="text-center text-sm text-slate-300">
              Don’t have an account?{' '}
              <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/signup">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

