import prisma from '../utils/prisma.js';
import { getIO } from '../utils/socket.js';

export const createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhotoUrl, budget } = req.body;
    
    const parsedStart = startDate ? new Date(startDate) : new Date();
    const parsedEnd = endDate ? new Date(endDate) : new Date(Date.now() + 7 * 86400000);

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name: name || 'My Next Adventure',
        description: description || null,
        startDate: isNaN(parsedStart.getTime()) ? new Date() : parsedStart,
        endDate: isNaN(parsedEnd.getTime()) ? new Date(Date.now() + 7 * 86400000) : parsedEnd,
        coverPhotoUrl: coverPhotoUrl || null,
        budget: budget ? parseFloat(budget) : 50000
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
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
    
    const parsedArrival = arrivalDate ? new Date(arrivalDate) : new Date();
    const parsedDeparture = departureDate ? new Date(departureDate) : new Date(Date.now() + 3 * 86400000);

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        arrivalDate: isNaN(parsedArrival.getTime()) ? new Date() : parsedArrival,
        departureDate: isNaN(parsedDeparture.getTime()) ? new Date(Date.now() + 3 * 86400000) : parsedDeparture,
        sortOrder: sortOrder || 1
      },
      include: {
        city: true
      }
    });

    try {
      getIO().to(tripId).emit('stop_added', stop);
    } catch (socketErr) {
      console.log('Socket broadcast skipped');
    }
    res.status(201).json(stop);
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addStopActivity = async (req, res) => {
  try {
    const { activityId, scheduledTime, customCost, name, category } = req.body;
    const { id: tripId, stopId } = req.params;
    
    // Find the stop to get cityId
    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId }
    });

    if (!stop) {
      return res.status(404).json({ message: 'Trip stop not found' });
    }

    let finalActivityId = activityId;

    // If no valid activityId was passed or if it's a custom activity
    if (!finalActivityId || finalActivityId === '') {
      const actName = name || 'Custom Activity';
      const actCat = category || 'SIGHTSEEING';
      const actCost = customCost ? parseFloat(customCost) : 1000;

      // Check if an activity with this name already exists in this city
      let matchedActivity = await prisma.activity.findFirst({
        where: {
          cityId: stop.cityId,
          name: actName
        }
      });

      if (!matchedActivity) {
        matchedActivity = await prisma.activity.create({
          data: {
            cityId: stop.cityId,
            name: actName,
            category: actCat,
            cost: actCost,
            durationMinutes: 90,
            description: `Activity for ${actName}`
          }
        });
      }

      finalActivityId = matchedActivity.id;
    }

    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId: finalActivityId,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
        customCost: customCost !== undefined ? parseFloat(customCost) : null
      },
      include: {
        activity: true
      }
    });

    try {
      getIO().to(tripId).emit('activity_added', { stopId, stopActivity });
    } catch (socketErr) {
      console.log('Socket broadcast skipped');
    }

    res.status(201).json(stopActivity);
  } catch (error) {
    console.error('Error adding stop activity:', error);
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
