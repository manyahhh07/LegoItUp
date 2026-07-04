import { motion } from 'framer-motion'

const STEPS = ['Detecting object…', 'Sampling colors…', 'Building bricks…', 'Optimizing layout…']

export function ProcessingPage() {
  return (
    <div className="processing-page">
      <motion.div
        className="processing-content"
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
      >
        <div className="proc-spinner">
          {[0,1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              className="proc-dot"
              animate={{ scale:[1,1.5,1], opacity:[0.3,1,0.3] }}
              transition={{ duration:1.2, repeat:Infinity, delay:i*0.18, ease:'easeInOut' }}
            />
          ))}
        </div>
        <div className="proc-steps">
          {STEPS.map((s,i) => (
            <motion.div
              key={i}
              className="proc-step"
              initial={{ opacity:0, x:-16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay: i * 0.55 + 0.2 }}
            >
              <motion.span
                className="proc-check"
                initial={{ scale:0 }}
                animate={{ scale:1 }}
                transition={{ delay: i * 0.55 + 0.9, type:'spring' }}
              >✓</motion.span>
              {s}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
