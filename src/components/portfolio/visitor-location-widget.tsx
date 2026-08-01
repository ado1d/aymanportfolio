'use client'

import { useState, useEffect } from 'react'
import { MapPin, Globe } from 'lucide-react'
import { Reveal } from './reveal'

/** A small widget showing the visitor's own location (derived from their
 *  browser timezone) and local time — a fun, privacy-friendly touch.
 *  No external IP geolocation API needed. */
export function VisitorLocationWidget() {
  const [info, setInfo] = useState<{ city: string; country: string; time: string } | null>(null)

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      // tz looks like "Asia/Dhaka" or "America/New_York"
      const parts = tz.split('/')
      const city = parts[parts.length - 1].replace(/_/g, ' ')
      // Derive a rough "country" from the first part (region)
      const country = parts[0] || ''

      const update = () => {
        const now = new Date()
        const time = now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: tz,
        })
        setInfo({ city, country, time })
      }
      update()
      const interval = setInterval(update, 1000)
      return () => clearInterval(interval)
    } catch {
      // timezone not available
    }
  }, [])

  if (!info) return null

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              You're visiting from
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-lg">{info.city}</p>
                <p className="text-xs text-muted-foreground">{info.country}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text-static tabular-nums">{info.time}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Your time</div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
