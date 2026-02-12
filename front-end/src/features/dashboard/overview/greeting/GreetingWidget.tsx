"use client";

import React from "react";
import { useWeatherByLocation } from "@/services/greeting";
import WidgetCard from "../common/WidgetCard";

// Hooks
import { useCurrentTime } from "./hooks/useCurrentTime";
import { useGreeting } from "./hooks/useGreeting";
import { useTimeFormatting } from "./hooks/useTimeFormatting";

// Components
import { GreetingHeader } from "./components/GreetingHeader";
import { TimeDisplay } from "./components/TimeDisplay";
import { WeatherDisplay } from "./components/WeatherDisplay";

// Types
import { GreetingWidgetProps } from "./types";

/**
 * GreetingWidget - Displays personalized greeting with weather
 * Shows time-based greeting message and current weather conditions
 */
export function GreetingWidget({
  userName = "User",
  greetingMessages,
  locale = "en",
}: GreetingWidgetProps) {
  // Hooks
  const currentTime = useCurrentTime();
  const greeting = useGreeting(currentTime, greetingMessages);
  const { formattedTime, formattedDate } = useTimeFormatting(
    currentTime,
    locale
  );
  const { data: weather, isLoading, isError } = useWeatherByLocation(locale);

  return (
    <WidgetCard className="p-0" lightingWidth={2100} lightingHeight={1200}>
      {/* Background Gradient Ellipse */}
      <div className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none overflow-hidden">
        <div
          className="absolute pointer-events-none animate-fade-in -top-1/2 end-0 w-[35%] h-[80%] rounded-[50%] blur-[90px]"
          style={{
            background:
              "linear-gradient(135deg, var(--insight-primary) 0%, rgba(0, 0, 0, 0) 100%)",
            animation: "fadeIn 1s ease-in-out",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="relative w-full z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
        {/* Left Section - Greeting & Time */}
        <div className="flex-1 space-y-3 ">
          <GreetingHeader
            greeting={greeting}
            userName={userName}
            subtitle={greetingMessages.subtitle || "Keep growing and learning!"}
          />
          <TimeDisplay formattedTime={formattedTime} />
        </div>

        {/* Right Section - Weather */}
        <div className="flex-1 space-y-2 ">
          <WeatherDisplay
            weather={weather || null}
            isLoading={isLoading}
            isError={isError}
            formattedDate={formattedDate}
          />
        </div>
      </div>
    </WidgetCard>
  );
}

export default GreetingWidget;
