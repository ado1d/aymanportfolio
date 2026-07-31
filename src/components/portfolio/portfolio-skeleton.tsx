'use client'

import { Code } from 'lucide-react'

/** A polished skeleton shown while portfolio data is loading. */
export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />

      {/* Nav skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="h-6 w-24 rounded bg-muted animate-pulse" />
            <div className="hidden lg:flex items-center gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 w-16 rounded bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
            <div className="h-9 w-20 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10 pt-16">
        {/* Hero skeleton */}
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="text-center max-w-3xl w-full">
            <div className="mx-auto w-32 h-32 rounded-full bg-muted animate-pulse mb-8" />
            <div className="h-4 w-40 rounded bg-muted animate-pulse mx-auto mb-6" />
            <div className="h-12 w-3/4 rounded bg-muted animate-pulse mx-auto mb-4" />
            <div className="h-6 w-2/3 rounded bg-muted animate-pulse mx-auto mb-8" style={{ animationDelay: '150ms' }} />
            <div className="flex justify-center gap-3 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-muted animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <div className="h-11 w-36 rounded bg-muted animate-pulse" />
              <div className="h-11 w-36 rounded bg-muted animate-pulse" style={{ animationDelay: '100ms' }} />
            </div>
          </div>
        </section>

        {/* Section skeleton */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-8 w-48 rounded bg-muted animate-pulse mx-auto mb-3" />
              <div className="h-1 w-16 rounded bg-muted animate-pulse mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl border bg-card animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-40 rounded bg-muted animate-pulse mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-5/6 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Center overlay with logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
            <Code className="w-8 h-8" />
          </div>
          <div className="text-xl gradient-text font-bold">Loading portfolio...</div>
        </div>
      </div>
    </div>
  )
}
