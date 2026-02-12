import SettingsTabs from "./SettingsTabs";
import type { SettingsTab } from "@/features/dashboard/settings/types";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  className?: string;
}

export default function SettingsSidebar({
  activeTab,
  onTabChange,
  className = "",
}: SettingsSidebarProps) {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl  p-4">
        <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}
