"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import {
  IconShield,
  IconUsers,
  IconUserOff,
  IconClock,
} from "@tabler/icons-react";
import { useRolesStatistics } from "@/services/adminRoles";

export default function RolesStats() {
  const t = useTranslations("dashboard/settings/adminroles");
  const { data: statsData, isLoading } = useRolesStatistics();

  // Build stat cards from API statistics
  const stats = useMemo((): StatCardData[] => {
    const total = statsData?.total || 0;
    const withAdmins = statsData?.withAdmins || 0;
    const withoutAdmins = statsData?.withoutAdmins || 0;
    const recentlyAdded = statsData?.recentlyAdded || 0;

    return [
      {
        id: "role-stat-1",
        title: t("stats.totalRoles"),
        value: total,
        icon: <IconShield />,
        description: t("stats.totalRolesDesc"),
      },
      {
        id: "role-stat-2",
        title: t("stats.rolesWithUsers"),
        value: withAdmins,
        icon: <IconUsers />,
        description: t("stats.rolesWithUsersDesc"),
      },
      {
        id: "role-stat-3",
        title: t("stats.rolesWithoutUsers"),
        value: withoutAdmins,
        icon: <IconUserOff />,
        description: t("stats.rolesWithoutUsersDesc"),
      },
      {
        id: "role-stat-4",
        title: t("stats.recentlyAdded"),
        value: recentlyAdded,
        icon: <IconClock />,
        description: t("stats.recentlyAddedDesc"),
      },
    ];
  }, [statsData, t]);

  return (
    <StatCards
      data={stats}
      saveOrder={true}
      storageKey="dashboard-admin-roles-stats-order"
      loading={isLoading}
      gridCols="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      gap="gap-4"
    />
  );
}
