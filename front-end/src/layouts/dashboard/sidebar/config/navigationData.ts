// Universal Navigation Configuration - Edit BASE_PATH and NAV_CONFIG_RAW for different projects
import React from "react";
import {
    IconTrash,
    IconHome,
    IconUsers,
    IconRobot,
    IconFolderCode,
    IconUserShield,
    IconPalette,
    IconSettings,
} from "@tabler/icons-react";
import { BRAND_CONFIG as BRAND } from "@/config/brand.config";

// Multilingual text interface
export interface MultilingualText {
    ar: string;
    en: string;
}

// Re-export brand configuration for backward compatibility
export const BRAND_CONFIG = {
    name: BRAND.name,
    logout: {
        en: "Logout",
        ar: "تسجيل الخروج"
    },
    // Use the app manifest icon placed under /public
    icon: React.createElement('img', {
        src: BRAND.logo.icon,
        alt: BRAND.logo.alt.en,
        width: 24,
        height: 24,
        style: { display: 'block' }
    }),
    // Custom brand component with responsive logo for light/dark modes
    customBrand: React.createElement('div', {
        className: "flex items-center h-6 w-auto min-w-[120px] bg-contain bg-no-repeat bg-[center_left] rtl:bg-[center_right]",
        style: {
            backgroundImage: 'var(--logo-bg-image)',
            filter: 'var(--logo-filter)'
        }
    }),
} as const;

// Navigation configuration with multilingual support - unified data for sidebar and search
export const NAV_CONFIG_RAW = [
    // Main section
    {
        type: "section",
        title: {
            en: "Main",
            ar: "الرئيسية"
        }
    },
    {
        type: "item",
        icon: React.createElement(IconHome, { size: 20 }),
        title: {
            en: "Overview",
            ar: "نظرة عامة"
        },
        description: {
            en: "Dashboard overview with key metrics and project status",
            ar: "نظرة عامة على لوحة التحكم مع المقاييس الرئيسية وحالة المشاريع"
        },
        route: "overview",
        category: {
            en: "pages",
            ar: "الصفحات"
        }
    },

    // AI Assistant Section (moved right after Overview)
    {
        type: "item",
        icon: React.createElement(IconRobot, { size: 20 }),
        title: {
            en: "AI Assistant",
            ar: "المساعد الذكي"
        },
        description: {
            en: "Chat with AI assistant powered by multiple LLM providers",
            ar: "تحدث مع المساعد الذكي المدعوم بمزودي نماذج لغوية متعددة"
        },
        route: "ai-assistant",
        category: {
            en: "tools",
            ar: "الأدوات"
        }
    },

    // Users Section
    {
        type: "parent",
        icon: React.createElement(IconUsers, { size: 20 }),
        title: {
            en: "Users",
            ar: "المستخدمين"
        },
        description: {
            en: "Manage platform users and accounts",
            ar: "إدارة مستخدمي المنصة والحسابات"
        },
        route: "users",
        category: {
            en: "pages",
            ar: "الصفحات"
        },
        children: [
            {
                type: "item",
                icon: React.createElement(IconUsers, { size: 18 }),
                title: {
                    en: "All",
                    ar: "الكل"
                },
                description: {
                    en: "All active users in the system",
                    ar: "جميع المستخدمين النشطين في النظام"
                },
                route: "users/all",
                category: {
                    en: "pages",
                    ar: "الصفحات"
                }
            },
            {
                type: "item",
                icon: React.createElement(IconTrash, { size: 18 }),
                title: {
                    en: "Deleted",
                    ar: "محذوفة"
                },
                description: {
                    en: "Deleted or deactivated users",
                    ar: "المستخدمين المحذوفين أو المعطلين"
                },
                route: "users/deleted",
                category: {
                    en: "pages",
                    ar: "الصفحات"
                }
            },
        ]
    },

    // Projects Section
    {
        type: "parent",
        icon: React.createElement(IconFolderCode, { size: 20 }),
        title: {
            en: "Projects",
            ar: "المشاريع"
        },
        description: {
            en: "Manage development projects and deployments",
            ar: "إدارة مشاريع التطوير والنشر"
        },
        route: "projects",
        category: {
            en: "pages",
            ar: "الصفحات"
        },
        children: [
            {
                type: "item",
                icon: React.createElement(IconFolderCode, { size: 18 }),
                title: {
                    en: "All",
                    ar: "الكل"
                },
                description: {
                    en: "All development projects in the system",
                    ar: "جميع مشاريع التطوير في النظام"
                },
                route: "projects/all",
                category: {
                    en: "pages",
                    ar: "الصفحات"
                }
            },
            {
                type: "item",
                icon: React.createElement(IconTrash, { size: 18 }),
                title: {
                    en: "Deleted",
                    ar: "محذوفة"
                },
                description: {
                    en: "Deleted or archived projects",
                    ar: "المشاريع المحذوفة أو المؤرشفة"
                },
                route: "projects/deleted",
                category: {
                    en: "pages",
                    ar: "الصفحات"
                }
            },
        ]
    },

    // Admin section
    {
        type: "section",
        title: {
            en: "Admin",
            ar: "الإدارة"
        }
    },

    // Admin Management Section
    {
        type: "item",
        icon: React.createElement(IconUsers, { size: 20 }),
        title: {
            en: "Admin Management",
            ar: "إدارة المسؤولين"
        },
        description: {
            en: "Manage admin users and their permissions",
            ar: "إدارة المستخدمين المسؤولين وصلاحياتهم"
        },
        route: "admins-management",
        category: {
            en: "pages",
            ar: "الصفحات"
        }
    },

    // Admin Roles Section
    {
        type: "item",
        icon: React.createElement(IconUserShield, { size: 20 }),
        title: {
            en: "Admin Roles",
            ar: "أدوار المسؤولين"
        },
        description: {
            en: "Manage admin roles and permissions",
            ar: "إدارة أدوار وصلاحيات المسؤولين"
        },
        route: "admins-roles",
        category: {
            en: "pages",
            ar: "الصفحات"
        }
    },

    // Settings Section
    {
        type: "item",
        icon: React.createElement(IconSettings, { size: 20 }),
        title: {
            en: "Settings",
            ar: "الإعدادات"
        },
        description: {
            en: "Configure application settings and preferences",
            ar: "تكوين إعدادات التطبيق والتفضيلات"
        },
        route: "settings",
        category: {
            en: "pages",
            ar: "الصفحات"
        }
    },

    // Demos section
    {
        type: "section",
        title: {
            en: "Demos",
            ar: "العروض التوضيحية"
        }
    },
    {
        type: "item",
        icon: React.createElement(IconPalette, { size: 20 }),
        title: {
            en: "UI Component",
            ar: "مكونات واجهة المستخدم"
        },
        description: {
            en: "Browse and explore UI component library",
            ar: "تصفح واستكشاف مكتبة مكونات واجهة المستخدم"
        },
        route: "ui-component",
        category: {
            en: "demos",
            ar: "العروض"
        }
    },
] as const;

