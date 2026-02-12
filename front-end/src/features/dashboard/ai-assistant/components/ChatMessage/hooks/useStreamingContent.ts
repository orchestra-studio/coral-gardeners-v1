export function useStreamingContent(
    messageContent: string,
) {
    // Process content - no filtering needed as backend handles chart interception
    const displayContent = typeof messageContent === "string" ? messageContent : "";
    const cleanedContent = typeof displayContent === "string" ? displayContent.trim() : "";

    return {
        displayContent,
        cleanedContent,
    };
}
