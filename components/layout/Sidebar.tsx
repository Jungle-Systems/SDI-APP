'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Network, Upload, FileDown } from 'lucide-react'

const nav = [
  { href: '/',             label: 'Portfolio Dashboard', icon: LayoutDashboard },
  { href: '/exposure-map', label: 'Exposure Map',        icon: Network         },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 min-h-screen border-r border-[#E5E7EB] bg-[#FAFAFA] flex flex-col shrink-0">

      {/* Wordmark */}
      <div className="px-6 pt-8 pb-6 border-b border-[#E5E7EB]">
        <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#9CA3AF] mb-1">
          Jungle × Seawolf
        </div>
        <div className="text-[13px] font-semibold tracking-tight text-[#0F172A] leading-snug">
          Systemic Disclosure<br />Intelligence
        </div>
      </div>

      {/* Primary Nav */}
      <nav className="flex flex-col gap-0.5 px-3 pt-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all group ${
                active
                  ? 'bg-[#0F172A] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <Icon
                size={14}
                strokeWidth={active ? 2 : 1.5}
                className={active ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        <div className="h-px bg-[#E5E7EB] mb-3" />

        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium border border-[#E2E8F0] bg-white text-[#374151] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all"
        >
          <Upload size={12} strokeWidth={1.75} />
          Upload Data
        </Link>

        <Link
          href="/export"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium bg-[#178395] text-white hover:bg-[#146F7E] transition-all"
        >
          <FileDown size={12} strokeWidth={1.75} />
          Export Report
        </Link>

        {/* Connection status */}
        <div className="pt-2 text-[10px] font-mono text-[#9CA3AF] tracking-widest uppercase">
          <span className="text-[#22C55E]">● </span>Connected
        </div>
      </div>

    </aside>
  )
}
