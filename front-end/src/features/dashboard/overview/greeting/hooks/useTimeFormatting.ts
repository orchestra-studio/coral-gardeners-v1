import { useMemo } from "react";

interface TimeFormatting {
    formattedTime: string;
    formattedDate: string;
}

/**
 * Hook to format current time and date based on locale
 */
export function useTimeFormatting(
    currentTime: Date,
    locale: string
): TimeFormatting {
    const formattedTime = useMemo(() => {
        return currentTime.toLocaleTimeString(locale === "ar" ? "ar-DZ" : "en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }, [currentTime, locale]);

    const formattedDate = useMemo(() => {
        return currentTime.toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [currentTime, locale]);

    return { formattedTime, formattedDate };
}
