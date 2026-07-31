'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, X, Tag, Star } from 'lucide-react'
import { ShareButtons } from './share-buttons'
import { ProjectGallery } from './project-gallery'
import type { Project } from '@/lib/types'

interface ProjectDetailModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (o: boolean) => void
  onOpenLightbox: (url: string) => void
}

export function ProjectDetailModal({ project, open, onOpenChange, onOpenLightbox }: ProjectDetailModalProps) {
  if (!project) return null

  const tags = project.tags ? project.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>

        {/* Gallery carousel (cover + gallery images) */}
        <ProjectGallery
          title={project.title}
          imageUrl={project.imageUrl}
          gallery={project.gallery}
          featured={project.featured}
          onOpenLightbox={onOpenLightbox}
          onClose={() => onOpenChange(false)}
        />

        <div className="p-6 overflow-y-auto max-h-[55vh]">
          {!project.imageUrl && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {project.imageUrl && <h2 className="text-2xl font-bold mb-3">{project.title}</h2>}

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {project.longDescription || project.description}
          </p>

          {tags.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" /> View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild size="sm">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                </a>
              </Button>
            )}
            {project.imageUrl && (
              <Button variant="ghost" size="sm" onClick={() => onOpenLightbox(project.imageUrl!)}>
                <Star className="w-4 h-4 mr-2" /> View Full Image
              </Button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <ShareButtons title={project.title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
