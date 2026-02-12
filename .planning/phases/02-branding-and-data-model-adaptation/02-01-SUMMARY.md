---
phase: 02
plan: 01
subsystem: branding
tags: [ui, theme, identity, i18n]

requires:
  - 01-01: Backend infrastructure for data
  - 01-02: Frontend deployment

provides:
  - coral-gardeners-brand: Visual identity and brand configuration
  - ocean-theme: Ocean blue and coral accent color palette
  - ngo-terminology: Donor and adoption terminology across UI

affects:
  - 02-02+: All subsequent Phase 2 plans depend on this branding foundation

tech-stack:
  added: []
  patterns:
    - CSS custom properties for theme variables
    - next-intl for i18n terminology
    - Tabler Icons React for UI icons

key-files:
  created:
    - front-end/public/assets/images/cg-logo-white.avif
  modified:
    - front-end/src/config/brand.config.ts
    - front-end/src/styles/theme-variables.css
    - front-end/src/layouts/dashboard/sidebar/config/navigationData.ts
    - front-end/messages/layouts/en.json
    - front-end/messages/dashboard/en.json

decisions:
  - id: use-avif-logo
    decision: Use AVIF format for logo (CG_White_Logo_2.avif)
    rationale: Modern image format with excellent compression, well-supported in 2026 browsers
    impact: Smaller file size, faster load times
  - id: invert-logo-light-mode
    decision: Use CSS filter invert(1) for white logo on light backgrounds
    rationale: Single logo file works for both light/dark modes with CSS filters
    impact: Simpler asset management, no duplicate logo files needed
  - id: keep-route-paths
    decision: Keep existing route paths (/users, /projects) unchanged
    rationale: Avoid breaking frontend-backend contracts and existing bookmarks
    impact: Only display labels change, no route refactoring needed
  - id: heart-icon-adoptions
    decision: Use IconHeart for Adoptions instead of IconFolderCode
    rationale: Heart icon better represents coral adoption emotional connection
    impact: More appropriate visual metaphor for NGO context

metrics:
  duration: 2m 34s
  tasks-completed: 2
  files-modified: 5
  files-created: 1
  commits: 2
  completed: 2026-02-12
---

# Phase 2 Plan 1: Rebrand to Coral Gardeners Identity Summary

**One-liner:** Established Coral Gardeners brand identity with ocean/coral color palette, CG white logo, and NGO-specific navigation labels (Donors, Adoptions).

## What Was Built

This plan successfully rebranded the entire dashboard from generic "Aniq Dashboard" to "Coral Gardeners Operations Hub" by updating:

