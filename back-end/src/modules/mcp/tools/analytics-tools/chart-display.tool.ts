import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../../../users/users.service';

/**
 * Chart Display Tool
 * Displays user registration charts with customizable options
 */
@Injectable()
export class ChartDisplayTool {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Tool({
        name: 'display-chart-to-user',
        description: '🚨 CRITICAL: This tool MUST be called to display/update charts in the UI. ALWAYS call this tool when: (1) User requests ANY chart/graph/visualization, (2) User asks to change color ("make it blue/red/green" → CALL THIS TOOL with new color), (3) User asks to change chart type ("make it line/bar" → CALL THIS TOOL with new chartType), (4) User asks to modify ANY chart property. ⚠️ NEVER just say "I will update" - you MUST actually call this tool or the chart will NOT change! Shows user registration charts with customizable colors, bar/line types, daily/monthly periods.',
        parameters: z.object({
            period: z.enum(['daily', 'monthly']).describe('Time granularity: "daily" for days, "monthly" for months'),
            count: z.number().min(1).max(90).default(7).describe('Number of periods to include. For daily: 1-90 days. For monthly: 1-24 months.'),
            chartType: z.enum(['bar', 'line']).optional().describe('Type of chart: "bar" for bar chart, "line" for line chart. If not specified, defaults to bar for daily and line for monthly.'),
            color: z.string().optional().describe('Primary color for the chart in hex format (e.g., "#3B82F6" for blue, "#EF4444" for red, "#10B981" for green). If not specified, uses default colors.'),
            showLegend: z.boolean().optional().default(true).describe('Whether to show the chart legend'),
            showGrid: z.boolean().optional().default(true).describe('Whether to show grid lines'),
        }),
    })
    async displayChartToUser({ period, count, chartType, color, showLegend = true, showGrid = true }) {
        try {
            if (period === 'daily') {
                return await this.generateDailyChart(count, chartType, color, showLegend, showGrid);
            } else {
                return await this.generateMonthlyChart(count, chartType, color, showLegend, showGrid);
            }
        } catch (error) {
            return {
                success: false,
                message: `Failed to generate user registrations chart: ${error.message}`,
            };
        }
    }

    private async generateDailyChart(
        count: number,
        chartType?: string,
        color?: string,
        showLegend?: boolean,
        showGrid?: boolean,
    ) {
        const safeDays = Math.min(Math.max(Math.floor(count ?? 7), 1), 90);
        const trend = await this.usersService.getDailyRegistrationTrend(safeDays);

        const total = trend.reduce((acc, point) => acc + point.count, 0);
        const latest = trend[trend.length - 1]?.count ?? 0;
        const previous = trend[trend.length - 2]?.count ?? 0;
        const change = previous === 0
            ? (latest > 0 ? 100 : 0)
            : Math.round(((latest - previous) / previous) * 100);
        const average = trend.length > 0 ? Math.round(total / trend.length) : 0;

        const chartData = trend.map(point => ({
            date: point.label,
            registrations: point.count,
        }));

        const finalChartType = chartType || 'bar';
        const finalColor = color || '#10B981'; // Default green

        const chartSpec = {
            title: `Daily user registrations (last ${safeDays} days)`,
            kind: finalChartType,
            xKey: 'date',
            series: [
                {
                    dataKey: 'registrations',
                    name: 'Registrations',
                    color: finalColor,
                },
            ],
            data: chartData,
            description: `Daily new user registrations for the previous ${safeDays} days.`,
            showLegend,
            showGrid,
        };

        // Build summary for LLM
        const topDays = [...trend]
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(d => `${d.count} users on ${d.label}`)
            .join(', ');

        const llmSummary = {
            success: true,
            message: `Chart successfully displayed to user showing daily registrations for the last ${safeDays} days. Summary: Total ${total} registrations, average ${average} per day. Latest: ${latest} registrations, previous: ${previous} registrations (${change > 0 ? '+' : ''}${change}% change). Top registration days: ${topDays}.`,
        };

        return {
            success: true,
            period: 'daily',
            count: safeDays,
            totalRegistrations: total,
            latest,
            previous,
            changePercentage: change,
            average,
            trend,
            chart: chartSpec,
            chartMarkdown: `\`\`\`chart\n${JSON.stringify(chartSpec, null, 2)}\n\`\`\``,
            llmSummary,
        };
    }

    private async generateMonthlyChart(
        count: number,
        chartType?: string,
        color?: string,
        showLegend?: boolean,
        showGrid?: boolean,
    ) {
        const safeMonths = Math.min(Math.max(Math.floor(count ?? 6), 1), 24);
        const trend = await this.usersService.getRegistrationTrend(safeMonths);

        const total = trend.reduce((acc, point) => acc + point.count, 0);
        const latest = trend[trend.length - 1]?.count ?? 0;
        const previous = trend[trend.length - 2]?.count ?? 0;
        const change = previous === 0
            ? (latest > 0 ? 100 : 0)
            : Math.round(((latest - previous) / previous) * 100);
        const average = trend.length > 0 ? Math.round(total / trend.length) : 0;

        const chartData = trend.map(point => ({
            month: point.label,
            registrations: point.count,
        }));

        const finalChartType = chartType || 'line';
        const finalColor = color || '#6366F1'; // Default indigo

        const chartSpec = {
            title: `Monthly user registrations (last ${safeMonths} months)`,
            kind: finalChartType,
            xKey: 'month',
            series: [
                {
                    dataKey: 'registrations',
                    name: 'Registrations',
                    color: finalColor,
                },
            ],
            data: chartData,
            description: `Monthly new user registrations for the previous ${safeMonths} months.`,
            showLegend,
            showGrid,
        };

        // Build summary for LLM
        const topMonths = [...trend]
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(d => `${d.count} users in ${d.label}`)
            .join(', ');

        const llmSummary = {
            success: true,
            message: `Chart successfully displayed to user showing monthly registrations for the last ${safeMonths} months. Summary: Total ${total} registrations, average ${average} per month. Latest: ${latest} registrations, previous: ${previous} registrations (${change > 0 ? '+' : ''}${change}% change). Top registration months: ${topMonths}.`,
        };

        return {
            success: true,
            period: 'monthly',
            count: safeMonths,
            totalRegistrations: total,
            latest,
            previous,
            changePercentage: change,
            average,
            trend,
            chart: chartSpec,
            chartMarkdown: `\`\`\`chart\n${JSON.stringify(chartSpec, null, 2)}\n\`\`\``,
            llmSummary,
        };
    }
}
