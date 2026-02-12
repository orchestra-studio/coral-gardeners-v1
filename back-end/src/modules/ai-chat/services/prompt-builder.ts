import {
    buildBasePrompt,
    buildCapabilitiesPrompt,
    buildChartGuidance,
    buildStatsGuidance,
    buildUserManagementGuidance,
    buildToolsList,
} from './system-prompts';

/**
 * System Prompt Builder
 * Constructs intelligent system prompts with tool documentation
 */
export class PromptBuilder {
    /**
     * Build tools documentation section
     */
    private buildToolsDocumentation(tools: any[]): string {
        const toolsList = buildToolsList(tools);

        const chartTool = tools.find((tool) => tool.name === 'display-chart-to-user');
        const statsTool = tools.find((tool) => tool.name === 'get-user-statistics');

        const chartGuidance = buildChartGuidance(chartTool);
        const statsGuidance = buildStatsGuidance(statsTool);
        const userManagementGuidance = buildUserManagementGuidance(tools);

        return `YOUR AVAILABLE TOOLS:

${toolsList}

🚨 CRITICAL TOOL SELECTION RULES:${chartGuidance}${statsGuidance}${userManagementGuidance}`.trim();
    }

    /**
     * Build the complete system prompt
     */
    buildSystemPrompt(tools: any[], userName?: string, todayDate?: string): string {
        const basePrompt = buildBasePrompt(userName, todayDate);
        const capabilities = buildCapabilitiesPrompt();

        if (tools.length === 0) {
            return `${basePrompt}\n\n${capabilities}`;
        }

        const toolsDoc = this.buildToolsDocumentation(tools);
        return `${basePrompt}\n\n${capabilities}\n\n${toolsDoc}`;
    }
}
