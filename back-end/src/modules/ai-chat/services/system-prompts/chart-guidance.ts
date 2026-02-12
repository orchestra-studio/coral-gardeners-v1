/**
 * Chart Tool Guidance
 * Instructions for using chart visualization tools
 */
export function buildChartGuidance(chartTool: any): string {
    if (!chartTool) {
        return '';
    }

    return `
⚠️ CRITICAL CHART DISPLAY RULES:

**YOU MUST ALWAYS CALL ${chartTool.name} WHEN:**
1. User requests ANY chart/graph/trend/visualization
2. User asks to change chart color (e.g., "make it blue", "change to red", "paint it green")
3. User asks to change chart type (e.g., "make it a line chart", "convert to bar chart")
4. User asks to modify ANY chart property (legend, grid, period, count, height)
5. User says "update", "modify", or "change" ANYTHING about an existing chart

**WHY THIS IS ABSOLUTELY CRITICAL:**
• Charts do NOT automatically update - they ONLY appear when you call the tool
• Simply saying "I'll update the chart" or "The chart is now blue" does NOTHING to the UI
• The frontend ONLY receives new charts when you explicitly call ${chartTool.name}
• Without calling the tool, the user sees the OLD chart while you describe changes that DON'T EXIST
• This creates confusion and frustration - user thinks you're broken

**CORRECT WORKFLOW:**
User: "Show me daily registrations"
→ CALL ${chartTool.name}({ period: "daily", count: 7 })
→ Say: "Here's the daily registration chart for the last 7 days" (AFTER tool call)

User: "Make it blue"
→ CALL ${chartTool.name}({ period: "daily", count: 7, color: "#3B82F6" })
→ Say: "I've updated the chart with blue color" (AFTER tool call)

User: "Change to line chart"
→ CALL ${chartTool.name}({ period: "daily", count: 7, color: "#3B82F6", chartType: "line" })
→ Say: "I've converted it to a line chart" (AFTER tool call)

**NEVER DO THIS (INCORRECT):**
User: "Make it blue"
→ Respond: "I'll update the chart to blue for you" ❌ WRONG - NO TOOL CALLED!
→ Respond: "The chart is now blue" ❌ WRONG - CHART NOT ACTUALLY UPDATED!

**REMEMBER:**
• ALWAYS call the tool FIRST, then describe what you did
• Every chart modification = new tool call with updated parameters
• No exceptions - the tool is the ONLY way to display/update charts
• After calling the tool, provide a brief natural language summary of the chart data

**Common Chart Colors:**
• Blue: "#3B82F6"
• Red: "#EF4444"
• Green: "#10B981"
• Purple: "#8B5CF6"
• Orange: "#F59E0B"
• Pink: "#EC4899"

**Examples:**
  - "Show trend for last 7 days" → ${chartTool.name}({ period: "daily", count: 7 })
  - "Monthly chart for last 6 months" → ${chartTool.name}({ period: "monthly", count: 6 })
  - "Make it blue" → ${chartTool.name}({ period: "daily", count: 7, color: "#3B82F6" })
  - "Switch to line" → ${chartTool.name}({ period: "daily", count: 7, chartType: "line" })
  - "Red bar chart, last 10 days" → ${chartTool.name}({ period: "daily", count: 10, chartType: "bar", color: "#EF4444" })`;
}
