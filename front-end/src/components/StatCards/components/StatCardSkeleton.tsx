"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";

interface StatCardSkeletonProps {
  className?: string;
}

export default function StatCardSkeleton({
  className = "",
}: StatCardSkeletonProps) {
  return (
    <div
      className={`bg-[var(--surface)] py-4 px-4 rounded-2xl dark:border dark:border-[var(--border-subtle)] min-h-[110px] w-full flex flex-col justify-between ${className}`}
    >
      {/* Top section with icon and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon skeleton - matches the actual icon container */}
          <Skeleton
            width={20}
            height={20}
            rounded="none"
            className="w-6! h-6! md:w-8! md:h-8! rounded-md"
          />
          {/* Title skeleton */}
          <Skeleton width={80} height={18} rounded="sm" />
        </div>
      </div>

      {/* Bottom section with value */}
      <div className="flex items-baseline justify-between">
        {/* Value skeleton */}
        <Skeleton width={44} height={20} rounded="sm" className="xs:!h-7" />
      </div>
    </div>
  );
}
