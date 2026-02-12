"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface UserNameProps {
  profile_image?: string | null;
  first_name: string;
  last_name?: string;
  username?: string;
  email?: string;
  roles?: string[];
  isTrusted?: boolean;
  avatarSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function UserName({
  profile_image,
  first_name,
  last_name = "",
  username,
  email,
  roles = [],
  isTrusted = false,
  avatarSize = "md",
  className = "",
}: UserNameProps) {
  const fullName = `${first_name} ${last_name}`.trim();

  // Avatar size configurations
  const avatarSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const avatarClasses = avatarSizes[avatarSize];
  const textSizeClass = textSizes[avatarSize];

  return (
    <div className={cn("flex items-center gap-3 min-w-[180px]", className)}>
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        {profile_image ? (
          <Image
            src={profile_image}
            alt={fullName}
            width={
              avatarSize === "sm"
                ? 32
                : avatarSize === "md"
                ? 40
                : avatarSize === "lg"
                ? 48
                : 64
            }
            height={
              avatarSize === "sm"
                ? 32
                : avatarSize === "md"
                ? 40
                : avatarSize === "lg"
                ? 48
                : 64
            }
            className={`${avatarClasses} rounded-full object-cover border border-[var(--border)]`}
          />
        ) : (
          <div
            className={`${avatarClasses} rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center`}
          >
            <span
              className={`${textSizeClass} font-medium text-[var(--text-muted)]`}
            >
              {first_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Trusted Badge */}
        {isTrusted && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface)]" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[var(--text)] truncate">
          {fullName}
        </div>

        {/* Username */}
        {username && (
          <div className="text-sm text-[var(--text-muted)] truncate mt-0.5">
            @{username}
          </div>
        )}

        {/* Email */}
        {email && !username && (
          <div className="text-sm text-[var(--text-muted)] truncate mt-0.5">
            {email}
          </div>
        )}

        {/* Roles */}
        {roles && roles.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {roles.map((role, index) => (
              <Badge key={index} variant="default" size="sm">
                {role}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
