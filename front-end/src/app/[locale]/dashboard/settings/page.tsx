"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/locale/useLocale";
import PageHeader from "@/components/PageHeader";
import BreadcrumbNavigation from "@/components/BreadcrumbNavigation";
import {
  SettingsSidebar,
  SettingsContentRenderer,
} from "@/layouts/dashboard/settings";
import { tabConfig } from "@/features/dashboard/settings/config";
import type { SettingsTab } from "@/features/dashboard/settings/types";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("dashboard");
  const tSettings = useTranslations("dashboard/settings");
  const locale = useLocale();

  // Initialize activeTab from URL parameters to prevent initial profile loading
  const getInitialTab = (): SettingsTab => {
    const urlTab = searchParams.get("tab") as SettingsTab;

    if (urlTab && Object.keys(tabConfig).includes(urlTab)) {
      return urlTab;
    }
    return "profile";
  };

  const [activeTab, setActiveTab] = useState<SettingsTab>(getInitialTab);

  useEffect(() => {
    const urlTab = searchParams.get("tab") as SettingsTab;

    if (urlTab && Object.keys(tabConfig).includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tab);
    router.replace(
      `/${locale}/dashboard/settings?${newSearchParams.toString()}`,
      {
        scroll: false,
      }
    );
  };

  const getBreadcrumbItems = () => [
    { label: t("breadcrumb.dashboard"), href: `/${locale}/dashboard` },
    {
      label: tSettings("breadcrumb.settings"),
      href: `/${locale}/dashboard/settings`,
    },
    { label: tSettings(`tabs.${activeTab}.label`), current: true },
  ];

  return (
    <>
      <PageHeader
        title={tSettings("title")}
        description={tSettings("description")}
        breadcrumb={<BreadcrumbNavigation items={getBreadcrumbItems()} />}
        size="lg"
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="lg:col-span-1 ">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="settings-sidebar"
          />
        </div>

        <div className="xl:col-span-4">
          <SettingsContentRenderer activeTab={activeTab} />
        </div>
      </div>
    </>
  );
}
