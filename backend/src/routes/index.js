import express from 'express';
import authRoutes from './auth.route.js';
import coreRoutes from './core.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/core', coreRoutes); // we can also just mount these straight on /api in app.js

export default router;
