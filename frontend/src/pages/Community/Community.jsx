import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Heart, Copy, Share2, MapPin, Calendar, 
  Sparkles, Search, Check, Eye, Tag, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const COMMUNITY_ITINERARIES = [
  {
    id: 'comm-1',
    name: '10 Days Golden Route Japan 🇯🇵',
    author: 'Elena Rostova',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    days: 10,
    stops: ['Tokyo', 'Kyoto', 'Osaka', 'Hakone'],
    likes: 342,
    copies: 128,
    tags: ['Culture', 'Culinary', 'Bullet Train'],
    description: 'The definitive first-timer guide to Japan covering Shibuya neon, Fushimi Inari shrines, and Dotonbori street food.'
  },
  {
    id: 'comm-2',
    name: 'Romantic Amalfi Coast & Tuscany Escape 🇮🇹',
    author: 'Marco Bellini',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marco',
    coverPhoto: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    days: 8,
    stops: ['Rome', 'Florence', 'Positano', 'Capri'],
    likes: 512,
    copies: 210,
    tags: ['Romance', 'Wine', 'Scenic Coast'],
    description: 'Cliffside villas, Chianti vineyard tours, and sunset boat rides across the Mediterranean.'
  },
  {
    id: 'comm-3',
    name: 'Bali Island Hopper: Temples & Waves 🌺',
    author: 'Sophie Dubois',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophie',
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    days: 7,
    stops: ['Ubud', 'Canggu', 'Nusa Penida', 'Uluwatu'],
    likes: 289,
    copies: 95,
    tags: ['Adventure', 'Beaches', 'Wellness'],
    description: 'Jungle treehouses, surfing breaks, yoga retreats, and magical cliff-edge sunset ceremonies.'
  },
  {
    id: 'comm-4',
    name: 'Classic European Heritage Tour 🏰',
    author: 'Liam Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Liam',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    days: 14,
    stops: ['London', 'Paris', 'Amsterdam', 'Berlin'],
    likes: 419,
    copies: 176,
    tags: ['Museums', 'History', 'Nightlife'],
    description: 'High-speed Eurostar connected journey through the crown jewels of Western European art and history.'
  }
];

export default function Community() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState(COMMUNITY_ITINERARIES);
  const [likedMap, setLikedMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (id) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
    setItineraries(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: likedMap[id] ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    }));
  };

  const handleCopyTrip = (trip) => {
    toast.success(`Copied "${trip.name}" to My Trips! 🎉`, { icon: '✈️' });
    navigate('/dashboard/trips');
  };

  const filtered = itineraries.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.stops.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Community Itineraries</h1>
          <p className="text-sm text-slate-500 mt-1">Get inspired by hand-crafted travel plans from globetrotters worldwide</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search community itineraries by city, route, or travel style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-slate-800"
          />
        </div>
      </div>

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            {/* Image Banner */}
            <div className="h-56 relative overflow-hidden bg-slate-900">
              <img
                src={item.coverPhoto}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs">
                <img src={item.authorAvatar} alt={item.author} className="w-5 h-5 rounded-full" />
                <span className="font-medium">{item.author}</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {item.days} Days
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-xl leading-snug drop-shadow-md">{item.name}</h3>
                <div className="flex items-center space-x-1.5 text-xs text-slate-200 mt-1">
                  <MapPin size={13} className="text-sky-400" />
                  <span>{item.stops.join(' → ')}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center space-x-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl ${
                    likedMap[item.id]
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Heart size={15} className={likedMap[item.id] ? 'fill-rose-600' : ''} />
                  <span>{item.likes}</span>
                </button>

                <button
                  onClick={() => handleCopyTrip(item)}
                  className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>Copy Trip</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
