import { db } from '../src/lib/db'

async function main() {
  await db.lifestylePhoto.deleteMany()

  const photos = [
    { imageUrl: '/uploads/life-1.svg', gallery: '/uploads/life-2.svg,/uploads/life-5.svg', caption: 'Late night coding session before the SUST CSE Fest — our team pulled an all-nighter and won! 🏆', category: 'Events', claps: 24, order: 0 },
    { imageUrl: '/uploads/life-2.svg', caption: 'Exploring the beautiful SUST campus during autumn — the hills of Sylhet are unreal 🌿', category: 'Campus', claps: 18, order: 1 },
    { imageUrl: '/uploads/life-3.svg', gallery: '/uploads/life-1.svg,/uploads/life-9.svg,/uploads/life-7.svg', caption: 'After winning the Smart Bangladesh Hackathon — 1200+ teams, and we came out on top! 🥇', category: 'Achievement', claps: 47, order: 2 },
    { imageUrl: '/uploads/life-4.svg', gallery: '/uploads/life-10.svg', caption: 'Weekend trip to Jaflong — crystal clear water and stone collection by the river 🏔️', category: 'Travel', claps: 15, order: 3 },
    { imageUrl: '/uploads/life-5.svg', caption: 'My competitive programming setup — dual monitor, mechanical keyboard, and way too much coffee ☕', category: 'Life', claps: 31, order: 4 },
    { imageUrl: '/uploads/life-6.svg', gallery: '/uploads/life-2.svg', caption: 'Hanging out with my ICPC teammates after a grueling 5-hour contest — we earned that pizza 🍕', category: 'Friends', claps: 22, order: 5 },
    { imageUrl: '/uploads/life-7.svg', caption: 'First time speaking at a tech meetup — talked about competitive programming for beginners 🎤', category: 'Events', claps: 19, order: 6 },
    { imageUrl: '/uploads/life-8.svg', caption: 'Sunset from my dorm room window — some days the sky just does this 🌅', category: 'Life', claps: 28, order: 7 },
    { imageUrl: '/uploads/life-9.svg', gallery: '/uploads/life-3.svg,/uploads/life-1.svg', caption: 'NASA Space Apps Challenge — built a satellite imagery dashboard in 48 hours straight 🛰️', category: 'Achievement', claps: 35, order: 8 },
    { imageUrl: '/uploads/life-10.svg', gallery: '/uploads/life-4.svg,/uploads/life-2.svg,/uploads/life-8.svg', caption: 'Road trip to Bandarban — the hills, the clouds, the winding roads — pure magic 🏔️', category: 'Travel', claps: 26, order: 9 },
  ]

  for (const p of photos) {
    await db.lifestylePhoto.create({ data: p })
  }
  console.log('✅ Seeded', photos.length, 'lifestyle photos')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await db.$disconnect() })
