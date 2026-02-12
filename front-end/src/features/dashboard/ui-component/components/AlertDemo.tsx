"use client";

import React from "react";
import { useTranslations } from "next-intl";
import InlineAlert from "@/components/ui/inline-alert";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface AlertDemoProps {
  className?: string;
}

export default function AlertDemo({ className }: AlertDemoProps = {}) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.alert.title")}
      description={t("components.alert.description")}
      className={className}
    >
      {/* Inline Alerts */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.alert.sections.inline")}
        </h4>
        <div className="flex flex-col gap-3">
          <InlineAlert
            variant="success"
            message={t("components.alert.messages.inlineSuccess")}
          />
          <InlineAlert
            variant="error"
            message={t("components.alert.messages.inlineError")}
          />
          <InlineAlert
            variant="warning"
            message={t("components.alert.messages.warning")}
          />
          <InlineAlert
            variant="info"
            message={t("components.alert.messages.info")}
          />
        </div>
      </div>

      {/* With Titles */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.alert.sections.withTitle")}
        </h4>
        <div className="flex flex-col gap-3">
          <InlineAlert
            variant="success"
            title={t("components.alert.labels.success")}
            message={t("components.alert.messages.success")}
          />
          <InlineAlert
            variant="error"
            title={t("components.alert.labels.error")}
            message={t("components.alert.messages.error")}
          />
        </div>
      </div>

      {/* Code Example */}
      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<InlineAlert variant="success" message="Success message" />`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
