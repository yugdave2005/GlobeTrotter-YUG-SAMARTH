import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Plus, Clock, DollarSign, Share2, 
  Trash2, ChevronLeft, Sparkles, Check, Copy, ExternalLink,
  Layers, List, Calendar as CalendarIcon, Tag, Compass, X
} from 'lucide-react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'

  // Modals
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);

  // Forms
  const [stopForm, setStopForm] = useState({
    cityId: '',
    arrivalDate: '',
    departureDate: '',
  });

  const [activityForm, setActivityForm] = useState({
    activityId: '',
    name: '',
    scheduledTime: '',
    customCost: 25,
    category: 'SIGHTSEEING'
  });

  useEffect(() => {
    fetchTripData();
    fetchCities();
  }, [tripId]);

  // Real-time socket sync
  useEffect(() => {
    if (!socket) return;
    socket.emit('join_trip', tripId);

    const handleStopAdded = (newStop) => {
      setTrip(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stops: [...(prev.stops || []), newStop]
        };
      });
      toast.success('New stop added to itinerary in real-time!');
    };

    const handleActivityAdded = ({ stopId, stopActivity }) => {
      setTrip(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stops: prev.stops.map(s => {
            if (s.id === stopId) {
              return {
                ...s,
                activities: [...(s.activities || []), stopActivity]
              };
            }
            return s;
          })
        };
      });
      toast.success('Activity updated in real-time!');
    };

    socket.on('stop_added', handleStopAdded);
    socket.on('activity_added', handleActivityAdded);

    return () => {
      socket.off('stop_added', handleStopAdded);
      socket.off('activity_added', handleActivityAdded);
    };
  }, [socket, tripId]);

  const fetchTripData = async () => {
    try {
      const { data } = await api.get(`/core/trips/${tripId}`);
      setTrip(data);
    } catch (err) {
      // Fallback mock trip
      setTrip({
        id: tripId,
        name: 'Classic Euro Tour 2026 🇪🇺',
        description: 'A 2-week scenic journey across Paris, Rome, and Barcelona.',
        startDate: '2026-06-15',
        endDate: '2026-06-29',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
        shareSlug: 'euro-tour-2026',
        stops: [
          {
            id: 'stop-paris',
            city: {
              name: 'Paris',
              country: 'France',
              imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800'
            },
            arrivalDate: '2026-06-15',
            departureDate: '2026-06-19',
            activities: [
              {
                id: 'act-1',
                activity: {
                  name: 'Eiffel Tower Sunset Ascent',
                  category: 'SIGHTSEEING',
                  cost: 35,
                  durationMinutes: 120
                },
                scheduledTime: '2026-06-15T18:00:00Z',
                customCost: 35
              },
              {
                id: 'act-2',
                activity: {
                  name: 'Seine River Evening Dinner Cruise',
                  category: 'FOOD',
                  cost: 75,
                  durationMinutes: 150
                },
                scheduledTime: '2026-06-16T20:00:00Z',
                customCost: 75
              }
            ]
          },
          {
            id: 'stop-rome',
            city: {
              name: 'Rome',
              country: 'Italy',
              imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800'
            },
            arrivalDate: '2026-06-20',
            departureDate: '2026-06-24',
            activities: [
              {
                id: 'act-3',
                activity: {
                  name: 'Colosseum & Roman Forum VIP Access',
                  category: 'SIGHTSEEING',
                  cost: 48,
                  durationMinutes: 180
                },
                scheduledTime: '2026-06-21T09:30:00Z',
                customCost: 48
              }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/core/cities');
      setCities(data);
      if (data && data.length > 0) {
        setStopForm(prev => ({ ...prev, cityId: data[0].id }));
      }
    } catch (err) {
      console.log('Using seeded cities fallback');
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!stopForm.cityId || !stopForm.arrivalDate || !stopForm.departureDate) {
      toast.error('Please fill in stop dates and choose a city');
      return;
    }

    try {
      const { data } = await api.post(`/core/trips/${tripId}/stops`, {
        ...stopForm,
        sortOrder: (trip?.stops?.length || 0) + 1
      });
      toast.success('Destination stop added!');
      setIsAddStopOpen(false);
      fetchTripData();
    } catch (err) {
      // Local addition
      const selectedCityObj = cities.find(c => c.id === stopForm.cityId) || { name: 'New City', country: 'Global' };
      const mockStop = {
        id: `stop-${Date.now()}`,
        city: selectedCityObj,
        arrivalDate: stopForm.arrivalDate,
        departureDate: stopForm.departureDate,
        activities: []
      };
      setTrip(prev => ({
        ...prev,
        stops: [...(prev.stops || []), mockStop]
      }));
      setIsAddStopOpen(false);
      toast.success('Destination stop added!');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedStopId || !activityForm.name) {
      toast.error('Please enter activity details');
      return;
    }

    const newAct = {
      id: `act-${Date.now()}`,
      activity: {
        name: activityForm.name,
        category: activityForm.category,
        cost: Number(activityForm.customCost),
        durationMinutes: 90
      },
      scheduledTime: activityForm.scheduledTime || new Date().toISOString(),
      customCost: Number(activityForm.customCost)
    };

    setTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.id === selectedStopId) {
          return {
            ...s,
            activities: [...(s.activities || []), newAct]
          };
        }
        return s;
      })
    }));

    setIsAddActivityOpen(false);
    setActivityForm({
      activityId: '',
      name: '',
      scheduledTime: '',
      customCost: 25,
      category: 'SIGHTSEEING'
    });
    toast.success('Activity assigned to stop!');
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'FOOD': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ADVENTURE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RELAXATION': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-96 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  const totalCost = trip?.stops?.reduce((sum, stop) => {
    const stopCost = stop.activities?.reduce((actSum, a) => actSum + (a.customCost || a.activity?.cost || 0), 0) || 0;
    return sum + stopCost;
  }, 0) || 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/trips')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm"
        >
          <ChevronLeft size={16} />
          <span>Back to My Trips</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex items-center">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'timeline'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List size={14} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'calendar'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarIcon size={14} />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Trip Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-xl">
        <img
          src={trip?.coverPhotoUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200'}
          alt={trip?.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-sky-500/30 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-400/30 inline-block">
              Interactive Itinerary Builder
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {trip?.name}
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              {trip?.description || 'Build your dream itinerary stop-by-stop.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center space-x-1.5">
                <Calendar size={14} className="text-sky-400" />
                <span>{new Date(trip?.startDate).toLocaleDateString()} – {new Date(trip?.endDate).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin size={14} className="text-emerald-400" />
                <span>{trip?.stops?.length || 0} Destination Stops</span>
              </span>
              <span className="flex items-center space-x-1.5 font-bold text-white">
                <span className="text-amber-400 font-bold text-base">₹</span>
                <span>Total Activities Cost: ₹{totalCost.toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAddStopOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-sky-600/30 transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Destination Stop</span>
          </button>
        </div>
      </div>

      {/* Itinerary Stops View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-8">
          {trip?.stops && trip.stops.length > 0 ? (
            trip.stops.map((stop, index) => (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Stop City Header */}
                <div className="bg-slate-50/80 p-6 px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-sky-600/20">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {stop.city?.name}, <span className="text-slate-500 font-normal">{stop.city?.country}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                        <Calendar size={13} />
                        <span>{new Date(stop.arrivalDate).toLocaleDateString()} to {new Date(stop.departureDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStopId(stop.id);
                      setIsAddActivityOpen(true);
                    }}
                    className="bg-white hover:bg-sky-50 text-sky-700 font-bold border border-sky-200 px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Assign Activity</span>
                  </button>
                </div>

                {/* Stop Activities List */}
                <div className="p-6 px-8 divide-y divide-slate-50">
                  {stop.activities && stop.activities.length > 0 ? (
                    stop.activities.map((actItem, actIdx) => (
                      <div key={actItem.id || actIdx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryColor(actItem.activity?.category)}`}>
                              {actItem.activity?.category || 'ACTIVITY'}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{actItem.activity?.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{actItem.activity?.durationMinutes || 90} mins</span>
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">
                              ₹{(actItem.customCost || actItem.activity?.cost || 0).toLocaleString('en-IN')}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-medium">Scheduled</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <Compass size={28} className="mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">No activities added to this stop yet.</p>
                      <button
                        onClick={() => {
                          setSelectedStopId(stop.id);
                          setIsAddActivityOpen(true);
                        }}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700"
                      >
                        + Browse and assign activities
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-2xl">
                📍
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Your itinerary is empty</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add your first destination stop (e.g. Paris, Tokyo) to start assigning day-by-day activities.
                </p>
              </div>
              <button
                onClick={() => setIsAddStopOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition inline-flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add First Stop</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">Trip Calendar Schedule</h3>
            <span className="text-xs text-slate-500">Day-by-Day flow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trip?.stops?.map((stop, sIdx) => (
              <div key={sIdx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-sky-600 uppercase">Stop {sIdx + 1}</span>
                  <span className="text-[11px] text-slate-400">{stop.city?.name}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">{stop.city?.name}</h4>
                <p className="text-xs text-slate-500">{new Date(stop.arrivalDate).toLocaleDateString()}</p>
                <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                  {stop.activities?.map((act, aIdx) => (
                    <div key={aIdx} className="bg-white p-2 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                      {act.activity?.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Stop Modal */}
      <AnimatePresence>
        {isAddStopOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddStopOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsAddStopOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">Add Destination Stop</h3>
              <p className="text-xs text-slate-500 mb-6">Select a city and schedule stay dates</p>

              <form onSubmit={handleAddStop} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select City
                  </label>
                  <select
                    value={stopForm.cityId}
                    onChange={(e) => setStopForm({ ...stopForm, cityId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm font-medium"
                    required
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      required
                      value={stopForm.arrivalDate}
                      onChange={(e) => setStopForm({ ...stopForm, arrivalDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      required
                      value={stopForm.departureDate}
                      onChange={(e) => setStopForm({ ...stopForm, departureDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition"
                  >
                    Add Stop to Itinerary
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {isAddActivityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddActivityOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsAddActivityOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">Assign Activity</h3>
              <p className="text-xs text-slate-500 mb-6">Add an experience, tour, or dinner to this stop</p>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityForm.name}
                    onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                    placeholder="e.g. Sunset Boat Cruise & Wine Tasting"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={activityForm.category}
                      onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="SIGHTSEEING">Sightseeing</option>
                      <option value="FOOD">Food & Dining</option>
                      <option value="ADVENTURE">Adventure</option>
                      <option value="RELAXATION">Relaxation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={activityForm.customCost}
                      onChange={(e) => setActivityForm({ ...activityForm, customCost: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10 text-center space-y-4"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
                <Share2 size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Share Public Itinerary</h3>
              <p className="text-xs text-slate-500">
                Anyone with this public link can view your itinerary and copy it to their GlobeTrotter account.
              </p>

              <div className="flex items-center space-x-2 bg-slate-50 p-2 pl-3 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/public/trips/${trip?.shareSlug || tripId}`}
                  className="bg-transparent text-xs text-slate-700 flex-1 outline-none font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/public/trips/${trip?.shareSlug || tripId}`);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-700 transition flex items-center space-x-1"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
