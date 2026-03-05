'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

type Severity = 'high' | 'medium' | 'low'

interface DiscNode { id: string; line1: string; line2: string; angle: number }
interface RealNode { id: string; line1: string; line2: string; angle: number }
interface EdgeData {
  id: string; from: string; to: string
  severity: Severity; pct: number
  discLabel: string; realLabel: string
  quote: string; reality: string; source: string; takeaway: string
}

// ── Graph constants ──────────────────────────────────────────────────────────────
const CX = 440, CY = 320
const R1 = 140   // inner (disclosure) ring
const R2 = 252   // outer (reality) ring
const RC = 52    // center node radius
const RD = 25    // disclosure node radius
const RR = 17    // reality node radius
const INNER_LABEL_R = R1 - RD - 18  // labels inside inner ring
const OUTER_LABEL_R = R2 + 42       // labels outside outer ring

// ── Severity config ──────────────────────────────────────────────────────────────
const SEV: Record<Severity, { edge: string; bg: string; border: string; text: string; label: string }> = {
  high:   { edge: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#dc2626', label: 'High Risk' },
  medium: { edge: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#d97706', label: 'Margin Pressure' },
  low:    { edge: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', label: 'Low Risk' },
}

// ── Helpers ──────────────────────────────────────────────────────────────────────
const toRad = (d: number) => d * Math.PI / 180
const npos  = (r: number, deg: number) => ({ x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) })
const anchor = (x: number) => x < CX - 14 ? 'end' : x > CX + 14 ? 'start' : 'middle'
const sw     = (pct: number) => Math.max(1.5, Math.abs(pct) * 1.6)

function ePath(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2
  const dx = mx - CX, dy = my - CY
  return `M${p1.x} ${p1.y} Q${CX + dx * 1.38} ${CY + dy * 1.38} ${p2.x} ${p2.y}`
}

// ── Data ─────────────────────────────────────────────────────────────────────────
const CO = { name: 'Bluepeak Energy', risk: '€8.4M', pct: '-6.2%', sector: 'Energy Transition' }

const DISC: DiscNode[] = [
  { id: 'd1', line1: 'Fleet',          line2: 'Electrification', angle: -90  },
  { id: 'd2', line1: 'Water-Intensive', line2: 'Cooling',         angle: -18  },
  { id: 'd3', line1: 'EU Subsidy',     line2: 'Reliance',         angle:  54  },
  { id: 'd4', line1: 'Carbon Offset',  line2: 'Strategy',         angle: 126  },
  { id: 'd5', line1: 'Grid',           line2: 'Decarbonisation',  angle: 198  },
]

const REAL: RealNode[] = [
  { id: 'r1', line1: 'Grid Congestion',   line2: 'NL · 2025',     angle: -112 },
  { id: 'r2', line1: 'Water Rationing',   line2: 'EU · 2026',     angle: -67  },
  { id: 'r3', line1: 'PFAS Regulation',   line2: '2026',          angle: -22  },
  { id: 'r4', line1: 'Carbon Border Tax', line2: 'CBAM',          angle:  23  },
  { id: 'r5', line1: 'EU Subsidy Cliff',  line2: '2027',          angle:  68  },
  { id: 'r6', line1: 'Renewable',         line2: 'Intermittency', angle: 113  },
  { id: 'r7', line1: 'Insurance',         line2: 'Withdrawal',    angle: 158  },
  { id: 'r8', line1: 'Supply Chain',      line2: 'Risk',          angle: 203  },
]

const EDGES: EdgeData[] = [
  {
    id: 'e1', from: 'd1', to: 'r1', severity: 'high', pct: -2.4,
    discLabel: 'Fleet Electrification', realLabel: 'Grid Congestion',
    quote: '"Aiming for 100% EV logistics fleet by 2027, targeting full grid integration across NL operations."',
    reality: 'Eurostat/Ember projects 85% grid capacity deficit in target region by 2027. Dutch TSO TenneT has a 4-year connection queue as of Q1 2025.',
    source: 'Eurostat · Ember · TenneT Grid Report 2024',
    takeaway: 'The 2027 electrification target is structurally unfeasible. Expect a 3–5 year delay and significant capex overrun. This is a forward-looking claim that cannot be substantiated against infrastructure data.',
  },
  {
    id: 'e2', from: 'd2', to: 'r2', severity: 'high', pct: -1.8,
    discLabel: 'Water-Intensive Cooling', realLabel: 'Water Rationing',
    quote: '"Water usage efficiency improved 12% YoY. Operations fully compliant with current EU water directives."',
    reality: 'EU Water Framework Directive revision (2026) mandates a 40% reduction in industrial cooling consumption in water-stressed basins. Primary facility sits in a designated stress zone.',
    source: 'EU WFD Revision Draft · EEA Water Stress Map 2024',
    takeaway: 'Historic compliance provides no protection against the 2026 regulatory step-change. Cooling infrastructure will require material redesign or relocation — neither is disclosed nor provisioned for.',
  },
  {
    id: 'e3', from: 'd3', to: 'r5', severity: 'medium', pct: -1.2,
    discLabel: 'EU Subsidy Reliance', realLabel: 'EU Subsidy Cliff',
    quote: '"EU innovation subsidies underpin 34% of our renewable transition capex plan through 2028."',
    reality: 'EC budget review projects a 28% reduction in energy transition subsidy envelopes post-2027, with significant allocation competition from Eastern European member states.',
    source: 'EC MFF 2028–2034 Draft · Agora Energiewende',
    takeaway: '34% capex dependency on EU subsidies creates a material refinancing risk post-2027. Stress-test the transition plan assuming zero subsidy renewal.',
  },
  {
    id: 'e4', from: 'd4', to: 'r4', severity: 'medium', pct: -0.9,
    discLabel: 'Carbon Offset Strategy', realLabel: 'Carbon Border Tax',
    quote: '"Carbon neutrality achieved through certified offset portfolio covering 1.2M tCO₂e annually."',
    reality: 'CBAM Phase 2 (2026) classifies offset-backed neutrality claims as non-compliant for cross-border product pricing. Offsets will not substitute for verified emission reductions.',
    source: 'EU CBAM Regulation 2023/956 · Phase 2 Technical Guidance',
    takeaway: 'Offset-based neutrality becomes a pricing liability under CBAM Phase 2. Export products face full carbon cost recalculation from 2026 — not currently disclosed.',
  },
  {
    id: 'e5', from: 'd1', to: 'r3', severity: 'low', pct: -0.3,
    discLabel: 'Fleet Electrification', realLabel: 'PFAS Regulation',
    quote: '"EV charging infrastructure procurement underway using third-party supply chain."',
    reality: 'PFAS restrictions (REACH Annex XVII, 2026) prohibit key insulation compounds used in EV charging components. Supply disruption expected 12–18 months before enforcement.',
    source: 'ECHA PFAS Restriction · REACH Annex XVII',
    takeaway: 'Low immediate impact, but procurement should be reviewed now. Contracts pre-dating the restriction may create stranded asset exposure in the charging infrastructure rollout.',
  },
  {
    id: 'e6', from: 'd5', to: 'r6', severity: 'low', pct: -0.4,
    discLabel: 'Grid Decarbonisation', realLabel: 'Renewable Intermittency',
    quote: '"Renewable energy sourcing will reach 90% by 2026 through PPA agreements."',
    reality: 'Intermittency events in NL grid increased 340% between 2021–2024. PPA structures without firm capacity backup expose operations to unhedged balancing costs.',
    source: 'IEA Renewables Report 2024 · ENTSO-E Historical Data',
    takeaway: 'PPA-only strategy understates grid balancing cost exposure. Firm capacity or storage backup should be modelled into the 2026 energy cost forecast.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────────
export default function ExposureMapPage() {
  const [sel, setSel] = useState<EdgeData | null>(null)
  const [hov, setHov] = useState<string | null>(null)

  // Precompute node positions
  const dPos = Object.fromEntries(DISC.map(d => [d.id, npos(R1, d.angle)]))
  const rPos = Object.fromEntries(REAL.map(r => [r.id, npos(R2, r.angle)]))

  // Worst severity per reality node (for colouring)
  const rSev: Record<string, Severity> = {}
  EDGES.forEach(e => {
    const cur = rSev[e.to]
    if (!cur || (e.severity === 'high') || (e.severity === 'medium' && cur === 'low')) {
      rSev[e.to] = e.severity
    }
  })

  const handleEdgeClick = (e: EdgeData) => setSel(prev => prev?.id === e.id ? null : e)

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 shrink-0">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-0.5">
            Exposure Map · {CO.sector}
          </p>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight">{CO.name}</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Total EBITDA at Risk</p>
          <p className="text-[28px] font-bold text-red-500 leading-none tracking-tight">{CO.risk}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{CO.pct} on current trajectory</p>
        </div>
      </div>

      {/* ── Graph + Slide Panel ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* SVG Graph */}
        <svg
          viewBox="0 0 880 640"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)' }}
        >
          <defs>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="centerGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <radialGradient id="discGrad" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a5f" />
            </radialGradient>
          </defs>

          {/* Ring tracks — subtle dashed circles */}
          <circle cx={CX} cy={CY} r={R1} fill="none" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="3 7" />
          <circle cx={CX} cy={CY} r={R2} fill="none" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="3 9" />

          {/* ── Edges ── */}
          {EDGES.map(e => {
            const p1 = dPos[e.from]
            const p2 = rPos[e.to]
            const isHov = hov === e.id
            const isSel = sel?.id === e.id
            const active = isHov || isSel
            const d = ePath(p1, p2)
            // Midpoint on the bezier curve (approx at t=0.5)
            const dx = (p1.x + p2.x) / 2 - CX
            const dy = (p1.y + p2.y) / 2 - CY
            const lx = CX + dx * 1.38
            const ly = CY + dy * 1.38

            return (
              <g
                key={e.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleEdgeClick(e)}
                onMouseEnter={() => setHov(e.id)}
                onMouseLeave={() => setHov(null)}
              >
                {/* Wide invisible hit area */}
                <path d={d} fill="none" stroke="transparent" strokeWidth="18" />
                {/* Visible edge */}
                <path
                  d={d}
                  fill="none"
                  stroke={SEV[e.severity].edge}
                  strokeWidth={active ? sw(e.pct) + 2 : sw(e.pct)}
                  strokeOpacity={active ? 1 : isSel || (!sel && !hov) ? 0.6 : 0.25}
                  strokeLinecap="round"
                  filter={active ? 'url(#glow)' : undefined}
                />
                {/* EBITDA label on hover */}
                {isHov && (
                  <>
                    <rect
                      x={lx - 18} y={ly - 16}
                      width={36} height={16}
                      rx={4}
                      fill={SEV[e.severity].bg}
                      stroke={SEV[e.severity].border}
                      strokeWidth="1"
                    />
                    <text
                      x={lx} y={ly - 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill={SEV[e.severity].text}
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {e.pct.toFixed(1)}%
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {/* ── Center node ── */}
          <circle cx={CX} cy={CY} r={RC} fill="url(#centerGrad)" />
          <circle cx={CX} cy={CY} r={RC} fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
          <text x={CX} y={CY - 14} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#94a3b8" fontFamily="Inter, system-ui" letterSpacing="0.8">
            {CO.name.toUpperCase()}
          </text>
          <text x={CX} y={CY + 2} textAnchor="middle" fontSize="8.5" fill="#64748b" fontFamily="Inter, system-ui">
            EBITDA at Risk
          </text>
          <text x={CX} y={CY + 18} textAnchor="middle" fontSize="15" fontWeight="800" fill="#ef4444" fontFamily="Inter, system-ui">
            {CO.risk}
          </text>

          {/* ── Disclosure nodes (inner ring) ── */}
          {DISC.map(d => {
            const p = dPos[d.id]
            const lp = npos(INNER_LABEL_R, d.angle)
            const ta = anchor(lp.x)
            const isActive = EDGES.some(e => e.from === d.id && (e.id === hov || e.id === sel?.id))

            return (
              <g key={d.id}>
                <circle
                  cx={p.x} cy={p.y} r={RD}
                  fill="url(#discGrad)"
                  stroke={isActive ? '#93c5fd' : '#334155'}
                  strokeWidth={isActive ? 1.5 : 0.75}
                  opacity={sel && !isActive ? 0.45 : 1}
                />
                <text x={lp.x} y={lp.y - 4} textAnchor={ta} fontSize="9.5" fontWeight="600" fill="#1e293b" fontFamily="Inter, system-ui" opacity={sel && !isActive ? 0.4 : 1}>{d.line1}</text>
                <text x={lp.x} y={lp.y + 9} textAnchor={ta} fontSize="9.5" fontWeight="600" fill="#1e293b" fontFamily="Inter, system-ui" opacity={sel && !isActive ? 0.4 : 1}>{d.line2}</text>
              </g>
            )
          })}

          {/* ── Reality nodes (outer ring) ── */}
          {REAL.map(r => {
            const p = rPos[r.id]
            const lp = npos(OUTER_LABEL_R, r.angle)
            const ta = anchor(lp.x)
            const sev = rSev[r.id]
            const isActive = EDGES.some(e => e.to === r.id && (e.id === hov || e.id === sel?.id))
            const fillColor = sev ? SEV[sev].bg : '#f8fafc'
            const strokeColor = sev ? SEV[sev].edge : '#cbd5e1'
            const textColor = sev ? SEV[sev].text : '#94a3b8'

            return (
              <g key={r.id}>
                <circle
                  cx={p.x} cy={p.y} r={RR}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  opacity={sel && !isActive ? 0.35 : 0.9}
                  filter={isActive ? 'url(#glow)' : undefined}
                />
                <text x={lp.x} y={lp.y - 4} textAnchor={ta} fontSize="8.5" fontWeight="600" fill={textColor} fontFamily="Inter, system-ui" opacity={sel && !isActive ? 0.3 : 1}>{r.line1}</text>
                <text x={lp.x} y={lp.y + 7} textAnchor={ta} fontSize="8" fill="#94a3b8" fontFamily="Inter, system-ui" opacity={sel && !isActive ? 0.3 : 1}>{r.line2}</text>
              </g>
            )
          })}

          {/* ── Ring annotations ── */}
          <text x={CX + R1 * 0.68} y={CY - R1 * 0.72} fontSize="7.5" fill="#94a3b8" fontFamily="Inter, system-ui" letterSpacing="1.2">DISCLOSURES</text>
          <text x={CX + R2 * 0.63} y={CY - R2 * 0.77} fontSize="7.5" fill="#94a3b8" fontFamily="Inter, system-ui" letterSpacing="1.2">MARKET REALITIES</text>

        </svg>

        {/* ── Slide-out panel ── */}
        <div
          className={`absolute right-0 top-0 h-full w-[420px] bg-white border-l border-slate-100 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${sel ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {sel && (
            <div className="p-6 flex flex-col gap-5">

              {/* Panel header */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ background: SEV[sel.severity].bg, color: SEV[sel.severity].text, border: `1px solid ${SEV[sel.severity].border}` }}
                  >
                    {SEV[sel.severity].label}
                  </span>
                  <h3 className="text-[14px] font-semibold text-slate-800 leading-snug">
                    {sel.discLabel}
                    <span className="text-slate-300 mx-2 font-light">→</span>
                    {sel.realLabel}
                  </h3>
                </div>
                <button
                  onClick={() => setSel(null)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mt-0.5 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* EBITDA impact metric */}
              <div
                className="rounded-xl p-4"
                style={{ background: SEV[sel.severity].bg, border: `1px solid ${SEV[sel.severity].border}` }}
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Margin Sensitivity</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] font-extrabold leading-none tracking-tight" style={{ color: SEV[sel.severity].text }}>
                    {sel.pct.toFixed(1)}%
                  </span>
                  <span className="text-[12px] text-slate-400 pb-1">EBITDA impact</span>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200 flex flex-col gap-2">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">The Disclosure</p>
                  <p className="text-[11.5px] text-slate-600 italic leading-relaxed flex-1">{sel.quote}</p>
                </div>
                <div
                  className="rounded-xl p-3.5 flex flex-col gap-2"
                  style={{ background: SEV[sel.severity].bg, border: `1px solid ${SEV[sel.severity].border}` }}
                >
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Market Reality</p>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed flex-1">{sel.reality}</p>
                  <p className="text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-200">{sel.source}</p>
                </div>
              </div>

              {/* Analyst takeaway */}
              <div className="rounded-xl p-4 bg-slate-900">
                <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">Analyst Takeaway</p>
                <p className="text-[12.5px] text-slate-200 leading-relaxed">{sel.takeaway}</p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="px-8 py-3 border-t border-slate-100 bg-white flex items-center gap-5 shrink-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Edge weight = € exposure</span>
        <div className="w-px h-4 bg-slate-200" />
        {(['high', 'medium', 'low'] as Severity[]).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-6 h-[3px] rounded-full" style={{ background: SEV[s].edge }} />
            <span className="text-[11px] text-slate-500">{SEV[s].label}</span>
          </div>
        ))}
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <div className="w-5 border-t border-dashed border-slate-300" />
          <span className="text-[11px] text-slate-400">Exposure ring</span>
        </div>
        <span className="ml-auto text-[10px] text-slate-400 font-mono">Click any edge to inspect →</span>
      </div>

    </div>
  )
}
