import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SettingsModal } from '../SettingsModal';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const DashboardLayout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth and fetch user profile
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/auth/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) return null; // Or a loading spinner

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          user={user} 
          onSettingsClick={() => setIsSettingsOpen(true)} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-1 overflow-y-auto px-10 pb-10">
          <Outlet context={{ user, onUserUpdate: handleUserUpdate, onUpdateUser: handleUserUpdate }} />
        </main>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user}
        onUpdate={handleUserUpdate}
      />
    </div>
  );
};
