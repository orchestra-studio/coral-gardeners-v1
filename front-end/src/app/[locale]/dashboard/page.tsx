"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import KpiSection from "@/features/dashboard/overview/kpi";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import { RadarWidget as RadarWidgetContainer } from "@/features/dashboard/overview/radar";
import WorldMap from "@/features/dashboard/overview/worldmap";
import { BarChart as RevenueAnalyticsChart } from "@/features/dashboard/overview/revenue";
import { PerformanceMetrics } from "@/features/dashboard/overview/performance";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import ProjectsTableWidget from "@/features/dashboard/overview/projects/ProjectsTableWidget";
import GreetingWidget from "@/features/dashboard/overview/greeting";
import AIInsightsWidget from "@/features/dashboard/overview/insights";
import { QuickTasksWidget } from "@/features/dashboard/overview/quick-tasks";
import { CalendarWidget } from "@/features/dashboard/overview/calendar";
import { useLocale } from "next-intl";
import { useAuth } from "@/lib/auth";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ExportButton } from "@/components/ExportButton";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tOverview = useTranslations("dashboard/overview");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { user } = useAuth();

  const breadcrumbItems = [
    {
      label: t("breadcrumb.dashboard"),
      current: true,
    },
  ];
  const { navigateReplace } = useAppNavigation();
  const searchParams = useSearchParams();

  // Check for email verification success
  useEffect(() => {
    const isVerified = searchParams.get("verified");
    if (isVerified === "true") {
      toast.success(t("overview.emailVerified"));

      // Clean up the URL by removing the verified parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      navigateReplace(url.pathname + (url.search || ""));
    }
  }, [searchParams, navigateReplace, t]);

  return (
    <>
      <PageHeader
        title={t("overview.title")}
        description={t("overview.description")}
        breadcrumb={<BreadcrumbNavigation items={breadcrumbItems} />}
        size="md"
        containerClassName="mb-0"
        actions={
          <>
            <DateRangePicker
              placeholder={tCommon("DateRange.selectTimeRange")}
              className="min-w-[100px]"
              variant="ghost"
              translations={{
                custom: tCommon("DateRange.custom"),
                today: tCommon("DateRange.today"),
                yesterday: tCommon("DateRange.yesterday"),
                last7Days: tCommon("DateRange.last7Days"),
                last28Days: tCommon("DateRange.last28Days"),
                last30Days: tCommon("DateRange.last30Days"),
                thisMonth: tCommon("DateRange.thisMonth"),
                lastMonth: tCommon("DateRange.lastMonth"),
                quickSelect: tCommon("DateRange.quickSelect"),
                from: tCommon("DateRange.from"),
                to: tCommon("DateRange.to"),
                selectDate: tCommon("DateRange.selectDate"),
                daysSelected: tCommon("DateRange.daysSelected"),
                cancel: tCommon("DateRange.cancel"),
                apply: tCommon("DateRange.apply"),
              }}
            />
            <ExportButton
              targetId="dashboard-content"
              filename="dashboard-overview"
              variant="outline"
              className="hidden md:flex"
              translations={{
                button: tCommon("Export.button"),
                image: tCommon("Export.image"),
                imageDescription: tCommon("Export.imageDescription"),
                exportingImage: tCommon("Export.exportingImage"),
              }}
            />
          </>
        }
      />

      {/* Main Dashboard Grid - 8 columns left + 4 columns right */}
      <div
        id="dashboard-content"
        className="flex pt-2 flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-4  "
      >
        {/* Left Column - 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-4">
          {/* Greeting Widget */}
          <GreetingWidget
            userName={user?.name || "User"}
            greetingMessages={{
              morning: tOverview.raw("greeting.morning"),
              afternoon: tOverview.raw("greeting.afternoon"),
              evening: tOverview.raw("greeting.evening"),
              subtitle: tOverview("greeting.subtitle"),
            }}
            locale={locale}
          />

          {/* KPIs section */}
          <KpiSection />

          {/* Quick Tasks and Calendar - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickTasksWidget />
            <CalendarWidget />
          </div>

          {/* Projects Table Section */}
          <ProjectsTableWidget />

          {/* User Traffic Map */}
          <WorldMap />
        </div>

        {/* Right Column - 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-4 ">
          {/* AI Insights Widget */}
          <AIInsightsWidget />
          {/* Revenue Analytics Chart */}
          <RevenueAnalyticsChart />

          {/* Performance Metrics Chart */}
          <PerformanceMetrics />

          {/* Radar Widget Section */}
          <RadarWidgetContainer />
        </div>
      </div>
    </>
  );
}
