'use client'
import { mockCompanies } from '@/lib/mock'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ConstraintsIndexPage() {
  const analysed = mockCompanies.filter(c => c.disclosure_status === 'complete')
  return (
    <div className="px-10 py-10 max-w-4xl">
      <div className="section-label mb-3">SEC_03 — Constraints</div>
      <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">Constraint Profiles</h1>
      <p className="text-[13px] text-[#6B7280] mb-8">Select a company to view its full SIF v2 constraint profile and scoring axes.</p>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Sector</th><th>Triage</th><th>NIR</th><th></th></tr>
          </thead>
          <tbody>
            {analysed.map(c => (
              <tr key={c.id}>
                <td className="font-medium text-[#111827] pr-4">{c.name}</td>
                <td className="text-[#6B7280] text-[12px] pr-4">{c.sector}</td>
                <td className="pr-4">
                  <span className={`badge ${c.triage_priority === 'High' ? 'badge-high' : c.triage_priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                    {c.triage_priority}
                  </span>
                </td>
                <td className="font-mono text-[11px] pr-4">
                  {c.upright_nir_score !== undefined
                    ? <span className={c.upright_nir_score >= 0 ? 'text-[#059669]' : 'text-[#E14A2D]'}>{c.upright_nir_score >= 0 ? '+' : ''}{c.upright_nir_score.toFixed(2)}</span>
                    : '—'}
                </td>
                <td className="text-right">
                  <Link href={`/constraints/${c.id}`} className="text-[11px] text-[#178395] hover:underline flex items-center gap-1 justify-end">
                    View profile <ArrowRight size={10} />
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
