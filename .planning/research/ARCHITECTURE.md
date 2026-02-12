# Architecture Research

**Domain:** NGO Operations Dashboard with CRM Integration
**Researched:** 2026-02-12
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Vercel)                          │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router + React 19                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Dashboard  │  │  AI Chat UI  │  │   Map View   │              │
│  │   Features   │  │  (Socket.io) │  │  (Analytics) │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └─────────────────┴─────────────────┘                       │
│                           │                                          │
│         ┌─────────────────▼──────────────────┐                      │
│         │  React Query (TanStack Query)      │                      │
│         │  Redux Toolkit (Global State)      │                      │
│         └────────────────────────────────────┘                      │
├─────────────────────────────────────────────────────────────────────┤
│                      API GATEWAY LAYER                              │
│         WebSocket (Socket.io)     │     REST APIs (Axios)           │
└─────────────────────┬───────────────────────┬───────────────────────┘
                      │                       │
┌─────────────────────▼───────────────────────▼───────────────────────┐
│                    BACKEND LAYER (Render)                           │
├─────────────────────────────────────────────────────────────────────┤
│  NestJS + TypeScript                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  API Module  │  │ WebSocket    │  │ AI Agent     │              │
│  │ (REST/Auth)  │  │ Gateway      │  │ Module       │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│  ┌──────▼─────────────────▼─────────────────▼───────┐              │
│  │          CRM Integration Layer                    │              │
│  │  ┌─────────────┐  ┌─────────────┐                │              │
│  │  │  Shopify    │  │   HubSpot   │                │              │
│  │  │  Connector  │  │  Connector  │                │              │
│  │  └──────┬──────┘  └──────┬──────┘                │              │
│  │         │                │                        │              │
│  │  ┌──────▼────────────────▼──────┐                │              │
│  │  │   Data Sync Service          │                │              │
│  │  │   (Queue + Cache + Webhooks) │                │              │
│  │  └──────────────┬────────────────┘                │              │
│  └─────────────────┼─────────────────────────────────┘              │
│                    │                                                │
│  ┌─────────────────▼────────────────┐                               │
│  │      Business Logic Layer        │                               │
│  │  (Services + Repositories)       │                               │
│  └─────────────────┬────────────────┘                               │
└────────────────────┼──────────────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────────────┐
│                    DATA LAYER (Render PostgreSQL)                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Donors     │  │  Adoptions   │  │  Analytics   │             │
│  │   (Cached)   │  │  (Synced)    │  │ (Aggregated) │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Sessions   │  │    Users/    │  │   Settings   │             │
│  │  (Chat Logs) │  │    Admins    │  │   & Config   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES (3rd Party APIs)                     │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Shopify    │  │   HubSpot    │  │  LLM APIs    │             │
│  │     API      │  │     API      │  │(Gemini/GPT4) │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Frontend (Next.js)** | User interface, routing, client state management | App Router, Server Components, Client Components for interactivity |
| **API Gateway Layer** | Request routing, WebSocket connections, auth | Socket.io client, Axios with interceptors, JWT token management |
| **Backend API Layer** | REST endpoints, business logic, authentication | NestJS modules with controllers/services/repositories |
| **WebSocket Gateway** | Real-time bidirectional communication | Socket.io server with namespaces for auth/notifications |
| **CRM Integration Layer** | External API connectors, data transformation | Modular connectors per CRM, adapter pattern for unified interface |
| **Data Sync Service** | Scheduled sync, webhook handling, cache management | Queue system (BullMQ/Redis), webhook endpoints, caching strategy |
| **AI Agent Module** | LLM integration, chat orchestration, tool calling | Multi-provider LLM clients (Gemini/OpenAI), MCP tool integration |
| **Business Logic Layer** | Core domain logic, validation, orchestration | NestJS services with dependency injection |
| **Data Layer** | Persistent storage, queries, migrations | TypeORM with PostgreSQL, entities with relationships |
| **External Services** | Third-party API integrations | REST clients with retry logic, rate limiting, circuit breakers |

## Recommended Project Structure

### Backend (NestJS)

