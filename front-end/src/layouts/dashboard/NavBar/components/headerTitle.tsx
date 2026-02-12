import { useLocale } from "@/hooks/locale/useLocale";
import { NAV_CONFIG_RAW } from "../../sidebar/config/navigationData";
import type { HeaderTitleProps } from "../types";
import type { MultilingualText } from "../../sidebar/config/navigationData";

// Helper function to find title for a route
const findTitleForRoute = (route: string): MultilingualText | null => {
  for (const item of NAV_CONFIG_RAW) {
    if (item.type === "item" && item.route === route) {
      return item.title;
    }
    if (item.type === "parent") {
      if (item.route === route) return item.title;

      for (const child of item.children) {
        if (child.route === route) return child.title;
      }
    }
  }
  return null;
};

export default function HeaderTitle({ currentRoute }: HeaderTitleProps) {
  const locale = useLocale();
  const titleData = findTitleForRoute(currentRoute);

  // If we have title data, use it; otherwise fallback to route name
  const displayTitle = titleData
    ? titleData[locale as keyof MultilingualText] || titleData.en
    : currentRoute;

  return (
    <h2 className="text-xl font-semibold text-[var(--text)]">{displayTitle}</h2>
  );
}
