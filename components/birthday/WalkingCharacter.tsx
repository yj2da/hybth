'use client'

import { useState, useEffect } from 'react'

// The sprite sheet has rows of character poses.
// We'll crop a single walking frame from the sheet to animate a walk cycle.
// Sprite sheet: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AvZCX4Wp2ZsScQTKDZ966z4uQgCxHG.png
// Each sprite is roughly 48x64 pixels in the sheet.

const SPRITE_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AvZCX4Wp2ZsScQTKDZ966z4uQgCxHG.png'

// Walk frames: x offset in the sprite sheet (top row, walking right)
// The sprite sheet appears to have ~10 columns and many rows
// Each cell is approx 48px wide, 64px tall
const FRAME_W = 16
const FRAME_H = 32
const WALK_FRAMES = [0, 1, 2, 3] // column indices for walk animation

interface WalkingCharacterProps {
  direction?: 'right' | 'left'
  row?: number
  scale?: number
  speed?: number
  style?: React.CSSProperties
  className?: string
}

export default function WalkingCharacter({
  direction = 'right',
  row = 0,
  scale = 3,
  speed = 6000,
  style,
  className = ''
}: WalkingCharacterProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % WALK_FRAMES.length)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  const frameX = WALK_FRAMES[frame] * FRAME_W
  const frameY = row * FRAME_H

  return (
    <div
      className={className}
      style={{
        width: FRAME_W * scale,
        height: FRAME_H * scale,
        imageRendering: 'pixelated',
        overflow: 'hidden',
        flexShrink: 0,
        transform: direction === 'left' ? 'scaleX(-1)' : 'none',
        ...style,
      }}
    >
      <img
        src={SPRITE_URL}
        alt="캐릭터"
        style={{
          imageRendering: 'pixelated',
          marginLeft: -(frameX * scale),
          marginTop: -(frameY * scale),
          width: (64 * scale), // Assuming 4 frames wide
          height: 'auto',
          maxWidth: 'none',
        }}
      />
    </div>
  )
}
