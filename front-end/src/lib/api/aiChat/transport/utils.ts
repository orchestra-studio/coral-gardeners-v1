/**
 * Utility functions for chat transport
 */

/**
 * Generate a random message ID
 */
export const getRandomId = (): string =>
    typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `msg_${Math.random().toString(36).slice(2)}`;

/**
 * Parse JSON args safely
 */
export const parseArgs = (value: string): unknown => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

/**
 * Extract data payload from SSE event block
 */
export const extractDataPayload = (eventBlock: string): string | null => {
    const dataLines = eventBlock
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart());

    if (!dataLines.length) {
        return null;
    }

    return dataLines.join("\n");
};
