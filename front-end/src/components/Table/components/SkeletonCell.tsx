import React from "react";
import Skeleton from "@/components/ui/Skeleton";

interface SkeletonCellProps {
  align?: "left" | "center" | "right";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  height?: "sm" | "md" | "lg";
}

const widthClasses = {
  sm: "w-16",
  md: "w-24",
  lg: "w-32",
  xl: "w-48",
  full: "w-full",
};

const heightClasses = {
  sm: "h-4",
  md: "h-5",
  lg: "h-6",
};

export default function SkeletonCell({
  align = "left",
  width = "md",
  height = "md",
}: SkeletonCellProps) {
  return (
    <td
      className={`p-2 sm:p-3 lg:p-4 ${
        align === "right"
          ? "text-end"
          : align === "center"
          ? "text-center"
          : "text-start"
      }`}
    >
      <Skeleton
        className={`${widthClasses[width]} ${heightClasses[height]} ${
          align === "center" ? "mx-auto" : align === "right" ? "ms-auto" : ""
        }`}
      />
    </td>
  );
}
