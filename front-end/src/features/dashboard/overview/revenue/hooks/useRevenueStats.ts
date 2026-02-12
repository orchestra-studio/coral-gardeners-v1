import { useMemo } from "react";
import { RevenueData } from "../data";

export const useRevenueStats = (revenueData: RevenueData[]) => {
    const totalRevenue = useMemo(
        () =>
            revenueData.reduce(
                (sum: number, item: RevenueData) => sum + item.value,
                0
            ),
        [revenueData]
    );

    const avgGrowth = useMemo(
        () =>
            (revenueData.reduce(
                (sum: number, item: RevenueData) =>
                    sum + (item.value * item.growth) / 100,
                0
            ) /
                totalRevenue) *
            100,
        [revenueData, totalRevenue]
    );

    const positiveCount = useMemo(
        () => revenueData.filter((item: RevenueData) => item.growth > 0).length,
        [revenueData]
    );

    return {
        totalRevenue,
        avgGrowth,
        positiveCount,
    };
};
