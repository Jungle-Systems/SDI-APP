'use client'
import { use } from 'react'
import { mockCompanies, mockCollisionReports, mockCollisionFlags } from '@/lib/mock'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const durabilityColor: Record<string, string> = {
  Resilient: '#059669', Stable: '#178395', Exposed: '#D97706', Fragile: '#E14A2D',
}

const collisionTypeLabel: Record<string, string> = {
  feasibility_mismatch:    'Feasibility',
  regulatory_mismatch:     'Regulatory',
  supply_chain_mismatch:   'Supply Chain',
  infrastructure_mismatch: 'Infrastructure',
  timeline_mismatch:       'Timeline',
  financial_mismatch:      'Financial',
}

const reviewBadge = (s: string) => {
  const styles: Record<string, string> = { draft: 'badge-medium', under_review: 'badge-low', approved: 'badge-pass' }
  return <span className={`badge ${styles[s] ?? 'badge-low'}`}>{s.replace('_', '\u00A0')}</span>
}

export default function CollisionPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params)
  const company = mockCompanies.find(c => c.id === companyId) ?? mockCompanies[0]
  const report = mockCollisionReports.find(r => r.company_id === company.id)
  const flags = mockCollisionFlags.filter(f => f.company_id === company.id)

  if (!report) return (
    <div className="px-10 py-10">
      <Link href="/" className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#178395] mb-4 transition-colors">
        <ArrowLeft size={10} /> Portfolio
      </Link>
      <p className="text-[#9CA3AF] text-sm">No collision report available for this company yet.</p>
    </div>
  )

  const scenarios = [
    { label: 'Base', key: 'base', value: report.ebitda_base_pct, color: '#178395' },
    { label: 'Tightening', key: 'tightening', value: report.ebitda_tightening_pct, color: '#D97706' },
    { label: 'Extreme', key: 'extreme', value: report.ebitda_extreme_pct, color: '#E14A2D' },
  ]

  const durColor = durabilityColor[report.revenue_durability]

  return (
    <div className="px-10 py-10 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#178395] mb-4 transition-colors">
          <ArrowLeft size={10} /> Portfolio
        </Link>
        <div className="section-label mb-3">SEC_04 — Collision Report</div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">{company.name}</h1>
            <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
              <span>{company.sector}</span>
              <span className="font-mono">{company.jurisdiction}</span>
              {reviewBadge(report.review_status)}
            </div>
          </div>
          <Link href={`/constraints/${company.id}`} className="text-[11px] text-[#178395] hover:underline flex items-center gap-1">
            View Constraints <ExternalLink size={10} />
          </Link>
        </div>
      </div>

      {/* Revenue durability + EBITDA grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card col-span-1">
          <div className="mono-label text-[#9CA3AF] mb-3">Revenue Durability</div>
          <div className="text-2xl font-medium mb-2" style={{ color: durColor }}>
            {report.revenue_durability}
          </div>
          <div className="score-bar-track mb-3">
            <div className="score-bar-fill" style={{
              width: `${({ Resilient: 15, Stable: 35, Exposed: 65, Fragile: 90 }[report.revenue_durability] ?? 50)}%`,
              background: durColor
            }} />
          </div>
          <div className="text-[10px] text-[#9CA3AF] leading-relaxed">
            {report.collision_flag_count} collision flags identified across CSRD/IFRS filing
          </div>
        </div>

        <div className="card col-span-2">
          <div className="section-label mb-4">EBITDA Margin Sensitivity</div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {scenarios.map(s => (
              <div key={s.key}>
                <div className="mono-label text-[#9CA3AF] mb-1">{s.label}</div>
                <div className="text-2xl font-light" style={{ color: s.color }}>
                  {s.value > 0 ? '+' : ''}{s.value.toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#9CA3AF] mt-0.5">EBITDA delta</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={scenarios} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
              <YAxis hide domain={[Math.min(...scenarios.map(s => s.value)) * 1.3, 0]} />
              <Tooltip
                contentStyle={{ border: '1px solid #E5E7EB', fontSize: 11, background: '#FDFDFC' }}
                formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)}% EBITDA`, "Delta" as const]}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={40}>
                {scenarios.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collision flags */}
      {flags.length > 0 && (
        <div className="card mb-8">
          <div className="section-label mb-5">SEC_05 — Collision Flags</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Company Claim</th>
                <th>Verification Source</th>
                <th>Delta</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {flags.map(f => (
                <tr key={f.id}>
                  <td className="pr-4">
                    <span className="badge badge-low">{collisionTypeLabel[f.collision_type]}</span>
                  </td>
                  <td className="pr-4 text-[12px] text-[#111827] max-w-[180px]">
                    <span className="italic">&ldquo;{f.claim_text}&rdquo;</span>
                  </td>
                  <td className="pr-4 text-[11px] font-mono text-[#6B7280] max-w-[140px]">{f.verification_source}</td>
                  <td className="pr-4 text-[12px] text-[#111827] max-w-[200px] leading-relaxed">{f.delta_description}</td>
                  <td>
                    <span className={`badge ${f.severity === 'High' ? 'badge-high' : f.severity === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                      {f.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SFDR Narrative */}
      <div className="card">
        <div className="section-label mb-4">SEC_06 — SFDR Narrative</div>
        <div className="pl-4 border-l-2 border-[#178395]">
          <p className="text-[13px] text-[#374151] leading-relaxed">{report.sfdr_narrative}</p>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB]">
          <div className="text-[10px] font-mono text-[#9CA3AF]">
            Generated by Jungle × Seawolf SDI Engine · Review status: {report.review_status.replace('_', ' ')}
          </div>
          <Link href="/export" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E14A2D] text-white text-[11px] rounded-sm hover:bg-[#B83820] transition-colors">
            Export Report
          </Link>
        </div>
      </div>
    </div>
  )
}
