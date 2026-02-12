"use client";

import React from "react";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { useLocalizedAnalytics } from "./data";
import { useChartData } from "./hooks";
import { AnalyticsRadarChart, TipCard } from "./components";

export default function RadarWidget() {
  const { radarData, translations } = useLocalizedAnalytics();
  const chartData = useChartData(radarData);

  return (
    <div className="h-auto min-h-[280px] lg:min-h-[320px]">
      <WidgetCard
        lightingIntensity={0.07}
        lightingWidth={640}
        lightingHeight={720}
      >
        <SectionHeader
          title={translations.radar.header.title}
          description={translations.radar.header.description}
        />

        <AnalyticsRadarChart chartData={chartData} />

        <TipCard content={translations.radar.tip.content} />
      </WidgetCard>
    </div>
  );
}
