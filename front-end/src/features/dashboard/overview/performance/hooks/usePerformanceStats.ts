import { useMemo } from "react";
import { PerformanceData } from "../data";

export const usePerformanceStats = (performanceData: PerformanceData[]) => {
    const avgCompletion = useMemo(
        () =>
            performanceData.reduce(
                (sum: number, item: PerformanceData) => sum + item.completionRate,
                0
            ) / performanceData.length,
        [performanceData]
    );

    const aboveTarget = useMemo(
        () =>
            performanceData.filter(
                (item: PerformanceData) => item.completionRate >= item.target
            ).length,
        [performanceData]
    );

    const bestMonth = useMemo(
        () =>
            performanceData.reduce((max: PerformanceData, item: PerformanceData) =>
                item.completionRate > max.completionRate ? item : max
            ),
        [performanceData]
    );

    return {
        avgCompletion,
        aboveTarget,
        bestMonth,
    };
};
