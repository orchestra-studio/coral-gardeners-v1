export type DateInput = string | number | Date | null | undefined;

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
};

const DEFAULT_FALLBACK = "";

const isValidDate = (value: Date): boolean => !Number.isNaN(value.getTime());

export const toDate = (value: DateInput): Date | null => {
    if (value instanceof Date) {
        return isValidDate(value) ? value : null;
    }
    if (value === null || value === undefined) {
        return null;
    }
    const date = new Date(value);
    return isValidDate(date) ? date : null;
};

const resolveLocale = (locale: string): string => {
    if (!locale) return "en";

    const normalized = locale.toLowerCase();
    if (normalized === "ar") {
        return "ar-DZ"; // Algerian Arabic for more natural date ordering
    }

    return locale;
};

export const createDateFormatter = (
    locale: string,
    options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): Intl.DateTimeFormat => {
    const resolvedLocale = resolveLocale(locale);
    try {
        return new Intl.DateTimeFormat(resolvedLocale, options);
    } catch {
        return new Intl.DateTimeFormat("en", options);
    }
};

export const formatWithFormatter = (
    value: DateInput,
    formatter: Intl.DateTimeFormat,
    fallback: string = DEFAULT_FALLBACK
): string => {
    const date = toDate(value);
    if (!date) return fallback;
    try {
        return formatter.format(date);
    } catch {
        return fallback;
    }
};

export const formatDate = (
    value: DateInput,
    locale: string,
    options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
    fallback: string = DEFAULT_FALLBACK
): string => {
    const formatter = createDateFormatter(locale, options);
    return formatWithFormatter(value, formatter, fallback);
};

