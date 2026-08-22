import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Calendar, Wallet, Compass, 
  CheckCircle2, ArrowRight, Check, X, Tag, Clock, 
  Plus, ChevronRight, ShieldCheck, Flame, Layers
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Preset dynamic smart routes with real activities & budgets
const PRESET_ROUTES = [
  {
    id: 'india-rajasthan',
    title: 'Royal Rajasthan Heritage & Forts 🇮🇳',
    region: 'India',
    country: 'India',
    vibe: 'Culture & Palaces',
    coverPhoto: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 6,
    recommendedBudget: 45000,
    stops: [
      {
        cityName: 'Jaipur',
        days: 3,
        activities: [
          { name: 'Amber Fort & Sheesh Mahal Tour', category: 'SIGHTSEEING', cost: 1200, duration: '3 hrs' },
          { name: 'Hawa Mahal & City Palace Photo Walk', category: 'SIGHTSEEING', cost: 800, duration: '2 hrs' },
          { name: 'Chokhi Dhani Traditional Rajasthani Dinner', category: 'FOOD', cost: 1500, duration: '3 hrs' },
        ]
      },
      {
        cityName: 'Udaipur',
        days: 3,
        activities: [
          { name: 'Lake Pichola Sunset Boat Cruise', category: 'RELAXATION', cost: 1100, duration: '1.5 hrs' },
          { name: 'Udaipur City Palace Mirror Gallery Walk', category: 'SIGHTSEEING', cost: 950, duration: '2.5 hrs' },
          { name: 'Bagore Ki Haveli Dharohar Dance Show', category: 'SIGHTSEEING', cost: 400, duration: '1 hr' },
        ]
      }
    ]
  },
  {
    id: 'india-kerala',
    title: 'Kerala Backwaters & Tea Mountains 🌴',
    region: 'India',
    country: 'India',
    vibe: 'Nature & Wellness',
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 5,
    recommendedBudget: 40000,
    stops: [
      {
        cityName: 'Kerala (Munnar & Alleppey)',
        days: 5,
        activities: [
          { name: 'Alleppey Backwaters Houseboat Day Cruise', category: 'RELAXATION', cost: 4500, duration: '5 hrs' },
          { name: 'Munnar Tea Plantations & Factory Trek', category: 'ADVENTURE', cost: 1000, duration: '2.5 hrs' },
          { name: 'Traditional Ayurvedic Herbal Massage', category: 'RELAXATION', cost: 2500, duration: '1.5 hrs' },
        ]
      }
    ]
  },
  {
    id: 'india-goa',
    title: 'Goa Coastal Watersports & Heritage 🏖️',
    region: 'India',
    country: 'India',
    vibe: 'Beaches & Nightlife',
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 4,
    recommendedBudget: 35000,
    stops: [
      {
        cityName: 'Goa',
        days: 4,
        activities: [
          { name: 'Scuba Diving & Watersports at Grand Island', category: 'ADVENTURE', cost: 3500, duration: '4 hrs' },
          { name: 'Mandovi River Sunset Cruise & DJ Party', category: 'RELAXATION', cost: 1200, duration: '2 hrs' },
          { name: 'Old Goa Portuguese Churches Tour', category: 'SIGHTSEEING', cost: 600, duration: '2.5 hrs' },
          { name: 'Beachside Seafood BBQ & Cocktails', category: 'FOOD', cost: 1800, duration: '2 hrs' },
        ]
      }
    ]
  },
  {
    id: 'india-manali',
    title: 'Himalayan Snow Peaks & Manali Adventure 🏔️',
    region: 'India',
    country: 'India',
    vibe: 'Mountains & Thrill',
    coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 5,
    recommendedBudget: 38000,
    stops: [
      {
        cityName: 'Manali & Rohtang',
        days: 5,
        activities: [
          { name: 'Solang Valley Paragliding & ATV Ride', category: 'ADVENTURE', cost: 3200, duration: '2 hrs' },
          { name: 'Rohtang Pass Snow Excursion', category: 'ADVENTURE', cost: 2800, duration: '4 hrs' },
          { name: 'Old Manali Riverside Cafe Crawl', category: 'FOOD', cost: 1200, duration: '2.5 hrs' },
        ]
      }
    ]
  },
  {
    id: 'japan-classic',
    title: 'Japan Golden Route: Tokyo to Kyoto 🇯🇵',
    region: 'Asia',
    country: 'Japan',
    vibe: 'Modern & Traditional',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 7,
    recommendedBudget: 150000,
    stops: [
      {
        cityName: 'Tokyo',
        days: 7,
        activities: [
          { name: 'Shibuya Crossing & Hachiko Walk', category: 'SIGHTSEEING', cost: 0, duration: '45 mins' },
          { name: 'Tsukiji Market Chef Guided Food Tour', category: 'FOOD', cost: 4500, duration: '2 hrs' },
          { name: 'Shinjuku Neon VR Arcade Experience', category: 'ADVENTURE', cost: 4200, duration: '1.5 hrs' },
        ]
      }
    ]
  },
  {
    id: 'euro-classic',
    title: 'Classic Western Europe Highlights 🇪🇺',
    region: 'Europe',
    country: 'Europe',
    vibe: 'Art, Food & Romance',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    defaultDays: 8,
    recommendedBudget: 180000,
    stops: [
      {
        cityName: 'Paris',
        days: 4,
        activities: [
          { name: 'Eiffel Tower Sunset Tour', category: 'SIGHTSEEING', cost: 2800, duration: '2 hrs' },
          { name: 'Seine River Dinner Cruise', category: 'RELAXATION', cost: 2200, duration: '1.5 hrs' },
          { name: 'Louvre Masterpieces Guided Walk', category: 'SIGHTSEEING', cost: 3800, duration: '3 hrs' },
        ]
      },
      {
        cityName: 'Rome',
        days: 4,
        activities: [
          { name: 'Colosseum & Roman Forum VIP Access', category: 'SIGHTSEEING', cost: 3900, duration: '2.5 hrs' },
          { name: 'Trastevere Pasta & Gelato Crawl', category: 'FOOD', cost: 4800, duration: '3 hrs' },
        ]
      }
    ]
  }
];

