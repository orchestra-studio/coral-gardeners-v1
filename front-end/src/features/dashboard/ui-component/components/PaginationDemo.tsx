"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Pagination from "@/components/ui/Pagination";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface PaginationDemoProps {
  className?: string;
}

export default function PaginationDemo({ className }: PaginationDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <DemoCard
      title={t("components.pagination.title")}
      description={t("components.pagination.description")}
      className={className}
    >
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={10}
        totalItems={100}
        onPageChange={setCurrentPage}
      />

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const [currentPage, setCurrentPage] = useState(1);

<Pagination
  currentPage={currentPage}
  totalPages={10}
  pageSize={10}
  totalItems={100}
  onPageChange={setCurrentPage}
/>`}
        copyLabel={t("components.collapsibleCode.labels.copy")}
        copiedLabel={t("components.collapsibleCode.labels.copied")}
        copyAriaLabel={t("components.collapsibleCode.aria.copy")}
        copiedAriaLabel={t("components.collapsibleCode.aria.copied")}
      />
    </DemoCard>
  );
}
