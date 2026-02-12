import React from "react";
import { Column } from "../types";
import SkeletonCell from "./SkeletonCell";

interface SkeletonRowProps<T> {
  columns: Column<T>[];
  rowIndex: number;
}

// Function to determine skeleton cell width based on column header content
const getSkeletonWidth = (
  header: string,
  index: number
): "sm" | "md" | "lg" | "xl" | "full" => {
  const headerLower = header.toLowerCase();

  // Actions column (usually last)
  if (headerLower.includes("action") || headerLower.includes("إجراء")) {
    return "sm";
  }

  // Date columns
  if (
    headerLower.includes("date") ||
    headerLower.includes("تاريخ") ||
    headerLower.includes("created") ||
    headerLower.includes("updated")
  ) {
    return "md";
  }

  // Email columns
  if (headerLower.includes("email") || headerLower.includes("بريد")) {
    return "xl";
  }

  // Name columns (usually first column)
  if (
    index === 0 ||
    headerLower.includes("name") ||
    headerLower.includes("اسم")
  ) {
    return "lg";
  }

  // Phone/contact columns
  if (
    headerLower.includes("phone") ||
    headerLower.includes("هاتف") ||
    headerLower.includes("contact")
  ) {
    return "md";
  }

  // Role/permission columns
  if (
    headerLower.includes("role") ||
    headerLower.includes("permission") ||
    headerLower.includes("دور") ||
    headerLower.includes("صلاحية")
  ) {
    return "lg";
  }

  // Users/count columns
  if (
    headerLower.includes("user") ||
    headerLower.includes("count") ||
    headerLower.includes("مستخدم")
  ) {
    return "sm";
  }

  // Default
  return "md";
};

export default function SkeletonRow<T>({
  columns,
  rowIndex,
}: SkeletonRowProps<T>) {
  return (
    <tr
      className="bg-[var(--surface)] animate-pulse"
      style={{
        animationDelay: `${rowIndex * 50}ms`, // Stagger animation
        animationDuration: "1.5s",
      }}
    >
      {columns.map((column, colIndex) => (
        <SkeletonCell
          key={colIndex}
          align={column.align}
          width={getSkeletonWidth(column.header, colIndex)}
          height="md"
        />
      ))}
    </tr>
  );
}
