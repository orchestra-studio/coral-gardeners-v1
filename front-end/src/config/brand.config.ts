/**
 * Brand Configuration
 * 
 * Centralized brand configuration for easy customization.
 * Update this file to change brand identity across the entire application.
 * 
 * Usage:
 * import { BRAND_CONFIG } from '@/config/brand.config';
 */

export interface BrandConfig {
    // Brand name in different languages
    name: {
        en: string;
        ar: string;
    };

    // Company/product name (used in footers and metadata)
    company: {
        en: string;
        ar: string;
    };

    // Short name for compact displays
    shortName: {
        en: string;
        ar: string;
    };

    // Brand version
    version: string;

    // Logo configuration
    logo: {
        // Path to logo icon (used in sidebar, favicons)
        icon: string;

        // Logo alt text
        alt: {
            en: string;
            ar: string;
        };
    };

    // SEO & Metadata
    meta: {
        title: {
            en: string;
            ar: string;
        };
        description: {
            en: string;
            ar: string;
        };
        keywords: string[];
        author: string;
        ogImage: string; // Open Graph image path
        twitterImage: string; // Twitter card image path
    };

    // Domain/URL configuration
    domain: {
        url: string; // Base URL (e.g., https://yourdomain.com)
    };

    // Theme colors
    theme: {
        light: string; // Theme color for light mode
        dark: string;  // Theme color for dark mode
    };

    // PWA/Manifest configuration
    manifest: {
        name: {
            en: string;
            ar: string;
        };
        shortName: {
            en: string;
            ar: string;
        };
        backgroundColor: string;
        themeColor: string;
        display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
        icons: {
            src: string;
            sizes: string;
            type: string;
            purpose?: 'any' | 'maskable' | 'monochrome';
        }[];
    };

    // Social/Contact links
    links: {
        website?: string;
        support?: string;
        documentation?: string;
        github?: string;
        twitter?: string;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };

    // Contact information
    contact: {
        email?: string;
        phone?: string;
        address?: {
            en?: string;
            ar?: string;
        };
    };
}

/**
 * Default Brand Configuration
 * 
 * Customize these values to match your brand identity
 */
export const BRAND_CONFIG: BrandConfig = {
    name: {
        en: "Aniq Dashboard",
        ar: "لوحة تحكم أنيق"
    },

    company: {
        en: "Aniq-ui",
        ar: "أنيق"
    },

    shortName: {
        en: "Aniq",
        ar: "أنيق"
    },

    version: "1.0.0",

    logo: {
        // Default icon (can be replaced with custom path)
        icon: "/web-app-manifest-512x512.png",

        alt: {
            en: "Aniq Dashboard Logo",
            ar: "شعار لوحة تحكم أنيق"
        }
    },

    meta: {
        title: {
            en: "Aniq Dashboard - Modern Admin Panel",
            ar: "لوحة تحكم أنيق - لوحة إدارة حديثة"
        },
        description: {
            en: "Aniq-ui Admin Dashboard - Modern, responsive admin panel built with Next.js",
            ar: "لوحة تحكم أنيق - لوحة إدارة حديثة ومتجاوبة مبنية بتقنية Next.js"
        },
        keywords: [
            "admin dashboard",
            "nextjs",
            "react",
            "typescript",
            "tailwind",
            "aniq-ui"
        ],
        author: "Aniq-ui",
        ogImage: "/image.png",
        twitterImage: "/image.png"
    },

    domain: {
        url: "https://yourdomain.com"
    },

    theme: {
        light: "#ffffff",
        dark: "#000000"
    },

    manifest: {
        name: {
            en: "Aniq Dashboard",
            ar: "لوحة تحكم أنيق"
        },
        shortName: {
            en: "Aniq",
            ar: "أنيق"
        },
        backgroundColor: "#0B0A1E",
        themeColor: "#1E1B4B",
        display: "standalone",
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ]
    },

    links: {
        website: "https://aniq-ui.com",
        support: "mailto:support@aniq-ui.com",
        documentation: "https://docs.aniq-ui.com",
        // Add your social links here
        // github: "https://github.com/your-org",
        // twitter: "https://twitter.com/your-handle",
        // linkedin: "https://linkedin.com/company/your-company",
    },

    contact: {
        email: "contact@aniq-ui.com",
        phone: "+1 (555) 000-0000",
        address: {
            en: "123 Business Street, City, Country",
            ar: "123 شارع الأعمال، المدينة، البلد"
        }
    }
};

/**
 * Helper function to get brand name for current locale
 */
export const getBrandName = (locale: string): string => {
    return BRAND_CONFIG.name[locale as keyof typeof BRAND_CONFIG.name] || BRAND_CONFIG.name.en;
};

/**
 * Helper function to get company name for current locale
 */
export const getCompanyName = (locale: string): string => {
    return BRAND_CONFIG.company[locale as keyof typeof BRAND_CONFIG.company] || BRAND_CONFIG.company.en;
};



/**
 * Helper function to get full copyright text
 */
export const getCopyrightText = (locale: string): string => {
    const year = new Date().getFullYear();
    const company = getCompanyName(locale);
    return `© ${year} ${company}`;
};
