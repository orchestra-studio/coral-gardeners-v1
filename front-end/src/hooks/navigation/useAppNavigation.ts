"use client";

import { useRouter } from "@bprogress/next/app";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useLocale } from "../locale/useLocale";

/**
 * Custom navigation hook that automatically triggers the progress bar
 * and handles locale prefixing for all navigation actions.
 * This eliminates the need to manually manage locales in every component.
 */
export const useAppNavigation = () => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Normalize paths to avoid false positives (trailing slashes, duplicate slashes)
  const normalizePath = useCallback((p: string) => {
    if (!p) return "/";
    try {
      // Keep query string if present
      const [pathOnly, query = ""] = p.split("?");
      let n = pathOnly.replace(/\/+/, "/");
      if (n.length > 1 && n.endsWith("/")) n = n.slice(0, -1);
      return query ? `${n}?${query}` : n;
    } catch {
      return p;
    }
  }, []);

  const getCurrentFullPath = useCallback(() => {
    const search = searchParams?.toString();
    const qs = search ? `?${search}` : "";
    return normalizePath(`${pathname || "/"}${qs}`);
  }, [pathname, searchParams, normalizePath]);

  const navigateTo = useCallback((path: string) => {
    // Automatically prepend locale if path doesn't already have one
    const localizedPath = path.startsWith('/') && !path.startsWith(`/${locale}/`)
      ? `/${locale}${path}`
      : path;

    // Skip if navigating to the same URL (prevents progress bar hanging)
    const target = normalizePath(localizedPath);
    const current = getCurrentFullPath();



    if (target === current) return;
    // The @bprogress/next/app router automatically handles progress bar
    router.push(localizedPath);
  }, [router, locale, normalizePath, getCurrentFullPath]);

  const navigateReplace = useCallback((path: string) => {
    // Automatically prepend locale if path doesn't already have one
    const localizedPath = path.startsWith('/') && !path.startsWith(`/${locale}/`)
      ? `/${locale}${path}`
      : path;
    const target = normalizePath(localizedPath);
    const current = getCurrentFullPath();



    if (target === current) return;
    router.replace(localizedPath);
  }, [router, locale, normalizePath, getCurrentFullPath]);

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateForward = useCallback(() => {
    router.forward();
  }, [router]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  // Special method for locale switching - allows overriding the locale
  const navigateToLocale = useCallback((path: string, targetLocale: string) => {
    // Remove any existing locale prefix from the path
    const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Preserve current search parameters
    const search = searchParams?.toString();
    const queryString = search ? `?${search}` : "";

    const localizedPath = `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}${queryString}`;
    const target = normalizePath(localizedPath);
    if (target === getCurrentFullPath()) return;
    router.push(localizedPath);
  }, [router, normalizePath, getCurrentFullPath, searchParams]);

  // Special method for post-authentication navigation
  const navigateAfterAuth = useCallback((path: string) => {
    // Clear any potential query parameters that might interfere
    const cleanPath = path.split('?')[0];

    // Use replace instead of push to avoid login page in history
    const localizedPath = cleanPath.startsWith('/') && !cleanPath.startsWith(`/${locale}/`)
      ? `/${locale}${cleanPath}`
      : cleanPath;

    // Force a clean navigation by using window.location for this specific case
    // to avoid any router state conflicts after authentication
    if (typeof window !== 'undefined') {
      window.location.replace(localizedPath);
    } else {
      router.replace(localizedPath);
    }
  }, [router, locale]); return {
    // Main navigation method - use this instead of router.push
    navigateTo,
    // Alternative methods
    navigateReplace,
    navigateBack,
    navigateForward,
    refresh,
    // Special method for locale switching
    navigateToLocale,
    // Special method for post-authentication navigation
    navigateAfterAuth,
    // Direct router access if needed
    router,
  };
};

export default useAppNavigation;
