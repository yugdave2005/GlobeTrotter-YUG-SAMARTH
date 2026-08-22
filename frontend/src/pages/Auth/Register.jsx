import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { Mail, Lock, User, Map, Compass, Wallet, Users, ChevronRight, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const INTERESTS = ['History & Culture', 'Food', 'Beaches', 'Adventure', 'Photography', 'Nature', 'Nightlife', 'Shopping', 'Relaxation'];
const STYLES = ['Relaxed', 'Explorer', 'Budget', 'Luxury', 'Adventure'];
const PACES = ['Slow & Relaxed', 'Balanced', 'Explore More'];
const BUDGETS = ['Budget', 'Moderate', 'Premium', 'Luxury'];
const COMPANIONS = ['Solo', 'Couple', 'Friends', 'Family', 'Business'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences
  const [interests, setInterests] = useState([]);
  const [travelStyle, setTravelStyle] = useState('Explorer');
  const [travelPace, setTravelPace] = useState('Balanced');
  const [budget, setBudget] = useState('Moderate');
  const [companions, setCompanions] = useState('Couple');

  const handleNext = () => {
    if (step === 1 && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const payload = {
        name, email, password,
        preferences: {
          interests,
          travelStyle,
          travelPace,
          budget,
          companions,
          priorities: [] // Can be expanded later
        }
      };
      
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful! Welcome to GlobeTrotter.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setStep(1); // Go back to first step on error
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 max-w-5xl mx-auto">
      
      {/* Visual Progress Section (Desktop) */}
      <div className="hidden lg:flex lg:w-1/3 bg-gray-50 border-r border-gray-100 flex-col p-8 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Journey Begins Here</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`flex items-center space-x-4 ${step >= num ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= num ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'}`}>
                  {step > num ? <Check size={16} /> : num}
                </div>
                <span className="font-medium">
                  {num === 1 ? 'Account Details' : num === 2 ? 'Your Interests' : 'Travel Style'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">We use this info to tailor your AI travel recommendations.</p>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-2/3 p-8 sm:p-12 relative overflow-hidden flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-md mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                <p className="mt-2 text-sm text-gray-500">Already have an account? <Link to="/auth/login" className="text-primary-600 font-medium hover:underline">Sign in</Link></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="hello@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={handleNext} disabled={!name || !email || !password || !confirmPassword} className="w-full flex items-center justify-center bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                Continue to Preferences <ChevronRight size={18} className="ml-2" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-lg mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">What do you love?</h2>
                <p className="mt-2 text-sm text-gray-500">Select your travel interests so we can personalize your experience.</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${interests.includes(interest) ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={handlePrev} className="flex items-center text-gray-500 hover:text-gray-700">
                  <ChevronLeft size={18} className="mr-1" /> Back
                </button>
                <button onClick={handleNext} className="flex items-center bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                  Next <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-lg mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Travel Style</h2>
                <p className="mt-2 text-sm text-gray-500">Tell us how you like to travel.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Compass size={16} className="mr-1" /> Style</label>
                  <select value={travelStyle} onChange={e => setTravelStyle(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Map size={16} className="mr-1" /> Pace</label>
                  <select value={travelPace} onChange={e => setTravelPace(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                    {PACES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Wallet size={16} className="mr-1" /> Budget</label>
                  <select value={budget} onChange={e => setBudget(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                    {BUDGETS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Users size={16} className="mr-1" /> Companions</label>
                  <select value={companions} onChange={e => setCompanions(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                    {COMPANIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-12 pt-4 border-t border-gray-100">
                <button onClick={handlePrev} disabled={loading} className="flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50">
                  <ChevronLeft size={18} className="mr-1" /> Back
                </button>
                <button onClick={handleRegister} disabled={loading} className="flex items-center bg-primary-600 text-white px-8 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
                  {loading ? 'Creating...' : 'Complete Sign Up'} <Check size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