```
back-end/
├── src/
│   ├── modules/
│   │   ├── auth/                    # Authentication & JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.gateway.ts      # WebSocket auth namespace
│   │   │   └── strategies/          # Passport strategies
│   │   │
│   │   ├── crm-integration/         # NEW: CRM integration layer
│   │   │   ├── crm-integration.module.ts
│   │   │   ├── crm-integration.service.ts
│   │   │   ├── connectors/
│   │   │   │   ├── shopify/
│   │   │   │   │   ├── shopify.connector.ts
│   │   │   │   │   ├── shopify.types.ts
│   │   │   │   │   └── shopify.mapper.ts
│   │   │   │   ├── hubspot/
│   │   │   │   │   ├── hubspot.connector.ts
│   │   │   │   │   ├── hubspot.types.ts
│   │   │   │   │   └── hubspot.mapper.ts
│   │   │   │   └── base.connector.ts   # Abstract base
│   │   │   │
│   │   │   ├── sync/
│   │   │   │   ├── sync.service.ts      # Orchestrates sync jobs
│   │   │   │   ├── sync.queue.ts        # Queue processor
│   │   │   │   └── sync.scheduler.ts    # Cron jobs
│   │   │   │
│   │   │   ├── webhooks/
│   │   │   │   ├── shopify-webhook.controller.ts
│   │   │   │   └── hubspot-webhook.controller.ts
│   │   │   │
│   │   │   └── cache/
│   │   │       └── crm-cache.service.ts  # Cache layer
│   │   │
│   │   ├── donors/                  # NEW: Donor management
│   │   │   ├── entities/
│   │   │   │   ├── donor.entity.ts
│   │   │   │   └── donation.entity.ts
│   │   │   ├── dto/
│   │   │   ├── donors.controller.ts
│   │   │   └── donors.service.ts
│   │   │
│   │   ├── adoptions/               # NEW: Coral adoption tracking
│   │   │   ├── entities/
│   │   │   │   ├── adoption.entity.ts
│   │   │   │   └── coral-site.entity.ts
│   │   │   ├── dto/
│   │   │   ├── adoptions.controller.ts
│   │   │   └── adoptions.service.ts
│   │   │
│   │   ├── analytics/               # NEW: Analytics aggregation
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── aggregators/
│   │   │       ├── donation-aggregator.ts
│   │   │       └── impact-aggregator.ts
│   │   │
│   │   ├── ai-chat/                 # EXISTING: Enhanced for reports
│   │   │   ├── ai-chat.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── streaming.service.ts
│   │   │   │   └── report-generator.service.ts  # NEW
│   │   │   └── providers/           # LLM providers
│   │   │
│   │   ├── notifications/           # NEW: Real-time notifications
│   │   │   ├── notifications.gateway.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── entities/
│   │   │       └── notification.entity.ts
│   │   │
│   │   ├── admins/                  # EXISTING: Admin management
│   │   ├── users/                   # EXISTING: User management
│   │   ├── roles/                   # EXISTING: RBAC
│   │   ├── projects/                # EXISTING: Project management
│   │   ├── tasks/                   # EXISTING: Task management
│   │   ├── settings/                # EXISTING: App settings
│   │   ├── chat-sessions/           # EXISTING: Chat history
│   │   └── mcp/                     # EXISTING: MCP tools
│   │
│   ├── common/                      # Shared utilities
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── utils/
│   │       ├── retry.util.ts        # Retry logic for APIs
│   │       ├── rate-limiter.util.ts
│   │       └── circuit-breaker.util.ts
│   │
│   ├── database/                    # Database config
│   │   ├── config/
│   │   ├── migrations/              # TypeORM migrations
│   │   ├── seeders/
│   │   └── scripts/
│   │
│   ├── i18n/                        # Internationalization
│   ├── app.module.ts
│   └── main.ts
│
├── .env                             # Environment variables
└── package.json
```

### Frontend (Next.js)

