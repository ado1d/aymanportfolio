'use client'

import { ArrowRight, Camera } from 'lucide-react'

/** Promotional banner linking to the /lifestyle photo gallery. */
export function LifestyleCta() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6" aria-label="Lifestyle gallery">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-cyan-500/5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" /> Life Beyond Code
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              <span className="gradient-text">Discover My Lifestyle</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
              Hackathons, campus life, travels, and the moments that shape me.
              Explore my photo gallery and clap for your favorites! ❤️
            </p>
            <a
              href="/lifestyle"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 action-glow"
            >
              <Camera className="w-5 h-5" />
              Explore My Gallery
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
