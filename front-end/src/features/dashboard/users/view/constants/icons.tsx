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
  IconTrash,
} from "@tabler/icons-react";

// Common icon styles
export const ICON_STYLES = {
  muted: { color: "var(--text-muted)" } as React.CSSProperties,
  error: { color: "var(--errorColor, #ef4444)" } as React.CSSProperties,
} as const;

// Icon components with consistent sizing
export const ICONS = {
  verification: (style = ICON_STYLES.muted) => (
    <IconShieldCheck size={18} style={style} />
  ),
  phone: (style = ICON_STYLES.muted) => <IconPhone size={18} style={style} />,
  country: (style = ICON_STYLES.muted) => (
    <IconMapPin size={18} style={style} />
  ),
  email: (style = ICON_STYLES.muted) => <IconMail size={18} style={style} />,
  userId: (style = ICON_STYLES.muted) => <IconHash size={18} style={style} />,
  username: (style = ICON_STYLES.muted) => <IconUser size={18} style={style} />,
  createdAt: (style = ICON_STYLES.muted) => (
    <IconCalendar size={18} style={style} />
  ),
  updatedAt: (style = ICON_STYLES.muted) => (
    <IconClock size={18} style={style} />
  ),
  deletedAt: (style = ICON_STYLES.error) => (
    <IconTrash size={18} style={style} />
  ),
} as const;
