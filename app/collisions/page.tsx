'use client'
import { mockCollisionReports, mockCompanies } from '@/lib/mock'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const durabilityColor: Record<string, string> = {
  Resilient: '#059669', Stable: '#178395', Exposed: '#D97706', Fragile: '#E14A2D',
}

export default function CollisionsIndexPage() {
  return (
    <div className="px-10 py-10 max-w-4xl">
      <div className="section-label mb-3">SEC_04 — Collisions</div>
      <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">Collision Reports</h1>
      <p className="text-[13px] text-[#6B7280] mb-8">EBITDA sensitivity, revenue durability, and claim verification flags.</p>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Revenue Durability</th><th>EBITDA (Extreme)</th><th>Flags</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {mockCollisionReports.map(r => (
              <tr key={r.id}>
                <td className="font-medium text-[#111827] pr-4">{r.company_name}</td>
                <td className="pr-4">
                  <span className="font-mono text-[11px]" style={{ color: durabilityColor[r.revenue_durability] }}>
                    {r.revenue_durability}
                  </span>
                </td>
                <td className="font-mono text-[12px] text-[#E14A2D] pr-4">{r.ebitda_extreme_pct.toFixed(1)}%</td>
                <td className="font-mono text-[12px] pr-4">
                  <span className={r.collision_flag_count >= 4 ? 'text-[#E14A2D]' : 'text-[#6B7280]'}>{r.collision_flag_count}</span>
                </td>
                <td className="pr-4">
                  <span className={`badge ${r.review_status === 'approved' ? 'badge-pass' : r.review_status === 'under_review' ? 'badge-low' : 'badge-medium'}`}>
                    {r.review_status.replace('_', '\u00A0')}
                  </span>
                </td>
                <td className="text-right">
                  <Link href={`/collisions/${r.company_id}`} className="text-[11px] text-[#E14A2D] hover:underline flex items-center gap-1 justify-end">
                    View report <ArrowRight size={10} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
