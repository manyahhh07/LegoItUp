import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import { BrickField } from './BrickField'
import { FloatingBricks } from './FloatingBricks'
import { useAppStore } from '../../store/useAppStore'

export function LegoScene() {
  const stage  = useAppStore(s => s.stage)
  const isHome = stage === 'home'

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 18, 28], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#080810']} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0005}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.6} color="#8080ff" />
        <pointLight position={[10, -5, 10]}   intensity={0.3} color="#ff8040" />

        {isHome ? <FloatingBricks /> : <BrickField />}

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={60}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />
        <Environment preset="city" />

        <EffectComposer>
          <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.9} intensity={1.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