```
front-end/
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── [locale]/                # Internationalization
│   │   │   ├── (dashboard)/         # Dashboard layout group
│   │   │   │   ├── dashboard/       # Main dashboard
│   │   │   │   ├── donors/          # NEW: Donor management
│   │   │   │   ├── adoptions/       # NEW: Adoption tracking
│   │   │   │   ├── analytics/       # NEW: Analytics dashboard
│   │   │   │   ├── map/             # NEW: Interactive map
│   │   │   │   ├── ai-assistant/    # AI chat interface
│   │   │   │   ├── projects/        # EXISTING
│   │   │   │   ├── tasks/           # EXISTING
│   │   │   │   ├── users/           # EXISTING
│   │   │   │   └── settings/        # EXISTING
│   │   │   │
│   │   │   └── (auth)/              # Auth layout group
│   │   │       ├── login/
│   │   │       └── register/
│   │   │
│   │   └── api/                     # API routes (if needed)
│   │       └── webhooks/            # Webhook endpoints
│   │
│   ├── features/                    # Feature-based organization
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   │
│   │   ├── donors/                  # NEW
│   │   │   ├── components/
│   │   │   │   ├── DonorList.tsx
│   │   │   │   ├── DonorProfile.tsx
│   │   │   │   └── DonorImportWizard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDonors.ts
│   │   │   │   └── useDonorSync.ts
│   │   │   └── store/
│   │   │       └── donorSlice.ts
│   │   │
│   │   ├── adoptions/               # NEW
│   │   │   ├── components/
│   │   │   │   ├── AdoptionList.tsx
│   │   │   │   └── AdoptionDetails.tsx
│   │   │   └── hooks/
│   │   │
│   │   ├── analytics/               # NEW
│   │   │   ├── components/
│   │   │   │   ├── AnalyticsDashboard.tsx
│   │   │   │   ├── DonationChart.tsx
│   │   │   │   └── ImpactMetrics.tsx
│   │   │   └── hooks/
│   │   │       └── useAnalytics.ts
│   │   │
│   │   ├── map/                     # NEW
│   │   │   ├── components/
│   │   │   │   ├── InteractiveMap.tsx
│   │   │   │   └── SiteMarker.tsx
│   │   │   └── hooks/
│   │   │       └── useMapData.ts
│   │   │
│   │   └── ai-assistant/
│   │       ├── components/
│   │       │   ├── ChatInterface.tsx
│   │       │   ├── MessageList.tsx
│   │       │   └── ReportViewer.tsx  # NEW
│   │       ├── hooks/
│   │       │   ├── useAIChat.ts
│   │       │   ├── useWebSocket.ts
│   │       │   └── useReportGeneration.ts  # NEW
│   │       └── store/
│   │
│   ├── components/                  # Shared components
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layouts/
│   │   ├── Form/
│   │   ├── Table/
│   │   └── StatCards/
│   │
│   ├── lib/                         # Utilities & config
│   │   ├── api/
│   │   │   ├── axios-client.ts      # Axios instance
│   │   │   ├── socket-client.ts     # Socket.io client
│   │   │   └── query-client.ts      # React Query config
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── providers/                   # Context providers
│   │   ├── QueryProvider.tsx        # React Query
│   │   ├── ReduxProvider.tsx        # Redux Store
│   │   └── SocketProvider.tsx       # WebSocket context
│   │
│   ├── store/                       # Redux store
│   │   ├── store.ts
│   │   └── slices/
│   │
│   ├── types/                       # TypeScript types
│   │   ├── api.types.ts
│   │   ├── donor.types.ts
│   │   └── adoption.types.ts
│   │
│   └── styles/                      # Global styles
│
└── package.json
```

### Structure Rationale

**Backend:**
- **Modular architecture:** Each domain (CRM, donors, adoptions) is a self-contained module with clear boundaries
- **CRM Integration Layer:** Isolated from business logic, making it easy to add new CRM connectors
- **Sync Service:** Handles all external data synchronization with queues for reliability
- **WebSocket Gateway:** Separate namespace for different real-time concerns (auth, notifications)

**Frontend:**
- **App Router:** Next.js 15 features for Server Components, streaming, and optimal data fetching
- **Feature-based organization:** Each feature owns its components, hooks, and state
- **Route groups:** Organized by layout (dashboard vs auth) without affecting URL structure
- **Shared components:** UI primitives and common patterns in dedicated folders
- **Provider pattern:** Centralized configuration for React Query, Redux, and WebSocket

## Architectural Patterns

### Pattern 1: CRM Connector Pattern (Adapter)

**What:** Unified interface for multiple CRM systems using the adapter pattern

**When to use:** When integrating multiple external systems (Shopify, HubSpot, future CRMs) with different APIs

**Trade-offs:**
- Pros: Easy to add new CRMs, consistent interface, isolated changes
- Cons: Initial abstraction overhead, potential for leaky abstractions

**Example:**
```typescript
// back-end/src/modules/crm-integration/connectors/base.connector.ts
export abstract class BaseCRMConnector {
  abstract getName(): string;
  abstract connect(): Promise<void>;
  abstract syncDonors(since?: Date): Promise<Donor[]>;
  abstract syncOrders(since?: Date): Promise<Order[]>;
  abstract subscribeToWebhooks(): Promise<void>;
}

// back-end/src/modules/crm-integration/connectors/shopify/shopify.connector.ts
@Injectable()
export class ShopifyConnector extends BaseCRMConnector {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super();
  }

  getName(): string {
    return 'Shopify';
  }

  async connect(): Promise<void> {
    // Initialize Shopify API client
    this.client = new ShopifyAPI({
      apiKey: this.configService.get('SHOPIFY_API_KEY'),
      apiSecret: this.configService.get('SHOPIFY_API_SECRET'),
      shopName: this.configService.get('SHOPIFY_SHOP_NAME'),
    });
  }

  async syncDonors(since?: Date): Promise<Donor[]> {
    // Fetch customers from Shopify
    const customers = await this.client.customers.list({
      created_at_min: since?.toISOString(),
    });

    // Map Shopify customers to internal Donor format
    return customers.map(customer => ShopifyMapper.toDonor(customer));
  }

  async syncOrders(since?: Date): Promise<Order[]> {
    const orders = await this.client.orders.list({
      created_at_min: since?.toISOString(),
      status: 'any',
    });

    return orders.map(order => ShopifyMapper.toOrder(order));
  }

  async subscribeToWebhooks(): Promise<void> {
    // Register webhooks for real-time updates
    await this.client.webhooks.create({
      topic: 'customers/create',
      address: `${this.configService.get('BACKEND_URL')}/api/crm-webhooks/shopify/customers`,
      format: 'json',
    });
  }
}
```

