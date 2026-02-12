"use client";

import { useDirection } from "@/hooks/locale/useDirection";

export default function LocaleHandler() {
  // This will automatically handle HTML dir and lang attributes
  useDirection();

  return null; // This component doesn't render anything
}
