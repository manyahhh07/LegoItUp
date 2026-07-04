import type { BrickData, BrickColor } from '../types'

// Sample image into a grid of colored cells
function sampleImage(img: HTMLImageElement, gridW: number, gridH: number): BrickColor[][] {
  const canvas = document.createElement('canvas')
  canvas.width  = gridW
  canvas.height = gridH
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, gridW, gridH)
  const data = ctx.getImageData(0, 0, gridW, gridH).data
  const grid: BrickColor[][] = []
  for (let y = 0; y < gridH; y++) {
    grid[y] = []
    for (let x = 0; x < gridW; x++) {
      const i = (y * gridW + x) * 4
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
      if (a < 30) {
        grid[y][x] = { hex: 'transparent', r: 0, g: 0, b: 0 }
      } else {
        // Quantize to LEGO-ish palette
        const qr = Math.round(r / 32) * 32
        const qg = Math.round(g / 32) * 32
        const qb = Math.round(b / 32) * 32
        grid[y][x] = {
          hex: `#${qr.toString(16).padStart(2,'0')}${qg.toString(16).padStart(2,'0')}${qb.toString(16).padStart(2,'0')}`,
          r: qr / 255, g: qg / 255, b: qb / 255
        }
      }
    }
  }
  return grid
}

// Greedily merge cells into larger bricks
function mergeToBricks(grid: BrickColor[][], gridW: number, gridH: number): BrickData[] {
  const used = Array.from({ length: gridH }, () => new Array(gridW).fill(false))
  const bricks: BrickData[] = []
  let idCounter = 0

  // Try preferred sizes in order: 2x4, 2x2, 1x4, 1x2, 1x1
  const SIZES: [number, number][] = [[2,4],[4,2],[2,2],[1,4],[4,1],[1,2],[2,1],[1,1]]

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      if (used[y][x]) continue
      const baseColor = grid[y][x]
      if (baseColor.hex === 'transparent') continue

      let placed = false
      for (const [bw, bd] of SIZES) {
        if (x + bw > gridW || y + bd > gridH) continue
        // Check all cells match color and are free
        let ok = true
        for (let dy = 0; dy < bd && ok; dy++) {
          for (let dx = 0; dx < bw && ok; dx++) {
            const c = grid[y+dy][x+dx]
            if (used[y+dy][x+dx] || c.hex === 'transparent') ok = false
            // Allow same quantized color band
            if (Math.abs(c.r - baseColor.r) > 0.2 ||
                Math.abs(c.g - baseColor.g) > 0.2 ||
                Math.abs(c.b - baseColor.b) > 0.2) ok = false
          }
        }
        if (ok) {
          // mark used
          for (let dy = 0; dy < bd; dy++)
            for (let dx = 0; dx < bw; dx++)
              used[y+dy][x+dx] = true

          // Build up randomly 1–2 layers high
          const layers = Math.random() < 0.3 ? 2 : 1
          for (let ly = 0; ly < layers; ly++) {
            bricks.push({
              id      : `b${idCounter++}`,
              x       : x - gridW / 2,
              y       : ly * 3,
              z       : y - gridH / 2,
              w       : bw,
              d       : bd,
              h       : 3,
              color   : baseColor,
              placed  : false,
              isNext  : false,
            })
          }
          placed = true
          break
        }
      }
      if (!placed) used[y][x] = true // skip single transparent-like cell
    }
  }

  // Mark first brick as next
  if (bricks.length > 0) bricks[0].isNext = true
  return bricks
}

export async function imageToBricks(dataUrl: string): Promise<BrickData[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const ratio  = img.width / img.height
      const gridW  = Math.round(Math.min(24, Math.max(12, ratio * 16)))
      const gridH  = Math.round(gridW / ratio)
      const grid   = sampleImage(img, gridW, gridH)
      const bricks = mergeToBricks(grid, gridW, gridH)
      resolve(bricks)
    }
    img.src = dataUrl
  })
}
