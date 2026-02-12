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
        en: "Coral Gardeners Operations Hub",
        ar: ""
    },

    company: {
        en: "Coral Gardeners",
        ar: ""
    },

    shortName: {
        en: "CG Hub",
        ar: ""
    },

    version: "1.0.0",

    logo: {
        // Coral Gardeners white logo
        icon: "/assets/images/cg-logo-white.avif",

        alt: {
            en: "Coral Gardeners Logo",
            ar: ""
        }
    },

    meta: {
        title: {
            en: "Coral Gardeners Operations Hub",
            ar: ""
        },
        description: {
            en: "Coral Gardeners Operations Dashboard - Donor management, coral adoption tracking, and AI-powered analytics",
            ar: ""
        },
        keywords: [
            "coral gardeners",
            "NGO dashboard",
            "donor management",
            "coral adoption",
            "reef restoration",
            "coral conservation",
            "ocean restoration"
        ],
        author: "Coral Gardeners",
        ogImage: "/image.png",
        twitterImage: "/image.png"
    },

    domain: {
        url: "https://yourdomain.com"
    },

    theme: {
        light: "#1a6b8a",
        dark: "#5bc0d4"
    },

    manifest: {
        name: {
            en: "Coral Gardeners Operations Hub",
            ar: ""
        },
        shortName: {
            en: "CG Hub",
            ar: ""
        },
        backgroundColor: "#0d4f6b",
        themeColor: "#1a6b8a",
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
        website: "https://coralgardeners.org",
        // Add social links if needed
    },

    contact: {
        email: "info@coralgardeners.org",
        address: {
            en: "",
            ar: ""
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
