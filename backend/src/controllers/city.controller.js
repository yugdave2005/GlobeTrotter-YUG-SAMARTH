import prisma from '../utils/prisma.js';

export const getCities = async (req, res) => {
  try {
    const { search, region, country } = req.query;
    
    let where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (region) where.region = region;
    if (country) where.country = country;
    
    const cities = await prisma.city.findMany({
      where,
      orderBy: { popularityScore: 'desc' },
      take: 20
    });
    
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCityById = async (req, res) => {
  try {
    const city = await prisma.city.findUnique({ where: { id: req.params.id } });
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
