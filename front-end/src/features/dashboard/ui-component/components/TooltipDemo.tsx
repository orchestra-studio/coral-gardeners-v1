"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function TooltipDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.tooltip.title")}
      description={t("components.tooltip.description")}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.tooltip.sections.positions")}
        </h4>
        <div className="flex flex-wrap gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  {t("components.tooltip.labels.top")}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{t("components.tooltip.messages.tooltipContent")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  {t("components.tooltip.labels.bottom")}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t("components.tooltip.messages.tooltipContent")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  {t("components.tooltip.labels.left")}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t("components.tooltip.messages.tooltipContent")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  {t("components.tooltip.labels.right")}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{t("components.tooltip.messages.tooltipContent")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
