import { useMemo } from "react";
import { RevenueData } from "../data";

export interface RevenueChartDataPoint {
    name: string;
    value: number;
    growth: number;
    [key: string]: string | number;
}

export const useChartData = (revenueData: RevenueData[]) => {
    return useMemo(
        () =>
            revenueData.slice(0, 5).map((item: RevenueData): RevenueChartDataPoint => ({
                name: item.category,
                value: item.value,
                growth: item.growth,
            })),
        [revenueData]
    );
};
