import { useMemo } from 'react'

export function useMergedReactivity(params: {
  audio: { low: number; mid: number; high: number }
  typingIntensity: number
  audioEnabled: boolean
  typingEnabled: boolean
  blend: number
}) {
  const { audio, typingIntensity, audioEnabled, typingEnabled, blend } = params

  return useMemo(() => {
    // Aggregate audio energy, then blend with typing (typing ≈ high-band emphasis)
    const audioValue = (audio.low + audio.mid + audio.high) / 3
    const typingValue = typingIntensity
    if (audioEnabled && typingEnabled) {
      return audioValue * (1 - blend) + typingValue * blend
    }
    if (audioEnabled) return audioValue
    if (typingEnabled) return typingValue
    return 0
  }, [audio, typingIntensity, audioEnabled, typingEnabled, blend])
}