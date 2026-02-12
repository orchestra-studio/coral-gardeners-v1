"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "../../lib/auth/utils";

interface DashboardGuardProps {
  children: React.ReactNode;
}

/**
 * Dashboard Guard Component
 *
 * Prevents rendering dashboard content until authentication is verified.
 * Blocks the flash of content for unauthenticated users.
 */
export default function DashboardGuard({ children }: DashboardGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication immediately
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (!authenticated) {
        // Extract locale from pathname
        const localeMatch = pathname?.match(/^\/([a-z]{2})\//);
        const locale = localeMatch ? localeMatch[1] : "en";

        // Redirect to login
        router.replace(`/${locale}/auth/login`);
      } else {
        // User is authenticated, allow rendering
        setIsAuthorized(true);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show spinner while checking authentication
  // This prevents the flash of dashboard content
  if (isChecking || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-700 border-t-[var(--accent-1)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // User is authenticated, render dashboard
  return <>{children}</>;
}
