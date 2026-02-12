import { RevenueChartDataPoint } from "../hooks";

export const formatXAxis = (value: string | number): string => {
    return String(value).split(" ")[0];
};

export const formatYAxis = (value: string | number): string => {
    return `$${Number(value) / 1000}k`;
};

export const createTooltipFormatter = (
    chartData: RevenueChartDataPoint[],
    translations: {
        revenue: string;
        growth: string;
    }
) => {
    return (value: string | number, name: string): [string, string] => {
        const dataPoint = chartData.find(
            (d: RevenueChartDataPoint) => d.value === value
        );

        if (dataPoint) {
            return [
                `${translations.revenue}: $${Number(value).toLocaleString()}\n${translations.growth
                }: ${dataPoint.growth >= 0 ? "+" : ""}${dataPoint.growth}%`,
                String(name),
            ];
        }

        return [`$${Number(value).toLocaleString()}`, String(name)];
    };
};
