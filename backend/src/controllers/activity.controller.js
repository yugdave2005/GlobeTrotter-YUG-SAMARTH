import prisma from '../utils/prisma.js';

export const getActivities = async (req, res) => {
  try {
    const { cityId, category, maxCost } = req.query;
    
    let where = {};
    if (cityId) where.cityId = cityId;
    if (category) where.category = category;
    if (maxCost) where.cost = { lte: parseFloat(maxCost) };
    
    const activities = await prisma.activity.findMany({
      where,
      orderBy: { cost: 'asc' }
    });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
