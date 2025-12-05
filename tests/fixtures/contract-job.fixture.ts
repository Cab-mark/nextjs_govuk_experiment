/**
 * Contract Job Fixture
 * 
 * Sample contract job payload for testing contract-to-domain mappers.
 */

import type { ContractJob, ContractJobSearchResponse } from '../../src/types/contracts-shim';

export const sampleContractJob: ContractJob = {
  job_id: 'test-job-001',
  approach_type: 'EXTERNAL',
  job_title: 'Senior Software Engineer',
  job_description: 'We are looking for an experienced software engineer to join our team.',
  organisation_name: 'Government Digital Service',
  locations: [
    {
      type: 'uk',
      pao_text: '10 Whitechapel High Street',
      town_name: 'London',
      post_town: 'London',
      postcode: 'E1 8QS',
      latitude: 51.5155,
      longitude: -0.0742,
      formatted_address: '10 Whitechapel High Street, London, E1 8QS',
    },
  ],
  grade_level: 'Grade 7 Equivalent',
  assignment_type: 'PERMANENT',
  personal_specification: 'Strong TypeScript skills required.',
  application_details: 'Apply online via Civil Service Jobs.',
  closing_date: '2025-12-31T23:59:59.000Z',
  profession_type: 'Digital and Data',
  recruitment_email: 'recruitment@gds.gov.uk',
  contact_name: 'Jane Smith',
  contact_email: 'jane.smith@gds.gov.uk',
  salary_info: {
    min_amount: 55000,
    max_amount: 65000,
    currency_code: 'GBP',
    currency_symbol: '£',
    additional_details: 'Plus excellent benefits package',
  },
  number_of_positions: 2,
  job_summary: 'Exciting opportunity to work on government digital services.',
  benefits_description: 'Civil Service pension, flexible working, learning budget.',
  diversity_statement: 'We are committed to diversity and inclusion.',
  job_attachments: [
    {
      url: 'https://example.com/role-profile.pdf',
      document_name: 'Role Profile',
      document_format: 'pdf',
      file_size_bytes: 102400,
    },
  ],
};

export const sampleOverseasContractJob: ContractJob = {
  job_id: 'test-overseas-001',
  approach_type: 'EXTERNAL',
  job_title: 'Embassy Operations Manager',
  job_description: 'Manage embassy operations in Paris.',
  organisation_name: 'Foreign, Commonwealth & Development Office',
  locations: [
    {
      type: 'overseas',
      country_name: 'France',
      country_code: 'FR',
      location_display: 'British Embassy, Paris',
    },
  ],
  grade_level: 'Grade 7 Equivalent',
  assignment_type: 'PERMANENT',
  personal_specification: 'French language skills required.',
  application_details: 'Apply via FCDO careers portal.',
  closing_date: '2026-01-31T23:59:59.000Z',
  profession_type: 'Operational Delivery',
  recruitment_email: 'recruitment@fco.gov.uk',
  salary_info: {
    min_amount: 58000,
    currency_code: 'EUR',
    currency_symbol: '€',
  },
};

export const sampleContractSearchResponse: ContractJobSearchResponse = {
  jobs: [sampleContractJob, sampleOverseasContractJob],
  total_count: 2,
  current_page: 1,
  page_size: 10,
  total_pages: 1,
  search_query: 'engineer',
  applied_filters: { profession: ['Digital and Data'] },
};
