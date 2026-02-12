import { TimePeriod } from "../types";

/**
 * Simple hash function to convert seed string to a number
 */
export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Determine time period based on hour
 */
export function getTimePeriod(hour: number): TimePeriod {
    if (hour >= 5 && hour < 12) {
        return "morning"; // 5am - 11:59am
    } else if (hour >= 12 && hour < 18) {
        return "afternoon"; // 12pm - 5:59pm
    } else {
        return "evening"; // 6pm - 4:59am
    }
}

/**
 * Generate date seed for consistent greeting selection
 */
export function generateDateSeed(date: Date, timePeriod: TimePeriod): string {
    const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return `${dateString}-${timePeriod}`;
}

/**
 * Select a consistent greeting message based on available messages and date
 */
export function selectGreeting(messages: string[], seed: string): string {
    const hash = hashString(seed);
    const index = Math.abs(hash) % messages.length;
    return messages[index];
}
