import type { TextUIPart } from "./message-types";

export const aggregateTextParts = (parts: TextUIPart[]) => {
    let content = "";
    let seenFinal = false;
    let seenStreamingState = false;
    let chartMarkerEncountered = false;

    parts.forEach((part) => {
        if (part.state === "streaming") {
            seenStreamingState = true;
        }

        if (part.type === "text-delta") {
            if (!seenFinal && !chartMarkerEncountered) {
                const delta = part.delta ?? "";

                // Check if this delta or accumulated content contains chart markers
                const testContent = content + delta;

                // Look for chart markers - check the FULL accumulated content
                let cutoffIdx = -1;

                // Check for [CHART_START] marker
                const chartStartIdx = testContent.indexOf("[CHART_START]");
                if (chartStartIdx !== -1) {
                    cutoffIdx = chartStartIdx;
                }

                // Also check for ```chart code fence
                if (cutoffIdx === -1) {
                    const chartCodeIdx = testContent.indexOf("```chart");
                    if (chartCodeIdx !== -1) {
                        cutoffIdx = chartCodeIdx;
                    }
                }

                // Also check for standalone code fence after intro (common pattern)
                if (cutoffIdx === -1) {
                    // Match pattern: intro text followed by newlines and code fence
                    const fenceMatch = testContent.match(/\n\n+```/);
                    if (fenceMatch && fenceMatch.index !== undefined) {
                        // Check if there's likely a chart coming
                        const beforeFence = testContent.slice(0, fenceMatch.index);
                        if (beforeFence.toLowerCase().includes("chart") ||
                            beforeFence.toLowerCase().includes("trend") ||
                            beforeFence.toLowerCase().includes("graph")) {
                            cutoffIdx = fenceMatch.index + fenceMatch[0].length - 3; // Keep newlines, cut before ```
                        }
                    }
                }

                if (cutoffIdx !== -1) {
                    // Only add content up to the cutoff point
                    const remaining = content.length;
                    const needed = cutoffIdx - remaining;
                    if (needed > 0) {
                        content += delta.slice(0, needed);
                    }
                    chartMarkerEncountered = true;
                } else {
                    content += delta;
                }

                seenStreamingState = true;
            }
            return;
        }

        if (part.type === "text") {
            const text = part.text ?? "";
            if (!seenFinal || text.length > 0) {
                content = text;
            }
            seenFinal = true;
        }
    });

    return {
        content,
        isStreaming: !seenFinal && (seenStreamingState || parts.some((part) => part.type === "text-delta")),
    };
};
