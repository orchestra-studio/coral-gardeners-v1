import React from "react";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/ui/checkbox";
import Collapsible from "@/components/ui/Collapsible";
import { PermissionItem } from "./PermissionItem";
import { GroupState, PermissionDetail } from "../types";

interface PermissionGroupProps {
  groupName: string;
  permissions: PermissionDetail[];
  groupState: GroupState;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onGroupToggle: () => void;
  getPermissionChecked: (permission: string) => boolean;
  onPermissionToggle: (permission: string) => void;
}

export function PermissionGroup({
  groupName,
  permissions,
  groupState,
  isExpanded,
  onToggleExpansion,
  onGroupToggle,
  getPermissionChecked,
  onPermissionToggle,
}: PermissionGroupProps) {
  const t = useTranslations("dashboard/settings/adminroles.permissions.groups");

  // Get translated group name, fallback to formatted groupName if translation not found
  const translatedGroupName = t(groupName, {
    defaultValue: groupName.replace(/_/g, " "),
  });

  return (
    <Collapsible
      title={translatedGroupName}
      open={isExpanded}
      onOpenChange={onToggleExpansion}
      className="rounded-md"
      rightContent={
        <Checkbox
          id={`group-${groupName}`}
          checked={groupState.checked}
          indeterminate={groupState.indeterminate}
          onChange={onGroupToggle}
          size="md"
        />
      }
    >
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.name}
            permission={permission}
            checked={getPermissionChecked(permission.name)}
            onChange={() => onPermissionToggle(permission.name)}
          />
        ))}
      </div>
    </Collapsible>
  );
}
