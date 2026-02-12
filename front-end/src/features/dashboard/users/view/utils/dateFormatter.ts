import { useCallback } from "react";
import { useLocaleDateFormatter } from "@/hooks/formatting/useLocaleDateFormatter";

const USER_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};

export function useDateTimeFormatter() {
    const { formatDate } = useLocaleDateFormatter({
        options: USER_DATE_TIME_OPTIONS,
    });

    const formatDateTime = useCallback(
        (value: string | null, notProvidedText: string) => {
            if (!value) {
                return notProvidedText;
            }
            const result = formatDate(value);
            return result || notProvidedText;
        },
        [formatDate]
    );

    return { formatDateTime };
}