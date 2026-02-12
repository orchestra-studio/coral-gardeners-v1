# Phase 2: Branding & Data Model Adaptation - Research

**Researched:** 2026-02-12
**Domain:** Frontend branding, internationalization, and data model adaptation
**Confidence:** HIGH

## Summary

This phase involves rebranding an existing Next.js + NestJS dashboard from generic business terminology to Coral Gardeners NGO context. The research reveals this is primarily an **adaptation project**, not a greenfield build. The existing codebase already has user management (maps to donors), project management (maps to coral adoptions), internationalization (i18n) infrastructure, and shadcn/ui components.

The standard approach is to leverage the existing i18n system (next-intl) for terminology changes, use Tailwind CSS v4's @theme directive for brand color customization, and adapt the data model through aliasing and wrapper functions rather than wholesale entity renaming. CSV import/export is handled via react-papaparse for imports and existing libraries for exports.

**Primary recommendation:** Use the existing next-intl i18n files to rebrand all terminology, customize Tailwind theme with Coral Gardeners brand colors via @theme directive, and create TypeScript type aliases (Donor = User, Adoption = Project) to maintain semantic clarity while preserving existing infrastructure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | 4.5.3 | Internationalization for Next.js | Already in use; provides locale-based translations, proven pattern for rebranding terminology |
| Tailwind CSS | 4.1.11 | Utility-first CSS framework | Already in use; v4 provides @theme directive for design token customization |
| shadcn/ui | Current | React component library | Already in use; components are copy-pasted into codebase, fully customizable |
| TypeORM | 0.3.27 | Backend ORM for entities | Already in use; supports entity aliasing via @Entity decorator |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-papaparse | Latest | CSV import/parsing | For donor CSV import (DATA-03); browser-based, multi-threaded, handles large files |
| react-csv | Latest | CSV export | For report exports (DASH-05); simple CSVLink/CSVDownload components |
| jsPDF | Latest | PDF generation | For PDF report exports (DASH-05); client-side generation with html2canvas for styling |
| @react-pdf/renderer | Latest | PDF generation (alternative) | Alternative to jsPDF; React-first approach if complex PDF layouts needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | react-i18next | next-intl is already integrated, optimized for Next.js App Router |
| react-papaparse | csv-import-react | react-papaparse more mature, better performance with Worker threads |
| jsPDF | @react-pdf/renderer | jsPDF simpler for basic exports, @react-pdf/renderer better for complex layouts |

**Installation:**
```bash
# CSV handling
npm install react-papaparse react-csv

# PDF export (choose one)
npm install jspdf html2canvas  # For simple PDFs
npm install @react-pdf/renderer  # For complex PDFs with React components
```

## Architecture Patterns

### Recommended Project Structure
```
front-end/
├── messages/
│   └── dashboard/
│       ├── donors/          # Renamed from users/
│       │   └── en.json      # "Users" → "Donors" terminology
│       ├── adoptions/       # Renamed from projects/
│       │   └── en.json      # "Projects" → "Adoptions" terminology
│       └── overview/
│           └── en.json      # Dashboard metrics terminology
├── src/
│   └── app/[locale]/dashboard/
│       ├── donors/          # URL path (consider keeping /users for backwards compat)
│       ├── adoptions/       # URL path (consider keeping /projects for backwards compat)
│       └── components/
│           └── theme/       # Coral Gardeners brand colors
└── tailwind.config.ts       # @theme customization

back-end/
├── src/
│   └── modules/
│       ├── users/           # Keep entity name unchanged
│       │   ├── entities/
│       │   │   └── user.entity.ts  # @Entity('users')
│       │   └── types/
│       │       └── donor.types.ts  # export type Donor = User
│       └── projects/        # Keep entity name unchanged
│           ├── entities/
│           │   └── project.entity.ts  # @Entity('projects')
│           └── types/
│               └── adoption.types.ts  # export type Adoption = Project
```

