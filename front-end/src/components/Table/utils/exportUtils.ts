/**
 * Utility functions for table export
 * Handles CSV and Image export operations
 */

import { exportToPng } from "@/lib/utils/exportImage";
import type { Column } from "../types";

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

/**
 * Extract plain text value from React nodes or values
 */
export function extractTextValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);

  if (Array.isArray(value)) {
    return value.map((item) => extractTextValue(item)).join(" ");
  }

  if (typeof value === "object" && value !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reactElement = value as any;

    if (reactElement.props?.children !== undefined) {
      return extractTextValue(reactElement.props.children);
    }

    if (reactElement.props?.label !== undefined) {
      return extractTextValue(reactElement.props.label);
    }

    if (reactElement.props?.deployment?.name !== undefined) {
      return String(reactElement.props.deployment.name);
    }

    if (typeof reactElement.toString === "function") {
      const stringValue = reactElement.toString();
      if (stringValue !== "[object Object]") {
        return stringValue;
      }
    }
  }

  return "";
}

/**
 * Convert table data to CSV format
 */
export function convertToCSV<T>(data: T[], columns: Column<T>[]): string {
  const headers = columns.map((col) => `"${col.header}"`).join(",");

  const rows = data.map((item, index) => {
    return columns
      .map((column) => {
        const rawValue =
          typeof column.accessor === "function"
            ? column.accessor(item, index)
            : (item as Record<string, unknown>)[column.accessor as string];

        const value = extractTextValue(rawValue);
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Download text content as file
 */
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ExportToCSVProps<T> {
  data: T[];
  columns: Column<T>[];
  filename: string;
}

export function exportToCSV<T>({ data, columns, filename }: ExportToCSVProps<T>) {
  const csv = convertToCSV(data, columns);
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

export interface ExportToImageProps {
  element: HTMLElement;
  filename: string;
  backgroundColor?: string;
}

export async function exportToImage({
  element,
  filename,
  backgroundColor = "#0a0a0a",
}: ExportToImageProps): Promise<void> {
  if (!isBrowser) return;

  try {
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
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to export image:", error);
    throw new Error("Failed to export table as image");
  }
}