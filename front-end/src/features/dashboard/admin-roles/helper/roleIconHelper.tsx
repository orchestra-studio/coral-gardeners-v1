import React from "react";
import {
  IconShield,
  IconUsers,
  IconSettings,
  IconCrown,
  IconEye,
  IconUserCheck,
  IconClipboardList,
  IconBook,
  IconHeadset,
  IconChartBar,
  IconCode,
  IconPencil,
  IconDatabase,
  IconWorldWww,
  IconBrandGithub,
  IconUser,
  IconUserCog,
  IconLock,
} from "@tabler/icons-react";

/**
 * Get role icon with container styling based on role name
 * @param roleName - The name of the role
 * @returns JSX element with icon in styled container
 */
export function getRoleIcon(roleName: string): React.ReactNode {
  const name = roleName.toLowerCase();

  // Super Admin / System Admin
  if (name.includes("super") || name.includes("system")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconCrown size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Admin
  if (name.includes("admin")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconShield size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Manager
  if (name.includes("manager")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconSettings size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Supervisor
  if (name.includes("supervisor")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconUsers size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Moderator
  if (name.includes("moderator") || name.includes("mod")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconEye size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Editor / Content Editor
  if (name.includes("editor") || name.includes("content")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconPencil size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Writer / Author
  if (name.includes("writer") || name.includes("author")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconBook size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Support / Help Desk
  if (name.includes("support") || name.includes("help")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconHeadset size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Analyst / Analytics
  if (name.includes("analyst") || name.includes("analytics")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconChartBar size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Developer / Programmer
  if (
    name.includes("developer") ||
    name.includes("dev") ||
    name.includes("programmer")
  ) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconCode size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Database Admin / DBA
  if (name.includes("database") || name.includes("dba")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconDatabase size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Web Admin / Webmaster
  if (name.includes("web") || name.includes("webmaster")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconWorldWww size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // IT / Technical
  if (
    name.includes("it") ||
    name.includes("technical") ||
    name.includes("tech")
  ) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconBrandGithub size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // HR / Human Resources
  if (name.includes("hr") || name.includes("human")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconUserCheck size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Coordinator / Organizer
  if (name.includes("coordinator") || name.includes("organizer")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconClipboardList size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // User Manager / Account Manager
  if (name.includes("account") || name.includes("user")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconUserCog size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Security / Security Officer
  if (name.includes("security") || name.includes("officer")) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconLock size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Guest / Viewer (read-only roles)
  if (
    name.includes("guest") ||
    name.includes("viewer") ||
    name.includes("readonly")
  ) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
        <IconUser size={16} className="text-[var(--text-muted)]" />
      </div>
    );
  }

  // Default fallback for unknown roles
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--control-bg)]">
      <IconShield size={16} className="text-[var(--text-muted)]" />
    </div>
  );
}

/**
 * Get list of all supported role types and their corresponding icons
 * Useful for documentation or role selection interfaces
 */
export const SUPPORTED_ROLES = [
  {
    pattern: "super",
    icon: "IconCrown",
    description: "Super Admin / System Admin",
  },
  { pattern: "admin", icon: "IconShield", description: "Administrator" },
  { pattern: "manager", icon: "IconSettings", description: "Manager" },
  { pattern: "supervisor", icon: "IconUsers", description: "Supervisor" },
  { pattern: "moderator", icon: "IconEye", description: "Moderator" },
  {
    pattern: "editor",
    icon: "IconPencil",
    description: "Editor / Content Editor",
  },
  { pattern: "writer", icon: "IconBook", description: "Writer / Author" },
  {
    pattern: "support",
    icon: "IconHeadset",
    description: "Support / Help Desk",
  },
  {
    pattern: "analyst",
    icon: "IconChartBar",
    description: "Analyst / Analytics",
  },
  {
    pattern: "developer",
    icon: "IconCode",
    description: "Developer / Programmer",
  },
  { pattern: "database", icon: "IconDatabase", description: "Database Admin" },
  {
    pattern: "web",
    icon: "IconWorldWww",
    description: "Web Admin / Webmaster",
  },
  { pattern: "it", icon: "IconBrandGithub", description: "IT / Technical" },
  { pattern: "hr", icon: "IconUserCheck", description: "HR / Human Resources" },
  {
    pattern: "coordinator",
    icon: "IconClipboardList",
    description: "Coordinator",
  },
  { pattern: "user", icon: "IconUserCog", description: "User Manager" },
  { pattern: "security", icon: "IconLock", description: "Security Officer" },
  { pattern: "guest", icon: "IconUser", description: "Guest / Viewer" },
  { pattern: "default", icon: "IconShield", description: "Default Role" },
] as const;
