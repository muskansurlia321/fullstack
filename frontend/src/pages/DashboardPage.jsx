import { ArrowRight, Clock, FileText, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { Spinner } from '../components/Spinner.jsx'

function scoreLabel(s) {
  if (s >= 80) return { label: 'High risk', cls: 'bg-rose-500/15 text-rose-200 ring-rose-500/20' }
  if (s >= 50) return { label: 'Suspicious', cls: 'bg-amber-500/15 text-amber-200 ring-amber-500/20' }
  return { label: 'Likely safe', cls: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/20' }
}

export function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')

      const { data, error: qErr } = await supabase
        .from('analyses')
        .select('id, created_at, input_excerpt, scam_score')
        .order('created_at', { ascending: false })
        .limit(20)

      if (ignore) return

      if (qErr) {
        setError(qErr.message)
        setItems([])
      } else {
        setItems(data ?? [])
      }

      setLoading(false)
    }

    load()
    return () => {
      ignore = true
    }
  }, [user?.id])

  const stats = useMemo(() => {
    const total = items.length
    const avg = total ? items.reduce((a, b) => a + (b.scam_score ?? 0), 0) / total : 0
    const high = items.filter((i) => (i.scam_score ?? 0) >= 80).length
    return { total, avg, high }
  }, [items])

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-300">
            Track your analysis history and quickly re-check suspicious offers.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/10 transition hover:opacity-95"
        >
          <Upload className="h-4 w-4" />
          Analyze a job offer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Analyses</div>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-semibold text-white">{stats.total}</div>
          <div className="mt-1 text-xs text-slate-400">Last 20 saved</div>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Avg risk</div>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-semibold text-white">{stats.avg.toFixed(1)}%</div>
          <div className="mt-1 text-xs text-slate-400">Across saved analyses</div>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">High risk</div>
            <div className="h-2 w-2 rounded-full bg-rose-400" />
          </div>
          <div className="mt-2 text-3xl font-semibold text-white">{stats.high}</div>
          <div className="mt-1 text-xs text-slate-400">Score ≥ 80%</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/5 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <div className="text-sm font-semibold text-white">Analysis history</div>
            <div className="mt-1 text-xs text-slate-400">Most recent first</div>
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading history…" />
        ) : error ? (
          <div className="px-6 py-6 text-sm text-rose-200">{error}</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-sm text-slate-300">
            No analyses yet. Upload a PDF or paste an offer text to get started.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((it) => {
              const score = Math.round((it.scam_score ?? 0) * 10) / 10
              const meta = scoreLabel(score)
              const date = new Date(it.created_at)
              return (
                <li key={it.id} className="px-6 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${meta.cls}`}>
                          {meta.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {date.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 truncate text-sm text-slate-200">
                        {it.input_excerpt || '—'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Scam probability</div>
                        <div className="text-lg font-semibold text-white">{score.toFixed(1)}%</div>
                      </div>
                      <Link
                        to={`/results/${it.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

