"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import type { AdminIdentityMeta } from "../hooks/useAdminViewData";

interface AdminAvatarProps {
  identity: AdminIdentityMeta;
  hasImageError: boolean;
  onImageError: () => void;
}

const avatarFallbackClass =
  "w-full h-full rounded-full flex items-center justify-center text-3xl font-bold bg-[var(--primaryColor)]/20 text-[var(--primaryColor)]";
const avatarBorderClass = "border-[var(--surface)]";

export function AdminAvatar({
  identity,
  hasImageError,
  onImageError,
}: AdminAvatarProps) {
  const showInitials = !identity.avatar || hasImageError;

  // Generate initials from display name
  const initials = identity.displayName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative z-10 w-24 h-24 rounded-full border-4 bg-[var(--surface)] ${avatarBorderClass}`}
    >
      {showInitials ? (
        <div className={avatarFallbackClass}>{initials}</div>
      ) : (
        <img
          src={identity.avatar as string}
          alt={identity.displayName}
          className="w-full h-full rounded-full object-cover"
          onError={onImageError}
        />
      )}
    </div>
  );
}
