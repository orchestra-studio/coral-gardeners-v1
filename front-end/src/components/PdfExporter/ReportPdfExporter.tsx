"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { IconFileTypePdf } from "@tabler/icons-react";
import { toast } from "react-toastify";

interface ReportPdfExporterProps {
  targetId: string;
  filename?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export default function ReportPdfExporter({
  targetId,
  filename = "coral-gardeners-report",
  className = "",
  variant = "ghost",
  size = "sm",
  disabled = false,
}: ReportPdfExporterProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);

    try {
      // Find the target element
      const element = document.getElementById(targetId);

      if (!element) {
        toast.error(`Element with ID "${targetId}" not found`);
        setIsGenerating(false);
        return;
      }

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
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
      pdf.text("Coral Gardeners Operations Report", 15, 10);

      // Add date
      pdf.setFontSize(10);
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(`Generated: ${today}`, 15, 15);

      // Calculate image dimensions to fit PDF
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add canvas image to PDF
      const imageY = headerHeight + 5; // Below the header
      const availableHeight = pdfHeight - imageY - 10; // Bottom margin

      let finalImgHeight = imgHeight;
      let finalImgWidth = imgWidth;

      // If image is too tall, scale it down
      if (imgHeight > availableHeight) {
        finalImgHeight = availableHeight;
        finalImgWidth = (canvas.width * availableHeight) / canvas.height;
      }

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, imageY, finalImgWidth, finalImgHeight);

      // Generate filename with date
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      const day = String(new Date().getDate()).padStart(2, "0");
      const finalFilename = `${filename}-${year}-${month}-${day}.pdf`;

      // Download the PDF
      pdf.save(finalFilename);

      toast.success("PDF report generated successfully");
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF: " + (error.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isGenerating}
      loading={isGenerating}
      loadingText="Generating PDF..."
      startIcon={!isGenerating && <IconFileTypePdf size={16} />}
      onClick={handleExport}
      className={className}
    >
      Export PDF
    </Button>
  );
}

export { ReportPdfExporter };
