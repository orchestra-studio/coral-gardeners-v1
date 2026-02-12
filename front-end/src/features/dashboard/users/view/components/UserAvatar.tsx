"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";

interface UserAvatarProps {
  identity: {
    avatarUrl?: string | null;
    displayName: string;
    initials: string;
  };
  hasImageError: boolean;
  onImageError: () => void;
}

const avatarFallbackClass =
  "w-full h-full rounded-full flex items-center justify-center text-3xl font-bold bg-[var(--primaryColor)]/20 text-[var(--primaryColor)]";
const avatarBorderClass = "border-[var(--surface)]";

export default function UserAvatar({
  identity,
  hasImageError,
  onImageError,
}: UserAvatarProps) {
  const showInitials = !identity.avatarUrl || hasImageError;

  return (
    <div
      className={`relative z-10 w-32 h-32 rounded-full border-4 bg-[var(--surface)] ${avatarBorderClass}`}
    >
      {showInitials ? (
        <div className={avatarFallbackClass}>{identity.initials}</div>
      ) : (
        <img
          src={identity.avatarUrl as string}
          alt={identity.displayName}
          className="w-full h-full rounded-full object-cover"
          onError={onImageError}
        />
      )}
    </div>
  );
}
