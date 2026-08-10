import { useCallback, useEffect, useState } from 'react'
import SectionTitle from './SectionTitle.jsx'
import FloralSpray from './decor/FloralSpray.jsx'
import {
  LIMITS,
  fetchWishes,
  isWishesConfigured,
  submitWish,
  validateWish,
} from '../lib/wishesApi.js'

const PAGE_SIZE = 6

const EMPTY_FORM = { name: '', message: '' }

/**
 * Ruangan Ucapan Tetamu — borang ringkas (nama + ucapan)
 * dan senarai ucapan awam di bawahnya.
 *
 * Hanya nama, ucapan dan tarikh dipaparkan. Tiada soalan kehadiran.
 */
export default function GuestWishes() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [sent, setSent] = useState(false)

  const [wishes, setWishes] = useState([])
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  const load = useCallback(async (count) => {
    setLoading(true)
    setLoadFailed(false)
    try {
      // Ambil satu lebih daripada keperluan untuk tahu ada lagi atau tidak
      const rows = await fetchWishes(count + 1)
      setHasMore(rows.length > count)
      setWishes(rows.slice(0, count))
    } catch {
      setLoadFailed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isWishesConfigured) {
      setLoading(false)
      return
    }
    load(PAGE_SIZE)
  }, [load])

  const update = (field) => (value) => {
    const next = { ...form, [field]: value }
    setForm(next)

    // Mesej ralat hilang sendiri sebaik sahaja medan itu menjadi sah semula.
    // Jika masih tidak sah, mesej dikemas kini supaya sentiasa tepat
    // (contoh: daripada "sila tulis ucapan" kepada "ucapan terlalu panjang").
    setErrors((prev) => {
      if (!prev[field]) return prev
      const current = validateWish(next)[field]
      return { ...prev, [field]: current }
    })

    setFailed(false)
    setSent(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Elak klik berulang-ulang
    if (sending) return

    const found = validateWish(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    setSending(true)
    setFailed(false)

    try {
      await submitWish(form)
      setForm(EMPTY_FORM)
      setErrors({})
      setSent(true)
      // Muat semula senarai supaya ucapan baharu terus kelihatan
      await load(visible)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const showMore = () => {
    const next = visible + PAGE_SIZE
    setVisible(next)
    load(next)
  }

  return (
    <section className="section wishes" id="ucapan">
      <FloralSpray id="wishes-l" variant="pudar" className="wishes__corner wishes__corner--l" />
      <FloralSpray id="wishes-r" variant="pudar" className="wishes__corner wishes__corner--r" />

      <SectionTitle script="Titipan Doa & Ucapan" title="Ucapan Tetamu" />

      <p className="wishes__intro">
        Tinggalkan sedikit ucapan atau doa buat Puteri Nafeesa &amp; Puteri Nadeera.
      </p>

      {!isWishesConfigured && (
        <div className="card wishes__placeholder">
          <p>Ruangan ucapan belum bersambung ke Google Sheets.</p>
          <p className="wishes__hint">
            (Isi <code>GOOGLE_SCRIPT_URL</code> dalam <code>src/config.js</code> — lihat{' '}
            <code>google-apps-script/PANDUAN.md</code>)
          </p>
        </div>
      )}

      {/* ---------- Borang ---------- */}
      <form className="card wish-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="wish-name">
            Nama
          </label>
          <input
            id="wish-name"
            className={`field__input ${errors.name ? 'field__input--error' : ''}`}
            type="text"
            name="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="Nama anda"
            value={form.name}
            onChange={(e) => update('name')(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'wish-name-error' : undefined}
          />
          {errors.name && (
            <p className="field__error" id="wish-name-error" role="alert">
              <span className="field__error-icon" aria-hidden="true">
                ✿
              </span>
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="wish-message">
            Ucapan atau Doa
          </label>
          {/* Tiada had `maxLength` di sini — tetamu bebas menaip,
              panjang disemak hanya apabila butang ditekan */}
          <textarea
            id="wish-message"
            className={`field__input field__textarea ${
              errors.message ? 'field__input--error' : ''
            }`}
            name="message"
            rows={4}
            placeholder="Tulis ucapan atau doa anda di sini..."
            value={form.message}
            onChange={(e) => update('message')(e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'wish-message-error' : undefined}
          />
          {errors.message && (
            <p className="field__error" id="wish-message-error" role="alert">
              <span className="field__error-icon" aria-hidden="true">
                ✿
              </span>
              {errors.message}
            </p>
          )}
        </div>

        {failed && (
          <p className="wish-form__failed" role="alert">
            Maaf, ucapan anda tidak dapat dihantar. Sila cuba sekali lagi.
          </p>
        )}

        {sent && (
          <p className="wish-form__success" role="status">
            Terima kasih atas ucapan dan doa anda 🤍
          </p>
        )}

        <button
          type="submit"
          className="btn btn--solid wish-form__submit"
          disabled={sending || !isWishesConfigured}
        >
          {sending ? 'Menghantar…' : 'Hantar Ucapan'}
        </button>
      </form>

      {/* ---------- Senarai ucapan awam ---------- */}
      <div className="wishbook">
        <h3 className="wishbook__heading">Ucapan &amp; Doa</h3>

        {loading && wishes.length === 0 ? (
          <p className="wishes__state" aria-live="polite">
            Memuatkan ucapan…
          </p>
        ) : loadFailed ? (
          <p className="wishes__state">Ucapan tidak dapat dimuatkan buat masa ini.</p>
        ) : wishes.length === 0 ? (
          <p className="wishes__empty">Jadilah yang pertama menitipkan ucapan dan doa 🤍</p>
        ) : (
          <>
            <ul className="wishes__list">
              {wishes.map((wish, index) => (
                <li className="wishes__card" key={`${wish.timestamp}-${index}`}>
                  <span className="wishes__quote" aria-hidden="true">
                    ❝
                  </span>
                  <p className="wishes__message">{wish.message}</p>
                  <p className="wishes__name">{wish.name}</p>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                type="button"
                className="btn btn--outline wishes__more"
                onClick={showMore}
                disabled={loading}
              >
                {loading ? 'Memuatkan…' : 'Lihat Lagi'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}
