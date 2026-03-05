'use client'
import { useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, TrendingDown, Shield, Zap, FileText, ChevronRight, Activity } from 'lucide-react'
import {
  mockCompanies, mockCollisionReports, mockCollisionFlags, mockConstraintProfiles,
} from '@/lib/mock'
import { CONSTRAINT_LABELS, type ConstraintType, type CollisionFlag } from '@/lib/types'

// ── IC Questions ──────────────────────────────────────────────────────────────
const IC_QUESTIONS: Record<string, string> = {
  'cf-001': 'Given Ember DE grid queue data showing a 28-month average wait with the Q3 2025 target already missed, should the IC revise the 2027 capacity deployment assumption from 500MW to ≤160MW and model a corresponding €8–12M capex delay charge before approving the next drawdown?',
  'cf-002': 'With available grid injection capacity confirmed at 340MW vs. the 500MW required, should the IC require management to present a revised phased deployment schedule—and condition the 2027 revenue milestone on binding grid reservation agreements—before proceeding to investment decision?',
  'cf-003': 'Given the EEG 2023 reform consultation proposing a year-15 subsidy cliff not reflected in the current financial model, should the IC stress-test terminal value assumptions under a year-12 and year-15 wind-down scenario and disclose the NPV sensitivity to LPs before the next quarterly review?',
  'cf-004': 'With EU ETS forward prices at €78/tCO2 vs. the company\'s €55/tCO2 model assumption—a €23/tCO2 unhedged delta—should the IC require a revised EBITDA sensitivity table at €75/80/90 carbon price scenarios before proceeding to the next investment committee?',
  'cf-005': 'Given no confirmed cross-border H2 pipeline capacity between NL and DE and a pending regulatory approval, should the IC condition closing on management securing a binding offtake agreement with an alternative domestic supplier, with a 90-day cure period before commitment fees are triggered?',
}

const COLLISION_TO_CONSTRAINT: Record<string, ConstraintType> = {
  infrastructure_mismatch:  'infrastructure_capacity',
  timeline_mismatch:        'temporal_transition',
  regulatory_mismatch:      'incentive_market_design',
  financial_mismatch:       'financial_viability',
  supply_chain_mismatch:    'coordination_fragmentation',
  feasibility_mismatch:     'systemic_stress',
}

