import prisma from '../utils/prisma.js';

export const addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { tripStopId, category, amount, description } = req.body;
    
    const expense = await prisma.tripExpense.create({
      data: {
        tripId,
        tripStopId,
        category,
        amount: parseFloat(amount),
        description
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const expenses = await prisma.tripExpense.findMany({
      where: { tripId }
    });
    
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });
    
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    let totalActivityCost = 0;
    trip.stops.forEach(stop => {
      stop.activities.forEach(stopAct => {
        totalActivityCost += stopAct.customCost ?? stopAct.activity.cost;
      });
    });
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalCost = totalActivityCost + totalExpenses;
    
    res.json({
      tripId,
      totalCost,
      breakdown: {
        activities: totalActivityCost,
        manualExpenses: totalExpenses,
        expensesList: expenses
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
