/**
 * Contract to Domain Mappers
 * 
 * Maps contract types (from API or @cs-jobs/contracts package) to domain types.
 * This is the SINGLE PLACE to handle differences between contract and domain types.
 * 
 * When upgrading to @cs-jobs/contracts:
 * 1. Update these mappers to accept the new contract shapes
 * 2. Domain types remain stable; only mappers change
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

import type {
  Job,
  JobAttachment,
  JobLocation,
  FixedLocation,
  OverseasLocation,
  Salary,
  JobSearchResponse,
  DCStatus,
} from '../../types/domain';

import {
  Approach,
  Assignments,
  Profession,
} from '../../types/domain';

import type {
  ContractJob,
  ContractLocation,
  ContractSalary,
  ContractAttachment,
  ContractJobSearchResponse,
} from '../../types/contracts-shim';

// ============================================================================
// Location Mappers
// ============================================================================

/**
 * Maps a contract location to a domain location
 */
export function mapContractLocationToDomain(location: ContractLocation): JobLocation {
  if (location.type === 'overseas' && location.country_name) {
    return {
      countryName: location.country_name,
      countryCode: location.country_code || '',
      locationDisplay: location.location_display,
    } as OverseasLocation;
  }

  return {
    uprn: location.uprn,
    saoText: location.sao_text,
    paoText: location.pao_text,
    streetDescription: location.street_description,
    locality: location.locality,
    townName: location.town_name,
    postTown: location.post_town,
    postcode: location.postcode,
    latitude: location.latitude,
    longitude: location.longitude,
    formattedAddress: location.formatted_address,
    fullAddressSearch: location.full_address_search,
  } as FixedLocation;
}

// ============================================================================
// Salary Mapper
// ============================================================================

/**
 * Maps a contract salary to a domain salary
 */
export function mapContractSalaryToDomain(salary: ContractSalary): Salary {
  return {
    minimum: salary.min_amount,
    maximum: salary.max_amount,
    currency: salary.currency_code,
    currencySymbol: salary.currency_symbol,
    salaryDetails: salary.additional_details,
  };
}

// ============================================================================
// Attachment Mapper
// ============================================================================

/**
 * Maps a contract attachment to a domain attachment
 */
export function mapContractAttachmentToDomain(attachment: ContractAttachment): JobAttachment {
  return {
    href: attachment.url,
    docName: attachment.document_name,
    docFormat: attachment.document_format,
    fileSize: attachment.file_size_bytes
      ? formatFileSize(attachment.file_size_bytes)
      : undefined,
  };
}

/**
 * Formats file size in bytes to human-readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} mb`;
}

// ============================================================================
// Approach Mapper
// ============================================================================

/**
 * Maps contract approach string to domain Approach enum
 */
export function mapContractApproachToDomain(approach: string): Approach {
  const approachMap: Record<string, Approach> = {
    'INTERNAL': Approach.Internal,
    'Internal': Approach.Internal,
    'ACROSS_GOVERNMENT': Approach.AcrossGovernment,
    'Across Government': Approach.AcrossGovernment,
    'EXTERNAL': Approach.External,
    'External': Approach.External,
  };
  return approachMap[approach] || Approach.External;
}

/**
 * Maps contract assignment type to domain Assignments enum
 */
export function mapContractAssignmentToDomain(assignment: string): Assignments {
  const assignmentMap: Record<string, Assignments> = {
    'APPRENTICE': Assignments.Apprentice,
    'Apprentice': Assignments.Apprentice,
    'FIXED_TERM': Assignments.FixedTermAppointment,
    'Fixed Term Appointment (FTA)': Assignments.FixedTermAppointment,
    'LOAN': Assignments.Loan,
    'Loan': Assignments.Loan,
    'SECONDMENT': Assignments.Secondment,
    'Secondment': Assignments.Secondment,
    'PERMANENT': Assignments.Permanent,
    'Permanent': Assignments.Permanent,
  };
  return assignmentMap[assignment] || Assignments.Permanent;
}

