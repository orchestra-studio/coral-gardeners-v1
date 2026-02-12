"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import {
  IconUsers,
  IconShieldCheck,
  IconClock,
  IconUserPlus,
} from "@tabler/icons-react";

interface AdminStatisticsData {
  total: number;
  adminsWithRoles: number;
  recentlyAdded: number;
  recentlyUpdated: number;
}

interface AdminStatsProps {
  statsData?: AdminStatisticsData | null;
  loading?: boolean;
}

export default function AdminStats({
  statsData,
  loading = false,
}: AdminStatsProps) {
  const t = useTranslations("dashboard/settings/adminmanagement");

  // Build stat cards from statistics API data
  const cardsData = useMemo((): StatCardData[] => {
    return [
      {
        id: "admin-stat-1",
        title: t("stats.totalAdmins"),
        value: statsData?.total || 0,
        icon: <IconUsers />,
        description: t("stats.totalAdminsDesc"),
      },
      {
        id: "admin-stat-2",
        title: t("stats.adminsWithRoles"),
        value: statsData?.adminsWithRoles || 0,
        icon: <IconShieldCheck />,
        description: t("stats.adminsWithRolesDesc"),
      },
      {
        id: "admin-stat-3",
        title: t("stats.recentlyAdded"),
        value: statsData?.recentlyAdded || 0,
        icon: <IconUserPlus />,
        description: t("stats.recentlyAddedDesc"),
      },
      {
        id: "admin-stat-4",
        title: t("stats.recentlyUpdated"),
        value: statsData?.recentlyUpdated || 0,
        icon: <IconClock />,
        description: t("stats.recentlyUpdatedDesc"),
      },
    ];
  }, [statsData, t]);

  return (
    <StatCards
      data={cardsData}
      saveOrder={true}
      storageKey="dashboard-admin-management-stats-order"
      loading={loading}
      gridCols="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      gap="gap-4"
    />
  );
}
