"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Table, { Column } from "@/components/Table";
import CollapsibleCode from "@/components/ui/CollapsibleCode";
import DemoCard from "./DemoCard";

interface TableDemoProps {
  className?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export default function TableDemo({ className }: TableDemoProps) {
  const t = useTranslations("dashboard/ui-component");
  const [currentPage, setCurrentPage] = useState(1);

  const sampleData: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Editor",
      status: "inactive",
    },
  ];

  const columns: Column<User>[] = [
    {
      header: t("components.table.columns.name"),
      accessor: "name",
    },
    {
      header: t("components.table.columns.email"),
      accessor: "email",
    },
    {
      header: t("components.table.columns.role"),
      accessor: "role",
    },
    {
      header: t("components.table.columns.status"),
      accessor: (row: User) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            row.status === "active"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <DemoCard
      title={t("components.table.title")}
      description={t("components.table.description")}
      className={className}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={sampleData}
          showPagination
          currentPage={currentPage}
          totalPages={2}
          pageSize={10}
          totalItems={sampleData.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <CollapsibleCode
        defaultOpen={false}
        title={t("components.collapsibleCode.labels.codeExample")}
        code={`const columns = [
  {
    header: "Name",
    accessor: "name"
  },
  {
    header: "Email",
    accessor: "email"
  }
];

<Table
  columns={columns}
  data={data}
  showPagination
  currentPage={currentPage}
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
