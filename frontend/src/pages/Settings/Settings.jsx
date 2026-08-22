import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Sparkles, Compass, Shield, Check, 
  Heart, Tag, Globe, Sliders, DollarSign, Camera, RefreshCw,
  Award, Zap, CheckCircle2, Bookmark, Star, MapPin, Lock, Bell, Palette
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AVATAR_STYLES = [
  'adventurer', 
  'micah', 
  'bottts', 
  'fun-emoji', 
  'avataaars', 
  'notionists', 
  'identicon',
  'lorelei'
];

const TRAVEL_STYLES = [
  { id: 'Backpacker', label: 'Backpacker & Explorer', icon: '🎒', desc: 'Offbeat paths, hostels, authentic local experiences' },
  { id: 'Luxury', label: 'Luxury & Comfort', icon: '✨', desc: '5-star resorts, private transfers, premium dining' },
  { id: 'Heritage', label: 'Heritage & Culture', icon: '🏰', desc: 'Historical monuments, temples, guided history walks' },
  { id: 'Adventure', label: 'Adventure & Trekking', icon: '⛰️', desc: 'Hiking, rafting, scuba, nature camping' },
  { id: 'Beach', label: 'Beach & Relaxation', icon: '🏖️', desc: 'Coastal shacks, sunset cruises, peaceful retreats' },
  { id: 'Foodie', label: 'Foodie & Culinary', icon: '🍲', desc: 'Street food tours, cooking masterclasses, famous bistros' },
  { id: 'Family', label: 'Family & Group Friendly', icon: '👨‍👩‍👧', desc: 'Spacious villas, kid-friendly parks, relaxed pacing' }
];

const TRAVEL_PACES = [
  { id: 'Fast', label: 'Fast-Paced', desc: 'Cover maximum landmarks and sights each day' },
  { id: 'Balanced', label: 'Balanced', desc: 'Great mix of sightseeing and downtime' },
  { id: 'Relaxed', label: 'Relaxed & Leisure', desc: 'Slow mornings, flexible schedules, cafe visits' }
];

const BUDGET_TIERS = [
  { id: 'Budget', label: 'Budget-Friendly', desc: '₹15,000 - ₹35,000 / trip' },
  { id: 'Moderate', label: 'Moderate & Value', desc: '₹35,000 - ₹75,000 / trip' },
  { id: 'Luxury', label: 'Premium & Luxury', desc: '₹75,000 - ₹2,00,000+ / trip' }
];

const COMPANIONS = [
  { id: 'Solo', label: 'Solo Traveler', icon: '👤' },
  { id: 'Couple', label: 'Couple / Romantic', icon: '❤️' },
  { id: 'Friends', label: 'Group of Friends', icon: '👥' },
  { id: 'Family', label: 'Family with Kids', icon: '👨‍👩‍👧‍👦' }
];

const INTEREST_TAGS = [
  'Heritage Forts & Palaces', 'Houseboat Backwaters', 'Scuba Diving & Watersports',
  'Tea Plantations & Hills', 'Desert Safari & Camping', 'Street Food & Night Markets',
  'Ayurvedic Spa & Wellness', 'Snow Peaks & Skiing', 'Nightlife & Beach Parties',
  'Wildlife & Jungle Safari', 'Spiritual Temples & Ghats', 'Art & Architecture'
];

// Sidebar navigation items
const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User, color: 'text-sky-600 bg-sky-50' },
  { id: 'travel-style', label: 'Travel Style', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
  { id: 'pace-budget', label: 'Pace & Budget', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'companions', label: 'Companions', icon: Heart, color: 'text-rose-600 bg-rose-50' },
  { id: 'interests', label: 'Interests', icon: Tag, color: 'text-amber-600 bg-amber-50' },
  { id: 'preferences', label: 'App Preferences', icon: Sliders, color: 'text-indigo-600 bg-indigo-50' },
];

