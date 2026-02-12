"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { IconPhoto, IconFileTypePdf } from "@tabler/icons-react";
import { exportToPng } from "@/lib/utils/exportImage";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

type ExportFormat = "image" | "pdf";

interface ExportButtonProps extends VariantProps<typeof buttonVariants> {
  targetId?: string;
  filename?: string;
  className?: string;
  translations: {
    button: string;
    image: string;
    imageDescription: string;
    exportingImage: string;
    pdf?: string;
    pdfDescription?: string;
    exportingPdf?: string;
  };
}

export function ExportButton({
  targetId = "dashboard-content",
  filename = "dashboard",
  className,
  variant = "outline",
  size = "default",
  translations,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleExportPNG = async () => {
    setIsExporting(true);
    setExportingFormat("image");
    setIsOpen(false);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        toast.error(`Element with id "${targetId}" not found`);
        setIsExporting(false);
        setExportingFormat(null);
        return;
      }

      // Get background color from CSS variable
      const backgroundColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim() || "#0a0a0a";

      const pixelRatio = Math.max(2, window.devicePixelRatio || 1);

      const dataUrl = await exportToPng(element, {
        pixelRatio,
        cacheBust: true,
        backgroundColor,
        quality: 1,
        filter: (node) => {
          if (!(node instanceof Element)) return true;
          const tagName = node.tagName.toLowerCase();
          return tagName !== "iframe" && tagName !== "video";
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${filename}-${
        new Date().toISOString().split("T")[0]
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image exported successfully");
      setIsExporting(false);
      setExportingFormat(null);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      toast.error("Failed to export image");
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportingFormat("pdf");
    setIsOpen(false);

    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        toast.error(`Element with id "${targetId}" not found`);
        setIsExporting(false);
        setExportingFormat(null);
        return;
      }

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create PDF in landscape A4 format
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // A4 landscape dimensions in mm
      const pdfWidth = 297;
      const pdfHeight = 210;

      // Add header
      const headerHeight = 15;
      pdf.setFontSize(16);
      pdf.text("Coral Gardeners Dashboard Report", 15, 10);

      // Add date
      pdf.setFontSize(10);
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(`Generated: ${today}`, 15, 15);

      // Calculate image dimensions
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imageY = headerHeight + 5;
      const availableHeight = pdfHeight - imageY - 10;

      let finalImgHeight = imgHeight;
      let finalImgWidth = imgWidth;

      if (imgHeight > availableHeight) {
        finalImgHeight = availableHeight;
        finalImgWidth = (canvas.width * availableHeight) / canvas.height;
      }

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, imageY, finalImgWidth, finalImgHeight);

      // Download
      const finalFilename = `${filename}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(finalFilename);

      toast.success("PDF exported successfully");
      setIsExporting(false);
      setExportingFormat(null);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        startIcon={!isExporting && <Download className="h-4 w-4" />}
        disabled={isExporting}
        loading={isExporting}
        loadingText={
          exportingFormat === "pdf"
            ? (translations.exportingPdf || "Exporting PDF...")
            : translations.exportingImage
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        {translations.button}
      </Button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-lg z-50 overflow-hidden">
          <button
            onClick={handleExportPNG}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors text-left"
          >
            <IconPhoto size={18} className="text-blue-500" />
            <div>
              <div className="font-medium">{translations.image}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {translations.imageDescription}
              </div>
            </div>
          </button>
          {translations.pdf && (
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors text-left border-t border-[var(--border)]"
            >
              <IconFileTypePdf size={18} className="text-red-500" />
              <div>
                <div className="font-medium">{translations.pdf}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {translations.pdfDescription || "Download PDF report"}
                </div>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
