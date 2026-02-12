import { useMemo } from "react";
import { GreetingMessages } from "../types";
import {
    getTimePeriod,
    generateDateSeed,
    selectGreeting,
} from "../utils/greetingUtils";

/**
 * Hook to manage greeting message selection based on time of day
 * Returns a consistent greeting for the same day and time period
 */
export function useGreeting(
    currentTime: Date,
    greetingMessages: GreetingMessages
): string {
    return useMemo(() => {
        const hour = currentTime.getHours();
        const timePeriod = getTimePeriod(hour);
        const messages = greetingMessages[timePeriod];
        const seed = generateDateSeed(currentTime, timePeriod);

        return selectGreeting(messages, seed);
    }, [currentTime, greetingMessages]);
}
