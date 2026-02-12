import { OrganicSphereProps } from './types'

export const defaultOrganicSphereConfig: Required<
  Pick<
    OrganicSphereProps,
    | 'radius'
    | 'segments'
    | 'colorA'
    | 'colorB'
    | 'audioEnabled'
    | 'typingEnabled'
    | 'typingWindowMs'
    | 'audioSmoothing'
    | 'audioMinDecibels'
    | 'audioMaxDecibels'
    | 'distortionBase'
    | 'distortionMultiplier'
    | 'displacementBase'
    | 'displacementMultiplier'
    | 'fresnelOffset'
    | 'fresnelMultiplier'
    | 'fresnelPower'
    | 'reactivityBlend'
    | 'timeScale'
    | 'debug'
  >
> = {
  radius: 1,
  segments: 256,
  colorA: '#ff3e00',
  colorB: '#0063ff',
  audioEnabled: true,
  typingEnabled: true,
  typingWindowMs: 1500,
  audioSmoothing: 0.8,
  audioMinDecibels: -85,
  audioMaxDecibels: -10,
  distortionBase: 0.4,
  distortionMultiplier: 0.9,
  displacementBase: 0.15,
  displacementMultiplier: 0.8,
  fresnelOffset: -1.4,
  fresnelMultiplier: 3.4,
  fresnelPower: 1.8,
  reactivityBlend: 0.5,
  timeScale: 1,
  debug: false
}

export const typingIntensityCurveDefault = (cps: number) => {
  const normalized = cps / 10
  return Math.min(1, Math.pow(normalized, 0.75))
}