"use client";

import React, { useState } from "react";
import { IconMail, IconShieldCheck } from "@tabler/icons-react";
import type {
  UserIdentityMeta,
  UserVerificationMeta,
} from "../hooks/useUserViewData";
import type { User } from "@/services/users";
import type { QuickStatItem, LayoutInfoItem } from "../utils/dataBuilders";
import UserAvatar from "./UserAvatar";
import UserHeaderInfo from "./UserHeaderInfo";
import QuickStats from "./QuickStats";
import InfoSection from "./InfoSection";
import UserViewActions from "./UserViewActions";

interface UserViewLayoutProps {
  identity: UserIdentityMeta;
  verification: UserVerificationMeta & {
    label: string;
  };
  quickStats: QuickStatItem[];
  contactTitle: string;
  contactItems: LayoutInfoItem[];
  accountTitle: string;
  accountItems: LayoutInfoItem[];
  user: User;
  onChangePassword?: () => void;
  onDelete?: (user: User) => void;
  onRestore?: (user: User) => void;
  onResendVerification?: (user: User) => void;
  onMarkVerified?: (user: User) => void;
  t: (key: string) => string;
}

const cardClass = "bg-[var(--surface)]";

export default function UserViewLayout({
  identity,
  verification,
  quickStats,
  contactTitle,
  contactItems,
  accountTitle,
  accountItems,
  user,
  onChangePassword,
  onDelete,
  onRestore,
  onResendVerification,
  onMarkVerified,
  t,
}: UserViewLayoutProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded-lg ${cardClass}`}>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pt-5">
            <UserAvatar
              identity={identity}
              hasImageError={hasImageError}
              onImageError={() => setHasImageError(true)}
            />

            <UserHeaderInfo identity={identity} verification={verification} />

            {/* Actions positioned on the right */}
            <div className="sm:mb-4">
              <UserViewActions
                user={user}
                onChangePassword={onChangePassword}
                onDelete={onDelete}
                onRestore={onRestore}
                onResendVerification={onResendVerification}
                onMarkVerified={onMarkVerified}
                t={t}
              />
            </div>
          </div>

          <QuickStats stats={quickStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection
          title={accountTitle}
          icon={<IconShieldCheck size={20} />}
          items={accountItems}
        />

        <InfoSection
          title={contactTitle}
          icon={<IconMail size={20} />}
          items={contactItems}
        />
      </div>
    </div>
  );
}
