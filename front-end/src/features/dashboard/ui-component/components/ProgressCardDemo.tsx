"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ProgressCard from "@/components/ui/ProgressCard";
import { IconTarget, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface ProgressCardDemoProps {
  className?: string;
}

export default function ProgressCardDemo({ className }: ProgressCardDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.progressCard.title")}
      description={t("components.progressCard.description")}
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressCard
          title={t("components.progressCard.labels.sales")}
          progress={75}
          value="$7,500"
          target="$10,000"
          color="blue"
          icon={<IconTrendingUp />}
          description={t("components.progressCard.messages.salesDesc")}
        />
        <ProgressCard
          title={t("components.progressCard.labels.users")}
          progress={60}
          value="600"
          target="1,000"
          color="green"
          icon={<IconUsers />}
        />
        <ProgressCard
          title={t("components.progressCard.labels.goals")}
          progress={90}
          value="90"
          target="100"
          color="purple"
          icon={<IconTarget />}
          description={t("components.progressCard.messages.salesDesc")}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<ProgressCard
  title="Sales Progress"
  progress={75}
  value="$7,500"
  target="$10,000"
  color="blue"
  icon={<IconTrendingUp />}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
