"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { Settings, Bell, User } from "lucide-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function TabsDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [pillTab, setPillTab] = useState("tab1");
  const [underlineTab, setUnderlineTab] = useState("tab1");
  const [minimalTab, setMinimalTab] = useState("tab1");
  const [sidebarTab, setSidebarTab] = useState("profile");

  const basicTabs: TabItem[] = [
    { id: "tab1", label: t("components.tabs.labels.tab1") },
    { id: "tab2", label: t("components.tabs.labels.tab2") },
    { id: "tab3", label: t("components.tabs.labels.tab3") },
  ];

  const tabsWithCounts: TabItem[] = [
    { id: "tab1", label: t("components.tabs.labels.tab1"), count: 12 },
    { id: "tab2", label: t("components.tabs.labels.tab2"), count: 5 },
    { id: "tab3", label: t("components.tabs.labels.tab3"), count: 8 },
  ];

  const sidebarTabs: TabItem[] = [
    {
      id: "profile",
      label: t("components.smoothTabs.labels.profile"),
      icon: User,
    },
    {
      id: "settings",
      label: t("components.smoothTabs.labels.settings"),
      icon: Settings,
    },
    {
      id: "notifications",
      label: t("components.smoothTabs.labels.notifications"),
      icon: Bell,
      count: 3,
    },
  ];

  return (
    <DemoCard
      title={t("components.tabs.title")}
      description={t("components.tabs.description")}
    >
      {/* Underline Variant */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium text-[var(--text)]">
          Underline Variant
        </h4>
        <Tabs
          items={tabsWithCounts}
          value={underlineTab}
          onValueChange={setUnderlineTab}
          variant="underline"
        />
        <div className="p-3 bg-[var(--surface-hover)] rounded-md min-h-[120px] flex items-start">
          <p className="text-xs text-[var(--text-muted)]">
            {t("components.tabs.messages.activeTab")}: {underlineTab}
          </p>
        </div>
      </div>

      {/* Minimal Variant */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium text-[var(--text)]">
          Minimal Variant
        </h4>
        <Tabs
          items={basicTabs}
          value={minimalTab}
          onValueChange={setMinimalTab}
          variant="minimal"
        />
        <div className="p-3 bg-[var(--surface-hover)] rounded-md min-h-[120px] flex items-start">
          <p className="text-xs text-[var(--text-muted)]">
            {t("components.tabs.messages.activeTab")}: {minimalTab}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-15">
        {/* Pill Variant */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-[var(--text)]">
            Pill Variant
          </h4>
          <Tabs
            items={basicTabs}
            value={pillTab}
            onValueChange={setPillTab}
            variant="pill"
          />
          <div className="p-3 bg-[var(--surface-hover)] rounded-md min-h-[120px] flex items-start">
            <p className="text-xs text-[var(--text-muted)]">
              {t("components.tabs.messages.activeTab")}: {pillTab}
            </p>
          </div>
        </div>

        {/* Pill with Counts */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-[var(--text)]">
            Pill with Counts
          </h4>
          <Tabs
            items={tabsWithCounts}
            value={pillTab}
            onValueChange={setPillTab}
            variant="pill"
            size="md"
          />
        </div>

        {/* Sidebar Variant */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-[var(--text)]">
            Sidebar Variant (with icons)
          </h4>
          <div className="max-w-xs">
            <Tabs
              items={sidebarTabs}
              value={sidebarTab}
              onValueChange={setSidebarTab}
              variant="sidebar"
            />
          </div>
          <div className="p-3 bg-[var(--surface-hover)] rounded-md min-h-[120px] flex items-start">
            <p className="text-xs text-[var(--text-muted)]">
              {t("components.tabs.messages.activeTab")}: {sidebarTab}
            </p>
          </div>
        </div>

        <CollapsibleCode
          defaultOpen={false}
          title={t("components.collapsibleCode.labels.codeExample")}
          code={`// Pill Variant
<Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} variant="pill" />

// Underline Variant
<Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} variant="underline" />

// Minimal Variant
<Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} variant="minimal" />

// Sidebar Variant with Icons
<Tabs items={sidebarTabs} value={activeTab} onValueChange={setActiveTab} variant="sidebar" />`}
          copyLabel={t("components.collapsibleCode.labels.copy")}
          copiedLabel={t("components.collapsibleCode.labels.copied")}
          copyAriaLabel={t("components.collapsibleCode.aria.copy")}
          copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
        />
      </div>
    </DemoCard>
  );
}
