// Mock data for MVP development — replace with Supabase queries
import type {
  Portfolio, Company, ConstraintProfile, CollisionReport,
  CollisionFlag, PortfolioExposure, ExtractionRun
} from './types'

export const mockPortfolio: Portfolio = {
  id: 'port-001',
  name: 'European Industrial Transition Fund I',
  client_name: 'Seawolf Sustainability',
  aum_eur: 340_000_000,
  sfdr_article: 'Article 8',
  company_count: 8,
}

export const mockCompanies: Company[] = [
  { id: 'co-001', portfolio_id: 'port-001', name: 'Helios Energy GmbH', sector: 'Solar / Grid', jurisdiction: 'DE', upright_nir_score: 0.42, triage_priority: 'High', disclosure_status: 'complete', filing_type: 'CSRD' },
  { id: 'co-002', portfolio_id: 'port-001', name: 'Meridian Industrials NV', sector: 'Heavy Manufacturing', jurisdiction: 'NL', upright_nir_score: -0.18, triage_priority: 'High', disclosure_status: 'complete', filing_type: 'CSRD' },
  { id: 'co-003', portfolio_id: 'port-001', name: 'Volterra Grid Services', sector: 'Grid Infrastructure', jurisdiction: 'FR', upright_nir_score: 0.61, triage_priority: 'Medium', disclosure_status: 'complete', filing_type: 'IFRS_S2' },
  { id: 'co-004', portfolio_id: 'port-001', name: 'Cascata Water Systems', sector: 'Water / Utilities', jurisdiction: 'IT', upright_nir_score: 0.29, triage_priority: 'Medium', disclosure_status: 'processing', filing_type: 'CSRD' },
  { id: 'co-005', portfolio_id: 'port-001', name: 'Ferrum Steel Holdings', sector: 'Steel / Metals', jurisdiction: 'PL', upright_nir_score: -0.35, triage_priority: 'High', disclosure_status: 'complete', filing_type: 'CSRD' },
  { id: 'co-006', portfolio_id: 'port-001', name: 'Nordvik Logistics AB', sector: 'Logistics', jurisdiction: 'SE', upright_nir_score: 0.11, triage_priority: 'Low', disclosure_status: 'pending' },
  { id: 'co-007', portfolio_id: 'port-001', name: 'BioBase Materials SA', sector: 'Chemicals / Bio', jurisdiction: 'BE', upright_nir_score: 0.55, triage_priority: 'Low', disclosure_status: 'complete', filing_type: 'ESRS' },
  { id: 'co-008', portfolio_id: 'port-001', name: 'Kapital RE Group', sector: 'Real Estate', jurisdiction: 'AT', upright_nir_score: 0.08, triage_priority: 'Medium', disclosure_status: 'failed' },
]

export const mockConstraintProfiles: ConstraintProfile[] = [
  { id: 'cp-001', company_id: 'co-001', company_name: 'Helios Energy GmbH', constraint_type: 'infrastructure_capacity', r_layer: 'R3', si_score: 0.82, al_score: 0.78, sv_score: 0.75, le_score: 0.22, te_score: 0.55, is_bottleneck: true, bottleneck_tests_passed: 4, binding_mechanism: 'SUPPLY' },
  { id: 'cp-002', company_id: 'co-001', company_name: 'Helios Energy GmbH', constraint_type: 'temporal_transition', r_layer: 'R2', si_score: 0.65, al_score: 0.72, sv_score: 0.68, le_score: 0.35, te_score: 0.65, is_bottleneck: true, bottleneck_tests_passed: 4, binding_mechanism: 'ECOSYSTEM' },
  { id: 'cp-003', company_id: 'co-001', company_name: 'Helios Energy GmbH', constraint_type: 'incentive_market_design', r_layer: 'R1', si_score: 0.45, al_score: 0.55, sv_score: 0.52, le_score: 0.48, te_score: 0.72, is_bottleneck: false, bottleneck_tests_passed: 2, binding_mechanism: 'DEMAND' },
  { id: 'cp-004', company_id: 'co-002', company_name: 'Meridian Industrials NV', constraint_type: 'temporal_transition', r_layer: 'R2', si_score: 0.88, al_score: 0.82, sv_score: 0.85, le_score: 0.15, te_score: 0.48, is_bottleneck: true, bottleneck_tests_passed: 4, binding_mechanism: 'ECOSYSTEM' },
  { id: 'cp-005', company_id: 'co-002', company_name: 'Meridian Industrials NV', constraint_type: 'financial_viability', r_layer: 'R2', si_score: 0.72, al_score: 0.68, sv_score: 0.78, le_score: 0.28, te_score: 0.52, is_bottleneck: true, bottleneck_tests_passed: 4, binding_mechanism: 'ECOSYSTEM' },
  { id: 'cp-006', company_id: 'co-005', company_name: 'Ferrum Steel Holdings', constraint_type: 'systemic_stress', r_layer: 'R3', si_score: 0.91, al_score: 0.75, sv_score: 0.88, le_score: 0.12, te_score: 0.42, is_bottleneck: true, bottleneck_tests_passed: 4, binding_mechanism: 'SUPPLY' },
]

