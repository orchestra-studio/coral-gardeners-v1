import { SmoothTabItem } from "@/components/ui/SmoothTabs";
import { IconTarget, IconTrendingUp } from "@tabler/icons-react";
import { TabContent } from "../components";
import { InsightData } from "../constants";
import { RingData } from "@/components/ui/charts";

interface TabItemsParams {
  titles: {
    performance: string;
    trends: string;
  };
  datasets: {
    performance: RingData[];
    trends: RingData[];
  };
  insights: {
    performance: InsightData;
    trends: InsightData;
  };
}

export const getTabItems = ({
  titles,
  datasets,
  insights,
}: TabItemsParams): SmoothTabItem[] => [
  {
    id: "performance",
    title: titles.performance,
    icon: IconTarget,
    cardContent: (
      <TabContent
        chartData={datasets.performance}
        insight={insights.performance}
      />
    ),
  },
  {
    id: "trends",
    title: titles.trends,
    icon: IconTrendingUp,
    cardContent: (
      <TabContent chartData={datasets.trends} insight={insights.trends} />
    ),
  },
];
