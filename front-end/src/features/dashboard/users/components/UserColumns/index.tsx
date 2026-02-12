"use client";

import Image from "next/image";
import {
  IconDots,
  IconCheck,
  IconX,
  IconEye,
  IconEdit,
  IconMail,
  IconTrash,
  IconRefresh,
} from "@tabler/icons-react";
import { Column } from "@/components/Table";
import Status from "@/components/ui/Status";
import DropdownMenu from "@/components/ui/DropdownMenu";
import IconButton from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/permissions";

// Import from organized structure
import {
  UserAvatarProps,
  UserNameCellProps,
  UserEmailCellProps,
  UserActionsProps,
  User,
} from "../../types";
import {
  getUserFullName,
  getUserInitials,
  formatDate,
  getStatusVariant,
} from "../../utils";
import { AVATAR_CONFIG } from "../../constants";
import { UserName } from "@/components/ui";

// Component: User Avatar
function UserAvatar({ initials, profilePicture }: UserAvatarProps) {
  return (
    <div
      className={`flex-shrink-0 ${AVATAR_CONFIG.size} rounded-full flex items-center justify-center bg-[var(--selected-bg)] overflow-hidden`}
    >
      {profilePicture ? (
        <Image
          src={profilePicture}
          alt={initials}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={`${AVATAR_CONFIG.textSize} ${AVATAR_CONFIG.fontWeight} text-[var(--primaryColor)]`}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

// Component: User Name Cell
function UserNameCell({ user }: UserNameCellProps) {
  const fullName = getUserFullName(user);
  const initials = getUserInitials(user);

  return (
    <div className="flex items-center gap-3">
      <UserAvatar initials={initials} profilePicture={user.profile_picture} />
      <div>
        <div className="font-medium text-[var(--text)]">{fullName}</div>
        <div className="text-sm text-[var(--text-muted)]">@{user.username}</div>
      </div>
    </div>
  );
}

// Component: User Email Cell
function UserEmailCell({ user }: UserEmailCellProps) {
  return <span className="text-[var(--text)]">{user.email}</span>;
}

// Component: User Actions
function UserActions({
  user,
  onView,
  onAction,
  onChangePassword,
  onResendVerification,
  onMarkVerified,
  onMarkUnverified,
  t,
}: UserActionsProps) {
  const isDeleted = !!user.deleted_at;
  const isVerified = !!user.email_verified_at;

  // Permission checks
  const { hasPermission } = usePermission();
  const canView = hasPermission("users.view");
  const canVerify = hasPermission("users.verify");
  const canUpdate = hasPermission("users.update");
  const canDelete = hasPermission("users.delete");
  const canRestore = hasPermission("users.restore") || canDelete; // Allow restore if has delete permission

  const menuItems = [];

  if (!isDeleted) {
    // Actions for active users
    if (onChangePassword && canUpdate) {
      menuItems.push({
        icon: <IconEdit size={16} />,
        label: t("actions.changePassword"),
        onClick: () => onChangePassword(user),
      });
    }

    if (!isVerified && onResendVerification && canUpdate) {
      menuItems.push({
        icon: <IconMail size={16} />,
        label: t("actions.resendVerification"),
        onClick: () => onResendVerification(user),
      });
    }

    if (!isVerified && onMarkVerified && canVerify) {
      menuItems.push({
        icon: <IconCheck size={16} />,
        label: t("actions.markVerified"),
        onClick: () => onMarkVerified(user),
      });
    }

    if (isVerified && onMarkUnverified && canVerify) {
      menuItems.push({
        icon: <IconX size={16} />,
        label: t("actions.markUnverified"),
        onClick: () => onMarkUnverified(user),
      });
    }

    if (canDelete) {
      menuItems.push({
        icon: <IconTrash size={16} />,
        label: t("actions.delete"),
        onClick: () => onAction(user),
      });
    }
  } else {
    // Actions for deleted users - restore requires delete or restore permission
    if (canRestore) {
      menuItems.push({
        icon: <IconRefresh size={16} />,
        label: t("actions.restore"),
        onClick: () => onAction(user),
      });
    }
  }

  // Don't render actions column if user has no permissions
  if (!canView && !canUpdate && !canDelete && !canVerify) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Button - Only for "all" users (when onView is provided) */}
      {onView && canView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(user)}
          startIcon={<IconEye size={16} />}
        >
          {t("actions.view")}
        </Button>
      )}

      {/* Actions Menu */}
      {menuItems.length > 0 && (
        <DropdownMenu
          portal
          menuClassName="min-w-[180px]"
          trigger={({ toggle }) => (
            <IconButton variant="ghost" size="md" onClick={toggle}>
              <IconDots size={16} className="rotate-90" />
            </IconButton>
          )}
          items={menuItems}
        />
      )}
    </div>
  );
}

// Create columns function
export function createUserColumns(
  type: "all" | "deleted",
  onAction: (user: User) => void,
  t: (key: string) => string,
  onView?: (user: User) => void,
  onChangePassword?: (user: User) => void,
  onResendVerification?: (user: User) => void,
  onMarkVerified?: (user: User) => void,
  onMarkUnverified?: (user: User) => void
): Column<User>[] {
  return [
    {
      header: t("table.columns.name"),
      accessor: (user) => (
        <UserName
          profile_image={user.profile_picture}
          first_name={user.first_name}
          last_name={user.last_name}
        />
      ),
    },
    {
      header: t("table.columns.email"),
      accessor: (user) => <UserEmailCell user={user} />,
    },
    {
      header: t("table.columns.phone"),
      accessor: (user) => <span dir="ltr">{user.phone || "—"}</span>,
    },
    {
      header: t("table.columns.status"),
      accessor: (user) => {
        const isVerified = !!user.email_verified_at;
        const variant = getStatusVariant(isVerified);
        const label = isVerified
          ? t("status.verified")
          : t("status.unverified");

        return <Status variant={variant} label={label} />;
      },
    },
    {
      header: t("table.columns.joinedDate"),
      accessor: (user) => formatDate(user.created_at),
    },
    {
      header: t("table.columns.actions"),
      accessor: (user) => (
        <UserActions
          user={user}
          type={type}
          onView={onView}
          onAction={onAction}
          onChangePassword={onChangePassword}
          onResendVerification={onResendVerification}
          onMarkVerified={onMarkVerified}
          onMarkUnverified={onMarkUnverified}
          t={t}
        />
      ),
      align: "right",
    },
  ];
}
