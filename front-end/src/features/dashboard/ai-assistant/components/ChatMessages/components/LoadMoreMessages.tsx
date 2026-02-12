"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronsUp } from "lucide-react";

const DEFAULT_BATCH_SIZE = 15;

interface LoadMoreMessagesProps {
  hasMore: boolean;
  remainingCount: number;
  onLoadMore: () => void;
  onLoadAll: () => void;
  isLoading?: boolean;
}

export function LoadMoreMessages({
  hasMore,
  remainingCount,
  onLoadMore,
  onLoadAll,
  isLoading = false,
}: LoadMoreMessagesProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onLoadMore}
        className="gap-2"
        disabled={isLoading}
      >
        <ChevronUp className="h-4 w-4" />
        {isLoading
          ? "Loading..."
          : `Load ${Math.min(
              DEFAULT_BATCH_SIZE,
              Math.max(1, remainingCount)
            )} older messages`}
      </Button>

      {remainingCount > DEFAULT_BATCH_SIZE && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadAll}
          className="gap-2"
          disabled={isLoading}
        >
          <ChevronsUp className="h-4 w-4" />
          {isLoading ? "Loading..." : `Load all (${remainingCount})`}
        </Button>
      )}
    </div>
  );
}
