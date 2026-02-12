import type { ToolMessageBlock } from "@/types/ai-chat";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export const toChartBlock = (raw: unknown): ToolMessageBlock | null => {
    if (!isRecord(raw)) {
        return null;
    }

    const dataRaw = Array.isArray(raw.data) ? raw.data : [];
    const data: Array<Record<string, string | number>> = dataRaw
        .filter(isRecord)
        .map((entry) => {
            const result: Record<string, string | number> = {};
            Object.entries(entry).forEach(([key, value]) => {
                if (typeof value === "string" || typeof value === "number") {
                    result[key] = value;
                }
            });
            return result;
        })
        .filter((entry) => Object.keys(entry).length > 0);

    if (data.length === 0) {
        return null;
    }

    const seriesRaw = Array.isArray(raw.series) ? raw.series : [];
    const series = seriesRaw
        .filter(isRecord)
        .map((entry) => {
            const dataKey = typeof entry.dataKey === "string" ? entry.dataKey : undefined;
            if (!dataKey) {
                return null;
            }
            let typeValue: "line" | "bar" | undefined;
            if (entry.type === "bar" || entry.type === "line") {
                typeValue = entry.type;
            }
            return {
                dataKey,
                name: typeof entry.name === "string" ? entry.name : undefined,
                color: typeof entry.color === "string" ? entry.color : undefined,
                type: typeValue,
            };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (series.length === 0) {
        return null;
    }

    const chartKindRaw = typeof raw.kind === "string" ? raw.kind : typeof raw.chartKind === "string" ? raw.chartKind : undefined;
    const chartKind = chartKindRaw === "bar" ? "bar" : "line";
    const xKey = typeof raw.xKey === "string" ? raw.xKey : typeof raw.xAxisKey === "string" ? raw.xAxisKey : "month";

    return {
        type: "chart",
        title: typeof raw.title === "string" ? raw.title : undefined,
        description: typeof raw.description === "string" ? raw.description : undefined,
        chartKind,
        data,
        series,
        xKey,
        height: typeof raw.height === "number" ? raw.height : undefined,
        showLegend: typeof raw.showLegend === "boolean" ? raw.showLegend : undefined,
        showGrid: typeof raw.showGrid === "boolean" ? raw.showGrid : undefined,
    };
};

export const extractChartBlocks = (content: string): { cleanedText: string; blocks: ToolMessageBlock[] } => {
    if (!content.includes("```chart")) {
        return { cleanedText: content, blocks: [] };
    }

    const blocks: ToolMessageBlock[] = [];
    let match: RegExpExecArray | null;
    const parser = /```chart\s*([\s\S]*?)```/gi;

    while ((match = parser.exec(content)) !== null) {
        const jsonPayload = match[1]?.trim();
        if (!jsonPayload) {
            continue;
        }

        try {
            const parsed = JSON.parse(jsonPayload);
            const block = toChartBlock(parsed);
            if (block) {
                blocks.push(block);
            }
        } catch {
            continue;
        }
    }

    // Remove chart markers and chart blocks, preserve text before and after
    const cleanedText = content
        // Remove [CHART_START]...[CHART_END] sections
        .replace(/\[CHART_START\][\s\S]*?\[CHART_END\]/gi, "\n\n")
        // Remove remaining ```chart``` blocks (fallback)
        .replace(/```chart\s*([\s\S]*?)```/gi, "\n\n")
        // Normalize whitespace
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ ]{2,}/g, " ")
        .trim();

    return { cleanedText, blocks };
};
