import { Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import { Toaster } from 'react-hot-toast';

import { LandingLayout } from './components/layout/LandingLayout.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
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

        {/* Protected Dashboard Routes - Uses Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          {/* We will add other dashboard pages here later */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
