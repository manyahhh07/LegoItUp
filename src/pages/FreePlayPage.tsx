import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export function FreePlayPage() {
  const reset = useAppStore(s => s.reset)

  return (
    <div className="freeplay-overlay">
      <motion.div
        className="freeplay-header"
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
      >
        <span className="freeplay-label">Free Play</span>
      </motion.div>

      <motion.div
        className="freeplay-actions"
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3 }}
      >
        <motion.button
          className="btn-secondary"
          whileHover={{ scale:1.05 }}
          whileTap={{ scale:0.96 }}
          onClick={reset}
        >
          ↩ Start Over
        </motion.button>
      </motion.div>

      <motion.div
        className="controls-hint"
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.6 }}
      >
        Drag to orbit · Scroll to zoom · Bricks exploding…
      </motion.div>
    </div>
  )
}
