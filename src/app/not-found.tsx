'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />

      <main className="flex-1 relative z-10 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-8">
            <span className="text-[8rem] sm:text-[12rem] font-bold gradient-text leading-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8rem] sm:text-[12rem] font-bold text-primary/10 leading-none animate-pulse">
                404
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page not found</h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            But don&apos;t worry — let&apos;s get you back on track.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="hover-lift">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> Back Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-lift">
              <Link href="/#projects">
                <Search className="w-4 h-4 mr-2" /> Browse Projects
              </Link>
            </Button>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
