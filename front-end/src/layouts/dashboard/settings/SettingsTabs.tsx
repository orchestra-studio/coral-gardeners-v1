import { settingsTabs } from "@/features/dashboard/settings/config/tabs";
import { Tabs } from "@/components/ui/Tabs";
import type { SettingsTab } from "@/features/dashboard/settings/types";
import { useTranslations } from "next-intl";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  className?: string;
}

export default function SettingsTabs({
  activeTab,
  onTabChange,
  className = "",
}: SettingsTabsProps) {
  const t = useTranslations("dashboard/settings");

  // Convert labelKey to actual translated labels
  const translatedTabs = settingsTabs.map((tab) => ({
    id: tab.id,
    label: t(`tabs.${tab.id}.label`),
    icon: tab.icon,
  }));

  return (
    <div className={`w-full ${className}`}>
      <Tabs
        items={translatedTabs}
        value={activeTab}
        onValueChange={onTabChange}
        variant="sidebar"
        containerClassName="w-full"
      />
    </div>
  );
}
