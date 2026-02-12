"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { ShineBadge } from "@/components/ui/ShineBadge";
import Status from "@/components/ui/Status";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function BadgeDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.badge.title")}
      description={t("components.badge.description")}
    >
      {/* Basic Badges */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.badge.sections.basic")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge>{t("components.badge.labels.default")}</Badge>
          <Badge variant="outline">
            {t("components.badge.labels.outline")}
          </Badge>
          <Badge variant="secondary">
            {t("components.badge.labels.secondary")}
          </Badge>
          <Badge variant="success">
            {t("components.badge.labels.success")}
          </Badge>
          <Badge variant="warning">
            {t("components.badge.labels.warning")}
          </Badge>
          <Badge variant="error">{t("components.badge.labels.error")}</Badge>
        </div>
      </div>

      {/* Badge Sizes */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.badge.sections.sizes")}
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm">{t("components.badge.labels.small")}</Badge>
          <Badge size="md">{t("components.badge.labels.medium")}</Badge>
          <Badge size="lg">{t("components.badge.labels.large")}</Badge>
        </div>
      </div>

      {/* Shine Badges */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.badge.sections.shine")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <ShineBadge>{t("components.badge.labels.new")}</ShineBadge>
          <ShineBadge variant="outline">
            {t("components.badge.labels.featured")}
          </ShineBadge>
          <ShineBadge variant="secondary">
            {t("components.badge.labels.premium")}
          </ShineBadge>
        </div>
      </div>

      {/* Status Indicators */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.badge.sections.status")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Status
            variant="success"
            label={t("components.badge.labels.active")}
          />
          <Status
            variant="error"
            label={t("components.badge.labels.inactive")}
          />
          <Status
            variant="warning"
            label={t("components.badge.labels.pending")}
          />
          <Status
            variant="in-progress"
            label={t("components.badge.labels.inProgress")}
          />
        </div>
      </div>

      {/* Code Example */}
      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Basic Badge
<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>

// Badge Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Shine Badge
<ShineBadge>New</ShineBadge>

// Status Badge
<Status variant="success" label="Active" />`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
