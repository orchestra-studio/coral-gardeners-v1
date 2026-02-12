"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import Navbar from "./NavBar";
import AuthFooter from "./AuthFooter";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Check for dashboard and auth pages with locale prefix (e.g., /en/dashboard, /fr/auth/login)
  const isDashboard = pathname.includes("/dashboard");
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || "en";
  const isLocaleRoot = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Redirect from locale root to dashboard to skip landing page
  useEffect(() => {
    if (isLocaleRoot) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isLocaleRoot, locale, router]);

  // Show nothing while redirecting
  if (isLocaleRoot) {
    return null;
  }

  if (isDashboard) {
    // Dashboard layout - no navbar, no footer, full screen
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Navbar />
      <main
        id="main-content"
        className="flex-1 container mx-auto max-w-[1400px] px-4 md:px-0 py-8 pt-20"
      >
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
