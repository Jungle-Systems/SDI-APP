'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, FileDown, Activity } from 'lucide-react'

export default function Sidebar() {
  const path = usePathname()
  const onDash = path === '/'

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>

      {/* Wordmark */}
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #178395, #0d6b7a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Activity size={14} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>SDI</div>
            <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Jungle × Seawolf</div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(23,131,149,0.08)',
          border: '1px solid rgba(23,131,149,0.2)',
          borderRadius: 99, padding: '3px 8px',
          fontSize: 9, fontWeight: 600, color: '#178395',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#178395', animation: 'pulse-dot 2s infinite' }} className="pulse" />
          Live
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <Link
          href="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8,
            fontSize: 13, fontWeight: onDash ? 600 : 500,
            color: onDash ? '#0F172A' : '#64748B',
            background: onDash ? '#F8FAFC' : 'transparent',
            border: onDash ? '1px solid #E2E8F0' : '1px solid transparent',
            textDecoration: 'none', transition: 'all 0.15s',
            boxShadow: onDash ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          <LayoutDashboard size={14} strokeWidth={onDash ? 2 : 1.5} color={onDash ? '#178395' : '#94A3B8'} />
          Portfolio
        </Link>

        {/* Company pages are drill-downs — no top-level nav item */}
        {!onDash && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', marginTop: 4,
            fontSize: 13, fontWeight: 600, color: '#0F172A',
            background: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <Activity size={14} strokeWidth={2} color="#178395" />
            Analysis
          </div>
        )}
      </nav>

      {/* Section label */}
      <div style={{ padding: '0 14px 8px' }}>
        <p style={{ fontSize: 9, fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Actions</p>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '0 10px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Link
          href="/upload"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            border: '1px solid #E2E8F0', background: '#fff', color: '#475569',
            textDecoration: 'none', transition: 'all 0.15s',
          }}
        >
          <Upload size={12} strokeWidth={1.75} />
          Upload Data
        </Link>

        <Link
          href="/export"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: '#178395', color: '#fff', border: 'none',
            textDecoration: 'none', transition: 'all 0.15s',
          }}
        >
          <FileDown size={12} strokeWidth={1.75} />
          Export Report
        </Link>
      </div>

    </aside>
  )
}
