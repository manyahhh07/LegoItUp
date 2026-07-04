import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = [
  [0.85, 0.12, 0.12],
  [0.12, 0.38, 0.85],
  [0.92, 0.72, 0.08],
  [0.12, 0.72, 0.28],
  [0.88, 0.38, 0.08],
  [0.55, 0.12, 0.82],
]

interface FloatBrick { pos: THREE.Vector3; rot: THREE.Euler; speed: number; color: number[] }

export function FloatingBricks() {
  const groupRef = useRef<THREE.Group>(null)

  const bricks = useMemo<FloatBrick[]>(() =>
    Array.from({ length: 22 }, () => ({
      pos  : new THREE.Vector3((Math.random()-0.5)*30, (Math.random()-0.5)*14, (Math.random()-0.5)*20 - 6),
      rot  : new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI),
      speed: 0.18 + Math.random() * 0.22,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  , [])

  const geoBox  = useMemo(() => new THREE.BoxGeometry(3.2, 1.92, 1.6), [])
  const geoStud = useMemo(() => new THREE.CylinderGeometry(0.48, 0.48, 0.48, 10), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const b = bricks[i]
      child.position.y = b.pos.y + Math.sin(t * b.speed + i * 1.3) * 1.4
      child.rotation.y = b.rot.y + t * b.speed * 0.3
      child.rotation.x = b.rot.x + t * b.speed * 0.18
    })
  })

  return (
    <group ref={groupRef}>
      {bricks.map((b, i) => {
        const [r,g,bl] = b.color
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(r,g,bl), roughness: 0.3, metalness: 0.1
        })
        return (
          <group key={i} position={b.pos}>
            <mesh geometry={geoBox} material={mat} castShadow />
            <mesh position={[-0.8, 1.2, 0]} geometry={geoStud} material={mat} />
            <mesh position={[ 0.8, 1.2, 0]} geometry={geoStud} material={mat} />
          </group>
        )
      })}
    </group>
  )
}
