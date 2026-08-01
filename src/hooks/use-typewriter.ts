'use client'

import { useEffect, useReducer, useRef } from 'react'

/** Typewriter effect that cycles through a list of phrases.
 *  Types each phrase, pauses, deletes it, then moves to the next.
 *
 *  Implemented as a reducer driven by scheduled timeouts. The phrase list is
 *  captured in a ref (kept in sync inside an effect) so timeouts always read
 *  the latest value without triggering re-renders. */

interface TypewriterState {
  text: string
  phraseIndex: number
  isDeleting: boolean
}

type Action =
  | { type: 'TYPE'; phrase: string }
  | { type: 'DELETE'; phrase: string }
  | { type: 'START_DELETE' }
  | { type: 'NEXT_PHRASE'; count: number }

function reducer(state: TypewriterState, action: Action): TypewriterState {
  switch (action.type) {
    case 'TYPE':
      return { ...state, text: action.phrase.substring(0, state.text.length + 1) }
    case 'DELETE':
      return { ...state, text: action.phrase.substring(0, Math.max(0, state.text.length - 1)) }
    case 'START_DELETE':
      return { ...state, isDeleting: true }
    case 'NEXT_PHRASE':
      return { text: '', isDeleting: false, phraseIndex: (state.phraseIndex + 1) % action.count }
    default:
      return state
  }
}

export function useTypewriter(
  phrases: string[],
  options: { typeSpeed?: number; deleteSpeed?: number; pauseEnd?: number; pauseStart?: number } = {}
) {
  const { typeSpeed = 90, deleteSpeed = 45, pauseEnd = 1800 } = options
  const [state, dispatch] = useReducer(reducer, {
    text: '',
    phraseIndex: 0,
    isDeleting: false,
  })

  // Keep latest phrases in a ref, updated only inside an effect (never during render).
  const phrasesRef = useRef(phrases)
  useEffect(() => {
    phrasesRef.current = phrases
  }, [phrases])

  const { text, phraseIndex, isDeleting } = state
  const current = phrases[phraseIndex] || ''

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && text === current) {
      // Finished typing — pause then start deleting
      timeout = setTimeout(() => dispatch({ type: 'START_DELETE' }), pauseEnd)
    } else if (isDeleting && text === '') {
      // Finished deleting — advance to next phrase
      dispatch({ type: 'NEXT_PHRASE', count: Math.max(1, phrasesRef.current.length) })
    } else if (isDeleting) {
      timeout = setTimeout(() => dispatch({ type: 'DELETE', phrase: current }), deleteSpeed)
    } else {
      timeout = setTimeout(() => dispatch({ type: 'TYPE', phrase: current }), typeSpeed)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, current, typeSpeed, deleteSpeed, pauseEnd])

  return text
}
