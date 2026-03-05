'use client'
import { mockPortfolio, mockCompanies, mockPortfolioExposure, mockCollisionReports } from '@/lib/mock'
import { CONSTRAINT_LABELS } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle, Clock, AlertTriangle, Network, Search } from 'lucide-react'

const fmt  = (n: number) => `€${(n / 1_000_000).toFixed(0)}M`
const fmtB = (n: number) => `€${(n / 1_000_000_000).toFixed(1)}B`

const durColor: Record<string, string> = {
  Resilient: '#16a34a',
  Stable:    '#0284c7',
  Exposed:   '#d97706',
  Fragile:   '#dc2626',
}

function StatusPill({ s }: { s: string }) {
  if (s === 'complete')   return <span className="flex items-center gap-1 text-[11px] text-emerald-600"><CheckCircle size={10} />Complete</span>
  if (s === 'processing') return <span className="flex items-center gap-1 text-[11px] text-sky-500"><Clock size={10} />Processing</span>
  if (s === 'failed')     return <span className="flex items-center gap-1 text-[11px] text-red-500"><AlertTriangle size={10} />Failed</span>
  return <span className="flex items-center gap-1 text-[11px] text-slate-400"><Clock size={10} />Pending</span>
}

export default function DashboardPage() {
  const chartData = mockPortfolioExposure.map(e => ({
    name: CONSTRAINT_LABELS[e.constraint_type].split(' & ')[0],
    aum_pct: e.aum_pct,
    systemic: e.is_systemic,
    concentration: e.concentration_flag,
  }))

  const totalFlags   = mockCollisionReports.reduce((s, r) => s + r.collision_flag_count, 0)
  const fragileCount = mockCollisionReports.filter(r => r.revenue_durability === 'Fragile').length
  const doneCount    = mockCompanies.filter(c => c.disclosure_status === 'complete').length

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white shrink-0">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-0.5">
            Portfolio Dashboard · {mockPortfolio.sfdr_article}
          </p>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight">{mockPortfolio.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">AUM</p>
            <p className="text-[18px] font-bold text-slate-800 leading-none">{fmtB(mockPortfolio.aum_eur)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{mockPortfolio.client_name}</p>
          </div>
          <Link
            href="/exposure-map"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-[12px] font-medium hover:bg-slate-700 transition-colors"
          >
            <Network size={13} />
            Exposure Map
          </Link>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-auto px-8 py-7">

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Companies',       value: String(mockPortfolio.company_count), sub: `${doneCount} analysed`,             color: 'text-slate-900' },
            { label: 'Risk Flags',      value: String(totalFlags),                  sub: 'unverified disclosure claims',       color: 'text-red-500'   },
            { label: 'At-Risk Holdings',value: String(fragileCount),                sub: 'fragile revenue durability',         color: 'text-amber-500' },
            { label: 'AUM Exposed',     value: '58%',                               sub: 'facing transition constraint risk',  color: 'text-amber-600' },
          ].map(k => (
            <div key={k.label} className="card flex flex-col gap-1">
              <p className="mono-label text-slate-400">{k.label}</p>
              <p className={`text-[32px] font-bold leading-none tracking-tight mt-1 ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Durability ── */}
        <div className="grid grid-cols-5 gap-5 mb-7">

          {/* AUM Exposure Chart */}
          <div className="col-span-3 card">
            <p className="text-[12px] font-semibold text-slate-700 mb-0.5">AUM Exposure by Constraint Type</p>
            <p className="text-[11px] text-slate-400 mb-5">Share of portfolio AUM exposed to each systemic constraint.</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <XAxis
                  type="number" domain={[0, 70]}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `${v}%`}
                />
                <YAxis
                  type="category" dataKey="name" width={130}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false} axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(15,23,42,0.03)' }}
                  contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(v: number | undefined) => [`${v ?? 0}% AUM`, 'Exposure']}
                />
                <Bar dataKey="aum_pct" radius={[0, 4, 4, 0]} barSize={11}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.concentration ? '#ef4444' : d.systemic ? '#178395' : '#93c5d0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100">
              {[['#ef4444', 'Concentrated risk'], ['#178395', 'Systemic'], ['#93c5d0', 'Company-specific']].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
                </span>
              ))}
            </div>
          </div>

          {/* Revenue Durability */}
          <div className="col-span-2 card flex flex-col">
            <p className="text-[12px] font-semibold text-slate-700 mb-0.5">Revenue Durability</p>
            <p className="text-[11px] text-slate-400 mb-5">Constraint exposure relative to revenue resilience.</p>
            <div className="flex flex-col gap-4 flex-1">
              {mockCollisionReports.map(r => (
                <Link key={r.id} href={`/company/${r.company_id}`} className="group block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {r.company_name.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[10px] font-semibold" style={{ color: durColor[r.revenue_durability] }}>
                      {r.revenue_durability}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="score-bar-track flex-1">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${Math.min(Math.abs(r.ebitda_extreme_pct) * 3.2, 100)}%`, background: durColor[r.revenue_durability] }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 w-14 text-right tabular-nums">
                      {r.ebitda_extreme_pct.toFixed(1)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Company table ── */}
        <div className="card">
          <p className="text-[12px] font-semibold text-slate-700 mb-0.5">Portfolio Companies</p>
          <p className="text-[11px] text-slate-400 mb-5">Analysis status, triage priority, and disclosure links.</p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Country</th>
                <th>Report</th>
                <th>Priority</th>
                <th>Net Impact</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCompanies.map(c => {
                const report = mockCollisionReports.find(r => r.company_id === c.id)
                return (
                  <tr key={c.id}>
                    <td className="font-medium text-slate-800 pr-4 text-[13px]">{c.name}</td>
                    <td className="text-slate-500 pr-4 text-[12px]">{c.sector}</td>
                    <td className="font-mono text-[11px] text-slate-400 pr-4">{c.jurisdiction}</td>
                    <td className="pr-4">
                      {c.filing_type
                        ? <span className="badge badge-low">{c.filing_type.replace('_', '\u00A0')}</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="pr-4">
                      <span className={`badge ${c.triage_priority === 'High' ? 'badge-high' : c.triage_priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                        {c.triage_priority}
                      </span>
                    </td>
                    <td className="pr-4 tabular-nums">
                      {c.upright_nir_score !== undefined
                        ? <span className={`font-mono text-[11px] font-semibold ${c.upright_nir_score >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {c.upright_nir_score >= 0 ? '+' : ''}{c.upright_nir_score.toFixed(2)}
                          </span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="pr-4">
                      <StatusPill s={c.disclosure_status} />
                    </td>
                    <td className="text-right">
                      {c.disclosure_status === 'complete' && (
                        <div className="flex items-center gap-3 justify-end">
                          <Link
                            href={`/company/${c.id}`}
                            className="flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            <Search size={10} />
                            Analyse
                          </Link>
                          {report && (
                            <Link
                              href={`/company/${c.id}`}
                              className="flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-800 px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              {report.collision_flag_count} flags
                              <ArrowUpRight size={10} />
                            </Link>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
