"use client";

import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

interface DonorData {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  lifetimeGiving?: number;
  adoptionCount?: number;
  joinedDate?: string;
  [key: string]: any;
}

interface DonorCsvExporterProps {
  donors: DonorData[];
  filename?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export default function DonorCsvExporter({
  donors,
  filename,
  className = "",
  variant = "ghost",
  size = "sm",
  disabled = false,
}: DonorCsvExporterProps) {
  // Define CSV headers
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Country", key: "country" },
    { label: "Lifetime Giving", key: "lifetimeGiving" },
    { label: "Adoptions", key: "adoptionCount" },
    { label: "Joined Date", key: "joinedDate" },
  ];

  // Generate filename with current date
  const generateFilename = () => {
    if (filename) return filename;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `donors-${year}-${month}-${day}.csv`;
  };

  return (
    <CSVLink
      data={donors}
      headers={headers}
      filename={generateFilename()}
      className={className}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled || !donors || donors.length === 0}
        startIcon={<IconDownload size={16} />}
      >
        Export CSV
      </Button>
    </CSVLink>
  );
}

export { DonorCsvExporter };
