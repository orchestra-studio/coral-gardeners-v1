# Phase 1: Foundation & Deployment Infrastructure - Research

**Researched:** 2026-02-12
**Domain:** Production deployment (Next.js 16 → Vercel, NestJS 10 → Render, PostgreSQL)
**Confidence:** HIGH

## Summary

This phase involves deploying a full-stack application with Next.js 16 frontend to Vercel and NestJS 10 backend to Render with PostgreSQL database. The project is a working template currently using SQLite locally that needs production deployment with proper database migration, CORS configuration, connection pooling, and environment variable management.

**Key architectural constraint:** The application uses Socket.IO for real-time WebSocket connections (auth gateway for permission updates). This requires special consideration: **Vercel does NOT support WebSockets**, but Render Web Services natively support WebSocket connections, making it suitable for the NestJS backend. The frontend on Vercel can connect to the backend's WebSocket server on Render without issues.

The standard approach is: Render Web Service (with PostgreSQL add-on) for NestJS backend + Vercel for Next.js frontend, with careful CORS configuration to allow cross-origin requests and WebSocket connections.

**Primary recommendation:** Deploy backend to Render Web Service with managed PostgreSQL database and PgBouncer connection pooling. Deploy frontend to Vercel. Configure explicit CORS origins (not wildcards) for production security. Use TypeORM migrations instead of synchronize:true. Implement health check endpoints for monitoring.

## Standard Stack

The established tools for this deployment scenario:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Render PostgreSQL | 16.x | Production database | Free tier available, managed service, built-in PgBouncer support |
| Render Web Service | N/A | NestJS hosting | Native WebSocket support, always-on instances, good for Socket.IO |
| Vercel | N/A | Next.js hosting | Official Next.js deployment platform, automatic optimizations |
| TypeORM | 0.3.27 | Database ORM | Already in codebase, mature PostgreSQL support |
| PgBouncer | Latest | Connection pooling | Render's recommended pooler, reduces database connection overhead |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nestjs/terminus | 10.x | Health checks | Production monitoring, load balancer health probes |
| @nestjs/config | 4.0.2 | Env var management | Already in use, validation support with Joi |
| better-sqlite3 | 12.4.1 | Dev database | Keep for local development only |
| pg | 8.x | PostgreSQL driver | TypeORM uses this under the hood |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Render PostgreSQL | Neon, Supabase | Neon has serverless pooling but Render's tight integration is simpler |
| Render Web Service | Railway, Fly.io | Similar features but Render has better free tier and documentation |
| Vercel | Netlify | Netlify works but Vercel is Next.js canonical platform with better DX |
| TypeORM migrations | Prisma | Prisma is modern but requires full migration from existing TypeORM setup |

**Installation:**
```bash
# Backend - add health checks
cd back-end
yarn add @nestjs/terminus pg

# Frontend - no new dependencies needed
# Deployment doesn't require code changes for Vercel
```

## Architecture Patterns

### Recommended Project Structure

Current structure already follows best practices:
```
back-end/
├── src/
│   ├── database/
│   │   ├── config/          # Database configuration
│   │   ├── migrations/      # TypeORM migrations (create this)
│   │   └── seeder.ts        # Database seeding
│   ├── modules/             # Feature modules
│   │   └── auth/
│   │       └── auth.gateway.ts  # Socket.IO gateway
│   └── main.ts              # CORS config location

front-end/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── hooks/
│   │   └── useWebSocket.ts  # Socket.IO client hook
│   └── providers/
│       └── WebSocketProvider.tsx
└── .env.example             # Template for NEXT_PUBLIC_ vars
```

### Pattern 1: Environment-Based Database Configuration

**What:** TypeORM configuration that switches between SQLite (dev) and PostgreSQL (production) based on environment variables.

**When to use:** When migrating from local SQLite to production PostgreSQL without changing dev workflow.

