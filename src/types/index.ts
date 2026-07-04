export type AppStage = 'home' | 'upload' | 'processing' | 'assembly' | 'freeplay'

export interface BrickColor {
  hex: string
  r: number
  g: number
  b: number
}

export interface BrickData {
  id: string
  x: number   // grid units
  y: number
  z: number
  w: number   // width in studs
  d: number   // depth in studs
  h: number   // height (1 = standard plate, 3 = standard brick)
  color: BrickColor
  placed: boolean
  isNext: boolean
}

export interface HandPoint {
  x: number
  y: number
  z: number
}