### Pattern 1: I18n-Based Rebranding
**What:** Use next-intl translation files to change all UI terminology without touching code
**When to use:** When rebranding terminology across the entire application
**Example:**
```json
// messages/dashboard/donors/en.json
{
  "title": "Donors",
  "description": "Manage donor records and engagement",
  "stats": {
    "total": "Total Donors",
    "active": "Active Donors",
    "newThisMonth": "New Donors This Month"
  },
  "table": {
    "columns": {
      "name": "Donor Name",
      "donationAmount": "Lifetime Giving",
      "lastDonation": "Last Donation"
    }
  }
}
```

Usage in components:
```typescript
// Source: https://next-intl.dev/docs/getting-started
import { useTranslations } from 'next-intl';

export default function DonorsPage() {
  const t = useTranslations('donors');

  return <h1>{t('title')}</h1>; // Renders "Donors"
}
```

### Pattern 2: Tailwind Theme Customization with @theme
**What:** Define brand colors using Tailwind v4's @theme directive
**When to use:** When applying custom brand color scheme
**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  /* Coral Gardeners brand colors */
  --color-ocean-50: oklch(0.97 0.013 220);
  --color-ocean-100: oklch(0.94 0.027 220);
  --color-ocean-500: oklch(0.60 0.15 220);
  --color-ocean-900: oklch(0.30 0.10 220);

  --color-coral-50: oklch(0.97 0.013 40);
  --color-coral-100: oklch(0.94 0.027 40);
  --color-coral-500: oklch(0.74 0.17 40.24);
  --color-coral-900: oklch(0.40 0.12 40);
}
```

Usage:
```tsx
<div className="bg-ocean-500 text-white">
  <h1 className="text-coral-500">Coral Gardeners</h1>
</div>
```

### Pattern 3: Type Aliasing for Semantic Clarity
**What:** Create TypeScript type aliases to map business domain terms to existing entities
**When to use:** When adapting existing data models to new terminology without database changes
**Example:**
```typescript
// back-end/src/modules/users/types/donor.types.ts
import { User } from '../entities/user.entity';

// Semantic alias for business domain
export type Donor = User;

// Adapter interface for NGO-specific fields
export interface DonorProfile extends User {
  // Computed properties
  lifetimeGiving: number;
  lastDonationDate?: Date;
  adoptionCount: number;
}

// back-end/src/modules/projects/types/adoption.types.ts
import { Project } from '../entities/project.entity';

export type CoralAdoption = Project;

export interface AdoptionDetails extends Project {
  // NGO-specific fields
  coralName?: string;
  siteName?: string;
  isFulfilled: boolean;
  certificateIssued: boolean;
}
```

### Pattern 4: CSV Import with react-papaparse
**What:** Parse uploaded CSV files with type safety and validation
**When to use:** For donor data import (DATA-03)
**Example:**
```typescript
// Source: https://react-papaparse.js.org/
import { useCSVReader } from 'react-papaparse';

export default function DonorCsvImport() {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        const donors = results.data.map((row: any) => ({
          first_name: row['First Name'],
          last_name: row['Last Name'],
          email: row['Email'],
          phone: row['Phone'],
        }));
        // Validate and send to backend
      }}
    >
      {({ getRootProps }) => (
        <button {...getRootProps()}>Upload CSV</button>
      )}
    </CSVReader>
  );
}
```

### Pattern 5: CSV/PDF Export
**What:** Export dashboard data to downloadable formats
**When to use:** For report generation (DASH-05)
**Example:**
```typescript
// CSV Export
// Source: https://github.com/react-csv/react-csv
import { CSVLink } from 'react-csv';

const donorData = [
  { name: 'John Doe', email: 'john@example.com', total: 500 },
  { name: 'Jane Smith', email: 'jane@example.com', total: 750 },
];

<CSVLink data={donorData} filename="donors.csv">
  Export Donors to CSV
</CSVLink>