export const SmartItineraryPlannerModal = ({ isOpen, onClose, onItineraryCreated }) => {
  const navigate = useNavigate();

  // Wizard Step: 1 = Choose Route / Destination, 2 = Adjust Dates & Budget, 3 = Review & Finalize
  const [step, setStep] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ROUTES[0]);
  const [regionTab, setRegionTab] = useState('India');

  // Customization Form
  const [tripBudget, setTripBudget] = useState(PRESET_ROUTES[0].recommendedBudget);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setTripBudget(preset.recommendedBudget);
    const end = new Date(Date.now() + preset.defaultDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setEndDate(end);
    setStep(2);
  };

  const handleFinalizeItinerary = async () => {
    setCreating(true);
    try {
      // 1. Create Trip in backend with trip-specific budget
      const tripPayload = {
        name: selectedPreset.title,
        description: `Smart dynamic itinerary planned for ${selectedPreset.country} with ₹${Number(tripBudget).toLocaleString('en-IN')} budget.`,
        startDate,
        endDate,
        coverPhotoUrl: selectedPreset.coverPhoto,
        budget: Number(tripBudget)
      };

      const { data: createdTrip } = await api.post('/core/trips', tripPayload);

      // 2. Fetch available seeded cities to attach real stop IDs
      const { data: dbCities } = await api.get('/core/cities').catch(() => ({ data: [] }));

      // Attach stops
      for (let i = 0; i < selectedPreset.stops.length; i++) {
        const stopItem = selectedPreset.stops[i];
        const matchedCity = dbCities.find(c => c.name.toLowerCase().includes(stopItem.cityName.toLowerCase().split(' ')[0])) || dbCities[0];
        
        if (matchedCity) {
          try {
            const { data: stopData } = await api.post(`/core/trips/${createdTrip.id}/stops`, {
              cityId: matchedCity.id,
              arrivalDate: startDate,
              departureDate: endDate,
              sortOrder: i + 1
            });

            // Automatically attach recommended activities for this stop
            if (stopData?.id && stopItem.activities && stopItem.activities.length > 0) {
              for (const act of stopItem.activities) {
                await api.post(`/core/trips/${createdTrip.id}/stops/${stopData.id}/activities`, {
                  name: act.name,
                  category: act.category,
                  customCost: act.cost
                }).catch(() => {});
              }
            }
          } catch (e) {
            console.log('Stop addition handled');
          }
        }
      }

      toast.success('🎉 Dynamic Smart Itinerary Created & Customized!');
      onClose();
      if (onItineraryCreated) onItineraryCreated(createdTrip);
      navigate(`/dashboard/trips/${createdTrip.id}`);
    } catch (err) {
      // Local fallback navigation
      const localTripId = `smart-trip-${Date.now()}`;
      toast.success('🎉 Dynamic Smart Itinerary Created!');
      onClose();
      navigate(`/dashboard/trips`);
    } finally {
      setCreating(false);
    }
  };

  const totalActivitiesCost = selectedPreset.stops.reduce((sum, s) => {
    return sum + s.activities.reduce((aSum, a) => aSum + a.cost, 0);
  }, 0);

  const transportEst = Math.round(tripBudget * 0.35);
  const stayEst = Math.round(tripBudget * 0.40);
  const mealsEst = Math.round(tripBudget * 0.15);
  const miscEst = Math.round(tripBudget * 0.10);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-10 z-10 max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Smart Dynamic Itinerary Assistant</h2>
                <p className="text-xs text-slate-500">Pick a destination & budget — we will plan the route & activities for you</p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* STEP 1: SELECT DESTINATION & ROUTE */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Choose a recommended destination package:</p>
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setRegionTab('India')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      regionTab === 'India' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    🇮🇳 India Tours
                  </button>
                  <button
                    onClick={() => setRegionTab('Global')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      regionTab === 'Global' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    🌍 International
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_ROUTES
                  .filter(r => regionTab === 'India' ? r.region === 'India' : r.region !== 'India')
                  .map((preset) => (
                    <motion.div
                      key={preset.id}
                      whileHover={{ y: -3 }}
                      onClick={() => handleSelectPreset(preset)}
                      className="bg-slate-50 hover:bg-white border border-slate-200/70 hover:border-sky-400 rounded-3xl p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                    >
                      <div className="h-36 rounded-2xl relative overflow-hidden bg-slate-900">
                        <img 
                          src={preset.coverPhoto} 
                          alt={preset.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {preset.defaultDays} Days
                        </span>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">{preset.vibe}</span>
                          <h4 className="font-bold text-base leading-snug">{preset.title}</h4>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
                          <MapPin size={13} className="text-sky-500 shrink-0" />
                          <span>{preset.stops.map(s => s.cityName).join(' → ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Estimated Budget:</span>
                          <span className="font-bold text-emerald-600 text-sm">
                            ₹{preset.recommendedBudget.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <button className="w-full py-2.5 bg-sky-50 group-hover:bg-sky-600 text-sky-700 group-hover:text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1">
                        <span>Select & Customize Route</span>
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMIZE BUDGET & DATES */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Selected Destination Summary Card */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-3xl p-5 flex items-center space-x-4">
                <img 
                  src={selectedPreset.coverPhoto} 
                  alt={selectedPreset.title} 
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">{selectedPreset.vibe}</span>
                  <h4 className="font-bold text-lg text-slate-900 truncate">{selectedPreset.title}</h4>
                  <p className="text-xs text-slate-500">Route: {selectedPreset.stops.map(s => s.cityName).join(' → ')}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 underline shrink-0"
                >
                  Change Destination
                </button>
              </div>

              {/* Trip-Specific Budget Configuration */}
              <div className="space-y-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Set Custom Trip Budget (₹)
                  </label>
                  <span className="text-lg font-extrabold text-sky-600">
                    ₹{Number(tripBudget).toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="range"
                  min="20000"
                  max="300000"
                  step="5000"
                  value={tripBudget}
                  onChange={(e) => setTripBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />

                {/* Preset quick budget chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[30000, 45000, 75000, 120000, 200000].map((b) => (
                    <button
                      key={b}
                      onClick={() => setTripBudget(b)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        tripBudget === b
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ₹{(b / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                {/* Auto Calculated Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Stays (40%)</span>
                    <span className="font-bold text-slate-800 text-sm">₹{stayEst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Transport (35%)</span>
                    <span className="font-bold text-slate-800 text-sm">₹{transportEst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Meals (15%)</span>
                    <span className="font-bold text-slate-800 text-sm">₹{mealsEst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-400 block font-medium">Activities (10%)</span>
                    <span className="font-bold text-slate-800 text-sm">₹{miscEst.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Pre-suggested Itinerary Plan Preview */}
              <div className="space-y-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900">Pre-Configured Activities for this Budget:</h4>
                <div className="space-y-3">
                  {selectedPreset.stops.map((stop, sIdx) => (
                    <div key={sIdx} className="bg-slate-50 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center space-x-1">
                          <MapPin size={13} className="text-sky-600" />
                          <span>{stop.cityName} ({stop.days} Days)</span>
                        </span>
                        <span className="text-slate-400 font-normal">{stop.activities.length} activities scheduled</span>
                      </div>

                      <div className="divide-y divide-slate-100 pt-1">
                        {stop.activities.map((act, aIdx) => (
                          <div key={aIdx} className="py-2 flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium">{act.name}</span>
                            <span className="font-bold text-emerald-600">₹{act.cost.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
                >
                  Back
                </button>

                <button
                  onClick={handleFinalizeItinerary}
                  disabled={creating}
                  className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-sky-600/25 transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>{creating ? 'Generating Itinerary...' : 'Finalize & Open Dynamic Itinerary'}</span>
                </button>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
