"use client";

import React, { useState } from "react";
import { IconPhoto } from "@tabler/icons-react";

interface ProjectImageProps {
  image: string | null;
  name: string;
}

export default function ProjectImage({ image, name }: ProjectImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="w-32 h-32 rounded-md overflow-hidden bg-[var(--surface-hover)] flex-shrink-0 border border-[var(--border)]">
      {image && !hasImageError ? (
        <div className="w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full"
            onError={() => setHasImageError(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconPhoto size={48} className="text-[var(--text-muted)]" />
        </div>
      )}
    </div>
  );
}
