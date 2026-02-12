"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function PopoverDemo() {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.popover.title")}
      description={t("components.popover.description")}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.popover.sections.basic")}
        </h4>
        <div className="flex flex-wrap gap-3 justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {t("components.popover.labels.openPopover")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <h4 className="font-medium text-sm">
                  {t("components.popover.messages.title")}
                </h4>
                <p className="text-sm text-[var(--text-muted)]">
                  {t("components.popover.messages.content")}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
