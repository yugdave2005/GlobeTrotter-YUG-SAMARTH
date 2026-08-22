import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Plus, Clock, Share2, 
  Trash2, ChevronLeft, Sparkles, Check, Copy,
  List, Calendar as CalendarIcon, Compass, X, Wallet, Edit2,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, TrendingUp,
  Flame, Navigation, ArrowRight
} from 'lucide-react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

// Curated dictionary of nearby destinations by region / hub
const NEARBY_REGIONS = [
  {
    id: 'kerala',
    name: 'Kerala & South India',
    keywords: ['kerala', 'munnar', 'alleppey', 'kochi', 'cochin', 'wayanad', 'varkala', 'thekkady', 'kovalam'],
    cities: [
      { name: 'Kochi (Cochin)', country: 'India', subtitle: 'Fort Kochi & Chinese Fishing Nets', defaultCost: 1500 },
      { name: 'Munnar', country: 'India', subtitle: 'Tea Plantations & Misty Hills', defaultCost: 1800 },
      { name: 'Alleppey (Alappuzha)', country: 'India', subtitle: 'Backwaters Houseboat Cruise', defaultCost: 4500 },
      { name: 'Thekkady (Periyar)', country: 'India', subtitle: 'Spice Gardens & Elephant Reserve', defaultCost: 2200 },
      { name: 'Varkala Beach', country: 'India', subtitle: 'Red Cliff Beaches & Sunset Cafes', defaultCost: 1200 },
      { name: 'Wayanad', country: 'India', subtitle: 'Edakkal Caves & Waterfalls', defaultCost: 1600 },
      { name: 'Kovalam', country: 'India', subtitle: 'Lighthouse Beach & Ayurvedic Spas', defaultCost: 2000 }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Royal Heritage',
    keywords: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'pushkar', 'mount abu'],
    cities: [
      { name: 'Jaipur', country: 'India', subtitle: 'Amber Fort & Pink City Bazaars', defaultCost: 1500 },
      { name: 'Udaipur', country: 'India', subtitle: 'Lake Pichola & City Palace', defaultCost: 1800 },
      { name: 'Jodhpur', country: 'India', subtitle: 'Mehrangarh Fort & Blue City', defaultCost: 1400 },
      { name: 'Jaisalmer', country: 'India', subtitle: 'Golden Fortress & Thar Desert Safari', defaultCost: 2800 },
      { name: 'Pushkar', country: 'India', subtitle: 'Sacred Lake Ghats & Desert Fair', defaultCost: 1000 },
      { name: 'Mount Abu', country: 'India', subtitle: 'Dilwara Temples & Nakki Lake', defaultCost: 1600 }
    ]
  },
  {
    id: 'goa',
    name: 'Goa Coastal & Beach Hub',
    keywords: ['goa', 'panaji', 'calangute', 'anjuna', 'palolem', 'gokarna'],
    cities: [
      { name: 'North Goa (Calangute & Anjuna)', country: 'India', subtitle: 'Water Sports, Shacks & Nightlife', defaultCost: 2500 },
      { name: 'South Goa (Palolem & Colva)', country: 'India', subtitle: 'Tranquil White Sand Beaches', defaultCost: 2000 },
      { name: 'Panaji (Old Goa & Latin Quarter)', country: 'India', subtitle: 'Portuguese Architecture & Fontainhas', defaultCost: 1200 },
      { name: 'Gokarna', country: 'India', subtitle: 'Om Beach & Coastal Nature Treks', defaultCost: 1400 },
      { name: 'Dudhsagar Waterfalls', country: 'India', subtitle: 'Scenic Jungle Train & 4-Tier Falls', defaultCost: 1800 }
    ]
  },
  {
    id: 'himachal',
    name: 'Himachal & Snow Peaks',
    keywords: ['manali', 'rohtang', 'himachal', 'shimla', 'kasol', 'dharamshala', 'spiti'],
    cities: [
      { name: 'Manali & Old Manali', country: 'India', subtitle: 'Old Manali Cafes & Beas River', defaultCost: 1800 },
      { name: 'Solang Valley & Rohtang Pass', country: 'India', subtitle: 'Paragliding, Skiing & Snow Peaks', defaultCost: 3200 },
      { name: 'Kasol & Tosh', country: 'India', subtitle: 'Parvati Valley & Pine Forest Treks', defaultCost: 1400 },
      { name: 'Shimla & Kufri', country: 'India', subtitle: 'Ridge Mall & Colonial Architecture', defaultCost: 1600 },
      { name: 'Dharamshala & McLeodGanj', country: 'India', subtitle: 'Dalai Lama Temple & Triund Trek', defaultCost: 1500 }
    ]
  },
  {
    id: 'varanasi',
    name: 'Spiritual Varanasi & Heritage',
    keywords: ['varanasi', 'kashi', 'sarnath', 'ayodhya', 'prayagraj', 'ganga'],
    cities: [
      { name: 'Varanasi (Kashi)', country: 'India', subtitle: 'Ganga Sunrise Boat & Evening Aarti', defaultCost: 1000 },
      { name: 'Sarnath', country: 'India', subtitle: 'Deer Park & Ancient Buddhist Stupas', defaultCost: 600 },
      { name: 'Ayodhya', country: 'India', subtitle: 'Ram Mandir & Saryu River Ghats', defaultCost: 1200 },
      { name: 'Prayagraj (Triveni Sangam)', country: 'India', subtitle: 'Holy Confluence of Sacred Rivers', defaultCost: 900 }
    ]
  },
  {
    id: 'europe',
    name: 'Western Europe Circuit',
    keywords: ['europe', 'paris', 'rome', 'barcelona', 'amsterdam', 'venice', 'florence'],
    cities: [
      { name: 'Paris', country: 'France', subtitle: 'Eiffel Tower & Louvre Museum', defaultCost: 4500 },
      { name: 'Rome', country: 'Italy', subtitle: 'Colosseum & Vatican Museums', defaultCost: 4200 },
      { name: 'Barcelona', country: 'Spain', subtitle: 'Sagrada Familia & Gothic Quarter', defaultCost: 3800 },
      { name: 'Amsterdam', country: 'Netherlands', subtitle: 'Canal Cruises & Van Gogh Museum', defaultCost: 4000 },
      { name: 'Venice', country: 'Italy', subtitle: 'Gondola Rides & St. Marks Square', defaultCost: 5000 },
      { name: 'Florence', country: 'Italy', subtitle: 'Duomo & Uffizi Gallery Art', defaultCost: 3600 }
    ]
  },
  {
    id: 'japan',
    name: 'Japan Golden Route',
    keywords: ['japan', 'tokyo', 'kyoto', 'osaka', 'hakone', 'fuji'],
    cities: [
      { name: 'Tokyo', country: 'Japan', subtitle: 'Shibuya Crossing & Meiji Shrine', defaultCost: 4800 },
      { name: 'Kyoto', country: 'Japan', subtitle: 'Fushimi Inari & Arashiyama Bamboo', defaultCost: 4200 },
      { name: 'Osaka', country: 'Japan', subtitle: 'Dotonbori Street Food & Osaka Castle', defaultCost: 3900 },
      { name: 'Hakone & Mt. Fuji', country: 'Japan', subtitle: 'Thermal Onsens & Mt. Fuji Views', defaultCost: 5500 }
    ]
  }
];

