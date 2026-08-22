'use client'

import { HelpCircle, Quote, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AddButton } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { Testimonials } from '../testimonials'
import { FaqSection } from '../faq-section'
import { ContactForm } from '../contact-form'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Faq, SocialLink, Testimonial } from '@/lib/types'

export function TestimonialsSection({ testimonials, editMode, onSaved }: { testimonials: Testimonial[] } & SectionEditProps) {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader eyebrow="Kind Words" title="Testimonials" icon={Quote} subtitle="What mentors, teammates, and professors say" />
        <Testimonials testimonials={testimonials} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

export function FaqSectionBlock({ faqs, editMode, onSaved }: { faqs: Faq[] } & SectionEditProps) {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <SectionHeader eyebrow="Questions & Answers" title="FAQ" icon={HelpCircle} subtitle="Things people often ask me" />
        <FaqSection faqs={faqs} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

export function ContactSection({
  email,
  location,
  socialLinks,
  editMode,
  onSaved,
}: {
  email: string
  location: string
  socialLinks: SocialLink[]
} & SectionEditProps) {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader eyebrow="Get In Touch" title="Let's Connect" icon={Send} subtitle="Have an opportunity, idea, or just want to say hi? Drop me a message." />
        <Card className="glow-card">
          <CardContent className="p-6 sm:p-8">
            <ContactForm email={email} location={location} socialLinks={socialLinks} />
            {editMode && (
              <div className="mt-6 pt-6 border-t">
                <AddButton entity="socialLink" label="Add Social Link" fields={FIELD_DEFS.socialLink} onSaved={onSaved} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
