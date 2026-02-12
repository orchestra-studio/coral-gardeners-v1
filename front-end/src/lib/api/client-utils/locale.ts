"use client";

/**
 * Detect current locale from URL or localStorage
 */
export const getCurrentLocale = (): string => {
    if (typeof window === "undefined") return "en";

    const pathname = window.location.pathname;
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);

    if (localeMatch && (localeMatch[1] === 'ar' || localeMatch[1] === 'en')) {
        return localeMatch[1];
    }

    try {
        const storedLocale = localStorage.getItem('locale') || localStorage.getItem('next-intl-locale');
        if (storedLocale === 'ar' || storedLocale === 'en') {
            return storedLocale;
        }
    } catch {
        // Ignore localStorage errors
    }

    return "en";
};
