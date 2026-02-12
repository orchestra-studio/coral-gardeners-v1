"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import { ExternalLink, ArrowRight, Mail } from "lucide-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface LinkDemoProps {
  className?: string;
}

export default function LinkDemo({ className }: LinkDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.link.title")}
      description={t("components.link.description")}
      className={className}
    >
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.link.sections.variants")}
        </h4>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard" variant="default">
            {t("components.link.labels.default")}
          </Link>
          <Link href="/dashboard" variant="primary">
            {t("components.link.labels.primary")}
          </Link>
          <Link href="/dashboard" variant="underline">
            {t("components.link.labels.underline")}
          </Link>
          <Link href="/dashboard" variant="muted">
            {t("components.link.labels.muted")}
          </Link>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">
          {t("components.link.sections.withIcons")}
        </h4>
        <div className="flex flex-wrap gap-4">
          <Link href="#" variant="primary" endIcon={<ArrowRight size={16} />}>
            {t("components.link.labels.withIcon")}
          </Link>
          <Link
            href="https://example.com"
            variant="default"
            external
            endIcon={<ExternalLink size={16} />}
          >
            {t("components.link.labels.external")}
          </Link>
          <Link
            href="mailto:test@example.com"
            variant="primary"
            startIcon={<Mail size={16} />}
          >
            {t("components.link.labels.email")}
          </Link>
        </div>
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`<Link href="/dashboard" variant="primary">
  Primary Link
</Link>

<Link href="https://example.com" external endIcon={<ExternalLink />}>
  External Link
</Link>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
