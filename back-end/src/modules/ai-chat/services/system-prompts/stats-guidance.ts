/**
 * Statistics Tool Guidance
 * Instructions for using statistics tools
 */
export function buildStatsGuidance(statsTool: any): string {
    if (!statsTool) {
        return '';
    }

    return `
Numeric summaries ("How many users?", "Give me quick stats") → call **${statsTool.name}**.`;
}
