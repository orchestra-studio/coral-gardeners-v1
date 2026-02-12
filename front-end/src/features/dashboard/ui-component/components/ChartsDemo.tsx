"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import AreaChart from "@/components/ui/charts/AreaChart";
import BarChart from "@/components/ui/charts/BarChart";
import LineChart from "@/components/ui/charts/LineChart";
import PieChart from "@/components/ui/charts/PieChart";
import RadarChart from "@/components/ui/charts/RadarChart";
import RingsChart from "@/components/ui/charts/RingsChart";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface ChartsDemoProps {
  className?: string;
}

export default function ChartsDemo({ className }: ChartsDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 1600 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 1200 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 3800 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
    { name: "May", sales: 1890, revenue: 4800, profit: 2400 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 2200 },
  ];

  // Monochrome and blue color palette
  const colors = {
    blue: "#3b82f6", // blue-500
    blueLight: "#60a5fa", // blue-400
    blueDark: "#2563eb", // blue-600
    gray: "#6b7280", // gray-500
    grayLight: "#9ca3af", // gray-400
    grayDark: "#4b5563", // gray-600
  };

  const categoryData = [
    { name: "Active", value: 65, color: colors.blue },
    { name: "Inactive", value: 35, color: colors.gray },
  ];

  const skillsData = [
    { name: "React", value: 90 },
    { name: "TypeScript", value: 85 },
    { name: "Node.js", value: 80 },
    { name: "CSS", value: 95 },
    { name: "GraphQL", value: 70 },
    { name: "Testing", value: 75 },
  ];

  const ringsData = [
    {
      label: "Active Users",
      value: 8500,
      max: 10000,
      color: "url(#blueGlassGradient)",
      icon: Activity,
      description: "Daily active users this month",
    },
    {
      label: "Revenue",
      value: 75000,
      max: 100000,
      color: "url(#grayGlassGradient)",
      icon: TrendingUp,
      description: "Monthly revenue target",
    },
    {
      label: "Conversions",
      value: 450,
      max: 1000,
      color: "url(#grayGlassGradient)",
      icon: BarChart3,
      description: "Sales conversions this week",
    },
  ];

  return (
    <DemoCard
      title={t("components.charts.title")}
      description={t("components.charts.description")}
      className={className}
    >
      <div className="space-y-8">
        {/* Area Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text)]">
            {t("components.charts.sections.areaChart")}
          </h4>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <AreaChart
              data={monthlyData}
              areas={[
                {
                  dataKey: "sales",
                  fill: colors.blue,
                  name: "Sales",
                },
                {
                  dataKey: "revenue",
                  fill: colors.gray,
                  name: "Revenue",
                },
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text)]">
            {t("components.charts.sections.barChart")}
          </h4>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <BarChart
              data={monthlyData}
              bars={[
                { dataKey: "sales", fill: colors.blue, name: "Sales" },
                { dataKey: "profit", fill: colors.gray, name: "Profit" },
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Line Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text)]">
            {t("components.charts.sections.lineChart")}
          </h4>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <LineChart
              data={monthlyData}
              lines={[
                { dataKey: "sales", stroke: colors.blue, name: "Sales" },
                {
                  dataKey: "revenue",
                  stroke: colors.gray,
                  strokeDasharray: "5 5",
                  name: "Revenue",
                },
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Pie & Radar Charts - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text)]">
              {t("components.charts.sections.pieChart")}
            </h4>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <PieChart
                data={categoryData}
                height={250}
                paddingAngle={0}
                cornerRadius={0}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--text)]">
              {t("components.charts.sections.radarChart")}
            </h4>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <RadarChart
                data={skillsData}
                radars={[
                  {
                    dataKey: "value",
                    stroke: colors.blue,
                    fill: colors.blue,
                    name: "Skills",
                  },
                ]}
                height={250}
              />
            </div>
          </div>
        </div>

        {/* Rings Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text)]">
            {t("components.charts.sections.ringsChart")}
          </h4>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <RingsChart data={ringsData} size={180} strokeWidth={14} />
          </div>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`// Area Chart
<AreaChart
  data={monthlyData}
  areas={[
    { dataKey: "sales", fill: "#3b82f6", name: "Sales" },
    { dataKey: "revenue", fill: "#6b7280", name: "Revenue" }
  ]}
  height={250}
/>

// Bar Chart
<BarChart
  data={monthlyData}
  bars={[
    { dataKey: "sales", fill: "#3b82f6", name: "Sales" },
    { dataKey: "profit", fill: "#6b7280", name: "Profit" }
  ]}
  height={250}
/>

// Line Chart
<LineChart
  data={monthlyData}
  lines={[
    { dataKey: "sales", stroke: "#3b82f6", name: "Sales" }
  ]}
  height={250}
/>

// Pie Chart
<PieChart
  data={[
    { name: "Active", value: 65, color: "#3b82f6" },
    { name: "Inactive", value: 35, color: "#6b7280" }
  ]}
  height={250}
  paddingAngle={0}
  cornerRadius={0}
/>

// Radar Chart
<RadarChart
  data={skillsData}
  radars={[
    { dataKey: "value", stroke: "#3b82f6", fill: "#3b82f6" }
  ]}
  height={250}
/>

// Rings Chart
<RingsChart
  data={ringsData}
  size={180}
  strokeWidth={14}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
