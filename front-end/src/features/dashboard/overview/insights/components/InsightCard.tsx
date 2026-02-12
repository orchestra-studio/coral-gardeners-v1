import React from "react";
import { InsightData } from "../constants";

interface InsightCardProps {
  insight: InsightData;
}

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = insight.icon;

  return (
    <div className="p-4 bg-[var(--surface-hover)] rounded-md border border-[var(--border)]">
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${insight.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className="font-medium text-sm text-[var(--text)]">
            {insight.title}
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
}
