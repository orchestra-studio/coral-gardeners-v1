"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DateRangePicker } from "@/components/ui/date-range-picker/DateRangePicker";
import { DateRange } from "react-day-picker";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function DatePickerDemo() {
  const t = useTranslations("dashboard/ui-component");
  const tCommon = useTranslations("common.DateRange");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <DemoCard
      title={t("components.datePicker.title")}
      description={t("components.datePicker.description")}
    >
      <DateRangePicker
        placeholder={t("components.datePicker.placeholders.selectRange")}
        date={dateRange}
        onDateChange={setDateRange}
        className="max-w-xs m-auto"
        translations={{
          custom: tCommon("custom"),
          today: tCommon("today"),
          yesterday: tCommon("yesterday"),
          last7Days: tCommon("last7Days"),
          last28Days: tCommon("last28Days"),
          last30Days: tCommon("last30Days"),
          thisMonth: tCommon("thisMonth"),
          lastMonth: tCommon("lastMonth"),
          quickSelect: tCommon("quickSelect"),
          from: tCommon("from"),
          to: tCommon("to"),
          selectDate: tCommon("selectDate"),
          daysSelected: tCommon("daysSelected"),
          cancel: tCommon("cancel"),
          apply: tCommon("apply"),
        }}
      />

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [dateRange, setDateRange] = useState<DateRange | undefined>();

<DateRangePicker
  placeholder="Select date range..."
  date={dateRange}
  onDateChange={setDateRange}
  translations={{
    custom: "Custom",
    today: "Today",
    yesterday: "Yesterday",
    last7Days: "Last 7 Days",
    // ... more translations
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
