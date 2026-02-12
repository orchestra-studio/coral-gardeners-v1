# Pitfalls Research

**Domain:** NGO Operations Dashboard with CRM Integrations (Shopify, HubSpot) + AI Report Generation
**Researched:** 2026-02-12
**Confidence:** MEDIUM (verified with multiple 2026 sources, some domain-specific patterns from community reports)

## Critical Pitfalls

### Pitfall 1: Donor Data Privacy Violations Leading to Trust Collapse

**What goes wrong:**
NGO dashboards expose Personally Identifiable Information (PII) through inadequate access controls, logging systems that capture donor details, or reports that include names/emails when only aggregate data is needed. Even a small breach can destroy donor trust permanently and violate GDPR/CCPA requirements.

**Why it happens:**
Developers treat NGO dashboards like e-commerce dashboards, focusing on features over privacy-by-design. There's pressure to show "real donors" in demos and test environments, leading to production data in development. Teams don't realize that every dashboard view, every API log, every error trace could leak donor PII.

**How to avoid:**
- **Privacy-by-design architecture**: Separate donor PII into dedicated tables with field-level encryption. Store only donor_id references in operational tables (donations, campaigns, sites).
- **Role-based data masking**: Dashboard users should see "Donor #12847" not "John Smith, john@email.com" unless explicitly authorized for donor management roles.
- **Audit logging**: Track every access to PII tables with user_id, timestamp, and reason. Retention limited to compliance requirements (typically 90 days for operational logs).
- **Mock data strategy**: Use realistic but fake donor data (generated via Faker.js) for all non-production environments. Never copy production donor data to staging/dev.
- **Consent tracking**: Store donor consent preferences (email opt-in, data sharing) in database with timestamps. Dashboard must respect these preferences for any contact or data export.

**Warning signs:**
- Dashboard API responses contain full donor names/emails when only counts/totals are needed
- Error logs show donor details in stack traces
- Demo environments use "anonymized" production data (still linkable)
- No field-level encryption for PII columns
- Developers have direct database access to production with no audit trail

**Phase to address:**
Phase 1 (Foundation) - Establish privacy architecture before any donor data touches the system. Retrofitting privacy is 10x harder than building it in from day one.

