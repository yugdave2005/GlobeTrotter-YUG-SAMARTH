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
  const paris = await prisma.city.create({
    data: {
      name: 'Paris', country: 'France', region: 'Europe', costIndex: 1.5, popularityScore: 100,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    },
  });

  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 1.8, popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000',
    },
  });

  await prisma.activity.createMany({
    data: [
      { cityId: paris.id, name: 'Eiffel Tower Visit', category: 'SIGHTSEEING', cost: 30.0, durationMinutes: 120, description: 'Visit the iconic Eiffel Tower.' },
      { cityId: paris.id, name: 'Seine River Cruise', category: 'RELAXATION', cost: 20.0, durationMinutes: 60, description: 'Relaxing cruise along the Seine.' },
    ],
  });

  await prisma.activity.createMany({
    data: [
      { cityId: tokyo.id, name: 'Shibuya Crossing', category: 'SIGHTSEEING', cost: 0.0, durationMinutes: 30, description: 'Experience the busiest intersection in the world.' },
      { cityId: tokyo.id, name: 'Sushi Making Class', category: 'FOOD', cost: 80.0, durationMinutes: 180, description: 'Learn to make authentic sushi.' },
    ],
  });

  console.log('Seed data inserted successfully.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
