import { PerformanceChartDataPoint } from "../hooks";

export const formatYAxis = (value: string | number): string => {
    return String(value);
};

export const formatXAxis = (value: string | number): string => {
    return `${value}%`;
};

export const createTooltipFormatter = (
    chartData: PerformanceChartDataPoint[],
    translations: {
        completion: string;
        target: string;
    }
) => {
    return (value: string | number, name: string): [string, string] => {
        const dataPoint = chartData.find(
            (d: PerformanceChartDataPoint) => d.value === value
        );

        if (dataPoint) {
            return [
                `${translations.completion}: ${value}%\n${translations.target}: ${dataPoint.target}%`,
                String(name),
            ];
        }

        return [`${value}%`, String(name)];
    };
};
