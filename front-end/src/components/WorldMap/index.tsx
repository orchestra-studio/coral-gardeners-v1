"use client";

import { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { cn } from "@/lib/utils";
import ZoomControls from "./ZoomControls";
import VisitorMarkers from "./VisitorMarkers";
import { WorldMapProps, UserTrafficPoint } from "./types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({
  trafficData = [],
  className,
  initialZoom = 1,
  minZoom = 1,
  maxZoom = 4,
  showOnlyActive = true,
  loadingMessage = "Loading map...",
  onUserClick,
  onZoomChange,
  disableMouseWheelZoom = false,
}: WorldMapProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [geographiesCount, setGeographiesCount] = useState(0);
  const mapLoadedRef = useRef(false);
  const geographiesRef = useRef<object[]>([]);

  // Reset loading when component mounts
  useEffect(() => {
    setIsMapLoading(true);
    mapLoadedRef.current = false;
    setGeographiesCount(0);
    geographiesRef.current = [];
  }, []);

  // Update geography count when geographies change
  useEffect(() => {
    if (geographiesRef.current.length > 0 && geographiesCount === 0) {
      setGeographiesCount(geographiesRef.current.length);
    }
  }, [geographiesCount]);

  // Hide loading when geographic data is ready
  useEffect(() => {
    if (geographiesCount > 0 && !mapLoadedRef.current) {
      mapLoadedRef.current = true;
      // Small delay to ensure rendering is complete
      const timer = setTimeout(() => {
        setIsMapLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [geographiesCount]);

  // Notify parent of zoom changes
  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, minZoom));
  };

  const handleZoomReset = () => {
    setZoom(initialZoom);
  };

  const handleVisitorClick = (visitor: UserTrafficPoint) => {
    onUserClick?.(visitor);
  };

  return (
    <div className={cn("w-full h-full flex flex-col relative", className)}>
      {/* World Map */}
      <div className="relative flex-1 min-h-0">
        {/* Loading Spinner - Show until countries are loaded */}
        {isMapLoading && (
          <div className="absolute inset-0 bg-[var(--surface)] rounded-2xl border border-[var(--border)] flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[var(--primaryColor)]/20 border-block-start-[var(--primaryColor)] rounded-full animate-spin"></div>
              <span className="text-[var(--text-muted)] text-xs sm:text-sm">
                {loadingMessage}
              </span>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <ZoomControls
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />

        <div className="w-full h-full bg-[var(--map-container-bg)] rounded-2xl border border-[var(--border-table)] overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            width={800}
            height={500}
            style={{
              width: "100%",
              height: "auto",
              backgroundColor: "var(--map-bg)",
            }}
          >
            <ZoomableGroup
              zoom={zoom}
              center={[0, 0]}
              minZoom={minZoom}
              maxZoom={maxZoom}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  // Store geographies reference without triggering state update
                  if (
                    geographies.length > 0 &&
                    geographiesRef.current.length === 0
                  ) {
                    geographiesRef.current = geographies;
                    // Use setTimeout to update state after render
                    setTimeout(() => {
                      setGeographiesCount(geographies.length);
                    }, 0);
                  }

                  return geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "var(--map-geography-fill)",
                          stroke: "var(--border)",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "var(--map-geography-hover)",
                          stroke: "var(--border)",
                          strokeWidth: 0.7,
                          outline: "none",
                        },
                        pressed: {
                          fill: "var(--map-geography-hover)",
                          stroke: "var(--border)",
                          strokeWidth: 0.7,
                          outline: "none",
                        },
                      }}
                    />
                  ));
                }}
              </Geographies>

              {/* Visitor Traffic Markers */}
              <VisitorMarkers
                trafficData={trafficData}
                zoom={zoom}
                isMapLoading={isMapLoading}
                showOnlyActive={showOnlyActive}
                onVisitorClick={handleVisitorClick}
              />
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}

// Re-export types for convenience
export type { WorldMapProps, UserTrafficPoint } from "./types";
