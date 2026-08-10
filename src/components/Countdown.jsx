import { useEffect, useState } from 'react'
import { EVENT_START, EVENT_END, TEXT } from '../config.js'

const startTime = new Date(EVENT_START).getTime()
const endTime = new Date(EVENT_END).getTime()

function getState() {
  const now = Date.now()
  if (now >= endTime) return { phase: 'ended' }
  if (now >= startTime) return { phase: 'ongoing' }

  const diff = startTime - now
  return {
    phase: 'counting',
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

/** Kiraan detik secara langsung ke tarikh majlis (waktu Malaysia, UTC+8). */
export default function Countdown() {
  const [state, setState] = useState(getState)

  useEffect(() => {
    const id = window.setInterval(() => setState(getState()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (state.phase === 'ongoing') {
    return (
      <div className="card countdown countdown--message">
        <p>{TEXT.countdownOngoing}</p>
      </div>
    )
  }

  if (state.phase === 'ended') {
    return (
      <div className="card countdown countdown--message">
        <p>{TEXT.countdownEnded}</p>
      </div>
    )
  }

  const units = [
    { label: 'Hari', value: state.days },
    { label: 'Jam', value: pad(state.hours) },
    { label: 'Minit', value: pad(state.minutes) },
    { label: 'Saat', value: pad(state.seconds) },
  ]

  return (
    <div className="countdown" role="timer" aria-label="Kiraan detik ke majlis">
      <p className="countdown__caption">Menghitung hari bahagia</p>
      <div className="countdown__grid">
        {units.map((unit) => (
          <div key={unit.label} className="countdown__unit">
            <span className="countdown__value">{unit.value}</span>
            <span className="countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
