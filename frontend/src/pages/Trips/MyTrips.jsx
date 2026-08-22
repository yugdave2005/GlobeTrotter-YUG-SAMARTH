import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, MapPin, Search, Filter, Trash2, 
  ChevronRight, Sparkles, Clock, Globe, ArrowRight, X, AlertCircle, Wallet
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { SmartItineraryPlannerModal } from '../../components/SmartItineraryPlannerModal';

const DUMMY_TRIPS = [
  {
    id: 'rajasthan-1',
    name: 'Royal Rajasthan Heritage Tour 🇮🇳',
    description: 'A 6-day royal journey across Jaipur, Udaipur, and majestic fortresses.',
    startDate: '2026-04-10',
    endDate: '2026-04-16',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800',
    status: 'Upcoming',
    stops: [{ city: { name: 'Jaipur' } }, { city: { name: 'Udaipur' } }],
    budget: 45000
  },
  {
    id: 'goa-2',
    name: 'Goa Coastal Watersports & Sunsets 🏖️',
    description: 'Scuba diving at Grand Island, sunset catamaran cruise, and beachside shacks.',
    startDate: '2026-05-01',
    endDate: '2026-05-05',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    status: 'Upcoming',
    stops: [{ city: { name: 'Goa' } }],
    budget: 35000
  },
  {
    id: 'euro-3',
    name: 'Classic Euro Tour 2026 🇪🇺',
    description: 'A 2-week scenic journey across Paris, Rome, and Barcelona.',
    startDate: '2026-06-15',
    endDate: '2026-06-29',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    status: 'Upcoming',
    stops: [{ city: { name: 'Paris' } }, { city: { name: 'Rome' } }],
    budget: 185000
  }
];

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmartPlannerOpen, setIsSmartPlannerOpen] = useState(false);

  // New Trip Form State
  const [tripForm, setTripForm] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 50000,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/core/trips');
      if (data && data.length > 0) {
        setTrips(data);
      } else {
        setTrips(DUMMY_TRIPS);
      }
    } catch (err) {
      setTrips(DUMMY_TRIPS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!tripForm.name || !tripForm.startDate || !tripForm.endDate) {
      toast.error('Please fill in required fields');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post('/core/trips', tripForm);
      toast.success('Trip created successfully! 🎉');
      setTrips([data, ...trips]);
      setIsModalOpen(false);
      navigate(`/dashboard/trips/${data.id}`);
    } catch (err) {
      // Local fallback
      const newMockTrip = {
        id: `trip-${Date.now()}`,
        ...tripForm,
        stops: []
      };
      setTrips([newMockTrip, ...trips]);
      setIsModalOpen(false);
      toast.success('Trip created! 🎉');
      navigate(`/dashboard/trips/${newMockTrip.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await api.delete(`/core/trips/${tripId}`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
      toast.success('Trip deleted successfully');
    } catch (err) {
      setTrips(prev => prev.filter(t => t.id !== tripId));
      toast.success('Trip removed');
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Trips</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your personalized multi-destination itineraries.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSmartPlannerOpen(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-sky-600/25 transition active:scale-95 text-xs cursor-pointer"
          >
            <Sparkles size={16} />
            <span>✨ AI Smart Itinerary</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-slate-900/10 transition active:scale-95 text-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search your trips by title or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['All', 'Upcoming', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-2xl">
            🗺️
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900">No itineraries found</h3>
            <p className="text-xs text-slate-500 mt-1">Try a different search query or start building a new adventure.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
          >
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <motion.div
              key={trip.id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Cover Image Banner */}
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img
                  src={trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 z-10">
                  <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {trip.status || 'Active Plan'}
                  </span>
                  <button
                    onClick={(e) => handleDeleteTrip(e, trip.id)}
                    className="p-1.5 bg-white/90 hover:bg-rose-500 hover:text-white backdrop-blur-md text-slate-500 rounded-full shadow-sm transition"
                    title="Delete Trip"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl leading-snug drop-shadow-sm truncate">{trip.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-200 mt-1">
                    <Calendar size={13} />
                    <span>{new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {trip.description || 'Custom multi-city travel itinerary with scheduled activities and budget estimations.'}
                </p>

                {/* Cities preview pills & Budget */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
                    <MapPin size={14} className="text-sky-500 shrink-0 mr-1" />
                    {trip.stops && trip.stops.length > 0 ? (
                      trip.stops.map((stop, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-medium shrink-0">
                          {stop.city?.name || 'City'}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">No destinations added yet</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <Wallet size={13} className="text-emerald-500" />
                      <span>Budget:</span>
                    </span>
                    <span className="font-bold text-slate-800 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg">
                      ₹{Number(trip.budget || trip.estimatedBudget || 45000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {trip.stops?.length || 0} destination stops
                  </span>
                  <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Open Builder <ChevronRight size={14} className="ml-0.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Plan New Trip</h3>
                <p className="text-xs text-slate-500 mt-1">Set up a customized multi-city itinerary</p>
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
                    placeholder="e.g. Royal Rajasthan Tour 2026"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description & Notes
                  </label>
                  <textarea
                    rows="2"
                    value={tripForm.description}
                    onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
                    placeholder="Travel vibe, friends joining, places on your radar..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
                    />
                  </div>
                </div>

                {/* Trip-Specific Budget */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Trip Budget (₹)
                    </label>
                    <span className="text-xs font-bold text-sky-600">
                      ₹{Number(tripForm.budget || 50000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={tripForm.budget}
                    onChange={(e) => setTripForm({ ...tripForm, budget: Number(e.target.value) })}
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    {[25000, 50000, 100000, 200000].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setTripForm({ ...tripForm, budget: b })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                          tripForm.budget === b ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ₹{(b / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? <span>Creating...</span> : <span>Create & Start Planning</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Smart Route Planner Assistant Modal */}
      <SmartItineraryPlannerModal
        isOpen={isSmartPlannerOpen}
        onClose={() => setIsSmartPlannerOpen(false)}
        onItineraryCreated={(newTrip) => setTrips(prev => [newTrip, ...prev])}
      />

    </div>
  );
}
