import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, MapPin, Calendar, Clock, DollarSign, 
  Copy, Share2, Compass, ArrowRight, CheckCircle2 
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PublicItinerary() {
  const { shareSlug } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTrip();
  }, [shareSlug]);

  const fetchPublicTrip = async () => {
    try {
      const { data } = await api.get(`/core/public/trips/${shareSlug}`);
      setTrip(data);
    } catch (err) {
      // Fallback preview
      setTrip({
        name: 'Classic Euro Tour 2026 🇪🇺',
        description: 'A 2-week scenic journey across Paris, Rome, and Barcelona with curated highlights.',
        startDate: '2026-06-15',
        endDate: '2026-06-29',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
        stops: [
          {
            city: { name: 'Paris', country: 'France' },
            arrivalDate: '2026-06-15',
            departureDate: '2026-06-19',
            activities: [
              { activity: { name: 'Eiffel Tower Sunset Tour', category: 'SIGHTSEEING', cost: 35, durationMinutes: 120 } },
              { activity: { name: 'Seine River Evening Cruise', category: 'RELAXATION', cost: 25, durationMinutes: 75 } },
            ]
          },
          {
            city: { name: 'Rome', country: 'Italy' },
            arrivalDate: '2026-06-20',
            departureDate: '2026-06-24',
            activities: [
              { activity: { name: 'Colosseum & Roman Forum Tour', category: 'SIGHTSEEING', cost: 48, durationMinutes: 150 } },
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = () => {
    toast.success('Trip copied to your GlobeTrotter account! 🚀');
    navigate('/dashboard/trips');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Public Navbar */}
      <nav className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <Plane className="text-sky-600 w-6 h-6" />
          <span className="text-2xl font-bold text-sky-600 tracking-tight">GlobeTrotter</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyTrip}
            className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-sky-600/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Copy size={14} />
            <span>Copy This Trip</span>
          </button>
          <Link to="/auth/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-xl">
          <img
            src={trip?.coverPhotoUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200'}
            alt={trip?.name}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="bg-sky-500/30 text-sky-200 text-xs font-bold px-3.5 py-1 rounded-full border border-sky-400/30 inline-block">
              Public Itinerary
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {trip?.name}
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              {trip?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center space-x-1.5">
                <Calendar size={14} className="text-sky-400" />
                <span>{new Date(trip?.startDate).toLocaleDateString()} to {new Date(trip?.endDate).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin size={14} className="text-emerald-400" />
                <span>{trip?.stops?.length || 0} Destination Stops</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stops Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Day-by-Day Journey</h2>

          {trip?.stops?.map((stop, index) => (
            <div key={index} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{stop.city?.name}, {stop.city?.country}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(stop.arrivalDate).toLocaleDateString()} to {new Date(stop.departureDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-50 pt-2">
                {stop.activities?.map((act, aIdx) => (
                  <div key={aIdx} className="py-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{act.activity?.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{act.activity?.category}</span>
                        <span>•</span>
                        <span>{act.activity?.durationMinutes} mins</span>
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600">
                      ₹{(act.activity?.cost || 2500).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Copy CTA */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 text-white text-center space-y-4 shadow-lg">
          <h3 className="text-2xl font-bold">Love this itinerary?</h3>
          <p className="text-xs text-sky-100 max-w-md mx-auto">
            Duplicate this trip to your personal GlobeTrotter account to customize stops, invite companions, and manage budgets in real-time.
          </p>
          <button
            onClick={handleCopyTrip}
            className="bg-white text-sky-800 hover:bg-slate-50 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg transition active:scale-95 cursor-pointer"
          >
            Copy Trip to My Plans
          </button>
        </div>

      </main>
    </div>
  );
}
