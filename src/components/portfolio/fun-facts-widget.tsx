'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Shuffle } from 'lucide-react'
import { Reveal } from './reveal'

const FUN_FACTS = [
  { icon: '⚡', text: 'I once solved a Codeforces problem in 47 seconds during a live contest.' },
  { icon: '☕', text: 'My hackathon fuel of choice is cold brew + lo-fi synthwave at 2 AM.' },
  { icon: '🎯', text: 'I\'ve written more C++ than English essays in the last 3 years.' },
  { icon: '🐛', text: 'My longest debugging session was 14 hours — it was a single off-by-one error.' },
  { icon: '🏆', text: 'I won my first hackathon wearing the same hoodie I\'m wearing now.' },
  { icon: '📚', text: 'I\'ve read "Designing Data-Intensive Applications" cover to cover — twice.' },
  { icon: '🧮', text: 'Dynamic programming is my favorite algorithm paradigm. Fight me.' },
  { icon: '🌍', text: 'I want to visit every country that has a competitive programming scene.' },
  { icon: '🎹', text: 'I debug faster when listening to video game soundtracks.' },
  { icon: '🚀', text: 'My dream is to build a tool used by 1 million developers.' },
]

/** A card that rotates through fun facts every few seconds, with manual shuffle. */
export function FunFactsWidget() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % FUN_FACTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused])

  const shuffle = () => {
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * FUN_FACTS.length)
    }
    setIndex(next)
  }

  const fact = FUN_FACTS[index]

  return (
    <Reveal>
      <div
        className="glow-card hover-lift rounded-xl overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Fun Fact
            </h3>
            <button
              onClick={shuffle}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
              aria-label="Shuffle fun fact"
              title="Show another fact"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
          <div key={index} className="flex items-start gap-3 quote-fade">
            <span className="text-2xl flex-shrink-0">{fact.icon}</span>
            <p className="text-sm leading-relaxed text-foreground/90">{fact.text}</p>
          </div>
          <div className="flex gap-1.5 mt-4">
            {FUN_FACTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary' : 'w-1 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to fact ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
