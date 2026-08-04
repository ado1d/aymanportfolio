'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { Reveal } from './reveal'
import { EditActions } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge as UIBadge } from '@/components/ui/badge'
import { Github, ExternalLink, Star, Eye } from 'lucide-react'
import { FavoriteToggle } from './favorite-toggle'
import type { Project } from '@/lib/types'

interface ProjectsShowcaseWithFilterProps {
  projects: Project[]
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
  onOpenDetail?: (project: Project) => void
}

export function ProjectsShowcaseWithFilter({
  projects,
  editMode,
  onSaved,
  onOpenLightbox,
  onOpenDetail,
}: ProjectsShowcaseWithFilterProps) {
  const [activeTag, setActiveTag] = useState<string>('All')
  const [search, setSearch] = useState('')

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.tags) {
        p.tags.split(',').forEach((t) => {
          const trimmed = t.trim()
          if (trimmed) set.add(trimmed)
        })
      }
    })
    return ['All', ...Array.from(set).sort()]
  }, [projects])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter((p) => {
      const tagMatch = activeTag === 'All' || (p.tags && p.tags.split(',').map((t) => t.trim()).includes(activeTag))
      const searchMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.longDescription || '').toLowerCase().includes(q) ||
        (p.tags || '').toLowerCase().includes(q)
      return tagMatch && searchMatch
    })
  }, [projects, activeTag, search])

  const featured = filtered.filter((p) => p.featured)
  const others = filtered.filter((p) => !p.featured)

  if (!projects.length) return <p className="text-center text-muted-foreground">No projects added yet.</p>

  return (
    <div className="space-y-8">
      {/* Filter controls */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-md border-y">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <label htmlFor="project-search" className="sr-only">Search projects</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="project-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects by name, description, or tag"
              className="w-full h-9 pl-9 pr-8 rounded-md border bg-card text-sm outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {projects.length} projects
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex p-4 rounded-full bg-muted mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No projects match your filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTag('All')
              setSearch('')
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {featured.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <FeaturedProjectCard project={p} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} onOpenDetail={onOpenDetail} />
                </Reveal>
              ))}
            </div>
          )}

          {others.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5 text-center">
                  More Projects
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 80}>
                    <ProjectCard project={p} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} onOpenDetail={onOpenDetail} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FeaturedProjectCard({
  project,
  editMode,
  onSaved,
  onOpenLightbox,
  onOpenDetail,
}: {
  project: Project
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
  onOpenDetail?: (project: Project) => void
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions
            entity="project"
            id={project.id}
            fields={FIELD_DEFS.project}
            data={project as unknown as Record<string, unknown>}
            onSaved={onSaved}
            compact
          />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full flex flex-col">
        {project.imageUrl && (
          <div
            className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
            onClick={() =>
              project.imageUrl &&
              onOpenLightbox([{ url: project.imageUrl, title: project.title, subtitle: project.description }], 0)
            }
          >
            <img src={project.imageUrl} alt={project.title} className="project-img w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
            <UIBadge className="absolute top-3 left-3 bg-yellow-500/90 text-black hover:bg-yellow-500">
              <Star className="w-3 h-3 mr-1 fill-current" /> Featured
            </UIBadge>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-lg">{project.title}</h3>
            </div>
          </div>
        )}
        <CardContent className="p-5 flex flex-col flex-1">
          {!project.imageUrl && (
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {onOpenDetail ? (
                <button onClick={() => onOpenDetail(project)} className="text-left hover:underline">
                  {project.title}
                </button>
              ) : (
                project.title
              )}
            </h3>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
            {project.longDescription || project.description}
          </p>
          {project.tags && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.split(',').slice(0, 4).map((t, i) => (
                <UIBadge key={i} variant="secondary" className="text-xs font-normal">
                  {t.trim()}
                </UIBadge>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-3 border-t mt-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live
              </a>
            )}
            {project.imageUrl && (
              <button
                onClick={() =>
                  onOpenLightbox([{ url: project.imageUrl, title: project.title, subtitle: project.description }], 0)
                }
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            )}
            {onOpenDetail && (
              <button
                onClick={() => onOpenDetail(project)}
                className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ${project.imageUrl ? '' : 'ml-auto'}`}
              >
                <Star className="w-4 h-4" /> Details
              </button>
            )}
            <FavoriteToggle projectId={project.id} projectTitle={project.title} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectCard({
  project,
  editMode,
  onSaved,
  onOpenLightbox,
  onOpenDetail,
}: {
  project: Project
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
  onOpenDetail?: (project: Project) => void
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions
            entity="project"
            id={project.id}
            fields={FIELD_DEFS.project}
            data={project as unknown as Record<string, unknown>}
            onSaved={onSaved}
            compact
          />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full flex flex-col">
        {project.imageUrl && (
          <div
            className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
            onClick={() => project.imageUrl && onOpenLightbox([{ url: project.imageUrl, title: project.title }], 0)}
          >
            <img src={project.imageUrl} alt={project.title} className="project-img w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <CardContent className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
            {onOpenDetail ? (
              <button onClick={() => onOpenDetail(project)} className="text-left hover:underline">
                {project.title}
              </button>
            ) : (
              project.title
            )}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1">{project.description}</p>
          {project.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.split(',').slice(0, 3).map((t, i) => (
                <UIBadge key={i} variant="secondary" className="text-xs font-normal">
                  {t.trim()}
                </UIBadge>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-3 border-t mt-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live
              </a>
            )}
            {onOpenDetail && (
              <button
                onClick={() => onOpenDetail(project)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
              >
                <Star className="w-4 h-4" /> Details
              </button>
            )}
            <FavoriteToggle projectId={project.id} projectTitle={project.title} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
