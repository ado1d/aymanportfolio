import { db } from '../src/lib/db'

async function main() {
  // Clean
  await db.testimonial.deleteMany()
  await db.currentlyItem.deleteMany()

  const testimonials = [
    {
      name: 'Dr. Sadia Karim',
      role: 'Associate Professor, CSE',
      company: 'BUET',
      quote:
        'Ayman is one of the sharpest algorithmic thinkers I have taught in a decade. His grasp of dynamic programming and graph theory is exceptional for an undergraduate — he regularly solves problems that stump my graduate students.',
      rating: 5,
      order: 0,
    },
    {
      name: 'Tanvir Hasan',
      role: 'Tech Lead & Mentor',
      company: 'Smart Bangladesh Hackathon',
      quote:
        'I mentored 40+ teams at the national hackathon. Ayman\'s team stood out — not just for winning, but for the engineering discipline they brought to a 24-hour sprint. He ships like a senior dev.',
      rating: 5,
      order: 1,
    },
    {
      name: 'Nusrat Jahan',
      role: 'Teammate & ICPC Partner',
      company: 'BUET CSE',
      quote:
        'We trained together for ICPC for two years. Ayman is the teammate everyone wants — calm under pressure, generous with knowledge, and somehow always finds the bug before you do.',
      rating: 5,
      order: 2,
    },
  ]
  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  const currently = [
    { type: 'learning', label: 'Advanced System Design', order: 0 },
    { type: 'learning', label: 'Rust & WebAssembly', order: 1 },
    { type: 'building', label: 'A competitive-programming coach AI', order: 2 },
    { type: 'reading', label: '"Designing Data-Intensive Applications"', order: 3 },
    { type: 'reading', label: '"Algorithm Design Manual" by Skiena', order: 4 },
    { type: 'listening', label: 'Lo-fi & synthwave while coding', order: 5 },
  ]
  for (const c of currently) {
    await db.currentlyItem.create({ data: c })
  }

  console.log('✅ Seeded', testimonials.length, 'testimonials and', currently.length, 'currently items')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
