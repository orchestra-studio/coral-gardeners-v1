# Roadmap: Coral Gardeners Operations Dashboard

## Overview

Transform the existing Next.js + NestJS template into a production-ready operations dashboard for Coral Gardeners. This is a template customization project, not a greenfield build. We leverage existing authentication, admin management, AI chat, and UI components, then rebrand for NGO context, add coral restoration visualization features, seed with real CG data, and deploy to Render + Vercel. The roadmap prioritizes infrastructure first, then adaptation and new features, finishing with AI tuning and verification.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Deployment Infrastructure** - Production environment with PostgreSQL and connection pooling
- [ ] **Phase 2: Branding & Data Model Adaptation** - Rebrand UI and adapt existing features for donor/adoption management
- [ ] **Phase 3: Data Visualization & Seeding** - Interactive map, charts, and real Coral Gardeners data
- [ ] **Phase 4: AI & Verification** - Adapt AI prompts for NGO queries and verify all features work

## Phase Details

### Phase 1: Foundation & Deployment Infrastructure
**Goal**: Production backend and frontend are deployed with PostgreSQL database and proper connection pooling
**Depends on**: Nothing (first phase)
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05
**Success Criteria** (what must be TRUE):
  1. Backend API is accessible at Render URL and responds to health checks
  2. Frontend loads from Vercel URL and can connect to backend API
  3. PostgreSQL database accepts connections with connection pooling enabled
  4. CORS allows Vercel frontend to communicate with Render backend
  5. Environment variables are properly separated (NEXT_PUBLIC_ prefix works for frontend)
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md -- Backend production readiness (PostgreSQL, health checks, CORS, render.yaml)
- [ ] 01-02-PLAN.md -- Deploy to Render + Vercel, configure env vars, verify connectivity

### Phase 2: Branding & Data Model Adaptation
**Goal**: Dashboard is rebranded for Coral Gardeners and existing features work for donor/adoption management
**Depends on**: Phase 1
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04, DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05
**Success Criteria** (what must be TRUE):
  1. Dashboard displays Coral Gardeners logo, brand colors, and NGO-specific terminology
  2. Admin can manage donor records using adapted user management interface
  3. Admin can search, filter, and import donor data from CSV
  4. Admin can manage coral adoption records using adapted project management interface
  5. Admin can track adoption fulfillment status and view donor activity timelines
  6. Dashboard displays NGO metrics (donors, adoptions, revenue, sites) and admin can export reports
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Data Visualization & Seeding
**Goal**: Dashboard displays interactive restoration site map with real CG locations and responsive charts
**Depends on**: Phase 2
**Requirements**: VIZ-01, VIZ-02, VIZ-03, VIZ-04, SEED-01, SEED-02, SEED-03, SEED-04
**Success Criteria** (what must be TRUE):
  1. Dashboard displays interactive map showing real Coral Gardeners restoration site locations
  2. Dashboard displays responsive charts for donor trends, adoption rates, and revenue using Recharts
  3. Database contains real CG restoration sites from coralgardeners.org
  4. Database contains realistic mock donor data, adoption records, and CG organization info
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: AI & Verification
**Goal**: AI agent answers NGO-specific queries and all features are verified working on mobile and desktop
**Depends on**: Phase 3
**Requirements**: AI-01, AI-02, AI-03, AI-04, AUTH-01, AUTH-02, AUTH-03, AUTH-04, MOBILE-01, MOBILE-02
**Success Criteria** (what must be TRUE):
  1. User can chat with AI agent for donor queries (e.g., "Show top donors this month")
  2. AI agent can generate reports, answer engagement questions, and create notifications for team
  3. User can log in, stay logged in across refresh, log out, and reset password
  4. Dashboard and all forms work responsively on tablet and mobile devices
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Deployment | 0/2 | Not started | - |
| 2. Branding & Data Adaptation | 0/2 | Not started | - |
| 3. Visualization & Seeding | 0/2 | Not started | - |
| 4. AI & Verification | 0/2 | Not started | - |
