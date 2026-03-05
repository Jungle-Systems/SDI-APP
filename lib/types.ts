// SDI Types — mirrors sdi schema on Jungle-Staging (otjespwiivrnospqedlj)

export type RLayer = 'R1' | 'R2' | 'R3'
export type SeverityBand = 'High' | 'Medium' | 'Low'
export type RevenueDurability = 'Resilient' | 'Stable' | 'Exposed' | 'Fragile'
export type FilingType = 'CSRD' | 'IFRS_S1' | 'IFRS_S2' | 'ESRS' | 'SFDR' | 'OTHER'
export type CollisionType =
  | 'feasibility_mismatch'
  | 'regulatory_mismatch'
  | 'supply_chain_mismatch'
  | 'infrastructure_mismatch'
  | 'timeline_mismatch'
  | 'financial_mismatch'

export type ConstraintType =
  | 'authority_decision'
  | 'coordination_fragmentation'
  | 'infrastructure_capacity'
  | 'information_transparency'
  | 'incentive_market_design'
  | 'financial_viability'
  | 'temporal_transition'
  | 'systemic_stress'

export const CONSTRAINT_LABELS: Record<ConstraintType, string> = {
  authority_decision: 'Authority & Decision',
  coordination_fragmentation: 'Coordination & Fragmentation',
  infrastructure_capacity: 'Infrastructure & Capacity',
  information_transparency: 'Information & Transparency',
  incentive_market_design: 'Incentive & Market Design',
  financial_viability: 'Financial & Viability',
  temporal_transition: 'Temporal & Transition',
  systemic_stress: 'Systemic Stress & Resilience',
}

export const CONSTRAINT_GROUP: Record<ConstraintType, string> = {
  authority_decision: 'Control & Coordination',
  coordination_fragmentation: 'Control & Coordination',
  infrastructure_capacity: 'Capacity & Information',
  information_transparency: 'Capacity & Information',
  incentive_market_design: 'Incentive & Viability',
  financial_viability: 'Incentive & Viability',
  temporal_transition: 'Temporal & Stress',
  systemic_stress: 'Temporal & Stress',
}

export interface Portfolio {
  id: string
  name: string
  client_name: string
  aum_eur: number
  sfdr_article: string
  company_count: number
}

export interface Company {
  id: string
  portfolio_id: string
  name: string
  sector: string
  jurisdiction: string
  upright_nir_score?: number
  triage_priority: 'High' | 'Medium' | 'Low'
  disclosure_status: 'complete' | 'processing' | 'pending' | 'failed'
  filing_type?: FilingType
}

export interface ConstraintProfile {
  id: string
  company_id: string
  company_name: string
  constraint_type: ConstraintType
  r_layer: RLayer
  // 5 scoring axes
  si_score: number  // Structural Importance (R3)
  al_score: number  // Activation Likelihood (R2)
  sv_score: number  // Severity if Activated
  le_score: number  // Leverage Elasticity
  te_score: number  // Time-to-Effect
  is_bottleneck: boolean
  bottleneck_tests_passed: number
  binding_mechanism: 'DEMAND' | 'SUPPLY' | 'ECOSYSTEM'
}

export interface CollisionFlag {
  id: string
  company_id: string
  collision_type: CollisionType
  claim_text: string
  verification_source: string
  delta_description: string
  severity: SeverityBand
}

export interface CollisionReport {
  id: string
  company_id: string
  company_name: string
  revenue_durability: RevenueDurability
  ebitda_base_pct: number
  ebitda_tightening_pct: number
  ebitda_extreme_pct: number
  sfdr_narrative: string
  collision_flag_count: number
  review_status: 'draft' | 'under_review' | 'approved'
}

export interface PortfolioExposure {
  constraint_type: ConstraintType
  aum_pct: number
  is_systemic: boolean
  concentration_flag: boolean
  affected_companies: string[]
}

export interface ExtractionRun {
  id: string
  disclosure_id: string
  company_name: string
  model_name: string
  status: 'pending' | 'running' | 'complete' | 'failed'
  fields_extracted: number
  started_at: string
  completed_at?: string
  error_message?: string
}
