import { IconWorld, IconPlus, IconMinus } from "@tabler/icons-react";
import { ZoomControlsProps } from "./types";
import IconButton from "@/components/ui/iconButton";

export default function ZoomControls({
  zoom,
  minZoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ZoomControlsProps) {
  return (
    <div className="absolute top-2 sm:top-4 end-2 sm:end-4 z-10 flex flex-col gap-1.5 sm:gap-2">
      <IconButton
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        size="md"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-md"
      >
        <IconPlus className="w-4 h-4" />
      </IconButton>
      <IconButton
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        size="md"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-md"
      >
        <IconMinus className="w-4 h-4" />
      </IconButton>
      <IconButton
        onClick={onZoomReset}
        size="md"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-md"
      >
        <IconWorld className="w-4 h-4" />
      </IconButton>
    </div>
  );
}