**Current implementation:**
```typescript
// Source: back-end/src/app.module.ts (existing code)
TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'mysql');

        const baseConfig = {
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV') === 'development',
            logging: false,
        };

        if (dbType === 'postgres') {
            return {
                ...baseConfig,
                type: 'postgres' as const,
                url: configService.get<string>('DATABASE_URL'),
                ssl: { rejectUnauthorized: false }, // Required for Render
                extra: {
                    max: 10, // Connection pool size (keep low with PgBouncer)
                    connectionTimeoutMillis: 3000,
                },
            };
        }

        // SQLite for development
        return {
            ...baseConfig,
            type: 'better-sqlite3' as const,
            database: './database.sqlite',
        };
    },
})
```

### Pattern 2: Production CORS Configuration

**What:** Explicit origin allowlist for CORS instead of wildcard (*).

**When to use:** Always in production for security.

**Example:**
```typescript
// Source: NestJS CORS best practices (https://felixastner.com/articles/the-ultimate-nestjs-cors-guide-fixing-5-common-production-errors)
// back-end/src/main.ts
app.enableCors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        // Add preview URLs if needed: /^https:\/\/.*\.vercel\.app$/
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization',
});
```

### Pattern 3: Socket.IO CORS for Cross-Origin WebSockets

**What:** Separate CORS configuration for Socket.IO gateways.

**When to use:** When frontend and backend are on different domains (Vercel + Render).

**Example:**
```typescript
// Source: back-end/src/modules/auth/auth.gateway.ts (existing code)
@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
    namespace: 'auth',
    transports: ['websocket', 'polling'], // Fallback to polling if WS fails
})
```

### Pattern 4: PgBouncer Connection Pooling Setup

**What:** External connection pooler to reduce PostgreSQL connection overhead.

**When to use:** Always with Render PostgreSQL in production.

**Configuration:**
```bash
# Render Dashboard Environment Variables
POOL_MODE=transaction
SERVER_RESET_QUERY=DISCARD ALL
MAX_CLIENT_CONN=500
DEFAULT_POOL_SIZE=50

# Backend uses PgBouncer URL instead of direct database URL
DATABASE_URL=postgresql://USER:PASSWORD@PGBOUNCER_HOST:PORT/DATABASE
```

