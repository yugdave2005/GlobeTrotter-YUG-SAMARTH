import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, MapPin, Compass, Wallet, ArrowRight, 
  Sparkles, TrendingUp, DollarSign, Clock, Users, X, 
  ChevronRight, CheckCircle, Search, Star, Plane
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Curated top destinations fallback if database has few
const POPULAR_DESTINATIONS = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: '₹₹₹',
    popularityScore: 98,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    tags: ['Romance', 'Museums', 'Cuisine']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: '₹₹₹₹',
    popularityScore: 99,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    tags: ['Tech', 'Culture', 'Nightlife']
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: '₹',
    popularityScore: 96,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    tags: ['Beaches', 'Wellness', 'Adventure']
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: '₹₹',
    popularityScore: 95,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
    tags: ['History', 'Architecture', 'Food']
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    region: 'Americas',
    costIndex: '₹₹₹₹',
    popularityScore: 97,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    tags: ['Skyline', 'Shows', 'Shopping']
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: '₹₹',
    popularityScore: 94,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=800',
    tags: ['Art', 'Beach', 'Tapas']
  }
];

export default function DashboardHome() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Trip Form State
  const [tripForm, setTripForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
  });
  const [creatingTrip, setCreatingTrip] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchCities();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/core/trips');
      setTrips(data);
    } catch (err) {
      console.log('Using local mock trips if API is empty');
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/core/cities');
      if (data && data.length > 0) {
        setCities(data);
      } else {
        setCities(POPULAR_DESTINATIONS);
      }
    } catch (err) {
      setCities(POPULAR_DESTINATIONS);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!tripForm.name || !tripForm.startDate || !tripForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCreatingTrip(true);
    try {
      const { data } = await api.post('/core/trips', tripForm);
      toast.success('Trip created successfully! 🎉');
      setTrips([data, ...trips]);
      setIsCreateModalOpen(false);
      setTripForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setCreatingTrip(false);
    }
  };

  const filteredCities = selectedRegion === 'All' 
    ? cities 
    : cities.filter(c => c.region === selectedRegion);

  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. Hero / Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 text-white p-8 md:p-12 shadow-xl shadow-primary-600/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary-100">
              <Sparkles size={14} />
              <span>Personalized Travel Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Where to next, {user?.name?.split(' ')[0] || 'Explorer'}? ✈️
            </h1>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Design multi-city itineraries, collaborate in real-time, and keep travel budgets crystal clear.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-sky-800 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 active:scale-95 cursor-pointer z-10"
            >
              <Plus size={18} className="text-sky-700 stroke-[2.5]" />
              <span className="text-sky-800 font-bold">Plan New Trip</span>
            </button>
            <a
              href="#destinations"
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-5 py-3.5 rounded-2xl font-semibold text-sm backdrop-blur-sm transition active:scale-95"
            >
              Explore Cities
            </a>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 2. Key Metrics / Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Plane size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Trips</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{trips.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cities Planned</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0) || 4}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Budget Health</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">On Track</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saved Spots</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{user?.savedDestinations?.length || 8}</p>
          </div>
        </div>
      </div>

      {/* 3. Upcoming & Recent Trips Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Travel Itineraries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Active, upcoming, and drafted vacation plans</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>+ New Trip</span>
          </button>
        </div>

        {loadingTrips ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="h-44 relative overflow-hidden bg-slate-200">
                  <img 
                    src={trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'} 
                    alt={trip.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    Upcoming
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg leading-snug drop-shadow-sm truncate">{trip.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-200 mt-1">
                      <Calendar size={13} />
                      <span>{new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center space-x-1 font-medium">
                      <MapPin size={14} className="text-primary-500" />
                      <span>{trip.stops?.length || 0} destinations</span>
                    </span>
                    <span className="flex items-center space-x-1 font-medium">
                      <Wallet size={14} className="text-emerald-500" />
                      <span>Budget: ₹1,85,000</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Collaboration active</span>
                    <span className="font-bold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                      View Itinerary <ChevronRight size={14} className="ml-0.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              ✈️
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">No trips planned yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Start by creating your first trip. Build an interactive day-by-day itinerary, pick hotels, and organize expenses with ease.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md shadow-sky-600/20 transition inline-flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus size={18} />
              <span>Create Your First Trip</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Recommended / Popular Destinations */}
      <div id="destinations" className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recommended Destinations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore popular cities, cost indices, and trending attractions</p>
          </div>

          {/* Region Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {['All', 'Europe', 'Asia', 'Americas'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <motion.div
              key={city.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img 
                  src={city.image || city.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800'} 
                  alt={city.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 text-slate-800 text-[11px] font-bold shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span>{city.popularityScore || 95}/100</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl">{city.name}</h3>
                  <p className="text-xs text-slate-200">{city.country} • {city.region}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Cost Level:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {city.costIndex || '₹₹₹'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(city.tags || ['Sightseeing', 'Food', 'Culture']).map((tag) => (
                    <span key={tag} className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setTripForm(prev => ({ ...prev, name: `Trip to ${city.name}` }));
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Plan Trip to {city.name}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Budget Highlights & Cost Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="text-sky-600" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Budget & Cost Breakdown Overview</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Automatic financial view and expense tracker across all your travels</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Estimated Budget</span>
            <p className="text-2xl font-bold text-slate-900">₹2,45,000</p>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Spent: ₹1,20,000 (49%)</span>
            <span className="text-slate-400">Remaining: ₹1,25,000</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: '35%' }} className="bg-blue-500" title="Stays (35%)" />
            <div style={{ width: '30%' }} className="bg-primary-500" title="Flights & Transport (30%)" />
            <div style={{ width: '20%' }} className="bg-amber-500" title="Food & Dining (20%)" />
            <div style={{ width: '15%' }} className="bg-emerald-500" title="Activities & Sightseeing (15%)" />
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">Stays (35%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-slate-600">Transport (30%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600">Food (20%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Activities (15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Plan New Trip Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Create New Trip</h3>
                <p className="text-xs text-slate-500 mt-1">Initiate a personalized itinerary with dates and descriptions</p>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Trip Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={tripForm.name}
                    onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
                    placeholder="e.g. Euro Summer Tour 2026"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    value={tripForm.description}
                    onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
                    placeholder="Brief notes about your trip goals, companions, or vibe..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={tripForm.startDate}
                      onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={tripForm.endDate}
                      onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={creatingTrip}
                    className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {creatingTrip ? <span>Creating...</span> : <span>Create & Start Planning</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
