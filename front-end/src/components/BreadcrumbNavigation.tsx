"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
  homeHref?: string;
}

const DefaultSeparator = () => (
  <IconChevronRight className="w-4 h-4 text-[var(--neutralLight,rgb(156,163,175))] rtl:rotate-180" />
);

const DefaultHomeIcon = () => <IconHome className="w-4 h-4" />;

export default function BreadcrumbNavigation({
  items,
  separator = <DefaultSeparator />,
  className,
  maxItems = 5,
  showHome = true,
  homeIcon = <DefaultHomeIcon />,
  homeHref = "/dashboard",
}: BreadcrumbNavigationProps) {
  // Collapse items if there are too many
  const processedItems = (() => {
    if (items.length <= maxItems) return items;

    const firstItem = items[0];
    const lastItems = items.slice(-2);

    return [firstItem, { label: "...", href: undefined }, ...lastItems];
  })();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-x-2 text-sm", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="flex items-center text-[var(--neutralLight,rgb(156,163,175))] hover:text-[var(--neutralMedium,rgb(107,114,128))] transition-colors"
              >
                {homeIcon}
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {items.length > 0 && (
              <li className="flex items-center">{separator}</li>
            )}
          </>
        )}

        {processedItems.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 hover:text-[var(--neutralMedium)] transition-colors",
                    item.current
                      ? "text-[var(--text)] font-medium"
                      : "text-[var(--neutralLight)]"
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    item.current
                      ? "text-[var(--text)] font-medium"
                      : "text-[var(--neutralLight)]"
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span aria-current={item.current ? "page" : undefined}>
                    {item.label}
                  </span>
                </div>
              )}
            </li>

            {index < processedItems.length - 1 && (
              <li className="flex items-center">{separator}</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
