"use client";

import React from "react";

export interface ProjectInfoItem {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface ProjectInfoSectionProps {
  title: string;
  items: ProjectInfoItem[];
  icon?: React.ReactNode;
}

export default function ProjectInfoSection({
  title,
  items,
  icon,
}: ProjectInfoSectionProps) {
  return (
    <div className="bg-[var(--surface)] rounded-lg p-6 border border-[var(--border-subtle)]">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              {item.icon && (
                <div className="text-[var(--text-muted)]">{item.icon}</div>
              )}
              <div className="text-sm text-[var(--text-muted)]">
                {item.label}
              </div>
            </div>
            <div className="font-medium text-[var(--text)]">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
