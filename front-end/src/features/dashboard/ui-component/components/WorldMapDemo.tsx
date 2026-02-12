"use client";

import React from "react";
import { useTranslations } from "next-intl";
import WorldMap from "@/components/WorldMap";
import { UserTrafficPoint } from "@/components/WorldMap/types";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface WorldMapDemoProps {
  className?: string;
}

export default function WorldMapDemo({ className }: WorldMapDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  const trafficData: UserTrafficPoint[] = [
    {
      id: "1",
      name: "United States",
      coordinates: [-95, 38],
      visitors: 1250,
      type: "active",
      sessionTime: "2h 15m",
      country: "United States",
      pageViews: 45,
    },
    {
      id: "2",
      name: "United Kingdom",
      coordinates: [-3, 54],
      visitors: 850,
      type: "active",
      sessionTime: "1h 30m",
      country: "United Kingdom",
      pageViews: 32,
    },
    {
      id: "3",
      name: "Germany",
      coordinates: [10, 51],
      visitors: 620,
      type: "active",
      sessionTime: "45m",
      country: "Germany",
      pageViews: 18,
    },
    {
      id: "4",
      name: "Japan",
      coordinates: [138, 36],
      visitors: 440,
      type: "idle",
      sessionTime: "20m",
      country: "Japan",
      pageViews: 12,
    },
  ];

  return (
    <DemoCard
      title={t("components.worldMap.title")}
      description={t("components.worldMap.description")}
      className={className}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden w-full max-h-[400px]">
        <WorldMap
          trafficData={trafficData}
          initialZoom={1}
          minZoom={1}
          maxZoom={4}
          showOnlyActive={false}
          disableMouseWheelZoom={true}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const trafficData = [
  {
    id: "1",
    name: "United States",
    coordinates: [-95, 38],
    visitors: 1250,
    type: "active",
    sessionTime: "2h 15m",
    country: "United States",
    pageViews: 45
  },
  {
    id: "2",
    name: "United Kingdom",
    coordinates: [-3, 54],
    visitors: 850,
    type: "active",
    sessionTime: "1h 30m",
    country: "United Kingdom",
    pageViews: 32
  }
];

<WorldMap
  trafficData={trafficData}
  initialZoom={1}
  showOnlyActive={false}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
