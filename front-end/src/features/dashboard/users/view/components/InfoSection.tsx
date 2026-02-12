"use client";

import React from "react";
import Status, { type StatusVariant } from "@/components/ui/Status";

interface InfoItem {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  muted?: boolean;
  helperText?: string;
  status?: {
    variant: StatusVariant;
    label: string;
  };
}

interface InfoSectionProps {
  title: string;
  icon: React.ReactNode;
  items: InfoItem[];
}

const sectionTitleClass =
  "text-lg font-semibold mb-6 flex items-center gap-2 text-[var(--text)]";
const itemIconWrapperClass =
  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--surface-hover)]";
const itemLabelClass =
  "text-xs font-medium uppercase tracking-wide mb-1 block text-[var(--text-muted)]";
const itemValueClass = "text-sm font-medium truncate";
const helperTextClass = "text-xs mt-1 text-[var(--text-muted)]";
const cardClass = "bg-[var(--surface)]";

export default function InfoSection({ title, icon, items }: InfoSectionProps) {
  return (
    <section className={`rounded-lg p-6 ${cardClass}`}>
      <h3 className={sectionTitleClass}>
        {icon}
        {title}
      </h3>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={itemIconWrapperClass}>{item.icon}</div>
            <div className="flex-1 min-w-0">
              <label className={itemLabelClass}>{item.label}</label>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`${itemValueClass} ${
                    item.muted
                      ? "text-[var(--text-muted)]"
                      : "text-[var(--text)]"
                  }`}
                  dir={item.id.includes("phone") ? "ltr" : undefined}
                >
                  {item.value}
                </p>
                {item.status && (
                  <Status
                    variant={item.status.variant}
                    label={item.status.label}
                    size="sm"
                  />
                )}
              </div>
              {item.helperText && (
                <p className={helperTextClass}>{item.helperText}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
