export interface OrganicSphereProps {
  width?: number
  height?: number
  style?: React.CSSProperties
  className?: string

  radius?: number
  segments?: number

  colorA?: string
  colorB?: string

  audioEnabled?: boolean
  typingEnabled?: boolean

  text?: string
  typingWindowMs?: number
  typingIntensityCurve?: (charsPerSec: number) => number

  audioSmoothing?: number
  audioMinDecibels?: number
  audioMaxDecibels?: number

  distortionBase?: number
  distortionMultiplier?: number
  displacementBase?: number
  displacementMultiplier?: number
  fresnelOffset?: number
  fresnelMultiplier?: number
  fresnelPower?: number

  reactivityBlend?: number
  timeScale?: number

  debug?: boolean
  onAudioError?: (e: Error) => void
}