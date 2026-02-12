"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";

// Reusable width tokens for consistency & easy future adjustments
const W = {
  xs: "18%",
  sm: "22%",
  md: "26%",
  md2: "34%",
  lg: "40%",
  xl: "48%",
  xxl: "54%",
  xxxl: "60%",
};

const cardClass = "bg-[var(--surface)]";

export default function UserViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded-lg overflow-hidden ${cardClass}`}>
        {/* Gradient background header */}

        <div className="px-6 pb-6">
          {/* Avatar and header info section with exact same structure */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pt-5">
            {/* Avatar skeleton */}
            <div className="relative z-10 w-32 h-32 rounded-full border-4 bg-[var(--surface)] border-[var(--surface)]">
              <Skeleton width="100%" height="100%" rounded="full" />
            </div>

            {/* Header info skeleton - matching UserHeaderInfo structure */}
            <div className="flex-1 sm:mb-4">
              {/* Name skeleton (reduced width for realism) */}
              {/* Fixed width per request (230px max) */}
              <Skeleton width={230} height={32} className="mb-1" />
              {/* Username skeleton (shorter to mimic handle length) */}
              <div className="flex items-center gap-1 mt-1">
                <Skeleton width={16} height={16} />
                <Skeleton width={W.xs} height={20} />
              </div>
            </div>

            {/* Status and Actions skeleton - matching verification + actions section */}
            <div className="sm:mb-4 flex flex-col gap-1 items-start sm:items-end">
              <div className="flex items-center gap-3">
                <Skeleton width={80} height={24} rounded="full" />
                {/* Action button skeleton */}
                <Skeleton width={32} height={32} rounded="full" />
              </div>
            </div>
          </div>

          {/* Quick stats skeleton - matching QuickStats structure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => {
              const labelWidths = [W.md2, W.md, W.lg]; // tighter labels
              const valueWidths = [W.xl, W.xxl, W.md2]; // shorter values
              return (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-[var(--surface-hover)]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton width={24} height={24} />
                    <Skeleton width={labelWidths[i - 1]} height={16} />
                  </div>
                  <Skeleton
                    width={valueWidths[i - 1]}
                    height={20}
                    className="mt-1"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info sections skeleton - matching InfoSection structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className={`rounded-lg p-6 ${cardClass}`}>
            {/* Section title - matching exact structure */}
            <div className="text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text)]">
              <Skeleton width={20} height={20} />
              <Skeleton width={140} height={24} />
            </div>

            {/* Section items with exact InfoSection structure */}
            <div className="space-y-5">
              {[1, 2, 3, 4].map((j) => {
                const labelWidths = [90, 70, 80, 60]; // pixel-based concise labels
                const valueWidths = [160, 150, 120, 140]; // pixel-based values
                const helperWidths = [120, 140, null, null]; // helper lines
                return (
                  <div key={j} className="flex items-start gap-3">
                    {/* Icon wrapper - exact same styling as real component */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--surface-hover)]">
                      <Skeleton width={18} height={18} />
                    </div>

                    {/* Content area - matching InfoSection item structure */}
                    <div className="flex-1 min-w-0">
                      {/* Label skeleton - matching the exact label styling */}
                      <Skeleton
                        width={labelWidths[j - 1]}
                        height={12}
                        className="mb-1"
                      />

                      {/* Value area with potential status badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton width={valueWidths[j - 1]} height={18} />
                        {j === 1 && (
                          <Skeleton width={70} height={20} rounded="full" />
                        )}
                      </div>

                      {/* Helper text skeleton for some items */}
                      {typeof helperWidths[j - 1] === "number" && (
                        <Skeleton
                          width={helperWidths[j - 1] as number}
                          height={12}
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