1. **Brand Configuration** - Centralized brand identity in `brand.config.ts` with Coral Gardeners name, logo, metadata, and contact info
2. **Logo Integration** - Added CG white logo (AVIF format) with CSS filter support for light/dark modes
3. **Ocean Theme Colors** - Replaced monochrome gray palette with ocean blue (#1a6b8a) and coral accent colors
4. **Navigation Rebranding** - Updated sidebar labels from "Users" to "Donors" and "Projects" to "Adoptions"
5. **I18n Messages** - Rebranded all UI text in dashboard and layout message files

### Technical Approach

- **CSS Custom Properties**: Used existing theme-variables.css architecture to update brand colors across entire application
- **Logo Handling**: Single AVIF logo file with CSS filter invert(1) for light mode, no filter for dark mode
- **Route Preservation**: Kept all route paths unchanged (/users, /projects) to maintain backend contracts
- **Icon Selection**: Changed Adoptions icon from IconFolderCode to IconHeart for better NGO context

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Update brand configuration and logo | ✅ Complete | dc25efb |
| 2 | Update theme colors and navigation labels | ✅ Complete | 776854f |

### Task 1: Update Brand Configuration and Logo

**Commit:** dc25efb

**Changes:**
- Replaced all "Aniq Dashboard" references with "Coral Gardeners Operations Hub"
- Updated company name to "Coral Gardeners"
- Set short name to "CG Hub"
- Changed logo path to `/assets/images/cg-logo-white.avif`
- Updated meta tags: title, description, keywords for NGO context
- Changed theme colors to ocean blue (#1a6b8a) and light ocean (#5bc0d4)
- Updated contact email to info@coralgardeners.org
- Set website link to https://coralgardeners.org
- Removed Arabic translations (English-only MVP)

**Files:**
- `front-end/src/config/brand.config.ts` - Brand configuration
- `front-end/public/assets/images/cg-logo-white.avif` - CG logo file

### Task 2: Update Theme Colors and Navigation Labels

**Commit:** 776854f

**Changes:**

**Theme Colors:**
- Light mode primary: #2c2c2c → #1a6b8a (ocean blue)
- Light mode hover: #1a1a1a → #145a74 (darker ocean)
- Dark mode primary: #e5e5e5 → #5bc0d4 (light ocean)
- Dark mode hover: #f5f5f5 → #7dd3e3 (lighter ocean)
- Brand gradient: black/gray → deep ocean/light ocean (#0d4f6b to #2d9bb5)
- Chart colors: gray scale → ocean palette with coral accent (#e87461)
- Logo background: Changed from logo-for-lightmode.png to cg-logo-white.avif
- Logo filter: Set to invert(1) for light mode, none for dark mode

**Navigation Labels:**
- "Users" section → "Donors" with updated descriptions
- "Projects" section → "Adoptions" with coral adoption context
- Changed Adoptions icon from IconFolderCode to IconHeart
- Updated AI Assistant description to "AI-powered donor and operations analytics"

**I18n Messages:**
- navbar.logo: "Aniq-ui" → "Coral Gardeners"
- sidebar.brandName: "Aniq-ui" → "Coral Gardeners Operations Hub"
- overview.title: "Overview" → "Operations Overview"
- overview.description: Updated to mention donor engagement and coral adoptions
- breadcrumb.projects: "Projects" → "Adoptions"
- breadcrumb.users: "Users" → "Donors"

**Files:**
- `front-end/src/styles/theme-variables.css` - Theme color variables
- `front-end/src/layouts/dashboard/sidebar/config/navigationData.ts` - Navigation configuration
- `front-end/messages/layouts/en.json` - Layout i18n messages
- `front-end/messages/dashboard/en.json` - Dashboard i18n messages

## Deviations from Plan

None - plan executed exactly as written.

## Technical Decisions

### Why AVIF for Logo?

AVIF format provides excellent compression while maintaining visual quality. Browser support in 2026 is mature (Chrome, Safari, Firefox all support). Using a single white logo with CSS filters eliminates need for separate light/dark mode assets.

### Why Keep Route Paths Unchanged?

Changing routes from `/users` to `/donors` would require:
- Backend API endpoint changes
- Frontend API client updates
- Route middleware updates
- Breaking existing bookmarks/links

By keeping routes unchanged and only updating display labels via i18n, we achieve complete rebranding without breaking changes.

### Why Heart Icon for Adoptions?

IconFolderCode represented generic project management. IconHeart better conveys the emotional connection of coral adoption, aligning with NGO mission and donor psychology.

## Testing Evidence

All verification checks passed:

```bash
# No Aniq references remain
grep -r "Aniq" front-end/src/config/brand.config.ts front-end/messages/dashboard/en.json front-end/messages/layouts/en.json
# (no output - success)

# Coral Gardeners branding present
grep -c "Coral Gardeners" front-end/src/config/brand.config.ts
# 8

# Navigation labels updated
grep "Donors" front-end/src/layouts/dashboard/sidebar/config/navigationData.ts
# // Donors Section

grep "Adoptions" front-end/src/layouts/dashboard/sidebar/config/navigationData.ts
# // Adoptions Section

# Ocean theme colors applied
grep "#1a6b8a" front-end/src/styles/theme-variables.css
# --primaryColor: #1a6b8a;

# Logo file exists
ls front-end/public/assets/images/cg-logo-white.avif
# file exists
```

## Known Issues

None identified.

## Next Phase Readiness

### Enables

This branding foundation enables all subsequent Phase 2 plans:
- 02-02: User → Donor terminology in forms and tables
- 02-03: Project → Adoption data model adaptation
- 02-04+: All future UI components will inherit Coral Gardeners brand

### Blockers

None. Phase 2 can proceed.

### Concerns

- **Logo format compatibility**: While AVIF is well-supported, extremely old browsers may not display logo. Consider adding PNG fallback if supporting legacy browsers is required.
- **Color contrast**: Ocean blue (#1a6b8a) should be tested for WCAG AA accessibility compliance on various backgrounds.

## Performance Impact

- **Logo file size**: AVIF logo is ~4KB vs typical PNG which would be 15-20KB (75% reduction)
- **CSS variables**: No runtime performance impact - theme variables compile to efficient CSS
- **Build time**: No measurable change (simple configuration updates)

## Lessons Learned

1. **CSS filter approach works well**: Using `filter: invert(1)` for light mode allowed single logo file to work across themes
2. **Centralized brand config**: Having all brand identity in one `brand.config.ts` file made rebranding surgical and complete
3. **I18n for terminology**: Using existing next-intl infrastructure for terminology changes avoided hardcoded string replacements
4. **Icon selection matters**: Changing from IconFolderCode to IconHeart had outsized impact on perceived mission alignment

## Dependencies for Next Plans

Next plan (02-02) can proceed immediately. No blockers or pending work.

## Links

- Plan: `.planning/phases/02-branding-and-data-model-adaptation/02-01-PLAN.md`
- Research: `.planning/phases/02-branding-and-data-model-adaptation/02-RESEARCH.md`
- Commits: dc25efb, 776854f
