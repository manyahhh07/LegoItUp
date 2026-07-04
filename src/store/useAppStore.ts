import { create } from 'zustand'
import type { AppStage, BrickData } from '../types'

interface AppStore {
  stage: AppStage
  uploadedImage: string | null
  bricks: BrickData[]
  placedCount: number
  selectedBrick: string | null

  setStage: (s: AppStage) => void
  setUploadedImage: (url: string) => void
  setBricks: (b: BrickData[]) => void
  placeBrick: (id: string) => void
  setSelectedBrick: (id: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  stage: 'home',
  uploadedImage: null,
  bricks: [],
  placedCount: 0,
  selectedBrick: null,

  setStage: (stage) => set({ stage }),
  setUploadedImage: (url) => set({ uploadedImage: url }),
  setBricks: (bricks) => set({ bricks, placedCount: 0 }),

  placeBrick: (id) => set((state) => {
    const updated = state.bricks.map(b => {
      if (b.id === id) return { ...b, placed: true, isNext: false }
      return b
    })
    // mark next unplaced brick
    const nextIdx = updated.findIndex(b => !b.placed)
    if (nextIdx !== -1) updated[nextIdx] = { ...updated[nextIdx], isNext: true }
    return { bricks: updated, placedCount: state.placedCount + 1 }
  }),

  setSelectedBrick: (id) => set({ selectedBrick: id }),
  reset: () => set({ stage: 'home', uploadedImage: null, bricks: [], placedCount: 0 }),
}))
