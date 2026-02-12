---
phase: 02
plan: 02
subsystem: frontend-i18n
tags: [i18n, rebrand, terminology, next-intl, coral-gardeners]
requires:
  - 02-01 (visual rebrand with theme and navigation)
provides:
  - ngo-terminology-strings
  - donor-adoption-messaging
  - restoration-context-labels
affects:
  - 02-03 (backend data model adaptation)
  - All future user-facing features (inherit consistent terminology)
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified:
    - front-end/messages/dashboard/users/en.json (donor terminology)
    - front-end/messages/dashboard/projects/en.json (adoption terminology)
    - front-end/messages/dashboard/overview/en.json (NGO metrics)
    - front-end/messages/ai-assistant/en.json (operations support context)
decisions:
  - id: donor-terminology-comprehensive
    decision: Rebranded all user-related text to donor context
    rationale: NGO focus on donor engagement vs generic user management
    impact: Users page now reads "Donors" with engagement-focused language
  - id: adoption-fulfillment-workflow
    decision: Projects rebranded as "Coral Adoptions" with fulfillment status tracking
    rationale: Aligns with NGO coral adoption program operations
    impact: Projects page now tracks adoption fulfillment (Fulfilled, Pending, On Hold)
  - id: restoration-site-naming
    decision: Environments renamed to restoration sites with French Polynesian locations
    rationale: Real-world Coral Gardeners restoration site names
    impact: Production->Moorea, Staging->Bora Bora, Development->Tahiti
metrics:
  duration: 2m 4s
  files-changed: 4
  terminology-changes: 56
  completed: 2026-02-12
---

# Phase 2 Plan 2: i18n Terminology Rebrand Summary

**One-liner:** Comprehensive i18n rebrand from generic business terms to Coral Gardeners NGO context (donors, coral adoptions, restoration sites) across 4 message files with 56+ terminology changes

## What Was Delivered

### i18n Message File Rebrand
Systematically rebranded all English i18n message files from generic business/platform terminology to NGO-specific context while preserving all JSON structure and keys.

**Files Modified:**

1. **front-end/messages/dashboard/users/en.json** (29 donor references)
   - Users → Donors
   - Username → Donor ID
   - Verified/Unverified → Active/Pending
   - Joined Date → First Donation
   - Account Status → Engagement Status
   - Delete User → Archive Donor

2. **front-end/messages/dashboard/projects/en.json** (22 adoption references)
   - Projects → Coral Adoptions
   - Project Name → Coral Name
   - Environment → Restoration Site
   - Production/Staging/Development → Moorea/Bora Bora/Tahiti
   - Ready/In Progress/Blocked → Fulfilled/Pending/On Hold
   - Status → Fulfillment Status
   - Version → Certificate ID
   - Project Image → Coral Photo

3. **front-end/messages/dashboard/overview/en.json**
   - Dashboard Overview → Operations Overview
   - Description → "Donor engagement, coral adoptions, and restoration metrics"
   - Subtitle → "Let's protect our reefs today!"
   - Performance analytics → Donor & adoption analytics
   - Manage daily tasks → Track restoration priorities
   - Upcoming events → Restoration events and milestones
   - Recent Projects → Recent Adoptions
   - Environment column → Site

4. **front-end/messages/ai-assistant/en.json**
   - Welcome message → "AI-powered assistant for donor analytics, adoption tracking, and operations support"

### Key Terminology Shifts

| Generic Term | NGO Term | Rationale |
|--------------|----------|-----------|
| Users | Donors | Focus on donor engagement vs generic user management |
| Username | Donor ID | Identity tied to giving relationship |
| Verified | Active | Engagement status vs technical verification |
| Projects | Coral Adoptions | Core NGO program offering |
| Environment | Restoration Site | Physical locations where work happens |
| Production/Staging/Dev | Moorea/Bora Bora/Tahiti | Real Coral Gardeners restoration sites |
| Status | Fulfillment Status | Adoption program operations tracking |
| Ready/In Progress/Blocked | Fulfilled/Pending/On Hold | Fulfillment workflow states |
| Version | Certificate ID | Adoption certificate tracking |

## Technical Approach

### next-intl i18n System
All changes made through existing next-intl message file system. No code changes required - components already use `useTranslations()` hooks that automatically pick up new strings.

**Verification Pattern:**
```typescript
// Components like dashboard/users/page.tsx use:
const t = useTranslations('dashboard/users');
// Now automatically renders "Donors" instead of "Users"
```

