import React from "react";
import { AdminUser } from "@/lib/api";
import { UserName } from "@/components/ui";

interface AdminInfoProps {
  admin: AdminUser;
}

export const AdminInfo: React.FC<AdminInfoProps> = ({ admin }) => {
  return (
    <div className="p-4 bg-[var(--surface-hover)] rounded-md border border-[var(--border)]">
      <UserName
        profile_image={admin.profile_picture || undefined}
        first_name={admin.first_name || ""}
        last_name={admin.last_name || ""}
        email={admin.email}
        isTrusted={admin.isTrusted}
        avatarSize="lg"
      />
    </div>
  );
};
