"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "@/components/ui/input";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

export default function PhoneInputDemo() {
  const t = useTranslations("dashboard/ui-component");
  const [phone, setPhone] = useState<string>();

  return (
    <DemoCard
      title={t("components.phoneInput.title")}
      description={t("components.phoneInput.description")}
    >
      <div>
        <div className="max-w-md flex flex-col gap-4">
          <PhoneInput
            label={t("components.phoneInput.labels.phone")}
            value={phone}
            onChange={setPhone}
            placeholder={t("components.phoneInput.placeholders.enterPhone")}
          />
          {phone && (
            <p className="text-sm text-[var(--text)]">
              {t("components.phoneInput.messages.value")}: {phone}
            </p>
          )}
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  placeholder="Enter phone number"
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
