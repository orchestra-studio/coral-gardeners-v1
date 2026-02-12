import React from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface TimeDisplayProps {
  formattedTime: string;
}

/**
 * TimeDisplay - Shows formatted time with AM/PM
 */
export function TimeDisplay({ formattedTime }: TimeDisplayProps) {
  const timeParts = formattedTime.split(" ");
  const time = timeParts[0];
  const period = timeParts[1];

  // Parse hours and minutes from time string (e.g., "10:30")
  const [hours, minutes] = time.split(":").map(Number);

  return (
    <div className="flex items-baseline gap-2  ">
      <div
        dir="ltr"
        className="text-4xl sm:text-5xl  font-bold text-[var(--text)] tracking-tight flex items-baseline"
      >
        <AnimatedNumber
          value={hours}
          className="tabular-nums"
          willChange={true}
          format={{ minimumIntegerDigits: 2 }}
        />
        <span>:</span>
        <AnimatedNumber
          value={minutes}
          className="tabular-nums"
          willChange={true}
          format={{ minimumIntegerDigits: 2 }}
        />
      </div>
      <span className="text-lg sm:text-xl font-semibold text-[var(--text-muted)] uppercase">
        {period}
      </span>
    </div>
  );
}
