"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconDownload,
} from "@tabler/icons-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function ButtonDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.button.title")}
      description={t("components.button.description")}
      className="col-span-full lg:col-span-2 xl:col-span-2"
    >
      {/* Variants Section */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.button.sections.variants")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">
            {t("components.button.labels.default")}
          </Button>
          <Button variant="destructive">
            {t("components.button.labels.destructive")}
          </Button>
          <Button variant="outline">
            {t("components.button.labels.outline")}
          </Button>
          <Button variant="secondary">
            {t("components.button.labels.secondary")}
          </Button>
          <Button variant="ghost">{t("components.button.labels.ghost")}</Button>
          <Button variant="link">{t("components.button.labels.link")}</Button>
        </div>
      </div>

      {/* Sizes Section */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.button.sections.sizes")}
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">{t("components.button.labels.small")}</Button>
          <Button size="default">
            {t("components.button.labels.default")}
          </Button>
          <Button size="lg">{t("components.button.labels.large")}</Button>
          <Button size="xl">{t("components.button.labels.extraLarge")}</Button>
        </div>
      </div>

      {/* With Icons Section */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.button.sections.withIcons")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button startIcon={<IconPlus size={16} />}>
            {t("components.button.labels.createNew")}
          </Button>
          <Button variant="destructive" startIcon={<IconTrash size={16} />}>
            {t("components.button.labels.delete")}
          </Button>
          <Button variant="outline" startIcon={<IconEdit size={16} />}>
            {t("components.button.labels.edit")}
          </Button>
          <Button variant="secondary" endIcon={<IconDownload size={16} />}>
            {t("components.button.labels.download")}
          </Button>
        </div>
      </div>

      {/* States Section */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.button.sections.states")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button disabled>{t("components.button.labels.disabled")}</Button>
          <Button loading>{t("components.button.labels.loading")}</Button>
          <Button variant="outline" disabled>
            {t("components.button.labels.disabledOutline")}
          </Button>
        </div>
      </div>

      {/* Code Example */}
      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Button variant="default" size="md">
  Click me
</Button>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
