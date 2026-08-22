import prisma from '../utils/prisma.js';
import { getIO } from '../utils/socket.js';

export const createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhotoUrl, budget } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhotoUrl,
        budget: budget ? parseFloat(budget) : 50000
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, coverPhotoUrl, budget } = req.body;
    
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Trip not found or unauthorized' });
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        description: description !== undefined ? description : existing.description,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        coverPhotoUrl: coverPhotoUrl !== undefined ? coverPhotoUrl : existing.coverPhotoUrl,
        budget: budget !== undefined ? parseFloat(budget) : existing.budget
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Trip not found or unauthorized' });
    }

    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted successfully' });
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

    getIO().to(tripId).emit('stop_added', stop);
    res.status(201).json(stop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStopActivity = async (req, res) => {
  try {
    const { activityId, scheduledTime, customCost } = req.body;
    const { id: tripId, stopId } = req.params;
    
    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        customCost
      }
    });

    getIO().to(tripId).emit('activity_added', { stopId, stopActivity });
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
