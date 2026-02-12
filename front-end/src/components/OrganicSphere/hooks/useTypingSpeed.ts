import { useEffect, useRef, useState } from 'react'

interface UseTypingSpeedOptions {
  text?: string
  windowMs: number
}

export function useTypingSpeed({ text = '', windowMs }: UseTypingSpeedOptions) {
  const [charsPerSec, setCharsPerSec] = useState(0)
  const historyRef = useRef<{ t: number; len: number }[]>([])
  const prevLenRef = useRef<number>(text.length)

  useEffect(() => {
    const now = performance.now()
    const currentLen = text.length
    const delta = currentLen - prevLenRef.current
    prevLenRef.current = currentLen

    if (delta !== 0) {
      historyRef.current.push({ t: now, len: currentLen })
      const cutoff = now - windowMs
      historyRef.current = historyRef.current.filter((h) => h.t >= cutoff)

      if (historyRef.current.length >= 2) {
        const first = historyRef.current[0]
        const last = historyRef.current[historyRef.current.length - 1]
        const charsDelta = last.len - first.len
        const timeDeltaSec = (last.t - first.t) / 1000
        setCharsPerSec(timeDeltaSec > 0 ? charsDelta / timeDeltaSec : 0)
      }
    }
  }, [text, windowMs])

  return charsPerSec
}