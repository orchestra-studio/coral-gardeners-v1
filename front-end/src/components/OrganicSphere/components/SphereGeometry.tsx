interface SphereGeometryProps {
  radius: number
  segments: number
}

export function SphereGeometry({ radius, segments }: SphereGeometryProps) {
  return <sphereGeometry args={[radius, segments, segments]} />
}