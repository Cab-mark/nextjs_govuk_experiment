/**
 * Domain Job Fixture
 * 
 * Sample domain job data for testing domain-to-view mappers.
 */

import type { Job, JobSearchResponse } from '../../src/types/domain';
import { Approach, Assignments, Profession } from '../../src/types/domain';

export const sampleDomainJob: Job = {
  id: 'test-job-001',
  approach: Approach.External,
  title: 'Senior Software Engineer',
  description: 'We are looking for an experienced software engineer to join our team.',
  organisation: 'Government Digital Service',
  location: [
    {
      paoText: '10 Whitechapel High Street',
      townName: 'London',
      postTown: 'London',
      postcode: 'E1 8QS',
      latitude: 51.5155,
      longitude: -0.0742,
      formattedAddress: '10 Whitechapel High Street, London, E1 8QS',
    },
  ],
  grade: 'Grade 7 Equivalent',
  assignmentType: Assignments.Permanent,
  personalSpec: 'Strong TypeScript skills required.',
  applyDetail: 'Apply online via Civil Service Jobs.',
  closingDate: new Date('2025-12-31T23:59:59.000Z'),
  profession: Profession.DigitalAndData,
  recruitmentEmail: 'recruitment@gds.gov.uk',
  contactName: 'Jane Smith',
  contactEmail: 'jane.smith@gds.gov.uk',
  salary: {
    minimum: 55000,
    maximum: 65000,
    currency: 'GBP',
    currencySymbol: '£',
    salaryDetails: 'Plus excellent benefits package',
  },
  jobNumbers: 2,
  summary: 'Exciting opportunity to work on government digital services.',
  benefits: 'Civil Service pension, flexible working, learning budget.',
  diversityStatement: 'We are committed to diversity and inclusion.',
  attachments: [
    {
      href: 'https://example.com/role-profile.pdf',
      docName: 'Role Profile',
      docFormat: 'pdf',
      fileSize: '100 kb',
    },
  ],
};

export const sampleOverseasDomainJob: Job = {
  id: 'test-overseas-001',
  approach: Approach.External,
  title: 'Embassy Operations Manager',
  description: 'Manage embassy operations in Paris.',
  organisation: 'Foreign, Commonwealth & Development Office',
  location: [
    {
      countryName: 'France',
      countryCode: 'FR',
      locationDisplay: 'British Embassy, Paris',
    },
  ],
  grade: 'Grade 7 Equivalent',
  assignmentType: Assignments.Permanent,
  personalSpec: 'French language skills required.',
  applyDetail: 'Apply via FCDO careers portal.',
  closingDate: new Date('2026-01-31T23:59:59.000Z'),
  profession: Profession.OperationalDelivery,
  recruitmentEmail: 'recruitment@fco.gov.uk',
  salary: {
    minimum: 58000,
    currency: 'EUR',
    currencySymbol: '€',
  },
};

export const sampleJobWithNoSalary: Job = {
  id: 'test-no-salary-001',
  approach: Approach.Internal,
  title: 'Policy Advisor',
  description: 'Develop policy for the department.',
  organisation: 'Ministry of Defence',
  location: [
    {
      townName: 'Bristol',
      postTown: 'Bristol',
      postcode: 'BS2 0EL',
      formattedAddress: 'Bristol, BS2 0EL',
    },
  ],
  grade: 'Grade 6',
  assignmentType: Assignments.FixedTermAppointment,
  personalSpec: 'Policy experience required.',
  applyDetail: 'Apply via Civil Service Jobs.',
  closingDate: new Date('2025-06-30T23:59:59.000Z'),
  profession: Profession.Policy,
  recruitmentEmail: 'recruitment@mod.gov.uk',
};

export const sampleJobSearchResponse: JobSearchResponse = {
  results: [sampleDomainJob, sampleOverseasDomainJob],
  total: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  query: 'engineer',
  appliedFilters: null,
};
