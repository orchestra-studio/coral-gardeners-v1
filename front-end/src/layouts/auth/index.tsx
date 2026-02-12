"use client";

import React from "react";
import Image from "next/image";
import Card from "@/components/Card";
import GridBackground from "@/components/GridBackground";
import DotsPattern from "@/components/DotsPattern";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
}

/**
 * AuthLayout - Single column authentication layout
 * Top: Small illustration/logo
 * Bottom: Authentication form
 */
export default function AuthLayout({
  children,
  title = "Welcome Back",
  subtitle = "Please sign in to continue",
  imageUrl = null,
}: AuthLayoutProps) {
  // Use provided imageUrl or fall back to default
  const imageSrc = imageUrl || "/assets/images/login/login.png";

  return (
    <div className="w-full min-h-[calc(100vh-180px)] flex items-center justify-center py-8 px-4">
      {/* Grid Background */}
      <GridBackground />

      {/* Centered Container */}
      <div className="w-full max-w-md z-10 relative">
        {/* Dots Pattern Overlay */}

        {/* Card Container with Glass Effect */}
        <Card
          glass
          glassIntensity="strong"
          className="relative z-1 overflow-hidden  shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-2xl"
          padding="p-0"
          blur={16}
          saturation={1.8}
          opacity={0.9}
        >
          <DotsPattern
            opacity={0.6}
            dotSize={3}
            spacing={5}
            rotation={40}
            className="z-0"
          />
          <div className="w-full h-full z-1 relative">
            {/* Image on Top - Smaller */}
            <div className="flex items-center justify-center pt-8 pb-4 px-6 ">
              <div className="relative w-15 h-15">
                <Image
                  src={imageSrc}
                  alt="Authentication"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Form Section */}
            <div className="px-6 pb-6 z-1">
              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-[var(--text-heading)]">
                {title}
              </h2>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-sm text-center text-[var(--text-muted)] mt-2 mb-6">
                  {subtitle}
                </p>
              )}

              {/* Form Content */}
              {children}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
