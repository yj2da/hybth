'use client'

import { useState, useEffect, useRef } from 'react'
import StardewHUD from '@/components/birthday/StardewHUD'
import BirthdayMessage from '@/components/birthday/BirthdayMessage'
import HeartsWish from '@/components/birthday/HeartsWish'
import PixelConfetti from '@/components/birthday/PixelConfetti'

const SPRITE_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AvZCX4Wp2ZsScQTKDZ966z4uQgCxHG.png'
const ROOM_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1sqpZ1i71xatyIerYKpOUMClFgUdsv.png'
const BG_URL = '/background.jpg'
const HUD_URL = '/clock_ko.png'
const PORTRAIT_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-msF1KoYvZjqObptspq4JcLplz1Xumd.png'

// Shane's assets (Standard SDV dimensions)
const SPRITE_FRAME_W = 16
const SPRITE_FRAME_H = 32  // NPCs are 32px tall
const SPRITE_SCALE = 4

const PORTRAIT_W = 64
const PORTRAIT_H = 64      // Standard SDV portraits are 64x64
const PORTRAIT_SCALE = 2

// Expressions: (col, row) in Shane's portrait grid
const EXPRESSIONS = [
  { col: 0, row: 0 }, // Neutral
  { col: 1, row: 0 }, // Happy
  { col: 0, row: 1 }, // Sad
  { col: 1, row: 1 }, // Blushing
  { col: 0, row: 2 }, // Angry/Serious
]

type Phase = 'title' | 'walking' | 'room' | 'message' | 'wish' | 'finale'

// A single sprite frame clipped from the sheet
function SpriteFrame({
  frameIndex,
  rowIndex = 0,
  scale = SPRITE_SCALE,
  flipX = false,
}: {
  frameIndex: number
  rowIndex?: number
  scale?: number
  flipX?: boolean
}) {
  const displayW = SPRITE_FRAME_W * scale
  const displayH = SPRITE_FRAME_H * scale
  const sheetW = 64 * scale
  const sheetH = 416 * scale 

  return (
    <div
      style={{
        width: displayW,
        height: displayH,
        overflow: 'hidden',
        imageRendering: 'pixelated',
        flexShrink: 0,
      }}
    >
      <img
        src={SPRITE_URL}
        alt="Shane Sprite"
        style={{
          width: sheetW,
          height: sheetH,
          maxWidth: 'none',
          imageRendering: 'pixelated',
          marginLeft: -(frameIndex * SPRITE_FRAME_W * scale),
          marginTop: -(rowIndex * SPRITE_FRAME_H * scale),
          transform: flipX ? 'scaleX(-1)' : undefined,
          transformOrigin: 'top left',
        }}
      />
    </div>
  )
}

// Portrait Cell adjusted for 64x64
function PortraitCell({
  col,
  row,
  displaySize = 64,
}: {
  col: number
  row: number
  displaySize?: number
}) {
  const scale = displaySize / PORTRAIT_W
  const sheetW = 128 * scale
  const sheetH = 384 * scale
  const cellW = PORTRAIT_W * scale
  const cellH = PORTRAIT_H * scale

  return (
    <div
      style={{
        width: cellW,
        height: cellH,
        overflow: 'hidden',
        imageRendering: 'pixelated',
        border: '3px solid var(--sdv-wood-dark)',
        background: '#d0e8f0',
        flexShrink: 0,
        boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
      }}
    >
      <img
        src={PORTRAIT_URL}
        alt="Shane Portrait"
        style={{
          width: sheetW,
          height: sheetH,
          maxWidth: 'none',
          imageRendering: 'pixelated',
          marginLeft: -(col * cellW),
          marginTop: -(row * cellH),
        }}
      />
    </div>
  )
}

