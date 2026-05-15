'use client'

import { useState, useEffect } from 'react'

const PORTRAIT_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-msF1KoYvZjqObptspq4JcLplz1Xumd.png'

// Portrait sheet: 128x384px, 2 columns x 4 rows = 8 cells, each cell = 64x64px
const PORTRAIT_W = 64
const PORTRAIT_H = 64
const DISPLAY_SIZE = 80  // display width in px; height = 80

const MESSAGES = [
  '어... 안녕. 여긴 웬일이야?',
  '아, 오늘이 네 생일이었지.\n깜빡할 뻔했네.',
  '김희영, 생일 축하해.\n여기 선물을 좀 가져왔어.',
  '내가 제일 좋아하는 피자랑\n시원한 음료야. 같이 먹자.',
  '오늘 하루는 고민 같은 거 말고\n그냥 즐겁게 보냈으면 좋겠어. ⭐',
]

// Shane's expressions (Standard SDV Portrait sheet)
const EXPRESSIONS = [
  { col: 0, row: 0 }, // Neutral
  { col: 1, row: 0 }, // Happy
  { col: 0, row: 1 }, // Grumpy/Sad
  { col: 1, row: 1 }, // Blushing/Happy
  { col: 0, row: 2 }, // Serious/Thinking
]

interface BirthdayMessageProps {
  onDone?: () => void
}

export default function BirthdayMessage({ onDone }: BirthdayMessageProps) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [done, setDone] = useState(false)

  const currentMsg = MESSAGES[msgIndex]
  const expr = EXPRESSIONS[msgIndex]

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayedText(currentMsg.slice(0, i))
      if (i >= currentMsg.length) {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 55)
    return () => clearInterval(timer)
  }, [msgIndex, currentMsg])

  const advance = () => {
    if (isTyping) {
      setDisplayedText(currentMsg)
      setIsTyping(false)
      return
    }
    if (msgIndex < MESSAGES.length - 1) {
      setMsgIndex(m => m + 1)
    } else {
      setDone(true)
      onDone?.()
    }
  }

  // Scale so portrait cell displays at DISPLAY_SIZE width
  const scale = DISPLAY_SIZE / PORTRAIT_W
  const sheetW = 128 * scale   // 128px * scale
  const sheetH = 384 * scale   // 384px * scale
  const cellW = PORTRAIT_W * scale  // = DISPLAY_SIZE

  if (done) return null

  return (
    <div
      className="sdv-panel flex gap-5 cursor-pointer select-none"
      style={{ padding: 20, minHeight: 160 }}
      onClick={advance}
      role="button"
      aria-label="다음 메시지"
    >
      {/* Portrait — correctly cropped */}
      <div
        style={{
          width: 120, // Increased display size for dialogue
          height: 120,
          flexShrink: 0,
          overflow: 'hidden',
          imageRendering: 'pixelated',
          border: '4px solid var(--sdv-wood-dark)',
          background: '#d0e8f0',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.35)',
        }}
      >
        <img
          src={PORTRAIT_URL}
          alt="캐릭터 표정"
          style={{
            width: (128 * (120/64)),
            height: (384 * (120/64)),
            maxWidth: 'none',
            imageRendering: 'pixelated',
            marginLeft: -(expr.col * 120),
            marginTop: -(expr.row * 120),
          }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 12, // Increased font size
            lineHeight: 2.2,
            color: 'var(--sdv-text-dark)',
            whiteSpace: 'pre-wrap',
            minHeight: 80,
          }}
        >
          {displayedText}
          {isTyping && (
            <span style={{ animation: 'blink 0.5s steps(1) infinite' }}>▮</span>
          )}
        </div>
        {!isTyping && (
          <div
            style={{
              textAlign: 'right',
              fontSize: 10,
              color: 'var(--sdv-text-dark)',
              animation: 'bounce-pixel 0.6s steps(2) infinite',
              marginTop: 10,
            }}
          >
            ▼ 클릭하여 계속
          </div>
        )}
      </div>
    </div>
  )
}
