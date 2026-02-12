"use client";

import React from "react";
import { useTranslations } from "next-intl";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import Skeleton from "@/components/ui/Skeleton";
import DemoCard from "./DemoCard";

interface SkeletonDemoProps {
  className?: string;
}

export default function SkeletonDemo({ className }: SkeletonDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.skeleton.title")}
      description={t("components.skeleton.description")}
      className={className}
    >
      {/* Text Skeletons */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.skeleton.sections.text")}
        </h4>
        <div className="flex flex-col gap-3">
          <Skeleton width="100%" height={20} />
          <Skeleton width="80%" height={20} />
          <Skeleton width="60%" height={20} />
        </div>
      </div>

      {/* Card Skeleton */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.skeleton.sections.card")}
        </h4>
        <div className="flex flex-col gap-3">
          <Skeleton width="100%" height={120} />
          <div className="flex gap-3">
            <Skeleton width={60} height={60} />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton width="100%" height={16} />
              <Skeleton width="70%" height={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Skeleton width="100%" height={20} />`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
