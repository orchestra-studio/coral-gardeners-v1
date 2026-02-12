"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MagicCard } from "@/components/ui/MagicCard";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface MagicCardDemoProps {
  className?: string;
}

export default function MagicCardDemo({ className }: MagicCardDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  const cards = [
    {
      id: "color",
      label: t("components.magicCard.modes.color"),
      props: {
        glowVariant: "chromatic" as const,
      },
    },
    {
      id: "monochrome",
      label: t("components.magicCard.modes.monochrome"),
      props: {
        glowVariant: "monochrome" as const,
      },
    },
  ];

  return (
    <DemoCard
      title={t("components.magicCard.title")}
      description={t("components.magicCard.description")}
      className={className}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.magicCard.sections.modes")}
        </h4>
        <div className="flex flex-wrap gap-5 justify-center">
          {cards.map(({ id, label, props }) => (
            <MagicCard key={id} size="sm" {...props}>
              <div className="flex h-full items-center justify-center text-center">
                <h4 className="text-lg font-semibold tracking-wide">{label}</h4>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<MagicCard size="md">
  <div className="p-6">
    <h3>Chromatic Glow</h3>
  </div>
</MagicCard>

<MagicCard glowVariant="monochrome" size="md">
  <div className="p-6">
    <h3>Monochrome Glow</h3>
  </div>
</MagicCard>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
