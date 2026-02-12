"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  showItemsCount?: boolean; // New prop to control visibility of "Showing X to Y of Z results"
  showNavButtons?: boolean; // New prop to control visibility of Previous/Next buttons
  compact?: boolean; // New prop for compact mode with reduced padding
  translations?: {
    showing?: string;
    to?: string;
    of?: string;
    results?: string;
    previous?: string;
    next?: string;
    total?: string;
  };
}

/**
 * Generic Pagination component using existing Button component.
 * Provides navigation controls with consistent styling.
 */
export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  className,
  showItemsCount = true, // Default to showing the count
  showNavButtons = true, // Default to showing Previous/Next buttons
  compact = false, // Default to normal padding
  translations = {
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    previous: "Previous",
    next: "Next",
    total: "Total",
  },
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  // Ensure we have valid totalItems, fallback to calculated value if needed
  const validTotalItems =
    totalItems && totalItems > 0 ? totalItems : totalPages * pageSize;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, validTotalItems);

  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center border-t border-[var(--border)] gap-3",
        compact ? "p-2" : "px-4 py-3",
        className
      )}
    >
      {/* Mobile: Show total only */}
      {showItemsCount && (
        <div className="text-sm text-[var(--muted-foreground)] sm:hidden">
          {translations.total}: {validTotalItems} {translations.results}
        </div>
      )}

      {/* Desktop: Show full info */}
      {showItemsCount && (
        <div className="text-sm hidden sm:block text-[var(--muted-foreground)] whitespace-nowrap">
          {translations.showing}{" "}
          <span className="font-medium text-[var(--text)]">{startItem}</span>{" "}
          {translations.to}{" "}
          <span className="font-medium text-[var(--text)]">{endItem}</span>{" "}
          {translations.of}{" "}
          <span className="font-medium text-[var(--text)]">
            {validTotalItems}
          </span>{" "}
          {translations.results}
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-1 sm:gap-2",
          showItemsCount ? "sm:ms-auto" : "ms-auto"
        )}
      >
        {showNavButtons && (
          <Button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <IconChevronLeft className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">{translations.previous}</span>
          </Button>
        )}

        <div className="flex items-center gap-1">
          {getVisiblePages().map((pageNum, index) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-[var(--muted-foreground)]"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 sm:h-9 sm:w-9 font-medium",
                  currentPage === pageNum
                    ? "bg-[var(--text)] text-[var(--background)] hover:bg-[var(--text)]/90"
                    : "hover:bg-[var(--accent)]"
                )}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        {showNavButtons && (
          <Button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <IconChevronRight className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">{translations.next}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
