'use client'

import { Award, Rocket, Target, Trophy } from 'lucide-react'
import { useScrollReveal, useCountUp } from '@/hooks/use-scroll-reveal'

function StatCard({ icon: Icon, value, label, suffix, delay = 0 }: { icon: React.ElementType; value: number; label: string; suffix?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  // Count up re-triggers each time the card enters the viewport.
  const count = useCountUp(value, visible, 1600)
  return (
    <div
      ref={ref}
      className="glow-card hover-lift p-5 text-center reveal"
      style={visible ? { transitionDelay: `${delay}ms`, opacity: 1, transform: 'translateY(0)' } : { transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-bold gradient-text-static">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</div>
    </div>
  )
}

export function StatsSection({ hackathons, contests, projects, certificates }: {
  hackathons: number
  contests: number
  projects: number
  certificates: number
}) {
  return (
    <section className="py-12 px-4 sm:px-6" aria-label="Portfolio statistics">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trophy} value={hackathons} suffix="+" label="Hackathons" delay={0} />
        <StatCard icon={Target} value={contests} suffix="+" label="Contests" delay={100} />
        <StatCard icon={Rocket} value={projects} suffix="+" label="Projects" delay={200} />
        <StatCard icon={Award} value={certificates} suffix="+" label="Certificates" delay={300} />
      </div>
    </section>
  )
}
