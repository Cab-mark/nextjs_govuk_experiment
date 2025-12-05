/**
 * Mock Data Provider
 * 
 * Provides mock job data for development and testing.
 * Uses the existing local jobs data and returns domain types.
 * 
 * @see docs/TYPE_REFACTOR.md for migration guide
 */

import type { DataProvider } from './data-provider';
import type { Job, JobSearchResponse } from '../../types/domain';

// Import the existing local jobs data
// Note: This import path will be updated when we migrate app/lib/jobs.local.ts
import { jobsData } from '../../../app/lib/jobs.local';

/**
 * MockProvider - provides job data from local mock data
 * Used in development environment
 */
export class MockProvider implements DataProvider {
  private jobs: Job[];

  constructor() {
    // Cast the imported data to domain Job[] type
    // The existing jobsData is already compatible with our domain types
    this.jobs = jobsData as Job[];
  }

  /**
   * Get all jobs
   */
  async getJobs(): Promise<Job[]> {
    return this.jobs;
  }

  /**
   * Get a job by ID
   */
  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.find((job) => job.id === id);
  }

  /**
   * Get paginated jobs
   */
  async getPaginatedJobs(page: number = 1, pageSize: number = 10): Promise<JobSearchResponse> {
    const validPage = Math.max(1, page);
    const totalPages = Math.ceil(this.jobs.length / pageSize);
    const clampedPage = Math.min(validPage, Math.max(1, totalPages));

    const startIndex = (clampedPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = this.jobs.slice(startIndex, endIndex);

    return {
      results: paginatedResults,
      total: this.jobs.length,
      page: clampedPage,
      pageSize,
      totalPages,
      query: null,
      appliedFilters: null,
    };
  }

  /**
   * Search jobs with query and filters
   */
  async searchJobs(
    query: string,
    filters?: Record<string, string[]>
  ): Promise<JobSearchResponse> {
    let filteredJobs = this.jobs;

    // Simple text search on title, description, and organisation
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery) ||
          job.organisation.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters if provided
    if (filters) {
      if (filters.profession?.length) {
        filteredJobs = filteredJobs.filter((job) =>
          filters.profession!.includes(job.profession)
        );
      }
      if (filters.assignmentType?.length) {
        filteredJobs = filteredJobs.filter((job) =>
          filters.assignmentType!.includes(job.assignmentType)
        );
      }
      if (filters.grade?.length) {
        filteredJobs = filteredJobs.filter((job) =>
          filters.grade!.includes(String(job.grade))
        );
      }
    }

    return {
      results: filteredJobs,
      total: filteredJobs.length,
      page: 1,
      pageSize: filteredJobs.length,
      totalPages: 1,
      query,
      appliedFilters: filters ? JSON.stringify(filters) : null,
    };
  }
}
