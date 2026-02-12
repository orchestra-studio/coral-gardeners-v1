"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

import { DateRangeOverlay } from "./components/DateRangeOverlay";
import { DateRangeTrigger } from "./components/DateRangeTrigger";
import { useDateRangePicker } from "./hooks/useDateRangePicker";
import type { DateRangePickerProps } from "./types";

export function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date range",
  size = "default",
  variant = "outline",
  translations,
  id,
  renderMonthLabel,
}: DateRangePickerProps) {
  const {
    activePresetId,
    buttonLabel,
    isMobile,
    presetOptions,
    selectedDayCount,
    selectedRange,
    translations: mergedTranslations,
    handleDateSelect,
    handlePresetSelect,
  } = useDateRangePicker({
    date,
    onDateChange,
    placeholder,
    translations,
  });
  const [open, setOpen] = React.useState(false);

  const closeOverlay = React.useCallback(() => setOpen(false), []);

  // Generate unique ID for accessibility
  const generatedId = React.useId();
  const componentId = id || generatedId;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <DateRangeTrigger
            id={componentId}
            isOpen={open}
            label={buttonLabel}
            size={size}
            variant={variant}
            aria-label={placeholder}
            aria-haspopup="dialog"
            aria-expanded={open}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-[999999]"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(e) => {
              // Prevent auto-focus to allow custom focus management
              e.preventDefault();
            }}
          >
            <DateRangeOverlay
              activePresetId={activePresetId}
              isMobile={isMobile}
              isOpen={open}
              presetOptions={presetOptions}
              selectedDayCount={selectedDayCount}
              selectedRange={selectedRange}
              size={size}
              translations={mergedTranslations}
              onApply={closeOverlay}
              onCancel={closeOverlay}
              onClose={closeOverlay}
              onDateSelect={(range) => {
                handleDateSelect(range);
                if (size === "small") {
                  closeOverlay();
                }
              }}
              onPresetSelect={handlePresetSelect}
              renderMonthLabel={renderMonthLabel}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
