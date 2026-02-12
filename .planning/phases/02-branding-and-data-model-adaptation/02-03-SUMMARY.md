---
phase: 02
plan: 03
subsystem: type-system
tags: [typescript, types, domain-model, kpi, ngo]
requires: [02-02]
provides:
  - type-aliases
  - ngo-domain-types
  - kpi-metrics
affects: [02-04, 02-05, 02-06]
tech-stack:
  added: []
  patterns: [type-alias, semantic-types, fulfillment-tracking]
key-files:
  created:
    - back-end/src/modules/users/types/donor.types.ts
    - back-end/src/modules/projects/types/adoption.types.ts
    - front-end/src/types/donor.types.ts
    - front-end/src/types/adoption.types.ts
  modified:
    - front-end/src/features/dashboard/overview/kpi/kpiData.tsx
    - front-end/messages/dashboard/overview/en.json
decisions: [donor-type-alias, adoption-fulfillment-tracking, kpi-ngo-metrics]
metrics:
  duration: 143s
  completed: 2026-02-12
---

# Phase 2 Plan 3: Type Aliases & KPI Adaptation Summary

**One-liner:** Created Donor/CoralAdoption type aliases with fulfillment tracking and adapted dashboard KPIs to NGO metrics (donors, adoptions, giving, sites).

## What Was Built

### 1. Backend Type Aliases
Created semantic type aliases mapping NGO domain terminology to existing entities:

**Donor Type System** (`back-end/src/modules/users/types/donor.types.ts`):
- `Donor` type alias = `User` entity
- `DonorProfile` interface with computed NGO-specific fields (lifetimeGiving, adoptionCount, engagementScore)
- `DonorListItem` lightweight DTO for list views

**CoralAdoption Type System** (`back-end/src/modules/projects/types/adoption.types.ts`):
- `CoralAdoption` type alias = `Project` entity
- `AdoptionFulfillment` interface with workflow tracking:
  - `isNamed`: Coral has a name
  - `certificateIssued`: Certificate generated
  - `siteAssigned`: Restoration site assigned
- `AdoptionDetails` full adoption view interface
- `AdoptionListItem` lightweight DTO for list views

### 2. Frontend Type Definitions
Created matching frontend types for API response typing:

**Donor Types** (`front-end/src/types/donor.types.ts`):
- `Donor` interface mirroring backend `DonorProfile`
- `DonorListItem` for list views
- Date fields as strings (JSON serialization)

**Adoption Types** (`front-end/src/types/adoption.types.ts`):
- `CoralAdoption` interface mirroring backend `AdoptionDetails`
- `AdoptionFulfillment` with same workflow tracking fields
- `AdoptionListItem` for list views

### 3. Dashboard KPI Adaptation
Updated dashboard overview KPIs to show NGO-relevant metrics:

**Previous Metrics** → **New Metrics**:
1. Total Projects → **Total Donors** (1,847 donors, +12% trend)
2. Active Users → **Active Adoptions** (24 adoptions, +3 trend)
3. Task Completion → **Total Giving** ($45,200, +8% trend)
4. Avg Response Time → **Restoration Sites** (3 sites, stable)

**Icon Updates**:
- IconUsers (donors)
- IconHeart (adoptions)
- IconCurrencyDollar (giving)
- IconMapPin (restoration sites)

**i18n Enhancement**:
Added `kpi.metrics` section to `en.json` with metric labels and descriptions for future extensibility.

## Technical Decisions

### Decision: Donor Type Alias
**Choice:** Use `export type Donor = User` instead of extending User entity
**Rationale:**
- Preserves all existing infrastructure (no database changes)
- Provides semantic clarity for business logic
- Easy to adopt incrementally
- No runtime cost

**Impact:** Developers can use `Donor` in business logic and API responses while `User` remains for database layer

### Decision: Adoption Fulfillment Tracking
**Choice:** Define `AdoptionFulfillment` interface with isNamed/certificateIssued/siteAssigned booleans
**Rationale:**
- Models real-world NGO workflow (name → certificate → site assignment)
- Simple boolean flags easy to implement
- Extensible for future fields (coralName, certificateUrl, siteName)

**Impact:** Sets foundation for adoption fulfillment features in Phase 3

### Decision: KPI NGO Metrics
**Choice:** Replace generic metrics with donor/adoption/giving/sites
**Rationale:**
- Makes dashboard immediately useful for NGO operations
- Metrics match PROJECT.md value statement
- Mock data okay - will be populated with real data in Phase 3

**Impact:** Dashboard overview now shows NGO-relevant data, not generic project management metrics

## Deviations from Plan

None - plan executed exactly as written.

## Testing & Verification

**Type System:**
- ✅ All 4 type files created
- ✅ Backend imports from correct entity paths
- ✅ `export type Donor` and `export type CoralAdoption` exist
- ✅ `AdoptionFulfillment` has isNamed/certificateIssued/siteAssigned
- ✅ Backend TypeScript compilation passes (no errors)

**KPI Section:**
- ✅ Icons updated to IconUsers, IconHeart, IconCurrencyDollar, IconMapPin
- ✅ Metrics display NGO terminology
- ✅ i18n includes metric descriptions
- ✅ No import errors in kpiData.tsx

## Files Changed

### Created (4 files)
- `back-end/src/modules/users/types/donor.types.ts` - Donor type system (1,050 bytes)
- `back-end/src/modules/projects/types/adoption.types.ts` - Adoption type system (1,281 bytes)
- `front-end/src/types/donor.types.ts` - Frontend donor types (707 bytes)
- `front-end/src/types/adoption.types.ts` - Frontend adoption types (823 bytes)

### Modified (2 files)
- `front-end/src/features/dashboard/overview/kpi/kpiData.tsx` - Updated KPI definitions
- `front-end/messages/dashboard/overview/en.json` - Added kpi.metrics section

## Commits

| Commit | Message | Files |
|--------|---------|-------|
| c84c3b2 | feat(02-03): create type aliases for NGO domain terminology | 4 type files |
| acb5327 | feat(02-03): adapt dashboard KPI section for NGO metrics | kpiData.tsx, en.json |

## Next Phase Readiness

**What's Ready:**
- Type aliases available for use in future plans
- KPI section displays NGO metrics (mock data)
- AdoptionFulfillment structure ready for implementation

**What Depends on This:**
- Plan 02-04: CSV import/export will use Donor and CoralAdoption types
- Plan 02-05: Seeding will populate KPI metrics with real data
- Phase 3: Features will use type aliases throughout

**Open Questions:**
None - types are passive definitions, no blocking issues.

## Retrospective

**What Went Well:**
- Type alias pattern is clean and non-invasive
- KPI adaptation straightforward (just data updates)
- No breaking changes to existing code
- Fast execution (143s / ~2.5 minutes)

**What Could Be Better:**
- Frontend Next.js build requires dependency installation (unrelated to this plan)
- Total Giving is mock data - will need financial tracking in future phase

**Key Learnings:**
- Type aliases are perfect for semantic rebranding without structural changes
- Mock data in KPIs acceptable during branding phase - real data comes in seeding phase
- Multilingual KPI structure already in place from previous plans

## Dependencies

**Consumed from Previous Plans:**
- 02-01: Sidebar already uses "Donors" and "Coral Adoptions" labels
- 02-02: i18n files already rebranded to NGO terminology

**Provides to Future Plans:**
- 02-04: Type definitions for CSV import/export
- 02-05: KPI structure ready for real data population
- 02-06: AdoptionFulfillment interface for analytics features

**External Dependencies:**
None - pure TypeScript type definitions