**Source:** [Render PostgreSQL Connection Pooling](https://render.com/docs/postgresql-connection-pooling)

### Pattern 5: TypeORM Migrations for Production

**What:** Version-controlled schema changes instead of auto-sync.

**When to use:** Required for production (synchronize:true is unsafe with real data).

**Setup:**
```typescript
// Source: TypeORM migrations best practices (https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql)

// 1. Create DataSource for migrations (src/database/data-source.ts)
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false, // CRITICAL: Never true in production
});

// 2. Add migration scripts to package.json
{
    "scripts": {
        "migration:generate": "typeorm migration:generate -d src/database/data-source.ts",
        "migration:run": "typeorm migration:run -d src/database/data-source.ts",
        "migration:revert": "typeorm migration:revert -d src/database/data-source.ts"
    }
}
```

### Pattern 6: Health Check Endpoint

**What:** HTTP endpoint for load balancer and monitoring.

**When to use:** Required for production deployments.

**Example:**
```typescript
// Source: NestJS Terminus documentation (https://sevic.dev/notes/healthcheck-terminus-nestjs/)

// health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [HealthController],
})
export class HealthModule {}

// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }
}
```

### Pattern 7: Environment Variable Management

**What:** Proper separation of server-side and client-side environment variables.

**When to use:** Always with Next.js deployments.

**Frontend (.env.production):**
```bash
# Source: Next.js environment variables docs (https://nextjs.org/docs/pages/guides/environment-variables)

# PUBLIC vars - exposed to browser (bundled at build time)
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_WEBSOCKET_BASE_URL=https://your-backend.onrender.com

# PRIVATE vars - server-side only (NOT accessible in browser)
# (None needed for this project - backend handles all secrets)
```

**Backend (.env on Render):**
```bash
# Database
DATABASE_URL=postgresql://user:pass@pgbouncer-host:6543/db
DB_TYPE=postgres
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app

# Auth (existing secrets)
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

# Port (Render provides this automatically)
PORT=10000
```

### Anti-Patterns to Avoid

- **Using synchronize:true in production:** Data loss risk when schema changes (https://typeorm.io/docs/migrations/why/)
- **CORS origin: '*' with credentials:true:** Browsers reject this for security (https://felixastner.com/articles/the-ultimate-nestjs-cors-guide-fixing-5-common-production-errors)
- **Deploying Socket.IO backend to Vercel:** Vercel serverless functions don't support WebSockets (https://github.com/socketio/socket.io/discussions/4628)
- **Large connection pools with PgBouncer:** Over-subscription causes performance issues (https://blog.zysk.tech/a-comprehensive-guide-to-database-pooling-with-postgresql-typeorm-and-pgbouncer/)
- **Hardcoding environment-specific URLs:** Always use environment variables for URLs
- **Skipping SSL for PostgreSQL:** Render requires SSL connections ({ ssl: { rejectUnauthorized: false } })

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database health checks | Custom ping queries | @nestjs/terminus TypeOrmHealthIndicator | Handles connection errors, timeouts, proper HTTP codes |
| Connection pooling | Custom pool manager | PgBouncer on Render | Battle-tested, handles edge cases (connection leaks, timeouts) |
| Environment validation | Manual checks | @nestjs/config with Joi | Type-safe, fails fast on startup, clear error messages |
| WebSocket reconnection | Custom retry logic | Socket.IO built-in reconnection | Handles exponential backoff, connection state management |
| CORS preflight | Custom OPTIONS handler | app.enableCors() | Handles all preflight headers, methods, credentials properly |

**Key insight:** Infrastructure concerns (pooling, health checks, CORS) are solved problems. Use battle-tested libraries instead of custom implementations that miss edge cases.

## Common Pitfalls

### Pitfall 1: Vercel WebSocket Incompatibility

**What goes wrong:** Deploying Socket.IO backend to Vercel results in connection failures because serverless functions don't support persistent WebSocket connections.

**Why it happens:** Vercel's serverless architecture bills by request duration. WebSockets require long-running processes incompatible with this model.

**How to avoid:**
- Deploy backend with WebSocket requirements to Render Web Service (always-on instances)
- Only deploy frontend to Vercel
- Frontend connects to Render backend's WebSocket endpoint

**Warning signs:**
- Socket.IO client stuck in "connecting" state
- Connection immediately closes after opening
- Console errors about transport failures

**Source:** [Socket.IO Vercel Discussion](https://github.com/socketio/socket.io/discussions/4628), [Vercel WebSocket KB](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections)

### Pitfall 2: NEXT_PUBLIC_ Variables Not Updating After Deploy

**What goes wrong:** Changing NEXT_PUBLIC_ environment variables in Vercel dashboard doesn't affect the deployed app.

**Why it happens:** NEXT_PUBLIC_ variables are inlined into JavaScript bundle at **build time**, not runtime. The values are frozen when `next build` runs.

**How to avoid:**
- After changing NEXT_PUBLIC_ vars, trigger a **new deployment** (don't just update env vars)
- Use Vercel's "Redeploy" button or push a new commit
- For runtime config needs, use server-side API routes instead

**Warning signs:**
- Environment variable shows correct value in Vercel dashboard
- Application still uses old value
- No build triggered after env var change

**Source:** [Next.js Environment Variables Guide](https://nextjs.org/docs/pages/guides/environment-variables)

### Pitfall 3: CORS Wildcard with Credentials

**What goes wrong:** Setting CORS `origin: '*'` with `credentials: true` causes browsers to reject requests with cryptic CORS errors.

**Why it happens:** W3C CORS spec forbids wildcard origins when credentials (cookies, auth headers) are included for security reasons.

**How to avoid:**
- Use explicit origin array: `origin: [process.env.FRONTEND_URL]`
- For preview deployments, use regex: `/^https:\/\/.*\.vercel\.app$/`
- Never use `*` in production with credentials

**Warning signs:**
- Error: "Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'"
- Requests work without auth headers but fail when sending tokens
- Preflight (OPTIONS) succeeds but actual request fails

**Source:** [NestJS CORS Production Guide](https://felixastner.com/articles/the-ultimate-nestjs-cors-guide-fixing-5-common-production-errors)

### Pitfall 4: Database Connection Pool Exhaustion

**What goes wrong:** Application becomes unresponsive, queries timeout, database refuses connections.

**Why it happens:** TypeORM creates too many connections, PgBouncer pool fills up, no connections available for new requests.

**How to avoid:**
- Set TypeORM `extra.max` to 10 or less when using PgBouncer
- PgBouncer manages the actual pool to database (DEFAULT_POOL_SIZE=50)
- Monitor connection count in Render dashboard

**Warning signs:**
- Queries timeout after initial burst of traffic
- Error: "sorry, too many clients already"
- Render PostgreSQL dashboard shows max connections reached

**Source:** [TypeORM Connection Pooling](https://blog.zysk.tech/a-comprehensive-guide-to-database-pooling-with-postgresql-typeorm-and-pgbouncer/)

### Pitfall 5: synchronize:true Data Loss in Production

**What goes wrong:** Schema changes cause data loss, tables dropped, columns deleted without warning.

**Why it happens:** TypeORM's `synchronize: true` auto-generates DDL statements to match entities, which can drop conflicting columns/tables.

**How to avoid:**
- Set `synchronize: false` for production
- Use TypeORM migrations for schema changes
- Test migrations on staging database first
- Keep synchronize:true only for local development

**Warning signs:**
- Missing tables after deployment
- Data disappears after entity changes
- Schema conflicts in production logs

**Source:** [TypeORM Migrations vs Synchronize](https://medium.com/swlh/migrations-over-synchronize-in-typeorm-2c66bc008e74)

### Pitfall 6: Missing SSL Configuration for Render PostgreSQL

**What goes wrong:** Database connection fails with "SSL required" or certificate errors.

**Why it happens:** Render PostgreSQL requires SSL connections, but TypeORM defaults don't enable it.

**How to avoid:**
```typescript
{
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render
}
```

**Warning signs:**
- Error: "no pg_hba.conf entry for host"
- Error: "SSL connection is required"
- Local development works, production fails

**Source:** [Render PostgreSQL Connection Docs](https://render.com/docs/postgresql-creating-connecting)

### Pitfall 7: Forgotten Health Check Endpoint

**What goes wrong:** Render service shows as unhealthy, restarts frequently, or doesn't deploy successfully.

**Why it happens:** Render expects a `/health` or `/` endpoint to respond with 200 status to confirm service is running.

**How to avoid:**
- Implement health check endpoint before first deploy
- Test endpoint returns 200 status
- Configure Render's health check path in dashboard if using custom path

**Warning signs:**
- Service deploys but immediately shows "unhealthy"
- Frequent service restarts
- "Health check failed" in Render logs

**Source:** [NestJS Terminus Health Checks](https://sevic.dev/notes/healthcheck-terminus-nestjs/)

## Code Examples

Verified patterns from official sources:

### Database Configuration with PgBouncer

```typescript
// Source: Render PostgreSQL + TypeORM setup
// back-end/src/app.module.ts (modify existing code)

TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        if (configService.get('DB_TYPE') === 'postgres') {
            return {
                type: 'postgres',
                url: configService.get('DATABASE_URL'), // PgBouncer URL from Render
                ssl: isProduction ? { rejectUnauthorized: false } : false,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false, // Use migrations in production
                logging: !isProduction,
                extra: {
                    max: 10, // Keep low with PgBouncer
                    connectionTimeoutMillis: 3000,
                    idleTimeoutMillis: 30000,
                },
            };
        }

        // SQLite for local dev (keep existing logic)
        return {
            type: 'better-sqlite3',
            database: './database.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // OK for local dev
        };
    },
    inject: [ConfigService],
})
```

### Render Deployment Configuration

```yaml
# Source: Render Blueprint documentation
# render.yaml (create in project root)

services:
  # Backend Web Service
  - type: web
    name: dashboard-backend
    env: node
    region: oregon
    plan: free
    buildCommand: yarn install && yarn build
    startCommand: yarn start:prod
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_TYPE
        value: postgres
      - key: DATABASE_URL
        fromDatabase:
          name: dashboard-db
          property: connectionString
      - key: FRONTEND_URL
        value: https://your-app.vercel.app
      - key: CORS_ORIGIN
        value: https://your-app.vercel.app
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: PORT
        value: 10000

databases:
  # PostgreSQL with PgBouncer
  - name: dashboard-db
    databaseName: dashboard
    user: dashboard_user
    plan: free
    region: oregon
    pooling:
      enabled: true
      poolMode: transaction
      maxClientConn: 500
      defaultPoolSize: 50
```

### Vercel Environment Variables

```bash
# Source: Configure in Vercel Dashboard (Settings → Environment Variables)
# All environments (Production, Preview, Development)

NEXT_PUBLIC_API_BASE_URL=https://dashboard-backend.onrender.com/api
NEXT_PUBLIC_WEBSOCKET_BASE_URL=https://dashboard-backend.onrender.com

# No secrets in frontend - all API keys stay in backend
```

### Health Check Implementation

```typescript
// Source: @nestjs/terminus documentation
// back-end/src/health/health.module.ts (create new)

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [HealthController],
})
export class HealthModule {}

// back-end/src/health/health.controller.ts (create new)
import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.pingCheck('database', { timeout: 3000 }),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ]);
    }
}

// Add to app.module.ts imports
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        // ... existing imports
        HealthModule,
    ],
})
export class AppModule {}
```

### Migration Workflow

```typescript
// Source: TypeORM migrations guide
// back-end/src/database/data-source.ts (create new)

import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});

// Update package.json scripts
{
    "scripts": {
        "typeorm": "typeorm-ts-node-commonjs",
        "migration:generate": "npm run typeorm -- migration:generate -d src/database/data-source.ts",
        "migration:create": "npm run typeorm -- migration:create",
        "migration:run": "npm run typeorm -- migration:run -d src/database/data-source.ts",
        "migration:revert": "npm run typeorm -- migration:revert -d src/database/data-source.ts",
        "migration:show": "npm run typeorm -- migration:show -d src/database/data-source.ts"
    }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual CORS headers | app.enableCors() | NestJS 5+ | Cleaner code, handles preflight automatically |
| Manual connection pools | TypeORM + PgBouncer | Always | Reduces connection overhead, prevents exhaustion |
| synchronize:true | TypeORM migrations | Production only | Safe schema changes, no data loss |
| process.env directly | @nestjs/config | NestJS 7+ | Type safety, validation, better DX |
| Heroku | Render/Railway | 2023-2024 | Better free tier, easier setup |
| WebSocket custom server | Socket.IO | Always | Reconnection, fallbacks, rooms built-in |

**Deprecated/outdated:**
- **Heroku free tier:** Removed Nov 2022, use Render instead
- **TypeORM DataSource constructor in app code:** Use forRootAsync with ConfigService
- **Next.js 12 serverless config:** Next.js 13+ uses App Router, different deployment model
- **Manual CORS headers in gateway:** Use cors option in @WebSocketGateway decorator

## Open Questions

Things that couldn't be fully resolved:

1. **Preview deployment CORS for Vercel**
   - What we know: Vercel generates random URLs for preview deploys (*.vercel.app)
   - What's unclear: Best pattern for allowing preview URLs without allowing all *.vercel.app
   - Recommendation: Use regex origin validator `/^https:\/\/your-app-[a-z0-9-]+\.vercel\.app$/` or update backend env vars per preview

2. **Database migration strategy for existing data**
   - What we know: Project currently uses SQLite locally
   - What's unclear: If production database should start fresh or migrate existing data
   - Recommendation: Start fresh in production (template project), use seeder.ts for initial data

3. **PgBouncer pool mode (transaction vs session)**
   - What we know: Render recommends `transaction` mode for better efficiency
   - What's unclear: If any TypeORM features break with transaction pooling
   - Recommendation: Start with `transaction` mode, monitor for issues (prepared statements, temp tables)

4. **WebSocket scaling with multiple backend instances**
   - What we know: Render load balancer assigns WebSocket connections to random instances
   - What's unclear: If current Socket.IO implementation handles multi-instance properly
   - Recommendation: Single instance initially (free tier), add Redis adapter if scaling needed

5. **Environment variable precedence in Render**
   - What we know: render.yaml and dashboard both set env vars
   - What's unclear: Which takes precedence if both are defined
   - Recommendation: Use render.yaml for infrastructure config, dashboard for secrets

## Sources

### Primary (HIGH confidence)

- [Render PostgreSQL Connection Pooling](https://render.com/docs/postgresql-connection-pooling) - PgBouncer setup, connection strings
- [Next.js Environment Variables Official Guide](https://nextjs.org/docs/pages/guides/environment-variables) - NEXT_PUBLIC_ behavior, build-time inlining
- [Render Create and Connect PostgreSQL](https://render.com/docs/postgresql-creating-connecting) - SSL requirements, connection format
- [Render WebSockets Documentation](https://render.com/docs/websocket) - Native WebSocket support, keepalive best practices
- [NestJS Official CORS Documentation](https://docs.nestjs.com/security/cors) - Basic CORS setup
- [Socket.IO Vercel Discussion #4628](https://github.com/socketio/socket.io/discussions/4628) - Confirmed Vercel WebSocket incompatibility
- [Vercel WebSocket KB](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections) - Official statement on WebSocket support
- [TypeORM Migrations Documentation](https://typeorm.io/docs/migrations/why/) - Why migrations over synchronize

### Secondary (MEDIUM confidence)

- [Complete Guide to Deploying NestJS on Render (HackerNoon)](https://hackernoon.com/the-complete-guide-to-deploying-nestjs-application-on-render) - Build commands, deployment process
- [Ultimate NestJS CORS Guide (Felix Astner)](https://felixastner.com/articles/the-ultimate-nestjs-cors-guide-fixing-5-common-production-errors) - Common production CORS errors
- [TypeORM Migrations Explained (Petur Georgiev)](https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql) - Migration setup with NestJS
- [NestJS Environment Variables Best Practices (Medium)](https://mdjamilkashemporosh.medium.com/nestjs-environment-variables-best-practices-for-validating-and-structuring-configs-a24a8e8d93c1) - Validation with Joi
- [Database Pooling with TypeORM and PgBouncer (Zysk Tech)](https://blog.zysk.tech/a-comprehensive-guide-to-database-pooling-with-postgresql-typeorm-and-pgbouncer/) - Pool configuration recommendations
- [Health Checks with Terminus (Sevic.dev)](https://sevic.dev/notes/healthcheck-terminus-nestjs/) - Implementation examples
- [Migrations Over Synchronize (Medium)](https://medium.com/swlh/migrations-over-synchronize-in-typeorm-2c66bc008e74) - Why synchronize is dangerous
- [NestJS WebSockets Implementation (OneUpTime)](https://oneuptime.com/blog/post/2026-02-02-nestjs-websockets/view) - WebSocket gateway patterns

### Tertiary (LOW confidence - marked for validation)

- [CORS Configuration Mistakes in NestJS (MoldStud)](https://moldstud.com/articles/p-top-10-common-cors-configuration-mistakes-in-nestjs-and-how-to-avoid-them) - Common mistakes list
- [How to Deploy Realtime Apps on Vercel (Medium)](https://amananjay.medium.com/how-to-deploy-realtime-apps-on-vercel-using-polling-sse-or-websockets-3616d78d6e39) - Alternative approaches
- [Vercel Deployment Guide (BetterLink)](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-vercel-deploy-guide/) - Environment variable setup

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - Render and Vercel are canonical platforms for this stack, well-documented
- Architecture: **HIGH** - TypeORM, NestJS, Next.js patterns verified with official docs
- Pitfalls: **HIGH** - CORS, WebSocket, synchronize issues verified with multiple authoritative sources
- PgBouncer configuration: **MEDIUM** - Render docs are clear, but optimal pool sizes may need tuning

**Research date:** 2026-02-12
**Valid until:** 2026-04-12 (60 days - stable deployment patterns, but check for platform updates)

**Critical constraint discovered:** Vercel does NOT support WebSockets, but this is not a blocker because:
- Frontend on Vercel can connect to backend WebSocket on Render (cross-origin WebSocket clients work)
- Render Web Services natively support WebSockets (no special configuration needed)
- Socket.IO already configured with polling fallback for resilience

**Key verification needed during planning:**
- Confirm Render free tier supports WebSockets (docs say yes)
- Test CORS configuration works for cross-origin WebSocket handshake
- Verify PgBouncer transaction pooling compatible with all TypeORM queries in codebase
