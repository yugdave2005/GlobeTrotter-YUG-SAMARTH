import { Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import { Toaster } from 'react-hot-toast';

import { LandingLayout } from './components/layout/LandingLayout.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import MyTrips from './pages/Trips/MyTrips.jsx';
import ItineraryBuilder from './pages/Trips/ItineraryBuilder.jsx';
import Discover from './pages/Discover/Discover.jsx';
import BudgetTracker from './pages/Budget/BudgetTracker.jsx';
import Community from './pages/Community/Community.jsx';
import PublicItinerary from './pages/PublicItinerary.jsx';
import AuthRoutes from './pages/Auth/routes.jsx';

function App() {
  return (
    <SocketProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes - Uses Landing Layout */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Route>

        {/* Public Itinerary Share Route */}
        <Route path="/public/trips/:shareSlug" element={<PublicItinerary />} />

        {/* Protected Dashboard Routes - Uses Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="trips" element={<MyTrips />} />
          <Route path="trips/:tripId" element={<ItineraryBuilder />} />
          <Route path="discover" element={<Discover />} />
          <Route path="budget" element={<BudgetTracker />} />
          <Route path="community" element={<Community />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
