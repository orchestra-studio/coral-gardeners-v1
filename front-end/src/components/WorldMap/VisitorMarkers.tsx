import React from "react";
import { Marker } from "react-simple-maps";
import { VisitorMarkersProps } from "./types";

export default function VisitorMarkers({
  trafficData,
  zoom,
  isMapLoading,
  showOnlyActive,
  onVisitorClick,
}: VisitorMarkersProps) {
  // Filter traffic data based on showOnlyActive prop
  const filteredTrafficData = showOnlyActive
    ? trafficData.filter((visitor) => visitor.type === "active")
    : trafficData;

  if (isMapLoading) {
    return null;
  }

  return (
    <>
      {filteredTrafficData.map((visitor) => {
        // Scale radius with zoom (minimal growth). Base outer 10, inner 5 at zoom 1.
        const scaleFactor = 1 + ((zoom < 2 ? zoom + 4 : zoom - 1) - 1) * 0.15; // 15% growth per extra zoom level
        const outerR = 10 * scaleFactor;
        const innerR = 5 * scaleFactor;

        return (
          <Marker
            key={visitor.id}
            coordinates={visitor.coordinates}
            onClick={() => onVisitorClick(visitor)}
          >
            <g
              className="cursor-pointer"
              style={{
                filter: "drop-shadow(0 0 2px rgba(59,130,246,0.4))",
              }}
            >
              <circle
                r={outerR}
                fill={
                  visitor.type === "active"
                    ? "var(--insight-primary)"
                    : "var(--insight-danger)"
                }
                fillOpacity={0.28}
                style={{
                  animation:
                    visitor.type === "active"
                      ? "ping-slow 3.2s ease-in-out infinite"
                      : "none",
                }}
              />
              <circle
                r={innerR}
                fill={
                  visitor.type === "active"
                    ? "var(--insight-primary)"
                    : "var(--insight-danger)"
                }
              />
              <title>
                {visitor.type === "active" ? "Live viewer" : "Idle viewer"}
              </title>
            </g>
          </Marker>
        );
      })}

      {/* Local animation keyframes for smoother slow ping */}
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(0.6);
            opacity: 0.55;
          }
          60% {
            transform: scale(1.8);
            opacity: 0;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
