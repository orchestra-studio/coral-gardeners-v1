import * as React from "react";
import {
    differenceInCalendarDays,
    format,
    isSameDay,
} from "date-fns";
import type { DateRange } from "react-day-picker";

import { DEFAULT_TRANSLATIONS, PRESET_CONFIG } from "../constants";
import type {
    PresetId,
    PresetOption,
    UseDateRangePickerOptions,
    UseDateRangePickerResult,
} from "../types";

function formatDisplayRange(
    range: DateRange | undefined,
    fallback: string
): string {
    if (!range?.from) return fallback;
    if (!range.to) return format(range.from, "LLL dd, y");
    if (isSameDay(range.from, range.to)) {
        return format(range.from, "LLL dd, y");
    }
    return `${format(range.from, "LLL dd")} - ${format(range.to, "LLL dd, y")}`;
}

function rangesAreEqual(a?: DateRange, b?: DateRange): boolean {
    if (!a?.from || !a?.to || !b?.from || !b?.to) return false;
    return isSameDay(a.from, b.from) && isSameDay(a.to, b.to);
}

export function useDateRangePicker({
    date,
    onDateChange,
    placeholder = "Pick a date range",
    translations,
}: UseDateRangePickerOptions): UseDateRangePickerResult {
    const mergedTranslations = React.useMemo(
        () => ({ ...DEFAULT_TRANSLATIONS, ...translations }),
        [translations]
    );

    const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(
        () => {
            if (date) return date;
            const thisMonthPreset = PRESET_CONFIG.find(
                (config) => config.id === "thisMonth"
            );
            return thisMonthPreset?.getValue({}) ?? undefined;
        }
    );

    React.useEffect(() => {
        if (date === undefined) return;
        setSelectedRange(date);
    }, [date]);

    const [activePresetId, setActivePresetId] = React.useState<PresetId>(
        "thisMonth"
    );

    React.useEffect(() => {
        if (!selectedRange?.from || !selectedRange?.to) {
            setActivePresetId("custom");
            return;
        }

        const matchingPreset = PRESET_CONFIG.find((config) => {
            if (config.id === "custom") return false;
            const expectedRange = config.getValue({ selectedRange });
            return rangesAreEqual(expectedRange, selectedRange);
        });

        setActivePresetId(matchingPreset?.id ?? "custom");
    }, [selectedRange]);

    const presetOptions = React.useMemo<PresetOption[]>(() => {
        return PRESET_CONFIG.map((config) => ({
            id: config.id,
            label: mergedTranslations[config.translationKey],
            range: config.getValue({ selectedRange }),
        }));
    }, [mergedTranslations, selectedRange]);

    const handlePresetSelect = React.useCallback(
        (id: PresetId) => {
            const config = PRESET_CONFIG.find((preset) => preset.id === id);
            if (!config) return;
            const range = config.getValue({ selectedRange });
            setSelectedRange(range);
            onDateChange?.(range);
            setActivePresetId(id);
        },
        [onDateChange, selectedRange]
    );

    const handleDateSelect = React.useCallback(
        (range: DateRange | undefined) => {
            setSelectedRange(range);
            onDateChange?.(range);
            setActivePresetId("custom");
        },
        [onDateChange]
    );

    const buttonLabel = React.useMemo(() => {
        if (!selectedRange?.from || !selectedRange?.to) return placeholder;

        const presetMatch = presetOptions.find((option) => {
            if (option.id === "custom") return false;
            return rangesAreEqual(option.range, selectedRange);
        });

        if (presetMatch) return presetMatch.label;

        return formatDisplayRange(selectedRange, placeholder);
    }, [placeholder, presetOptions, selectedRange]);

    const selectedDayCount = React.useMemo(() => {
        if (!selectedRange?.from || !selectedRange?.to) return 0;
        return differenceInCalendarDays(selectedRange.to, selectedRange.from) + 1;
    }, [selectedRange]);

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(mediaQuery.matches);
        update();
        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    return {
        activePresetId,
        buttonLabel,
        isMobile,
        presetOptions,
        selectedDayCount,
        selectedRange,
        translations: mergedTranslations,
        handleDateSelect,
        handlePresetSelect,
    };
}
