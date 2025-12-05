/**
 * Data Provider Interface
 * 
 * Abstracts data source access for the application.
 * Implementations return domain types, allowing easy switching between data sources.
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

import type { Job, JobSearchResponse } from '../../types/domain';
import { MockProvider } from './mock-provider';
import { ApiProvider } from './api-provider';

// ============================================================================
// DataProvider Interface
// ============================================================================

/**
 * DataProvider interface - abstracts data source for jobs
 * Implementations return domain types
 */
export interface DataProvider {
  /**
   * Get all jobs
   */
  getJobs(): Promise<Job[]>;

  /**
   * Get a job by ID
   */
  getJobById(id: string): Promise<Job | undefined>;

  /**
   * Get paginated jobs
   */
  getPaginatedJobs(page?: number, pageSize?: number): Promise<JobSearchResponse>;

  /**
   * Search jobs with query and filters
   */
  searchJobs?(query: string, filters?: Record<string, string[]>): Promise<JobSearchResponse>;
}

// ============================================================================
// Provider Factory
// ============================================================================

/**
 * Creates the appropriate data provider based on environment
 */
export function createDataProvider(): DataProvider {
  // In future, this could check environment variables to determine which provider to use
  // For now, always use MockProvider in development
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    return new MockProvider();
  }

  // In production, use ApiProvider
  return new ApiProvider();
}

// ============================================================================
// Default Export
// ============================================================================

// DataProvider interface is already exported above
