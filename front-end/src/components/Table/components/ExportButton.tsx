/**
 * Export Button Component
 * Dropdown button for exporting table data as CSV or Image
 */

import React, { useState, useRef, useEffect } from "react";
import { IconDownload, IconFileTypeCsv, IconPhoto } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ExportFormat } from "../hooks/useTableExport";

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  translations?: {
    button?: string;
    csv?: string;
    csvDescription?: string;
    image?: string;
    imageDescription?: string;
    exportingCsv?: string;
    exportingImage?: string;
  };
}

export default function ExportButton({
  onExport,
  disabled = false,
  className = "",
  translations = {
    button: "Export",
    csv: "Export as CSV",
    csvDescription: "Download spreadsheet",
    image: "Export as Image",
    imageDescription: "Download PNG",
    exportingCsv: "Exporting CSV...",
    exportingImage: "Exporting Image...",
  },
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportingFormat(format);
    setIsOpen(false);

    try {
      await onExport(format);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        variant="ghost"
        size="sm"
        loading={isExporting}
        loadingText={
          exportingFormat === "csv"
            ? translations.exportingCsv
            : translations.exportingImage
        }
        startIcon={!isExporting && <IconDownload size={16} />}
      >
        {translations.button}
      </Button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => handleExport("csv")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors text-left"
          >
            <IconFileTypeCsv size={18} className="text-green-500" />
            <div>
              <div className="font-medium">{translations.csv}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {translations.csvDescription}
              </div>
            </div>
          </button>
          <button
            onClick={() => handleExport("image")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors text-left border-t border-[var(--border)]"
          >
            <IconPhoto size={18} className="text-blue-500" />
            <div>
              <div className="font-medium">{translations.image}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {translations.imageDescription}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
