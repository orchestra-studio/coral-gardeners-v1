"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { SHADER_UNIFORMS } from "../config";
import { useSphereGeometry } from "../geometry";
import { useTypingIntensity, useShaderAnimation } from "../hooks";

interface ShaderSphereProps {
  typedText: string;
  segments?: number;
  isDark?: boolean;
}

export function ShaderSphere({
  typedText,
  segments,
  isDark = false,
}: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const intensityRef = useTypingIntensity(typedText);
  const geometry = useSphereGeometry(segments);

  const uniforms = useMemo(
    () => ({
      ...SHADER_UNIFORMS,
      uLightAColor: { value: new THREE.Color(isDark ? "#e5e5e5" : "#f5f5f5") },
      uLightBColor: { value: new THREE.Color(isDark ? "#c0c0c0" : "#d9d9d9") },
      uLightAIntensity: { value: isDark ? 2.0 : 2.2 },
      uLightBIntensity: { value: isDark ? 2.0 : 1.8 },
      uBaseColor: { value: new THREE.Color(isDark ? "#0f1014" : "#e9eefb") },
    }),
    [isDark]
  );

  // Update uniform colors when theme changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uLightAColor.value.set("#01e1ff");
      materialRef.current.uniforms.uLightBColor.value.set(
        isDark ? "#ffffff" : "#292929"
      );

      if (materialRef.current.uniforms.uBaseColor) {
        materialRef.current.uniforms.uBaseColor.value.set(
          isDark ? "#01e1ff" : "#292929"
        );
      }
    }
  }, [isDark]);

  useShaderAnimation(intensityRef, materialRef);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}
