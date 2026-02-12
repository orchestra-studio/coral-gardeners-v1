"use client";

import React from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function SearchInputDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.searchInput.title")}
      description={t("components.searchInput.description")}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.searchInput.sections.basic")}
        </h4>
        <SearchInput
          className="w-full max-w-md"
          placeholder={t("components.searchInput.placeholders.search")}
          onOpenModal={() => alert(t("components.searchInput.messages.opened"))}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<SearchInput
  placeholder="Search..."
  onOpenModal={() => {}}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
