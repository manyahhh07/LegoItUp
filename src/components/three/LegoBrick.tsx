import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// LEGO stud unit: 1 stud = 1.6 world units, height plate = 1.92
const STUD = 1.6
const PLATE_H = 1.92

interface LegoBrickProps {
  x: number
  y: number
  z: number
  w: number   // studs wide
  d: number   // studs deep
  h: number   // in stud-height units (3 = standard brick)
  color: { r: number; g: number; b: number }
  isNext?: boolean
  isGhost?: boolean
  glow?: boolean
  onClick?: () => void
}

export function LegoBrick({
  x, y, z, w, d, h,
  color, isNext = false, isGhost = false, glow = false, onClick
}: LegoBrickProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const bw = w * STUD
  const bd = d * STUD
  const bh = (h / 3) * PLATE_H * 3

  // Stud geometry (shared for instancing)
  const studGeo = useMemo(() => new THREE.CylinderGeometry(0.48, 0.48, 0.48, 12), [])

  const bodyGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(bw - 0.12, bh, bd - 0.12)
    return geo
  }, [bw, bh, bd])

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color    : new THREE.Color(color.r, color.g, color.b),
    roughness: 0.35,
    metalness: 0.1,
    transparent: isGhost,
    opacity  : isGhost ? 0.28 : 1,
    emissive : isNext ? new THREE.Color(color.r * 0.4, color.g * 0.4, color.b * 0.4) : new THREE.Color(0,0,0),
  }), [color.r, color.g, color.b, isGhost, isNext])

  const studMat = useMemo(() => new THREE.MeshStandardMaterial({
    color    : new THREE.Color(color.r * 0.92, color.g * 0.92, color.b * 0.92),
    roughness: 0.3,
    metalness: 0.12,
    transparent: isGhost,
    opacity  : isGhost ? 0.28 : 1,
  }), [color.r, color.g, color.b, isGhost])

  // Pulse glow on "next" brick
  useFrame(({ clock }) => {
    if (!meshRef.current || !isNext) return
    const t = clock.getElapsedTime()
    const pulse = 0.18 + Math.abs(Math.sin(t * 2.5)) * 0.25
    ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse
  })

  const wx = x * STUD
  const wy = y * (PLATE_H)
  const wz = z * STUD

  const studsX = Array.from({ length: w }, (_, i) => (i - (w-1)/2) * STUD)
  const studsZ = Array.from({ length: d }, (_, i) => (i - (d-1)/2) * STUD)

  return (
    <group position={[wx, wy + bh / 2, wz]} onClick={onClick}>
      {/* Body */}
      <mesh ref={meshRef} geometry={bodyGeo} material={mat} castShadow receiveShadow />

      {/* Studs */}
      {studsX.map(sx =>
        studsZ.map(sz => (
          <mesh
            key={`${sx}_${sz}`}
            position={[sx, bh / 2 + 0.24, sz]}
            geometry={studGeo}
            material={studMat}
            castShadow
          />
        ))
      )}

      {/* Next-brick outline */}
      {isNext && (
        <mesh geometry={bodyGeo} scale={[1.04, 1.04, 1.04]}>
          <meshBasicMaterial color="#ffffff" wireframe opacity={0.15} transparent />
        </mesh>
      )}
    </group>
  )
}
