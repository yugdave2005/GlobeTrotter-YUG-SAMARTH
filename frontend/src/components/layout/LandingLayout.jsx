import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Plane } from 'lucide-react';

export const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <Plane className="text-primary-600 w-6 h-6" />
          <h1 className="text-2xl font-bold text-primary-600 tracking-tight">GlobeTrotter</h1>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/auth/login" className="text-gray-600 hover:text-primary-600 transition-colors">Sign In</Link>
          <Link to="/auth/register" className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition">Get Started</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  );
};
