import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export function AssemblyPage() {
  const bricks      = useAppStore(s => s.bricks)
  const placedCount = useAppStore(s => s.placedCount)
  const setStage    = useAppStore(s => s.setStage)
  const image       = useAppStore(s => s.uploadedImage)
  const total       = bricks.length
  const progress    = total > 0 ? placedCount / total : 0
  const pct         = Math.round(progress * 100)
  const remaining   = total - placedCount
  const done        = remaining === 0 && total > 0

  return (
    <div className="assembly-overlay">
      {/* Top bar */}
      <motion.div
        className="assembly-topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="assembly-info">
          <span className="info-label">Bricks</span>
          <span className="info-value">{total}</span>
        </div>
        <div className="assembly-info">
          <span className="info-label">Placed</span>
          <span className="info-value">{placedCount}</span>
        </div>
        <div className="assembly-info">
          <span className="info-label">Remaining</span>
          <span className="info-value">{remaining}</span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="progress-bar-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="progress-bar-track">
          <motion.div
            className="progress-bar-fill"
            animate={{ width: `${pct}%` }}
            transition={{ type:'spring', stiffness:80, damping:20 }}
          />
        </div>
        <span className="progress-pct">{pct}%</span>
      </motion.div>

      {/* Reference image */}
      {image && (
        <motion.div
          className="ref-image-wrap"
          initial={{ opacity:0, x:30 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay:0.4 }}
        >
          <span className="ref-label">Reference</span>
          <img src={image} alt="reference" className="ref-image" />
        </motion.div>
      )}

      {/* Instruction */}
      <motion.div
        className="assembly-hint"
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.5 }}
      >
        {done
          ? '✦ All bricks placed!'
          : 'Click the glowing brick to place it'}
      </motion.div>

      {/* Complete / Freeplay button */}
      {done && (
        <motion.button
          className="btn-primary btn-center"
          initial={{ opacity:0, scale:0.85 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ type:'spring', stiffness:120 }}
          onClick={() => setStage('freeplay')}
        >
          Enter Free Play ✦
        </motion.button>
      )}

      {/* Controls */}
      <motion.div
        className="controls-hint"
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:1 }}
      >
        Drag to orbit · Scroll to zoom
      </motion.div>
    </div>
  )
}
