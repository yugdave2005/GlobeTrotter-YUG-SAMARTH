import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pkg2 from '@prisma/client';
const { PrismaClient } = pkg2;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding cities and activities...');

  // Clean old data to avoid unique constraint issues
  await prisma.stopActivity.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();

  const citiesData = [
    // India Destinations
    {
      name: 'Jaipur', country: 'India', region: 'Asia', costIndex: 1.5, popularityScore: 99,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Amber Fort Elephant & Heritage Tour', category: 'SIGHTSEEING', cost: 1200.0, durationMinutes: 180, description: 'Explore opulent courtyards, Sheesh Mahal, and hill fortress architecture.' },
        { name: 'Hawa Mahal & City Palace Photo Walk', category: 'SIGHTSEEING', cost: 800.0, durationMinutes: 120, description: 'Iconic Palace of Winds and royal Maharaja palace museum.' },
        { name: 'Chokhi Dhani Cultural Village Dinner', category: 'FOOD', cost: 1500.0, durationMinutes: 180, description: 'Traditional Rajasthani thali, folk dance, fire shows, and camel rides.' },
        { name: 'Nahargarh Sunset Point Excursion', category: 'ADVENTURE', cost: 500.0, durationMinutes: 90, description: 'Panoramic evening vista of the Pink City from the Aravali hills.' },
      ]
    },
    {
      name: 'Goa', country: 'India', region: 'Asia', costIndex: 2.0, popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Scuba Diving & Watersports at Grand Island', category: 'ADVENTURE', cost: 3500.0, durationMinutes: 240, description: 'Explore coral reefs, jet skiing, parasailing, and banana rides.' },
        { name: 'Mandovi River Sunset Cruise & DJ Party', category: 'RELAXATION', cost: 1200.0, durationMinutes: 120, description: 'Scenic 2-hour luxury catamaran cruise with Goan folk performances.' },
        { name: 'Old Goa Portuguese Churches Tour', category: 'SIGHTSEEING', cost: 600.0, durationMinutes: 150, description: 'Visit Basilica of Bom Jesus, Se Cathedral, and Latin Quarter Fontainhas.' },
        { name: 'Beachside Seafood BBQ & Cocktails', category: 'FOOD', cost: 1800.0, durationMinutes: 120, description: 'Authentic Goan prawn curry and fresh catch at an Anjuna shack.' },
      ]
    },
    {
      name: 'Udaipur', country: 'India', region: 'Asia', costIndex: 1.8, popularityScore: 97,
      imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Lake Pichola Sunset Boat Cruise', category: 'RELAXATION', cost: 1100.0, durationMinutes: 90, description: 'Romantic boat ride passing Taj Lake Palace and Jag Mandir island.' },
        { name: 'Udaipur City Palace Grand Tour', category: 'SIGHTSEEING', cost: 950.0, durationMinutes: 150, description: 'Rajasthan’s largest palace complex with mirror galleries.' },
        { name: 'Bagore Ki Haveli Folk & Puppet Show', category: 'SIGHTSEEING', cost: 400.0, durationMinutes: 60, description: 'Traditional Dharohar dance performance on the ghats.' },
      ]
    },
    {
      name: 'Kerala (Munnar & Alleppey)', country: 'India', region: 'Asia', costIndex: 1.9, popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Alleppey Backwaters Houseboat Day Cruise', category: 'RELAXATION', cost: 4500.0, durationMinutes: 300, description: 'Private Kettuvallam boat cruise with traditional Sadya lunch on banana leaf.' },
        { name: 'Munnar Tea Plantations & Factory Trek', category: 'ADVENTURE', cost: 1000.0, durationMinutes: 150, description: 'Hike through misty rolling green tea estates and taste fresh CTC tea.' },
        { name: 'Ayurvedic Rejuvenation Massage', category: 'RELAXATION', cost: 2500.0, durationMinutes: 90, description: 'Authentic herbal oil Abhyanga therapy for wellness.' },
      ]
    },
    {
      name: 'Varanasi', country: 'India', region: 'Asia', costIndex: 1.2, popularityScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Ganga Sunrise Boat Ride & Ghats Tour', category: 'SIGHTSEEING', cost: 800.0, durationMinutes: 120, description: 'Witness spiritual morning rituals from Assi to Manikarnika Ghat.' },
        { name: 'Grand Evening Ganga Aarti at Dashashwamedh', category: 'SIGHTSEEING', cost: 0.0, durationMinutes: 90, description: 'Hypnotic sacred fire ritual with chanting priests.' },
        { name: 'Kashi Chaat Bhandar Street Food Safari', category: 'FOOD', cost: 600.0, durationMinutes: 90, description: 'Tamatar chaat, creamy lassi in kulhad, and authentic Banarasi paan.' },
      ]
    },
    {
      name: 'Manali & Rohtang', country: 'India', region: 'Asia', costIndex: 2.2, popularityScore: 97,
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Solang Valley Paragliding & ATV Ride', category: 'ADVENTURE', cost: 3200.0, durationMinutes: 120, description: 'Tandem flight over snow-capped peaks and valleys.' },
        { name: 'Rohtang Pass Snow Excursion', category: 'ADVENTURE', cost: 2800.0, durationMinutes: 240, description: 'High-altitude mountain pass at 13,058 ft with breathtaking snow.' },
        { name: 'Old Manali Riverside Cafe Crawl', category: 'FOOD', cost: 1200.0, durationMinutes: 150, description: 'Trout fish, woodfired pizza, and live acoustic music by the stream.' },
      ]
    },
    // Global Destinations
    {
      name: 'Paris', country: 'France', region: 'Europe', costIndex: 3.5, popularityScore: 99,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Eiffel Tower Sunset Tour', category: 'SIGHTSEEING', cost: 2800.0, durationMinutes: 120, description: 'Breathtaking panoramic views from the summit at twilight.' },
        { name: 'Seine River Evening Cruise', category: 'RELAXATION', cost: 2200.0, durationMinutes: 75, description: 'Glass-canopy boat cruise with live commentary and wine.' },
        { name: 'Croissant & Pastry Masterclass', category: 'FOOD', cost: 5500.0, durationMinutes: 150, description: 'Learn Parisian baking techniques in Le Marais.' },
        { name: 'Louvre Highlights Guided Walk', category: 'SIGHTSEEING', cost: 3800.0, durationMinutes: 180, description: 'Skip-the-line tour covering the Mona Lisa, Venus de Milo, and Winged Victory.' },
      ]
    },
    {
      name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 4.0, popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Shibuya Crossing & Hachiko Statue', category: 'SIGHTSEEING', cost: 0.0, durationMinutes: 45, description: 'Walk across the world-famous scramble intersection.' },
        { name: 'Tsukiji Outer Market Food Tour', category: 'FOOD', cost: 4500.0, durationMinutes: 120, description: 'Taste fresh sushi, wagyu skewers, and tamagoyaki with a local chef.' },
        { name: 'Shinjuku Robot & Neon VR Experience', category: 'ADVENTURE', cost: 4200.0, durationMinutes: 90, description: 'High-tech interactive arcade and neon nightlife exploration.' },
        { name: 'Meiji Shrine Morning Walk', category: 'RELAXATION', cost: 0.0, durationMinutes: 60, description: 'Serene forest sanctuary in the heart of Shibuya.' },
      ]
    },
    {
      name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 1.8, popularityScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Tegallalang Rice Terrace Trek', category: 'ADVENTURE', cost: 1200.0, durationMinutes: 90, description: 'Hike through emerald green rice paddies with iconic jungle swings.' },
        { name: 'Uluwatu Sunset & Kecak Fire Dance', category: 'SIGHTSEEING', cost: 1600.0, durationMinutes: 120, description: 'Cliff-edge temple views accompanied by ancient Balinese chanting.' },
        { name: 'Balinese Herbal Spa & Flower Bath', category: 'RELAXATION', cost: 3200.0, durationMinutes: 120, description: 'Traditional aromatherapy massage overlooking the jungle.' },
      ]
    },
    {
      name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 2.8, popularityScore: 97,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Colosseum & Roman Forum VIP Access', category: 'SIGHTSEEING', cost: 3900.0, durationMinutes: 150, description: 'Walk through the gladiators arena and ancient ruins.' },
        { name: 'Trastevere Pasta & Gelato Crawl', category: 'FOOD', cost: 4800.0, durationMinutes: 180, description: 'Sample handmade cacio e pepe and organic gelato.' },
      ]
    },
    {
      name: 'New York', country: 'United States', region: 'Americas', costIndex: 4.5, popularityScore: 97,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Central Park Bike Tour', category: 'ADVENTURE', cost: 2500.0, durationMinutes: 120, description: 'Cycle through Strawberry Fields and Bethesda Terrace.' },
        { name: 'Broadway Musical Evening', category: 'SIGHTSEEING', cost: 8900.0, durationMinutes: 160, description: 'World-class theatrical performance in Times Square.' },
      ]
    },
    {
      name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 2.5, popularityScore: 95,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1000',
      activities: [
        { name: 'Sagrada Familia Tower Tour', category: 'SIGHTSEEING', cost: 3200.0, durationMinutes: 100, description: 'Gaudi architectural masterpiece with spiral tower ascent.' },
        { name: 'Barceloneta Sunset Paddleboarding', category: 'ADVENTURE', cost: 2800.0, durationMinutes: 90, description: 'Paddle across the Mediterranean coastline.' },
      ]
    }
  ];

  for (const c of citiesData) {
    const { activities, ...cityFields } = c;
    const city = await prisma.city.create({
      data: cityFields
    });

    if (activities && activities.length > 0) {
      await prisma.activity.createMany({
        data: activities.map(act => ({ ...act, cityId: city.id }))
      });
    }
  }

  console.log(`✅ Successfully seeded ${citiesData.length} cities with dynamic activities!`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });

