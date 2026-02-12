"use client";

import { AxiosResponse } from "axios";

/**
 * Clear authentication data and redirect to login
 */
export const handleUnauthorized = (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_session");

    const pathname = window.location.pathname;

    // Don't redirect if already on login page
    if (pathname.includes('/auth/login')) {
        return;
    }

    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const currentLocale = (localeMatch && (localeMatch[1] === 'ar' || localeMatch[1] === 'en'))
        ? localeMatch[1]
        : 'en';

    window.location.replace(`/${currentLocale}/auth/login`);
};

/**
 * Check if response indicates unauthorized
 */
export const isUnauthorizedResponse = (response: AxiosResponse): boolean => {
    if (response.status === 401) return true;

    try {
        const msg = response?.data?.message as string | undefined;
        return msg ? msg.toLowerCase().includes('unauthor') : false;
    } catch {
        return false;
    }
};
