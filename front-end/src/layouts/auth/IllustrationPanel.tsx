import React from "react";
import Image from "next/image";

interface IllustrationPanelProps {
  imageSrc: string;
  imageAlt: string;
  blobHeight?: number; // Height for the navy blob shape
}

/**
 * IllustrationPanel - Left side panel with gradient background and illustration
 * Minimalist design without subtitle text
 */
export function IllustrationPanel({
  imageSrc,
  imageAlt,
}: IllustrationPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
      {/* Illustration */}
      <div className="relative z-10 flex items-center justify-center max-w-md w-full">
        <div className="w-full flex items-center justify-center relative">
          {/* Main Image */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={400}
            height={400}
            className="w-full h-auto max-w-sm relative z-10"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.15))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
