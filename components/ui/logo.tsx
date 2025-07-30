export function SillonLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cercle principal représentant le cerveau/esprit */}
      <circle cx="50" cy="50" r="45" fill="url(#gradient)" stroke="currentColor" strokeWidth="2" opacity="0.1" />

      {/* Sillons principaux - lignes courbes qui se creusent */}
      <path
        d="M20 35 Q35 25 50 35 Q65 45 80 35"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M25 50 Q40 40 55 50 Q70 60 85 50"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M15 65 Q30 55 45 65 Q60 75 75 65"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Sillons secondaires - plus fins */}
      <path
        d="M30 42 Q42 38 54 42"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M35 58 Q47 54 59 58"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Point central - représente le focus/concentration */}
      <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.8" />

      {/* Gradient pour donner de la profondeur */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function SillonLogoFull({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <div className="flex items-center space-x-3">
      <SillonLogo className={className} />
      <span className="text-2xl font-bold">Sillon</span>
    </div>
  )
}
