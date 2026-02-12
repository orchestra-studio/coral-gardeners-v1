/**
 * Icon mappings and constants for project types
 */

import React from "react";
import {
  IconCode,
  IconBrandReact,
  IconDatabase,
  IconCloud,
  IconDeviceMobile,
} from "@tabler/icons-react";

export const PROJECT_ICON_MAP: Record<string, React.ReactNode> = {
  code: <IconCode size={16} />,
  react: <IconBrandReact size={16} />,
  database: <IconDatabase size={16} />,
  cloud: <IconCloud size={16} />,
  mobile: <IconDeviceMobile size={16} />,
};

export const DEFAULT_PROJECT_ICON = <IconCode size={16} />;
export const DEFAULT_PROJECT_IMAGE = "/assets/images/course-management.png";
export const PROJECTS_PER_PAGE = 4;
