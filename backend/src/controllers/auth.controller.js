import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';
import { sendOTP } from '../utils/email.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    user = await prisma.user.create({
      data: { email, passwordHash, name }
    });
    
    const token = generateToken(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = generateToken(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleId, photoUrl: picture }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId, photoUrl: user.photoUrl || picture }
      });
    }
    
    const jwtToken = generateToken(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token: jwtToken });
  } catch (error) {
    res.status(401).json({ message: 'Google Auth Failed', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetOtp: otp, resetOtpExpires: expires }
    });
    
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.resetOtp !== otp || new Date() > user.resetOtpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetOtp: null, resetOtpExpires: null }
    });
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      include: { savedDestinations: true }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      id: user.id, email: user.email, name: user.name, 
      photoUrl: user.photoUrl, languagePreference: user.languagePreference,
      savedDestinations: user.savedDestinations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
