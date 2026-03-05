'use client'
import { mockPortfolio, mockCompanies, mockPortfolioExposure, mockCollisionReports } from '@/lib/mock'
import { CONSTRAINT_LABELS } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const fmt = (n: number) => `€${(n / 1_000_000).toFixed(0)}M`

const durabilityColor: Record<string, string> = {
  Resilient: '#059669', Stable: '#178395', Exposed: '#D97706', Fragile: '#E14A2D',
}

function statusIcon(s: string) {
  if (s === 'complete')   return <CheckCircle size={11} className="text-[#059669]" />
  if (s === 'processing') return <Clock size={11} className="text-[#178395]" />
  if (s === 'failed')     return <AlertTriangle size={11} className="text-[#E14A2D]" />
  return <Clock size={11} className="text-[#9CA3AF]" />
}

export default function DashboardPage() {
  const chartData = mockPortfolioExposure.map(e => ({
    name: CONSTRAINT_LABELS[e.constraint_type].split(' & ')[0],
    aum_pct: e.aum_pct,
    systemic: e.is_systemic,
    concentration: e.concentration_flag,
  }))

  const totalFlags = mockCollisionReports.reduce((s, r) => s + r.collision_flag_count, 0)
  const fragileCount = mockCollisionReports.filter(r => r.revenue_durability === 'Fragile').length
  const completeCount = mockCompanies.filter(c => c.disclosure_status === 'complete').length

  return (
    <div className="px-10 py-10 max-w-6xl">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">
          {mockPortfolio.name}
        </h1>
        <div className="flex items-center gap-5 text-[13px] text-[#6B7280]">
          <span>{mockPortfolio.client_name}</span>
          <span className="text-[#E5E7EB]">|</span>
          <span>{fmt(mockPortfolio.aum_eur)} AUM</span>
          <span className="text-[#E5E7EB]">|</span>
          <span className="badge badge-low">{mockPortfolio.sfdr_article}</span>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-2">
          Systemic constraint exposure across portfolio companies — based on CSRD &amp; IFRS disclosure analysis.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Companies', value: String(mockPortfolio.company_count), sub: `${completeCount} analysed` },
          { label: 'Risk Flags', value: String(totalFlags), sub: 'unverified claims found', accent: true },
          { label: 'At-Risk Holdings', value: String(fragileCount), sub: 'fragile revenue durability', alert: true },
          { label: 'AUM Exposed', value: '58%', sub: 'transition constraint risk', warn: true },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="mono-label text-[#9CA3AF] mb-2">{k.label}</div>
            <div className={`text-3xl font-light mb-1 ${k.alert ? 'text-[#E14A2D]' : k.warn ? 'text-[#D97706]' : 'text-[#111827]'}`}>
              {k.value}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6 mb-10">
        {/* AUM Exposure Chart */}
        <div className="col-span-3 card">
          <div className="text-[11px] font-semibold text-[#374151] mb-1">AUM Exposure by Constraint Type</div>
          <p className="text-[11px] text-[#9CA3AF] mb-5">What share of portfolio AUM is exposed to each type of systemic constraint.</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={125} tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(23,131,149,0.04)' }}
                contentStyle={{ border: '1px solid #E5E7EB', borderRadius: 2, fontSize: 11, background: '#FDFDFC' }}
                formatter={(v: number | undefined) => [`${v ?? 0}% AUM`, "Exposure" as const]}
              />
              <Bar dataKey="aum_pct" radius={[0, 2, 2, 0]} barSize={12}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.concentration ? '#E14A2D' : d.systemic ? '#178395' : '#93C5D0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-4">
            {[['#E14A2D', 'Concentrated risk'], ['#178395', 'Systemic'], ['#93C5D0', 'Company-specific']].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280]">
                <span className="inline-block w-2 h-2 rounded-sm" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Revenue Durability */}
        <div className="col-span-2 card">
          <div className="text-[11px] font-semibold text-[#374151] mb-1">Revenue Durability</div>
          <p className="text-[11px] text-[#9CA3AF] mb-5">How exposed each company&apos;s revenue is to constraint tightening.</p>
          <div className="flex flex-col gap-4">
            {mockCollisionReports.map(r => (
              <Link key={r.id} href={`/claim-verification/${r.company_id}`} className="group block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-[#111827] group-hover:text-[#178395] transition-colors">{r.company_name.split(' ')[0]}</span>
                  <span className="font-mono text-[10px]" style={{ color: durabilityColor[r.revenue_durability] }}>
                    {r.revenue_durability}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="score-bar-track flex-1">
                    <div className="score-bar-fill" style={{ width: `${Math.min(Math.abs(r.ebitda_extreme_pct) * 3.2, 100)}%`, background: durabilityColor[r.revenue_durability] }} />
                  </div>
                  <span className="font-mono text-[10px] text-[#9CA3AF] w-14 text-right">
                    {r.ebitda_extreme_pct.toFixed(1)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Company table */}
      <div className="card">
        <div className="text-[11px] font-semibold text-[#374151] mb-1">Portfolio Companies</div>
        <p className="text-[11px] text-[#9CA3AF] mb-5">Analysis status and triage priority for each portfolio company.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Sector</th>
              <th>Country</th>
              <th>Report Type</th>
              <th>Priority</th>
              <th>Net Impact</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockCompanies.map(c => {
              const report = mockCollisionReports.find(r => r.company_id === c.id)
              return (
                <tr key={c.id}>
                  <td className="font-medium text-[#111827] pr-4">{c.name}</td>
                  <td className="text-[#6B7280] pr-4 text-[12px]">{c.sector}</td>
                  <td className="font-mono text-[11px] text-[#6B7280] pr-4">{c.jurisdiction}</td>
                  <td className="pr-4">
                    {c.filing_type
                      ? <span className="badge badge-low">{c.filing_type.replace('_', '\u00A0')}</span>
                      : <span className="text-[#9CA3AF] text-xs">—</span>}
                  </td>
                  <td className="pr-4">
                    <span className={`badge ${c.triage_priority === 'High' ? 'badge-high' : c.triage_priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                      {c.triage_priority}
                    </span>
                  </td>
                  <td className="pr-4">
                    {c.upright_nir_score !== undefined ? (
                      <span className={`font-mono text-[11px] ${c.upright_nir_score >= 0 ? 'text-[#059669]' : 'text-[#E14A2D]'}`}>
                        {c.upright_nir_score >= 0 ? '+' : ''}{c.upright_nir_score.toFixed(2)}
                      </span>
                    ) : <span className="text-[#9CA3AF]">—</span>}
                  </td>
                  <td className="pr-4">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(c.disclosure_status)}
                      <span className="text-[11px] text-[#6B7280] capitalize">{c.disclosure_status}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    {c.disclosure_status === 'complete' && (
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/constraints/${c.id}`} className="text-[11px] text-[#178395] hover:underline">Constraints</Link>
                        <span className="text-[#E5E7EB]">|</span>
                        <Link href={`/claim-verification/${c.id}`} className="text-[11px] text-[#E14A2D] hover:underline flex items-center gap-1">
                          {report ? `${report.collision_flag_count} flags` : 'Report'}
                          <ArrowRight size={10} />
                        </Link>
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
  )
}
