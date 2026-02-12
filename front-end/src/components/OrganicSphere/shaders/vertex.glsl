uniform float uTime;
uniform float uDistortionStrength;
uniform float uDistortionFrequency;
uniform float uDisplacementStrength;
uniform float uDisplacementFrequency;
uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vColor;

#pragma glslify: perlin3 = require('./perlin3d.glsl')

vec3 displace(vec3 p) {
  float distort = perlin3(p * uDistortionFrequency + vec3(uTime * 0.1));
  vec3 distorted = p + normalize(p) * distort * uDistortionStrength;

  float disp = perlin3(distorted * uDisplacementFrequency + vec3(uTime * 0.05, 0.0, uTime * 0.02));
  return distorted + normalize(distorted) * disp * uDisplacementStrength;
}

void main() {
  vec3 displaced = displace(position);
  vec4 viewPos = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * viewPos;

  vec3 normalDir = normalize(displaced);
  vec3 viewDir = normalize(displaced - cameraPosition);
  float fresnel = uFresnelOffset + (1.0 + dot(viewDir, normalDir)) * uFresnelMultiplier;
  fresnel = pow(max(fresnel, 0.0), uFresnelPower);
  fresnel = clamp(fresnel, 0.0, 1.0);

  vec3 base = mix(uColorA, uColorB, fresnel);
  vColor = mix(base, vec3(1.0), pow(max(fresnel - 0.8, 0.0), 3.0));
}