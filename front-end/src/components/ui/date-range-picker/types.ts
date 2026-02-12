import type { ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export type DateRangePickerSize = "small" | "medium" | "default";

export interface DateRangePickerTranslations {
    custom?: string;
    today?: string;
    yesterday?: string;
    last7Days?: string;
    last28Days?: string;
    last30Days?: string;
    thisMonth?: string;
    lastMonth?: string;
    quickSelect?: string;
    from?: string;
    to?: string;
    selectDate?: string;
    daysSelected?: string;
    cancel?: string;
    apply?: string;
    previousMonth?: string;
    nextMonth?: string;
}

export interface DateRangePickerProps {
    className?: string;
    date?: DateRange;
    onDateChange?: (date: DateRange | undefined) => void;
    placeholder?: string;
    size?: DateRangePickerSize;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    translations?: DateRangePickerTranslations;
    id?: string; // Optional ID for accessibility
    renderMonthLabel?: (
        month: Date,
        context: { displayIndex: number; monthsToDisplay: number }
    ) => ReactNode;
}

export type PresetId =
    | "custom"
    | "today"
    | "yesterday"
    | "last7Days"
    | "last28Days"
    | "last30Days"
    | "thisMonth"
    | "lastMonth";

export interface PresetOptionConfig {
    id: PresetId;
    translationKey: keyof Required<DateRangePickerTranslations>;
    getValue: (context: { selectedRange?: DateRange }) => DateRange;
}

export interface PresetOption {
    id: PresetId;
    label: string;
    range: DateRange;
}

export interface UseDateRangePickerOptions {
    date?: DateRange;
    onDateChange?: (date: DateRange | undefined) => void;
    placeholder?: string;
    translations?: DateRangePickerTranslations;
}

export interface UseDateRangePickerResult {
    activePresetId: PresetId;
    buttonLabel: string;
    isMobile: boolean;
    presetOptions: PresetOption[];
    selectedDayCount: number;
    selectedRange: DateRange | undefined;
    translations: Required<DateRangePickerTranslations>;
    handleDateSelect: (range: DateRange | undefined) => void;
    handlePresetSelect: (id: PresetId) => void;
}
