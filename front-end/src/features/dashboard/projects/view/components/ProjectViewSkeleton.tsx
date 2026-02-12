"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";

const cardClass = "bg-[var(--surface)]";

export default function ProjectViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Main project card skeleton */}
      <div className={`rounded-lg p-6 ${cardClass}`}>
        <div className="flex items-start gap-4">
          {/* Image skeleton */}
          <Skeleton width={120} height={120} rounded="md" />

          {/* Project info */}
          <div className="flex-1">
            <div className="mb-2">
              <Skeleton width={300} height={32} />
            </div>
            <div className="mb-4">
              <Skeleton width="80%" height={20} />
            </div>
          </div>

          {/* Actions menu */}
          <div className="flex items-center gap-2">
            <Skeleton width={80} height={24} rounded="full" />
            <Skeleton width={32} height={32} rounded="md" />
          </div>
        </div>
      </div>

      {/* Technical details skeleton */}
      <div className={`rounded-lg p-6 ${cardClass}`}>
        <div className="mb-4">
          <Skeleton width={150} height={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="mb-1">
                <Skeleton width={100} height={12} />
              </div>
              <div>
                <Skeleton width={200} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