const SCALING_VERDICTS: Record<string, string> = {
  'co-001': 'Transition plan is physically coherent but institutionally constrained — grid queue delays and a pending EEG reform create a compounding 18–24 month slip that the current financial model does not price.',
  'co-002': 'Decarbonisation roadmap is structurally underfunded and cross-border hydrogen dependencies are unresolved; under tightening ETS conditions, EBITDA erosion of 13–22% is plausible within the holding period.',
  'co-003': 'Revenue streams are partially de-risked via long-term grid contracts; one minor DSO timeline mismatch is manageable and unlikely to alter the investment thesis materially.',
  'co-005': 'Green steel claims are not supported by available DRI-grade scrap volumes or H2 infrastructure; CBAM exposure is materially understated and the transition plan should be treated as a holding position, not a credible execution roadmap.',
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const SEV: Record<string, { color: string; bg: string; label: string }> = {
  High:   { color: '#E14A2D', bg: 'rgba(225,74,45,0.06)',   label: 'High' },
  Medium: { color: '#D97706', bg: 'rgba(217,119,6,0.06)',   label: 'Medium' },
  Low:    { color: '#178395', bg: 'rgba(23,131,149,0.06)',  label: 'Low' },
}

const DUR: Record<string, { color: string; bg: string; text: string }> = {
  Resilient: { color: '#16a34a', bg: 'rgba(22,163,74,0.07)',   text: 'Resilient' },
  Stable:    { color: '#178395', bg: 'rgba(23,131,149,0.07)',  text: 'Stable' },
  Exposed:   { color: '#D97706', bg: 'rgba(217,119,6,0.07)',   text: 'Exposed' },
  Fragile:   { color: '#E14A2D', bg: 'rgba(225,74,45,0.07)',   text: 'Fragile' },
}

const COLLISION_TYPE_LABELS: Record<string, string> = {
  infrastructure_mismatch:  'Infrastructure Mismatch',
  timeline_mismatch:        'Timeline Mismatch',
  regulatory_mismatch:      'Regulatory Mismatch',
  financial_mismatch:       'Financial Mismatch',
  supply_chain_mismatch:    'Supply Chain Mismatch',
  feasibility_mismatch:     'Feasibility Mismatch',
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedFlag, setSelectedFlag] = useState<CollisionFlag | null>(null)
  const [mode, setMode]                 = useState<'audit' | 'explore'>('audit')

  const company  = mockCompanies.find(c => c.id === id)
  const report   = mockCollisionReports.find(r => r.company_id === id)
  const flags    = mockCollisionFlags.filter(f => f.company_id === id)
  const profiles = mockConstraintProfiles.filter(p => p.company_id === id)

  if (!company) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <AlertTriangle size={28} color="#E14A2D" />
      <p style={{ color: '#475569', fontSize: 14 }}>Company not found</p>
      <Link href="/" style={{ fontSize: 13, color: '#178395', textDecoration: 'none' }}>← Back to portfolio</Link>
    </div>
  )

  const dur      = report ? DUR[report.revenue_durability] ?? DUR.Stable : null
  const verdict  = SCALING_VERDICTS[id]
  const flagMode = mode === 'audit' ? flags.filter(f => f.severity === 'High') : flags

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#FDFDFC' }}>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: '#94A3B8', textDecoration: 'none',
          transition: 'color 0.15s',
        }}>
          <ArrowLeft size={12} />
          Portfolio
        </Link>
        <ChevronRight size={11} color="#CBD5E1" />
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{company.name}</span>

        <div style={{ flex: 1 }} />

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, color: '#64748B',
            background: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 6, padding: '3px 8px',
          }}>{company.sector}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#475569',
            background: '#F1F5F9', border: '1px solid #E2E8F0',
            borderRadius: 6, padding: '3px 8px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>{company.jurisdiction}</span>
          {company.filing_type && (
            <span style={{
              fontSize: 11, fontWeight: 500, color: '#178395',
              background: 'rgba(23,131,149,0.07)', border: '1px solid rgba(23,131,149,0.2)',
              borderRadius: 6, padding: '3px 8px',
            }}>{company.filing_type}</span>
          )}
          {dur && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: dur.color, background: dur.bg,
              border: `1px solid ${dur.color}30`,
              borderRadius: 6, padding: '3px 10px',
            }}>{report!.revenue_durability}</span>
          )}
        </div>
      </div>

      {/* ── Company name header ──────────────────────────────────────────── */}
      <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
          {company.name}
        </h1>
      </div>

      {/* ── Verdict banner ───────────────────────────────────────────────── */}
      {report && verdict && (
        <div style={{ padding: '16px 28px 0', flexShrink: 0 }}>
          <div style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderLeft: `4px solid ${dur?.color ?? '#E2E8F0'}`,
            borderRadius: '0 10px 10px 0',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            gap: 20,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <Shield size={13} color={dur?.color ?? '#94A3B8'} strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Scaling Verdict
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: '#334155', maxWidth: 680 }}>{verdict}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexShrink: 0, alignItems: 'flex-start' }}>
              {[
                { label: 'Base', value: report.ebitda_base_pct, color: '#D97706' },
                { label: 'Tightening', value: report.ebitda_tightening_pct, color: '#E14A2D' },
                { label: 'Extreme', value: report.ebitda_extreme_pct, color: '#9f1239' },
              ].map(s => (
                <div key={s.label} style={{
                  textAlign: 'center',
                  background: '#FDFDFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: 8,
                  padding: '10px 14px',
                  minWidth: 80,
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.value > 0 ? '+' : ''}{s.value}%
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, fontWeight: 600, letterSpacing: '0.06em' }}>
                    EBITDA {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, gap: 20, padding: '20px 28px 32px', minHeight: 0 }}>

        {/* ── LEFT: Collision flags ─────────────────────────────────────── */}
        <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} color="#E14A2D" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                Collision Flags
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#E14A2D', background: 'rgba(225,74,45,0.08)',
                borderRadius: 99, padding: '1px 6px',
              }}>{flags.length}</span>
            </div>
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              borderRadius: 8,
              padding: 3,
              gap: 2,
            }}>
              {(['audit', 'explore'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    background: mode === m ? '#fff' : 'transparent',
                    color: mode === m ? '#0F172A' : '#94A3B8',
                    boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >{m}</button>
              ))}
            </div>
          </div>

          {/* Mode description */}
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: -4 }}>
            {mode === 'audit'
              ? `Showing ${flagMode.length} high-severity flag${flagMode.length !== 1 ? 's' : ''} requiring IC attention`
              : `Showing all ${flagMode.length} collision flag${flagMode.length !== 1 ? 's' : ''} across this company`
            }
          </p>

          {/* Flag cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {flagMode.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8', fontSize: 13 }}>
                No flags in {mode} mode
              </div>
            )}
            {flagMode.map(flag => {
              const sev = SEV[flag.severity] ?? SEV.Medium
              const isSelected = selectedFlag?.id === flag.id
              return (
                <button
                  key={flag.id}
                  onClick={() => setSelectedFlag(isSelected ? null : flag)}
                  style={{
                    display: 'flex',
                    gap: 0,
                    background: isSelected ? '#fff' : '#fff',
                    border: `1px solid ${isSelected ? sev.color + '50' : '#E2E8F0'}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected
                      ? `0 4px 16px rgba(0,0,0,0.1), 0 0 0 2px ${sev.color}20`
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s',
                    padding: 0,
                  }}
                >
                  {/* Severity strip */}
                  <div style={{ width: 4, background: sev.color, flexShrink: 0 }} />

                  {/* Content */}
                  <div style={{ flex: 1, padding: '12px 14px' }}>
                    {/* Type + severity row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: '#94A3B8',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        {COLLISION_TYPE_LABELS[flag.collision_type] ?? flag.collision_type}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: sev.color, background: sev.bg,
                        borderRadius: 4, padding: '2px 6px',
                      }}>{flag.severity}</span>
                    </div>

                    {/* Claim */}
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, marginBottom: 6 }}>
                      "{flag.claim_text}"
                    </p>

                    {/* Delta */}
                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>
                      {flag.delta_description}
                    </p>

                    {/* Source tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FileText size={10} color="#94A3B8" />
                      <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                        {flag.verification_source}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Constraint profiles summary */}
          {profiles.length > 0 && (
            <div style={{
              marginTop: 4,
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Constraint Profiles
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {profiles.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: p.is_bottleneck ? '#E14A2D' : '#CBD5E1',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 11, color: '#475569', flex: 1 }}>
                      {CONSTRAINT_LABELS[p.constraint_type] ?? p.constraint_type}
                    </span>
                    <span style={{
                      fontSize: 10, color: '#94A3B8',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{p.r_layer}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: p.is_bottleneck ? '#E14A2D' : '#94A3B8',
                    }}>
                      {p.is_bottleneck ? 'Bottleneck' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Evidence panel or overview ────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedFlag ? (
            /* ── Default: Company overview ─────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Prompt to select a flag */}
              <div style={{
                background: '#fff',
                border: '1px dashed #CBD5E1',
                borderRadius: 10,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(23,131,149,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Activity size={16} color="#178395" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 3 }}>Select a collision flag</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>
                    Click any flag on the left to view evidence, constraint mapping, and IC-ready questions.
                  </p>
                </div>
              </div>

              {/* SFDR Narrative */}
              {report?.sfdr_narrative && (
                <div style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '18px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    SFDR Narrative
                  </p>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                    {report.sfdr_narrative}
                  </p>
                </div>
              )}

              {/* Company metadata */}
              <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '18px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Company Overview
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {[
                    { label: 'Triage Priority', value: company.triage_priority ?? '—', color: company.triage_priority === 'High' ? '#E14A2D' : company.triage_priority === 'Medium' ? '#D97706' : '#178395' },
                    { label: 'NIR Score', value: company.upright_nir_score !== undefined ? (company.upright_nir_score > 0 ? '+' : '') + company.upright_nir_score.toFixed(2) : '—', color: (company.upright_nir_score ?? 0) >= 0 ? '#16a34a' : '#E14A2D' },
                    { label: 'Disclosure Status', value: company.disclosure_status ?? '—', color: company.disclosure_status === 'complete' ? '#16a34a' : company.disclosure_status === 'processing' ? '#D97706' : '#94A3B8' },
                    { label: 'Jurisdiction', value: company.jurisdiction, color: '#0F172A' },
                    { label: 'Filing Type', value: company.filing_type ?? 'N/A', color: '#475569' },
                    { label: 'Collision Flags', value: String(report?.collision_flag_count ?? 0), color: '#E14A2D' },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: '#FDFDFC',
                      border: '1px solid #F1F5F9',
                      borderRadius: 8,
                      padding: '10px 14px',
                    }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 5 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ── Evidence panel ─────────────────────────────────────────── */
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: SEV[selectedFlag.severity]?.color ?? '#94A3B8',
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    Evidence: {COLLISION_TYPE_LABELS[selectedFlag.collision_type] ?? selectedFlag.collision_type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFlag(null)}
                  style={{
                    background: 'none', border: '1px solid #E2E8F0',
                    borderRadius: 6, cursor: 'pointer', padding: '4px 10px',
                    fontSize: 11, color: '#94A3B8', fontWeight: 500,
                  }}
                >
                  ✕ Close
                </button>
              </div>

              {/* ① Company Claim */}
              <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '16px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <SectionLabel icon={<FileText size={11} />} label="Company Claim" />
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>
                  "{selectedFlag.claim_text}"
                </p>
              </div>

              {/* ② SIF Constraint */}
              {(() => {
                const cType = COLLISION_TO_CONSTRAINT[selectedFlag.collision_type]
                const cLabel = cType ? CONSTRAINT_LABELS[cType] : null
                return cLabel ? (
                  <div style={{
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #178395',
                    borderRadius: '0 10px 10px 0',
                    padding: '16px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    <SectionLabel icon={<Zap size={11} />} label="SIF Constraint Type" color="#178395" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: '#178395',
                        background: 'rgba(23,131,149,0.07)',
                        border: '1px solid rgba(23,131,149,0.2)',
                        borderRadius: 6, padding: '4px 12px',
                      }}>{cLabel}</span>
                      <span style={{ fontSize: 12, color: '#64748B' }}>
                        mapped from <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{selectedFlag.collision_type}</span>
                      </span>
                    </div>
                  </div>
                ) : null
              })()}

              {/* ③ Evidence & Delta */}
              <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '16px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <SectionLabel icon={<TrendingDown size={11} />} label="Mechanism & Evidence" />
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.65, marginBottom: 12 }}>
                  {selectedFlag.delta_description}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: 6, padding: '5px 10px',
                }}>
                  <FileText size={10} color="#94A3B8" />
                  <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                    {selectedFlag.verification_source}
                  </span>
                </div>
              </div>

              {/* ④ Scaling Impact */}
              {report && (
                <div style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <SectionLabel label="Portfolio Impact Scenarios" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { label: 'Base Case', value: report.ebitda_base_pct, desc: 'Current trajectory', color: '#D97706' },
                      { label: 'Tightening', value: report.ebitda_tightening_pct, desc: 'Regulatory acceleration', color: '#E14A2D' },
                      { label: 'Extreme Stress', value: report.ebitda_extreme_pct, desc: 'Full constraint binding', color: '#9f1239' },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: '#FDFDFC',
                        border: `1px solid ${s.color}30`,
                        borderTop: `3px solid ${s.color}`,
                        borderRadius: 8,
                        padding: '12px 14px',
                      }}>
                        <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
                          {s.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                          {s.value > 0 ? '+' : ''}{s.value}%
                        </div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ⑤ IC Question */}
              {IC_QUESTIONS[selectedFlag.id] && (
                <div style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)',
                  border: '1px solid #334155',
                  borderRadius: 10,
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 5,
                      background: 'rgba(23,131,149,0.25)',
                      border: '1px solid rgba(23,131,149,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Activity size={11} color="#5eead4" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#5eead4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      IC Question
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.7 }}>
                    {IC_QUESTIONS[selectedFlag.id]}
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helper component ───────────────────────────────────────────────────────────
function SectionLabel({
  label, icon, color = '#94A3B8',
}: {
  label: string
  icon?: React.ReactNode
  color?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
      {icon && <span style={{ color }}>{icon}</span>}
      <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}