### JSON Structure Preservation
- All JSON keys preserved exactly (e.g., `"title": "Donors"` kept key `title`)
- Maintained nested structure (tabs, stats, table, form, actions, view, etc.)
- Only string VALUES changed, never KEYS
- Ensures no breaking changes to consuming components

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 91f0435 | Rebrand users i18n to donor terminology (29 references) |
| 2 | f8c0ab9 | Rebrand projects/overview/ai-assistant i18n to NGO context (22 adoption refs) |

## Testing & Verification

### JSON Validation
```bash
# All files validated as syntactically correct JSON
✓ front-end/messages/dashboard/users/en.json
✓ front-end/messages/dashboard/projects/en.json
✓ front-end/messages/dashboard/overview/en.json
✓ front-end/messages/ai-assistant/en.json
```

### Terminology Coverage
- Donor: 31 total occurrences (29 users + 2 overview)
- Adoption: 22 occurrences in projects file
- Restoration: 3 occurrences in overview
- No standalone "Users" string found
- No standalone "Projects" string found

### Key Checks Passed
- ✓ JSON syntax valid
- ✓ All keys preserved (no structural changes)
- ✓ Generic terms eliminated
- ✓ NGO terminology comprehensive
- ✓ French Polynesian site names applied

## User-Facing Impact

### Before
- Users page: "All Users", "Create User", "Verified Users"
- Projects page: "All Projects", "Environment: Production", "Status: Ready"
- Overview: "Dashboard Overview", "Recent Projects", "Performance analytics"

### After
- Donors page: "All Donors", "Add Donor", "Active Donors"
- Adoptions page: "All Adoptions", "Restoration Site: Moorea", "Fulfillment Status: Fulfilled"
- Overview: "Operations Overview", "Recent Adoptions", "Donor & adoption analytics"

## Deviations from Plan

None - plan executed exactly as written. All terminology changes applied as specified, all JSON keys preserved, no syntax errors.

## Decisions Made

### 1. Donor Terminology Comprehensive
**Decision:** Rebranded all user-related text to donor context (not just "Users" → "Donors" but entire user lifecycle language)

**Why:** NGO operations center on donor engagement, not generic user account management. Terms like "First Donation" (vs "Joined Date") and "Engagement Status" (vs "Account Status") better reflect the donor relationship.

**Impact:**
- More contextually appropriate for NGO staff
- Sets foundation for future donor-focused features
- Aligns UI language with organizational mission

### 2. Adoption Fulfillment Workflow
**Decision:** Projects rebranded as "Coral Adoptions" with fulfillment-centric status tracking (Fulfilled, Pending, On Hold)

**Why:** Projects were generic development projects. Coral adoptions are the core NGO program - donors adopt corals, staff fulfill adoptions by planting and providing certificates.

**Impact:**
- Status changes from dev workflow (Ready, In Progress, Blocked) to operations fulfillment tracking
- "Version" → "Certificate ID" ties to physical adoption certificates
- Prepares for adoption program features (certificates, photos, updates)

### 3. Restoration Site Naming
**Decision:** Environments renamed to restoration sites with real French Polynesian location names (Moorea, Bora Bora, Tahiti) instead of dev environments (Production, Staging, Development)

**Why:** Coral Gardeners operates physical restoration sites in French Polynesia. Staff need to track which site an adoption is fulfilled at. Generic dev environment names don't reflect operational reality.

**Impact:**
- More meaningful to NGO staff operating across multiple sites
- Future-proofs for multi-site operations reporting
- Maintains environment KEY names (production, staging, development) for code, just changes display VALUES

## Next Phase Readiness

### Ready for Phase 2, Plan 3 (Backend Data Model Adaptation)
Backend can now adapt database schema and API responses to match frontend terminology. Current state:

**Frontend Expectations (from i18n):**
- `/api/users` endpoint should support donor-centric queries
- `/api/projects` endpoint should return adoption fulfillment data
- Need site/location data for restoration sites

**Backend Current State (from 02-RESEARCH.md):**
- Database uses generic `users` and `projects` tables
- Environment field stores 'production', 'staging', 'development'
- No fulfillment tracking fields

**Next Plan Should:**
1. Add `first_donation_date` field to users table
2. Add `fulfillment_status` and `certificate_id` to projects
3. Consider `restoration_site` reference data
4. Update API serializers to provide donor/adoption context

### No Blockers
All i18n files ready. Frontend will render new terminology immediately. Backend adaptation can proceed independently.

## Files Changed

```
front-end/messages/dashboard/users/en.json
front-end/messages/dashboard/projects/en.json
front-end/messages/dashboard/overview/en.json
front-end/messages/ai-assistant/en.json
```

## Statistics

- **Execution time:** 2m 4s
- **Tasks completed:** 2/2
- **Files modified:** 4
- **Terminology changes:** 56+
- **Donor references:** 31
- **Adoption references:** 22
- **Restoration references:** 3
- **Commits:** 2
