import { db } from '../src/lib/db'

async function main() {
  // Clean existing data
  await db.socialLink.deleteMany()
  await db.project.deleteMany()
  await db.achievement.deleteMany()
  await db.certificate.deleteMany()
  await db.contest.deleteMany()
  await db.hackathon.deleteMany()
  await db.education.deleteMany()
  await db.skill.deleteMany()
  await db.profile.deleteMany()

  // Profile
  await db.profile.create({
    data: {
      name: 'Ayman Chowdhury',
      title: 'CS Undergraduate · Competitive Programmer · Full-Stack Builder',
      tagline: 'Turning algorithms into products, one problem at a time.',
      about:
        "I'm a Computer Science undergraduate at Shahjalal University of Science and Technology (SUST) with a deep love for problem solving and building things that ship. I spend my time grinding competitive programming contests on Codeforces, hacking through hackathons, and shipping side projects with modern web stacks. I'm currently looking for opportunities where I can blend algorithmic rigor with real-world product engineering.",
      email: 'ayman.dev@gmail.com',
      phone: '+880 1XXX-XXXXXX',
      location: 'Noakhali, Bangladesh',
      avatarUrl: '/uploads/avatar.svg',
      resumeUrl: '#',
      available: true,
    },
  })

  // Skills
  const skills = [
    { category: 'Languages', name: 'C++', level: 95 },
    { category: 'Languages', name: 'Python', level: 90 },
    { category: 'Languages', name: 'JavaScript', level: 88 },
    { category: 'Languages', name: 'TypeScript', level: 85 },
    { category: 'Languages', name: 'Java', level: 80 },
    { category: 'Languages', name: 'SQL', level: 82 },
    { category: 'Web', name: 'React / Next.js', level: 88 },
    { category: 'Web', name: 'Node.js / Express', level: 85 },
    { category: 'Web', name: 'Tailwind CSS', level: 90 },
    { category: 'Web', name: 'Prisma / PostgreSQL', level: 82 },
    { category: 'Web', name: 'Socket.io', level: 78 },
    { category: 'Tools', name: 'Git & GitHub', level: 92 },
    { category: 'Tools', name: 'Docker', level: 70 },
    { category: 'Tools', name: 'Linux / Bash', level: 85 },
    { category: 'Tools', name: 'Figma', level: 65 },
    { category: 'CS Core', name: 'Data Structures & Algorithms', level: 95 },
    { category: 'CS Core', name: 'Dynamic Programming', level: 90 },
    { category: 'CS Core', name: 'Graph Theory', level: 88 },
    { category: 'CS Core', name: 'System Design', level: 72 },
    { category: 'AI/ML', name: 'TensorFlow', level: 68 },
    { category: 'AI/ML', name: 'scikit-learn', level: 75 },
  ]
  for (let i = 0; i < skills.length; i++) {
    await db.skill.create({ data: { ...skills[i], order: i } })
  }

  // Education
  await db.education.create({
    data: {
      institution: 'Shahjalal University of Science & Technology (SUST)',
      degree: 'B.Sc. in Computer Science & Engineering',
      field: 'Computer Science',
      period: '2022 — 2026 (Expected)',
      description:
        'Studying core CS — algorithms, operating systems, databases, networking, and software engineering. Active member of the BUET CSE Competitive Programming Club.',
      gpa: '3.78 / 4.00',
      courses:
        'Data Structures, Algorithms, Operating Systems, Database Systems, Computer Networks, Artificial Intelligence, Software Engineering, Discrete Mathematics, Linear Algebra, Probability & Statistics',
      order: 0,
    },
  })
  await db.education.create({
    data: {
      institution: 'Notre Dame College, Dhaka',
      degree: 'Higher Secondary Certificate (Science)',
      field: 'Science',
      period: '2018 — 2020',
      description:
        'Graduated with distinction. Represented the college at the National Math Olympiad and Inter-college Programming Contest.',
      gpa: '5.00 / 5.00',
      courses: 'Higher Mathematics, Physics, Chemistry, Biology',
      order: 1,
    },
  })

  // Hackathons
  const hackathons = [
    {
      title: 'Smart Bangladesh Hackathon',
      organizer: 'ICT Division, Bangladesh',
      date: 'March 2024',
      result: '🥇 National Champion (1st Place)',
      teamSize: 4,
      description:
        'Built "ShikkhoPath" — an offline-first AI tutor for rural students using on-device LLMs and Bengali NLP. Won out of 1,200+ teams nationwide.',
      projectUrl: '#',
      imageUrl: '/uploads/hackathon-1.svg',
      tags: 'Next.js, Python, ONNX, Bengali NLP',
      order: 0,
    },
    {
      title: 'NASA Space Apps Challenge',
      organizer: 'NASA',
      date: 'October 2023',
      result: '🥈 2nd Place — Local Round',
      teamSize: 5,
      description:
        'Developed a satellite imagery dashboard that tracks deforestation in the Sundarbans using computer vision on Landsat data.',
      projectUrl: '#',
      imageUrl: '/uploads/hackathon-2.svg',
      tags: 'React, FastAPI, OpenCV, Satellite Imagery',
      order: 1,
    },
    {
      title: 'BUET CSE Fest Hackathon',
      organizer: 'BUET CSE',
      date: 'February 2024',
      result: '🏆 Top 5 Finalist',
      teamSize: 3,
      description:
        'Created a real-time collaborative code editor with shared cursors, voice chat, and an AI pair-programmer powered by a local code model.',
      projectUrl: '#',
      imageUrl: '/uploads/hackathon-3.svg',
      tags: 'Next.js, Socket.io, WebRTC, Monaco Editor',
      order: 2,
    },
    {
      title: 'HackTheNorth Regional',
      organizer: 'Tech Community BD',
      date: 'September 2023',
      result: '🎯 Best Use of Cloud API',
      teamSize: 4,
      description:
        'Designed a logistics optimizer for local delivery startups that cuts fuel cost by ~22% using a custom routing algorithm and live traffic data.',
      projectUrl: '#',
      imageUrl: '/uploads/hackathon-4.svg',
      tags: 'Vue.js, Django, PostgreSQL, OR-Tools',
      order: 3,
    },
  ]
  for (let i = 0; i < hackathons.length; i++) {
    await db.hackathon.create({ data: { ...hackathons[i], order: i } })
  }

  // Contests
  const contests = [
    {
      name: 'Codeforces Round #928 (Div. 4)',
      platform: 'Codeforces',
      date: 'Feb 2024',
      rank: 'Ranked 47th globally',
      rating: '1845 (Specialist)',
      description: 'Solved all 8 problems. Gained +87 rating. Placed in top 0.3% of 28k+ participants.',
      badge: '🟣',
      order: 0,
    },
    {
      name: 'ICPC Asia Regional Dhaka',
      platform: 'ICPC',
      date: 'Nov 2023',
      rank: 'Bronze Medal · 9th Place',
      rating: '—',
      description: 'Represented BUET. Solved 8/12 problems including a tough graph + DP combo.',
      badge: '🥉',
      order: 1,
    },
    {
      name: 'CodeChef Starters 124',
      platform: 'CodeChef',
      date: 'Jan 2024',
      rank: 'Global Rank 62',
      rating: '2104 (5★)',
      description: 'Secured 5-star rating. Cracked the hardest problem of the contest.',
      badge: '⭐',
      order: 2,
    },
    {
      name: 'BUET Intra-University Programming Contest',
      platform: 'BUET',
      date: 'Jul 2023',
      rank: 'Champion (1st Place)',
      rating: '—',
      description: 'Won among 400+ contestants. Solved 9/10 problems with the fastest time on problem F.',
      badge: '🥇',
      order: 3,
    },
    {
      name: 'Google Kick Start Round H',
      platform: 'Google Kick Start',
      date: 'Nov 2023',
      rank: 'Top 500 globally',
      rating: '—',
      description: 'Full solve on all 4 problems. Advanced to the next round.',
      badge: '🔵',
      order: 4,
    },
    {
      name: 'AtCoder Beginner Contest 340',
      platform: 'AtCoder',
      date: 'Feb 2024',
      rank: 'Performance 1928',
      rating: '1427 (Kyū 5)',
      description: 'Solved A–E. Consistent climb toward Dan rank.',
      badge: '🟠',
      order: 5,
    },
  ]
  for (let i = 0; i < contests.length; i++) {
    await db.contest.create({ data: { ...contests[i], order: i } })
  }

  // Certificates
  const certificates = [
    {
      title: 'Meta Front-End Developer Professional',
      issuer: 'Meta / Coursera',
      date: 'Aug 2024',
      credentialId: 'META-FE-2024-8842',
      credentialUrl: '#',
      imageUrl: '/uploads/cert-1.svg',
      description: '9-course specialization covering React, UX, and production front-end engineering.',
      order: 0,
    },
    {
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Jun 2024',
      credentialId: 'AWS-CCP-2024-5519',
      credentialUrl: '#',
      imageUrl: '/uploads/cert-2.svg',
      description: 'Foundational cloud certification covering AWS core services, security, and pricing.',
      order: 1,
    },
    {
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI / Stanford',
      date: 'Mar 2024',
      credentialId: 'DLAI-ML-2024-3301',
      credentialUrl: '#',
      imageUrl: '/uploads/cert-3.svg',
      description: 'Andrew Ng’s 3-course specialization on supervised, unsupervised, and deep learning.',
      order: 2,
    },
    {
      title: 'Problem Solving (Intermediate) Certificate',
      issuer: 'HackerRank',
      date: 'Jan 2024',
      credentialId: 'HR-PSI-2024-7720',
      credentialUrl: '#',
      imageUrl: '/uploads/cert-4.svg',
      description: 'Verified proficiency in data structures, algorithms, and complexity analysis.',
      order: 3,
    },
    {
      title: 'MongoDB Associate Developer',
      issuer: 'MongoDB University',
      date: 'Nov 2023',
      credentialId: 'MDB-AD-2023-4410',
      credentialUrl: '#',
      imageUrl: '/uploads/cert-5.svg',
      description: 'Hands-on certification in MongoDB CRUD, aggregation, schema design, and indexing.',
      order: 4,
    },
  ]
  for (let i = 0; i < certificates.length; i++) {
    await db.certificate.create({ data: { ...certificates[i], order: i } })
  }

  // Achievements
  const achievements = [
    { icon: '🏆', title: '12+ Hackathons', description: 'Participated & podium finishes' },
    { icon: '⭐', title: 'Codeforces Specialist', description: 'Peak rating 1845' },
    { icon: '🥇', title: 'ICPC Bronze', description: 'Asia Regional Dhaka 2023' },
    { icon: '💻', title: '20+ Projects', description: 'Shipped to production' },
    { icon: '📚', title: 'GPA 3.78', description: 'Top of the class tier' },
    { icon: '🎯', title: '5★ CodeChef', description: '2104 peak rating' },
  ]
  for (let i = 0; i < achievements.length; i++) {
    await db.achievement.create({ data: { ...achievements[i], order: i } })
  }

  // Projects
  const projects = [
    {
      title: 'AlgoArena',
      description: 'A real-time competitive programming judge with live leaderboard, anti-cheat, and an AI hint engine.',
      longDescription:
        'Built a full judging platform supporting C++/Python/Java with sandboxed execution, sub-second verdicts, ELO-based rating, and a WebSocket live leaderboard. The AI hint engine uses a fine-tuned code model to nudge users without giving away the answer.',
      imageUrl: '/uploads/project-1.svg',
      gallery: '/uploads/project-1.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Next.js, Go, Redis, Docker, WebSocket',
      featured: true,
      order: 0,
    },
    {
      title: 'ShikkhoPath',
      description: 'Offline-first AI tutor for rural students using on-device LLMs and Bengali NLP.',
      longDescription:
        'Award-winning hackathon project. Runs a quantized LLM fully on-device so students without internet can still get personalized tutoring in Bengali. Includes voice input and a gamified progress system.',
      imageUrl: '/uploads/project-2.svg',
      gallery: '/uploads/project-2.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Next.js, ONNX, Whisper, Bengali NLP',
      featured: true,
      order: 1,
    },
    {
      title: 'DevSync Editor',
      description: 'Real-time collaborative code editor with shared cursors, voice chat, and AI pair-programmer.',
      longDescription:
        'A Google-Docs-for-code experience built on CRDTs for conflict-free editing, WebRTC for crystal-clear voice, and a local code model that suggests the next line as you type.',
      imageUrl: '/uploads/project-3.svg',
      gallery: '/uploads/project-3.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Next.js, Socket.io, WebRTC, Yjs, Monaco',
      featured: true,
      order: 2,
    },
    {
      title: 'RouteWise',
      description: 'Logistics optimizer that cuts last-mile delivery fuel cost by ~22% using live traffic + OR-Tools.',
      longDescription:
        'A SaaS dashboard for local delivery startups. Ingests live traffic, computes optimal multi-stop routes with capacity constraints, and visualizes the fleet in real time.',
      imageUrl: '/uploads/project-4.svg',
      gallery: '/uploads/project-4.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Vue.js, Django, OR-Tools, Mapbox',
      featured: false,
      order: 3,
    },
    {
      title: 'Codeforces Visualizer',
      description: 'Beautiful analytics dashboard for Codeforces users — rating graph, weak-topic radar, solve heatmap.',
      longDescription:
        'Consumes the Codeforces API to render a personal competitive-programming cockpit: rating trajectory, per-tag solve heatmap, weakness radar, and a "what to practice next" recommender.',
      imageUrl: '/uploads/project-5.svg',
      gallery: '/uploads/project-5.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'React, D3.js, Codeforces API',
      featured: false,
      order: 4,
    },
    {
      title: 'CampusConnect',
      description: 'A campus social platform with course reviews, ride-share, and a marketplace for students.',
      longDescription:
        'An all-in-one student app used by 2,000+ BUET students. Includes verified course reviews, a ride-share matching system, and a moderation-first marketplace.',
      imageUrl: '/uploads/project-6.svg',
      gallery: '/uploads/project-6.svg',
      githubUrl: '#',
      liveUrl: '#',
      tags: 'Next.js, Prisma, PostgreSQL, NextAuth',
      featured: false,
      order: 5,
    },
  ]
  for (let i = 0; i < projects.length; i++) {
    await db.project.create({ data: { ...projects[i], order: i } })
  }

  // Social links
  const socials = [
    { platform: 'GitHub', url: 'https://github.com/ado1d', icon: 'github', order: 0 },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/aymanchowdhury69', icon: 'linkedin', order: 1 },
    { platform: 'Codeforces', url: 'https://codeforces.com/profile/adold_op', icon: 'codeforces', order: 2 },
    { platform: 'Facebook', url: 'https://www.facebook.com/ayman.chowdhury.7731', icon: 'facebook', order: 3 },
    { platform: 'Email', url: 'mailto:ayman.dev@gmail.com', icon: 'mail', order: 4 },
  ]
  for (let i = 0; i < socials.length; i++) {
    await db.socialLink.create({ data: { ...socials[i], order: i } })
  }

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
