import { useMemo } from "react";
import { PerformanceData } from "../data";

export interface PerformanceChartDataPoint {
    name: string;
    value: number;
    target: number;
    [key: string]: string | number; // Index signature for BarChartDataPoint compatibility
}

export const useChartData = (performanceData: PerformanceData[]) => {
    return useMemo(
        () =>
            performanceData.map((item: PerformanceData): PerformanceChartDataPoint => ({
                name: item.month,
                value: item.completionRate,
                target: item.target,
            })),
        [performanceData]
    );
};