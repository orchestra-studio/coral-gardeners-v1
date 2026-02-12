# Frontend Documentation

Complete guide for customizing and extending the frontend application.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Adding a New Page](#adding-a-new-page)
- [Adding Translations](#adding-translations)
- [Creating Components](#creating-components)
- [API Integration](#api-integration)
- [Styling Guide](#styling-guide)
- [Routing & Navigation](#routing--navigation)

## Project Structure

```
front-end/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Locale-based routing (en/ar)
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   │   ├── users/
│   │   │   │   ├── projects/
│   │   │   │   ├── settings/
│   │   │   │   └── page.tsx   # Dashboard home
│   │   │   ├── auth/          # Authentication pages
│   │   │   └── layout.tsx     # Locale layout
│   │   ├── layout.tsx         # Root layout
│   │   └── manifest.ts        # PWA manifest
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, etc.)
│   │   ├── Form/             # Form components
│   │   ├── Table/            # Table components
│   │   └── ...
│   │
│   ├── features/             # Feature-specific components
│   │   ├── dashboard/
│   │   │   ├── overview/     # Dashboard overview widgets
│   │   │   ├── users/        # User management UI
│   │   │   └── ...
│   │   └── auth/            # Authentication UI
│   │
│   ├── services/            # API integration & data fetching
│   │   ├── users/
│   │   │   ├── hooks/       # TanStack Query hooks
│   │   │   │   ├── useUsers.ts
│   │   │   │   └── mutations/
│   │   │   ├── types/       # TypeScript types
│   │   │   └── keys/        # Query keys
│   │   └── ...
│   │
│   ├── lib/                 # Utilities & helpers
│   │   ├── api/            # API client & endpoints
│   │   ├── auth/           # Authentication utilities
│   │   └── utils/          # Helper functions
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── locale/
│   │   ├── navigation/
│   │   └── permissions/
│   │
│   ├── layouts/            # Layout components
│   │   ├── dashboard/      # Dashboard layout
│   │   └── auth/           # Auth layout
│   │
│   ├── config/             # Configuration files
│   │   ├── brand.config.ts # Brand configuration
│   │   └── i18n.ts        # Internationalization config
│   │
│   └── types/              # Global TypeScript types
│
├── messages/               # Translation files
│   ├── common/
│   │   ├── en.json
│   │   └── ar.json
│   ├── dashboard/
│   │   ├── en.json
│   │   └── ar.json
│   └── ...
│
└── public/                 # Static assets
    ├── assets/images/
    └── ...
```

## Adding a New Page

### Step 1: Create the Page File

Pages in Next.js 16 use the App Router. Create pages inside `src/app/[locale]/dashboard/`.

**Example: Adding a "Reports" page**

Create: `src/app/[locale]/dashboard/reports/page.tsx`

```typescript
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/PageHeader";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";

export default function ReportsPage() {
  const t = useTranslations("dashboard/reports");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon("breadcrumb.dashboard"), href: "/dashboard" },
    { label: t("title"), current: true },
  ];

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
      />

      <div className="space-y-4">
        {/* Your page content here */}
        <p>{t("content")}</p>
      </div>
    </>
  );
}
```

### Step 2: Add Translations

Create translation files for your new page:

`messages/dashboard/reports/en.json`:

```json
{
  "title": "Reports",
  "description": "View and generate reports",
  "content": "Reports content goes here"
}
```

`messages/dashboard/reports/ar.json`:

```json
{
  "title": "التقارير",
  "description": "عرض وإنشاء التقارير",
  "content": "محتوى التقارير هنا"
}
```

### Step 3: Load Translations in Layout

Edit `src/app/[locale]/dashboard/layout.tsx` and add your namespace:

```typescript
const dashboardMessages = await getMessagesForNamespaces(locale, [
  "common",
  "dashboard",
  "dashboard/reports", // Add this line
  // ... other namespaces
]);
```

### Step 4: Add to Navigation (Optional)

Edit `src/layouts/dashboard/sidebar/config/navigationData.ts`:

```typescript
export const NAV_CONFIG_RAW = [
  // ... existing items
  {
    type: "item",
    icon: React.createElement(IconFileAnalytics, { size: 20 }),
    title: {
      en: "Reports",
      ar: "التقارير",
    },
    description: {
      en: "View and generate reports",
      ar: "عرض وإنشاء التقارير",
    },
    route: "reports",
    category: {
      en: "pages",
      ar: "الصفحات",
    },
  },
];
```

### Step 5: Test Your Page

Visit: `http://localhost:3000/en/dashboard/reports`

## Adding Translations

### Translation File Structure

Translations are organized by feature/page in the `messages/` folder:

```
messages/
├── common/              # Shared translations
│   ├── en.json
│   └── ar.json
├── dashboard/
│   ├── en.json          # General dashboard translations
│   ├── ar.json
│   ├── users/           # User-specific translations
│   │   ├── en.json
│   │   └── ar.json
│   └── ...
```

### Using Translations in Components

```typescript
import { useTranslations } from "next-intl";

export default function MyComponent() {
  // Load specific namespace
  const t = useTranslations("dashboard/users");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>

      {/* With parameters */}
      <p>{t("greeting", { name: "John" })}</p>

      {/* Nested keys */}
      <button>{t("actions.create")}</button>
    </div>
  );
}
```

### Translation File Example

`messages/dashboard/users/en.json`:

```json
{
  "title": "User Management",
  "description": "Manage platform users",
  "greeting": "Hello, {name}!",
  "actions": {
    "create": "Create User",
    "edit": "Edit User",
    "delete": "Delete User"
  },
  "table": {
    "columns": {
      "name": "Name",
      "email": "Email",
      "status": "Status"
    }
  }
}
```

### Best Practices

1. **Namespace Organization**: Group translations by feature
2. **Consistent Keys**: Use same key structure across languages
3. **Nested Objects**: Use nested objects for logical grouping
4. **Parameters**: Use `{paramName}` for dynamic values
5. **Plurals**: Use separate keys for singular/plural forms

## Creating Components

### Component Structure

```typescript
// src/components/MyComponent.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function MyComponent({
  title,
  description,
  className,
  children,
}: MyComponentProps) {
  return (
    <div className={cn("bg-white rounded-lg p-4", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {children}
    </div>
  );
}
```

### Using UI Components

The project includes 50+ pre-built components in `src/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

<Button variant="primary" size="lg">
  Click Me
</Button>

<Input
  type="email"
  placeholder="Enter email"
  label="Email Address"
/>

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
</Card>
```

## API Integration

### Creating a New Service

**Step 1: Define Types**

`src/services/reports/types/reportTypes.ts`:

```typescript
export interface Report {
  id: number;
  title: string;
  created_at: string;
  data: any;
}

export interface ReportsFilters {
  page?: number;
  page_count?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}
```

**Step 2: Create API Client**

`src/lib/api/reports.ts`:

```typescript
import { apiClient } from "./client";
import { ApiResponse, PaginatedResponse } from "./types";
import { Report } from "@/services/reports/types/reportTypes";

export const reportsApi = {
  // Get all reports
  list: async (
    filters: any
  ): Promise<ApiResponse<PaginatedResponse<Report>>> => {
    return apiClient.get("/reports", { params: filters });
  },

  // Get single report
  getById: async (id: number): Promise<ApiResponse<Report>> => {
    return apiClient.get(`/reports/${id}`);
  },

  // Create report
  create: async (data: any): Promise<ApiResponse<Report>> => {
    return apiClient.post("/reports", data);
  },
};
```

**Step 3: Create Query Keys**

`src/services/reports/keys/reportKeys.ts`:

```typescript
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: number) => [...reportKeys.details(), id] as const,
};
```

**Step 4: Create TanStack Query Hooks**

`src/services/reports/hooks/useReports.ts`:

```typescript
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import { reportKeys } from "../keys/reportKeys";

export function useReports(filters = {}, enabled = true) {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: async () => {
      const response = await reportsApi.list(filters);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reports");
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
```

**Step 5: Create Mutation Hooks**

`src/services/reports/hooks/mutations/useCreateReport.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reportsApi } from "@/lib/api/reports";
import { reportKeys } from "../../keys/reportKeys";

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => reportsApi.create(data),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
      }
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
```

**Step 6: Use in Components**

```typescript
import { useReports } from "@/services/reports/hooks/useReports";
import { useCreateReport } from "@/services/reports/hooks/mutations/useCreateReport";

export default function ReportsPage() {
  const { data, isLoading } = useReports({ page: 1 });
  const createReport = useCreateReport();

  const handleCreate = () => {
    createReport.mutate({
      title: "New Report",
      data: {
        /* report data */
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Report</button>
      {data?.data.map((report) => (
        <div key={report.id}>{report.title}</div>
      ))}
    </div>
  );
}
```

## Styling Guide

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configuration.

```typescript
// Using Tailwind classes
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Title</h2>
</div>
```

### CSS Variables

Custom properties are defined for theming:

```typescript
// src/styles/globals.css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --surface: #f9fafb;
  --border: #e5e7eb;
  --text: #111827;
  --text-muted: #6b7280;
  --primary: #3b82f6;
  --errorColor: #ef4444;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  // ...
}
```

Usage:

```typescript
<div className="bg-[var(--surface)] text-[var(--text)]">Content</div>
```

### Utility Function

Use `cn()` for conditional classes:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  error && "error-class",
  className
)}>
```

## Routing & Navigation

### Using Navigation Hook

```typescript
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

export default function MyComponent() {
  const { navigateTo, navigateReplace } = useAppNavigation();

  const handleClick = () => {
    // Navigate to dashboard
    navigateTo("/dashboard");

    // Navigate to users page
    navigateTo("/dashboard/users/all");

    // Replace current URL (no history entry)
    navigateReplace("/dashboard");
  };
}
```

### Link Component

```typescript
import { Link } from "@/components/ui/Link";

<Link href="/dashboard/users">Go to Users</Link>

// With styling
<Link
  href="/dashboard"
  variant="primary"
  size="lg"
>
  Dashboard
</Link>
```

### Programmatic Navigation with Locale

The navigation hooks automatically handle locale prefixing:

```typescript
// Navigates to /en/dashboard/users or /ar/dashboard/users
navigateTo("/dashboard/users");
```

## Additional Resources

- [Brand Customization](../BRANDING.md)
- [Backend API Documentation](../../back-end/docs/README.md)
- [Main README](../../README.md)

---

Need help? Check the inline comments in the source code or refer to the examples in existing pages!
