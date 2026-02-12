import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SPHERE_CONFIG, ANIMATION_INTENSITY } from "../config";

// Linear interpolation helper
function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
}

export function useShaderAnimation(
    intensityRef: React.RefObject<number>,
    materialRef: React.RefObject<THREE.ShaderMaterial | null>
) {
    // Track current animated values for smooth transitions
    const currentDistortion = useRef(ANIMATION_INTENSITY.baseDistortion);
    const currentDisplacement = useRef(ANIMATION_INTENSITY.baseDisplacement);
    const currentLightIntensity = useRef(ANIMATION_INTENSITY.baseLightIntensity);

    useFrame((state) => {
        if (!materialRef.current) return;

        // Always update time for continuous animation
        materialRef.current.uniforms.uTime.value =
            state.clock.getElapsedTime() * SPHERE_CONFIG.timeScale;

        // Smooth intensity decay (only if intensity exists)
        if (intensityRef.current) {
            intensityRef.current *= SPHERE_CONFIG.intensityDecay;
        }

        const typingIntensity = intensityRef.current || 0;

        // Target values: base animation + typing intensity boost
        const targetDistortion =
            ANIMATION_INTENSITY.baseDistortion +
            typingIntensity * ANIMATION_INTENSITY.distortionMultiplier;
        const targetDisplacement =
            ANIMATION_INTENSITY.baseDisplacement +
            typingIntensity * ANIMATION_INTENSITY.displacementMultiplier;
        const targetLightIntensity =
            ANIMATION_INTENSITY.baseLightIntensity +
            typingIntensity * ANIMATION_INTENSITY.lightIntensityBoost;

        // Slower, smoother transition factor (increased from 0.15 to 0.08)
        const smoothFactor = 0.08;

        // Smoothly interpolate to target values
        currentDistortion.current = lerp(
            currentDistortion.current,
            targetDistortion,
            smoothFactor
        );

        currentDisplacement.current = lerp(
            currentDisplacement.current,
            targetDisplacement,
            smoothFactor
        );

        currentLightIntensity.current = lerp(
            currentLightIntensity.current,
            targetLightIntensity,
            smoothFactor
        );

        // Update shader uniforms with smoothed values
        materialRef.current.uniforms.uDistortionStrength.value =
            currentDistortion.current;

        materialRef.current.uniforms.uDisplacementStrength.value =
            currentDisplacement.current;

        materialRef.current.uniforms.uLightAIntensity.value =
            currentLightIntensity.current;

        materialRef.current.uniforms.uLightBIntensity.value =
            currentLightIntensity.current;
    });
}
