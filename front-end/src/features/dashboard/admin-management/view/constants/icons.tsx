import React from "react";
import {
  IconCalendar,
  IconClock,
  IconHash,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShieldCheck,
  IconUser,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

// Common icon styles
export const ADMIN_ICON_STYLES = {
  muted: { color: "var(--text-muted)" } as React.CSSProperties,
  success: { color: "var(--successColor, #10b981)" } as React.CSSProperties,
  error: { color: "var(--errorColor, #ef4444)" } as React.CSSProperties,
} as const;

// Icon components with consistent sizing for admin view
export const ADMIN_ICONS = {
  // Contact icons
  email: (style = ADMIN_ICON_STYLES.muted) => (
    <IconMail size={18} style={style} />
  ),
  phone: (style = ADMIN_ICON_STYLES.muted) => (
    <IconPhone size={18} style={style} />
  ),
  country: (style = ADMIN_ICON_STYLES.muted) => (
    <IconMapPin size={18} style={style} />
  ),

  // Account icons
  adminId: (style = ADMIN_ICON_STYLES.muted) => (
    <IconHash size={18} style={style} />
  ),
  username: (style = ADMIN_ICON_STYLES.muted) => (
    <IconUser size={18} style={style} />
  ),
  createdAt: (style = ADMIN_ICON_STYLES.muted) => (
    <IconCalendar size={18} style={style} />
  ),
  updatedAt: (style = ADMIN_ICON_STYLES.muted) => (
    <IconClock size={18} style={style} />
  ),
  roles: (style = ADMIN_ICON_STYLES.muted) => (
    <IconShieldCheck size={18} style={style} />
  ),

  // Status icons
  active: (style = ADMIN_ICON_STYLES.success) => (
    <IconCheck size={18} style={style} />
  ),
  inactive: (style = ADMIN_ICON_STYLES.error) => (
    <IconX size={18} style={style} />
  ),
  shield: (style = ADMIN_ICON_STYLES.muted) => (
    <IconShieldCheck size={18} style={style} />
  ),

  // Legacy string mapping for backward compatibility
  mail: (style = ADMIN_ICON_STYLES.muted) => (
    <IconMail size={18} style={style} />
  ),
  user: (style = ADMIN_ICON_STYLES.muted) => (
    <IconUser size={18} style={style} />
  ),
  calendar: (style = ADMIN_ICON_STYLES.muted) => (
    <IconCalendar size={18} style={style} />
  ),
  clock: (style = ADMIN_ICON_STYLES.muted) => (
    <IconClock size={18} style={style} />
  ),
  world: (style = ADMIN_ICON_STYLES.muted) => (
    <IconMapPin size={18} style={style} />
  ),
  check: (style = ADMIN_ICON_STYLES.success) => (
    <IconCheck size={18} style={style} />
  ),
  x: (style = ADMIN_ICON_STYLES.error) => <IconX size={18} style={style} />,
} as const;

// Helper function to get icon by string name (for backward compatibility)
export function getAdminIcon(iconName: string): React.ReactNode {
  const iconFunction = ADMIN_ICONS[iconName as keyof typeof ADMIN_ICONS];
  return iconFunction ? iconFunction() : ADMIN_ICONS.user();
}
