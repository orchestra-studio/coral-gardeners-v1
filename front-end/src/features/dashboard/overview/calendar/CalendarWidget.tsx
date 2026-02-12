"use client";

import React, { useState } from "react";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { Calendar } from "@/components/ui/calendar";
import { useLocalizedCalendar } from "./data";

export default function CalendarWidget() {
  const { translations } = useLocalizedCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <WidgetCard
      className="w-full min-h-[360px] flex flex-col p-4"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={translations.header.title}
        description={
          selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : translations.header.selectDate
        }
      />

      <div className="flex-1 mt-4 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md w-full max-w-xs [--cell-size:2.4rem]"
        />
      </div>
    </WidgetCard>
  );
}
