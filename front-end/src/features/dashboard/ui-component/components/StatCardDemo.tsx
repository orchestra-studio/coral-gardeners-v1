"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface StatCardDemoProps {
  className?: string;
}

export default function StatCardDemo({ className }: StatCardDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  const statsData = useMemo((): StatCardData[] => {
    return [
      {
        id: "demo-stat-1",
        title: t("components.statCard.labels.totalUsers"),
        value: "12,345",
        icon: <Users className="w-5 h-5" />,
        trend: {
          direction: "up",
          value: "12.5",
          label: t("components.statCard.labels.vsLastMonth"),
        },
        description: t("components.statCard.messages.activeUsers"),
      },
      {
        id: "demo-stat-2",
        title: t("components.statCard.labels.revenue"),
        value: "$45,678",
        icon: <DollarSign className="w-5 h-5" />,
        trend: {
          direction: "down",
          value: "5.2",
          label: t("components.statCard.labels.vsLastMonth"),
        },
        description: t("components.statCard.messages.monthlyRevenue"),
      },
      {
        id: "demo-stat-3",
        title: "Total Orders",
        value: "1,234",
        icon: <ShoppingCart className="w-5 h-5" />,
        trend: {
          direction: "up",
          value: "8.3",
          label: t("components.statCard.labels.vsLastMonth"),
        },
        description: "Orders placed this month",
      },
      {
        id: "demo-stat-4",
        title: "Conversion Rate",
        value: "3.24%",
        icon: <TrendingUp className="w-5 h-5" />,
        trend: {
          direction: "up",
          value: "2.1",
          label: t("components.statCard.labels.vsLastMonth"),
        },
        description: "Average conversion rate",
      },
    ];
  }, [t]);

  return (
    <DemoCard
      title={t("components.statCard.title")}
      description={t("components.statCard.description")}
      className={className}
    >
      <StatCards
        data={statsData}
        gridCols="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl bg-[var(--control-bg)] p-4 py-4"
        gap="gap-4"
      />

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const statsData: StatCardData[] = [
  {
    id: "stat-1",
    title: "Total Users",
    value: "12,345",
    icon: <Users className="w-5 h-5" />,
    trend: {
      direction: "up",
      value: "12.5",
      label: "vs last month"
    },
    description: "Active users this month"
  },
  {
    id: "stat-2",
    title: "Revenue",
    value: "$45,678",
    icon: <DollarSign className="w-5 h-5" />,
    trend: {
      direction: "down",
      value: "5.2",
      label: "vs last month"
    },
    description: "Monthly revenue"
  },
  {
    id: "stat-3",
    title: "Total Orders",
    value: "1,234",
    icon: <ShoppingCart className="w-5 h-5" />,
    trend: {
      direction: "up",
      value: "8.3",
      label: "vs last month"
    },
    description: "Orders placed this month"
  },
  {
    id: "stat-4",
    title: "Conversion Rate",
    value: "3.24%",
    icon: <TrendingUp className="w-5 h-5" />,
    trend: {
      direction: "up",
      value: "2.1",
      label: "vs last month"
    },
    description: "Average conversion rate"
  }
];

<StatCards 
  data={statsData}
  gridCols="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  gap="gap-4"
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
