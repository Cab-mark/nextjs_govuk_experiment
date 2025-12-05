/**
 * Contracts Shim - Sample contract payloads for mapper tests
 * 
 * This file contains sample contract types that simulate what would come from
 * @cs-jobs/contracts package. Used for testing mappers.
 * 
 * When @cs-jobs/contracts is installed:
 * 1. This file becomes obsolete for type definitions
 * 2. Keep fixtures in tests/fixtures for mapper testing
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

// ============================================================================
// Sample Contract Types (simulating @cs-jobs/contracts)
// ============================================================================

/**
 * Simulates a contract Job payload from an API or generated package
 * Fields may differ slightly from domain types (e.g., snake_case, different field names)
 */
export interface ContractJob {
  job_id: string;
  approach_type: string;
  job_title: string;
  job_description: string;
  organisation_name: string;
  locations: ContractLocation[];
  grade_level: string;
  assignment_type: string;
  personal_specification: string;
  application_details: string;
  closing_date: string; // ISO date string
  profession_type: string;
  recruitment_email: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  nationality_requirement?: string;
  job_summary?: string;
  application_url?: string;
  benefits_description?: string;
  salary_info?: ContractSalary;
  number_of_positions?: number;
  success_profile_details?: string;
  diversity_statement?: string;
  disability_confident_status?: string;
  dc_status_level?: string;
  redeployment_scheme_info?: string;
  prison_scheme_info?: string;
  veteran_scheme_info?: string;
  criminal_record_check?: string;
  complaints_info?: string;
  civil_service_info?: string;
  eligibility_check?: string;
  job_attachments?: ContractAttachment[];
}

export interface ContractLocation {
  type: 'uk' | 'overseas';
  uprn?: string;
  sao_text?: string;
  pao_text?: string;
  street_description?: string;
  locality?: string;
  town_name?: string;
  post_town?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  full_address_search?: string;
  country_name?: string;
  country_code?: string;
  location_display?: string;
}

export interface ContractSalary {
  min_amount: number;
  max_amount?: number;
  currency_code: string;
  currency_symbol?: string;
  additional_details?: string;
}

export interface ContractAttachment {
  url: string;
  document_name: string;
  document_format: string;
  file_size_bytes?: number;
}

export interface ContractJobSearchResponse {
  jobs: ContractJob[];
  total_count: number;
  current_page: number;
  page_size: number;
  total_pages: number;
  search_query: string | null;
  applied_filters: Record<string, string[]> | null;
}

// ============================================================================
// Enum mappings (contract enums may differ)
// ============================================================================

export const CONTRACT_APPROACH_MAP: Record<string, string> = {
  'INTERNAL': 'Internal',
  'ACROSS_GOVERNMENT': 'Across Government',
  'EXTERNAL': 'External',
};

export const CONTRACT_ASSIGNMENT_MAP: Record<string, string> = {
  'APPRENTICE': 'Apprentice',
  'FIXED_TERM': 'Fixed Term Appointment (FTA)',
  'LOAN': 'Loan',
  'SECONDMENT': 'Secondment',
  'PERMANENT': 'Permanent',
};