// PDF Export with jsPDF
// Source: https://pdfnoodle.com/blog/generating-pdfs-from-html-with-jspdf
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportPDF = async () => {
  const element = document.getElementById('report');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 10, 10);
  pdf.save('coral-gardeners-report.pdf');
};
```

### Anti-Patterns to Avoid
- **Database schema changes:** Don't rename database tables (users → donors). Keep existing schema, adapt via types and i18n.
- **Hardcoded terminology:** Don't replace "user" strings throughout codebase. Use i18n system for all user-facing text.
- **Component duplication:** Don't copy existing user/project components and rename them. Reuse existing components with different i18n keys.
- **Manual CSV parsing:** Don't write custom CSV parsers. Use react-papaparse which handles edge cases, encoding, and large files.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSV parsing | String.split(',') custom parser | react-papaparse | Handles quoted fields, newlines in data, encoding, large files with Workers |
| PDF generation | Canvas manipulation + save | jsPDF + html2canvas | CSS styling support, page breaks, multi-page handling, font management |
| Color theme system | Manual CSS variables | Tailwind @theme directive | Utility class generation, design token portability, runtime overrides |
| Terminology translation | Find/replace strings | next-intl i18n system | Already integrated, supports locale switching, prevents hardcoded strings |
| Entity renaming | Database migrations | TypeScript type aliases | Zero migration risk, backward compatible, maintains existing infrastructure |

**Key insight:** This is an adaptation project, not a greenfield build. The existing infrastructure (auth, CRUD, i18n, components) is production-ready. Resist the urge to rebuild. Adapt via configuration (i18n, theme), not code changes.

## Common Pitfalls

### Pitfall 1: Breaking Existing Routes and API Endpoints
**What goes wrong:** Renaming /users to /donors breaks existing bookmarks, external links, and frontend-backend contracts.
**Why it happens:** Developers assume URL rebranding is required for full rebranding.
**How to avoid:** Keep existing API routes (/api/users) unchanged. Frontend routes can be aliased or kept the same. Use i18n for display names only.
**Warning signs:** Backend routes change in git diff, API client imports need updating, tests fail.

### Pitfall 2: Incomplete I18n Coverage
**What goes wrong:** Some UI text remains hardcoded (e.g., "user" in error messages, tooltips), creating inconsistent terminology.
**Why it happens:** Missing translation keys in components, especially in error handling and edge cases.
**How to avoid:** Grep codebase for hardcoded business terms before claiming completion. Use TypeScript to enforce translation key usage.
**Warning signs:** Search for "user", "project" in .tsx files returns hardcoded strings.

### Pitfall 3: Tailwind v3 vs v4 Configuration Confusion
**What goes wrong:** Following v3 documentation (tailwind.config.js extend.colors) doesn't work in v4 project.
**Why it happens:** Tailwind CSS v4 shifted from JavaScript config to CSS-first @theme directive.
**How to avoid:** Verify Tailwind version in package.json. Use @theme directive for v4, not tailwind.config.ts extend.colors.
**Warning signs:** Custom colors not generating utility classes, config changes have no effect.

### Pitfall 4: CSV Import Without Validation
**What goes wrong:** Imported CSV data creates invalid donor records, crashes backend, or corrupts database.
**Why it happens:** Directly sending parsed CSV to backend without schema validation or sanitization.
**How to avoid:** Validate CSV data against User entity schema before submission. Show validation errors to user before import.
**Warning signs:** Backend errors on CSV import, duplicate records created, missing required fields.

### Pitfall 5: Overwriting shadcn/ui Components
**What goes wrong:** Customizing shadcn/ui components breaks when copying updated versions from shadcn.
**Why it happens:** Modifying component internals instead of using composition and theming.
**How to avoid:** Use Tailwind theme variables for colors, wrap components for custom behavior, avoid editing component internals.
**Warning signs:** Git conflicts when updating components, need to re-apply customizations after updates.

### Pitfall 6: Entity Aliasing Type Confusion
**What goes wrong:** TypeScript type errors when mixing Donor and User types, unclear which to use where.
**Why it happens:** Inconsistent type usage across codebase, mixing domain types with entity types.
**How to avoid:** Establish clear convention: Use User/Project in backend modules, Donor/Adoption in frontend and API DTOs.
**Warning signs:** Type assertions needed frequently, TypeScript errors about incompatible types.

## Code Examples

Verified patterns from official sources:

### Tailwind Brand Color Setup (v4)
```css
/* Source: https://tailwindcss.com/docs/theme */
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Coral Gardeners Brand Colors */
  --color-cg-ocean-50: oklch(0.97 0.01 220);
  --color-cg-ocean-100: oklch(0.93 0.03 220);
  --color-cg-ocean-200: oklch(0.86 0.06 220);
  --color-cg-ocean-300: oklch(0.76 0.10 220);
  --color-cg-ocean-400: oklch(0.66 0.13 220);
  --color-cg-ocean-500: oklch(0.56 0.15 220);  /* Primary ocean blue */
  --color-cg-ocean-600: oklch(0.46 0.13 220);
  --color-cg-ocean-700: oklch(0.36 0.11 220);
  --color-cg-ocean-800: oklch(0.28 0.08 220);
  --color-cg-ocean-900: oklch(0.20 0.05 220);

  --color-cg-coral-50: oklch(0.97 0.01 40);
  --color-cg-coral-100: oklch(0.93 0.03 40);
  --color-cg-coral-200: oklch(0.87 0.07 40);
  --color-cg-coral-300: oklch(0.80 0.12 40);
  --color-cg-coral-400: oklch(0.74 0.17 40.24);  /* Primary coral */
  --color-cg-coral-500: oklch(0.68 0.19 40);
  --color-cg-coral-600: oklch(0.58 0.16 40);
  --color-cg-coral-700: oklch(0.48 0.13 40);
  --color-cg-coral-800: oklch(0.38 0.10 40);
  --color-cg-coral-900: oklch(0.28 0.07 40);
}
```

Usage:
```tsx
<div className="bg-cg-ocean-500 text-white">
  <button className="bg-cg-coral-400 hover:bg-cg-coral-500">
    Donate Now
  </button>