export const mockCollisionReports: CollisionReport[] = [
  { id: 'cr-001', company_id: 'co-001', company_name: 'Helios Energy GmbH', revenue_durability: 'Exposed', ebitda_base_pct: -4.2, ebitda_tightening_pct: -8.7, ebitda_extreme_pct: -14.1, sfdr_narrative: 'Grid connection lead times in DE exceed transition plan assumptions by 18–24 months. EEG 2023 subsidy cliff creates capex timing risk. Transition plan is physically coherent but institutionally constrained.', collision_flag_count: 3, review_status: 'under_review' },
  { id: 'cr-002', company_id: 'co-002', company_name: 'Meridian Industrials NV', revenue_durability: 'Fragile', ebitda_base_pct: -6.8, ebitda_tightening_pct: -13.2, ebitda_extreme_pct: -22.5, sfdr_narrative: 'Carbon cost assumptions in transition plan are below current EU ETS forward curve. Hydrogen feedstock supply chain shows coordination fragmentation across NL/DE border. Decarbonisation capex plan underfunded vs. VITO benchmarks.', collision_flag_count: 5, review_status: 'draft' },
  { id: 'cr-003', company_id: 'co-003', company_name: 'Volterra Grid Services', revenue_durability: 'Stable', ebitda_base_pct: -1.8, ebitda_tightening_pct: -3.4, ebitda_extreme_pct: -6.2, sfdr_narrative: 'Regulatory positioning aligned with EU Electricity Market Design Regulation. Revenue streams partially hedged via long-term grid access contracts. Minor timeline mismatch on DSO interconnection approval process.', collision_flag_count: 1, review_status: 'approved' },
  { id: 'cr-004', company_id: 'co-005', company_name: 'Ferrum Steel Holdings', revenue_durability: 'Fragile', ebitda_base_pct: -9.1, ebitda_tightening_pct: -17.4, ebitda_extreme_pct: -28.3, sfdr_narrative: 'Green steel transition claims unsupported by available DRI-grade scrap volumes in PL supply chain. Carbon border adjustment mechanism (CBAM) exposure materially understated in CSRD filing. Cross-sector infrastructure dependency on H2 grid not yet feasible at claimed timeline.', collision_flag_count: 6, review_status: 'draft' },
]