// Curated activity suggestions per place
const PLACE_ACTIVITIES = {
  kerala: [
    { name: 'Alleppey Backwaters Houseboat Day Cruise & Sadya Lunch', category: 'RELAXATION', cost: 4500, duration: '5 hrs' },
    { name: 'Munnar Kolukkumalai Sunrise Jeep Safari', category: 'ADVENTURE', cost: 2200, duration: '3.5 hrs' },
    { name: 'Traditional Ayurvedic Full-Body Abhyanga Massage', category: 'RELAXATION', cost: 2500, duration: '1.5 hrs' },
    { name: 'Fort Kochi Kathakali Dance & Martial Arts Show', category: 'SIGHTSEEING', cost: 800, duration: '2 hrs' },
    { name: 'Periyar Wildlife Sanctuary Bamboo Rafting & Trek', category: 'ADVENTURE', cost: 2800, duration: '4 hrs' },
    { name: 'Varkala Cliffside Seafood & Sunset Dinner', category: 'FOOD', cost: 1400, duration: '2 hrs' }
  ],
  rajasthan: [
    { name: 'Amber Fort Elephant & Sheesh Mahal Heritage Tour', category: 'SIGHTSEEING', cost: 1200, duration: '3 hrs' },
    { name: 'Lake Pichola Sunset Luxury Catamaran Cruise', category: 'RELAXATION', cost: 1500, duration: '1.5 hrs' },
    { name: 'Chokhi Dhani Cultural Village Rajasthani Feast', category: 'FOOD', cost: 1600, duration: '3 hrs' },
    { name: 'Jaisalmer Sam Dunes Camel Safari & Camp Night', category: 'ADVENTURE', cost: 2800, duration: '5 hrs' },
    { name: 'Mehrangarh Fort Zipline Flying Fox Experience', category: 'ADVENTURE', cost: 2100, duration: '2 hrs' }
  ],
  goa: [
    { name: 'Grand Island Scuba Diving & 5-in-1 Watersports', category: 'ADVENTURE', cost: 3500, duration: '4 hrs' },
    { name: 'Mandovi Luxury Sunset River Cruise with Goan Folk Dance', category: 'RELAXATION', cost: 1200, duration: '2 hrs' },
    { name: 'Fontainhas Latin Quarter Walking & Bakery Tour', category: 'FOOD', cost: 900, duration: '2 hrs' },
    { name: 'Anjuna Beachside Seafood Grill & Cocktail Evening', category: 'FOOD', cost: 1800, duration: '2.5 hrs' }
  ],
  himachal: [
    { name: 'Solang Valley High-Altitude Tandem Paragliding', category: 'ADVENTURE', cost: 3200, duration: '2 hrs' },
    { name: 'Rohtang Pass & Atal Tunnel Snow Excursion', category: 'ADVENTURE', cost: 2800, duration: '4 hrs' },
    { name: 'Old Manali Riverside Trout Fish & Woodfired Pizza', category: 'FOOD', cost: 1200, duration: '2 hrs' },
    { name: 'Jogini Waterfall Guided Hike & Nature Picnic', category: 'RELAXATION', cost: 800, duration: '3 hrs' }
  ],
  default: [
    { name: 'City Heritage Landmark & Architecture Walking Tour', category: 'SIGHTSEEING', cost: 1200, duration: '3 hrs' },
    { name: 'Authentic Local Cuisine Tasting & Street Food Safari', category: 'FOOD', cost: 1100, duration: '2 hrs' },
    { name: 'Panoramic Sunset Viewpoint & Cultural Performance', category: 'RELAXATION', cost: 950, duration: '2 hrs' },
    { name: 'Outdoor Nature Hike & Adventure Activity', category: 'ADVENTURE', cost: 2200, duration: '3 hrs' }
  ]
};

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'

  // Accordion state: map of stopId -> isCollapsed (true = collapsed)
  const [collapsedStops, setCollapsedStops] = useState({});

  // Modals
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(50000);
  const [selectedStopId, setSelectedStopId] = useState(null);

  // Forms
  const [stopForm, setStopForm] = useState({
    cityId: '',
    cityName: '',
    arrivalDate: '',
    departureDate: '',
  });

  const [activityForm, setActivityForm] = useState({
    activityId: '',
    name: '',
    scheduledTime: '',
    customCost: 1500,
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
      setBudgetInput(data.budget || 50000);
    } catch (err) {
      // Fallback mock trip
      setTrip({
        id: tripId,
        name: 'Kerala Backwaters & Hills Tour 🌴',
        description: 'A tranquil tropical voyage across Kochi, Munnar, and Alleppey.',
        startDate: '2026-08-22',
        endDate: '2026-08-27',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200',
        shareSlug: 'kerala-tour-2026',
        budget: 160000,
        stops: [
          {
            id: 'stop-kerala-1',
            city: {
              name: 'Kerala (Munnar & Alleppey)',
              country: 'India',
              imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800'
            },
            arrivalDate: '2026-08-22',
            departureDate: '2026-08-27',
            activities: [
              {
                id: 'act-k1',
                activity: { name: 'Alleppey Backwaters Houseboat Day Cruise', category: 'RELAXATION', cost: 4500, durationMinutes: 300 },
                customCost: 4500
              },
              {
                id: 'act-k2',
                activity: { name: 'Munnar Tea Plantations & Factory Trek', category: 'ADVENTURE', cost: 1000, durationMinutes: 150 },
                customCost: 1000
              },
              {
                id: 'act-k3',
                activity: { name: 'Traditional Ayurvedic Herbal Massage', category: 'RELAXATION', cost: 2500, durationMinutes: 90 },
                customCost: 2500
              }
            ]
          }
        ]
      });
      setBudgetInput(160000);
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
      console.log('Using fallback cities');
    }
  };

  // Detect which destination region matches the active trip
  const matchedRegion = useMemo(() => {
    if (!trip) return NEARBY_REGIONS[0];
    const textToMatch = `${trip.name} ${trip.description || ''} ${trip.stops?.map(s => s.city?.name || '').join(' ')}`.toLowerCase();
    
    const found = NEARBY_REGIONS.find(reg => 
      reg.keywords.some(kw => textToMatch.includes(kw))
    );
    return found || NEARBY_REGIONS[0];
  }, [trip]);

  // Dynamic nearby destination places specifically tailored to this trip
  const nearbySuggestedPlaces = useMemo(() => {
    return matchedRegion.cities;
  }, [matchedRegion]);

  // Financial calculations: Dynamic budget deduction
  const tripBudget = Number(trip?.budget || 50000);
  const totalCost = useMemo(() => {
    return trip?.stops?.reduce((sum, stop) => {
      const stopCost = stop.activities?.reduce((actSum, a) => actSum + (a.customCost || a.activity?.cost || 0), 0) || 0;
      return sum + stopCost;
    }, 0) || 0;
  }, [trip]);

  const remainingBudget = tripBudget - totalCost;
  const budgetPercentUsed = Math.min(Math.round((totalCost / tripBudget) * 100), 100);
  const isOverBudget = remainingBudget < 0;

  // Toggle Collapse on a Stop
  const toggleStopCollapse = (stopId) => {
    setCollapsedStops(prev => ({
      ...prev,
      [stopId]: !prev[stopId]
    }));
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      // Check if selected is an existing database city or a nearby preset city
      let targetCityId = stopForm.cityId;
      let matchedCityObj = cities.find(c => c.id === targetCityId);

      if (!matchedCityObj && stopForm.cityName) {
        // Find existing city by name or pick first
        matchedCityObj = cities.find(c => c.name.toLowerCase().includes(stopForm.cityName.toLowerCase().split(' ')[0])) || cities[0];
        targetCityId = matchedCityObj?.id || cities[0]?.id;
      }

      const payload = {
        cityId: targetCityId,
        arrivalDate: stopForm.arrivalDate || trip?.startDate || new Date().toISOString(),
        departureDate: stopForm.departureDate || trip?.endDate || new Date(Date.now() + 3 * 86400000).toISOString(),
        sortOrder: (trip?.stops?.length || 0) + 1
      };

      const { data } = await api.post(`/core/trips/${tripId}/stops`, payload);
      setTrip(prev => ({
        ...prev,
        stops: [...(prev?.stops || []), data]
      }));
      setIsAddStopOpen(false);
      toast.success(`Added ${matchedCityObj?.name || 'stop'} to itinerary! 📍`);
    } catch (err) {
      // Local fallback
      const chosenCity = cities.find(c => c.id === stopForm.cityId) || { 
        name: stopForm.cityName || 'New Destination Stop', 
        country: 'India' 
      };
      const localStop = {
        id: `stop-${Date.now()}`,
        city: chosenCity,
        arrivalDate: stopForm.arrivalDate || trip?.startDate,
        departureDate: stopForm.departureDate || trip?.endDate,
        activities: []
      };
      setTrip(prev => ({
        ...prev,
        stops: [...(prev?.stops || []), localStop]
      }));
      setIsAddStopOpen(false);
      toast.success('Destination stop added! 📍');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedStopId) return;

    const costNum = Number(activityForm.customCost) || 0;

    const newAct = {
      id: `act-${Date.now()}`,
      activity: {
        name: activityForm.name,
        category: activityForm.category,
        cost: costNum,
        durationMinutes: 90
      },
      customCost: costNum,
      scheduledTime: activityForm.scheduledTime || new Date().toISOString()
    };

    try {
      await api.post(`/core/trips/${tripId}/stops/${selectedStopId}/activities`, {
        name: activityForm.name,
        category: activityForm.category,
        customCost: costNum,
        scheduledTime: activityForm.scheduledTime
      });
    } catch (err) {
      console.log('Saved to local state');
    }

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
      customCost: 1500,
      category: 'SIGHTSEEING'
    });
    toast.success(`Activity added! ₹${costNum.toLocaleString('en-IN')} deducted from budget. 💸`);
  };

  const handleDeleteActivity = (stopId, actId, actCost) => {
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.id === stopId) {
          return {
            ...s,
            activities: s.activities.filter(a => a.id !== actId)
          };
        }
        return s;
      })
    }));
    toast.success(`Activity removed. ₹${Number(actCost || 0).toLocaleString('en-IN')} restored to budget! 💰`);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/core/trips/${tripId}`, { budget: Number(budgetInput) });
      setTrip(prev => ({ ...prev, budget: Number(budgetInput) }));
      setIsEditBudgetOpen(false);
      toast.success('Trip budget updated successfully! 💸');
    } catch (err) {
      setTrip(prev => ({ ...prev, budget: Number(budgetInput) }));
      setIsEditBudgetOpen(false);
      toast.success('Trip budget updated! 💸');
    }
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

  // Active stop city name for smart activity recommendations
  const activeStop = trip?.stops?.find(s => s.id === selectedStopId);
  const activeCityName = activeStop?.city?.name || 'this destination';

  // Retrieve suggested activities for this active place
  const activePlaceKey = Object.keys(PLACE_ACTIVITIES).find(k => activeCityName.toLowerCase().includes(k)) || matchedRegion.id;
  const suggestedActivitiesForActivePlace = PLACE_ACTIVITIES[activePlaceKey] || PLACE_ACTIVITIES.default;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/trips')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm cursor-pointer"
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
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Trip Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-xl">
        <img
          src={trip?.coverPhotoUrl || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200'}
          alt={trip?.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-sky-500/30 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-400/30 inline-block">
                ✨ Dynamic Itinerary Assistant
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                Region: {matchedRegion.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {trip?.name}
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              {trip?.description || 'Build your dream itinerary stop-by-stop with smart nearby suggestions.'}
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
            </div>
          </div>

          <button
            onClick={() => {
              // Pre-select first nearby city
              if (nearbySuggestedPlaces.length > 0) {
                const firstNearby = nearbySuggestedPlaces[0];
                const matchedDb = cities.find(c => c.name.toLowerCase().includes(firstNearby.name.toLowerCase().split(' ')[0]));
                setStopForm({
                  cityId: matchedDb?.id || (cities[0]?.id || ''),
                  cityName: firstNearby.name,
                  arrivalDate: trip?.startDate ? trip.startDate.split('T')[0] : '',
                  departureDate: trip?.endDate ? trip.endDate.split('T')[0] : ''
                });
              }
              setIsAddStopOpen(true);
            }}
            className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-sky-600/30 transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Destination Stop</span>
          </button>
        </div>
      </div>

      {/* 💸 Dynamic Live Trip Budget Deductor Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">Trip Budget & Expense Deductor</h3>
                <button
                  onClick={() => {
                    setBudgetInput(tripBudget);
                    setIsEditBudgetOpen(true);
                  }}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center space-x-1 cursor-pointer bg-sky-50 px-2 py-0.5 rounded-md"
                >
                  <Edit2 size={11} />
                  <span>Edit Budget</span>
                </button>
              </div>
              <p className="text-xs text-slate-500">Activities automatically deduct from your planned trip budget</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Total Budget Pill */}
            <div className="bg-slate-50 p-3 px-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Budget</span>
              <span className="text-base font-extrabold text-slate-900">₹{tripBudget.toLocaleString('en-IN')}</span>
            </div>

            {/* Spent on Activities Pill */}
            <div className="bg-amber-50 p-3 px-4 rounded-2xl border border-amber-100">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Activities Total</span>
              <span className="text-base font-extrabold text-amber-700">-₹{totalCost.toLocaleString('en-IN')}</span>
            </div>

            {/* Remaining Balance Pill */}
            <div className={`p-3 px-4 rounded-2xl border ${
              isOverBudget ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <span className="text-[10px] font-bold uppercase block opacity-80">
                {isOverBudget ? 'Over Budget' : 'Remaining Balance'}
              </span>
              <span className="text-base font-extrabold">
                {isOverBudget ? `-₹${Math.abs(remainingBudget).toLocaleString('en-IN')}` : `₹${remainingBudget.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Budget Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-50">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Budget Utilized: {budgetPercentUsed}%</span>
            <span>{isOverBudget ? '⚠️ Budget Exceeded' : `₹${remainingBudget.toLocaleString('en-IN')} remaining for stays & travel`}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercentUsed}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isOverBudget ? 'bg-rose-500' : budgetPercentUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Itinerary Stops View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-6">
          {trip?.stops && trip.stops.length > 0 ? (
            trip.stops.map((stop, index) => {
              const isCollapsed = !!collapsedStops[stop.id];
              const stopActivityCount = stop.activities?.length || 0;
              const stopTotalCost = stop.activities?.reduce((sum, a) => sum + (a.customCost || a.activity?.cost || 0), 0) || 0;

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Stop City Header with Collapse Toggle */}
                  <div className="bg-slate-50/90 p-6 px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-sky-600/20 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            {stop.city?.name}
                          </h3>
                          <span className="text-xs bg-white text-slate-500 font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {stopActivityCount} {stopActivityCount === 1 ? 'activity' : 'activities'} • ₹{stopTotalCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1.5">
                          <Calendar size={13} className="text-sky-500" />
                          <span>{new Date(stop.arrivalDate).toLocaleDateString()} to {new Date(stop.departureDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setSelectedStopId(stop.id);
                          setIsAddActivityOpen(true);
                        }}
                        className="bg-white hover:bg-sky-50 text-sky-700 font-bold border border-sky-200 px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>Assign Activity</span>
                      </button>

                      {/* 🔽 Collapse / Expand Button */}
                      <button
                        onClick={() => toggleStopCollapse(stop.id)}
                        className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 px-3 py-2.5 rounded-xl text-xs transition flex items-center space-x-1 shadow-sm cursor-pointer"
                        title={isCollapsed ? 'Expand activities' : 'Collapse activities'}
                      >
                        {isCollapsed ? (
                          <>
                            <ChevronDown size={16} />
                            <span className="hidden sm:inline">Expand</span>
                          </>
                        ) : (
                          <>
                            <ChevronUp size={16} />
                            <span className="hidden sm:inline">Collapse</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stop Activities List with Smooth Accordion Animation */}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 px-8 divide-y divide-slate-100">
                          {stop.activities && stop.activities.length > 0 ? (
                            stop.activities.map((actItem, actIdx) => (
                              <div key={actItem.id || actIdx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/50 p-2 rounded-2xl transition">
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
                                    <span className="text-[11px] text-slate-400">Deducted from budget</span>
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-slate-400 font-medium">Scheduled</span>
                                  <button
                                    onClick={() => handleDeleteActivity(stop.id, actItem.id, actItem.customCost || actItem.activity?.cost)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                                    title="Delete activity and restore budget"
                                  >
                                    <Trash2 size={14} />
                                  </button>
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
                                className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                              >
                                + Browse and assign activities for {stop.city?.name}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-2xl">
                📍
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Your itinerary has no destination stops</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add nearby destination stops in {matchedRegion.name} to begin planning activities and spending.
                </p>
              </div>
              <button
                onClick={() => setIsAddStopOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition inline-flex items-center space-x-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add First Stop in {matchedRegion.name}</span>
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
                    <div key={aIdx} className="bg-white p-2 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs flex justify-between">
                      <span>{act.activity?.name}</span>
                      <span className="text-emerald-600 font-bold">₹{act.customCost || act.activity?.cost || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Stop Modal with Intelligent Nearby Places Filtering */}
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
              exit={{ opacity: 0, scale: 1, y: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsAddStopOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-2 mb-1">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                  <Navigation size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Add Destination Stop</h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Showing nearby places for <span className="font-bold text-slate-800">{matchedRegion.name}</span>
              </p>

              {/* 1-Click Recommended Nearby Place Chips */}
              <div className="mb-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  ✨ Quick-Pick Nearby Places in {matchedRegion.name}:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {nearbySuggestedPlaces.slice(0, 4).map((place, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        const matchedDb = cities.find(c => c.name.toLowerCase().includes(place.name.toLowerCase().split(' ')[0]));
                        setStopForm(prev => ({
                          ...prev,
                          cityName: place.name,
                          cityId: matchedDb?.id || (cities[0]?.id || '')
                        }));
                        toast.success(`Selected ${place.name}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        stopForm.cityName === place.name
                          ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <span className="font-bold block truncate">{place.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{place.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddStop} className="space-y-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Destination Place *
                  </label>
                  <select
                    value={stopForm.cityName || stopForm.cityId}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const selectedNearby = nearbySuggestedPlaces.find(p => p.name === selectedVal);
                      if (selectedNearby) {
                        const matchedDb = cities.find(c => c.name.toLowerCase().includes(selectedNearby.name.toLowerCase().split(' ')[0]));
                        setStopForm({
                          ...stopForm,
                          cityName: selectedNearby.name,
                          cityId: matchedDb?.id || (cities[0]?.id || '')
                        });
                      } else {
                        const dbCity = cities.find(c => c.id === selectedVal);
                        setStopForm({
                          ...stopForm,
                          cityId: selectedVal,
                          cityName: dbCity?.name || ''
                        });
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-sm font-medium"
                    required
                  >
                    <optgroup label={`⭐ Nearby to ${matchedRegion.name}`}>
                      {nearbySuggestedPlaces.map((place, idx) => (
                        <option key={`nearby-${idx}`} value={place.name}>
                          {place.name} ({place.subtitle})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌐 All Available Cities">
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}, {city.country}
                        </option>
                      ))}
                    </optgroup>
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
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Add Stop to Itinerary
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Activity Modal with Smart City Recommendations */}
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10 max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAddActivityOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">Assign Activity</h3>
              <p className="text-xs text-slate-500 mb-5">
                Suggested experiences for <span className="font-bold text-slate-800">{activeCityName}</span> (costs deduct from budget)
              </p>

              {/* 1-Click Recommended Activities for This Stop */}
              <div className="mb-6 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  ✨ Curated for {activeCityName}:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedActivitiesForActivePlace.map((sug, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setActivityForm({
                          name: sug.name,
                          category: sug.category,
                          customCost: sug.cost,
                          scheduledTime: '',
                          activityId: ''
                        });
                        toast.success(`Selected "${sug.name}" (₹${sug.cost.toLocaleString('en-IN')})`);
                      }}
                      className="p-3 bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-300 rounded-2xl cursor-pointer transition flex items-center justify-between text-xs group"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 group-hover:text-sky-700 block">{sug.name}</span>
                        <span className="text-[10px] text-slate-400">{sug.category} • {sug.duration}</span>
                      </div>
                      <span className="font-extrabold text-emerald-600 shrink-0 ml-2">₹{sug.cost.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddActivity} className="space-y-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityForm.name}
                    onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                    placeholder="e.g. Sunset Houseboat Cruise & Candlelight Dinner"
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
                      Cost (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={activityForm.customCost}
                      onChange={(e) => setActivityForm({ ...activityForm, customCost: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Save Activity & Deduct From Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Trip Budget Modal */}
      <AnimatePresence>
        {isEditBudgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditBudgetOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-10"
            >
              <button 
                onClick={() => setIsEditBudgetOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Wallet size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Edit Trip Budget</h3>
              <p className="text-xs text-slate-500 mb-6">Update the allocated spending budget for this specific trip</p>

              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 text-base font-bold"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2">
                  {[35000, 50000, 75000, 120000, 160000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setBudgetInput(amt)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        Number(budgetInput) === amt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition cursor-pointer"
                  >
                    Save Updated Budget
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
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
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
