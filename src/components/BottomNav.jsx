/**
 * Navigasi melekat di bahagian bawah skrin (mesra mudah alih).
 * Skrol lembut ke setiap seksyen.
 */
const NAV_ITEMS = [
  { label: 'Utama', href: '#utama', icon: '🏠' },
  { label: 'Majlis', href: '#aturcara', icon: '🎀' },
  { label: 'Lokasi', href: '#lokasi', icon: '📍' },
  { label: 'Ucapan', href: '#ucapan', icon: '💌' },
  { label: 'Hubungi', href: '#hubungi', icon: '💬' },
]

/**
 * @param {() => void} onNavigate  dipanggil sebelum skrol bermula,
 *                                 supaya auto-skrol berhenti seketika
 */
export default function BottomNav({ onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi jemputan">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="bottom-nav__item"
          onClick={() => onNavigate?.(item.href)}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
