'use client'
import { useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, ChevronRight, AlertTriangle, TrendingDown, ExternalLink } from 'lucide-react'
import {
  mockCompanies, mockCollisionReports, mockCollisionFlags, mockConstraintProfiles,
} from '@/lib/mock'
import { CONSTRAINT_LABELS, type ConstraintType, type CollisionFlag } from '@/lib/types'

// ── IC Questions (AI-generated, keyed by flag id) ──────────────────────
const IC_QUESTIONS: Record<string, string> = {
  'cf-001': 'Given Ember DE grid queue data showing a 28-month average wait with the Q3 2025 target already missed, should the IC revise the 2027 capacity deployment assumption from 500MW to ≤160MW and model a corresponding €8–12M capex delay charge before approving the next drawdown?',
  'cf-002': 'With available grid injection capacity confirmed at 340MW vs. the 500MW required, should the IC require management to present a revised phased deployment schedule—and condition the 2027 revenue milestone on binding grid reservation agreements—before proceeding to investment decision?',
  'cf-003': 'Given the EEG 2023 reform consultation proposing a year-15 subsidy cliff not reflected in the current financial model, should the IC stress-test terminal value assumptions under a year-12 and year-15 wind-down scenario and disclose the NPV sensitivity to LPs before the next quarterly review?',
  'cf-004': 'With EU ETS forward prices at €78/tCO2 vs. the company\'s €55/tCO2 model assumption—a €23/tCO2 unhedged delta—should the IC require a revised EBITDA sensitivity table at €75/80/90 carbon price scenarios before proceeding to the next investment committee?',
  'cf-005': 'Given no confirmed cross-border H2 pipeline capacity between NL and DE and a pending regulatory approval, should the IC condition closing on management securing a binding offtake agreement with an alternative domestic supplier, with a 90-day cure period before commitment fees are triggered?',
}

// ── Constraint type inferred from collision type ───────────────────────
const COLLISION_TO_CONSTRAINT: Record<string, ConstraintType> = {
  infrastructure_mismatch: 'infrastructure_capacity',
  timeline_mismatch:       'temporal_transition',
  regulatory_mismatch:     'incentive_market_design',
  financial_mismatch:      'financial_viability',
  supply_chain_mismatch:   'coordination_fragmentation',
  feasibility_mismatch:    'systemic_stress',
}

// ── Scaling verdicts (AI-generated, keyed by company_id) ──────────────
const SCALING_VERDICTS: Record<string, string> = {
  'co-001': 'Transition plan is physically coherent but institutionally constrained—grid queue delays and a pending EEG reform create a compounding 18–24 month slip that the current financial model does not price.',
  'co-002': 'Decarbonisation roadmap is structurally underfunded and cross-border hydrogen dependencies are unresolved; under tightening ETS conditions, EBITDA erosion of 13–22% is plausible within the holding period.',
  'co-003': 'Revenue streams are partially de-risked via long-term grid contracts; one minor DSO timeline mismatch is manageable and unlikely to alter the investment thesis materially.',
  'co-005': 'Green steel claims are not supported by available DRI-grade scrap volumes or H2 infrastructure; CBAM exposure is materially understated and the transition plan should be treated as a holding position, not a credible execution roadmap.',
}

// ── Severity helpers ───────────────────────────────────────────────────
const SEV_COLOR: Record<string, string> = {
  High:   '#E14A2D',
  Medium: '#D97706',
  Low:    '#178395',
}
const DUR_COLOR: Record<string, string> = {
  Resilient: '#16a34a',
  Stable:    '#178395',
  Exposed:   '#D97706',
  Fragile:   '#E14A2D',
}
const DUR_BG: Record<string, string> = {
  Resilient: '#f0fdf4',
  Stable:    '#ecfeff',
  Exposed:   '#fffbeb',
  Fragile:   '#fff1f0',
}

function SevDot({ sev }: { sev: string }) {
  return (
    <span
      style={{ width: 7, height: 7, borderRadius: '50%', background: SEV_COLOR[sev] ?? '#94a3b8', flexShrink: 0, display: 'inline-block', marginTop: 2 }}
    />
  )
}

