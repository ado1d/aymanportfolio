'use client'

interface SignatureLogoProps {
  name?: string
  className?: string
}

/** A signature-style logo for "Ayman" using the Dancing Script cursive font.
 *  Renders the actual text "Ayman" in a beautiful handwritten style
 *  with a gradient text fill. */
export function SignatureLogo({ name = 'Ayman', className = '' }: SignatureLogoProps) {
  return (
    <span
      className={`signature-logo ${className}`}
      style={{
        fontFamily: 'var(--font-signature), cursive',
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #7c3aed 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.02em',
        display: 'inline-block',
        paddingBottom: '2px',
      }}
    >
      {name}
    </span>
  )
}