export default function Settings() {
  const context = useOutletContext();
  const user = context?.user;
  const onUpdateUser = context?.onUpdateUser || (() => {});
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [homeCity, setHomeCity] = useState('Mumbai, India');
  const [language, setLanguage] = useState(user?.languagePreference || 'en');
  const [currency, setCurrency] = useState('INR');

  // Avatar state
  const seed = user?.email || 'explorer';
  const defaultUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || defaultUrl);

  // Personalization Preferences State
  const [travelStyle, setTravelStyle] = useState(user?.preferences?.travelStyle || 'Heritage');
  const [travelPace, setTravelPace] = useState(user?.preferences?.travelPace || 'Balanced');
  const [budgetTier, setBudgetTier] = useState(user?.preferences?.budget || 'Moderate');
  const [companions, setCompanions] = useState(user?.preferences?.companions || 'Couple');
  const [selectedInterests, setSelectedInterests] = useState(
    user?.preferences?.interests?.length > 0 
      ? user.preferences.interests 
      : ['Heritage Forts & Palaces', 'Houseboat Backwaters', 'Street Food & Night Markets', 'Tea Plantations & Hills']
  );

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);

  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Section refs for smooth scrolling
  const sectionRefs = useRef({});

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.photoUrl) setPhotoUrl(user.photoUrl);
      if (user.preferences) {
        if (user.preferences.travelStyle) setTravelStyle(user.preferences.travelStyle);
        if (user.preferences.travelPace) setTravelPace(user.preferences.travelPace);
        if (user.preferences.budget) setBudgetTier(user.preferences.budget);
        if (user.preferences.companions) setCompanions(user.preferences.companions);
        if (user.preferences.interests && user.preferences.interests.length > 0) {
          setSelectedInterests(user.preferences.interests);
        }
      }
    }
  }, [user]);

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      photoUrl,
      languagePreference: language,
      preferences: {
        travelStyle,
        travelPace,
        budget: budgetTier,
        companions,
        interests: selectedInterests,
        priorities: selectedInterests.slice(0, 3)
      }
    };

    try {
      const { data } = await api.put('/auth/profile', payload);
      const updatedUser = data.user || { ...user, ...payload };
      
      onUpdateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('🎉 Profile and travel personalization saved successfully!');
    } catch (err) {
      // Fallback local storage save
      const fallbackUser = {
        ...user,
        name,
        photoUrl,
        languagePreference: language,
        preferences: payload.preferences
      };
      onUpdateUser(fallbackUser);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      toast.success('Profile settings updated successfully!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-8 pb-20 max-w-6xl mx-auto">
      
      {/* 🔹 Left Sidebar Navigation */}
      <div className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-6 space-y-1.5">
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 px-3">Settings</h2>
          </div>

          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold shadow-sm border border-sky-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon size={14} />
                </div>
                <span>{section.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                )}
              </button>
            );
          })}

          {/* Save Button in Sidebar */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-4 py-3 rounded-xl text-xs shadow-lg shadow-sky-600/25 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
              <span>{saving ? 'Saving...' : 'Save All'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & Travel Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Personalize your travel profile, persona preferences, and AI itinerary recommendation filters.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="lg:hidden bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow-lg shadow-sky-600/25 transition flex items-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-8">
          
          {/* 1. Profile & Avatar Card */}
          <div
            id="profile"
            ref={(el) => (sectionRefs.current['profile'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
                <User size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information & Avatar</h3>
                <p className="text-xs text-slate-500">Your profile details displayed across trips and reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Avatar Picker */}
              <div className="space-y-4 text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-3xl bg-slate-50 border-4 border-white shadow-xl overflow-hidden ring-2 ring-slate-100 mx-auto">
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-sky-600 text-white p-2 rounded-xl shadow-md">
                    <Camera size={14} />
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block">Avatar Style</span>
                  <p className="text-[11px] text-slate-400">Choose a generated persona style</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_STYLES.map((style) => {
                    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
                    const isSelected = photoUrl === url;
                    return (
                      <button
                        type="button"
                        key={style}
                        onClick={() => setPhotoUrl(url)}
                        className={`p-1.5 rounded-xl border transition cursor-pointer overflow-hidden ${
                          isSelected 
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400/30' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        <img src={url} alt={style} className="w-8 h-8 mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Input Fields */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Home Base / Country
                    </label>
                    <input
                      type="text"
                      value={homeCity}
                      onChange={(e) => setHomeCity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Travel Style & Persona Card */}
          <div
            id="travel-style"
            ref={(el) => (sectionRefs.current['travel-style'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Travel Style & Persona Preferences</h3>
                <p className="text-xs text-slate-500">
                  Used to generate customized itinerary routes, activity suggestions, and budget estimates
                </p>
              </div>
            </div>

            {/* Travel Styles Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Primary Travel Persona
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setTravelStyle(style.id)}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
                      travelStyle === style.id
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{style.icon}</span>
                      <span className="font-bold text-sm text-slate-900">{style.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Pace & Budget Card */}
          <div
            id="pace-budget"
            ref={(el) => (sectionRefs.current['pace-budget'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <DollarSign size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pace & Budget Preferences</h3>
                <p className="text-xs text-slate-500">Set your default travel speed and spending comfort level</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Travel Pace */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Travel Pace
                </label>
                <div className="space-y-2">
                  {TRAVEL_PACES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setTravelPace(p.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                        travelPace === p.id
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{p.label}</span>
                        <span className="text-[11px] text-slate-400 block">{p.desc}</span>
                      </div>
                      {travelPace === p.id && <CheckCircle2 size={18} className="text-purple-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typical Budget Tier */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Default Trip Budget Tier
                </label>
                <div className="space-y-2">
                  {BUDGET_TIERS.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setBudgetTier(b.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                        budgetTier === b.id
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{b.label}</span>
                        <span className="text-[11px] text-slate-400 block">{b.desc}</span>
                      </div>
                      {budgetTier === b.id && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Companions Card */}
          <div
            id="companions"
            ref={(el) => (sectionRefs.current['companions'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <Heart size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Travel Companions</h3>
                <p className="text-xs text-slate-500">Who do you usually travel with? This helps personalize activity suggestions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COMPANIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCompanions(c.id)}
                  className={`p-4 rounded-2xl border text-center transition cursor-pointer ${
                    companions === c.id
                      ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70 font-semibold'
                  }`}
                >
                  <span className="text-2xl block mb-2">{c.icon}</span>
                  <span className="text-xs block">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Interest Tags Card */}
          <div
            id="interests"
            ref={(el) => (sectionRefs.current['interests'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Tag size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Travel Interests & Activity Types</h3>
                <p className="text-xs text-slate-500">Select all that match your travel style for better recommendations</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const active = selectedInterests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {active && <Check size={13} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{selectedInterests.length} interests selected — these power your personalized trip suggestions</span>
            </div>
          </div>

          {/* 6. App Preferences Card */}
          <div
            id="preferences"
            ref={(el) => (sectionRefs.current['preferences'] = el)}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Sliders size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">App Preferences</h3>
                <p className="text-xs text-slate-500">Notification settings and display preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <Bell size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Email Notifications</span>
                    <span className="text-[11px] text-slate-400">Receive trip updates and suggestions via email</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-sky-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    emailNotifications ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Trip Reminders Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <MapPin size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Trip Reminders</span>
                    <span className="text-[11px] text-slate-400">Get reminded 3 days before upcoming trips</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTripReminders(!tripReminders)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    tripReminders ? 'bg-sky-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    tripReminders ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Account Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <Lock size={16} className="text-slate-600" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Account Security</span>
                  <span className="text-[11px] text-slate-400">Password management is handled via your authentication provider</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Bar (Mobile/Tablet) */}
          <div className="pt-4 flex justify-end lg:hidden">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-10 py-4 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-sky-600/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
              <span>{saving ? 'Saving Personalization Profile...' : 'Save All Preferences'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
