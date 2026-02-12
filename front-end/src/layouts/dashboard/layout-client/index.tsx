"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { shouldShowBackButton } from "@/layouts/dashboard/sidebar/utils";
import Sidebar from "@/layouts/dashboard/sidebar";
import AppHeader from "@/layouts/dashboard/NavBar";
import DashboardFooter from "@/layouts/dashboard/dashboardFooter";
import DashboardGuard from "@/components/guards/DashboardGuard";
import { useRefreshPermissionsOnMount } from "@/services/auth";

// Internal imports
import { DashboardLayoutProps } from "./types";
import { useLayoutState } from "./hooks/useLayoutState";
import { useInitialization } from "./hooks/useInitialization";
import { useMainContentMargin } from "./hooks/useMainContentMargin";
import { getCurrentRoute, createBackHandler } from "./utils/route-helpers";
import { createNavigateHandler } from "./handlers/navigation-handlers";
import {
  createCollapseChangeHandler,
  createToggleSidebarHandler,
  createOverlayCloseHandler,
} from "./handlers/sidebar-handlers";

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { navigateTo } = useAppNavigation();

  // Refresh permissions on every page mount
  useRefreshPermissionsOnMount({ enabled: true });

  // State management
  const {
    isMobile,
    setIsMobile,
    isCollapsed,
    setIsCollapsed,
    isInitialized,
    setIsInitialized,
  } = useLayoutState();

  // Get current route
  const currentRoute = getCurrentRoute(pathname);

  // Handlers
  const handleCollapseChange = createCollapseChangeHandler(setIsCollapsed);
  const handleNavigate = createNavigateHandler(navigateTo);
  const handleBack = createBackHandler(pathname, handleNavigate);
  const toggleSidebarCollapse = createToggleSidebarHandler(
    isCollapsed,
    handleCollapseChange
  );
  const handleOverlayClose = createOverlayCloseHandler(
    isMobile,
    isCollapsed,
    setIsCollapsed
  );

  // Initialize component and handle resize
  useInitialization({
    isCollapsed,
    setIsInitialized,
    setIsMobile,
    handleCollapseChange,
  });

  // Calculate main content margin (reactive to window resize and collapse state)
  const mainContentMargin = useMainContentMargin(isCollapsed);

  const showBack = shouldShowBackButton(currentRoute);

  const containerClassName = "relative w-full h-full border-0 ";

  return (
    <DashboardGuard>
      <div className={containerClassName}>
        {/* Fixed header spanning full width */}
        <AppHeader
          currentRoute={currentRoute}
          showBack={showBack}
          onBack={handleBack}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        <div className="flex relative justify-end  pe-4">
          {/* Mobile overlay backdrop when sidebar is open */}
          {isInitialized && isMobile && !isCollapsed && (
            <div
              className="fixed inset-0 bg-black/50 z-[20] lg:hidden"
              onClick={handleOverlayClose}
            />
          )}

          {/* Collapsible sidebar navigation */}
          <Sidebar
            currentRoute={currentRoute}
            isCollapsed={isCollapsed}
            onCollapseChange={handleCollapseChange}
            isMobile={isMobile}
            onMobileClose={handleOverlayClose}
            isInitialized={isInitialized}
          />

          {/* Main content area with responsive padding */}
          <main
            id="dashboard-root"
            className={` ${
              isMobile ? "w-[calc(100%-20px)]" : "w-[calc(100%-90px)]"
            }  flex flex-col rounded-2xl bg-[var(--background)] pb-4 gap-4  max-w-[1920px] ${mainContentMargin}`}
            style={{
              transition: isInitialized
                ? "padding-inline-start 300ms ease-out"
                : "none",
              willChange: "padding-inline-start",
            }}
          >
            {/* Page content container */}
            <div className="min-h-[calc(100vh-160px)]">{children}</div>
            <DashboardFooter />
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}
