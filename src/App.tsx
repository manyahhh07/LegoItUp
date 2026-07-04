import { AnimatePresence, motion } from 'framer-motion'
import { LegoScene } from './components/three/LegoScene'
import { HomePage } from './pages/HomePage'
import { ProcessingPage } from './pages/ProcessingPage'
import { AssemblyPage } from './pages/AssemblyPage'
import { FreePlayPage } from './pages/FreePlayPage'
import { useAppStore } from './store/useAppStore'
import './styles.css'

export default function App() {
  const stage = useAppStore(s => s.stage)

  return (
    <div className="app">
      {/* Full-screen 3D canvas always mounted */}
      <div className="canvas-layer">
        <LegoScene />
      </div>

      {/* 2D UI layer */}
      <div className="ui-layer">
        <AnimatePresence mode="wait">
          {stage === 'home' && (
            <motion.div key="home" className="page-wrap"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.5 }}>
              <HomePage />
            </motion.div>
          )}
          {stage === 'processing' && (
            <motion.div key="proc" className="page-wrap"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.4 }}>
              <ProcessingPage />
            </motion.div>
          )}
          {stage === 'assembly' && (
            <motion.div key="asm" className="page-wrap"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.5 }}>
              <AssemblyPage />
            </motion.div>
          )}
          {stage === 'freeplay' && (
            <motion.div key="fp" className="page-wrap"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.5 }}>
              <FreePlayPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
