import express from 'express';
import { register, login, googleAuth, forgotPassword, verifyOtp, resetPassword, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.get('/me', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
