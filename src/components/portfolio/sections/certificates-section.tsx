'use client'

import { Award, Calendar, CheckCircle2, ExternalLink, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal } from '../reveal'
import { AddButton, EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Certificate } from '@/lib/types'

interface LightboxImage {
  url: string
  title?: string
  subtitle?: string
}

export function CertificatesSection({
  certificates,
  editMode,
  onSaved,
  onOpenLightbox,
}: {
  certificates: Certificate[]
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
} & SectionEditProps) {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="Lifelong Learning" title="Certificates" icon={Award} subtitle="Verified credentials & specializations" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="certificate" label="Add Certificate" fields={FIELD_DEFS.certificate} onSaved={onSaved} />
          </div>
        )}
        <CertificateGallery certificates={certificates} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} />
      </div>
    </section>
  )
}

function CertificateGallery({ certificates, editMode, onSaved, onOpenLightbox }: {
  certificates: Certificate[]
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
}) {
  if (!certificates.length) return <p className="text-center text-muted-foreground">No certificates added yet.</p>
  const lightboxImages = certificates.filter((c) => c.imageUrl).map((c) => ({ url: c.imageUrl!, title: c.title, subtitle: `${c.issuer} · ${c.date}` }))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert, i) => (
        <Reveal key={cert.id} delay={(i % 3) * 80}>
          <CertificateCard cert={cert} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} lightboxImages={lightboxImages} />
        </Reveal>
      ))}
    </div>
  )
}

function CertificateCard({ cert, editMode, onSaved, onOpenLightbox, lightboxImages }: {
  cert: Certificate
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
  lightboxImages: LightboxImage[]
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions entity="certificate" id={cert.id} fields={FIELD_DEFS.certificate} data={cert as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full">
        {cert.imageUrl && (
          <div
            className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
            onClick={() => {
              const idx = lightboxImages.findIndex((l) => l.url === cert.imageUrl)
              onOpenLightbox(lightboxImages, Math.max(0, idx))
            }}
          >
            <img src={cert.imageUrl} alt={cert.title} width={480} height={360} className="project-img w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 text-black text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Eye className="w-3 h-3" /> View certificate
            </div>
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold leading-tight">{cert.title}</h3>
          </div>
          <p className="text-sm text-primary font-medium mb-1">{cert.issuer}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {cert.date}
          </p>
          {cert.credentialId && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">ID: {cert.credentialId}</p>
          )}
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3">
              <ExternalLink className="w-3 h-3" /> Verify credential
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
