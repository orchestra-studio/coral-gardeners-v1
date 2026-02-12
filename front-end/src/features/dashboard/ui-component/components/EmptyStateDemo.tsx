"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/EmptyState";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface EmptyStateDemoProps {
  className?: string;
}

export default function EmptyStateDemo({ className }: EmptyStateDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [showAction] = useState(false);

  return (
    <DemoCard
      title={t("components.emptyState.title")}
      description={t("components.emptyState.description")}
      className={className}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8">
        <EmptyState
          illustration="search"
          title={t("components.emptyState.labels.noResults")}
          description={t("components.emptyState.messages.noResultsDescription")}
          action={
            showAction
              ? {
                  label: t("components.emptyState.labels.clearFilters"),
                  onClick: () => console.log("Clear filters"),
                  variant: "primary",
                }
              : undefined
          }
          size="md"
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<EmptyState
  illustration="search"
  title="No results found"
  description="Try adjusting your search or filters"
  action={{
    label: "Clear filters",
    onClick: () => handleClear(),
    variant: "primary"
  }}
  size="md"
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
