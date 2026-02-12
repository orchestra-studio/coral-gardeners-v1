"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Status from "@/components/ui/Status";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface StatusDemoProps {
  className?: string;
}

export default function StatusDemo({ className }: StatusDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.status.title")}
      description={t("components.status.description")}
      className={className}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.status.sections.severity")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Status
            variant="low"
            label={t("components.status.labels.low")}
            showDot
          />
          <Status
            variant="medium"
            label={t("components.status.labels.medium")}
            showDot
          />
          <Status
            variant="high"
            label={t("components.status.labels.high")}
            showDot
          />
          <Status
            variant="critical"
            label={t("components.status.labels.critical")}
            showDot
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.status.sections.states")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Status
            variant="success"
            label={t("components.status.labels.success")}
          />
          <Status
            variant="warning"
            label={t("components.status.labels.warning")}
          />
          <Status variant="error" label={t("components.status.labels.error")} />
          <Status variant="info" label={t("components.status.labels.info")} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.status.sections.sizes")}
        </h4>
        <div className="flex flex-wrap gap-3 items-center">
          <Status variant="info" label="Small" size="sm" />
          <Status variant="info" label="Medium" size="md" />
          <Status variant="info" label="Large" size="lg" />
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Status variant="success" label="Success" showDot />
<Status variant="critical" label="Critical" size="lg" />`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
