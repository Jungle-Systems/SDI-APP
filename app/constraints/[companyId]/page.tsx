'use client'
import { use } from 'react'
import { mockCompanies, mockConstraintProfiles } from '@/lib/mock'
import { CONSTRAINT_LABELS, CONSTRAINT_GROUP } from '@/lib/types'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const rLayerBadge = (r: string) => (
  <span className={`badge badge-${r.toLowerCase()}`}>{r}</span>
)

function ScoreBar({ label, value, max = 1 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = pct > 70 ? '#E14A2D' : pct > 45 ? '#D97706' : '#178395'
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[9px] uppercase tracking-widest text-[#9CA3AF] w-6">{label}</span>
      <div className="score-bar-track flex-1">
        <div className="score-bar-fill transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px] text-[#6B7280] w-8 text-right">{value.toFixed(2)}</span>
    </div>
  )
}

export default function ConstraintsPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params)
  const company = mockCompanies.find(c => c.id === companyId) ?? mockCompanies[0]
  const profiles = mockConstraintProfiles.filter(p => p.company_id === company.id)
  const bottlenecks = profiles.filter(p => p.is_bottleneck)

  const radarData = profiles.map(p => ({
    constraint: CONSTRAINT_LABELS[p.constraint_type].split(' & ')[0],
    SI: p.si_score * 100,
    AL: p.al_score * 100,
    SV: p.sv_score * 100,
  }))

  const grouped = profiles.reduce<Record<string, typeof profiles>>((acc, p) => {
    const g = CONSTRAINT_GROUP[p.constraint_type]
    if (!acc[g]) acc[g] = []
    acc[g].push(p)
    return acc
  }, {})

  return (
    <div className="px-10 py-10 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#178395] mb-4 transition-colors">
          <ArrowLeft size={10} /> Portfolio
        </Link>
        <div className="section-label mb-3">SEC_03 — Constraint Profile</div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">{company.name}</h1>
            <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
              <span>{company.sector}</span>
              <span className="font-mono">{company.jurisdiction}</span>
              {company.filing_type && <span className="badge badge-low">{company.filing_type}</span>}
            </div>
          </div>
          <Link href={`/collisions/${company.id}`} className="flex items-center gap-2 px-4 py-2 bg-[#178395] text-white text-[12px] rounded-sm hover:bg-[#0F6070] transition-colors">
            View Collision Report <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="mono-label text-[#9CA3AF] mb-2">Constraints Identified</div>
          <div className="text-3xl font-light text-[#111827]">{profiles.length}</div>
        </div>
        <div className="card">
          <div className="mono-label text-[#9CA3AF] mb-2">Bottlenecks (4/4 tests)</div>
          <div className="text-3xl font-light text-[#E14A2D]">{bottlenecks.length}</div>
        </div>
        <div className="card">
          <div className="mono-label text-[#9CA3AF] mb-2">Primary R-Layer</div>
          <div className="text-3xl font-light">
            <span className={`badge badge-${profiles[0]?.r_layer.toLowerCase() ?? 'r1'} text-lg px-3 py-1`}>
              {profiles[0]?.r_layer ?? '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-8">
        {/* Radar */}
        <div className="col-span-2 card">
          <div className="section-label mb-4">Scoring Profile</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="constraint" tick={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'monospace' }} />
              <Radar name="SI" dataKey="SI" stroke="#178395" fill="#178395" fillOpacity={0.15} strokeWidth={1.5} />
              <Radar name="AL" dataKey="AL" stroke="#E14A2D" fill="#E14A2D" fillOpacity={0.08} strokeWidth={1} strokeDasharray="3 3" />
              <Tooltip contentStyle={{ border: '1px solid #E5E7EB', fontSize: 11, background: '#FDFDFC' }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-1">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280]"><span className="inline-block w-3 h-px bg-[#178395]" /> Structural Importance</span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280]"><span className="inline-block w-3 h-px bg-[#E14A2D]" /> Activation Likelihood</span>
          </div>
        </div>

        {/* Constraint list */}
        <div className="col-span-3 card">
          <div className="section-label mb-4">Constraint Detail</div>
          <div className="flex flex-col gap-5">
            {profiles.map(p => (
              <div key={p.id} className={`pl-3 border-l-2 ${p.is_bottleneck ? 'border-[#E14A2D]' : 'border-[#E5E7EB]'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[13px] font-medium text-[#111827] mb-0.5">{CONSTRAINT_LABELS[p.constraint_type]}</div>
                    <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">{CONSTRAINT_GROUP[p.constraint_type]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rLayerBadge(p.r_layer)}
                    {p.is_bottleneck && <span className="badge badge-high">Bottleneck</span>}
                    <span className="badge badge-low">{p.binding_mechanism}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <ScoreBar label="SI" value={p.si_score} />
                  <ScoreBar label="AL" value={p.al_score} />
                  <ScoreBar label="SV" value={p.sv_score} />
                  <ScoreBar label="LE" value={p.le_score} />
                  <ScoreBar label="TE" value={p.te_score} />
                </div>
                {p.is_bottleneck && (
                  <div className="mt-2 text-[10px] font-mono text-[#9CA3AF]">
                    {p.bottleneck_tests_passed}/4 qualification tests passed
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Axis legend */}
      <div className="card">
        <div className="section-label mb-4">Scoring Axis Reference</div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { code: 'SI', name: 'Structural Importance', desc: 'Non-bypassability and upstream dependency. Maps to R3.' },
            { code: 'AL', name: 'Activation Likelihood', desc: 'Probability bottleneck binds in 18–24 months. Maps to R2.' },
            { code: 'SV', name: 'Severity if Activated', desc: 'Magnitude of operational or financial impact.' },
            { code: 'LE', name: 'Leverage Elasticity', desc: 'Responsiveness to capital or intervention. Lower = more entrenched.' },
            { code: 'TE', name: 'Time-to-Effect', desc: 'Speed at which lever produces outcome if applied.' },
          ].map(a => (
            <div key={a.code}>
              <div className="font-mono text-[11px] text-[#178395] mb-1">{a.code}</div>
              <div className="text-[11px] font-medium text-[#111827] mb-1">{a.name}</div>
              <div className="text-[10px] text-[#9CA3AF] leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