export default function BirthdayApp() {
  const [phase, setPhase] = useState<Phase>('title')
  const [frame, setFrame] = useState(0)
  const [charX, setCharX] = useState(-120)
  const [confetti, setConfetti] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const animRef = useRef<NodeJS.Timeout | null>(null)
  const walkRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sprite walk animation (cycle through 4 frames)
  useEffect(() => {
    if (phase === 'walking') {
      animRef.current = setInterval(() => {
        setFrame(f => (f + 1) % 4)
      }, 160)
      return () => { if (animRef.current) clearInterval(animRef.current) }
    }
  }, [phase])

  // Walk character across screen
  useEffect(() => {
    if (phase === 'walking') {
      const width = containerRef.current?.offsetWidth ?? 600
      const step = 3
      const interval = 24
      setCharX(-120)
      walkRef.current = setInterval(() => {
        setCharX(prev => {
          if (prev > width + 120) {
            clearInterval(walkRef.current!)
            setTimeout(() => setPhase('room'), 300)
            return prev
          }
          return prev + step
        })
      }, interval)
      return () => { if (walkRef.current) clearInterval(walkRef.current) }
    }
  }, [phase])

  // Sparkles on room click
  const addSparkle = (e: React.MouseEvent) => {
    if (phase !== 'room') return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const id = Date.now()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSparkles(s => [...s, { id, x, y }])
    setTimeout(() => setSparkles(s => s.filter(p => p.id !== id)), 900)
  }

  // Confetti on finale
  useEffect(() => {
    if (phase === 'finale') {
      setConfetti(true)
      const t = setInterval(() => setConfetti(c => !c), 4000)
      return () => clearInterval(t)
    }
  }, [phase])

  return (
    <main
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: '#0a1a3a', fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* HUD decoration top-right - SHARED STABLE POSITION */}
      <div className="absolute top-6 right-6 z-50">
        <StardewHUD />
      </div>

      {/* ========== TITLE ========== */}
      {phase === 'title' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center">
          <img
            src={BG_URL}
            alt="Stardew Valley 배경"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated', opacity: 0.85 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,20,40,0.45)' }} />

          {/* Title card */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="sdv-panel text-center" style={{ padding: '32px 40px', maxWidth: 520 }}>
              <div style={{ fontSize: 12, color: 'var(--sdv-text-dark)', marginBottom: 14, letterSpacing: 1.5 }}>
                ✦ 희영's Birthday Party ✦
              </div>
              <div className="glow-gold" style={{ fontSize: 24, marginBottom: 12, letterSpacing: 2 }}>
                생일 축하해!
              </div>
              <div style={{ fontSize: 10, color: '#4a60a0', marginBottom: 16 }}>
                (feat. Black Shirt Shane)
              </div>
              <div style={{ fontSize: 14, color: '#e05050', marginBottom: 24, lineHeight: 2.2 }}>
                ♥ 김희영 ♥
              </div>
              <div style={{ fontSize: 11, color: 'var(--sdv-text-dark)', lineHeight: 2.4 }}>
                오늘은 당신의 특별한<br />생일 파티입니다!
              </div>
            </div>

            {/* Portrait preview bottom-right of card */}
            <div className="flex items-center gap-8">
              <PortraitCell col={0} row={0} displaySize={100} />
              <button
                className="sdv-btn"
                style={{ padding: '16px 36px', fontSize: 12 }}
                onClick={() => setPhase('walking')}
              >
                ▶ 파티 시작!
              </button>
              <PortraitCell col={1} row={0} displaySize={100} />
            </div>
          </div>
        </div>
      )}

      {/* ========== WALKING ========== */}
      {phase === 'walking' && (
        <div className="relative w-full h-screen flex flex-col">
          <img
            src={BG_URL}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated', opacity: 0.7 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,20,40,0.3)' }} />

          {/* Walking character */}
          <div
            className="absolute z-10"
            style={{ left: charX, bottom: 90 }}
          >
            <SpriteFrame frameIndex={frame} rowIndex={0} scale={SPRITE_SCALE} />
          </div>

          {/* Ground */}
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{ height: 90, background: 'rgba(40,70,30,0.45)' }}
          />

          {/* Text */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <div
              className="sdv-panel text-center"
              style={{ padding: '14px 28px', fontSize: 10, color: 'var(--sdv-text-dark)' }}
            >
              마을로 향하고 있어요...
            </div>
          </div>
        </div>
      )}

      {/* ========== ROOM ========== */}
      {phase === 'room' && (
        <div
          className="relative w-full h-screen flex flex-col items-center justify-center cursor-pointer"
          onClick={addSparkle}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={ROOM_URL}
              alt="스타듀 밸리 방"
              style={{
                imageRendering: 'pixelated',
                maxHeight: '82vh',
                maxWidth: '82vw',
                objectFit: 'contain',
              }}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 72% 82% at 50% 50%, transparent 58%, rgba(10,20,30,0.85) 100%)' }}
          />

          {/* Sparkles */}
          {sparkles.map(s => (
            <div
              key={s.id}
              className="absolute pointer-events-none z-30"
              style={{ left: s.x - 12, top: s.y - 12 }}
            >
              {['★', '✦', '⭐', '✨'].map((sym, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    fontSize: 16,
                    color: '#f0c060',
                    left: Math.cos((i / 4) * Math.PI * 2) * 22,
                    top: Math.sin((i / 4) * Math.PI * 2) * 22,
                    animation: 'sparkle 0.8s ease-out forwards',
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  {sym}
                </span>
              ))}
            </div>
          ))}

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
            <div
              className="sdv-panel text-center"
              style={{ padding: '12px 24px', fontSize: 10, color: 'var(--sdv-text-dark)' }}
            >
              방을 클릭해 보세요! ✨
            </div>
            <button
              className="sdv-btn"
              style={{ padding: '14px 30px', fontSize: 11 }}
              onClick={e => { e.stopPropagation(); setPhase('message') }}
            >
              편지 읽기 →
            </button>
          </div>
        </div>
      )}

      {/* ========== MESSAGE ========== */}
      {phase === 'message' && (
        <div className="relative w-full h-screen flex flex-col">
          <img
            src={ROOM_URL}
            alt="방 배경"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated', opacity: 0.35, filter: 'blur(2px)' }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,20,30,0.62)' }} />

          {/* Character sprite right side */}
          <div className="absolute right-10 bottom-36 z-10">
            <SpriteFrame frameIndex={1} rowIndex={2} scale={SPRITE_SCALE} flipX />
          </div>

          {/* Message + portrait bottom */}
          <div className="absolute bottom-6 left-4 right-4 z-20">
            <BirthdayMessage onDone={() => setPhase('wish')} />
          </div>
        </div>
      )}

      {/* ========== WISH ========== */}
      {phase === 'wish' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center gap-6">
          <img
            src={BG_URL}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated', opacity: 0.6 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,20,40,0.5)' }} />

          <div className="relative z-10 sdv-panel text-center" style={{ padding: '12px 24px' }}>
            <div style={{ fontSize: 9, color: 'var(--sdv-text-dark)' }}>
              생일 소원
            </div>
          </div>

          <div className="relative z-10 w-full max-w-sm px-4">
            <HeartsWish />
          </div>

          <div className="relative z-10">
            <button
              className="sdv-btn"
              style={{ padding: '10px 22px', fontSize: 8 }}
              onClick={() => setPhase('finale')}
            >
              파티 피날레!
            </button>
          </div>
        </div>
      )}

      {/* ========== FINALE ========== */}
      {phase === 'finale' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center gap-4">
          <img
            src={BG_URL}
            alt="배경"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'pixelated', opacity: 0.78 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.32)' }} />

          <PixelConfetti active={confetti} />

          {/* Big finale card */}
          <div
            className="relative z-10 sdv-panel text-center"
            style={{ padding: '32px 36px', maxWidth: 540 }}
          >
            {/* Portrait grid — show all 4 expressions in a row */}
            <div className="flex justify-center gap-3 mb-6">
              {EXPRESSIONS.slice(0, 4).map((expr, i) => (
                <PortraitCell key={i} col={expr.col} row={expr.row} displaySize={72} />
              ))}
            </div>

            <div className="glow-gold" style={{ fontSize: 22, marginBottom: 14, letterSpacing: 2 }}>
              생일 축하해요!
            </div>

            <div
              style={{
                fontSize: 14,
                color: '#e05050',
                marginBottom: 20,
                animation: 'bounce-pixel 0.8s steps(2) infinite',
              }}
            >
              ♥ 김희영 ♥
            </div>

            <div
              style={{
                fontSize: 10,
                color: 'var(--sdv-text-dark)',
                lineHeight: 2.4,
                marginBottom: 24,
              }}
            >
              스타듀 밸리의 모든 주민이<br />
              당신의 생일을 축하합니다!<br />
              오늘 하루도 행복하세요!
            </div>

            {/* Sprite walk frames row */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map(col => (
                <div
                  key={col}
                  style={{
                    border: '3px solid var(--sdv-wood-dark)',
                    background: 'rgba(0,0,0,0.15)',
                  }}
                >
                  <SpriteFrame frameIndex={col} rowIndex={0} scale={4} />
                </div>
              ))}
            </div>

            <button
              className="sdv-btn"
              style={{ padding: '12px 28px', fontSize: 10 }}
              onClick={() => {
                setPhase('title')
                setConfetti(false)
              }}
            >
              ↩ 처음으로
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
