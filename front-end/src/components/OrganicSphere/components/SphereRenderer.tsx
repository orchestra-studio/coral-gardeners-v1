import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrganicSphereProps } from '../types'
import { defaultOrganicSphereConfig, typingIntensityCurveDefault } from '../config'
import { useTypingSpeed } from '../hooks/useTypingSpeed'
import { useAudioReactivity } from '../hooks/useAudioReactivity'
import { useMergedReactivity } from '../hooks/useMergedReactivity'
import { SphereMaterial } from './SphereMaterial'
import { SphereGeometry } from './SphereGeometry'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'

export const OrganicSphereInternal: React.FC<OrganicSphereProps> = (props) => {
  const cfg = { ...defaultOrganicSphereConfig, ...props }
  const typingCps = useTypingSpeed({
    text: cfg.text,
    windowMs: cfg.typingWindowMs
  })
  const typingIntensity =
    (props.typingIntensityCurve || typingIntensityCurveDefault)(typingCps)

  const audioLevels = useAudioReactivity({
    enabled: cfg.audioEnabled!,
    smoothing: cfg.audioSmoothing!,
    minDecibels: cfg.audioMinDecibels!,
    maxDecibels: cfg.audioMaxDecibels!,
    onError: cfg.onAudioError
  })

  const reactiveFactor = useMergedReactivity({
    audio: audioLevels,
    typingIntensity,
    audioEnabled: cfg.audioEnabled!,
    typingEnabled: cfg.typingEnabled!,
    blend: cfg.reactivityBlend!
  })

  return (
    <Canvas
      style={{ width: cfg.width, height: cfg.height, ...(cfg.style || {}) }}
      className={cfg.className}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3], fov: 40 }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 2, 5]} intensity={0.6} />
      <group>
        <mesh>
          <SphereGeometry radius={cfg.radius!} segments={cfg.segments!} />
          <SphereMaterial
            distortionStrength={cfg.distortionBase! + cfg.distortionMultiplier! * reactiveFactor}
            distortionFrequency={1.5}
            displacementStrength={cfg.displacementBase! + cfg.displacementMultiplier! * reactiveFactor}
            displacementFrequency={2.1}
            fresnelOffset={cfg.fresnelOffset!}
            fresnelMultiplier={cfg.fresnelMultiplier!}
            fresnelPower={cfg.fresnelPower!}
            colorA={cfg.colorA!}
            colorB={cfg.colorB!}
            timeScale={cfg.timeScale!}
            reactiveFactor={reactiveFactor}
            vertexShader={vertex}
            fragmentShader={fragment}
          />
        </mesh>
      </group>
    </Canvas>
  )
}