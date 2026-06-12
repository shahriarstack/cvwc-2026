import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const territories = [
  "Manikganj", "Jamalpur", "Mymensingh", "Dhaka North", "Netrokona", "Feni", "Natore", "Munshiganj", 
  "Khulna", "Jhenaidah", "Borguna", "Chandpur", "Rajshahi", "Nilphamari", "Dhaka-3", "Rangpur", 
  "B. Baria", "Kushtia", "Sirajganj", "Tongi", "Narshingdi", "Laxmipur", "Thakurgaon", "Noakhali", 
  "Savar", "Tangail", "Gazipur", "Chapainawabgonj", "Dhaka South", "Gopalganj", "Jashore", "Kishoreganj", 
  "Cumilla 1", "Chattogram North", "Bogura", "Narayanganj", "Barisal", "Hobiganj", "Dinajpur", "Chattogram South", 
  "Madaripur", "Sylhet", "Cumilla-2", "Cox's Bazar"
];

async function main() {
  console.log('Seeding database...')
  
  // Clear existing
  await prisma.dailyPerformance.deleteMany()
  await prisma.match.deleteMany()
  await prisma.playerMVP.deleteMany()
  await prisma.territory.deleteMany()

  // Divisions
  const divisions = ["Elite", "Champions", "Warriors", "Challengers"]

  for (let i = 0; i < territories.length; i++) {
    const divisionIndex = Math.floor(i / 11);
    await prisma.territory.create({
      data: {
        name: territories[i],
        division: divisions[divisionIndex],
      }
    })
  }

  const allTerritories = await prisma.territory.findMany()

  // Generate 5 days of random data
  const today = new Date()
  for (let d = 0; d < 5; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() - d)
    // Normalize date to midnight to avoid unique constraint issues if run multiple times without clearing
    date.setHours(0, 0, 0, 0)
    
    for (const terr of allTerritories) {
      const newSalesFoton = Math.floor(Math.random() * 10)
      const newSalesMahindra = Math.floor(Math.random() * 5)
      const resale = Math.floor(Math.random() * 8)
      const recoveryScore = Math.random() * 40 // Out of 40%
      
      // Max score components: Sales (50% max)
      const newSalesScore = Math.min((newSalesFoton + newSalesMahindra) * 3, 20) // max 20%
      const resaleScore = Math.min(resale * 5, 30) // max 30%
      const extraResaleUnits = Math.max(0, resale - 6)
      const mahindraBonus = Math.min((newSalesMahindra * 2) + (extraResaleUnits * 2), 10)
      
      const salesPerformanceScore = newSalesScore + resaleScore
      
      const totalDailyScore = salesPerformanceScore + recoveryScore + mahindraBonus

      await prisma.dailyPerformance.create({
        data: {
          date,
          territoryId: terr.id,
          newSalesFoton,
          newSalesMahindra,
          resale,
          salesPerformanceScore,
          recoveryPerformanceScore: recoveryScore,
          mahindraBonusScore: mahindraBonus,
          totalDailyScore
        }
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
