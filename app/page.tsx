'use client'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, XCircle, Upload, FileDown } from 'lucide-react'
import {
  mockPortfolio, mockCompanies, mockCollisionReports,
  mockPortfolioExposure, mockExtractionRuns,
} from '@/lib/mock'
import { CONSTRAINT_LABELS, type ConstraintType } from '@/lib/types'

// ── Color helpers ──────────────────────────────────────────────────────
const DUR: Record<string, { fg: string; bg: string; bar: string }> = {
  Resilient: { fg: '#16a34a', bg: 'rgba(22,163,74,0.08)',  bar: '#16a34a' },
  Stable:    { fg: '#178395', bg: 'rgba(23,131,149,0.08)', bar: '#178395' },
  Exposed:   { fg: '#D97706', bg: 'rgba(217,119,6,0.08)',  bar: '#D97706' },
  Fragile:   { fg: '#E14A2D', bg: 'rgba(225,74,45,0.08)',  bar: '#E14A2D' },
  Pending:   { fg: '#94A3B8', bg: 'rgba(148,163,184,0.06)',bar: '#E2E8F0' },
}

function StatusIcon({ s }: { s: string }) {
  if (s === 'complete')   return <CheckCircle size={12} color="#22c55e" />
  if (s === 'processing') return <Clock size={12} color="#D97706" />
  if (s === 'failed')     return <XCircle size={12} color="#E14A2D" />
  return <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />
}

// Portfolio stats
const totalFlags   = mockCollisionReports.reduce((s, r) => s + r.collision_flag_count, 0)
const avgEbitda    = mockCollisionReports.reduce((s, r) => s + r.ebitda_base_pct, 0) / mockCollisionReports.length
const fragileCount = mockCollisionReports.filter(r => r.revenue_durability === 'Fragile').length

