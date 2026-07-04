import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { imageToBricks } from '../utils/voxelizer'

export function HomePage() {
  const setStage        = useAppStore(s => s.setStage)
  const setUploadedImage= useAppStore(s => s.setUploadedImage)
  const setBricks       = useAppStore(s => s.setBricks)
  const fileRef         = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const url = URL.createObjectURL(file)
    setUploadedImage(url)
    setStage('processing')
    const bricks = await imageToBricks(url)
    setBricks(bricks)
    setStage('assembly')
  }

  return (
    <div className="home-page">
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          AI-Powered
        </motion.div>

        <h1 className="home-title">
          <span>Brick</span>
          <span className="title-accent">ify</span>
        </h1>

        <p className="home-sub">
          Turn anything into a LEGO creation.
        </p>

        <motion.div
          className="home-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display:'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />

          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fileRef.current?.click()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Upload Photo
          </motion.button>

          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleFile(makeDemoFile())}
          >
            Try Demo
          </motion.button>
        </motion.div>

        <p className="home-hint">
          coffee mug · shoe · plant · keyboard · anything
        </p>
      </motion.div>
    </div>
  )
}

// Generate a colorful demo gradient image
function makeDemoFile(): File {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const grd = ctx.createRadialGradient(64,64,8,64,64,64)
  grd.addColorStop(0,   '#ff6030')
  grd.addColorStop(0.4, '#cc2060')
  grd.addColorStop(0.75,'#4020cc')
  grd.addColorStop(1,   '#001044')
  ctx.fillStyle = grd
  ctx.fillRect(0,0,128,128)
  // draw a simple mug silhouette
  ctx.fillStyle = '#ff9040'
  ctx.fillRect(30,30,50,55)
  ctx.strokeStyle='#ff9040'; ctx.lineWidth=8
  ctx.beginPath(); ctx.arc(88,52,18,Math.PI*0.25,Math.PI*1.75); ctx.stroke()
  ctx.fillStyle='#ffcc70'; ctx.fillRect(38,82,34,6)
  return dataURLtoFile(c.toDataURL(), 'demo.png')
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime= arr[0].match(/:(.*?);/)![1]
  const bstr= atob(arr[1])
  let n = bstr.length
  const u8  = new Uint8Array(n)
  while(n--) u8[n] = bstr.charCodeAt(n)
  return new File([u8], filename, { type: mime })
}
