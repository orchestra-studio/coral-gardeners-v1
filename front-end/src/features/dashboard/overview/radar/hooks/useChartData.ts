import { useMemo } from "react";
import { RadarData } from "../data";

export interface RadarChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export const useChartData = (radarData: RadarData[]) => {
    return useMemo(
        () =>
            radarData.map((item: RadarData): RadarChartDataPoint => ({
                name: item.metric,
                value: item.value,
            })),
        [radarData]
    );
};
