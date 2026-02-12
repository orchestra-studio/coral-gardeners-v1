"use client";

import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center transition-opacity duration-300"
      style={{ zIndex: 999999 }}
    >
      <div className="relative">
        {/* Ripple circles */}
        <div className="relative w-16 h-16">
          {/* Ripple effect circles - progressively smaller */}
          <div
            className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"
            style={{ animationTimingFunction: "ease-in-out" }}
          />
          <div
            className="absolute inset-2 border-2 border-white/20 rounded-full animate-ping"
            style={{
              animationDelay: "0.2s",
              animationTimingFunction: "ease-in-out",
            }}
          />
          <div
            className="absolute inset-4 border-2 border-white/10 rounded-full animate-ping"
            style={{
              animationDelay: "0.4s",
              animationTimingFunction: "ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
