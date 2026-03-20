import { ArrowRight, BrainCircuit, FileText, GaugeCircle, Server } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: '1. User uploads or pastes offer',
    description:
      'The candidate uploads a PDF offer letter or pastes email / chat content into TrustHire.',
  },
  {
    icon: FileText,
    title: '2. Text is extracted in-browser',
    description:
      'For PDFs, text is extracted locally in the browser using PDF.js, so raw files never leave the device.',
  },
  {
    icon: Server,
    title: '3. Backend normalizes & enriches',
    description:
      'The Node.js backend validates input, runs red-flag heuristics, and prepares a clean prompt for the AI model.',
  },
  {
    icon: BrainCircuit,
    title: '4. Hugging Face AI analyzes content',
    description:
      'A zero-shot text classifier scores how likely the offer is a scam vs legitimate, returning labels and scores.',
  },
  {
    icon: GaugeCircle,
    title: '5. Risk score & red flags displayed',
    description:
      'TrustHire combines AI scores with pattern matches to compute a scam probability and highlight red-flag snippets.',
  },
  {
    icon: GaugeCircle,
    title: '6. Result is stored to history',
    description:
      'The final analysis, explanation, and metadata are saved in Supabase so users can revisit and compare over time.',
  },
]

export function FlowPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">How TrustHire works</h2>
        <p className="mt-1 text-sm text-slate-300">
          From upload to explanation, each step of the pipeline is designed for safety and clarity.
        </p>
      </div>

      <div className="relative rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="absolute inset-x-16 top-10 hidden h-px bg-gradient-to-r from-transparent via-white/30 to-transparent lg:block" />
        <ol className="grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950/40 ring-1 ring-white/10">
                  <step.icon className="h-4 w-4 text-cyan-200" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {step.title}
                </div>
              </div>
              <p className="text-sm text-slate-300">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-950/40 px-4 py-3 text-xs text-slate-300 ring-1 ring-white/5">
          <div>
            End-to-end, the flow takes only a few seconds in typical conditions.
          </div>
          <div className="hidden items-center gap-1 text-cyan-300 md:flex">
            <span>Try it now from the upload page</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