</div>
```

### I18n Message Files for Donors
```json
// messages/dashboard/donors/en.json
{
  "title": "Donors",
  "description": "Manage donor records and engagement tracking",
  "tabs": {
    "all": "All Donors",
    "deleted": "Inactive Donors"
  },
  "stats": {
    "total": "Total Donors",
    "active": "Active Donors",
    "newThisMonth": "New This Month",
    "totalGiving": "Total Giving"
  },
  "table": {
    "columns": {
      "name": "Donor Name",
      "email": "Email",
      "phone": "Phone",
      "country": "Country",
      "lifetimeGiving": "Lifetime Giving",
      "lastDonation": "Last Donation",
      "adoptions": "Adoptions",
      "createdAt": "Joined Date",
      "actions": "Actions"
    }
  },
  "form": {
    "fields": {
      "firstName": {
        "label": "First Name",
        "placeholder": "Enter first name"
      },
      "lastName": {
        "label": "Last Name",
        "placeholder": "Enter last name"
      },
      "email": {
        "label": "Email Address",
        "placeholder": "Enter email"
      }
    }
  }
}
```

### I18n Messages for Adoptions
```json
// messages/dashboard/adoptions/en.json
{
  "title": "Coral Adoptions",
  "description": "Manage coral adoption records and fulfillment",
  "stats": {
    "total": "Total Adoptions",
    "fulfilled": "Fulfilled",
    "pending": "Pending Fulfillment",
    "thisMonth": "This Month"
  },
  "table": {
    "columns": {
      "donorName": "Donor Name",
      "coralName": "Coral Name",
      "siteName": "Restoration Site",
      "status": "Fulfillment Status",
      "adoptionDate": "Adoption Date",
      "actions": "Actions"
    }
  },
  "status": {
    "pending": "Pending",
    "named": "Named",
    "certificateIssued": "Certificate Issued",
    "siteAssigned": "Site Assigned",
    "fulfilled": "Fully Fulfilled"
  }
}
```

### CSV Import Component
```typescript
// Source: https://react-papaparse.js.org/
'use client';

