"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/input";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function SelectDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [singleValue, setSingleValue] = useState<string | number>("");

  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
  ];

  return (
    <DemoCard
      title={t("components.select.title")}
      description={t("components.select.description")}
    >
      {/* Single Select */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.select.sections.single")}
        </p>
        <Select
          label={t("components.select.labels.framework")}
          options={options}
          value={singleValue}
          onChange={(value) => setSingleValue(value)}
          placeholder={t("components.select.placeholders.choose")}
        />
      </div>

      {/* Searchable Select */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.select.sections.searchable")}
        </p>
        <Select
          label={t("components.select.labels.searchableFramework")}
          options={options}
          value={singleValue}
          onChange={(value) => setSingleValue(value)}
          placeholder={t("components.select.placeholders.search")}
          searchable
        />
      </div>

      {/* Clearable Select */}
      <div className="max-w-md">
        <p className="text-sm font-medium text-[var(--text)] mb-2">
          {t("components.select.sections.clearable")}
        </p>
        <Select
          label={t("components.select.labels.clearableFramework")}
          options={options}
          value={singleValue}
          onChange={(value) => setSingleValue(value)}
          placeholder={t("components.select.placeholders.choose")}
          clearable
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

// Basic Select
<Select
  label="Framework"
  options={options}
  value={singleValue}
  onChange={(value) => setSingleValue(value)}
  placeholder="Choose a framework"
/>

// Searchable Select
<Select
  label="Searchable Framework"
  options={options}
  value={singleValue}
  onChange={(value) => setSingleValue(value)}
  placeholder="Search..."
  searchable
/>

// Clearable Select
<Select
  label="Clearable Framework"
  options={options}
  value={singleValue}
  onChange={(value) => setSingleValue(value)}
  placeholder="Choose a framework"
  clearable
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
