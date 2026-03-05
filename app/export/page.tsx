'use client'
import { mockCompanies, mockCollisionReports } from '@/lib/mock'
import { Download, FileText, FileSpreadsheet, Monitor } from 'lucide-react'

const formats = [
  {
    icon: Monitor,
    label: 'Platform View',
    sub: 'Interactive report in SDI platform. Share with client via secure link.',
    badge: 'Live',
    badgeClass: 'badge-pass',
    action: 'Generate Link',
    primary: true,
  },
  {
    icon: FileSpreadsheet,
    label: 'Excel Export',
    sub: 'XLSX with constraint profiles, collision flags, and EBITDA scenario tables.',
    badge: 'Phase 1',
    badgeClass: 'badge-low',
    action: 'Export XLSX',
    primary: false,
  },
  {
    icon: FileText,
    label: 'PDF Report',
    sub: 'Branded Seawolf × Jungle PDF. Suitable for LP reporting and IC committee.',
    badge: 'Phase 1',
    badgeClass: 'badge-low',
    action: 'Export PDF',
    primary: false,
  },
]

export default function ExportPage() {
  const approved = mockCollisionReports.filter(r => r.review_status === 'approved')
  const draft    = mockCollisionReports.filter(r => r.review_status === 'draft')
  const review   = mockCollisionReports.filter(r => r.review_status === 'under_review')

  return (
    <div className="px-10 py-10 max-w-4xl">

      <div className="section-label mb-3">SEC_05 — Export</div>
      <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">Export Reports</h1>
      <p className="text-[13px] text-[#6B7280] mb-8">
        Export outputs in platform, Excel, or PDF format. All exports reflect the latest approved review state.
      </p>

      {/* Review status summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Approved', count: approved.length, color: 'text-[#059669]', bg: 'bg-[#ECFDF5]' },
          { label: 'Under Review', count: review.length, color: 'text-[#178395]', bg: 'bg-[#E8F4F6]' },
          { label: 'Draft', count: draft.length, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
        ].map(s => (
          <div key={s.label} className={`card flex items-center gap-4`}>
            <div className={`text-3xl font-light ${s.color}`}>{s.count}</div>
            <div>
              <div className="mono-label text-[#9CA3AF]">{s.label}</div>
              <div className="text-[10px] text-[#9CA3AF]">reports</div>
            </div>
          </div>
        ))}
      </div>

      {/* Format cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {formats.map(f => (
          <div key={f.label} className={`card flex flex-col ${f.primary ? 'border-[#178395]/30' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <f.icon size={18} className={f.primary ? 'text-[#178395]' : 'text-[#9CA3AF]'} strokeWidth={1.5} />
              <span className={`badge ${f.badgeClass}`}>{f.badge}</span>
            </div>
            <div className="text-[13px] font-medium text-[#111827] mb-1">{f.label}</div>
            <div className="text-[11px] text-[#9CA3AF] leading-relaxed flex-1 mb-4">{f.sub}</div>
            <button className={`flex items-center justify-center gap-1.5 w-full py-2 text-[11px] rounded-sm transition-colors ${
              f.primary
                ? 'bg-[#178395] text-white hover:bg-[#0F6070]'
                : 'border border-[#E5E7EB] text-[#6B7280] hover:border-[#178395] hover:text-[#178395]'
            }`}>
              <Download size={11} /> {f.action}
            </button>
          </div>
        ))}
      </div>

      {/* Report queue */}
      <div className="card">
        <div className="section-label mb-5">Report Queue</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Revenue Durability</th>
              <th>Flags</th>
              <th>Review Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCollisionReports.map(r => {
              const company = mockCompanies.find(c => c.id === r.company_id)
              const durColor: Record<string, string> = { Resilient: '#059669', Stable: '#178395', Exposed: '#D97706', Fragile: '#E14A2D' }
              return (
                <tr key={r.id}>
                  <td className="font-medium text-[#111827] pr-4">{r.company_name}</td>
                  <td className="pr-4">
                    <span className="font-mono text-[11px]" style={{ color: durColor[r.revenue_durability] }}>
                      {r.revenue_durability}
                    </span>
                  </td>
                  <td className="font-mono text-[12px] pr-4">
                    <span className={r.collision_flag_count >= 4 ? 'text-[#E14A2D]' : 'text-[#6B7280]'}>
                      {r.collision_flag_count}
                    </span>
                  </td>
                  <td className="pr-4">
                    <span className={`badge ${
                      r.review_status === 'approved'     ? 'badge-pass' :
                      r.review_status === 'under_review' ? 'badge-low'  : 'badge-medium'
                    }`}>{r.review_status.replace('_', '\u00A0')}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {r.review_status === 'approved' && (
                        <>
                          <button className="text-[11px] text-[#178395] hover:underline flex items-center gap-1">
                            <Download size={10} /> XLSX
                          </button>
                          <button className="text-[11px] text-[#178395] hover:underline flex items-center gap-1">
                            <Download size={10} /> PDF
                          </button>
                        </>
                      )}
                      {r.review_status !== 'approved' && (
                        <span className="text-[10px] text-[#9CA3AF]">Pending approval</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Delivery note */}
        <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="mono-label text-[#9CA3AF] mb-1">Delivery Model</div>
              <div className="text-[12px] text-[#6B7280] leading-relaxed">
                Platform-first → Excel → PDF. Joint Seawolf × Jungle review before client delivery. Turnaround: 3–4 weeks from filing submission.
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#9CA3AF] text-right whitespace-nowrap">
              Co-branded<br />Seawolf × Jungle
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