import { useCSVReader } from 'react-papaparse';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DonorCsvRow {
  'First Name': string;
  'Last Name': string;
  'Email': string;
  'Phone'?: string;
  'Country'?: string;
}

export function DonorCsvImporter() {
  const { CSVReader } = useCSVReader();
  const [importing, setImporting] = useState(false);

  const handleImport = async (results: any) => {
    setImporting(true);

    try {
      const donors = results.data.map((row: DonorCsvRow) => ({
        first_name: row['First Name'],
        last_name: row['Last Name'],
        email: row['Email'],
        phone: row['Phone'] || null,
        country_id: null, // Map country name to ID separately
      }));

      // Send to backend
      const response = await fetch('/api/donors/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donors }),
      });

      if (!response.ok) throw new Error('Import failed');

      // Show success message
      console.log('Import successful');
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <CSVReader
      onUploadAccepted={handleImport}
      config={{
        header: true,
        skipEmptyLines: true,
        worker: true, // Use Web Worker for performance
      }}
    >
      {({ getRootProps, acceptedFile }) => (
        <div>
          <Button {...getRootProps()} disabled={importing}>
            {importing ? 'Importing...' : 'Import Donors from CSV'}
          </Button>
          {acceptedFile && <p>File: {acceptedFile.name}</p>}
        </div>
      )}
    </CSVReader>
  );
}
```

### CSV Export Component
```typescript
// Source: https://github.com/react-csv/react-csv
'use client';

import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';

interface DonorExportData {
  name: string;
  email: string;
  phone: string;
  country: string;
  lifetimeGiving: number;
  lastDonation: string;
  adoptionCount: number;
}

interface Props {
  donors: DonorExportData[];
}

export function DonorCsvExporter({ donors }: Props) {
  const headers = [
    { label: 'Donor Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Country', key: 'country' },
    { label: 'Lifetime Giving', key: 'lifetimeGiving' },
    { label: 'Last Donation', key: 'lastDonation' },
    { label: 'Adoptions', key: 'adoptionCount' },
  ];

  return (
    <CSVLink
      data={donors}
      headers={headers}
      filename={`donors-${new Date().toISOString()}.csv`}
    >
      <Button variant="outline">Export to CSV</Button>
    </CSVLink>
  );
}
```

### Type Aliases for Domain Adaptation
```typescript
// back-end/src/modules/users/types/donor.types.ts
import { User } from '../entities/user.entity';

/**
 * Semantic alias: Donor is a User in the NGO context
 */
export type Donor = User;

/**
 * Donor with computed NGO-specific fields
 */
export interface DonorProfile extends User {
  lifetimeGiving: number;
  lastDonationDate?: Date;
  adoptionCount: number;
  engagementScore?: number;
}

/**
 * DTO for donor list responses
 */
export interface DonorListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  lifetimeGiving: number;
  adoptionCount: number;
  joinedDate: Date;
}

// back-end/src/modules/projects/types/adoption.types.ts
import { Project } from '../entities/project.entity';

/**
 * Semantic alias: CoralAdoption is a Project in the NGO context
 */
export type CoralAdoption = Project;

/**
 * Adoption fulfillment status tracking
 */
export interface AdoptionFulfillment {
  isNamed: boolean;
  coralName?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  siteAssigned: boolean;
  siteName?: string;
  siteCoordinates?: { lat: number; lng: number };
}

/**
 * Adoption with NGO-specific details
 */
