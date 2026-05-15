'use client'

export default function StardewHUD() {
  return (
    <div 
      className="relative pointer-events-none select-none" 
      style={{ 
        width: '240px', // Increased from 160px
        height: '120px', // Increased from 80px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background HUD image - Only image with forced fixed size */}
      <img
        src="/clock_ko.png"
        alt="Stardew Clock"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          imageRendering: 'pixelated' 
        }}
      />
    </div>
  )
}
