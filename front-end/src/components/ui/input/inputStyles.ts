import { cn } from "@/lib/utils";

/**
 * Shared input base styles used across Input, Select, TextArea, etc.
 * Centralizes all input styling for consistent borders, backgrounds, focus states, etc.
 */
export const getInputBaseStyles = (error?: string, hasIcon?: { start?: boolean; end?: boolean }) => {
    return cn(
        // Base input styles using theme variables with fallbacks
        "flex h-10 w-full rounded-md border",
        "bg-[var(--input-bg)]",
        "border-[var(--input-border)]/30",
        "text-[var(--text)]",
        "placeholder:text-[var(--text-muted)]",
        "text-sm px-3 py-2 focus:outline-none",
        "focus:border-[var(--primaryColor)]",
        "focus:ring-[var(--primaryColor)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:bg-[var(--surface-hover)]",
        // Icon padding (logical properties for RTL support)
        hasIcon?.start && "ps-10", // padding-inline-start
        hasIcon?.end && "pe-10", // padding-inline-end
        // Error state
        error && [
            "border-[var(--errorColor)]",
            "focus:ring-1 focus:ring-[var(--errorColor)]",
        ]
    );
};

/**
 * Base container styles for input wrappers
 */
export const getInputContainerStyles = (className?: string) => {
    return cn("w-full", className);
};

/**
 * Label styles for input labels
 */
export const getInputLabelStyles = () => {
    return "block text-sm font-medium text-[var(--text)] mb-2";
};

/**
 * Error message styles
 */
export const getInputErrorStyles = () => {
    return "mt-1 text-sm text-[var(--errorColor)]";
};
