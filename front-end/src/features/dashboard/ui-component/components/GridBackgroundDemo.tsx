"use client";

import React from "react";
import { useTranslations } from "next-intl";
import GridBackground from "@/components/GridBackground";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface GridBackgroundDemoProps {
  className?: string;
}

export default function GridBackgroundDemo({
  className,
}: GridBackgroundDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.gridBackground.title")}
      description={t("components.gridBackground.description")}
      className={className}
    >
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden h-[300px]">
        <GridBackground />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center p-6">
            <h3 className="text-2xl font-bold text-[var(--text)] mb-2">
              {t("components.gridBackground.labels.overlay")}
            </h3>
            <p className="text-[var(--text-muted)]">
              {t("components.gridBackground.messages.info")}
            </p>
          </div>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<div className="relative">
  <GridBackground />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
