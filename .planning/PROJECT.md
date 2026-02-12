# Coral Gardeners Operations Dashboard

## What This Is

An internal operations hub for Coral Gardeners team members to manage donor data, track coral adoptions and product sales, generate reports, and access AI-powered analytics. The dashboard provides a centralized view of CRM data (Shopify and HubSpot) with conversational AI assistance for queries, reports, and team notifications.

## Core Value

Team members can instantly access, analyze, and act on donor and operations data through a unified dashboard with AI-powered insights - eliminating manual data hunting across multiple systems.

## Requirements

### Validated

(None yet — this is a greenfield customization)

### Active

- [ ] Light rebrand with Coral Gardeners identity (logo, NGO-focused copy, maintain existing design)
- [ ] Functional authentication system for team access
- [ ] Project/donor management interface (adapting existing admin features)
- [ ] AI chat agent for conversational data queries
- [ ] AI-powered report generation (PDF/CSV exports)
- [ ] Team notification system via AI agent
- [ ] Mock seed data representing CG donor/adoption/sales scenarios
- [ ] Backend deployment to Render
- [ ] Frontend deployment to Vercel
- [ ] Architecture ready for CRM integration (Shopify, HubSpot, others)

### Out of Scope

- Real CRM API connections (Shopify, HubSpot) — MVP uses mock data, real integrations added post-launch
- Custom reef restoration metrics and dashboards — future enhancement
- Slack/external notification integrations — future enhancement
- Multi-language UI (French/English) — existing template may support this, but not a focus for MVP
- Mobile-specific optimizations — web-first approach

## Context

**Organization:** Coral Gardeners is an NGO focused on coral reef restoration. Team operates globally with leadership based in various locations (Titouan as director).

**Existing codebase:** Full-stack template with Next.js frontend (App Router, TypeScript, Tailwind, shadcn/ui) and NestJS backend (TypeScript, SQLite dev database, AI chat features already built-in). Template includes:
- Authentication (JWT-based)
- Admin/user management
- Project management interface
- AI chat with LLM integration (DeepSeek, Google, OpenAI, Anthropic)
- WebSocket support
- File upload system (Cloudflare R2)

**Design fit:** The existing template's look and feel already aligns well with Coral Gardeners' visual identity. Rebrand is primarily logo swap and copy adjustments for NGO context (vs generic business dashboard).

**AI agent capabilities:** The template already includes AI chat infrastructure. We're adapting it for CG-specific use cases: donor queries, adoption tracking, financial reports, team notifications.

**Future vision:** Post-MVP, connect dashboard to live Shopify (coral adoptions, merchandise), HubSpot (donor CRM, campaigns), and other data sources. Enable Titouan and team to manage operations remotely via AI agent (create tasks, send notifications, generate insights).

## Constraints

- **Timeline:** Rapid MVP - aim for fastest path to deployed, working dashboard
- **Tech Stack:** Must use existing Next.js + NestJS stack (already present)
- **Deployment:** Backend to Render, Frontend to Vercel (specific requirement)
- **Database:** SQLite for development, plan for PostgreSQL on Render for production
- **Data:** Mock/seed data only for MVP launch
- **AI Provider:** Template supports multiple LLMs - select one for MVP (likely DeepSeek for cost or Anthropic for quality)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use existing template as base | Template already has auth, AI chat, admin features - faster than building from scratch | — Pending |
| Mock data for MVP | Avoids CRM API complexity, allows rapid deployment and testing | — Pending |
| Light rebrand only | Design already aligns with CG aesthetic, minimizes UI work | — Pending |
| Render + Vercel deployment | User requirement for hosting platform | — Pending |

---
*Last updated: 2026-02-12 after initialization*
