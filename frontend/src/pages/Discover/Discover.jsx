import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Compass, Star, DollarSign, Plus, 
  Filter, Tag, Clock, ArrowRight, X, Sparkles, Check
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Discover() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCity, setSelectedCity] = useState(null);
  const [myTrips, setMyTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');

  useEffect(() => {
    fetchCities();
    fetchMyTrips();
  }, []);

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/core/cities');
      setCities(data);
    } catch (err) {
      console.log('Error fetching cities');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTrips = async () => {
    try {
      const { data } = await api.get('/core/trips');
      setMyTrips(data);
      if (data && data.length > 0) {
        setSelectedTripId(data[0].id);
      }
    } catch (err) {
      console.log('Error fetching trips');
    }
  };

  const handleAddCityToTrip = async (city) => {
    if (!myTrips || myTrips.length === 0) {
      toast.error('Please create a trip first in My Trips!');
      return;
    }
    toast.success(`Added ${city.name} to your upcoming trip! ✈️`);
  };

  const filteredCities = cities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Destinations</h1>
          <p className="text-sm text-slate-500 mt-1">Explore popular travel cities, attractions, and activity cost indices</p>
        </div>
      </div>

      {/* Search & Region Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by city (e.g. Paris, Tokyo, Bali) or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['All', 'Europe', 'Asia', 'Americas'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedRegion === reg
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Cities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <motion.div
              key={city.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="h-52 relative overflow-hidden bg-slate-200">
                <img
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800'}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 text-slate-800 text-[11px] font-bold shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span>{city.popularityScore || 95}/100</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-2xl drop-shadow-sm">{city.name}</h3>
                  <p className="text-xs text-slate-200 mt-0.5">{city.country} • {city.region}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Cost Index:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {city.costIndex > 3 ? '₹₹₹₹ (High)' : city.costIndex > 2 ? '₹₹₹ (Moderate)' : '₹ (Budget)'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCity(city)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl text-xs transition text-center"
                  >
                    View Activities
                  </button>

                  <button
                    onClick={() => handleAddCityToTrip(city)}
                    className="py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1 shrink-0"
                    title="Add to upcoming trip"
                  >
                    <Plus size={14} />
                    <span>Add to Trip</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* City Activities Detail Modal */}
      <AnimatePresence>
        {selectedCity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCity(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                  <MapPin size={14} />
                  <span>{selectedCity.region}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Things to do in {selectedCity.name}, {selectedCity.country}
                </h3>
              </div>

              <div className="overflow-y-auto space-y-4 flex-1 pr-1">
                {/* Sample Activities */}
                {[
                  {
                    name: `${selectedCity.name} Highlights & Walking Tour`,
                    category: 'SIGHTSEEING',
                    cost: 2800,
                    duration: '2.5 hours',
                    desc: 'Experience historic landmarks, local architecture, and iconic viewpoints.'
                  },
                  {
                    name: 'Authentic Street Food & Wine Tasting',
                    category: 'FOOD',
                    cost: 4500,
                    duration: '3 hours',
                    desc: 'Guided gastronomic stroll through top local bistros and traditional markets.'
                  },
                  {
                    name: 'Scenic Sunset Coast & Panorama Excursion',
                    category: 'ADVENTURE',
                    cost: 3600,
                    duration: '2 hours',
                    desc: 'Outdoor adventure overlooking the landscape with photo opportunities.'
                  }
                ].map((act, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {act.category}
                      </span>
                      <span className="font-extrabold text-emerald-600 text-sm">₹{act.cost.toLocaleString('en-IN')}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{act.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{act.duration}</span>
                      </span>
                      <button
                        onClick={() => {
                          toast.success(`Activity "${act.name}" added to trip!`);
                          setSelectedCity(null);
                        }}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700"
                      >
                        + Add to Itinerary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
