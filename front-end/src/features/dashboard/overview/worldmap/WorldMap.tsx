"use client";

import WorldMap from "@/components/WorldMap";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { useLocalizedWorldmap } from "./data";

export default function UserTrafficMap() {
  const { userTraffic, translations } = useLocalizedWorldmap();

  return (
    <WidgetCard
      className="p-4 h-full flex-1 max-h-[600px]"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={translations.title}
        description={translations.description}
        action={
          <span className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text)] transition-colors">
            {translations.viewDetails}
          </span>
        }
      />
      <WorldMap
        trafficData={userTraffic}
        initialZoom={1}
        showOnlyActive={true}
        disableMouseWheelZoom={true}
        className="h-[calc(100%-(4rem))]!"
      />
    </WidgetCard>
  );
}
