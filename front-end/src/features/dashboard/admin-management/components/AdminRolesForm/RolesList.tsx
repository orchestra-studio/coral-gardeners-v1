import React from "react";
import { useTranslations } from "next-intl";
import { IconCheck, IconCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { RoleItem } from "./types";

interface RolesListProps {
  roles: RoleItem[];
  selectedRoles: number[];
  onToggleRole: (roleId: number) => void;
}

export const RolesList: React.FC<RolesListProps> = ({
  roles,
  selectedRoles,
  onToggleRole,
}) => {
  const t = useTranslations("dashboard/settings/adminmanagement.rolesForm");

  if (roles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[var(--text-muted)] mb-2">
          {t("noRolesMessage")}
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          {t("noRolesSubMessage")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
      {roles.map((role) => {
        const isSelected = selectedRoles.includes(role.id);
        return (
          <Button
            key={role.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleRole(role.id)}
            startIcon={
              isSelected ? (
                <IconCheck size={14} />
              ) : (
                <IconCircle size={14} className="opacity-50" />
              )
            }
            className="rounded-full"
          >
            {role.name}
          </Button>
        );
      })}
    </div>
  );
};
