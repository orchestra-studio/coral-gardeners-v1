export type TextUIPart = {
    type: "text" | "text-delta";
    text?: string;
    delta?: string;
    state?: "streaming" | "done";
};

export type ReasoningUIPart = {
    type: "reasoning";
    text?: string;
    state?: "streaming" | "done";
};

export const isTextPart = (part: { type: string }): part is TextUIPart =>
    (part.type === "text" || part.type === "text-delta") &&
    (typeof (part as { text?: unknown }).text === "string" || typeof (part as { delta?: unknown }).delta === "string");

export const isReasoningPart = (part: { type: string }): part is ReasoningUIPart =>
    part.type === "reasoning";
