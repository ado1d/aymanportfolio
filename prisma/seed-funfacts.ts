import { db } from '../src/lib/db'

async function main() {
  await db.funFact.deleteMany()

  const facts = [
    { icon: '⚡', text: 'I once solved a Codeforces problem in 47 seconds during a live contest.', order: 0 },
    { icon: '☕', text: 'My hackathon fuel of choice is cold brew + lo-fi synthwave at 2 AM.', order: 1 },
    { icon: '🎯', text: "I've written more C++ than English essays in the last 3 years.", order: 2 },
    { icon: '🐛', text: 'My longest debugging session was 14 hours — it was a single off-by-one error.', order: 3 },
    { icon: '🏆', text: "I won my first hackathon wearing the same hoodie I'm wearing now.", order: 4 },
    { icon: '📚', text: 'I\'ve read "Designing Data-Intensive Applications" cover to cover — twice.', order: 5 },
    { icon: '🧮', text: 'Dynamic programming is my favorite algorithm paradigm. Fight me.', order: 6 },
    { icon: '🌍', text: 'I want to visit every country that has a competitive programming scene.', order: 7 },
    { icon: '🎹', text: 'I debug faster when listening to video game soundtracks.', order: 8 },
    { icon: '🚀', text: 'My dream is to build a tool used by 1 million developers.', order: 9 },
  ]

  for (const f of facts) {
    await db.funFact.create({ data: f })
  }
  console.log('✅ Seeded', facts.length, 'fun facts')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await db.$disconnect() })
