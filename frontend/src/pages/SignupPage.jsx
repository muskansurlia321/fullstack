import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export function SignupPage() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error: signUpError, data } = await signUp({ email, password })
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // If email confirmations are enabled, session may be null.
    if (!data?.session) {
      setInfo('Account created. Please check your email to confirm, then sign in.')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.15]" />
      <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="absolute right-[-140px] top-[120px] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-cyan-400/25 ring-1 ring-white/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
              <p className="mt-1 text-sm text-slate-300">
                Start detecting job scams in minutes.
              </p>
            </div>
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
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950/40 px-3 py-2.5 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-medium text-slate-300">Confirm password</div>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                autoComplete="new-password"
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

            {info ? (
              <div className="rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 ring-1 ring-cyan-500/20">
                {info}
              </div>
            ) : null}

            <button
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>

            <div className="text-center text-sm text-slate-300">
              Already have an account?{' '}
              <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