### Pattern 2: Data Sync Strategy (Queue-Based with Cache)

**What:** Scheduled background jobs with queue processing and caching layer

**When to use:** For syncing external data (CRM) that doesn't need real-time updates

**Trade-offs:**
- Pros: Reliable, handles failures, reduces API calls, offline-first
- Cons: Data staleness, queue infrastructure needed, complexity

**Example:**
```typescript
// back-end/src/modules/crm-integration/sync/sync.service.ts
@Injectable()
export class SyncService {
  constructor(
    @InjectQueue('crm-sync') private syncQueue: Queue,
    private cacheService: CRMCacheService,
    private shopifyConnector: ShopifyConnector,
    private hubspotConnector: HubSpotConnector,
  ) {}

  // Schedule full sync (runs every 6 hours via cron)
  @Cron('0 */6 * * *')
  async scheduleFullSync() {
    await this.syncQueue.add('full-sync', {
      type: 'full',
      timestamp: new Date(),
    });
  }

  // Schedule incremental sync (runs every 15 minutes)
  @Cron('*/15 * * * *')
  async scheduleIncrementalSync() {
    const lastSync = await this.cacheService.getLastSyncTime();

    await this.syncQueue.add('incremental-sync', {
      type: 'incremental',
      since: lastSync,
      timestamp: new Date(),
    });
  }

  // Process sync job from queue
  @Process('full-sync')
  async handleFullSync(job: Job) {
    const { timestamp } = job.data;

    // Sync from all connectors in parallel
    const results = await Promise.allSettled([
      this.syncConnector(this.shopifyConnector, null),
      this.syncConnector(this.hubspotConnector, null),
    ]);

    // Update cache timestamp
    await this.cacheService.setLastSyncTime(timestamp);

    return results;
  }

  @Process('incremental-sync')
  async handleIncrementalSync(job: Job) {
    const { since, timestamp } = job.data;

    const results = await Promise.allSettled([
      this.syncConnector(this.shopifyConnector, since),
      this.syncConnector(this.hubspotConnector, since),
    ]);

    await this.cacheService.setLastSyncTime(timestamp);

    return results;
  }

  private async syncConnector(connector: BaseCRMConnector, since?: Date) {
    try {
      // Fetch data with retry logic
      const donors = await this.withRetry(() => connector.syncDonors(since));
      const orders = await this.withRetry(() => connector.syncOrders(since));

      // Store in cache and database
      await this.cacheService.cacheDonors(connector.getName(), donors);
      await this.cacheService.cacheOrders(connector.getName(), orders);

      // Persist to database
      await this.persistToDatabase(donors, orders);

      return { success: true, count: donors.length + orders.length };
    } catch (error) {
      // Log error, will retry on next scheduled run
      Logger.error(`Sync failed for ${connector.getName()}:`, error);
      throw error;
    }
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }
    throw lastError;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Pattern 3: Real-Time Updates (WebSocket + Server-Sent Events)

**What:** Hybrid approach using WebSocket for bidirectional communication and SSE for streaming AI responses

**When to use:** For real-time notifications and streaming AI chat responses

**Trade-offs:**
- Pros: Low latency, efficient, great UX
- Cons: Connection management complexity, scaling considerations

**Example:**
```typescript
// back-end/src/modules/notifications/notifications.gateway.ts
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, Set<string>>(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    const payload = await this.jwtService.verifyAsync(token);
    const userId = payload.sub;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId).add(client.id);

    client.data.userId = userId;

    // Send unread notifications on connect
    const unread = await this.notificationsService.getUnread(userId);
    client.emit('unread-notifications', unread);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId && this.connectedUsers.has(userId)) {
      this.connectedUsers.get(userId).delete(client.id);
    }
  }

  // Emit notification to specific user
  emitToUser(userId: number, event: string, data: any) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  // Emit to all connected users
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}

// front-end/src/providers/SocketProvider.tsx
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('notification', (notification) => {
      // Show toast notification
      toast.info(notification.message);
    });

    newSocket.on('sync-complete', (data) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries(['donors']);
      queryClient.invalidateQueries(['orders']);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
```

### Pattern 4: Server Components with Client Islands (Next.js 15)

**What:** Server-first rendering with selective client interactivity

**When to use:** For dashboard pages that need SEO, fast initial load, and selective interactivity

**Trade-offs:**
- Pros: Faster initial load, SEO-friendly, reduced JS bundle
- Cons: Learning curve, requires careful boundary management

**Example:**
```typescript
// front-end/src/app/[locale]/(dashboard)/dashboard/page.tsx (Server Component)
import { DonorStats } from '@/features/donors/components/DonorStats';
import { InteractiveChart } from '@/features/analytics/components/InteractiveChart';

export default async function DashboardPage() {
  // Fetch data directly in Server Component (no useState/useEffect)
  const stats = await fetch(`${process.env.API_URL}/api/analytics/stats`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  }).then(res => res.json());

  return (
    <div className="dashboard">
      <h1>Operations Dashboard</h1>

      {/* Server Component - no interactivity */}
      <DonorStats stats={stats.donors} />

      {/* Client Component - interactive chart */}
      <InteractiveChart data={stats.donations} />
    </div>
  );
}

