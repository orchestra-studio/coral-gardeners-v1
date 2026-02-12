import { useEffect, useRef, useState } from 'react'

interface UseAudioOptions {
  enabled: boolean
  smoothing: number
  minDecibels: number
  maxDecibels: number
  onError?: (e: Error) => void
}

export function useAudioReactivity({
  enabled,
  smoothing,
  minDecibels,
  maxDecibels,
  onError
}: UseAudioOptions) {
  const [levels, setLevels] = useState({ low: 0, mid: 0, high: 0 })
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!enabled) {
      setLevels({ low: 0, mid: 0, high: 0 })
      return
    }

    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) return
        const ctx = new AudioContext()
        const src = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.smoothingTimeConstant = smoothing
        analyser.minDecibels = minDecibels
        analyser.maxDecibels = maxDecibels
        analyser.fftSize = 2048
        src.connect(analyser)
        analyserRef.current = analyser
        const data = new Uint8Array(analyser.frequencyBinCount)

        const loop = () => {
          if (!analyserRef.current) return
          analyserRef.current.getByteFrequencyData(data)
          const third = Math.floor(data.length / 3)
          const lowAvg = average(data.slice(0, third))
          const midAvg = average(data.slice(third, third * 2))
          const highAvg = average(data.slice(third * 2))
          setLevels({
            low: lowAvg / 255,
            mid: midAvg / 255,
            high: highAvg / 255
          })
          rafRef.current = requestAnimationFrame(loop)
        }
        loop()
      })
      .catch((e) => {
        onError?.(e)
      })
    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, smoothing, minDecibels, maxDecibels, onError])

  return levels
}

function average(arr: Uint8Array) {
  let sum = 0
  for (let i = 0; i < arr.length; i++) sum += arr[i]
  return sum / arr.length
}