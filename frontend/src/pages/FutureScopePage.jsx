import { Chrome, Database, Mails, ScanSearch, ShieldQuestion } from 'lucide-react'

const roadmap = [
  {
    icon: Chrome,
    label: 'Chrome extension',
    status: 'Planned',
    description:
      'Real-time browser extension that scans job listings and LinkedIn DMs as you browse, flagging risky offers instantly.',
  },
  {
    icon: Mails,
    label: 'Email scanner',
    status: 'Planned',
    description:
      'One-click Gmail / Outlook integration to analyze suspicious emails directly from your inbox.',
  },
  {
    icon: Database,
    label: 'Scam template database',
    status: 'Research',
    description:
      'Library of known scam templates with fingerprinting to detect reused scripts and networks.',
  },
  {
    icon: ShieldQuestion,
    label: 'Company verification graph',
    status: 'Research',
    description:
      'Cross-reference offers with official company domains, hiring partners, and public job boards.',
  },
  {
    icon: ScanSearch,
    label: 'OCR & screenshot support',
    status: 'Coming soon',
    description:
      'Analyze screenshots of chats and offer letters using optical character recognition and text analysis.',
  },
]

export function FutureScopePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Future scope</h2>
        <p className="mt-1 text-sm text-slate-300">
          A roadmap of capabilities we&apos;d love to build on top of TrustHire.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {roadmap.map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50/0 via-white/5 to-fuchsia-500/5 opacity-50" />
            <div className="relative flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950/40 ring-1 ring-white/10">
                    <item.icon className="h-4 w-4 text-cyan-200" />
                  </div>
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-200 ring-1 ring-white/15">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