// front-end/src/features/analytics/components/InteractiveChart.tsx (Client Component)
'use client';

import { useState } from 'react';
import { LineChart } from 'recharts';

export function InteractiveChart({ data }: { data: any[] }) {
  const [timeRange, setTimeRange] = useState('7d');

  // Client-side interactivity
  return (
    <div>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="1y">Last year</option>
      </select>

      <LineChart data={filterData(data, timeRange)} />
    </div>
  );
}
```

### Pattern 5: AI Agent with Tool Calling (MCP Integration)

**What:** AI agent that can query database, generate reports, and trigger actions via tools

**When to use:** For intelligent chat assistant that needs to access data and perform operations

**Trade-offs:**
- Pros: Natural language interface, powerful automation, extensible
- Cons: LLM costs, response time, error handling complexity

**Example:**
```typescript
// back-end/src/modules/ai-chat/services/streaming.service.ts
@Injectable()
export class StreamingService {
  constructor(
    private mcpService: MCPService,
    private donorsService: DonorsService,
    private analyticsService: AnalyticsService,
  ) {}

  async streamChat(messages: Message[], model: string, res: Response) {
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Register tools that AI can call
    const tools = [
      {
        name: 'get_donor_stats',
        description: 'Get donor statistics for a date range',
        parameters: z.object({
          startDate: z.string(),
          endDate: z.string(),
        }),
        execute: async (args) => {
          return await this.analyticsService.getDonorStats(
            new Date(args.startDate),
            new Date(args.endDate),
          );
        },
      },
      {
        name: 'generate_report',
        description: 'Generate a PDF report for donor impact',
        parameters: z.object({
          donorId: z.number(),
          reportType: z.enum(['impact', 'donations', 'full']),
        }),
        execute: async (args) => {
          return await this.generateDonorReport(args.donorId, args.reportType);
        },
      },
    ];

    // Stream AI response
    const stream = await this.llmClient.chat({
      model,
      messages,
      tools,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'text') {
        res.write(`data: ${JSON.stringify({ content: chunk.text })}\n\n`);
      } else if (chunk.type === 'tool_call') {
        res.write(`data: ${JSON.stringify({ tool_call: chunk })}\n\n`);

        // Execute tool and stream result
        const result = await this.executeToolCall(chunk, tools);
        res.write(`data: ${JSON.stringify({ tool_result: result })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }
}
```

## Data Flow

### Request Flow: User Action → Database → Response

```
1. USER ACTION (Frontend)
   ↓
2. Client Component dispatches action
   ↓
3. React Query mutation OR Redux action
   ↓
4. Axios API call with JWT token
   ↓
5. NestJS Controller receives request
   ↓
6. Auth Guard validates JWT
   ↓
7. Permissions Guard checks RBAC
   ↓
8. Service Layer (business logic)
   ↓
9. Repository/TypeORM query
   ↓
10. PostgreSQL database
    ↓
11. Data returned to Service
    ↓
12. Response Interceptor formats response
    ↓
13. JSON response sent to client
    ↓
14. React Query caches result
    ↓
15. Component re-renders with new data
```

### CRM Sync Flow: External API → Cache → Database → WebSocket Notification

```
1. SCHEDULED JOB (Cron) OR WEBHOOK EVENT
   ↓
2. Sync Service adds job to Queue
   ↓
3. Queue Processor picks up job
   ↓
4. CRM Connector fetches data from external API
   │ (with retry logic, rate limiting)
   ↓
5. Data Mapper transforms external format → internal format
   ↓
6. Cache Service stores in Redis (TTL: 1 hour)
   ↓
7. Repository persists to PostgreSQL
   ↓
8. Notifications Gateway emits 'sync-complete' event
   ↓
9. Frontend WebSocket client receives event
   ↓
10. React Query invalidates cached queries
    ↓
11. Components refetch data and re-render
```

### AI Chat Flow: User Message → LLM → Tool Calls → Streamed Response

```
1. USER TYPES MESSAGE (Frontend)
   ↓
2. Chat component sends via SSE POST request
   ↓
3. AI Chat Controller receives message
   ↓
4. Streaming Service prepares tools (MCP)
   ↓
5. LLM API called with tools available
   ↓
6. LLM generates response (streamed)
   │
   ├─→ Text Chunk
   │   ↓
   │   SSE: data: {"content": "..."} → Frontend displays
   │
   └─→ Tool Call Decision
       ↓
       Execute tool (query database, generate report)
       ↓
       Tool Result
       ↓
       SSE: data: {"tool_result": {...}} → Frontend displays
       ↓
       LLM continues with result context
       ↓
       Final response streamed
```

### Real-Time Notification Flow

```
1. EVENT OCCURS (e.g., new donation, sync complete)
   ↓
2. Service emits event via Event Emitter
   ↓
3. Notifications Service receives event
   ↓
4. Creates notification record in database
   ↓
5. Notifications Gateway finds connected user sockets
   ↓
6. Emits via Socket.io to specific user(s)
   ↓
7. Frontend Socket client receives event
   ↓
8. Toast notification displayed
   ↓
9. Badge counter updated
   ↓
10. Optional: Sound/desktop notification
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Single Render instance (Backend + DB), Vercel for frontend. SQLite OK for dev, PostgreSQL for prod. Simple caching with in-memory store. |
| **1k-10k users** | Add Redis for caching and queue processing. Increase Render instance resources. Database connection pooling. Consider CDN for static assets. |
| **10k-100k users** | Horizontal scaling with multiple Render instances behind load balancer. Separate queue workers. Database read replicas. Edge caching with Vercel. Redis cluster for cache. |
| **100k+ users** | Consider splitting backend into microservices (CRM sync service, AI service, API gateway). Dedicated database per service. Kafka for event streaming. Multi-region deployment. |

### Scaling Priorities (in order of bottlenecks)

1. **First bottleneck: Database connections**
   - Symptom: Connection pool exhausted, slow queries
   - Fix: Add connection pooling, implement read replicas, add database indexes, optimize N+1 queries

2. **Second bottleneck: CRM API rate limits**
   - Symptom: Sync failures, 429 errors from Shopify/HubSpot
   - Fix: Implement queue-based sync, add exponential backoff, cache aggressively, use webhooks instead of polling

3. **Third bottleneck: LLM API costs & latency**
   - Symptom: High OpenAI/Gemini bills, slow AI responses
   - Fix: Cache frequent queries, implement streaming, use cheaper models for simple tasks, consider local LLM for basic queries

4. **Fourth bottleneck: WebSocket connections**
   - Symptom: Connection limits, memory usage
   - Fix: Implement sticky sessions, use Redis adapter for Socket.io, scale horizontally

## Anti-Patterns to Avoid

### Anti-Pattern 1: Polling CRM APIs Every Minute

**What people do:** Set up cron jobs to poll Shopify/HubSpot every minute for new data

**Why it's wrong:**
- Hits rate limits quickly (Shopify: 2 requests/second, HubSpot: 100 requests/10 seconds)
- Wastes API credits
- 99% of polls return no new data
- Creates unnecessary load

**Do this instead:**
- Use webhooks for real-time updates (Shopify/HubSpot both support)
- Schedule full sync every 6-12 hours as backup
- Incremental sync every 15-30 minutes for non-webhook data
- Cache aggressively with TTL

### Anti-Pattern 2: Storing CRM Data Without Transformation

**What people do:** Store raw Shopify/HubSpot JSON directly in database

**Why it's wrong:**
- Tightly couples system to external format
- Makes queries complex (JSONB queries)
- Hard to join with other tables
- Difficult to switch CRMs later

**Do this instead:**
- Create normalized internal schema (Donor, Donation, Adoption entities)
- Build mapper layer to transform external → internal format
- Store external ID for reference
- Keep audit log of raw payloads if needed for debugging

### Anti-Pattern 3: Client-Side Only State for Real-Time Data

**What people do:** Use React state/Redux only for live dashboard data

**Why it's wrong:**
- Data lost on refresh
- No source of truth
- Race conditions with multiple tabs
- Doesn't sync across users

**Do this instead:**
- Server is source of truth (database)
- Use React Query for server state (automatic background refetch, caching)
- WebSocket for push updates to invalidate cache
- Redux/Zustand only for UI state (sidebar open, selected filters)

### Anti-Pattern 4: Synchronous AI Report Generation

**What people do:** Block user while generating complex report (30-60 seconds)

**Why it's wrong:**
- Poor UX (user waits, can't navigate away)
- Frontend timeout issues
- Wastes backend resources holding connection

**Do this instead:**
- Use background jobs for long-running reports
- Return job ID immediately
- Show progress bar updated via WebSocket
- Notify when complete, allow download
- Store generated reports for re-download

### Anti-Pattern 5: Single Monolithic NestJS Module

**What people do:** Put all CRM, donors, analytics code in one giant module

**Why it's wrong:**
- Tight coupling, hard to test
- Merge conflicts with team
- Can't scale parts independently
- Difficult to understand

**Do this instead:**
- One module per domain (donors, adoptions, crm-integration, analytics)
- Clear module boundaries with exports
- Dependency injection for cross-module communication
- Keep modules under 1000 lines

### Anti-Pattern 6: No Error Handling for External APIs

**What people do:** Call Shopify/HubSpot API without retry logic

**Why it's wrong:**
- Network failures break sync
- Transient errors cause data loss
- No visibility into failures

**Do this instead:**
- Implement retry logic with exponential backoff
- Use circuit breaker pattern (stop retrying after X failures)
- Log all API errors with context
- Alert on repeated failures
- Graceful degradation (show cached data if sync fails)

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Shopify API** | REST API + Webhooks | Use Admin API for customers/orders. Register webhooks for real-time updates. Rate limit: 2 req/sec (burst 40). API version in URL. |
| **HubSpot API** | REST API + Webhooks | Use CRM API for contacts/deals. Private app for auth. Rate limit: 100 req/10 sec. Batch operations available. |
| **Google Gemini** | REST API (streaming) | Use Gemini 2.0 Flash for agentic tasks. Supports tool calling (MCP). Streaming via SSE. Context window: 1M tokens. |
| **OpenAI GPT-4** | REST API (streaming) | Alternative LLM provider. Function calling for tools. Streaming via SSE. Context window: 128k tokens. |
| **Render PostgreSQL** | Direct connection | Managed database, connection pooling built-in. Backups automated. Use connection string from env. |
| **Vercel Edge** | Deployment platform | Frontend hosting with CDN. Auto-scaling. Environment variables per branch. Preview deployments. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ Backend API** | REST + WebSocket | Axios for HTTP, Socket.io for real-time. JWT in Authorization header. Base URL from env. |
| **Controller ↔ Service** | Dependency Injection | NestJS DI container. Services are @Injectable, injected in constructor. |
| **Service ↔ Repository** | TypeORM Repository | Use @InjectRepository decorator. Repository pattern for data access. |
| **Service ↔ CRM Connector** | Interface/Abstract Class | Services depend on interface, not concrete connector. Swap connectors via DI. |
| **Backend ↔ Queue** | BullMQ (Redis) | Producer adds jobs, consumer processes. Retry logic built-in. Separate queues per domain. |
| **AI Module ↔ MCP Tools** | Function Registry | Tools registered with name, description, schema. AI calls by name, module executes. |

## Deployment Architecture (Render + Vercel)

### Recommended Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                           │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App (SSR + Static)                                     │
│  - Auto-scaling (serverless)                                    │
│  - Edge caching (global CDN)                                    │
│  - Preview deployments per branch                               │
│  - Environment variables: NEXT_PUBLIC_API_URL                   │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────────────┐
│                    RENDER (Backend)                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NestJS Web Service (Node.js)                            │   │
│  │  - Instance Type: Standard (2GB RAM, 1 CPU)             │   │
│  │  - Auto-deploy from main branch                          │   │
│  │  - Health check: /api/health                             │   │
│  │  - Environment variables: DB connection, API keys        │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │  PostgreSQL Database                                     │   │
│  │  - Managed database (Render)                             │   │
│  │  - Daily backups (7 day retention)                       │   │
│  │  - Connection pooling (max 20)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Redis (Optional, for queue/cache)                       │   │
│  │  - Upstash Redis (external, free tier OK)               │   │
│  │  - Used for BullMQ and caching                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Management

**Vercel (Frontend):**
```bash
# .env.production (Vercel environment variables)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_WS_URL=wss://your-backend.onrender.com
```

**Render (Backend):**
```bash
# Render environment variables (dashboard)
NODE_ENV=production
PORT=3001

# Database (auto-populated by Render if using managed DB)
DATABASE_URL=postgresql://user:pass@host:5432/db

# CRM APIs
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_SHOP_NAME=your-shop

HUBSPOT_API_KEY=your_key
HUBSPOT_PORTAL_ID=your_id

# LLM APIs
GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Redis (if using Upstash)
REDIS_URL=redis://...

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app

# JWT Secret
JWT_SECRET=your_random_secret_key_here
```

### Build Order & Dependencies

**Phase 1: Core Infrastructure (Week 1-2)**
- Set up Render backend with basic NestJS app
- Set up PostgreSQL database
- Set up Vercel frontend with Next.js
- Authentication & RBAC (already exists)
- Deploy hello-world to both platforms

**Phase 2: CRM Integration Layer (Week 3-4)**
- Depends on: Phase 1 (database, auth)
- Build Shopify connector
- Build HubSpot connector
- Implement data sync service
- Set up Redis for queue (optional for MVP)

**Phase 3: Donor & Adoption Modules (Week 5-6)**
- Depends on: Phase 2 (CRM data available)
- Create donor entities & API
- Create adoption entities & API
- Frontend: Donor list, profile pages
- Frontend: Adoption tracking views

**Phase 4: Analytics & Reporting (Week 7-8)**
- Depends on: Phase 3 (donor/adoption data)
- Analytics aggregation service
- Dashboard with charts
- Map visualization component
- Export functionality

**Phase 5: AI Agent Enhancement (Week 9-10)**
- Depends on: Phase 4 (data available for queries)
- Connect AI to donor/analytics data
- Report generation tools
- Chat interface improvements
- Notification system

**Phase 6: Polish & Optimization (Week 11-12)**
- Depends on: All previous phases
- Performance optimization
- Caching strategy
- Error handling & monitoring
- User acceptance testing

## Sources

### NGO/CRM Architecture
- [Future-Proofing Nonprofits for 2026: CRM & ERP Capabilities](https://sylogist.com/blog/ai-cloud-automation-nonprofit-crm-erp/)
- [Leveraging CRM to Enhance Nonprofit and NGO Operations](https://www.agiliway.com/embracing-the-power-of-crm-how-to-enhance-operations-of-nonprofits-and-ngos/)
- [Real-Time Charity Monitoring: Building Effective Impact Dashboards for Nonprofits](https://www.fireflygiving.com/blog/real-time-charity-monitoring-building-effective-impact-dashboards-for-nonprofits/)

### CRM Integration Patterns
- [Shopify HubSpot Integration: How Data Sync & Automation Work](https://www.techmarcos.com/shopify-hubspot-integration/)
- [HubSpot & Shopify Integration: Benefits, Features, and Why It Matters in 2026](https://www.amwhiz.com/blog/hubspot-shopify-integration-benefits-features-and-why-it-matters-in-2026)
- [Shopify HubSpot Data Sync: A Complete Guide to Seamless Integration](https://www.stacksync.com/blog/shopify-hubspot-data-sync-a-complete-guide-to-seamless-integration)

### Next.js Architecture
- [Next.js (App Router) — Advanced Patterns for 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7)
- [Next.js Architecture in 2026 — Server-First, Client-Islands, and Scalable App Router Patterns](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Modern Full Stack Application Architecture Using Next.js 15+](https://softwaremill.com/modern-full-stack-application-architecture-using-next-js-15/)

### NestJS Architecture
- [What Is NestJS? A Practical 2026 Guide to Building Scalable Node.js Backends](https://thelinuxcode.com/what-is-nestjs-a-practical-2026-guide-to-building-scalable-nodejs-backends/)
- [NestJS in 2026: Why It's Still the Gold Standard for Scalable Backends](https://tyronneratcliff.com/nestjs-for-scaling-backend-systems/)
- [How NestJS Design Patterns help build modular, scalable, and maintainable applications](https://medium.com/virtual-force-inc/how-nestjs-design-patterns-help-build-modular-scalable-and-maintainable-applications-801bf1bb5b2c)

### WebSocket & Real-Time
- [How to Implement WebSockets in NestJS](https://oneuptime.com/blog/post/2026-02-02-nestjs-websockets/view)
- [How to Handle WebSocket in Next.js](https://oneuptime.com/blog/post/2026-01-24-nextjs-websocket-handling/view)
- [Building a Production-Ready Real-Time Notification System in NestJS](https://medium.com/@marufpulok98/building-a-production-ready-real-time-notification-system-in-nestjs-websockets-redis-offline-6cc2f1bd0b05)

### AI Agent Architecture
- [Stop Building Chatbots: The Architecture of the 2026 'Agentic' Tech Stack](https://medium.com/@abdulrahmanafifi33/stop-building-chatbots-the-architecture-of-the-2026-agentic-tech-stack-09d268879f5a)
- [A Complete Guide to AI Agent Architecture in 2026](https://www.lindy.ai/blog/ai-agent-architecture)
- [Multi-Agent Adoption to Surge 67% by 2027](https://www.salesforce.com/in/news/stories/connectivity-report-announcement-2026/?bc=OTH)

### Deployment
- [Render vs Vercel (2026): Which platform suits your app architecture better?](https://northflank.com/blog/render-vs-vercel)
- [Deploying Full Stack Apps in 2026: Vercel, Netlify, Railway, and Cloud Options](https://www.nucamp.co/blog/deploying-full-stack-apps-in-2026-vercel-netlify-railway-and-cloud-options)
- [Render vs Vercel](https://render.com/docs/render-vs-vercel-comparison)

### Donor Management Systems
- [How To Build a Database for Nonprofit Donors](https://learn.givepulse.com/blog/how-to-build-a-database-for-nonprofit-donors)
- [Building a Nonprofit Donor Database for Donor Management](https://www.funraise.org/blog/lets-get-digital-a-donor-database-you-can-depend-on)

---
*Architecture research for: Coral Gardeners Operations Dashboard*
*Researched: 2026-02-12*
