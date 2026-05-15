'use client'

import { useState } from 'react'

const WISHES = [
  { icon: '🍺', text: '여유', desc: '고단한 하루 끝에 시원한 맥주 한 잔 같은 휴식을!' },
  { icon: '🍕', text: '포만감', desc: '좋아하는 피자를 마음껏 먹는 풍요로운 한 해!' },
  { icon: '🌶️', text: '열정', desc: '고추 바사삭처럼 매콤하고 활기찬 도전!' },
  { icon: '🐔', text: '우정', desc: '찰리(닭)와 같은 충실하고 소중한 친구들!' },
  { icon: '💎', text: '행운', desc: '광산에서 찾은 무지개 파편 같은 엄청난 행운!' },
  { icon: '🌟', text: '빛나는 미래', desc: '스타듀 밸리의 별들처럼 밝게 빛나길!' },
]

interface HeartProps {
  filled: boolean
  onClick: () => void
}

function PixelHeart({ filled, onClick }: HeartProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 24,
        filter: filled ? 'none' : 'grayscale(1) opacity(0.4)',
        transition: 'transform 0.1s',
        imageRendering: 'pixelated',
      }}
      className="hover:scale-125 active:scale-90"
    >
      ❤️
    </button>
  )
}

export default function HeartsWish() {
  const [filledHearts, setFilledHearts] = useState(0)
  const [showWish, setShowWish] = useState<number | null>(null)

  const fill = (n: number) => {
    setFilledHearts(n)
    if (n <= WISHES.length) {
      setShowWish(n - 1)
    }
  }

  return (
    <div className="sdv-panel flex flex-col gap-5" style={{ padding: 20 }}>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: 'var(--sdv-text-dark)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        하트를 채워 소원을 열어요!
      </div>

      {/* Heart row */}
      <div className="flex items-center justify-center gap-3">
        {WISHES.map((_, i) => (
          <PixelHeart
            key={i}
            filled={i < filledHearts}
            onClick={() => fill(i + 1)}
          />
        ))}
      </div>

      {/* Wish card */}
      {showWish !== null && showWish < WISHES.length && (
        <div
          className="sdv-panel-dark"
          style={{
            padding: 16,
            textAlign: 'center',
            animation: 'heart-pop 0.3s ease-out',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>{WISHES[showWish].icon}</div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 12,
              color: 'var(--sdv-gold)',
              marginBottom: 8,
            }}
          >
            {WISHES[showWish].text}
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: 'var(--sdv-text-cream)',
              lineHeight: 2,
            }}
          >
            {WISHES[showWish].desc}
          </div>
        </div>
      )}

      {filledHearts === WISHES.length && (
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: '#e05050',
            textAlign: 'center',
            animation: 'glow-pulse 1.5s ease-in-out infinite',
            marginTop: 4,
          }}
        >
          ♥ 모든 소원이 이루어져라! ♥
        </div>
      )}
    </div>
  )
}
