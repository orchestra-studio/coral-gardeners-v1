import * as THREE from "three";

export const SPHERE_CONFIG = {
    // Geometry
    radius: 2,
    segments: 64,

    // Animation
    timeScale: 0.3,
    intensityDecay: 0.9,
    maxTypingSpeed: 8,
    rotationSpeed: 5.0,

    // Camera
    cameraPosition: [0, 0, 5] as [number, number, number],
    cameraFov: 50,

    // Position
    yOffset: -0.5,
};

export const SHADER_UNIFORMS = {
    uTime: { value: 0 },
    uLightAColor: { value: new THREE.Color("#e5e5e5") },
    uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
    uLightAIntensity: { value: 2.0 },
    uLightBColor: { value: new THREE.Color("#c0c0c0") },
    uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
    uLightBIntensity: { value: 2.0 },
    uBaseColor: { value: new THREE.Color("#0f1014") },
    uSubdivision: { value: new THREE.Vector2(64, 64) },
    uOffset: { value: new THREE.Vector3(0, 0, 0) },
    uDistortionFrequency: { value: 0.8 },
    uDistortionStrength: { value: 0.15 },
    uDisplacementFrequency: { value: 0.8 },
    uDisplacementStrength: { value: 0.1 },
    uFresnelOffset: { value: -1.6 },
    uFresnelMultiplier: { value: 3.587 },
    uFresnelPower: { value: 2.5 },
};

export const ANIMATION_INTENSITY = {
    // Base idle animation
    baseDistortion: 0.15,
    baseDisplacement: 0.1,
    baseLightIntensity: 2.0,

    // Typing boost multipliers
    distortionMultiplier: 0.8,
    displacementMultiplier: 0.1,
    lightIntensityBoost: 1.2,
};
