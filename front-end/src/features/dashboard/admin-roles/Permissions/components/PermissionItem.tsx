import React from "react";
import Checkbox from "@/components/ui/checkbox";
import { useLocale } from "next-intl";
import { PermissionDetail } from "../types";

interface PermissionItemProps {
  permission: PermissionDetail;
  checked: boolean;
  onChange: () => void;
}

export function PermissionItem({
  permission,
  checked,
  onChange,
}: PermissionItemProps) {
  const locale = useLocale() as "ar" | "en";
  const label = permission.display_name[locale] || permission.display_name.en;

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={permission.name}
        checked={checked}
        onChange={onChange}
        label={label}
        labelClassName="capitalize"
        size="md"
      />
    </div>
  );
}
