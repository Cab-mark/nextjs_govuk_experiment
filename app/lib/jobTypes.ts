/**
 * Type definitions for job board
 * 
 * @deprecated This file is deprecated. Import types from 'src/types/domain' instead.
 * These exports are maintained for backward compatibility during migration.
 * TODO: Remove this file after all consumers have migrated to src/types/domain
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

// Re-export all domain types for backward compatibility
export {
  Approach,
  Assignments,
  Grade,
  Profession,
  DCStatus,
  type JobAttachment,
  type Salary,
  type Job,
  type JobSearchResponse,
  type FixedLocation,
  type OverseasLocation,
  type JobLocation,
  isOverseasLocation,
  isFixedLocation,
} from '../../src/types/domain';

// Deprecated type aliases for backward compatibility
// TODO: Remove these after migration - see docs/TYPE_REFACTOR.md

import type { FixedLocation, OverseasLocation } from '../../src/types/domain';

/**
 * @deprecated Use FixedLocation from 'src/types/domain' instead
 * TODO: Remove after migration - see docs/TYPE_REFACTOR.md
 */
export type fixedLocations = FixedLocation;

/**
 * @deprecated Use OverseasLocation from 'src/types/domain' instead
 * TODO: Remove after migration - see docs/TYPE_REFACTOR.md
 */
export type overseasLocations = OverseasLocation;
