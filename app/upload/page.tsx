'use client'
import { useState } from 'react'
import { mockExtractionRuns } from '@/lib/mock'
import { Upload, CheckCircle, AlertTriangle, Clock, Loader } from 'lucide-react'

function StatusIcon({ s }: { s: string }) {
  if (s === 'complete') return <CheckCircle size={12} className="text-[#059669]" />
  if (s === 'running')  return <Loader size={12} className="text-[#178395] animate-spin" />
  if (s === 'failed')   return <AlertTriangle size={12} className="text-[#E14A2D]" />
  return <Clock size={12} className="text-[#9CA3AF]" />
}

const PIPELINE_STEPS = [
  { key: 'ingest',  label: 'Document Ingestion',     sub: 'SHA-256 storage, PDF parsing, section chunking' },
  { key: 'extract', label: 'Field Extraction',        sub: 'BM25 retrieval → LLM structured output → field_dictionary validation' },
  { key: 'map',     label: 'SIF Constraint Mapping',  sub: 'Deterministic CSRD → SIF v2 constraint types' },
  { key: 'collide', label: 'Collision Engine',         sub: 'Cross-reference vs. Ember / RegAlytics / VITO' },
  { key: 'output',  label: 'Report Generation',        sub: 'EBITDA scenarios, revenue durability, SFDR narrative' },
]

export default function UploadPage() {
  const [dragging, setDragging] = useState(false)

  return (
    <div className="px-10 py-10 max-w-4xl">

      <div className="section-label mb-3">SEC_02 — Upload & Processing</div>
      <h1 className="text-2xl font-light text-[#111827] tracking-tight mb-1">Ingest Filing</h1>
      <p className="text-[13px] text-[#6B7280] mb-8">Upload a CSRD or IFRS S1/S2 filing to begin the constraint analysis pipeline.</p>

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-sm p-12 text-center mb-8 transition-colors cursor-pointer ${
          dragging ? 'border-[#178395] bg-[#178395]/5' : 'border-[#E5E7EB] hover:border-[#178395]/40 hover:bg-[#FDFDFC]'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <Upload size={28} className="mx-auto mb-4 text-[#9CA3AF]" />
        <div className="text-[14px] font-medium text-[#374151] mb-1">Drop filing here or click to browse</div>
        <div className="text-[12px] text-[#9CA3AF] mb-4">PDF, DOCX · CSRD / IFRS S1 / IFRS S2 / ESRS / SFDR</div>
        <div className="text-[10px] font-mono text-[#9CA3AF]">
          Files stored immutably with SHA-256 content addressing
        </div>
      </div>

      {/* Pipeline diagram */}
      <div className="card mb-8">
        <div className="section-label mb-5">Processing Pipeline</div>
        <div className="flex items-start gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.key} className="flex-1 relative">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#178395] flex items-center justify-center bg-[#FDFDFC] z-10 relative">
                  <span className="font-mono text-[8px] text-[#178395]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-[#E5E7EB] mt-0" />
                )}
              </div>
              <div className="pr-4">
                <div className="text-[12px] font-medium text-[#111827] mb-0.5">{step.label}</div>
                <div className="text-[10px] text-[#9CA3AF] leading-relaxed">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run history */}
      <div className="card">
        <div className="section-label mb-5">Extraction Run History</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Model</th>
              <th>Fields</th>
              <th>Started</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockExtractionRuns.map(run => {
              const dur = run.completed_at
                ? Math.round((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)
                : null
              return (
                <tr key={run.id}>
                  <td className="font-medium text-[#111827] pr-4">{run.company_name}</td>
                  <td className="font-mono text-[11px] text-[#6B7280] pr-4">{run.model_name}</td>
                  <td className="font-mono text-[12px] text-[#111827] pr-4">
                    {run.fields_extracted > 0 ? run.fields_extracted : '—'}
                  </td>
                  <td className="font-mono text-[11px] text-[#6B7280] pr-4">
                    {new Date(run.started_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="font-mono text-[11px] text-[#6B7280] pr-4">
                    {dur != null ? `${dur}s` : '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon s={run.status} />
                      <span className={`text-[11px] capitalize ${
                        run.status === 'complete' ? 'text-[#059669]' :
                        run.status === 'failed'   ? 'text-[#E14A2D]' :
                        run.status === 'running'  ? 'text-[#178395]' : 'text-[#9CA3AF]'
                      }`}>{run.status}</span>
                    </div>
                    {run.error_message && (
                      <div className="text-[10px] text-[#E14A2D] mt-0.5 max-w-[200px]">{run.error_message}</div>
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
