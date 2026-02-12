"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Sheet from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function SheetDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <>
      <DemoCard
        title={t("components.sheet.title")}
        description={t("components.sheet.description")}
      >
        <div>
          <h4 className="text-sm font-medium text-[var(--text)] mb-3">
            {t("components.sheet.sections.sides")}
          </h4>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setOpenStart(true)} variant="outline">
              {t("components.sheet.labels.openStart")}
            </Button>
            <Button onClick={() => setOpenEnd(true)} variant="outline">
              {t("components.sheet.labels.openEnd")}
            </Button>
          </div>
        </div>

        <CollapsibleCode
          defaultOpen={false}
          title={t("components.collapsibleCode.labels.codeExample")}
          code={`<Sheet
  open={open}
  onClose={() => setOpen(false)}
  title="Sheet Title"
  side="end"
>
  <p>Sheet content goes here</p>
</Sheet>`}
          copyLabel={t("components.collapsibleCode.labels.copy")}
          copiedLabel={t("components.collapsibleCode.labels.copied")}
          copyAriaLabel={t("components.collapsibleCode.aria.copy")}
          copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
        />
      </DemoCard>

      {/* Sheets */}
      <Sheet
        open={openStart}
        onClose={() => setOpenStart(false)}
        title={t("components.sheet.messages.startTitle")}
        side="start"
        actions={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpenStart(false)}>
              {t("components.sheet.labels.cancel")}
            </Button>
            <Button onClick={() => setOpenStart(false)}>
              {t("components.sheet.labels.save")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[var(--text)]">
            {t("components.sheet.messages.content")}
          </p>
        </div>
      </Sheet>

      <Sheet
        open={openEnd}
        onClose={() => setOpenEnd(false)}
        title={t("components.sheet.messages.endTitle")}
        side="end"
        actions={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpenEnd(false)}>
              {t("components.sheet.labels.cancel")}
            </Button>
            <Button onClick={() => setOpenEnd(false)}>
              {t("components.sheet.labels.save")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[var(--text)]">
            {t("components.sheet.messages.content")}
          </p>
        </div>
      </Sheet>
    </>
  );
}