**Sources:**
- [Digital Security Best Practices for NGOs](https://ngofeed.com/blog/digital-security-best-practices-for-ngos/)
- [Donor Data Privacy Laws Nonprofits Must Follow](https://www.chawkinslaw.com/blog/data-privacy-laws-every-nonprofit-collecting-donor-information-must-follow)
- [Beyond Compliance: Prioritizing Donor Data Privacy](https://www.criadv.com/insight/beyond-compliance-prioritizing-donor-data-privacy-in-the-non-profit-sector/)

---

### Pitfall 2: CRM API Rate Limit Death Spiral

**What goes wrong:**
Dashboard triggers 429 rate limit errors from Shopify/HubSpot, which causes retry logic to hammer the API harder, which triggers more rate limits, which eventually auto-disables webhooks silently. Critical donor transactions stop syncing with zero visibility.

**Why it happens:**
Teams treat CRM APIs like internal APIs with unlimited capacity. HubSpot has aggressive 10-second burst limits (190 requests) and daily caps (650k Professional, 1M Enterprise). Shopify has similar constraints. A single dashboard page load can trigger dozens of API calls if not batched. After 5 failed webhook deliveries, CRMs silently disable webhooks with no notification.

**How to avoid:**
- **Single rate limiter**: Treat CRM APIs as one shared "token bucket" across all environments (dev, staging, prod). Use Redis-backed rate limiter (e.g., `bottleneck` npm package) in front of every CRM call.
- **Exponential backoff with jitter**: When hitting 429, honor Retry-After header and add randomized jitter (0-5s) to prevent thundering herd.
- **Webhook-first architecture**: Use webhooks for real-time updates, fall back to scheduled polling (hourly/daily) only for reconciliation. Never poll for real-time data.
- **Batch operations**: Group CRM writes into batch endpoints (HubSpot batch API supports 100 records/request). Reduces API calls 100x.
- **Circuit breaker**: After 3 consecutive 429s, pause CRM calls for 60 seconds. Prevents cascading failures.
- **Monitoring**: Alert on rate limit usage >70% of daily quota. Track webhook delivery failures with PagerDuty/similar.

**Warning signs:**
- Dashboard makes separate API calls for each donor/transaction instead of batching
- No rate limiting library in backend code
- Webhook failures show up in CRM admin panel but not in application monitoring
- Retry logic uses fixed intervals (e.g., "retry every 30s") instead of exponential backoff
- Development and production share same CRM API credentials (dev traffic counts against prod quota)

**Phase to address:**
Phase 1 (Foundation) - Rate limiting must be in core API client before first CRM integration. Phase 2 (CRM Integration) - Add circuit breaker, webhook reliability, monitoring.

**Sources:**
- [HubSpot API usage guidelines and limits](https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines)
- [Why Most HubSpot Integrations Won't Scale into 2026](https://commercepro.co/blog/hidden-cost-of-good-enough-hubspot-integrations?hs_amp=true)
- [How to Get Around HubSpot's API Limits in 2026](https://coefficient.io/hubspot-data-management/overcome-hubspot-api-limits)
- [Build Reliable Webhooks Pattern](https://www.inngest.com/patterns/build-reliable-webhooks)

---

### Pitfall 3: AI Report Generation Cost Explosion

**What goes wrong:**
AI agent generating donor reports on-demand burns through $500-$2000/month in LLM API costs within first week of production. Each report triggers 5-10x more LLM calls than expected due to tool selection, verification, and retry loops. Budget explodes, forcing emergency cost controls or feature removal.

**Why it happens:**
AI agents make 3-10x more LLM calls than simple chatbots. A "simple" report generation request triggers: (1) planning phase, (2) data retrieval tool selection, (3) query execution and verification, (4) report formatting, (5) quality check. Each phase calls the LLM. Streaming responses, retries on tool failures, and lack of caching compound the problem. Teams budget for "1 LLM call per report" when reality is "8-12 calls per report."

**How to avoid:**
- **Semantic caching**: Cache LLM responses for identical/similar prompts (saves 40-60% of costs). Use Langfuse or custom Redis cache with embedding-based similarity matching.
- **Model routing**: Use cheap models (DeepSeek R1, GPT-4o-mini) for simple tasks (data formatting, validation), reserve expensive models (Claude Opus, o1-pro) for complex reasoning only.
- **Batch API for reports**: Use OpenAI Batch API (50% discount) for non-urgent reports. Combined with prompt caching = 95% cost reduction for scheduled daily/weekly reports.
- **Budget per-request limits**: Set max token budget per report (e.g., 50k tokens = $1.50 on GPT-4o). Reject requests exceeding budget instead of letting them run.
- **Prompt optimization**: Minimize system prompt size (cut 1000 tokens = 40% cost reduction on multi-turn conversations due to context repetition).
- **Cost monitoring from day one**: Track cost-per-request in Datadog/Langfuse. Alert when daily spend >$50. Teams that defer cost tracking until production face 5-10x budget overruns.

**Warning signs:**
- No cost tracking in development phase ("we'll add monitoring later")
- Report generation uses streaming responses for everything (prevents prompt caching)
- System prompts >2000 tokens (sent on every LLM call)
- No model routing (using most expensive model for all tasks)
- Reports generated synchronously on user request (users wait 30s for report)
- No caching layer (same report generated 50x/day)

**Phase to address:**
Phase 1 (Foundation) - Establish cost monitoring, caching infrastructure. Phase 4 (AI Integration) - Implement model routing, batch processing, budget limits.

**Sources:**
- [AI Agent Production Costs 2026: Real Data](https://www.agentframeworkhub.com/blog/ai-agent-production-costs-2026)
- [10 AI Cost Optimization Strategies for 2026](https://www.aipricingmaster.com/blog/10-AI-Cost-Optimization-Strategies-for-2026)
- [How to get AI agent budgets right in 2026](https://www.cio.com/article/4099548/how-to-get-ai-agent-budgets-right-in-2026.html)
- [5 best tools for monitoring LLM applications in 2026](https://www.braintrust.dev/articles/best-llm-monitoring-tools-2026)

---

### Pitfall 4: OAuth Token Expiration Causing Silent Data Loss

**What goes wrong:**
HubSpot/Shopify OAuth tokens expire (every 6 months for HubSpot), refresh logic fails, and CRM sync stops completely with no alerts. Dashboard shows stale data for weeks before anyone notices. Donor transactions are lost permanently because webhooks failed during the outage window.

**Why it happens:**
OAuth refresh tokens must be proactively refreshed before expiration. HubSpot revokes the previous access token immediately upon refresh. If refresh fails (network error, CRM API down, bad error handling), the integration is dead until manual re-authentication. Teams build "happy path" OAuth flows but forget error handling, monitoring, and proactive refresh (refresh at 80% of token lifetime, not on first 401 error).

**How to avoid:**
- **Proactive token refresh**: Refresh OAuth tokens at 80% of lifetime (e.g., refresh HubSpot tokens every 4.8 months, not at 6-month expiration). Run as scheduled job (daily check).
- **Graceful degradation**: When token refresh fails, trigger PagerDuty alert immediately. Display "CRM sync paused - admin action required" banner in dashboard. Don't silently fail.
- **Token storage security**: Store refresh tokens in environment variables (Render/Vercel), never in code. Use encryption at rest (AWS Secrets Manager, HashiCorp Vault for production).
- **Multi-CRM isolation**: Use separate OAuth apps per CRM. If HubSpot auth breaks, Shopify continues working.
- **Auth health checks**: Dashboard should show "CRM connection status" with last successful sync timestamp. Alert if >2 hours stale.

**Warning signs:**
- OAuth refresh logic only runs on 401 errors (reactive, not proactive)
- No monitoring of token expiration dates
- Refresh token failures logged but not alerted
- CRM sync status not visible in admin dashboard
- All CRMs share same auth infrastructure (single point of failure)

**Phase to address:**
Phase 2 (CRM Integration) - Build robust OAuth flow with proactive refresh and monitoring.

**Sources:**
- [Why Most HubSpot Integrations Won't Scale into 2026](https://commercepro.co/blog/hidden-cost-of-good-enough-hubspot-integrations?hs_amp=true)
- [Working within the HubSpot API rate limits](https://legacydocs.hubspot.com/docs/faq/working-within-the-hubspot-api-rate-limits)

---

### Pitfall 5: Database Connection Pool Exhaustion on Render

**What goes wrong:**
Production backend on Render hits "FATAL: sorry, too many clients already" PostgreSQL errors during traffic spikes. Dashboard becomes unresponsive. Connection pool exhausts because Next.js API routes create new connections on every request instead of reusing a pool.

**Why it happens:**
Render's PostgreSQL has connection limits (typically 97 connections for base plans). Each Next.js/NestJS instance creates a connection pool (default 10 connections). With 3 backend instances, that's 30 connections baseline. Dashboard API routes, background jobs, and webhook handlers can spike to 50+ concurrent connections during traffic bursts. Without PgBouncer, connections leak and never close properly. Transaction pooling mode in PgBouncer can break prepared statements, causing runtime errors.

**How to avoid:**
- **PgBouncer transaction pooling**: Deploy PgBouncer instance on Render (free tier available). Configure `pool_mode = transaction` for most apps. Dramatically reduces connection count (100+ app connections share 20 database connections).
- **Disable prepared statements**: If using transaction pooling, disable prepared statements in app ORM (e.g., Prisma: `relationMode = "prisma"`, TypeORM: `extra: { prepareStatements: false }`). Prevents "prepared statement does not exist" errors.
- **Connection pool sizing**: Set app pool size = `(max_connections - 10) / (number_of_app_instances)`. Leave 10 connections for admin/monitoring.
- **Connection timeout**: Set `connectionTimeoutMillis: 5000` in pool config. Fail fast instead of queueing requests indefinitely.
- **Monitoring**: Alert on pool exhaustion errors. Track connection count with `pg_stat_activity` query in monitoring dashboard.

**Warning signs:**
- No PgBouncer between app and database
- Connection pool size = default (10) unchanged
- Intermittent "sorry, too many clients" errors during traffic spikes
- Background jobs and API routes share same database connection pool
- No connection pool metrics in monitoring

**Phase to address:**
Phase 1 (Foundation) - Configure PgBouncer and connection pooling during initial deployment setup. Much harder to retrofit after launch.

**Sources:**
- [Render Postgres Connection Pooling Documentation](https://render.com/docs/postgresql-connection-pooling)
- [How to Handle 10K Connections with PgBouncer](https://oneuptime.com/blog/post/2026-01-26-pgbouncer-connection-pooling/view)
- [How to Handle Too Many Connections in PostgreSQL](https://oneuptime.com/blog/post/2026-02-02-postgresql-too-many-connections/view)

---

### Pitfall 6: Environment Variable Leakage Between Render + Vercel

**What goes wrong:**
Production JWT secrets, CRM API keys, or database credentials accidentally exposed in client-side JavaScript bundle because they're set in Vercel environment without `NEXT_PUBLIC_` prefix awareness. Or backend API calls fail in production because frontend hardcodes `localhost:3000` API URL instead of reading `NEXT_PUBLIC_API_URL`.

**Why it happens:**
Next.js requires `NEXT_PUBLIC_` prefix for client-accessible variables, but developers forget and use `VITE_` patterns from other frameworks. Vercel bundles all environment variables into builds, potentially exposing secrets. Render and Vercel environment configs are separate, leading to "works on my machine" issues. CORS errors happen because frontend uses wrong backend URL (localhost in dev, but needs Render URL in production).

**How to avoid:**
- **Environment variable naming convention**:
  - Client-side (frontend): `NEXT_PUBLIC_*` prefix for Vercel (e.g., `NEXT_PUBLIC_API_URL`)
  - Server-side (backend): No prefix, set in Render (e.g., `DATABASE_URL`, `JWT_SECRET`, `HUBSPOT_API_KEY`)
- **Never expose secrets client-side**: Database URLs, API keys, JWT signing secrets must only be in Render environment, never in Vercel.
- **Separate .env files**:
  - `.env.local` (dev) - Git ignored
  - `.env.production` (prod values) - Git ignored, only in Vercel/Render dashboards
- **CORS configuration**: Backend must whitelist Vercel frontend domain in CORS origin. Store frontend URL in Render env var `FRONTEND_URL` for dynamic CORS config.
- **Deployment checklist**:
  1. Deploy backend to Render first (get API URL)
  2. Set `NEXT_PUBLIC_API_URL` in Vercel to Render backend URL
  3. Set `FRONTEND_URL` in Render to Vercel domain
  4. Redeploy frontend after backend URL is available

**Warning signs:**
- Frontend makes API calls to `http://localhost:3001` in production
- JWT_SECRET visible in browser DevTools Network tab
- CORS errors only in production, not in dev
- No separation between client/server environment variable lists
- Secrets committed to Git in `.env.production` file

**Phase to address:**
Phase 1 (Foundation) - Establish environment variable strategy before first deployment. Phase 5 (Deployment) - Validate no secret leakage via security audit.

**Sources:**
- [Advanced Troubleshooting Guide for Vercel](https://www.mindfulchase.com/explore/troubleshooting-tips/cloud-platforms-and-services/advanced-troubleshooting-guide-for-vercel.html)
- [How can I enable CORS on Vercel?](https://vercel.com/kb/guide/how-to-enable-cors)
- [CORS Error Solved — Deploy a Proxy on Vercel](https://medium.com/@robertreinhart24/cors-error-solved-a5501b85262)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using production donor data in staging | Fast, realistic testing | GDPR violation, donor trust collapse, potential fines | **Never acceptable** |
| Skipping PgBouncer, using direct DB connections | Faster initial setup (no extra service) | Connection exhaustion crashes in production | Only for <50 concurrent users AND <5 background jobs |
| Polling CRM APIs instead of webhooks | Simpler to implement (no webhook server needed) | 10-100x more API calls, hits rate limits, increases costs | Only for MVP if webhook setup blocked (then refactor immediately) |
| Hardcoding CRM credentials in .env files | Quick setup, no secrets manager needed | Credentials in Git history forever, security audit failure | Only for local dev (never staging/prod) |
| Storing donor PII unencrypted | No performance overhead | GDPR non-compliance, breach disclosure requirements | **Never acceptable** |
| Using generic AI models for all report tasks | Single model = simpler code | 3-5x higher AI costs | Only for MVP with <100 reports/month (then optimize) |
| Synchronous report generation (user waits) | No job queue infrastructure needed | Poor UX (30s wait), blocks web workers, times out on slow reports | Only for MVP with <50 users (then add async processing) |
| Sharing rate limiter across all CRMs | Single bottleneck = simpler logic | One CRM's rate limit pauses all CRMs | Acceptable if CRM usage <30% of rate limit |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **HubSpot API** | Using deprecated API keys (removed 2022) | Use OAuth or Private App Access Tokens only |
| **HubSpot API** | Not handling 10-second burst limits (190 req) | Implement token bucket rate limiter with 10s window tracking |
| **HubSpot Webhooks** | Assuming webhooks retry indefinitely | After 5 failures, HubSpot silently disables webhooks - add monitoring |
| **Shopify API** | Using pre-April 2025 field mappings | Shopify removed fields in April 2025, verify current API schema |
| **Shopify + HubSpot** | Syncing every field change immediately | Batch updates every 5-15 minutes to reduce API calls 90% |
| **PostgreSQL on Render** | Direct connections without pooler | Use PgBouncer transaction pooling to support 100+ app connections |
| **Vercel + Render** | Frontend hardcodes backend URL | Use `NEXT_PUBLIC_API_URL` environment variable with per-env values |
| **OpenAI/Anthropic** | No prompt caching for repeated content | Enable prompt caching for system prompts (40-60% cost savings) |
| **DeepSeek API** | Treating like OpenAI API (exact compatibility) | DeepSeek has different rate limits and streaming behavior, test thoroughly |
| **Web scraping (Coral Gardeners site)** | Aggressive scraping (1 req/second) | Respect robots.txt, use 3-5 second delays, ethical scraping only |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **N+1 queries for dashboard metrics** | Dashboard load >5s, database CPU spikes | Use Prisma `include` with eager loading, or raw SQL with joins | >500 donors or >50 sites |
| **Real-time polling for chart updates** | High bandwidth usage, unnecessary API calls | Use WebSockets or Server-Sent Events for real-time updates | >20 concurrent dashboard users |
| **Loading all donor history on dashboard load** | Initial page load >10s | Paginate donor list (50/page), lazy load transaction history | >2000 donors |
| **Generating reports synchronously on request** | User waits 30-60s, request timeouts | Use job queue (BullMQ), return report via email or notification | Reports with >1000 records |
| **No caching for CRM data** | Every dashboard load hits CRM API, rate limits hit quickly | Cache CRM data in Redis (TTL 5-15min), refresh async | >100 dashboard views/hour |
| **Dashboard queries span full DB history** | Query time increases linearly with data size | Add date range filters (default last 90 days), archive old data | >100k donation records |
| **Unoptimized data viz rendering** | Charts take 5-10s to render, browser hangs | Use virtualization for large datasets, limit chart to 1000 points | >5000 data points per chart |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Logging donor PII in error traces** | GDPR violation, data breach disclosure | Sanitize logs - replace PII with `[REDACTED]`, log donor_id only |
| **JWT secrets <32 characters or weak** | Token forgery, account takeover | Generate 256-bit random string, store in secrets manager, rotate every 90 days |
| **CRM API keys in frontend code** | Full CRM access exposed to public | Only expose API keys server-side, use backend proxy for CRM calls |
| **No field-level encryption for donor PII** | Database dump = full donor data exposed | Encrypt email, phone, address fields with AES-256-GCM, keys in secrets manager |
| **Webhooks with no signature verification** | Attackers can forge CRM webhook payloads | Verify HMAC signature on all webhook requests (HubSpot/Shopify provide signatures) |
| **API endpoints with no rate limiting** | DDoS attacks, credential stuffing | Use express-rate-limit (100 req/15min per IP for login, 1000 req/15min for API) |
| **Donor data in client-side state (Redux)** | PII leaks via browser extensions, XSS | Store only donor_id in client state, fetch PII on-demand server-side |
| **No RBAC for dashboard views** | All users see all donor data | Implement role-based access: `VIEWER` (aggregate only), `ADMIN` (full PII access) |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Showing raw donor emails in public dashboards** | Privacy violation, donors lose trust | Show "Donor #12847" or first name only, email only in authorized admin views |
| **Real-time report generation (user waits 60s)** | User abandons, thinks app is broken | Generate async, show "Report will be ready in 2 min, we'll email you" |
| **No feedback during CRM sync** | Users think dashboard is broken when data stale | Show "Last synced 5 min ago" badge, refresh icon with loading state |
| **Aggregate metrics without drill-down** | Users can't investigate anomalies (e.g., spike in donations) | Make charts clickable to show underlying records |
| **Technical error messages to end users** | "Database connection failed" confuses non-technical NGO staff | Show "Dashboard temporarily unavailable, we're fixing it" |
| **No data freshness indicators** | Users don't know if data is live or 2 days old | Add "Updated 3 hours ago" timestamp to all metrics |
| **Requiring login to view public restoration sites** | Donors can't see impact of their donations | Public page for site data (location, coral count), private dashboard for donor info |
| **Mobile-unfriendly dashboard** | NGO staff in field can't access dashboard | Design mobile-first, key metrics on single screen (no horizontal scroll) |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **CRM Integration:** Works in dev with test credentials, but production OAuth flow untested with real NGO accounts (fails on first donor sync)
- [ ] **Donor Privacy:** Dashboard shows fake data in demo, but no encryption/masking implemented (breaks on first real donor)
- [ ] **AI Reports:** Report generates successfully, but no cost tracking or budget limits (burns $1000 first week)
- [ ] **Webhooks:** CRM webhooks deliver to local ngrok tunnel in dev, but production webhook endpoint returns 500 (sync breaks silently)
- [ ] **Error Handling:** Happy path works, but no retry logic for transient failures (CRM API 502 = permanent data loss)
- [ ] **Deployment:** App runs on localhost, but environment variables not configured in Render/Vercel (production deploy fails immediately)
- [ ] **Database Migrations:** Schema changes work on dev SQLite, but no migration strategy for production PostgreSQL (data loss on deploy)
- [ ] **Rate Limiting:** No rate limiting in dev (unlimited requests), production hits CRM API limits in 2 hours (integration disabled)
- [ ] **Monitoring:** No error tracking (Sentry), no uptime monitoring (UptimeRobot), no cost alerts (runs blind until $500 bill arrives)
- [ ] **Data Freshness:** Dashboard shows cached data from yesterday, but users think it's real-time (makes bad decisions on stale data)

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Donor PII leaked in logs** | HIGH - Legal, PR crisis | (1) Notify affected donors within 72h (GDPR), (2) Purge logs immediately, (3) Conduct security audit, (4) File breach report with authorities if >500 affected |
| **CRM OAuth tokens expired** | MEDIUM - Manual re-auth, data gap | (1) Re-authenticate via OAuth flow in admin panel, (2) Backfill missed data via CRM API batch queries, (3) Add proactive token refresh |
| **AI costs explode (>$1000/week)** | MEDIUM - Budget adjustment | (1) Disable on-demand reports immediately, (2) Add semantic caching layer, (3) Switch to batch API for bulk reports, (4) Set per-request token limits |
| **Database connection pool exhausted** | LOW - Config change | (1) Deploy PgBouncer in transaction mode, (2) Reduce app connection pool size, (3) Add connection monitoring |
| **Webhook deliveries failed (data loss)** | MEDIUM - Manual reconciliation | (1) Query CRM API for missed records (compare last_updated timestamps), (2) Backfill missing donations, (3) Add webhook monitoring with PagerDuty |
| **Rate limits hit (integration disabled)** | MEDIUM - Wait + implement rate limiter | (1) Wait for rate limit reset (24h for daily limits), (2) Implement token bucket rate limiter, (3) Add monitoring for 70% usage threshold |
| **CORS errors in production** | LOW - Config change | (1) Add Vercel domain to Render backend CORS allowlist, (2) Verify environment variable `FRONTEND_URL` set correctly, (3) Redeploy backend |
| **Next.js + NestJS state management chaos** | HIGH - Architectural refactor | (1) Separate backend business logic (NestJS) from frontend rendering (Next.js), (2) Use OpenAPI spec to define API contract, (3) Refactor shared types into @repo/types package |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| **Donor data privacy violations** | Phase 1 (Foundation) | Run security audit with privacy scan, verify field-level encryption enabled |
| **CRM API rate limit death spiral** | Phase 2 (CRM Integration) | Load test with 500 req/min, verify rate limiter prevents 429 errors |
| **AI report generation cost explosion** | Phase 4 (AI Integration) | Generate 100 test reports, verify per-report cost <$0.50 |
| **OAuth token expiration** | Phase 2 (CRM Integration) | Set token expiry to 1 day in test, verify proactive refresh works |
| **Database connection pool exhaustion** | Phase 1 (Foundation) | Simulate 50 concurrent requests, verify no connection errors |
| **Environment variable leakage** | Phase 5 (Deployment) | Inspect production JS bundle, verify no secrets present |
| **Webhook delivery failures** | Phase 2 (CRM Integration) | Kill backend for 30s during webhook test, verify retry + recovery |
| **Next.js + NestJS separation of concerns** | Phase 1 (Foundation) | Code review: verify no business logic in Next.js API routes |
| **Real-time dashboard performance** | Phase 3 (Dashboard/UI) | Load dashboard with 5000 donors, verify render <3s |
| **Web scraping rate limits (Coral Gardeners site)** | Phase 6 (Real Data Integration) | Verify 5-second delay between requests, robots.txt compliance |

---

## Domain-Specific Warnings for Coral Gardeners NGO Dashboard

### 1. Fundraising Compliance (Multi-State Registration)

**Issue:** NGOs must register in every US state where they solicit donations. Dashboard must track donor location and ensure compliance.

**Prevention:** Store donor state/country in database. Generate quarterly compliance report showing donation count + amount per state. Flag states approaching registration threshold ($25k-$50k varies by state).

**Phase:** Phase 2 (CRM Integration) - Build donor location tracking + compliance reporting.

### 2. Donor Consent for AI-Generated Reports

**Issue:** Using donor data (even aggregated) in AI-generated reports may require explicit consent under GDPR Article 22 (automated decision-making).

**Prevention:** Add consent checkbox during donation flow: "Allow us to include your donation in AI-generated impact reports (your name will not be published)". Store consent flag per donor. Only include consented donors in AI report data queries.

**Phase:** Phase 1 (Foundation) - Add consent tracking to donor schema. Phase 4 (AI Integration) - Filter report data by consent flag.

### 3. Real Coral Gardeners Data vs Mock Donors

**Issue:** Using real restoration site data (public) mixed with fake donor data (testing) creates confusion and potential misinformation if dashboard is accidentally exposed.

**Prevention:** Clearly label dashboard environments: "TEST DATA - NOT PRODUCTION" banner on staging. Never show staging dashboard in public demos. Use separate databases for staging/prod.

**Phase:** Phase 5 (Deployment) - Add environment labeling to UI. Phase 6 (Real Data) - Final cutover from mock to real donors.

### 4. Multi-Currency Donations (Coral Gardeners is International)

**Issue:** Donors from Australia, EU, US use different currencies. Dashboard must aggregate donations in base currency (USD) without losing original currency for refunds/receipts.

**Prevention:** Store donations in original currency + USD equivalent + exchange rate + conversion timestamp. Use real-time forex API (e.g., exchangerate-api.com) for conversions. Recalculate historical totals when viewing past date ranges.

**Phase:** Phase 2 (CRM Integration) - Add multi-currency support to donation model.

---

*Pitfalls research for: Coral Gardeners NGO Operations Dashboard*
*Researched: 2026-02-12*
