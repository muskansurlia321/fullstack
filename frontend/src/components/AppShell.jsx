import {
  Compass,
  LogOut,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  Wrench,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-white/10 text-white ring-1 ring-white/15'
            : 'text-slate-300 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  )
}

export function AppShell() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.15]" />

      <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute right-[-140px] top-[120px] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-[-220px] left-[-160px] h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 ring-1 ring-white/15">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white">
                  TrustHire
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-200 ring-1 ring-white/10">
                  <Sparkles className="h-3 w-3" />
                  AI Scam Detection
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Protect candidates from fake offers
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/dashboard" icon={ShieldCheck}>
              Dashboard
            </NavItem>
            <NavItem to="/features" icon={Wrench}>
              Features
            </NavItem>
            <NavItem to="/flow" icon={Workflow}>
              Flow
            </NavItem>
            <NavItem to="/future-scope" icon={Compass}>
              Future scope
            </NavItem>
            <NavItem to="/upload" icon={Upload}>
              Analyze offer
            </NavItem>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>

          <div className="text-right text-xs text-slate-400 md:hidden">
            <div className="truncate max-w-[140px]">{user?.email}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-slate-950/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} TrustHire</span>
          <span className="truncate">
            Signed in as <span className="text-slate-200">{user?.email}</span>
          </span>
        </div>
      </footer>
    </div>
  )
}

