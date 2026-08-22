import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SocketProvider } from './context/SocketContext.jsx';
import { AnimatedCard } from './components/AnimatedCard.jsx';
import AuthRoutes from './pages/Auth/routes.jsx';
import { Map, Plane, Compass } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();

  return (
    <SocketProvider>
      <Toaster position="top-right" />
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
          {/* AnimatePresence enables exit animations when routes change */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              {/* Auth Routes mapped under /auth/* */}
              <Route path="/auth/*" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthRoutes />
                </motion.div>
              } />

              <Route path="/" element={
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
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </SocketProvider>
  )
}

export default App;
