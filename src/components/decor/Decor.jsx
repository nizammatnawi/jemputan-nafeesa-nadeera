/**
 * Elemen hiasan SVG kecil: bintang, mutiara, reben, awan dan ombak.
 * Rangkaian bunga penjuru berada dalam FloralSpray.jsx.
 * Semuanya ringan (SVG sahaja, tiada imej luaran).
 */

export function Sparkle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 l2.4 7.6 L22 12 l-7.6 2.4 L12 22 l-2.4-7.6 L2 12 l7.6-2.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Ribbon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <path
        d="M60 20 C 45 2, 18 6, 22 20 C 18 34, 45 38, 60 20 C 75 2, 102 6, 98 20 C 102 34, 75 38, 60 20Z"
        stroke="#C89B7B"
        strokeWidth="2"
        fill="#F6D6E0"
        fillOpacity="0.5"
      />
      <circle cx="60" cy="20" r="4" fill="#C89B7B" />
    </svg>
  )
}

/* Pembahagi ombak lembut di bahagian bawah hero */
export function WaveDivider({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 60 C 240 110, 480 10, 720 55 C 960 100, 1200 20, 1440 65 L1440 120 L0 120Z"
        fill="#FFF8F3"
        opacity="0.55"
      />
      <path
        d="M0 80 C 260 120, 520 30, 780 70 C 1040 110, 1260 40, 1440 85 L1440 120 L0 120Z"
        fill="#FFF8F3"
      />
    </svg>
  )
}

/* Awan lembut (digunakan sebagai latar hiasan) */
export function Cloud({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 80" fill="none" aria-hidden="true">
      <path
        d="M40 60 a20 20 0 0 1 8-38 a26 26 0 0 1 50-8 a22 22 0 0 1 36 14 a18 18 0 0 1 12 32Z"
        fill="currentColor"
      />
    </svg>
  )
}
