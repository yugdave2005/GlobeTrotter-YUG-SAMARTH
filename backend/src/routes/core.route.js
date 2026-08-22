import express from 'express';
import { getCities, getCityById } from '../controllers/city.controller.js';
import { getActivities } from '../controllers/activity.controller.js';
import { 
  createTrip, updateTrip, deleteTrip, getMyTrips, getTripById, 
  addStop, deleteStop, addStopActivity, deleteStopActivity, getPublicTrip 
} from '../controllers/trip.controller.js';
import { addExpense, getTripBudget } from '../controllers/budget.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Publicly accessible discovery and sharing
router.get('/cities', getCities);
router.get('/cities/:id', getCityById);
router.get('/activities', getActivities);
router.get('/public/trips/:shareSlug', getPublicTrip);

// Protected routes
router.use(authMiddleware);

router.post('/trips', createTrip);
router.get('/trips', getMyTrips);
router.get('/trips/:id', getTripById);
router.put('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);

router.post('/trips/:id/stops', addStop);
router.delete('/trips/:id/stops/:stopId', deleteStop);
router.post('/trips/:id/stops/:stopId/activities', addStopActivity);
router.delete('/trips/:id/stops/:stopId/activities/:activityId', deleteStopActivity);

router.post('/trips/:id/expenses', addExpense);
router.get('/trips/:id/budget', getTripBudget);

export default router;