/**
 * Maps contract profession string to domain Profession enum
 */
export function mapContractProfessionToDomain(profession: string): Profession {
  // Check if the value is already a valid Profession enum value
  const professionValues = Object.values(Profession);
  if (professionValues.includes(profession as Profession)) {
    return profession as Profession;
  }
  // Default to Policy if unknown
  return Profession.Policy;
}

/**
 * Maps contract DC status string to domain DCStatus enum
 */
export function mapContractDCStatusToDomain(dcStatus: string | undefined): DCStatus | undefined {
  if (!dcStatus) return undefined;
  
  const dcStatusMap: Record<string, DCStatus> = {
    'COMMITTED': 'Committed' as DCStatus,
    'Committed': 'Committed' as DCStatus,
    'EMPLOYER': 'Disability Confident Employer' as DCStatus,
    'Disability Confident Employer': 'Disability Confident Employer' as DCStatus,
    'LEADER': 'Disability Confident Leader' as DCStatus,
    'Disability Confident Leader': 'Disability Confident Leader' as DCStatus,
  };
  return dcStatusMap[dcStatus];
}

// ============================================================================
// Job Mapper
// ============================================================================

/**
 * Maps a contract job to a domain job
 */
export function mapContractJobToDomain(contractJob: ContractJob): Job {
  return {
    id: contractJob.job_id,
    approach: mapContractApproachToDomain(contractJob.approach_type),
    title: contractJob.job_title,
    description: contractJob.job_description,
    organisation: contractJob.organisation_name,
    location: contractJob.locations.map(mapContractLocationToDomain),
    grade: contractJob.grade_level,
    assignmentType: mapContractAssignmentToDomain(contractJob.assignment_type),
    personalSpec: contractJob.personal_specification,
    applyDetail: contractJob.application_details,
    closingDate: new Date(contractJob.closing_date),
    profession: mapContractProfessionToDomain(contractJob.profession_type),
    recruitmentEmail: contractJob.recruitment_email,
    contactName: contractJob.contact_name,
    contactEmail: contractJob.contact_email,
    contactPhone: contractJob.contact_phone,
    nationalityRequirement: contractJob.nationality_requirement,
    summary: contractJob.job_summary,
    applyUrl: contractJob.application_url ? new URL(contractJob.application_url) : undefined,
    benefits: contractJob.benefits_description,
    salary: contractJob.salary_info
      ? mapContractSalaryToDomain(contractJob.salary_info)
      : undefined,
    jobNumbers: contractJob.number_of_positions,
    successProfileDetails: contractJob.success_profile_details,
    diversityStatement: contractJob.diversity_statement,
    disabilityConfident: contractJob.disability_confident_status,
    dcStatus: mapContractDCStatusToDomain(contractJob.dc_status_level),
    redeploymentScheme: contractJob.redeployment_scheme_info,
    prisonScheme: contractJob.prison_scheme_info,
    veteranScheme: contractJob.veteran_scheme_info,
    criminalRecordCheck: contractJob.criminal_record_check,
    complaintsInfo: contractJob.complaints_info,
    workingForTheCivilService: contractJob.civil_service_info,
    eligibilityCheck: contractJob.eligibility_check,
    attachments: contractJob.job_attachments?.map(mapContractAttachmentToDomain),
  };
}

// ============================================================================
// Search Response Mapper
// ============================================================================

/**
 * Maps a contract search response to a domain search response
 */
export function mapContractSearchResponseToDomain(
  response: ContractJobSearchResponse
): JobSearchResponse {
  return {
    results: response.jobs.map(mapContractJobToDomain),
    total: response.total_count,
    page: response.current_page,
    pageSize: response.page_size,
    totalPages: response.total_pages,
    query: response.search_query,
    appliedFilters: response.applied_filters
      ? JSON.stringify(response.applied_filters)
      : null,
  };
}
