'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  Shield,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Types
interface Profile {
  id?: string
  name: string
  title: string
  tagline: string
  description: string
  email: string
  phone: string
  location: string
  resumeUrl: string
}

interface Skill {
  id: string
  category: string
  name: string
  order: number
}

interface Proficiency {
  id?: string
  icon: string
  title: string
  description: string
}

interface Experience {
  id?: string
  title: string
  period: string
  description: string
}

interface Achievement {
  id?: string
  icon: string
  title: string
  description: string
}

interface Project {
  id?: string
  title: string
  description: string
  imageUrl: string
  githubUrl: string
  liveUrl: string
  tags: string
  featured: boolean
}

interface SocialLink {
  id?: string
  platform: string
  url: string
  icon: string
}

// Login Component
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: 'Logged in successfully!' })
        onLogin()
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Profile Editor
function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    tagline: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    resumeUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/profile')
      .then(res => res.json())
      .then(data => {
        if (data) setProfile(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        toast({ title: 'Profile saved successfully!' })
      } else {
        toast({ title: 'Failed to save profile', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile Information
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            placeholder="Building impactful solutions"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            placeholder="Tell visitors about yourself..."
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
          <div className="space-y-2">
            <Label>Resume URL</Label>
            <Input
              value={profile.resumeUrl}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skills Editor
function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState({ category: 'Languages', name: '' })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const categories = ['Languages', 'Web', 'Databases', 'Tools & Others']

  useEffect(() => {
    fetch('/api/admin/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      })

      if (res.ok) {
        const skill = await res.json()
        setSkills([...skills, skill])
        setNewSkill({ category: 'Languages', name: '' })
        setOpen(false)
        toast({ title: 'Skill added!' })
      }
    } catch {
      toast({ title: 'Failed to add skill', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSkills(skills.filter(s => s.id !== id))
        toast({ title: 'Skill deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete skill', variant: 'destructive' })
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Skills
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g., React, Python, MongoDB"
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">Add Skill</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="font-medium mb-3">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="pr-1">
                  {skill.name}
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="ml-2 p-0.5 hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Experience Editor
function ExperienceEditor() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/experiences')
      .then(res => res.json())
      .then(data => setExperiences(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (exp: Experience) => {
    try {
      const method = exp.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      })

      if (res.ok) {
        const saved = await res.json()
        if (exp.id) {
          setExperiences(experiences.map(e => e.id === saved.id ? saved : e))
        } else {
          setExperiences([...experiences, saved])
        }
        setOpen(false)
        setEditing(null)
        toast({ title: 'Experience saved!' })
      }
    } catch {
      toast({ title: 'Failed to save experience', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setExperiences(experiences.filter(e => e.id !== id))
        toast({ title: 'Experience deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete experience', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Experience
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditing({ title: '', period: '', description: '' })
                  setOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            {editing && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing.id ? 'Edit' : 'Add'} Experience</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Input
                      value={editing.period}
                      onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                      placeholder="2021 - Present"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Describe your role..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={() => handleSave(editing)} className="w-full">Save</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.period}</p>
                <p className="text-sm mt-2">{exp.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(exp)
                    setOpen(true)
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(exp.id!)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Achievements Editor
function AchievementsEditor() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/achievements')
      .then(res => res.json())
      .then(data => setAchievements(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (achievement: Achievement) => {
    try {
      const method = achievement.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/achievements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement),
      })

      if (res.ok) {
        const saved = await res.json()
        if (achievement.id) {
          setAchievements(achievements.map(a => a.id === saved.id ? saved : a))
        } else {
          setAchievements([...achievements, saved])
        }
        setOpen(false)
        setEditing(null)
        toast({ title: 'Achievement saved!' })
      }
    } catch {
      toast({ title: 'Failed to save achievement', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAchievements(achievements.filter(a => a.id !== id))
        toast({ title: 'Achievement deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete achievement', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Achievements
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditing({ icon: '🏆', title: '', description: '' })
                  setOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </DialogTrigger>
            {editing && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing.id ? 'Edit' : 'Add'} Achievement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon (emoji)</Label>
                    <Input
                      value={editing.icon}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      placeholder="🏆"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Achievement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Describe the achievement..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={() => handleSave(editing)} className="w-full">Save</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="p-4 border rounded-lg flex items-start gap-4">
            <span className="text-2xl">{achievement.icon}</span>
            <div className="flex-1">
              <h3 className="font-medium">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditing(achievement)
                  setOpen(true)
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Achievement?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(achievement.id!)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Projects Editor
function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (project: Project) => {
    try {
      const method = project.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })

      if (res.ok) {
        const saved = await res.json()
        if (project.id) {
          setProjects(projects.map(p => p.id === saved.id ? saved : p))
        } else {
          setProjects([...projects, saved])
        }
        setOpen(false)
        setEditing(null)
        toast({ title: 'Project saved!' })
      }
    } catch {
      toast({ title: 'Failed to save project', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id))
        toast({ title: 'Project deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete project', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Projects
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditing({
                    title: '',
                    description: '',
                    imageUrl: '',
                    githubUrl: '',
                    liveUrl: '',
                    tags: '',
                    featured: false,
                  })
                  setOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            {editing && (
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editing.id ? 'Edit' : 'Add'} Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Describe your project..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editing.imageUrl}
                      onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input
                        value={editing.githubUrl}
                        onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Live URL</Label>
                      <Input
                        value={editing.liveUrl}
                        onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={editing.tags}
                      onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={editing.featured}
                      onCheckedChange={(checked) =>
                        setEditing({ ...editing, featured: checked as boolean })
                      }
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                  <Button onClick={() => handleSave(editing)} className="w-full">Save</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.title}</h3>
                  {project.featured && <Badge>Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(project)
                    setOpen(true)
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(project.id!)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Social Links Editor
function SocialLinksEditor() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/social-links')
      .then(res => res.json())
      .then(data => setLinks(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (link: SocialLink) => {
    try {
      const method = link.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/social-links', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })

      if (res.ok) {
        const saved = await res.json()
        if (link.id) {
          setLinks(links.map(l => l.id === saved.id ? saved : l))
        } else {
          setLinks([...links, saved])
        }
        setOpen(false)
        setEditing(null)
        toast({ title: 'Social link saved!' })
      }
    } catch {
      toast({ title: 'Failed to save social link', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/social-links?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLinks(links.filter(l => l.id !== id))
        toast({ title: 'Social link deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete social link', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Social Links
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditing({ platform: '', url: '', icon: '' })
                  setOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            {editing && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing.id ? 'Edit' : 'Add'} Social Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      value={editing.platform}
                      onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                      placeholder="GitHub, LinkedIn, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={editing.url}
                      onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon (emoji)</Label>
                    <Input
                      value={editing.icon}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      placeholder="🐙"
                    />
                  </div>
                  <Button onClick={() => handleSave(editing)} className="w-full">Save</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 p-2 border rounded-lg">
              <span>{link.icon}</span>
              <span className="font-medium">{link.platform}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => {
                  setEditing(link)
                  setOpen(true)
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleDelete(link.id!)}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Proficiencies Editor
function ProficienciesEditor() {
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Proficiency | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/proficiencies')
      .then(res => res.json())
      .then(data => setProficiencies(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (prof: Proficiency) => {
    try {
      const method = prof.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/proficiencies', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prof),
      })

      if (res.ok) {
        const saved = await res.json()
        if (prof.id) {
          setProficiencies(proficiencies.map(p => p.id === saved.id ? saved : p))
        } else {
          setProficiencies([...proficiencies, saved])
        }
        setOpen(false)
        setEditing(null)
        toast({ title: 'Proficiency saved!' })
      }
    } catch {
      toast({ title: 'Failed to save proficiency', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/proficiencies?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProficiencies(proficiencies.filter(p => p.id !== id))
        toast({ title: 'Proficiency deleted' })
      }
    } catch {
      toast({ title: 'Failed to delete proficiency', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          What I&apos;m Good At
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditing({ icon: '⚡', title: '', description: '' })
                  setOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            {editing && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing.id ? 'Edit' : 'Add'} Proficiency</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon (emoji)</Label>
                    <Input
                      value={editing.icon}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      placeholder="⚡"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Building responsive web interfaces"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Additional details..."
                      rows={2}
                    />
                  </div>
                  <Button onClick={() => handleSave(editing)} className="w-full">Save</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {proficiencies.map((prof) => (
          <div key={prof.id} className="p-4 border rounded-lg flex items-start gap-4">
            <span className="text-2xl">{prof.icon}</span>
            <div className="flex-1">
              <h3 className="font-medium">{prof.title}</h3>
              <p className="text-sm text-muted-foreground">{prof.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditing(prof)
                  setOpen(true)
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(prof.id!)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Main Admin Dashboard
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/verify')
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated))
      .finally(() => setChecking(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    toast({ title: 'Logged out successfully' })
    router.push('/')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="/" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
              <TabsTrigger value="profile" className="data-[state=active]:bg-background">Profile</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-background">Skills</TabsTrigger>
              <TabsTrigger value="proficiencies" className="data-[state=active]:bg-background">Proficiencies</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-background">Experience</TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-background">Achievements</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-background">Projects</TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-background">Social Links</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileEditor />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsEditor />
            </TabsContent>
            <TabsContent value="proficiencies">
              <ProficienciesEditor />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceEditor />
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsEditor />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsEditor />
            </TabsContent>
            <TabsContent value="social">
              <SocialLinksEditor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
