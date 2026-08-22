import React, { useState, useEffect, useRef } from 'react';
import { Search, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const Topbar = ({ onSettingsClick, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const avatarUrl = user?.photoUrl?.startsWith('http') 
    ? user.photoUrl 
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'explorer'}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-24 px-10 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for destinations, trips, activities..." 
          className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-700 font-medium"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-6 ml-8">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
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
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2"
              >
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Explorer'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <UserIcon size={16} className="mr-3 text-gray-400" />
                  My Profile
                </button>
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onSettingsClick();
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} className="mr-3 text-gray-400" />
                  Settings
                </button>
                
                <div className="h-px bg-gray-50 my-2" />
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-3 text-red-400" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
