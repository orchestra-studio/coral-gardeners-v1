"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { syncAuthState, isAuthenticated } from "@/lib/auth/utils";

/**
 * Auth State Synchronizer and Guard Component
 *
 * Ensures auth state is properly synced in localStorage
 * and handles client-side authentication redirects for dashboard routes
 */
export default function AuthSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Sync auth state on mount
    syncAuthState();

    // Check if user is trying to access dashboard route
    const isDashboardRoute = pathname?.includes("/dashboard");
    const isAuthRoute = pathname?.includes("/auth/");

    // Extract locale from pathname
    const localeMatch = pathname?.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : "en";

    // Redirect unauthenticated users trying to access dashboard
    if (isDashboardRoute && !isAuthenticated()) {
      router.replace(`/${locale}/auth/login`);
      return;
    }

    // Redirect authenticated users trying to access auth pages
    if (isAuthRoute && isAuthenticated()) {
      router.replace(`/${locale}/dashboard`);
      return;
    }

    // Also sync when focus returns to tab (in case user logged in on another tab)
    const handleFocus = () => {
      syncAuthState();

      // Re-check auth status on focus
      const currentIsDashboard =
        window.location.pathname.includes("/dashboard");
      const currentIsAuth = window.location.pathname.includes("/auth/");
      const currentLocaleMatch =
        window.location.pathname.match(/^\/([a-z]{2})\//);
      const currentLocale = currentLocaleMatch ? currentLocaleMatch[1] : "en";

      if (currentIsDashboard && !isAuthenticated()) {
        router.replace(`/${currentLocale}/auth/login`);
      } else if (currentIsAuth && isAuthenticated()) {
        router.replace(`/${currentLocale}/dashboard`);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [pathname, router]);

  // Show nothing while checking - prevents flash of content
  // The actual content blocking happens in DashboardGuard component
  return null;
}