export interface AdoptionDetails extends Project {
  donorId: number;
  donorName: string;
  fulfillment: AdoptionFulfillment;
  adoptionDate: Date;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config in JS (tailwind.config.js extend) | Tailwind @theme directive in CSS | Tailwind v4 (2024) | Design tokens now CSS-first, portable, runtime-overridable |
| Manual i18n key lookups | Type-safe useTranslations hook | next-intl v3+ | Compile-time type checking for translation keys |
| CSV parsing with Papa Parse directly | react-papaparse hooks (useCSVReader) | 2023+ | React-native API, better UX components |
| jsPDF imperative API | @react-pdf/renderer declarative | 2024+ | React component model for PDFs, easier maintenance |

**Deprecated/outdated:**
- Tailwind v3 JavaScript configuration: Use @theme directive in CSS for v4 projects
- middleware.ts for i18n routing: Next.js 16 renamed to proxy.ts (though middleware.ts still works)
- Manual CSV string parsing: Use libraries that handle edge cases (quotes, newlines, encoding)

## Open Questions

Things that couldn't be fully resolved:

1. **Logo file format compatibility**
   - What we know: Logo file is CG_White_Logo_2.avif (AVIF format)
   - What's unclear: Browser support matrix for AVIF in 2026, whether fallback formats needed
   - Recommendation: Test AVIF support, prepare PNG fallback if needed. AVIF is well-supported in modern browsers (Chrome, Safari, Firefox as of 2023+).

2. **Adoption fulfillment status granularity**
   - What we know: Requirements specify tracking "naming, certificate, site assignment" (DATA-06)
   - What's unclear: Whether these are separate boolean flags or a single status enum
   - Recommendation: Use individual boolean flags for flexibility (isNamed, certificateIssued, siteAssigned) plus computed isFulfilled property.

3. **Donor activity timeline implementation**
   - What we know: DATA-04 requires "donor activity timeline"
   - What's unclear: Whether this is a new feature or adapting existing audit logs
   - Recommendation: Check if backend already has audit/activity tracking. If yes, adapt via i18n and frontend display. If no, implement as separate timeline feature.

4. **Dashboard metrics calculation**
   - What we know: DASH-01 requires displaying "total donors, active adoptions, revenue, restoration sites"
   - What's unclear: Whether revenue tracking is already in database or needs to be computed
   - Recommendation: Audit existing database schema for financial fields. Revenue likely needs to be computed from adoption records or added as new field.

5. **Backward compatibility for API routes**
   - What we know: Existing routes are /api/users and /api/projects
   - What's unclear: Whether to keep these or alias to /api/donors and /api/adoptions
   - Recommendation: Keep existing routes unchanged for Phase 2. Add aliases if needed in later phase. Frontend can use existing endpoints with adapted DTOs.

## Sources

### Primary (HIGH confidence)
- Tailwind CSS v4 Documentation - https://tailwindcss.com/docs/theme (Theme customization with @theme directive)
- next-intl Documentation - https://next-intl.dev/docs/getting-started (Next.js internationalization setup)
- react-papaparse Documentation - https://react-papaparse.js.org/ (CSV parsing with React hooks)
- TypeORM Documentation - https://typeorm.io/ (Entity configuration and migrations)

### Secondary (MEDIUM confidence)
- [Colors - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/colors)
- [Theming best practices in v4 · tailwindlabs/tailwindcss · Discussion #18471](https://github.com/tailwindlabs/tailwindcss/discussions/18471)
- [Customizing shadcn/ui Themes Without Breaking Updates](https://medium.com/@sureshdotariya/customizing-shadcn-ui-themes-without-breaking-updates-a3140726ca1e)
- [How to Import CSV File with React | Refine](https://refine.dev/blog/how-to-import-csv/)
- [react-csv GitHub](https://github.com/react-csv/react-csv)
- [Best JavaScript PDF libraries 2025: A complete guide](https://www.nutrient.io/blog/javascript-pdf-libraries/)
- [How to Generate PDF with jsPDF in JavaScript (2026 Guide)](https://pdfnoodle.com/blog/generating-pdfs-from-html-with-jspdf)

### Tertiary (LOW confidence)
- Web search results on NestJS entity aliasing (no specific official documentation found)
- Community discussions on TypeScript domain modeling patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use or well-documented
- Architecture: HIGH - Patterns verified with official documentation and existing codebase analysis
- Pitfalls: MEDIUM - Based on common patterns and best practices, some from community experience

**Research date:** 2026-02-12
**Valid until:** 2026-03-15 (30 days - stable ecosystem)
