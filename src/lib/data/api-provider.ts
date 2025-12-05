/**
 * API Data Provider
 * 
 * Provides job data from an external API.
 * Maps contract types (from API) to domain types.
 * 
 * When @cs-jobs/contracts is installed:
 * - Update the mappers to handle the new contract shapes
 * - The API response structure may change
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

import type { DataProvider } from './data-provider';
import type { Job, JobSearchResponse } from '../../types/domain';
import type { ContractJob, ContractJobSearchResponse } from '../../types/contracts-shim';
import {
  mapContractJobToDomain,
  mapContractSearchResponseToDomain,
} from '../mappers/contract-to-domain';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.JOBS_API_URL || 'https://api.civilservicejobs.service.gov.uk';

// ============================================================================
// API Provider Implementation
// ============================================================================

/**
 * ApiProvider - provides job data from external API
 * Used in production environment
 */
export class ApiProvider implements DataProvider {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Get all jobs from API
   */
  async getJobs(): Promise<Job[]> {
    const response = await this.getPaginatedJobs(1, 1000);
    return response.results;
  }

  /**
   * Get a job by ID from API
   */
  async getJobById(id: string): Promise<Job | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error(`API error: ${response.status}`);
      }

      const contractJob: ContractJob = await response.json();
      return mapContractJobToDomain(contractJob);
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Get paginated jobs from API
   */
  async getPaginatedJobs(page: number = 1, pageSize: number = 10): Promise<JobSearchResponse> {
    try {
      const url = new URL(`${this.baseUrl}/jobs`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('pageSize', String(pageSize));

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const contractResponse: ContractJobSearchResponse = await response.json();
      return mapContractSearchResponseToDomain(contractResponse);
    } catch (error) {
      console.error('Error fetching paginated jobs:', error);
      // Return empty response on error
      return {
        results: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        query: null,
        appliedFilters: null,
      };
    }
  }

  /**
   * Search jobs with query and filters via API
   */
  async searchJobs(
    query: string,
    filters?: Record<string, string[]>
  ): Promise<JobSearchResponse> {
    try {
      const url = new URL(`${this.baseUrl}/jobs/search`);
      if (query) {
        url.searchParams.set('q', query);
      }

      // Add filters to query string
      if (filters) {
        Object.entries(filters).forEach(([key, values]) => {
          if (values.length > 0) {
            url.searchParams.set(key, values.join(','));
          }
        });
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const contractResponse: ContractJobSearchResponse = await response.json();
      return mapContractSearchResponseToDomain(contractResponse);
    } catch (error) {
      console.error('Error searching jobs:', error);
      // Return empty response on error
      return {
        results: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        query,
        appliedFilters: filters ? JSON.stringify(filters) : null,
      };
    }
  }
}
