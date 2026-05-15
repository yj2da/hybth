import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🎂 김희영 생일 축하해! | Stardew Valley Birthday',
  description: '스타듀 밸리 테마 생일 축하 미니 웹앱 - 김희영의 특별한 날!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-background">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        {children}
      </body>
    </html>
  )
}