// Universal constants - change these for different project types
export const NAVIGATION_CONSTANTS = {
    BASE_PATH: "/dashboard", // Change to "/admin", "/crm", "/analytics", etc.

    // Generate full path from route segments
    generatePath: (route: string): string => {
        // Handle root/overview route
        if (route === "overview") {
            return NAVIGATION_CONSTANTS.BASE_PATH;
        }

        // For all other routes, append to base path
        return `${NAVIGATION_CONSTANTS.BASE_PATH}/${route}`;
    },

    // Extract route from path by removing base path
    extractRoute: (path: string): string => {
        // Remove locale prefix if present (e.g., /en/dashboard -> /dashboard)
        const cleanPath = path.replace(/^\/[a-z]{2}(?=\/|$)/, '');

        // Handle root dashboard path
        if (cleanPath === NAVIGATION_CONSTANTS.BASE_PATH) {
            return "overview";
        }

        // Remove base path and leading slash
        if (cleanPath.startsWith(NAVIGATION_CONSTANTS.BASE_PATH + "/")) {
            return cleanPath.substring(NAVIGATION_CONSTANTS.BASE_PATH.length + 1);
        }

        return "overview"; // fallback
    },

    getDefaultFallbackRoute: (): string => {
        for (const item of NAV_CONFIG_RAW) {
            if (item.type === "item") {
                return item.route;
            }
        }
        return "overview";
    },
} as const;

