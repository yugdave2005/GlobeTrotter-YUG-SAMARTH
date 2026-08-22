import prisma from '../utils/prisma.js';

export const createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhotoUrl
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: { stops: { include: { city: true } } },
      orderBy: { startDate: 'asc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { 
        stops: { 
          include: { 
            city: true,
            activities: { include: { activity: true } }
          },
          orderBy: { sortOrder: 'asc' }
        },
        expenses: true
      }
    });
    
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    if (trip.userId !== req.user.id && !trip.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStop = async (req, res) => {
  try {
    const { cityId, arrivalDate, departureDate, sortOrder } = req.body;
    const tripId = req.params.id;
    
    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        sortOrder
      }
    });
    res.status(201).json(stop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStopActivity = async (req, res) => {
  try {
    const { activityId, scheduledTime, customCost } = req.body;
    const { stopId } = req.params;
    
    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        customCost
      }
    });
    res.status(201).json(stopActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicTrip = async (req, res) => {
  try {
    const { shareSlug } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { shareSlug },
      include: { 
        stops: { 
          include: { 
            city: true,
            activities: { include: { activity: true } }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    if (!trip || !trip.isPublic) return res.status(404).json({ message: 'Trip not found' });
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
