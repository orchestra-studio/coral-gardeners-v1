"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Notice } from "@/components/ui/Notice";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function NoticeDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.notice.title")}
      description={t("components.notice.description")}
    >
      <div className="flex flex-col gap-3">
        <Notice variant="info" title={t("components.notice.labels.info")}>
          {t("components.notice.messages.infoContent")}
        </Notice>

        <Notice variant="success" title={t("components.notice.labels.success")}>
          {t("components.notice.messages.successContent")}
        </Notice>

        <Notice variant="warning" title={t("components.notice.labels.warning")}>
          {t("components.notice.messages.warningContent")}
        </Notice>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Notice variant="info" title="Information">
  This is an informational notice.
</Notice>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
