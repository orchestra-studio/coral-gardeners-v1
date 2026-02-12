"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import SearchModal from "@/components/SearchModal";
import { Button } from "@/components/ui/button";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function SearchModalDemo() {
  const t = useTranslations("dashboard/ui-component");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DemoCard
      title={t("components.searchModal.title")}
      description={t("components.searchModal.description")}
      className=""
    >
      <div className="flex justify-center">
        <Button onClick={() => setIsOpen(true)}>
          {t("components.searchModal.labels.openSearch")}
        </Button>
      </div>

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={locale}
        translations={{
          placeholder: "search",
          noResultsText: "No results found",
          startTypingText: "Start typing to search...",
        }}
      />

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Search
</Button>

<SearchModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  locale={locale}
  translations={{
    placeholder: "Search...",
    noResultsText: "No results found"
  }}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