// ── Evidence Panel ─────────────────────────────────────────────────────
function EvidencePanel({ flag, onClose }: { flag: CollisionFlag; onClose: () => void }) {
  const constraintType = COLLISION_TO_CONSTRAINT[flag.collision_type] ?? 'systemic_stress'
  const icQ = IC_QUESTIONS[flag.id]

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#FDFDFC',
        borderLeft: '2px solid #000',
        boxShadow: '-6px 0 0 #000',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, overflowY: 'auto',
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #000', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p className="jgl-mono" style={{ marginBottom: 6 }}>Evidence Panel</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SevDot sev={flag.severity} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
              {flag.collision_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#475569', flexShrink: 0, marginTop: 2 }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: '0 24px 32px', flex: 1 }}>

        {/* 1. Claim */}
        <div className="evidence-section">
          <p className="jgl-mono" style={{ marginBottom: 8 }}>① Disclosed Claim</p>
          <div style={{ background: '#f8f8f7', border: '1px solid #e2e8f0', padding: '10px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.5, fontStyle: 'italic' }}>
              &ldquo;{flag.claim_text}&rdquo;
            </p>
          </div>
        </div>

        {/* 2. Constraint */}
        <div className="evidence-section">
          <p className="jgl-mono" style={{ marginBottom: 8 }}>② SIF Constraint Activated</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                background: '#fff', border: `2px solid ${SEV_COLOR[flag.severity]}`,
                boxShadow: `2px 2px 0 ${SEV_COLOR[flag.severity]}`,
                padding: '6px 12px', fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: SEV_COLOR[flag.severity],
              }}
            >
              {CONSTRAINT_LABELS[constraintType]}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 8, lineHeight: 1.5 }}>
            This constraint operates at the institutional / infrastructure layer—company-level action alone cannot remove it.
          </p>
        </div>

        {/* 3. Mechanism */}
        <div className="evidence-section">
          <p className="jgl-mono" style={{ marginBottom: 8 }}>③ Binding Mechanism</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ background: '#0F172A', color: '#fff', padding: '4px 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {flag.collision_type.split('_')[0].toUpperCase()} CONSTRAINT
            </div>
            <div style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '4px 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {flag.verification_source}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 10, lineHeight: 1.6 }}>
            {flag.delta_description}
          </p>
        </div>

        {/* 4. Scaling Impact */}
        <div className="evidence-section">
          <p className="jgl-mono" style={{ marginBottom: 10 }}>④ Scaling Impact</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Base', val: '−4.2%', note: 'Policy continues' },
              { label: 'Tight', val: '−8.7%', note: 'Constraint bites' },
              { label: 'Extreme', val: '−14.1%', note: 'Full activation', bold: true },
            ].map(s => (
              <div key={s.label}
                style={{
                  border: s.bold ? '2px solid #E14A2D' : '1px solid #e2e8f0',
                  boxShadow: s.bold ? '2px 2px 0 #E14A2D' : 'none',
                  padding: '10px 10px 8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, color: '#E14A2D', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, letterSpacing: '0.05em' }}>{s.note}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>EBITDA margin impact · portfolio-weighted</p>
        </div>

        {/* 5. IC Question */}
        {icQ && (
          <div className="evidence-section">
            <p className="jgl-mono" style={{ marginBottom: 10 }}>⑤ IC Question</p>
            <div
              style={{
                background: '#0F172A',
                border: '1.5px solid #000',
                boxShadow: '3px 3px 0 #000',
                padding: '16px 18px',
              }}
            >
              <p style={{ fontSize: 13, color: '#F8FAFC', lineHeight: 1.7, fontWeight: 500 }}>
                {icQ}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Node types for linear map ──────────────────────────────────────────
type NodeType = 'company' | 'claim' | 'constraint' | 'source'

const NODE_STYLES: Record<NodeType, React.CSSProperties> = {
  company:    { background: '#178395', color: '#fff', border: '1.5px solid #000' },
  claim:      { background: '#fff', color: '#0F172A', border: '1.5px dashed #94a3b8' },
  constraint: { background: '#fff', color: '#0F172A', border: '1.5px solid #000' },
  source:     { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' },
}

function NodePill({ type, label, severity }: { type: NodeType; label: string; severity?: string }) {
  const baseStyle = NODE_STYLES[type]
  const overrideStyle: React.CSSProperties = type === 'constraint' && severity
    ? { ...baseStyle, borderColor: SEV_COLOR[severity], borderWidth: 2, color: SEV_COLOR[severity] }
    : baseStyle

  return (
    <div className="node-block">
      <div className="node-pill" style={overrideStyle} title={label}>
        {label.length > 18 ? label.slice(0, 17) + '…' : label}
      </div>
      <span className="node-label">
        {type === 'company' ? 'company' : type === 'claim' ? 'disclosed claim' : type === 'constraint' ? 'sif constraint' : 'source'}
      </span>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────
export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null)
  const [mapMode, setMapMode] = useState<'audit' | 'explore'>('audit')

  const company    = mockCompanies.find(c => c.id === id)
  const report     = mockCollisionReports.find(r => r.company_id === id)
  const flags      = mockCollisionFlags.filter(f => f.company_id === id)
  const profiles   = mockConstraintProfiles.filter(p => p.company_id === id)
  const selectedFlag = flags.find(f => f.id === selectedFlagId) ?? null

  if (!company) {
    return (
      <div style={{ padding: 48, fontFamily: "'Raleway', sans-serif" }}>
        <p style={{ color: '#94a3b8' }}>Company not found.</p>
        <Link href="/" style={{ color: '#178395', fontSize: 13 }}>← Back to Portfolio</Link>
      </div>
    )
  }

  const durability = report?.revenue_durability ?? 'Stable'
  const verdict    = SCALING_VERDICTS[id]
  const displayFlags = flags.slice(0, 6)
  const overflow   = Math.max(0, flags.length - 6)

  // Explore mode uses constraint profiles instead of flags
  const auditNodes = displayFlags
  const exploreNodes = profiles.slice(0, 6)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--jgl-bg)',
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: '18px 32px',
        borderBottom: '1.5px solid #000',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#475569', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
            textDecoration: 'none', textTransform: 'uppercase',
          }}>
            <ArrowLeft size={13} />
            Portfolio
          </Link>
          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />
          <div>
            <p className="jgl-mono" style={{ marginBottom: 3 }}>
              {company.sector} · {company.jurisdiction} · {company.filing_type ?? 'N/A'}
            </p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px', lineHeight: 1 }}>
              {company.name}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Durability badge */}
          <div style={{
            background: DUR_BG[durability],
            color: DUR_COLOR[durability],
            border: `2px solid ${DUR_COLOR[durability]}`,
            boxShadow: `2px 2px 0 ${DUR_COLOR[durability]}`,
            padding: '4px 12px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {durability}
          </div>

          {/* Flag count */}
          {report && (
            <div style={{
              background: '#fff',
              color: '#E14A2D',
              border: '2px solid #E14A2D',
              boxShadow: '2px 2px 0 #E14A2D',
              padding: '4px 12px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {report.collision_flag_count} Flags
            </div>
          )}

          {/* Review status */}
          {report && (
            <div style={{
              background: '#f1f5f9', color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '4px 12px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {report.review_status.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>

      {/* ── Scaling Verdict ── */}
      {verdict && (
        <div style={{
          margin: '24px 32px 0',
          borderLeft: `5px solid ${DUR_COLOR[durability]}`,
          background: '#fff',
          border: `1.5px solid #000`,
          borderLeft: `5px solid ${DUR_COLOR[durability]}`,
          boxShadow: '4px 4px 0 #000',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}>
          <div>
            <p className="jgl-mono" style={{ marginBottom: 6 }}>Scaling Verdict</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', lineHeight: 1.6, maxWidth: 860 }}>
              {verdict}
            </p>
            {report && (
              <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#475569' }}>
                  Extreme scenario: <strong style={{ color: '#E14A2D' }}>{report.ebitda_extreme_pct.toFixed(1)}% EBITDA</strong>
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#475569' }}>
                  Base: <strong>{report.ebitda_base_pct.toFixed(1)}%</strong>
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#475569' }}>
                  Tightening: <strong>{report.ebitda_tightening_pct.toFixed(1)}%</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main body ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: 0,
        margin: '20px 32px 0',
        border: '1.5px solid #000',
        boxShadow: '4px 4px 0 #000',
        background: '#fff',
      }}>

        {/* ── Collision List (left) ── */}
        <div style={{ borderRight: '1.5px solid #000' }}>
          <div style={{ padding: '14px 16px 12px', borderBottom: '1.5px solid #000' }}>
            <p className="jgl-mono">Collision List</p>
            <p style={{ fontSize: 11, color: '#475569', marginTop: 3, fontFamily: "'Raleway', sans-serif" }}>
              {flags.length} disclosure mismatches
            </p>
          </div>

          {displayFlags.length > 0 ? displayFlags.map(flag => (
            <div
              key={flag.id}
              className={`collision-item ${selectedFlagId === flag.id ? 'active' : ''}`}
              onClick={() => setSelectedFlagId(selectedFlagId === flag.id ? null : flag.id)}
            >
              <SevDot sev={flag.severity} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="ci-type" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 3 }}>
                  {flag.collision_type.replace(/_/g, ' ')}
                </p>
                <p className="ci-claim" style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {flag.claim_text}
                </p>
                <p style={{
                  fontSize: 10, color: selectedFlagId === flag.id ? 'rgba(255,255,255,0.55)' : '#94a3b8',
                  marginTop: 2, fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {flag.verification_source.split(' ').slice(0, 3).join(' ')}
                </p>
              </div>
              <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5, marginTop: 2 }} />
            </div>
          )) : (
            <div style={{ padding: '20px 16px', color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>
              No collision flags found for this company.
            </div>
          )}

          {overflow > 0 && (
            <div style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#94a3b8', letterSpacing: '0.1em', borderTop: '1px solid #ebebeb' }}>
              +{overflow} more flags
            </div>
          )}

          {/* SFDR narrative */}
          {report && (
            <div style={{ padding: '14px 16px', borderTop: '1.5px solid #ebebeb', background: '#f9f9f8' }}>
              <p className="jgl-mono" style={{ marginBottom: 6 }}>SFDR Narrative</p>
              <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, fontFamily: "'Raleway', sans-serif" }}>
                {report.sfdr_narrative}
              </p>
            </div>
          )}
        </div>

        {/* ── Constraint Map (right) ── */}
        <div>
          <div style={{ padding: '14px 20px 12px', borderBottom: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="jgl-mono">Constraint Map</p>
              <p style={{ fontSize: 11, color: '#475569', marginTop: 3, fontFamily: "'Raleway', sans-serif" }}>
                {mapMode === 'audit' ? 'Verified disclosure mismatches' : 'Full SIF constraint exposure'}
              </p>
            </div>
            {/* Mode toggle */}
            <div className="jgl-toggle">
              <button
                className={`jgl-toggle-opt ${mapMode === 'audit' ? 'active' : ''}`}
                onClick={() => setMapMode('audit')}
              >
                Audit
              </button>
              <button
                className={`jgl-toggle-opt ${mapMode === 'explore' ? 'active' : ''}`}
                onClick={() => setMapMode('explore')}
              >
                Explore
              </button>
            </div>
          </div>

          {/* Node chains */}
          <div style={{ padding: '8px 20px' }}>
            {mapMode === 'audit' ? (
              auditNodes.length > 0 ? auditNodes.map(flag => {
                const constraintType = COLLISION_TO_CONSTRAINT[flag.collision_type] ?? 'systemic_stress'
                const isSelected = selectedFlagId === flag.id
                return (
                  <div
                    key={flag.id}
                    className="node-chain"
                    style={{ opacity: selectedFlagId && !isSelected ? 0.3 : 1 }}
                    onClick={() => setSelectedFlagId(isSelected ? null : flag.id)}
                  >
                    <NodePill type="company" label={company.name.split(' ')[0]} />
                    <div className="node-arrow">→</div>
                    <NodePill type="claim" label={flag.claim_text} />
                    <div className="node-arrow">→</div>
                    <NodePill type="constraint" label={CONSTRAINT_LABELS[constraintType].split(' & ')[0]} severity={flag.severity} />
                    <div className="node-arrow">→</div>
                    <NodePill type="source" label={flag.verification_source.split(' ').slice(0, 4).join(' ')} />
                    <div style={{ marginLeft: 'auto', paddingLeft: 12, flexShrink: 0 }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: SEV_COLOR[flag.severity],
                        border: `1px solid ${SEV_COLOR[flag.severity]}`,
                        padding: '3px 8px',
                      }}>
                        {flag.severity}
                      </span>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ padding: '20px 0', color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>
                  No audit flags available for this company.
                </div>
              )
            ) : (
              /* Explore mode: show constraint profiles */
              exploreNodes.length > 0 ? exploreNodes.map(profile => {
                const score = ((profile.si_score + profile.al_score + profile.sv_score) / 3 * 100).toFixed(0)
                const sevColor = Number(score) >= 75 ? '#E14A2D' : Number(score) >= 55 ? '#D97706' : '#178395'
                return (
                  <div key={profile.id} className="node-chain">
                    <NodePill type="company" label={company.name.split(' ')[0]} />
                    <div className="node-arrow">→</div>
                    <NodePill type="constraint" label={CONSTRAINT_LABELS[profile.constraint_type].split(' & ')[0]} severity={Number(score) >= 75 ? 'High' : Number(score) >= 55 ? 'Medium' : 'Low'} />
                    <div className="node-arrow">→</div>
                    {/* Bottleneck score */}
                    <div className="node-block">
                      <div className="node-pill" style={{ background: '#f9fafb', border: '1.5px solid #e2e8f0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace", color: '#94a3b8', letterSpacing: '0.05em' }}>BOTL</span>
                        <span style={{ fontWeight: 600, color: sevColor }}>{profile.bottleneck_tests_passed}/4</span>
                      </div>
                      <span className="node-label">bottleneck test</span>
                    </div>
                    <div className="node-arrow">→</div>
                    <div className="node-block">
                      <div className="node-pill" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#178395', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600 }}>
                        {profile.r_layer}
                      </div>
                      <span className="node-label">r-layer</span>
                    </div>
                    <div style={{ marginLeft: 'auto', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
                      {[
                        { key: 'SI', val: profile.si_score },
                        { key: 'AL', val: profile.al_score },
                        { key: 'SV', val: profile.sv_score },
                      ].map(ax => (
                        <div key={ax.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#94a3b8', width: 14, letterSpacing: '0.08em' }}>{ax.key}</span>
                          <div style={{ width: 60, height: 3, background: '#e2e8f0', borderRadius: 0 }}>
                            <div style={{ height: '100%', width: `${ax.val * 100}%`, background: sevColor }} />
                          </div>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#475569', width: 26 }}>{(ax.val * 100).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }) : (
                <div style={{ padding: '20px 0', color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>
                  No constraint profiles available. Upload a CSRD disclosure to run analysis.
                </div>
              )
            )}
          </div>

          {/* Map footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1.5px solid #ebebeb',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            {[
              ['#178395', 'Company'],
              ['dashed #94a3b8', 'Claimed'],
              ['#E14A2D', 'High constraint'],
              ['#D97706', 'Medium'],
              ['#f1f5f9', 'Source'],
            ].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span style={{ width: 20, height: 6, border: `1.5px solid ${c.includes('dashed') ? '#94a3b8' : c}`, borderStyle: c.includes('dashed') ? 'dashed' : 'solid', background: c.includes('dashed') || c === '#f1f5f9' ? 'transparent' : c, display: 'inline-block', flexShrink: 0 }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div style={{ height: 48 }} />

      {/* ── Evidence Panel ── */}
      {selectedFlag && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 40 }}
            onClick={() => setSelectedFlagId(null)}
          />
          <EvidencePanel flag={selectedFlag} onClose={() => setSelectedFlagId(null)} />
        </>
      )}
    </div>
  )
}
