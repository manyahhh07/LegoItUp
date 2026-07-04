import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { LegoBrick } from './LegoBrick'
import { useAppStore } from '../../store/useAppStore'

export function BrickField() {
  const bricks      = useAppStore(s => s.bricks)
  const placeBrick  = useAppStore(s => s.placeBrick)
  const stage       = useAppStore(s => s.stage)
  const [exploded, setExploded] = useState(false)
  const [offsets]   = useState<Map<string, THREE.Vector3>>(() => new Map())

  // On mount, assign random fly-in offsets
  useEffect(() => {
    bricks.forEach(b => {
      if (!offsets.has(b.id)) {
        offsets.set(b.id, new THREE.Vector3(
          (Math.random()-0.5)*40,
          20 + Math.random()*20,
          (Math.random()-0.5)*40,
        ))
      }
    })
  }, [bricks])

  // Explode on stage transition to freeplay
  useEffect(() => {
    if (stage === 'freeplay') setExploded(true)
  }, [stage])

  const floorGeo = new THREE.PlaneGeometry(60, 60)

  return (
    <group>
      {/* Shadow floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0,-0.1,0]} receiveShadow>
        <primitive object={floorGeo} />
        <shadowMaterial opacity={0.18} />
      </mesh>

      {bricks.map((b) => (
        <AnimatedBrick
          key={b.id}
          brick={b}
          flyOffset={offsets.get(b.id) || new THREE.Vector3()}
          exploded={exploded}
          onPlace={() => { if (b.isNext) placeBrick(b.id) }}
        />
      ))}
    </group>
  )
}

interface AnimBrickProps {
  brick: any
  flyOffset: THREE.Vector3
  exploded: boolean
  onPlace: () => void
}

function AnimatedBrick({ brick, flyOffset, exploded, onPlace }: AnimBrickProps) {
  const STUD    = 1.6
  const PLATE_H = 1.92
  const targetX = brick.x * STUD
  const targetY = brick.y * PLATE_H
  const targetZ = brick.z * STUD

  const startX = brick.placed ? targetX : flyOffset.x
  const startY = brick.placed ? targetY : flyOffset.y
  const startZ = brick.placed ? targetZ : flyOffset.z

  const explodeX = exploded ? (Math.random()-0.5)*40 : targetX
  const explodeY = exploded ? 5 + Math.random()*20   : targetY
  const explodeZ = exploded ? (Math.random()-0.5)*40 : targetZ

  const { pos } = useSpring({
    pos: brick.placed || !exploded
      ? [targetX, targetY, targetZ]
      : [explodeX, explodeY, explodeZ],
    config: { mass: 1.2, tension: 60, friction: 18 },
    delay : brick.placed ? 0 : Math.random() * 600,
  })

  return (
    // @ts-ignore
    <animated.group position={pos}>
      <LegoBrick
        x={0} y={0} z={0}
        w={brick.w} d={brick.d} h={brick.h}
        color={brick.color}
        isNext={brick.isNext}
        isGhost={false}
        onClick={onPlace}
      />
    </animated.group>
  )
}
