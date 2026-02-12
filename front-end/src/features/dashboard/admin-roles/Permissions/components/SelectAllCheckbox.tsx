import React from "react";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/ui/checkbox";

interface SelectAllCheckboxProps {
  areAllPermissionsSelected: () => boolean;
  areSomePermissionsSelected: () => boolean;
  handleSelectAll: () => void;
}

export function SelectAllCheckbox({
  areAllPermissionsSelected,
  areSomePermissionsSelected,
  handleSelectAll,
}: SelectAllCheckboxProps) {
  const t = useTranslations("dashboard/settings/adminroles.permissions");

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-[var(--control-bg)] rounded-xl">
      <span className="text-base font-medium text-[var(--text)]">
        {t("allPermissions")}
      </span>
      <Checkbox
        id="select-all"
        checked={areAllPermissionsSelected()}
        indeterminate={
          areSomePermissionsSelected() && !areAllPermissionsSelected()
        }
        onChange={handleSelectAll}
        size="md"
      />
    </div>
  );
}
