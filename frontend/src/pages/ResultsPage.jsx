import { AlertTriangle, ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { Spinner } from '../components/Spinner.jsx'
import { supabase } from '../lib/supabaseClient.js'

function scoreMeta(score) {
  const s = Number(score) || 0
  if (s >= 80)
    return {
      title: 'High scam risk',
      tone: 'bg-rose-500/10 text-rose-100 ring-rose-500/20',
      icon: AlertTriangle,
    }
  if (s >= 50)
    return {
      title: 'Suspicious signals detected',
      tone: 'bg-amber-500/10 text-amber-100 ring-amber-500/20',
      icon: AlertTriangle,
    }
  return {
    title: 'Likely safe',
    tone: 'bg-emerald-500/10 text-emerald-100 ring-emerald-500/20',
    icon: ShieldCheck,
  }
}

export function ResultsPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [item, setItem] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')

      const { data, error: qErr } = await supabase
        .from('analyses')
        .select(
          'id, created_at, input_type, input_excerpt, offer_text, scam_score, hf_model, labels, red_flags, explanation',
        )
        .eq('id', id)
        .single()

      if (ignore) return

      if (qErr) {
        setError(qErr.message)
        setItem(null)
      } else {
        setItem(data)
      }

      setLoading(false)
    }

    if (id) load()

    return () => {
      ignore = true
    }
  }, [id])

  const meta = useMemo(() => scoreMeta(item?.scam_score), [item?.scam_score])
  const Icon = meta.icon

  if (loading) return <Spinner label="Loading results…" />

  if (error) {
    return (
      <div className="rounded-3xl bg-rose-500/10 p-6 text-rose-100 ring-1 ring-rose-500/20">
        {error}
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Analysis</span>
            <span className="opacity-50">•</span>
            <span>{new Date(item.created_at).toLocaleString()}</span>
            <span className="opacity-50">•</span>
            <span className="uppercase tracking-wide">{item.input_type}</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Results
          </h2>
          <p className="mt-1 text-sm text-slate-300">{item.input_excerpt}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/10 transition hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            Analyze another
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ring-1 ${meta.tone}`}>
              <Icon className="h-4 w-4" />
              <span className="font-semibold">{meta.title}</span>
            </div>

            <div className="mt-5">
              <ProgressBar value={item.scam_score ?? 0} />
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-200">
              {item.explanation || 'No explanation available.'}
            </div>

            <div className="mt-5 text-xs text-slate-400">
              Model: <span className="text-slate-200">{item.hf_model || '—'}</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Red flags</div>
            <div className="mt-1 text-xs text-slate-400">
              Pattern-based highlights found in the offer text (not exhaustive).
            </div>

            {Array.isArray(item.red_flags) && item.red_flags.length ? (
              <ul className="mt-4 space-y-3">
                {item.red_flags.map((rf, idx) => (
                  <li key={idx} className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">
                      {typeof rf === 'string' ? rf : rf.title}
                    </div>
                    {typeof rf === 'object' && rf?.snippet ? (
                      <div className="mt-2 text-sm text-slate-300">
                        “{rf.snippet}”
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-950/30 px-4 py-3 text-sm text-slate-300 ring-1 ring-white/10">
                No obvious red-flag patterns matched.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">AI scores</div>
            <div className="mt-1 text-xs text-slate-400">
              Zero-shot classification between “scam” and “legitimate”.
            </div>

            <div className="mt-4 space-y-3">
              {(item.labels || []).map((l) => (
                <div
                  key={l.label}
                  className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{l.label}</span>
                    <span className="text-slate-200">{(l.score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Recommended next steps</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Verify the company on official domains (LinkedIn, website, careers page).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                Never pay for equipment, onboarding, or background checks via gift cards / crypto.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Ask for a video interview and confirm recruiter identity via official channels.
              </li>
            </ul>

            <div className="mt-4 text-xs text-slate-400">
              Learn more:{' '}
              <a
                className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
                href="https://consumer.ftc.gov/articles/job-scams"
                target="_blank"
                rel="noreferrer"
              >
                FTC job scams guide <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

