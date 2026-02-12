"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function CalendarDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DemoCard
      title={t("components.calendar.title")}
      description={t("components.calendar.description")}
    >
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border border-[var(--border)]"
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
