"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/ui/checkbox";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function CheckboxDemo() {
  const t = useTranslations("dashboard/ui-component");
  const tCheckbox = useTranslations(
    "dashboard/ui-component.components.checkbox"
  );

  // Basic states
  const [checked, setChecked] = useState(false);
  const [checkedWithLabel, setCheckedWithLabel] = useState(true);

  // Indeterminate states
  const [indeterminate, setIndeterminate] = useState(true);

  // Multi-select example
  const [items, setItems] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  // Size variants
  const [sizeChecked, setSizeChecked] = useState({
    sm: true,
    md: true,
    lg: true,
  });

  // Style variants
  const [variantChecked, setVariantChecked] = useState({
    default: true,
    outline: true,
    ghost: true,
  });

  // Handle select all logic
  const allItemsChecked = Object.values(items).every(Boolean);
  const someItemsChecked =
    Object.values(items).some(Boolean) && !allItemsChecked;

  const handleSelectAll = () => {
    const newState = !allItemsChecked;
    setItems({
      item1: newState,
      item2: newState,
      item3: newState,
    });
  };

  const handleItemChange = (item: keyof typeof items) => {
    const newItems = { ...items, [item]: !items[item] };
    setItems(newItems);
  };

  return (
    <DemoCard
      title={t("components.checkbox.title")}
      description={t("components.checkbox.description")}
    >
      {/* Basic Usage */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text)]">
          {tCheckbox("sections.basicUsage")}
        </p>
        <div className="flex flex-wrap gap-4">
          <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            label={tCheckbox("labels.unchecked")}
          />
          <Checkbox
            checked={checkedWithLabel}
            onChange={() => setCheckedWithLabel(!checkedWithLabel)}
            label={tCheckbox("labels.checked")}
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            disabled
            label={tCheckbox("labels.disabled")}
          />
          <Checkbox
            checked={true}
            onChange={() => {}}
            disabled
            label={tCheckbox("labels.disabledChecked")}
          />
        </div>
      </div>

      {/* Indeterminate State */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text)]">
          {tCheckbox("sections.indeterminateState")}
        </p>
        <Checkbox
          checked={indeterminate}
          onChange={() => setIndeterminate(!indeterminate)}
          indeterminate
          label={tCheckbox("labels.partiallySelected")}
        />
      </div>

      {/* Multi-Select Example */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text)]">
          {tCheckbox("sections.multiSelect")}
        </p>
        <div className="space-y-2 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <Checkbox
            checked={allItemsChecked}
            onChange={handleSelectAll}
            indeterminate={someItemsChecked}
            label={tCheckbox("labels.selectAll")}
            className="font-medium"
          />
          <div className="ms-6 space-y-2 mt-2">
            <Checkbox
              checked={items.item1}
              onChange={() => handleItemChange("item1")}
              label={`${tCheckbox("labels.option")} 1`}
            />
            <Checkbox
              checked={items.item2}
              onChange={() => handleItemChange("item2")}
              label={`${tCheckbox("labels.option")} 2`}
            />
            <Checkbox
              checked={items.item3}
              onChange={() => handleItemChange("item3")}
              label={`${tCheckbox("labels.option")} 3`}
            />
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text)]">
          {tCheckbox("sections.sizeVariants")}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox
            checked={sizeChecked.sm}
            onChange={() =>
              setSizeChecked({ ...sizeChecked, sm: !sizeChecked.sm })
            }
            size="sm"
            label={tCheckbox("labels.small")}
          />
          <Checkbox
            checked={sizeChecked.md}
            onChange={() =>
              setSizeChecked({ ...sizeChecked, md: !sizeChecked.md })
            }
            size="md"
            label={tCheckbox("labels.medium")}
          />
          <Checkbox
            checked={sizeChecked.lg}
            onChange={() =>
              setSizeChecked({ ...sizeChecked, lg: !sizeChecked.lg })
            }
            size="lg"
            label={tCheckbox("labels.large")}
          />
        </div>
      </div>

      {/* Style Variants */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text)]">
          {tCheckbox("sections.styleVariants")}
        </p>
        <div className="flex flex-wrap gap-6">
          <Checkbox
            checked={variantChecked.default}
            onChange={() =>
              setVariantChecked({
                ...variantChecked,
                default: !variantChecked.default,
              })
            }
            variant="default"
            label={tCheckbox("labels.default")}
          />
          <Checkbox
            checked={variantChecked.outline}
            onChange={() =>
              setVariantChecked({
                ...variantChecked,
                outline: !variantChecked.outline,
              })
            }
            variant="outline"
            label={tCheckbox("labels.outline")}
          />
          <Checkbox
            checked={variantChecked.ghost}
            onChange={() =>
              setVariantChecked({
                ...variantChecked,
                ghost: !variantChecked.ghost,
              })
            }
            variant="ghost"
            label={tCheckbox("labels.ghost")}
          />
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Basic Checkbox
<Checkbox
  checked={checked}
  onChange={() => setChecked(!checked)}
  label="Check me"
/>

// Indeterminate State
<Checkbox
  checked={indeterminate}
  onChange={() => setIndeterminate(!indeterminate)}
  indeterminate
  label="Partially selected"
/>

// Disabled State
<Checkbox
  checked={true}
  onChange={() => {}}
  disabled
  label="Disabled"
/>

// Size Variants
<Checkbox size="sm" checked={true} onChange={() => {}} label="Small" />
<Checkbox size="md" checked={true} onChange={() => {}} label="Medium" />
<Checkbox size="lg" checked={true} onChange={() => {}} label="Large" />

// Style Variants
<Checkbox variant="default" checked={true} onChange={() => {}} label="Default" />
<Checkbox variant="outline" checked={true} onChange={() => {}} label="Outline" />
<Checkbox variant="ghost" checked={true} onChange={() => {}} label="Ghost (no border)" />

// Multi-Select with Indeterminate
<Checkbox
  checked={allItemsChecked}
  onChange={handleSelectAll}
  indeterminate={someItemsChecked}
  label="Select All"
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
