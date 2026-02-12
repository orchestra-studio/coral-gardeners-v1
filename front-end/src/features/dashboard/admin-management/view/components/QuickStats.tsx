"use client";

import React from "react";

interface QuickStatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface QuickStatsProps {
  stats: QuickStatItem[];
}

const quickStatClass = "p-4 rounded-lg bg-[var(--surface-hover)]";
const statIconClass = "flex items-center gap-2 mb-1 text-[var(--text-muted)]";
const statValueClass = "text-sm font-semibold text-[var(--text)]";

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {stats.map((stat, index) => (
        <div key={index} className={quickStatClass}>
          <div className={statIconClass}>
            <div className="flex items-center justify-center w-6 h-6">
              {stat.icon}
            </div>
            <span className="text-xs font-medium">{stat.label}</span>
          </div>
          <p className={statValueClass}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
