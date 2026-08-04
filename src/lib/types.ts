export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  about: string
  email: string
  phone: string | null
  location: string | null
  avatarUrl: string | null
  resumeUrl: string | null
  available: boolean
}

export interface SkillItem {
  id: string
  name: string
  level: number
}
export type Skills = Record<string, SkillItem[]>

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  period: string
  description: string
  gpa: string | null
  courses: string | null
  order: number
}

export interface Hackathon {
  id: string
  title: string
  organizer: string
  date: string
  result: string | null
  teamSize: number
  description: string
  projectUrl: string | null
  imageUrl: string | null
  tags: string | null
  order: number
}

export interface Contest {
  id: string
  name: string
  platform: string
  date: string
  rank: string | null
  rating: string | null
  description: string
  badge: string | null
  order: number
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  credentialId: string | null
  credentialUrl: string | null
  imageUrl: string | null
  description: string | null
  order: number
}

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  order: number
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string | null
  imageUrl: string | null
  gallery: string | null
  githubUrl: string | null
  liveUrl: string | null
  tags: string | null
  featured: boolean
  order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string | null
  avatarUrl: string | null
  quote: string
  rating: number
  order: number
}

export interface CurrentlyItem {
  id: string
  label: string
}
export type CurrentlyData = Record<string, CurrentlyItem[]>

export interface Faq {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface PortfolioData {
  profile: Profile | null
  skills: Skills
  education: Education[]
  hackathons: Hackathon[]
  contests: Contest[]
  certificates: Certificate[]
  achievements: Achievement[]
  projects: Project[]
  socialLinks: SocialLink[]
  testimonials: Testimonial[]
  currently: CurrentlyData
  faqs: Faq[]
  funFacts: FunFact[]
}

export interface FunFact {
  id: string
  icon: string
  text: string
  order: number
}
