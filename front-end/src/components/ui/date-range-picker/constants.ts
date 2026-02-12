import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";

import type {
    PresetOptionConfig,
    DateRangePickerTranslations,
} from "./types";

export const DEFAULT_TRANSLATIONS: Required<DateRangePickerTranslations> = {
    custom: "Custom",
    today: "Today",
    yesterday: "Yesterday",
    last7Days: "Last 7 days",
    last28Days: "Last 28 days",
    last30Days: "Last 30 days",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    quickSelect: "Quick Select",
    from: "From",
    to: "To",
    selectDate: "Select date",
    daysSelected: "days selected",
    cancel: "Cancel",
    apply: "Apply",
    previousMonth: "Previous month",
    nextMonth: "Next month",
};

export const PRESET_CONFIG: PresetOptionConfig[] = [
    {
        id: "custom",
        translationKey: "custom",
        getValue: ({ selectedRange }) => {
            if (selectedRange?.from && selectedRange?.to) {
                return selectedRange;
            }
            const today = new Date();
            return { from: today, to: today } satisfies DateRange;
        },
    },
    {
        id: "today",
        translationKey: "today",
        getValue: () => {
            const today = new Date();
            return { from: today, to: today } satisfies DateRange;
        },
    },
    {
        id: "yesterday",
        translationKey: "yesterday",
        getValue: () => {
            const yesterday = subDays(new Date(), 1);
            return { from: yesterday, to: yesterday } satisfies DateRange;
        },
    },
    {
        id: "last7Days",
        translationKey: "last7Days",
        getValue: () => {
            const today = new Date();
            return { from: subDays(today, 6), to: today } satisfies DateRange;
        },
    },
    {
        id: "last28Days",
        translationKey: "last28Days",
        getValue: () => {
            const today = new Date();
            return { from: subDays(today, 27), to: today } satisfies DateRange;
        },
    },
    {
        id: "last30Days",
        translationKey: "last30Days",
        getValue: () => {
            const today = new Date();
            return { from: subDays(today, 29), to: today } satisfies DateRange;
        },
    },
    {
        id: "thisMonth",
        translationKey: "thisMonth",
        getValue: () => {
            const today = new Date();
            return { from: startOfMonth(today), to: endOfMonth(today) } satisfies DateRange;
        },
    },
    {
        id: "lastMonth",
        translationKey: "lastMonth",
        getValue: () => {
            const last = subMonths(new Date(), 1);
            return { from: startOfMonth(last), to: endOfMonth(last) } satisfies DateRange;
        },
    },
];
