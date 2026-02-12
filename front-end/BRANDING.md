# Brand Customization Guide

This guide explains how to customize the branding for your admin dashboard template.

## Configuration File

All branding is centralized in: `/src/config/brand.config.ts`

## What You Can Customize

### 1. **Brand Names**

```typescript
name: {
    en: "Your Dashboard",
    ar: "لوحة التحكم الخاصة بك"
},
company: {
    en: "Your Company",
    ar: "شركتك"
},
shortName: {
    en: "YourApp",
    ar: "تطبيقك"
}
```

### 2. **Logo & Icons**

```typescript
logo: {
    icon: "/web-app-manifest-512x512.png",  // Main icon for PWA and sidebar
    alt: {
        en: "Your Logo",
        ar: "شعارك"
    }
}
```

**Steps to add your logo:**

1. For PWA icons, replace files in `/public/` (192x192 and 512x512 PNG)
2. Update the `icon` path in `brand.config.ts`
3. For theme-specific logos (light/dark mode), update `/public/assets/images/logo-for-lightmode.png` and `/public/assets/images/logo-for-darkmode.png`
4. These theme logos are referenced in `/src/styles/theme-variables.css` via `--logo-bg-image` CSS variable

### 3. **SEO & Metadata**

```typescript
meta: {
    title: {
        en: "Your Dashboard - Tagline",
        ar: "لوحة التحكم - الشعار"
    },
    description: {
        en: "Your description",
        ar: "وصفك"
    },
    keywords: ["your", "keywords"],
    author: "Your Name",
    ogImage: "/og-image.png",      // 1200x630 recommended
    twitterImage: "/twitter.png"   // 1200x630 recommended
}
```

### 4. **Domain & URLs**

```typescript
domain: {
  url: "https://yourdomain.com"; // Base URL for metadata and SEO
}
```

### 5. **Theme Colors**

```typescript
theme: {
    light: "#ffffff",  // Light mode theme color
    dark: "#000000"    // Dark mode theme color
},
manifest: {
    backgroundColor: "#0B0A1E",
    themeColor: "#1E1B4B"
}
```

### 6. **Contact Information**

```typescript
contact: {
    email: "contact@yourdomain.com",
    phone: "+1 (555) 000-0000",
    address: {
        en: "Your Address",
        ar: "عنوانك"
    }
}
```

### 7. **Social Links**

```typescript
links: {
    website: "https://yoursite.com",
    support: "mailto:support@yoursite.com",
    documentation: "https://docs.yoursite.com",
    github: "https://github.com/yourorg",
    twitter: "https://twitter.com/yourhandle",
    linkedin: "https://linkedin.com/company/yourcompany",
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourhandle"
}
```

## Where Brand Config is Used

The brand configuration is automatically applied to:

✅ **Page Metadata** (`app/layout.tsx`)

- Page titles
- Meta descriptions
- Open Graph tags
- Twitter cards

✅ **PWA Manifest** (`app/manifest.ts` and `app/[locale]/manifest.ts`)

- App name
- Theme colors
- Icons

✅ **Dashboard UI**

- Sidebar logo and branding
- Footer copyright
- Navigation items

✅ **SEO**

- Structured data (Schema.org)
- Robots and sitemap

✅ **Locale Support**

- Automatic English/Arabic content
- RTL/LTR detection

## Helper Functions

Use these helper functions throughout your app:

```typescript
import {
  BRAND_CONFIG,
  getBrandName,
  getCompanyName,
  getCopyrightText,
} from "@/config/brand.config";

// Get localized brand name
const brandName = getBrandName(locale); // "Aniq Dashboard" or "لوحة تحكم أنيق"

// Get localized company name
const company = getCompanyName(locale); // "Aniq-ui" or "أنيق"

// Get copyright text with current year
const copyright = getCopyrightText(locale); // "© 2025 Aniq-ui"
```

**Note:** Most properties are accessed directly from `BRAND_CONFIG` object throughout the app (e.g., `BRAND_CONFIG.name.en`, `BRAND_CONFIG.meta.title.ar`)

## Quick Start Checklist

1. ✅ Update brand names in `brand.config.ts`
2. ✅ Replace logo files in `/public/assets/images/`
3. ✅ Update PWA icons (192x192.png, 512x512.png)
4. ✅ Set your domain URL
5. ✅ Customize theme colors
6. ✅ Add contact information
7. ✅ Configure social links
8. ✅ Update OG/Twitter images

## Notes

- All changes are applied automatically across the entire application
- Supports full internationalization (i18n) for English and Arabic
- PWA manifest is generated dynamically per locale
- SEO metadata updates automatically
- No hardcoded strings - everything pulls from brand config

---

**Need help?** Check the inline comments in `/src/config/brand.config.ts`
