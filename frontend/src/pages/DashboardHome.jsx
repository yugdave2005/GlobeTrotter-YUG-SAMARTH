import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function DashboardHome() {
  const { user } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-2">Here's an overview of your upcoming trips and travel stats.</p>
      </div>
      
      {/* Placeholder content for Dashboard */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center space-y-4 h-64">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center text-2xl">
          🌍
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">No upcoming trips</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Start planning your next adventure. Build an itinerary, track your budget, and invite friends.</p>
        </div>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
          Plan a Trip
        </button>
      </div>
    </div>
  );
}
