"use client";

import React, { useState } from "react";
import {
  SidebarNavItem,
  SidebarSection,
  SidebarParentItem,
  SidebarFooter,
} from "./components";
import { NAV_CONFIG, configHelpers, Route } from "./config/navigation";
import type { NavElement } from "./types";
import RaysLighting from "@/components/RaysLighting";

// Re-export Route type for other files
export type { Route };

interface SidebarProps {
  currentRoute: Route;
  isCollapsed: boolean;
  /** Callback fired when sidebar collapse state changes */
  onCollapseChange?: (isCollapsed: boolean) => void;
  /** Whether the screen is mobile size */
  isMobile?: boolean;
  /** Callback to close sidebar on mobile when clicking nav item */
  onMobileClose?: () => void;
  /** Whether the component has been initialized (to prevent layout shifts) */
  isInitialized?: boolean;
}

export default function Sidebar({
  currentRoute,
  isCollapsed,
  onCollapseChange,
  isMobile = false,
  onMobileClose,
  isInitialized = true,
}: SidebarProps) {
  const [expandedParents, setExpandedParents] = useState<Set<Route>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Note: Mobile responsive behavior is now handled in the parent layout component

  // Auto-expand ONLY the parent of the current route (single-open behavior)
  React.useEffect(() => {
    const parentRoute = configHelpers.getParentOfRoute(currentRoute);
    setExpandedParents(parentRoute ? new Set([parentRoute]) : new Set());
  }, [currentRoute]);

  // Close all expanded parent items when sidebar collapses
  React.useEffect(() => {
    if (isCollapsed) {
      setExpandedParents(new Set());
    }
  }, [isCollapsed]);

  // Track transition state to prevent scrollbar flashing
  React.useEffect(() => {
    if (!isInitialized) return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match the transition duration

    return () => clearTimeout(timer);
  }, [isCollapsed, isInitialized]);

  const toggleParent = (route: Route) => {
    // If sidebar is collapsed, expand it first and open the parent
    if (isCollapsed && onCollapseChange) {
      onCollapseChange(false);
      // Open the clicked parent after expanding sidebar
      setExpandedParents(new Set<Route>([route]));
    } else {
      setExpandedParents((prev) => {
        // If clicked parent is already open, close it; otherwise open only it
        return prev.has(route) ? new Set<Route>() : new Set<Route>([route]);
      });
    }
  };

  /** Renders navigation elements based on their type */
  const renderNavElement = (element: NavElement<Route>) => {
    if (element.type === "section") {
      // Section headers show as dividers in collapsed state to prevent layout shift
      return (
        <SidebarSection
          key={JSON.stringify(element.title)}
          title={element.title}
          isCollapsed={isCollapsed}
        />
      );
    } else if (element.type === "parent") {
      return (
        <SidebarParentItem
          key={element.route}
          icon={element.icon}
          title={element.title}
          route={element.route}
          badge={element.badge}
          items={element.children}
          isExpanded={expandedParents.has(element.route)}
          currentRoute={currentRoute}
          onToggle={() => toggleParent(element.route)}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onMobileClose={onMobileClose}
        />
      );
    } else {
      const isActive = currentRoute === element.route;

      return (
        <SidebarNavItem
          key={element.route}
          icon={element.icon}
          title={element.title}
          route={element.route}
          badge={element.badge}
          isActive={isActive}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onMobileClose={onMobileClose}
        />
      );
    }
  };

  return (
    <div
      className={`dashboard-sidebar fixed start-[14px] top-[85px] rounded-2xl bottom-[15px] pb-5 bg-[var(--surface)] border border-[var(--border-subtle)] ${
        // During initialization: mobile hidden; desktop uses saved width without transition
        !isInitialized
          ? `${
              isMobile
                ? "hidden"
                : `z-[21] ${isCollapsed ? "w-[60px]" : "w-[220px]"}`
            }`
          : isMobile
          ? `w-[220px] ${
              isInitialized ? "transition-transform duration-300 ease-out" : ""
            } ${
              isCollapsed
                ? "sidebar-hidden z-[19]"
                : "sidebar-visible z-[22] shadow-lg"
            }`
          : `${
              isInitialized ? "transition-[width] duration-300 ease-out" : ""
            } z-[21] ${isCollapsed ? "w-[60px]" : "w-[220px]"}`
      }`}
    >
      <RaysLighting
        position={"top-left"}
        width={800}
        height={2900}
        intensity={0.04}
        zIndex={20}
      />
      <div className="flex h-full flex-col select-none">
        {/* Navigation menu content */}
        <div
          className={`flex-1 pt-4 ${
            isTransitioning
              ? "overflow-hidden"
              : "overflow-y-auto overflow-x-visible"
          }`}
        >
          <div className="flex flex-col gap-2 px-2 pb-3 md:pb-4">
            {NAV_CONFIG.map((element) => renderNavElement(element))}
          </div>
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