export const mockCollisionFlags: CollisionFlag[] = [
  { id: 'cf-001', company_id: 'co-001', collision_type: 'infrastructure_mismatch', claim_text: 'Grid connection complete Q3 2025', verification_source: 'Ember DE grid queue data', delta_description: 'Average DE grid connection queue at 28 months as of Jan 2026. Q3 2025 target already missed.', severity: 'High' },
  { id: 'cf-002', company_id: 'co-001', collision_type: 'timeline_mismatch', claim_text: '80% renewable by 2027', verification_source: 'Ember capacity data + EEG 2023 schedule', delta_description: 'Available grid injection capacity in stated region is 340MW vs. 500MW required. Regulatory timeline gap: 18–24 months.', severity: 'High' },
  { id: 'cf-003', company_id: 'co-001', collision_type: 'regulatory_mismatch', claim_text: 'EEG subsidy secured for 20-year period', verification_source: 'RegAlytics EEG 2023 alert feed', delta_description: 'EEG subsidy reform under consultation (March 2026). Proposed cliff at year 15. Not reflected in financial model.', severity: 'Medium' },
  { id: 'cf-004', company_id: 'co-002', collision_type: 'financial_mismatch', claim_text: 'Carbon cost €55/tCO2 in transition model', verification_source: 'EU ETS forward curve (ICE)', delta_description: 'ETS forward price: €78/tCO2 for 2027 delivery. EBITDA margin impact of €23/tCO2 delta not reflected.', severity: 'High' },
  { id: 'cf-005', company_id: 'co-002', collision_type: 'supply_chain_mismatch', claim_text: 'Green hydrogen procurement secured from NL supplier by 2026', verification_source: 'VITO hydrogen supply chain assessment', delta_description: 'NL/DE hydrogen interconnect regulatory approval pending. No pipeline capacity confirmed for cross-border delivery at stated volume.', severity: 'High' },
]

export const mockPortfolioExposure: PortfolioExposure[] = [
  { constraint_type: 'infrastructure_capacity', aum_pct: 42, is_systemic: true, concentration_flag: false, affected_companies: ['Helios Energy GmbH', 'Volterra Grid Services', 'Ferrum Steel Holdings'] },
  { constraint_type: 'temporal_transition', aum_pct: 58, is_systemic: true, concentration_flag: true, affected_companies: ['Helios Energy GmbH', 'Meridian Industrials NV', 'Ferrum Steel Holdings'] },
  { constraint_type: 'financial_viability', aum_pct: 31, is_systemic: true, concentration_flag: false, affected_companies: ['Meridian Industrials NV', 'Ferrum Steel Holdings'] },
  { constraint_type: 'systemic_stress', aum_pct: 24, is_systemic: false, concentration_flag: false, affected_companies: ['Ferrum Steel Holdings'] },
  { constraint_type: 'incentive_market_design', aum_pct: 18, is_systemic: false, concentration_flag: false, affected_companies: ['Helios Energy GmbH'] },
  { constraint_type: 'coordination_fragmentation', aum_pct: 22, is_systemic: true, concentration_flag: false, affected_companies: ['Meridian Industrials NV', 'Ferrum Steel Holdings'] },
]

export const mockExtractionRuns: ExtractionRun[] = [
  { id: 'er-001', disclosure_id: 'disc-001', company_name: 'Helios Energy GmbH', model_name: 'claude-sonnet-4-5', status: 'complete', fields_extracted: 47, started_at: '2026-03-04T09:12:00Z', completed_at: '2026-03-04T09:14:32Z' },
  { id: 'er-002', disclosure_id: 'disc-002', company_name: 'Meridian Industrials NV', model_name: 'claude-sonnet-4-5', status: 'complete', fields_extracted: 52, started_at: '2026-03-04T09:20:00Z', completed_at: '2026-03-04T09:23:11Z' },
  { id: 'er-003', disclosure_id: 'disc-003', company_name: 'Volterra Grid Services', model_name: 'claude-sonnet-4-5', status: 'complete', fields_extracted: 38, started_at: '2026-03-04T10:05:00Z', completed_at: '2026-03-04T10:07:44Z' },
  { id: 'er-004', disclosure_id: 'disc-004', company_name: 'Cascata Water Systems', model_name: 'claude-sonnet-4-5', status: 'running', fields_extracted: 12, started_at: '2026-03-04T11:30:00Z' },
  { id: 'er-005', disclosure_id: 'disc-005', company_name: 'Kapital RE Group', model_name: 'claude-sonnet-4-5', status: 'failed', fields_extracted: 0, started_at: '2026-03-04T11:45:00Z', completed_at: '2026-03-04T11:45:18Z', error_message: 'PDF appears to be scanned (image-only). OCR required.' },
]
