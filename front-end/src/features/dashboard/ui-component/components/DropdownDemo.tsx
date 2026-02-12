"use client";

import React from "react";
import { useTranslations } from "next-intl";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/button";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function DropdownDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.dropdown.title")}
      description={t("components.dropdown.description")}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.dropdown.sections.basic")}
        </h4>
        <DropdownMenu
          trigger={({ toggle }) => (
            <Button variant="outline" onClick={toggle}>
              {t("components.dropdown.labels.openMenu")}
            </Button>
          )}
          items={[
            {
              label: t("components.dropdown.labels.profile"),
              onClick: () => {},
            },
            {
              label: t("components.dropdown.labels.settings"),
              onClick: () => {},
            },
            {
              label: t("components.dropdown.labels.logout"),
              onClick: () => {},
            },
          ]}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<DropdownMenu
  trigger={({ toggle }) => (
    <Button onClick={toggle}>Open Menu</Button>
  )}
  items={[
    { label: "Profile", onClick: () => {} },
    { label: "Settings", onClick: () => {} },
  ]}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
