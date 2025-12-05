# Type Refactor Migration Guide

This document describes the type refactoring architecture and provides migration steps for updating to `@cs-jobs/contracts` when it becomes available.

## Overview

The codebase now uses a three-layer type architecture:

1. **Contracts** (`src/types/contracts-shim/`) - External/API types
2. **Domain** (`src/types/domain/`) - Canonical app types (single source of truth)
3. **Views** (`src/types/views/`) - UI/Component-specific types

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     External Data Sources                        │
│         (@cs-jobs/contracts or API responses)                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              contract-to-domain.ts (Mapper)                      │
│         Maps contract types → domain types                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Domain Types (src/types/domain/)              │
│    Job, JobSearchResponse, Salary, FixedLocation, etc.          │
│         ⬆ Single import source for all app code                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               domain-to-view.ts (Mapper)                         │
│         Maps domain types → view types                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   View Types (src/types/views/)                  │
│    JobCardView, JobDetailsView, ResultsPageView, etc.           │
│         ⬆ Used by components for rendering                      │
└─────────────────────────────────────────────────────────────────┘
```

## Import Rules

### ✅ DO: Import domain types from `src/types/domain`

```typescript
import type { Job, JobSearchResponse, Salary } from '@/src/types/domain';
import { Approach, Assignments, isOverseasLocation } from '@/src/types/domain';
```

### ✅ DO: Import view types from `src/types/views`

```typescript
import type { JobCardView, ResultsPageView } from '@/src/types/views';
```

### ❌ DON'T: Import directly from contracts packages

```typescript
// ❌ WRONG - Never import contracts in app code
import type { ContractJob } from '@cs-jobs/contracts';

// ✅ CORRECT - Use domain types
import type { Job } from '@/src/types/domain';
```

## Data Provider Pattern

The `DataProvider` interface abstracts data source access:

```typescript
import { createDataProvider } from '@/src/lib/data';

const provider = createDataProvider();
const jobs = await provider.getJobs();
const job = await provider.getJobById('123');
const response = await provider.getPaginatedJobs(1, 10);
```

### Available Providers

- **MockProvider** - Uses local mock data (development)
- **ApiProvider** - Uses external API (production)

## Migrating to @cs-jobs/contracts

When the `@cs-jobs/contracts` package is available, follow these steps:

### Step 1: Install the Package

```bash
npm install @cs-jobs/contracts@<version>
```

### Step 2: Choose Migration Strategy

#### Option A: Adapter-First (Recommended)

Keep existing domain types and update mappers to handle contract types.

1. Update `src/lib/mappers/contract-to-domain.ts`:

```typescript
// Change this import:
import type { ContractJob } from '../../types/contracts-shim';

// To this:
import type { ContractJob } from '@cs-jobs/contracts';
```

2. Update mapper functions if contract shapes differ from shim types.

3. Run tests to ensure mapping still works:

```bash
npm test
```

#### Option B: Re-export Domain Types

Replace domain types with re-exports from the contracts package.

1. Update `src/types/domain/index.ts`:

```typescript
// Re-export types from contracts package
export type {
  Job,
  JobSearchResponse,
  Salary,
  // ... other types
} from '@cs-jobs/contracts';

// Keep enums and type guards locally if they differ
export { Approach, Assignments } from '@cs-jobs/contracts';
```

2. Keep deprecated shims for at least one release:

```typescript
// app/lib/jobTypes.ts
/**
 * @deprecated Use imports from 'src/types/domain' instead
 */
export * from '@/src/types/domain';
```

### Step 3: Update API Provider (if needed)

If the API response format changes with the new package:

```typescript
// src/lib/data/api-provider.ts
import type { ApiResponse } from '@cs-jobs/contracts';

async getPaginatedJobs(page: number, pageSize: number): Promise<JobSearchResponse> {
  const response = await fetch(...);
  const data: ApiResponse = await response.json();
  return mapContractSearchResponseToDomain(data);
}
```

### Step 4: Run Tests

```bash
# Type check
npx tsc --noEmit

# Run all tests
npm test

# Run lint
npm run lint
```

### Step 5: Clean Up

After migration is complete and verified:

1. Remove `src/types/contracts-shim/` directory
2. Remove deprecated exports after one release cycle
3. Update this documentation

## Deprecated Types

The following types are deprecated and will be removed in a future release:

| Deprecated Type | New Type | Location |
|----------------|----------|----------|
| `fixedLocations` | `FixedLocation` | `src/types/domain` |
| `overseasLocations` | `OverseasLocation` | `src/types/domain` |

### Migration Example

```typescript
// Before (deprecated)
import type { fixedLocations } from '@/app/lib/jobTypes';

// After
import type { FixedLocation } from '@/src/types/domain';
```

## Mapper Functions

### Contract to Domain

Located in `src/lib/mappers/contract-to-domain.ts`:

| Function | Description |
|----------|-------------|
| `mapContractJobToDomain` | Maps contract job to domain job |
| `mapContractSearchResponseToDomain` | Maps search response |
| `mapContractLocationToDomain` | Maps location types |
| `mapContractSalaryToDomain` | Maps salary types |
| `mapContractAttachmentToDomain` | Maps attachment types |

### Domain to View

Located in `src/lib/mappers/domain-to-view.ts`:

| Function | Description |
|----------|-------------|
| `mapJobToCardView` | Maps job to search result card |
| `mapJobToDetailsView` | Maps job to detail page header |
| `mapJobToAdvertView` | Maps job to advert content |
| `mapSearchResponseToResultsView` | Maps search response to results page |
| `formatDate` | Formats date to GB locale |
| `formatSalary` | Formats salary to display string |
| `formatLocationDisplay` | Formats location array to string |

## Testing

### Mapper Tests

Create fixtures in `tests/fixtures/` to test mappers:

```typescript
// tests/fixtures/contract-job.fixture.ts
export const sampleContractJob: ContractJob = {
  job_id: 'test-123',
  job_title: 'Test Job',
  // ... other fields
};
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern=mappers
```

## Troubleshooting

### Type Errors After Migration

1. Check that all imports point to `src/types/domain`
2. Verify enum values match between packages
3. Run `npx tsc --noEmit` for detailed error messages

### Missing Fields

If the contracts package has different fields:

1. Add them to domain types if needed by the app
2. Update mappers to handle missing/renamed fields
3. Provide defaults in mappers for optional fields

### Enum Mismatches

If enum values differ between packages:

1. Keep local enum definitions in domain types
2. Add mapping functions in `contract-to-domain.ts`

## File Structure

```
src/
├── types/
│   ├── contracts-shim/    # Sample contract types (remove after migration)
│   │   └── index.ts
│   ├── domain/            # Canonical app types
│   │   └── index.ts
│   └── views/             # UI-specific types
│       └── index.ts
├── lib/
│   ├── mappers/
│   │   ├── contract-to-domain.ts
│   │   └── domain-to-view.ts
│   └── data/
│       ├── data-provider.ts
│       ├── mock-provider.ts
│       ├── api-provider.ts
│       └── index.ts
docs/
└── TYPE_REFACTOR.md       # This file
tests/
└── fixtures/              # Test fixtures
```

## Timeline

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Create type architecture | ✅ Complete |
| Phase 2 | Migrate pilot page (Results) | 🔄 In Progress |
| Phase 3 | Migrate remaining pages | ⏳ Pending |
| Phase 4 | Install @cs-jobs/contracts | ⏳ Pending |
| Phase 5 | Remove deprecated types | ⏳ Pending |

## Contact

For questions about the type refactor, see the PR description or reach out to the maintainers.
