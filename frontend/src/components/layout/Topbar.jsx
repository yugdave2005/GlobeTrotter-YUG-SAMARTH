import React, { useState, useEffect, useRef } from 'react';
import { Search, LogOut, Settings, User as UserIcon, Bell, Check, Trash2, Compass, AlertCircle, Plane, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Trip to Tokyo upcoming! 🇯🇵',
    message: 'Your Tokyo adventure begins in 3 days. Check your itinerary stops.',
    time: '10m ago',
    type: 'trip',
    unread: true,
  },
  {
    id: 2,
    title: 'Budget Alert: Paris Trip 💶',
    message: 'You have utilized 85% of your planned budget for food & activities.',
    time: '2h ago',
    type: 'budget',
    unread: true,
  },
  {
    id: 3,
    title: 'New Destination Trending 🏝️',
    message: 'Bali & Amalfi Coast have new community curated itineraries.',
    time: '1d ago',
    type: 'discover',
    unread: false,
  },
];

export const Topbar = ({ onSettingsClick, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket();

  const avatarUrl = user?.photoUrl?.startsWith('http') 
    ? user.photoUrl 
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'explorer'}`;

  const unreadCount = notifications.filter(n => n.unread).length;

  // Listen to socket live updates
  useEffect(() => {
    if (!socket) return;

    const handleStopAdded = (stop) => {
      const newNotif = {
        id: Date.now(),
        title: 'New Stop Added! 📍',
        message: `A new travel stop was added to your trip.`,
        time: 'Just now',
        type: 'trip',
        unread: true
      };
      setNotifications(prev => [newNotif, ...prev]);
      toast('📍 New stop added to your itinerary!', { icon: '✈️' });
    };

    socket.on('stop_added', handleStopAdded);
    return () => {
      socket.off('stop_added', handleStopAdded);
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('Notifications cleared');
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trip':
        return <Plane className="text-primary-500" size={16} />;
      case 'budget':
        return <AlertCircle className="text-amber-500" size={16} />;
      default:
        return <Sparkles className="text-blue-500" size={16} />;
    }
  };

  return (
    <header className="h-24 px-8 md:px-10 flex items-center justify-between relative z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search destinations, trips, activities, or budgets..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100/80 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-slate-800 text-sm font-medium transition-all"
        />
      </div>

      {/* User Actions & Notifications */}
      <div className="flex items-center space-x-4 md:space-x-5 ml-6">
        
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="w-11 h-11 rounded-full bg-white shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary-600 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="p-4 px-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell size={18} className="text-primary-400" />
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="bg-primary-500/30 text-primary-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs">
                      <button 
                        onClick={markAllAsRead} 
                        className="text-slate-300 hover:text-white transition flex items-center space-x-1"
                        title="Mark all as read"
                      >
                        <Check size={14} />
                        <span>Read all</span>
                      </button>
                      <span className="text-slate-600">|</span>
                      <button 
                        onClick={clearAllNotifications} 
                        className="text-slate-400 hover:text-red-400 transition"
                        title="Clear all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 space-y-2">
                      <Bell size={32} className="mx-auto text-slate-300 opacity-60" />
                      <p className="text-sm font-medium">All caught up!</p>
                      <p className="text-xs text-slate-400">No new notifications at this time.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleRead(item.id)}
                        className={`p-4 px-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start space-x-3.5 ${
                          item.unread ? 'bg-primary-50/20' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          {getNotificationIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                            <span className="text-[10px] text-slate-400 ml-2 shrink-0">{item.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                        {item.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <span className="text-[11px] font-medium text-slate-500">
                    Real-time trip & activity updates enabled
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl hover:shadow-md transition-shadow border-2 border-white hover:border-primary-200 overflow-hidden ring-2 ring-slate-100"
          >
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2.5"
              >
                <div className="px-5 py-3 border-b border-slate-50 mb-1 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Explorer'}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onSettingsClick();
                  }}
                  className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={17} className="mr-3 text-slate-400" />
                  Settings & Avatar
                </button>
                
                <div className="h-px bg-slate-100 my-1.5" />
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={17} className="mr-3 text-red-400" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

