/**
 * Rangkaian bunga cat air (watercolour) — reka bentuk asli.
 *
 * Disusun untuk penjuru KIRI-ATAS, kemudian diputar/dicerminkan melalui CSS
 * untuk penjuru lain. Semuanya SVG (tiada fail imej) supaya ringan dan tajam
 * pada semua saiz skrin.
 *
 * Palet mengikut tema Ocean Pink — daun eucalyptus diwarnakan dalam nada
 * mauve & rose gold, bukan hijau.
 */

/* Nada warna mengikut palet jemputan */
const TONES = {
  deep: '#8B4C70',
  dusty: '#D98CA4',
  blush: '#F6D6E0',
  soft: '#FCEEF3',
  gold: '#C89B7B',
  mauve: '#C9A2B4',
  sand: '#E3C9B8',
}

/** Sekuntum bunga ros gaya cat air — kelopak berlapis mengelilingi hati bunga. */
function Rose({ cx, cy, r = 26, rotate = 0, petal, petalInner, heart, opacity = 1 }) {
  const angles = [0, 72, 144, 216, 288]

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`} opacity={opacity}>
      {/* Basuhan lembut di belakang kelopak */}
      <circle r={r * 1.2} fill={petal} opacity="0.22" />

      {/* Kelopak luar */}
      {angles.map((a) => (
        <ellipse
          key={`o-${a}`}
          cx="0"
          cy={-r * 0.54}
          rx={r * 0.47}
          ry={r * 0.62}
          fill={petal}
          opacity="0.85"
          transform={`rotate(${a})`}
        />
      ))}

      {/* Kelopak dalam — diputar separuh supaya bertindih */}
      {angles.map((a) => (
        <ellipse
          key={`i-${a}`}
          cx="0"
          cy={-r * 0.3}
          rx={r * 0.31}
          ry={r * 0.4}
          fill={petalInner}
          opacity="0.7"
          transform={`rotate(${a + 36})`}
        />
      ))}

      {/* Hati bunga */}
      <circle r={r * 0.23} fill={heart} opacity="0.9" />
      <circle r={r * 0.1} fill={TONES.soft} opacity="0.7" />
    </g>
  )
}

/** Daun eucalyptus — bujur lembut pada tangkai. */
function Leaf({ x, y, rotate = 0, len = 22, wid = 14, fill, opacity = 0.65 }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={wid / 2}
      ry={len / 2}
      fill={fill}
      opacity={opacity}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  )
}

/** Kuntum kecil yang belum kembang. */
function Bud({ x, y, rotate = 0, size = 10, fill }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx={size * 0.55} ry={size} fill={fill} opacity="0.8" />
      <path
        d={`M ${-size * 0.5} ${size * 0.5} Q 0 ${size * 0.1} ${size * 0.5} ${size * 0.5}`}
        stroke={TONES.gold}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </g>
  )
}

/**
 * Satu rangkaian bunga penjuru.
 *
 * @param {'penuh'|'sederhana'|'pudar'} variant  ketumpatan rangkaian
 */
export default function FloralSpray({ variant = 'penuh', className = '', id = 'a' }) {
  const washId = `wash-${id}`

  // Rangkaian pudar hanya memaparkan lapisan paling lembut
  const showAll = variant !== 'pudar'
  const showFull = variant === 'penuh'

  return (
    // viewBox dirapatkan pada kawasan lukisan supaya rangkaian memenuhi penjuru
    <svg className={className} viewBox="-14 -14 238 238" fill="none" aria-hidden="true">
      <defs>
        <filter id={washId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* ---- Basuhan cat air di belakang (memberi kesan lembut & mewah) ---- */}
      <g filter={`url(#${washId})`} opacity="0.5">
        <ellipse cx="70" cy="60" rx="86" ry="70" fill={TONES.blush} />
        <ellipse cx="150" cy="118" rx="62" ry="52" fill={TONES.soft} />
        {showAll && <ellipse cx="42" cy="150" rx="54" ry="62" fill={TONES.blush} opacity="0.8" />}
      </g>

      {/* ---- Tangkai melengkung ---- */}
      <g opacity={showFull ? 0.45 : 0.3}>
        <path
          d="M -6 -4 C 52 26, 96 74, 118 146"
          stroke={TONES.mauve}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 2 8 C 36 56, 48 108, 42 174"
          stroke={TONES.gold}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {showAll && (
          /* Tangkai mendatar sengaja pendek & melengkung supaya kekal di
             penjuru — tidak memotong ruang lapang di tengah jemputan */
          <path
            d="M -4 2 C 44 12, 84 30, 112 58"
            stroke={TONES.mauve}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* ---- Daun eucalyptus di sepanjang tangkai ---- */}
      <g>
        <Leaf x={54} y={36} rotate={38} len={30} wid={19} fill={TONES.mauve} opacity={0.5} />
        <Leaf x={86} y={62} rotate={44} len={28} wid={18} fill={TONES.sand} opacity={0.55} />
        <Leaf x={112} y={96} rotate={52} len={26} wid={17} fill={TONES.mauve} opacity={0.45} />
        <Leaf x={128} y={136} rotate={62} len={24} wid={16} fill={TONES.sand} opacity={0.5} />

        <Leaf x={30} y={72} rotate={-24} len={26} wid={17} fill={TONES.sand} opacity={0.5} />
        <Leaf x={44} y={112} rotate={-14} len={28} wid={18} fill={TONES.mauve} opacity={0.42} />
        <Leaf x={46} y={158} rotate={-6} len={25} wid={16} fill={TONES.sand} opacity={0.48} />

        {showAll && (
          <>
            <Leaf x={62} y={14} rotate={68} len={26} wid={17} fill={TONES.sand} opacity={0.45} />
            <Leaf x={92} y={32} rotate={78} len={24} wid={16} fill={TONES.mauve} opacity={0.4} />
            <Leaf x={116} y={58} rotate={88} len={22} wid={15} fill={TONES.sand} opacity={0.38} />
          </>
        )}
      </g>

      {/* ---- Bunga ros ---- */}
      <Rose
        cx={62}
        cy={54}
        r={34}
        rotate={-12}
        petal={TONES.blush}
        petalInner={TONES.dusty}
        heart={TONES.gold}
        opacity={showFull ? 0.95 : 0.6}
      />

      {showAll && (
        <Rose
          cx={124}
          cy={112}
          r={25}
          rotate={26}
          petal={TONES.soft}
          petalInner={TONES.blush}
          heart={TONES.dusty}
          opacity={showFull ? 0.9 : 0.55}
        />
      )}

      {showFull && (
        <Rose
          cx={24}
          cy={124}
          r={19}
          rotate={8}
          petal={TONES.dusty}
          petalInner={TONES.blush}
          heart={TONES.soft}
          opacity={0.75}
        />
      )}

      {/* ---- Kuntum & butiran halus ---- */}
      {showAll && (
        <>
          <Bud x={104} y={40} rotate={38} size={9} fill={TONES.dusty} />
          <Bud x={70} y={140} rotate={-18} size={8} fill={TONES.blush} />
        </>
      )}

      {/* Mutiara kecil */}
      <circle cx={150} cy={70} r="3.4" fill={TONES.soft} stroke={TONES.gold} strokeWidth="0.9" opacity="0.75" />
      {showAll && (
        <circle cx={22} cy={94} r="2.8" fill={TONES.soft} stroke={TONES.dusty} strokeWidth="0.9" opacity="0.7" />
      )}
    </svg>
  )
}
