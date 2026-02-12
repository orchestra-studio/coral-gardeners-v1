"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ShaderSphere } from "./components/ShaderSphere";
import { SPHERE_CONFIG } from "./config";
import { Group } from "three";
import { useDarkMode } from "@/hooks/useTheme";

interface InteractiveSphereProps {
  typedText?: string;
  className?: string;
  width?: string;
  height?: string;
  enableInteraction?: boolean;
  segments?: number;
  disableAutoRotate?: boolean;
  showCaptureButton?: boolean;
  onCapture?: (imageUrl: string) => void;
  staticImageUrl?: string;
  enableAnimation?: boolean;
  animationDelay?: number;
}

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += SPHERE_CONFIG.rotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, SPHERE_CONFIG.yOffset, 0]}>
      {children}
    </group>
  );
}

export function InteractiveSphere({
  typedText = "",
  className,
  width = "100%",
  height = "400px",
  enableInteraction = true,
  segments,
  disableAutoRotate = false,
  showCaptureButton = false,
  onCapture,
  staticImageUrl,
  enableAnimation = false,
  animationDelay = 0,
}: InteractiveSphereProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(enableAnimation ? false : true);
  const isDark = useDarkMode();

  useEffect(() => {
    if (enableAnimation) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [enableAnimation, animationDelay]);

  const handleCapture = () => {
    setTimeout(() => {
      const canvas = canvasRef.current?.querySelector("canvas");
      if (canvas) {
        try {
          const imageUrl = canvas.toDataURL("image/png", 1.0);

          if (onCapture) {
            onCapture(imageUrl);
          }

          const link = document.createElement("a");
          link.download = "sphere-avatar.png";
          link.href = imageUrl;
          link.click();
        } catch (error) {
          console.error("Failed to capture sphere image:", error);
        }
      }
    }, 500);
  };

  if (staticImageUrl) {
    return (
      <div className={className} style={{ width, height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={staticImageUrl}
          alt="AI Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0px)" : "blur(8px)",
        transition: "opacity 600ms ease-out, filter 600ms ease-out",
      }}
    >
      <div ref={canvasRef} style={{ width, height }}>
        <Canvas
          key={isDark ? "dark" : "light"} // Force re-render on theme change
          camera={{
            position: SPHERE_CONFIG.cameraPosition,
            fov: SPHERE_CONFIG.cameraFov,
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          {enableInteraction && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.5}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              autoRotate={!disableAutoRotate}
              autoRotateSpeed={5.0}
            />
          )}
          <RotatingGroup>
            <ShaderSphere
              typedText={typedText}
              segments={segments}
              isDark={isDark}
            />
          </RotatingGroup>
        </Canvas>
      </div>
      {showCaptureButton && (
        <button
          onClick={handleCapture}
          className="mt-2 px-4 py-2 text-sm bg-[var(--control-bg)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        >
          Capture Avatar Image
        </button>
      )}
    </div>
  );
}
