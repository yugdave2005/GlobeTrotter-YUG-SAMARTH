import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Plane, Compass } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      <div className="text-center mt-12 space-y-4">
        <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Plan Your Next <span className="text-primary-600">Adventure</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Real-time collaborative itinerary builder powered by WebSockets and beautiful animations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <AnimatedCard delay={0.1} className="text-center space-y-4">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-600">
            <Map size={32} />
          </div>
          <h3 className="text-xl font-bold">Discover Cities</h3>
          <p className="text-gray-500">Find the most popular and affordable destinations around the world.</p>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="text-center space-y-4">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-600">
            <Compass size={32} />
          </div>
          <h3 className="text-xl font-bold">Build Itineraries</h3>
          <p className="text-gray-500">Drag and drop activities. Everything syncs in real-time across your devices.</p>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="text-center space-y-4">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-600">
            <Plane size={32} />
          </div>
          <h3 className="text-xl font-bold">Track Budgets</h3>
          <p className="text-gray-500">Log expenses and see your real-time budget breakdown for meals, transport, and more.</p>
        </AnimatedCard>
      </div>
    </motion.div>
  );
}
