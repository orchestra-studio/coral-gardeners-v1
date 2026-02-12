import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ShaderMaterial, Color } from "three";

interface SphereMaterialProps {
  distortionStrength: number;
  distortionFrequency: number;
  displacementStrength: number;
  displacementFrequency: number;
  fresnelOffset: number;
  fresnelMultiplier: number;
  fresnelPower: number;
  colorA: string;
  colorB: string;
  timeScale: number;
  reactiveFactor: number;
  vertexShader: string;
  fragmentShader: string;
}

export function SphereMaterial(props: SphereMaterialProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const {
    distortionStrength,
    distortionFrequency,
    displacementStrength,
    displacementFrequency,
    fresnelOffset,
    fresnelMultiplier,
    fresnelPower,
    colorA,
    colorB,
    timeScale,
    reactiveFactor,
    vertexShader,
    fragmentShader,
  } = props;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistortionStrength: { value: distortionStrength },
      uDistortionFrequency: { value: distortionFrequency },
      uDisplacementStrength: { value: displacementStrength },
      uDisplacementFrequency: { value: displacementFrequency },
      uFresnelOffset: { value: fresnelOffset },
      uFresnelMultiplier: { value: fresnelMultiplier },
      uFresnelPower: { value: fresnelPower },
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
    }),
    [
      distortionStrength,
      distortionFrequency,
      displacementStrength,
      displacementFrequency,
      fresnelOffset,
      fresnelMultiplier,
      fresnelPower,
      colorA,
      colorB,
    ]
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    // Time progression modulated by reactivity
    uniforms.uTime.value += delta * timeScale * (0.5 + reactiveFactor * 1.5);

    // Strengths dynamically modulated to emphasize “high” energy behavior
    uniforms.uDistortionStrength.value =
      distortionStrength * (0.6 + reactiveFactor * 0.8);
    uniforms.uDisplacementStrength.value =
      displacementStrength * (0.6 + reactiveFactor * 1.2);
    uniforms.uFresnelMultiplier.value =
      fresnelMultiplier * (0.7 + reactiveFactor * 1.3);
  });

  return (
    <shaderMaterial
      ref={materialRef}
      args={[{ uniforms, vertexShader, fragmentShader }]}
      transparent={false}
    />
  );
}
