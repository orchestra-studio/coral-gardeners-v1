/**
 * Message formatting utilities
 */

/**
 * Tool name to user-friendly message mapping
 */
const TOOL_LABELS: Record<string, string> = {
    "chart-user-registrations": "Generating registration chart...",
    "get-user-statistics": "Fetching user statistics...",
    "get-recent-users": "Loading recent users...",
    "search-users": "Searching users...",
};

/**
 * Format thinking/reasoning message
 */
export const formatThinkingMessage = (): string => "thinking...";

/**
 * Format tool use message with friendly label
 */
export const formatToolUseMessage = (toolName: string): string => {
    return TOOL_LABELS[toolName] || `Using tool: ${toolName}...`;
};
