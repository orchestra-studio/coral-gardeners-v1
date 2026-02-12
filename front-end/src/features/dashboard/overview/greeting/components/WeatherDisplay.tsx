import React from "react";
import Image from "next/image";
import { IconCloudRain } from "@tabler/icons-react";
import Skeleton from "@/components/ui/Skeleton";
import { WeatherData } from "../types";

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading: boolean;
  isError: boolean;
  formattedDate: string;
}

/**
 * WeatherDisplay - Shows weather information and location
 */
export function WeatherDisplay({
  weather,
  isLoading,
  isError,
  formattedDate,
}: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <div className="text-right min-w-[220px] sm:min-w-[240px]">
        {/* Row 1: Icon + Temperature Value Skeleton */}
        <div className="flex items-start justify-end gap-3">
          <Skeleton
            width={36}
            height={36}
            rounded="md"
            className="flex-shrink-0"
          />
          <Skeleton width={100} height={36} rounded="md" />
        </div>

        {/* Row 2: Weather Condition (Sunny) Skeleton */}
        <div className="mt-2">
          <Skeleton width={80} height={16} rounded="sm" className="ml-auto" />
        </div>

        {/* Row 3: Location Skeleton */}
        <div className="mt-1">
          <Skeleton width={120} height={16} rounded="sm" className="ml-auto" />
        </div>

        {/* Row 4: Date Skeleton */}
        <div className="mt-0.5">
          <Skeleton width={200} height={16} rounded="sm" className="ml-auto" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-24 w-48">
        <IconCloudRain className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const weatherIconUrl = weather.current.condition.icon
    ? `https:${weather.current.condition.icon}`
    : null;

  return (
    <div className="text-right min-w-[220px] sm:min-w-[240px]">
      {/* Temperature */}
      <div className="flex items-start justify-end gap-3">
        {weatherIconUrl && (
          <Image
            src={weatherIconUrl}
            alt={weather.current.condition.text}
            width={64}
            height={64}
            className="w-16 h-16"
          />
        )}
        <div className="text-end">
          <div className="text-4xl sm:text-5xl font-bold text-[var(--text)]">
            {Math.round(weather.current.temp_c)}°C
          </div>
          <div className="text-sm text-[var(--text-muted)] mt-2">
            {weather.current.condition.text}
          </div>
        </div>
      </div>

      {/* Location & Date */}
      <div className="text-sm text-end text-[var(--text-muted)] mt-1">
        <div className="font-medium">{weather.location.name}</div>
        <div className="capitalize mt-0.5">{formattedDate}</div>
      </div>
    </div>
  );
}
