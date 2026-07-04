# Brickify AI

Turn any photo into an interactive LEGO model.

## Quick Start

```bash
npm install
npm run dev
```


## How It Works

1. **Upload** any photo (or hit "Try Demo")
2. **Watch** the voxelizer sample your image into a color grid and merge cells into LEGO brick sizes (2×4, 2×2, 1×4, 1×2, 1×1)
3. **Assembly mode** — bricks fly in from random positions and snap to their grid coordinates. Click the glowing brick to place it.
4. **Free Play** — once complete, all bricks explode outward with spring physics. Use orbit controls to inspect.

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| 3D | Three.js + React Three Fiber |
| Animation | @react-spring/three + Framer Motion |
| Post FX | @react-three/postprocessing (Bloom) |
| State | Zustand |
| Lighting | Environment preset + directional + point lights |

## Folder Structure

```
src/
  components/
    three/        # LegoScene, LegoBrick, BrickField, FloatingBricks
    ui/           # (extend here: HUD, TooltipSystem, etc.)
    hand/         # (extend here: MediaPipe hand tracking)
  pages/          # HomePage, ProcessingPage, AssemblyPage, FreePlayPage
  store/          # useAppStore (Zustand)
  systems/        # (extend: physics, audio, export)
  utils/          # voxelizer.ts — image → BrickData[]
  types/          # shared TypeScript interfaces
```

## Extending

- **Hand tracking**: add MediaPipe in `src/components/hand/HandTracker.tsx`, emit `pinch` / `hover` events to the store
- **Physics**: add `@react-three/rapier` to `BrickField` for real rigid-body stacking
- **Export**: add a `photoMode.ts` system that renders the scene to a PNG via `gl.render()` + `toDataURL()`
- **Audio**: add Howler.js to `src/systems/audio.ts`, trigger on brick snap
