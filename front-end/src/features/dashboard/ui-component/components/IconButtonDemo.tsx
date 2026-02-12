"use client";

import React from "react";
import { useTranslations } from "next-intl";
import IconButton from "@/components/ui/iconButton";
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconDownload,
  IconSearch,
  IconSettings,
  IconHeart,
  IconStar,
} from "@tabler/icons-react";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface IconButtonDemoProps {
  className?: string;
}

export default function IconButtonDemo({ className }: IconButtonDemoProps) {
  const t = useTranslations("dashboard/ui-component");

  return (
    <DemoCard
      title={t("components.iconButton.title")}
      description={t("components.iconButton.description")}
      className={className}
    >
      {/* Variants */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">
            Variants
          </h4>
          <div className="flex flex-wrap gap-3">
            <IconButton variant="default">
              <IconPlus size={16} />
            </IconButton>
            <IconButton variant="outline">
              <IconEdit size={16} />
            </IconButton>
            <IconButton variant="destructive">
              <IconTrash size={16} />
            </IconButton>
            <IconButton variant="ghost">
              <IconDownload size={16} />
            </IconButton>
            <IconButton variant="secondary">
              <IconSettings size={16} />
            </IconButton>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">
            Sizes
          </h4>
          <div className="flex items-center flex-wrap gap-3">
            <IconButton size="sm" variant="ghost">
              <IconSearch size={14} />
            </IconButton>
            <IconButton size="md" variant="ghost">
              <IconHeart size={16} />
            </IconButton>
            <IconButton size="lg" variant="ghost">
              <IconStar size={20} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`import IconButton from "@/components/ui/iconButton";
import { IconEdit } from "@tabler/icons-react";

<IconButton variant="outline">
  <IconEdit size={16} />
</IconButton>

// Different sizes
<IconButton size="sm" variant="ghost">
  <IconSearch size={14} />
</IconButton>
<IconButton size="md" variant="ghost">
  <IconHeart size={16} />
</IconButton>
<IconButton size="lg" variant="ghost">
  <IconStar size={20} />
</IconButton>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
