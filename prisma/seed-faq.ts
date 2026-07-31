import { db } from '../src/lib/db'

async function main() {
  await db.faq.deleteMany()

  const faqs = [
    {
      question: "Are you available for internships or full-time roles?",
      answer: "Yes! I'm a final-year student graduating in 2025, actively looking for software engineering internships and new-grad full-time roles. I'm especially interested in roles involving backend systems, competitive programming-adjacent work, or full-stack product engineering. Reach out via the contact form and I'll respond within 24 hours.",
      category: "Opportunities",
      order: 0,
    },
    {
      question: "What's your competitive programming background?",
      answer: "I've been competing for 3+ years. My peak Codeforces rating is 1845 (Specialist), I won a Bronze medal at ICPC Asia Regional Dhaka 2023, and I hold 5★ on CodeChef (2104). I regularly participate in contests on Codeforces, CodeChef, AtCoder, and Google Kick Start. Check the Contests section for my full record.",
      category: "Competitive Programming",
      order: 1,
    },
    {
      question: "What technologies do you work with?",
      answer: "My strongest languages are C++, Python, and TypeScript. For web development I use Next.js, React, Node.js, Tailwind CSS, and Prisma. I'm comfortable with PostgreSQL, Redis, Docker, and Linux. I also have experience with ML libraries (TensorFlow, scikit-learn) and am currently learning Rust. See the Skills section for full proficiency breakdowns.",
      category: "Technical",
      order: 2,
    },
    {
      question: "Can you tell me about your hackathon experience?",
      answer: "I've participated in 12+ hackathons with multiple podium finishes, including 1st place at the Smart Bangladesh National Hackathon (out of 1,200+ teams) and 2nd at NASA Space Apps Challenge. I thrive under 24-48 hour time pressure and usually take the role of full-stack integrator + algorithm designer. See the Hackathons section for details.",
      category: "Hackathons",
      order: 3,
    },
    {
      question: "Do you contribute to open source?",
      answer: "Yes — I've made contributions to a few developer tools and maintain a few of my own open-source projects (like the Codeforces Visualizer in my Projects section). I believe in giving back to the community that taught me so much. GitHub link is in the footer and contact section.",
      category: "Community",
      order: 4,
    },
    {
      question: "How do you stay updated with new technologies?",
      answer: "I read engineering blogs (ByteByteGo, High Scalability), follow key people on X/Twitter, watch conference talks, and most importantly — I build. My 'Currently' widget in the About section shows what I'm learning and reading right now. I also grind competitive programming problems daily to keep my algorithmic skills sharp.",
      category: "Learning",
      order: 5,
    },
  ]

  for (const f of faqs) {
    await db.faq.create({ data: f })
  }
  console.log('✅ Seeded', faqs.length, 'FAQs')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
