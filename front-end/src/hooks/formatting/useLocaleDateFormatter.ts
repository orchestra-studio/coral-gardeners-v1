"use client";

import { useMemo, useCallback } from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import {
    createDateFormatter,
    formatWithFormatter,
    type DateInput,
} from "@/lib/formatters/date";

export interface UseLocaleDateFormatterOptions {
    options?: Intl.DateTimeFormatOptions;
    fallback?: string;
}

export const useLocaleDateFormatter = (
    { options, fallback = "" }: UseLocaleDateFormatterOptions = {}
) => {
    const locale = useLocale();
    const optionsKey = useMemo(
        () => JSON.stringify(options ?? null),
        [options]
    );

    const formatter = useMemo(() => {
        try {
            const parsed = JSON.parse(optionsKey);
            const resolvedOptions = parsed === null ? undefined : (parsed as Intl.DateTimeFormatOptions);
            return createDateFormatter(locale, resolvedOptions);
        } catch {
            return createDateFormatter(locale, options);
        }
    }, [locale, optionsKey, options]);

    const formatDate = useCallback(
        (value: DateInput, overrideFallback?: string) =>
            formatWithFormatter(value, formatter, overrideFallback ?? fallback),
        [formatter, fallback]
    );

    return { formatDate, formatter };
};

export default useLocaleDateFormatter;
