/**
 * Mappers Index
 * 
 * Re-exports all mapper functions for convenient importing.
 */

// Contract to Domain mappers
export {
  mapContractJobToDomain,
  mapContractSearchResponseToDomain,
  mapContractLocationToDomain,
  mapContractSalaryToDomain,
  mapContractAttachmentToDomain,
  mapContractApproachToDomain,
  mapContractAssignmentToDomain,
} from './contract-to-domain';

// Domain to View mappers
export {
  mapJobToCardView,
  mapJobToDetailsView,
  mapJobToAdvertView,
  mapSearchResponseToResultsView,
  mapToPaginationView,
  mapJobToAlertView,
  formatDate,
  formatSalary,
  formatLocationDisplay,
} from './domain-to-view';
