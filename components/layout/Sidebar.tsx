'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, GitMerge, AlertTriangle, Download } from 'lucide-react'

const nav = [
  { href: '/',            label: 'Portfolio',   icon: LayoutDashboard, code: '01' },
  { href: '/upload',      label: 'Upload',      icon: Upload,          code: '02' },
  { href: '/constraints', label: 'Constraints', icon: GitMerge,        code: '03' },
  { href: '/claim-verification', label: 'Claim Verify', icon: AlertTriangle, code: '04' },
  { href: '/export',      label: 'Export',      icon: Download,        code: '05' },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-52 min-h-screen border-r border-[#E5E7EB] bg-[#FDFDFC] flex flex-col py-8 px-5 shrink-0">
      {/* Wordmark */}
      <div className="mb-10">
        <div className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-0.5">
          Jungle × Seawolf
        </div>
        <div className="text-[13px] font-semibold tracking-tight text-[#111827] leading-tight">
          Systemic Disclosure<br />Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {nav.map(({ href, label, icon: Icon, code }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] transition-colors group ${
                active
                  ? 'bg-[#178395]/8 text-[#178395]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]'
              }`}
            >
              <span className={`font-mono text-[9px] tracking-widest w-5 ${active ? 'text-[#178395]' : 'text-[#9CA3AF]'}`}>
                {code}
              </span>
              <Icon size={13} strokeWidth={1.5} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom meta */}
      <div className="mt-auto">
        <div className="h-px bg-[#E5E7EB] mb-4" />
        <div className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest leading-relaxed">
          Jungle-Staging<br />
          <span className="text-[#178395]">● </span>Connected
        </div>
      </div>
    </aside>
  )
}
