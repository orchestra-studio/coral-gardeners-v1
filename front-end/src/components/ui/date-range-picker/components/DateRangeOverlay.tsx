"use client";

import * as React from "react";
import { addMonths, startOfMonth } from "date-fns";
import {
  XIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import type {
  DateRangePickerSize,
  PresetId,
  PresetOption,
  DateRangePickerTranslations,
} from "../types";
import type { DateRange } from "react-day-picker";

interface DateRangeOverlayProps {
  activePresetId: PresetId;
  isMobile: boolean;
  isOpen: boolean;
  presetOptions: PresetOption[];
  selectedDayCount: number;
  selectedRange: DateRange | undefined;
  size: DateRangePickerSize;
  translations: Required<DateRangePickerTranslations>;
  onApply: () => void;
  onCancel: () => void;
  onClose: () => void;
  onDateSelect: (range: DateRange | undefined) => void;
  onPresetSelect: (id: PresetId) => void;
  renderMonthLabel?: (
    month: Date,
    context: { displayIndex: number; monthsToDisplay: number }
  ) => React.ReactNode;
}

export function DateRangeOverlay({
  activePresetId,
  isMobile,
  isOpen,
  presetOptions,
  selectedDayCount,
  selectedRange,
  size,
  translations,
  onApply,
  onCancel,
  onClose,
  onDateSelect,
  onPresetSelect,
  renderMonthLabel,
}: DateRangeOverlayProps) {
  const isSmall = size === "small";
  const isMedium = size === "medium";
  const monthsToDisplay = isMedium || isMobile ? 1 : 2;

  const initialMonth = React.useMemo(() => {
    const base = selectedRange?.from ?? selectedRange?.to ?? new Date();
    return startOfMonth(base);
  }, [selectedRange?.from, selectedRange?.to]);

  const [currentMonth, setCurrentMonth] = React.useState(initialMonth);

  React.useEffect(() => {
    if (!isOpen) return;
    setCurrentMonth(initialMonth);
  }, [initialMonth, isOpen]);

  const goToPreviousMonth = React.useCallback(() => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, -1)));
  }, []);

  const goToNextMonth = React.useCallback(() => {
    setCurrentMonth((month) => startOfMonth(addMonths(month, 1)));
  }, []);

  const displayedMonths = React.useMemo(() => {
    return Array.from({ length: monthsToDisplay }, (_, index) =>
      startOfMonth(addMonths(currentMonth, index))
    );
  }, [currentMonth, monthsToDisplay]);

  if (!isOpen) return null;

  const handleSurfaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={translations.selectDate}
      className={cn(
        "relative flex w-full flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-xl",
        isMobile
          ? "h-full max-w-full rounded-none"
          : isSmall
          ? "max-w-md rounded-lg"
          : "max-w-5xl rounded-xl"
      )}
      onClick={handleSurfaceClick}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-hover)]/60 px-4 py-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {translations.selectDate}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-8 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          aria-label="Close date picker"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className={cn("flex-1 overflow-auto", isSmall ? "p-2" : "p-0")}>
        {isSmall ? (
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={(range) => {
                onDateSelect(range);
                onClose();
              }}
              numberOfMonths={1}
              className="bg-[var(--surface)] [&_button]:text-sm"
              showOutsideDays={false}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div
              className={cn(
                "border-b border-[var(--border)] bg-[var(--surface-hover)]/50 lg:w-52 lg:border-b-0 lg:border-r",
                isMedium && "lg:w-40",
                isMobile && "hidden"
              )}
            >
              <div className={cn("space-y-2 p-4", isMedium && "p-3")}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  {translations.quickSelect}
                </h4>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {presetOptions.map((preset) => {
                    const isActive = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onPresetSelect(preset.id)}
                        aria-pressed={isActive}
                        aria-label={`Select ${preset.label} date range`}
                        className={cn(
                          "w-full rounded-md border border-transparent px-3 py-2 text-start text-sm transition-all",
                          "hover:bg-[var(--surface-hover)] hover:text-[var(--text)]",
                          isMedium && "px-2 py-1.5 text-xs",
                          isActive
                            ? "bg-[var(--primaryColor)] text-[var(--background)] shadow-sm"
                            : "text-[var(--text-muted)]"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {!isMedium && !isMobile && (
                <div className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 px-4 py-3">
                  <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex-1">
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                        {translations.from}
                      </span>
                      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)]">
                        {selectedRange?.from
                          ? selectedRange.from.toLocaleDateString(undefined, {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : translations.selectDate}
                      </div>
                    </div>
                    <div className="flex  items-center justify-center mb-0 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-[2px] w-5 rounded-full bg-[var(--border)]" />
                        <ArrowRightIcon className="h-4 w-4 text-[var(--text-muted)] rtl:rotate-180" />
                        <div className="h-[2px] w-5 rounded-full bg-[var(--border)]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                        {translations.to}
                      </span>
                      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)]">
                        {selectedRange?.to
                          ? selectedRange.to.toLocaleDateString(undefined, {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : translations.selectDate}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2">
                <div className="flex items-center justify-between px-2 pb-2 pt-1">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-0"
                    aria-label={translations.previousMonth}
                  >
                    <ChevronLeftIcon className="h-4 w-4 rtl-nav-arrow rtl:rotate-180" />
                  </button>

                  <div className="flex flex-1 items-center justify-around gap-6 text-sm font-semibold text-[var(--text)]">
                    {displayedMonths.map((month, index) => (
                      <span
                        key={month.toISOString()}
                        className="min-w-[120px] text-center"
                      >
                        {renderMonthLabel
                          ? renderMonthLabel(month, {
                              displayIndex: index,
                              monthsToDisplay,
                            })
                          : month.toLocaleDateString(undefined, {
                              month: "long",
                              year: "numeric",
                            })}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-0"
                    aria-label={translations.nextMonth}
                  >
                    <ChevronRightIcon className="h-4 w-4 rtl-nav-arrow rtl:rotate-180" />
                  </button>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  month={currentMonth}
                  onMonthChange={(month) =>
                    setCurrentMonth(startOfMonth(month))
                  }
                  selected={selectedRange}
                  onSelect={onDateSelect}
                  numberOfMonths={monthsToDisplay}
                  className="bg-[var(--surface)] [&_button]:text-sm"
                  showMonthCaption={false}
                  showOutsideDays={false}
                />
              </div>

              <div
                className={cn(
                  "flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-hover)]/40",
                  isMedium ? "px-3 py-2" : "px-4 py-3"
                )}
              >
                <span className="text-xs text-[var(--text-muted)]">
                  {selectedDayCount > 0 && (
                    <>
                      {selectedDayCount} {translations.daysSelected}
                    </>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size={isMedium ? "sm" : "sm"}
                    onClick={() => {
                      onCancel();
                      onClose();
                    }}
                    className="px-4 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {translations.cancel}
                  </Button>
                  <Button
                    size={isMedium ? "sm" : "sm"}
                    onClick={() => {
                      onApply();
                      onClose();
                    }}
                    className="bg-[var(--primaryColor)] px-4 text-[var(--background)] hover:bg-[var(--primaryColor)]/90"
                  >
                    {translations.apply}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
