"use client";

import React from "react";
import { useTranslations } from "next-intl";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { SmoothTabs } from "@/components/ui/SmoothTabs";
import { useInsights } from "./hooks/useInsights";
import { getTabItems } from "./utils/tabConfig";
import { useLocalizedInsights } from "./data";

interface InsightsWidgetProps {
  title?: string;
  description?: string;
}

/**
 * InsightsWidget - Insights with smooth animated tabs
 * Contains tabs to switch between different insight types
 */
export function InsightsWidget({ title, description }: InsightsWidgetProps) {
  const t = useTranslations("dashboard/overview");
  const {
    tabs,
    ringData,
    insights: localizedInsights,
  } = useLocalizedInsights();
  const { activeTab, setActiveTab } = useInsights();
  const tabItems = getTabItems({
    titles: tabs,
    datasets: ringData,
    insights: localizedInsights,
  });

  return (
    <WidgetCard
      className="p-3 sm:p-4 min-h-0"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={title || t("insights.title")}
        description={description || t("insights.description")}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <SmoothTabs
          items={tabItems}
          value={activeTab}
          onValueChange={setActiveTab}
          showCardContent={true}
          cardHeight="100%"
          tabsPosition="top"
          className="h-full"
        />
      </div>
    </WidgetCard>
  );
}

export default InsightsWidget;
