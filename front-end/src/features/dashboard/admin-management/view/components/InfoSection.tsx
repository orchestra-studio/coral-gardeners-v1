"use client";

import React from "react";
import type { LayoutInfoItem } from "./AdminViewLayout";

interface InfoSectionProps {
  title: string;
  icon: React.ReactNode;
  items: LayoutInfoItem[];
}

const sectionTitleClass =
  "text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text)]";
const itemIconWrapperClass =
  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--surface-hover)]";
const itemLabelClass =
  "text-xs font-medium uppercase tracking-wide mb-1 block text-[var(--text-muted)]";
const itemValueClass = "text-sm font-medium truncate";
const cardClass = "bg-[var(--surface)]";

export function InfoSection({ title, icon, items }: InfoSectionProps) {
  return (
    <section className={`rounded-lg p-6 ${cardClass}`}>
      <h3 className={sectionTitleClass}>
        {icon}
        {title}
      </h3>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={itemIconWrapperClass}>{item.icon}</div>
            <div className="flex-1 min-w-0">
              <label className={itemLabelClass}>{item.label}</label>
              <div className="flex flex-wrap items-center gap-2">
                <p className={`${itemValueClass} text-[var(--text)]`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
