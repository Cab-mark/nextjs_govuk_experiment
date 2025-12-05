/**
 * Domain Types - Canonical app types
 * 
 * This is the single source of truth for domain types in the application.
 * All pages, components, and containers MUST import types from here.
 * 
 * When migrating to @cs-jobs/contracts package:
 * 1. Update the mappers in src/lib/mappers/contract-to-domain.ts
 * 2. Either keep these types as adapters OR re-export from @cs-jobs/contracts
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

// ============================================================================
// Enums
// ============================================================================

export enum Approach {
  Internal = "Internal",
  AcrossGovernment = "Across Government",
  External = "External"
}

export enum Assignments {
  Apprentice = "Apprentice",
  FixedTermAppointment = "Fixed Term Appointment (FTA)",
  Loan = "Loan",
  Secondment = "Secondment",
  Permanent = "Permanent"
}

export enum Grade {
  scs4 = "Senior Civil Service - Permanent Secretary",
  scs3 = "Senior Civil Service - Director General (PB3)",
  scs2 = "Senior Civil Service - Director (PB2)",
  scs1 = "Senior Civil Service - Deputy Director (PB1/1A)",
  grade6 = "Grade 6 Equivalent",
  grade7 = "Grade 7 Equivalent",
  seo = "Senior Executive Officer (SEO) Equivalent",
  heo = "Higher Executive Officer (HEO) Equivalent",
  eo = "Executive Officer (EO) Equivalent",
  ao = "Administrative Officer (AO) Equivalent",
  aa = "Administrative Assistant (AA) Equivalent"
}

export enum Profession {
  Actuary = "Actuary",
  Commercial = "Commercial",
  Communications = "Communications",
  CorporateFinance = "Corporate Finance",
  CounterFraud = "Counter Fraud",
  DigitalAndData = "Digital and Data",
  Economics = "Economics",
  Finance = "Finance",
  Geography = "Geography",
  HumanResources = "Human Resources",
  IntelligenceAnalysis = "Intelligence Analysis",
  InternalAudit = "Internal Audit",
  InternationalTrade = "International Trade",
  KnowledgeAndInformationManagement = "Knowledge and Information Management",
  Legal = "Legal",
  Clinical = "Clinical",
  OccupationalPsychology = "Occupational Psychology",
  OperationalDelivery = "Operational Delivery",
  OperationalResearch = "Operational Research",
  Planning = "Planning",
  PlanningInspection = "Planning Inspection",
  Policy = "Policy",
  ProjectDelivery = "Project Delivery",
  Property = "Property",
  RiskManagement = "Risk Management",
  ScienceAndEngineering = "Science and Engineering",
  Security = "Security",
  SocialResearch = "Social Research",
  Statistics = "Statistics",
  Tax = "Tax",
  Veterinary = "Veterinary",
}

export enum DCStatus {
  Committed = "Committed",
  Employer = "Disability Confident Employer",
  Leader = "Disability Confident Leader"
}

// ============================================================================
// Location Types
// ============================================================================

export interface FixedLocation {
  uprn?: string;
  saoText?: string;
  paoText?: string;
  streetDescription?: string;
  locality?: string;
  townName?: string;
  postTown?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  fullAddressSearch?: string;
}

export interface OverseasLocation {
  countryName: string;
  countryCode: string;
  locationDisplay?: string;
}

export type JobLocation = FixedLocation | OverseasLocation;

// ============================================================================
// Job-related Types
// ============================================================================

export interface JobAttachment {
  href: string;
  docName: string;
  docFormat: string;
  fileSize?: string;
}

export interface Salary {
  minimum: number;
  maximum?: number;
  currency: string;
  currencySymbol?: string;
  salaryDetails?: string;
}

export interface Job {
  readonly id: string;
  approach: Approach;
  title: string;
  description: string;
  organisation: string;
  location: JobLocation[];
  grade: Grade | string;
  assignmentType: Assignments;
  personalSpec: string;
  applyDetail: string;
  closingDate: Date;
  profession: Profession;
  recruitmentEmail: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  nationalityRequirement?: string;
  summary?: string;
  applyUrl?: URL;
  benefits?: string;
  salary?: Salary;
  jobNumbers?: number;
  successProfileDetails?: string;
  diversityStatement?: string;
  disabilityConfident?: string;
  dcStatus?: DCStatus;
  redeploymentScheme?: string;
  prisonScheme?: string;
  veteranScheme?: string;
  criminalRecordCheck?: string;
  complaintsInfo?: string;
  workingForTheCivilService?: string;
  eligibilityCheck?: string;
  attachments?: JobAttachment[];
}

// ============================================================================
// Pagination & Search Types
// ============================================================================

export interface ResultMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Paginated<T> {
  results: T[];
  metadata: ResultMetadata;
}

export interface JobSearchResponse {
  results: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: string | null;
  appliedFilters: string | null;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a location is an overseas location
 */
export function isOverseasLocation(location: JobLocation): location is OverseasLocation {
  return 'countryName' in location;
}

/**
 * Type guard to check if a location is a fixed/UK location
 */
export function isFixedLocation(location: JobLocation): location is FixedLocation {
  return !('countryName' in location);
}
