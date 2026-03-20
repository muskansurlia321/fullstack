import { Brain, FileText, GaugeCircle, LayoutDashboard } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI scam detection',
    description:
      'Zero-shot classification and heuristic rules tuned for common job scam patterns like upfront fees and instant hires.',
  },
  {
    icon: FileText,
    title: 'PDF & text analysis',
    description:
      'Upload offer letters as PDFs or paste email content directly. Text is extracted locally in your browser.',
  },
  {
    icon: GaugeCircle,
    title: 'Risk scoring',
    description:
      'Percent-based scam probability scores, plus breakdown of scam vs legitimate likelihood for transparency.',
  },
  {
    icon: LayoutDashboard,
    title: 'Analytics dashboard',
    description:
      'History of your analyses with timestamps, excerpts, and quick links back to full AI explanations.',
  },
]

export function FeaturesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Platform features</h2>
        <p className="mt-1 text-sm text-slate-300">
          TrustHire combines AI models and human-centric UX to keep your job search safe.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/25 to-fuchsia-500/20 opacity-60 blur-3xl group-hover:opacity-80" />
            <div className="relative flex items-start gap-3">
              <div className="mt-1 grid h-9 w-9 place-items-center rounded-2xl bg-slate-950/40 ring-1 ring-white/10">
                <Icon className="h-4 w-4 text-cyan-200" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <p className="mt-1 text-sm text-slate-300">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

