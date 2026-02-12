"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconSearch, IconRefresh } from "@tabler/icons-react";

interface FilterActionsProps {
  loading?: boolean;
  onReset: () => void;
  filterButtonLabel?: string;
  resetButtonLabel?: string;
}

export default function FilterActions({
  loading,
  onReset,
  filterButtonLabel = "Filter",
  resetButtonLabel = "Reset",
}: FilterActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <Button
        type="submit"
        variant="default"
        size="sm"
        disabled={loading}
        className="flex items-center gap-2"
        startIcon={<IconSearch className="w-4 h-4" />}
      >
        {filterButtonLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={loading}
        className="flex items-center gap-2"
        startIcon={<IconRefresh className="w-4 h-4" />}
      >
        {resetButtonLabel}
      </Button>
    </div>
  );
}
