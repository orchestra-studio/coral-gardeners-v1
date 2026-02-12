# Requirements: Coral Gardeners Operations Dashboard

**Defined:** 2026-02-12
**Core Value:** Team members can instantly access, analyze, and act on donor and operations data through unified dashboard with AI insights

## v1 Requirements

### Branding & Identity
- [ ] **BRAND-01**: Replace logo with Coral Gardeners white logo (CG_White_Logo_2.avif)
- [ ] **BRAND-02**: Update color scheme to align with CG brand (ocean blues, corals)
- [ ] **BRAND-03**: Adapt copy/language for NGO context (donors, adoptions, restoration vs generic business terms)
- [ ] **BRAND-04**: Update dashboard name/titles to "Coral Gardeners Operations Hub"

### Authentication & Access (Existing - Test & Verify)
- [ ] **AUTH-01**: User can log in with email/password (JWT-based)
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: User can reset password via email link

### Data Management (Adapt Existing)
- [ ] **DATA-01**: Admin can manage donor records (adapt existing user/admin management)
- [ ] **DATA-02**: Admin can search and filter donors by name, date, amount, engagement
- [ ] **DATA-03**: Admin can import donor data from CSV
- [ ] **DATA-04**: System displays donor activity timeline
- [ ] **DATA-05**: Admin can manage coral adoption records (adapt existing project management)
- [ ] **DATA-06**: Admin can track adoption fulfillment status (naming, certificate, site assignment)

### Dashboard & Analytics (Adapt Existing)
- [ ] **DASH-01**: Dashboard displays key NGO metrics (total donors, active adoptions, revenue, restoration sites)
- [ ] **DASH-02**: Admin can view donor giving history and trends
- [ ] **DASH-03**: Admin can view adoption sales and fulfillment metrics
- [ ] **DASH-04**: System displays activity log for audit trail
- [ ] **DASH-05**: Admin can export reports to CSV/PDF format

### AI Agent (Existing - Adapt Prompts)
- [ ] **AI-01**: User can chat with AI agent for data queries (e.g., "Show top donors this month")
- [ ] **AI-02**: AI agent can generate reports on demand
- [ ] **AI-03**: AI agent can answer questions about donor engagement and trends
- [ ] **AI-04**: AI agent can create notifications/tasks for team members

### Data Visualization (New)
- [ ] **VIZ-01**: Dashboard displays interactive map of coral restoration sites
- [ ] **VIZ-02**: Map shows real Coral Gardeners site locations (from website data)
- [ ] **VIZ-03**: Dashboard displays charts for donor trends, adoption rates, revenue over time
- [ ] **VIZ-04**: Charts use Recharts library with responsive design

### Seed Data (New)
- [ ] **SEED-01**: Database seeded with real CG restoration site locations (from coralgardeners.org)
- [ ] **SEED-02**: Database seeded with realistic mock donor data (privacy-safe)
- [ ] **SEED-03**: Database seeded with realistic coral adoption records
- [ ] **SEED-04**: Database seeded with CG organization info (mission, team, impact numbers)

### Deployment (New)
- [ ] **DEPLOY-01**: Backend deployed to Render with PostgreSQL database
- [ ] **DEPLOY-02**: Frontend deployed to Vercel with environment variables configured
- [ ] **DEPLOY-03**: CORS configured correctly for Render backend + Vercel frontend
- [ ] **DEPLOY-04**: Database connection pooling configured (PgBouncer for Render PostgreSQL)
- [ ] **DEPLOY-05**: Environment variables properly separated (NEXT_PUBLIC_ prefix for frontend)

### Mobile & Responsive (Existing - Test & Verify)
- [ ] **MOBILE-01**: Dashboard is fully responsive on tablet and mobile devices
- [ ] **MOBILE-02**: All forms and data tables work on mobile browsers

## v2 Requirements (Post-MVP)

### CRM Integrations
- **CRM-01**: Connect to Shopify API for real coral adoption/product data
- **CRM-02**: Connect to HubSpot API for real donor CRM data
- **CRM-03**: Implement webhook listeners for real-time CRM updates
- **CRM-04**: Set up OAuth token refresh for HubSpot (6-month expiration)
- **CRM-05**: Implement rate limiting for CRM API calls (HubSpot 190 req/10s)
- **CRM-06**: Build unified CRM view combining Shopify + HubSpot data

### Advanced AI Features
- **AI-ADV-01**: AI-powered donor engagement scoring (requires 6-12 months historical data)
- **AI-ADV-02**: Predictive giving insights (forecast donation timing/amounts)
- **AI-ADV-03**: Smart donor segmentation (AI-generated groups)
- **AI-ADV-04**: AI team assistant for automated message drafting
- **AI-ADV-05**: Semantic caching for AI queries (40-60% cost savings)
- **AI-ADV-06**: Per-request AI cost budgets and monitoring

### Advanced Analytics
- **ANALYTICS-01**: Impact visualization linking donations to reef restoration outcomes
- **ANALYTICS-02**: Multi-currency donation reporting
- **ANALYTICS-03**: Fundraising campaign performance tracking
- **ANALYTICS-04**: Geographic donor distribution analysis

### Notifications & Automation
- **NOTIF-01**: Email notifications for major gifts and milestones
- **NOTIF-02**: Slack integration for team notifications
- **NOTIF-03**: Automated task creation for adoption fulfillment workflow

### Security & Compliance
- **SEC-01**: Field-level encryption for sensitive donor data (GDPR compliance)
- **SEC-02**: Consent tracking for donor data usage
- **SEC-03**: Multi-state fundraising compliance checks
- **SEC-04**: Webhook signature verification for CRM webhooks

## Out of Scope

| Feature | Reason |
|---------|--------|
| Role-based access (multiple role types) | MVP uses single admin role; add granular roles (Manager, Staff, Field) post-launch based on team feedback |
| Real-time everything | 5-15 minute data refresh sufficient for MVP; real-time WebSocket updates for high-priority features only post-MVP |
| Built-in email marketing | Use HubSpot for email campaigns; don't duplicate their infrastructure |
| Full accounting system | Link to QuickBooks/Xero; don't build financial software |
| Social media management | Link to Buffer/Hootsuite; focus on internal operations |
| Public-facing donation pages | Use Shopify for public fundraising; dashboard is internal-only |
| Native mobile apps | Web-first with responsive design; native apps only if usage data justifies |
| Multi-language UI (French/English) | English-only MVP; add i18n post-launch if needed for French stakeholders |
| Blockchain adoption certificates | Traditional PDF certificates sufficient; avoid unnecessary crypto complexity |

## Traceability

Traceability will be populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TBD | TBD | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 0 (awaiting roadmap)
- Unmapped: 34 ⚠️

---
*Requirements defined: 2026-02-12*
*Last updated: 2026-02-12 after initial definition*
