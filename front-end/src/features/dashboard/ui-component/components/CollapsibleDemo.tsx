"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Collapsible from "@/components/ui/Collapsible";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function CollapsibleDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.collapsible.title")}
      description={t("components.collapsible.description")}
    >
      <div className="flex flex-col gap-3">
        <Collapsible
          title={t("components.collapsible.labels.section1")}
          defaultOpen={false}
        >
          <div className="p-4">
            <p className="text-sm text-[var(--text)]">
              {t("components.collapsible.messages.content")}
            </p>
          </div>
        </Collapsible>

        <Collapsible title={t("components.collapsible.labels.section2")}>
          <div className="p-4">
            <p className="text-sm text-[var(--text)]">
              {t("components.collapsible.messages.content")}
            </p>
          </div>
        </Collapsible>

        <Collapsible
          title={t("components.collapsible.labels.section3")}
          disabled={true}
        >
          <div className="p-4">
            <p className="text-sm text-[var(--text)]">
              {t("components.collapsible.messages.content")}
            </p>
          </div>
        </Collapsible>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Collapsible title="Section Title" defaultOpen={false}>
  <div className="p-4">
    <p>Collapsible content</p>
  </div>
</Collapsible>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
