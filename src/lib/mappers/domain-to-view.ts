/**
 * Domain to View Mappers
 * 
 * Maps domain types to view types for UI rendering.
 * Contains presentation logic (formatting dates, currency, addresses, etc.)
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

import type {
  Job,
  JobSearchResponse,
  JobLocation,
  Salary,
  JobAttachment,
} from '../../types/domain';

import type {
  JobCardView,
  JobDetailsView,
  JobAdvertView,
  AttachmentView,
  ResultsPageView,
  PaginationView,
  JobAlertView,
} from '../../types/views';

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Formats a date to GB locale string (e.g., "20 December 2025")
 */
export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return String(date);
  }
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a salary to display string (e.g., "£45,000 - £55,000")
 */
export function formatSalary(salary: Salary | undefined): string | null {
  if (!salary) return null;

  const symbol = salary.currencySymbol || '';
  let range = salary.minimum
    ? (symbol || '') + salary.minimum.toLocaleString()
    : '';

  if (salary.maximum) {
    range += ' - ' + (symbol || '') + salary.maximum.toLocaleString();
  }

  // Only show currency ISO if no symbol
  const currency = !symbol && salary.currency ? ` ${salary.currency}` : '';
  return `${range}${currency}`;
}

/**
 * Formats a location array to a display string
 */
export function formatLocationDisplay(locations: JobLocation[]): string {
  if (!locations || locations.length === 0) return '';

  return locations
    .map((loc) => {
      if (!loc) return '';

      // Check for overseas location
      if ('countryName' in loc) {
        return loc.locationDisplay || loc.countryName;
      }

      // Fixed/UK location
      if (loc.formattedAddress) {
        return loc.formattedAddress;
      }

      // Fallback: build address from known fields
      const address = [
        loc.saoText,
        loc.paoText,
        loc.streetDescription,
        loc.locality,
        loc.postTown,
        loc.postcode,
      ]
        .filter(Boolean)
        .join(', ');

      return address || '';
    })
    .filter(Boolean)
    .join(' | ');
}

// ============================================================================
// Job Card Mapper (for search results)
// ============================================================================

/**
 * Maps a domain Job to a JobCardView for rendering in search results
 */
export function mapJobToCardView(job: Job): JobCardView {
  return {
    id: job.id,
    title: job.title,
    organisation: job.organisation,
    locationDisplay: formatLocationDisplay(job.location),
    contractType: job.assignmentType,
    salaryDisplay: formatSalary(job.salary),
    closingDateDisplay: formatDate(job.closingDate),
    href: `/job/${job.id}`,
  };
}

// ============================================================================
// Job Details Mapper (for job detail page header)
// ============================================================================

/**
 * Maps a domain Job to a JobDetailsView for the job details header
 */
export function mapJobToDetailsView(job: Job): JobDetailsView {
  return {
    id: job.id,
    title: job.title,
    organisation: job.organisation,
    locationDisplay: formatLocationDisplay(job.location),
    salaryDisplay: formatSalary(job.salary),
    salaryDetails: job.salary?.salaryDetails || null,
    contractType: job.assignmentType,
    jobNumbers: job.jobNumbers || null,
    profession: job.profession || null,
    closingDateDisplay: formatDate(job.closingDate),
    applyUrl: job.applyUrl?.toString() || null,
  };
}

// ============================================================================
// Job Advert Mapper (for job detail page content)
// ============================================================================

/**
 * Maps a domain Job to a JobAdvertView for the job advert content
 */
export function mapJobToAdvertView(job: Job): JobAdvertView {
  return {
    id: job.id,
    summary: job.summary || null,
    description: job.description,
    personalSpec: job.personalSpec,
    benefits: job.benefits || null,
    contactName: job.contactName || null,
    contactEmail: job.contactEmail || null,
    recruitmentEmail: job.recruitmentEmail,
    applyDetail: job.applyDetail || null,
    nationalityRequirement: job.nationalityRequirement || null,
    disabilityConfident: job.disabilityConfident || null,
    diversityStatement: job.diversityStatement || null,
    veteranScheme: job.veteranScheme || null,
    prisonScheme: job.prisonScheme || null,
    eligibilityCheck: job.eligibilityCheck || null,
    criminalRecordCheck: job.criminalRecordCheck || null,
    workingForTheCivilService: job.workingForTheCivilService || null,
    complaintsInfo: job.complaintsInfo || null,
    applyUrl: job.applyUrl?.toString() || null,
    attachments: (job.attachments || []).map(mapAttachmentToView),
  };
}

/**
 * Maps a domain JobAttachment to an AttachmentView
 */
function mapAttachmentToView(attachment: JobAttachment): AttachmentView {
  return {
    href: attachment.href,
    name: attachment.docName || 'Attachment',
    format: attachment.docFormat,
    fileSize: attachment.fileSize || null,
  };
}

// ============================================================================
// Results Page Mapper
// ============================================================================

/**
 * Maps a JobSearchResponse to a ResultsPageView
 */
export function mapSearchResponseToResultsView(response: JobSearchResponse): ResultsPageView {
  return {
    jobs: response.results.map(mapJobToCardView),
    pagination: {
      currentPage: response.page,
      totalPages: response.totalPages,
      totalResults: response.total,
    },
  };
}

/**
 * Maps pagination data to a PaginationView
 */
export function mapToPaginationView(
  page: number,
  totalPages: number,
  total: number
): PaginationView {
  return {
    currentPage: page,
    totalPages,
    totalResults: total,
  };
}

// ============================================================================
// Job Alert Mapper
// ============================================================================

/**
 * Maps a domain Job to a JobAlertView for job alert functionality
 */
export function mapJobToAlertView(job: Job): JobAlertView {
  return {
    id: job.id,
    title: job.title,
    organisation: job.organisation,
    locationDisplay: formatLocationDisplay(job.location),
    contractType: job.assignmentType,
    profession: job.profession,
    dcStatus: job.dcStatus || null,
    salaryMin: job.salary?.minimum || null,
    salaryMax: job.salary?.maximum || null,
    currency: job.salary?.currency || null,
  };
}
