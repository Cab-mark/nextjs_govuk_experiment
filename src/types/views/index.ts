/**
 * View Types - UI/Component-specific types
 * 
 * These types are used by pages and components for rendering.
 * They are derived from domain types via mappers.
 * 
 * @see src/lib/mappers/domain-to-view.ts for mappers
 */

import type { Assignments, DCStatus, Profession } from '../domain';

// ============================================================================
// Job Card View (for search results listing)
// ============================================================================

export interface JobCardView {
  id: string;
  title: string;
  organisation: string;
  locationDisplay: string;
  contractType: string;
  salaryDisplay: string | null;
  closingDateDisplay: string;
  href: string;
}

// ============================================================================
// Job Details View (for job detail page)
// ============================================================================

export interface JobDetailsView {
  id: string;
  title: string;
  organisation: string;
  locationDisplay: string;
  salaryDisplay: string | null;
  salaryDetails: string | null;
  contractType: string;
  jobNumbers: number | null;
  profession: string | null;
  closingDateDisplay: string;
  applyUrl: string | null;
}

export interface JobAdvertView {
  id: string;
  summary: string | null;
  description: string;
  personalSpec: string;
  benefits: string | null;
  contactName: string | null;
  contactEmail: string | null;
  recruitmentEmail: string;
  applyDetail: string | null;
  nationalityRequirement: string | null;
  disabilityConfident: string | null;
  diversityStatement: string | null;
  veteranScheme: string | null;
  prisonScheme: string | null;
  eligibilityCheck: string | null;
  criminalRecordCheck: string | null;
  workingForTheCivilService: string | null;
  complaintsInfo: string | null;
  applyUrl: string | null;
  attachments: AttachmentView[];
}

export interface AttachmentView {
  href: string;
  name: string;
  format: string;
  fileSize: string | null;
}

// ============================================================================
// Results Page View
// ============================================================================

export interface ResultsPageView {
  jobs: JobCardView[];
  pagination: PaginationView;
}

export interface PaginationView {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

// ============================================================================
// Filter Types (for future use)
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValues: string[];
}

export interface FiltersView {
  contractTypes: FilterGroup;
  professions: FilterGroup;
  grades: FilterGroup;
  locations: FilterGroup;
}

// ============================================================================
// Job Alert View (for job alert functionality)
// ============================================================================

export interface JobAlertView {
  id: string;
  title: string;
  organisation: string;
  locationDisplay: string;
  contractType: Assignments;
  profession: Profession;
  dcStatus: DCStatus | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
}