const durCounts = { Fragile: 0, Exposed: 0, Stable: 0, Resilient: 0, Pending: 0 }
mockCompanies.forEach(c => {
  const r = mockCollisionReports.find(x => x.company_id === c.id)
  if (r) { (durCounts as any)[r.revenue_durability]++ }
  else     durCounts.Pending++
})
const TOTAL = mockPortfolio.company_count
const durOrder = ['Fragile','Exposed','Stable','Resilient','Pending'] as const

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDFDFC', fontFamily: "'Inter', sans-serif" }}>

      {/* ─── Header ─── */}
      <div style={{
        padding: '20px 28px',
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4 }}>
            {mockPortfolio.client_name} · {mockPortfolio.sfdr_article}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.4px' }}>
            {mockPortfolio.name}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { v: `€${(mockPortfolio.aum_eur / 1e6).toFixed(0)}M`, l: 'AUM', c: '#0F172A' },
            { v: String(mockPortfolio.company_count), l: 'Companies', c: '#0F172A' },
            { v: String(totalFlags), l: 'Flags', c: '#E14A2D' },
            { v: `${avgEbitda.toFixed(1)}%`, l: 'Avg EBITDA', c: '#E14A2D' },
          ].map(k => (
            <div key={k.l} style={{
              padding: '6px 14px', borderRadius: 8,
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              textAlign: 'center', minWidth: 72,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: k.c, fontFamily: "'JetBrains Mono', monospace" }}>{k.v}</div>
              <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>{k.l}</div>
            </div>
          ))}

          <div style={{ width: 1, height: 32, background: '#E2E8F0', margin: '0 4px' }} />

          <Link href="/upload" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            border: '1px solid #E2E8F0', background: '#fff', color: '#475569',
            textDecoration: 'none',
          }}>
            <Upload size={12} /> Upload
          </Link>
          <Link href="/export" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: '#178395', color: '#fff', textDecoration: 'none',
          }}>
            <FileDown size={12} /> Export
          </Link>
        </div>
      </div>

      {/* ─── Portfolio risk bar ─── */}
      <div style={{ padding: '14px 28px', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portfolio Risk Profile</span>
          <span style={{ fontSize: 10, color: '#94A3B8' }}>— {fragileCount} of {TOTAL} companies Fragile</span>
        </div>
        <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
          {durOrder.map(d => {
            const n = durCounts[d]
            if (!n) return null
            return <div key={d} style={{ flex: n, background: DUR[d].bar, borderRadius: 99 }} />
          })}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap' }}>
          {durOrder.filter(d => durCounts[d] > 0).map(d => (
            <span key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: DUR[d].bar, display: 'inline-block' }} />
              {d} <strong style={{ color: DUR[d].fg, fontFamily: "'JetBrains Mono', monospace" }}>{((durCounts[d] / TOTAL) * 100).toFixed(0)}%</strong>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Main grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 292px', alignItems: 'start' }}>

        {/* Company cards */}
        <div style={{ padding: '24px 28px', borderRight: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Companies</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {mockCompanies.map(company => {
              const report   = mockCollisionReports.find(r => r.company_id === company.id)
              const dur      = report?.revenue_durability ?? null
              const ds       = dur ? DUR[dur] : DUR.Pending
              const nir      = company.upright_nir_score ?? null
              const canOpen  = !!report

              return (
                <Link key={company.id} href={canOpen ? `/company/${company.id}` : '#'} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s',
                    opacity: canOpen ? 1 : 0.55,
                    cursor: canOpen ? 'pointer' : 'default',
                    display: 'flex', flexDirection: 'column',
                  }}
                  onMouseEnter={e => { if (canOpen) { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; el.style.transform = 'translateY(-2px)'; el.style.borderColor = '#CBD5E1' } }}
                  onMouseLeave={e => { if (canOpen) { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; el.style.transform = ''; el.style.borderColor = '#E2E8F0' } }}
                  >
                    {/* Color strip */}
                    <div style={{ height: 3, background: ds.bar }} />

                    <div style={{ padding: '14px 16px 12px', flex: 1 }}>
                      {/* Name + badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 3 }}>{company.name}</p>
                          <p style={{ fontSize: 10, color: '#94A3B8' }}>{company.sector} · {company.jurisdiction}{company.filing_type ? ` · ${company.filing_type}` : ''}</p>
                        </div>
                        {dur && (
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, flexShrink: 0,
                            background: ds.bg, border: `1px solid ${ds.fg}30`,
                            fontSize: 9, fontWeight: 700, color: ds.fg, letterSpacing: '0.07em', textTransform: 'uppercase',
                          }}>{dur}</span>
                        )}
                      </div>

                      {/* EBITDA bar */}
                      {report && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>EBITDA exposure</span>
                            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#E14A2D' }}>
                              {report.ebitda_extreme_pct.toFixed(1)}% extreme
                            </span>
                          </div>
                          <div style={{ height: 3, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, Math.abs(report.ebitda_extreme_pct) * 3.5)}%`,
                              height: '100%', borderRadius: 99,
                              background: Math.abs(report.ebitda_extreme_pct) > 20 ? '#E14A2D'
                                : Math.abs(report.ebitda_extreme_pct) > 10 ? '#D97706' : '#178395',
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Flags + priority + NIR */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {report ? (
                            <span style={{
                              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                              color: report.collision_flag_count >= 5 ? '#E14A2D' : report.collision_flag_count >= 3 ? '#D97706' : '#475569',
                            }}>
                              <AlertTriangle size={10} />
                              {report.collision_flag_count} flags
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94A3B8' }}>
                              <StatusIcon s={company.disclosure_status} />
                              {company.disclosure_status}
                            </span>
                          )}
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            color: company.triage_priority === 'High' ? '#E14A2D' : company.triage_priority === 'Medium' ? '#D97706' : '#94A3B8',
                            background: company.triage_priority === 'High' ? 'rgba(225,74,45,0.07)' : company.triage_priority === 'Medium' ? 'rgba(217,119,6,0.07)' : '#F8FAFC',
                          }}>{company.triage_priority}</span>
                        </div>
                        {nir !== null && (
                          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: nir >= 0 ? '#178395' : '#E14A2D' }}>
                            {nir >= 0 ? '+' : ''}{nir.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {canOpen && (
                      <div style={{
                        padding: '8px 16px',
                        background: '#FAFAFA',
                        borderTop: '1px solid #F1F5F9',
                        textAlign: 'right',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#178395' }}>Open analysis →</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Systemic constraints */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Systemic Constraints</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[...mockPortfolioExposure].sort((a, b) => b.aum_pct - a.aum_pct).slice(0, 5).map(exp => {
                const barColor = exp.aum_pct >= 50 ? '#E14A2D' : exp.aum_pct >= 30 ? '#D97706' : '#178395'
                return (
                  <div key={exp.constraint_type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#0F172A', fontWeight: 500 }}>{CONSTRAINT_LABELS[exp.constraint_type as ConstraintType]}</span>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: barColor, flexShrink: 0, marginLeft: 6 }}>{exp.aum_pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${exp.aum_pct}%`, height: '100%', background: barColor, borderRadius: 99 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                      {exp.is_systemic && <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Systemic</span>}
                      {exp.concentration_flag && <span style={{ fontSize: 9, color: '#E14A2D', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>⚠ Concentrated</span>}
                      <span style={{ fontSize: 9, color: '#CBD5E1' }}>{exp.affected_companies.length} co.</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ height: 1, background: '#F1F5F9' }} />

          {/* Extraction queue */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Extraction Queue</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {mockExtractionRuns.map(run => (
                <div key={run.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <StatusIcon s={run.status} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {run.company_name.split(' ').slice(0,2).join(' ')}
                    </p>
                    <p style={{ fontSize: 9, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {run.status === 'complete' ? `${run.fields_extracted} fields` : run.status === 'running' ? 'Processing…' : run.status === 'failed' ? 'OCR needed' : 'Queued'}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: run.status === 'complete' ? '#22c55e' : run.status === 'failed' ? '#E14A2D' : '#D97706',
                    background: run.status === 'complete' ? 'rgba(34,197,94,0.08)' : run.status === 'failed' ? 'rgba(225,74,45,0.08)' : 'rgba(217,119,6,0.08)',
                  }}>{run.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#F1F5F9' }} />

          {/* Company durability list */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Durability Triage</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {mockCollisionReports.sort((a, b) => b.collision_flag_count - a.collision_flag_count).map(r => {
                const ds = DUR[r.revenue_durability]
                return (
                  <Link key={r.id} href={`/company/${r.company_id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '8px 10px', borderRadius: 8,
                      background: ds.bg, border: `1px solid ${ds.fg}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ds.fg + '50' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ds.fg + '20' }}
                    >
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', marginBottom: 1 }}>{r.company_name.split(' ').slice(0,2).join(' ')}</p>
                        <p style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: '#E14A2D' }}>{r.ebitda_extreme_pct.toFixed(1)}% extreme</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: ds.fg, background: '#fff', border: `1px solid ${ds.fg}30`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {r.revenue_durability}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
