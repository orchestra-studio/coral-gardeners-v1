"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { exportToPng } from "@/lib/utils/exportImage";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface ExportButtonProps extends VariantProps<typeof buttonVariants> {
  targetId?: string;
  filename?: string;
  className?: string;
  translations: {
    button: string;
    image: string;
    imageDescription: string;
    exportingImage: string;
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

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        setIsExporting(false);
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

      setIsExporting(false);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      startIcon={<Download className="h-4 w-4" />}
      disabled={isExporting}
      loading={isExporting}
      loadingText={translations.exportingImage}
      onClick={handleExportPNG}
    >
      {translations.button}
    </Button>
  );
}
