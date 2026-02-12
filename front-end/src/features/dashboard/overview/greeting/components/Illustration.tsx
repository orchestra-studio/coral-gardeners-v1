import React from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

interface IllustrationProps {
  currentHour: number;
}

/**
 * Illustration - Shows time-based decorative icon
 */
export function Illustration({ currentHour }: IllustrationProps) {
  const isDaytime = currentHour >= 6 && currentHour < 18;

  return (
    <div className="hidden sm:flex items-center justify-center flex-shrink-0">
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center">
        {isDaytime ? (
          <IconSun className="w-20 h-20 text-yellow-500 opacity-20" />
        ) : (
          <IconMoon className="w-20 h-20 text-blue-400 opacity-20" />
        )}
      </div>
    </div>
  );
}
