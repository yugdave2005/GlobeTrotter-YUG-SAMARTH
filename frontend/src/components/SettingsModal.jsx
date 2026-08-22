import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import api from '../utils/api';
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

export const SettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const seed = user?.email || 'explorer';
  const defaultUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  
  const [selectedStyleUrl, setSelectedStyleUrl] = useState(
    user?.photoUrl?.startsWith('http') ? user.photoUrl : defaultUrl
  );
  
  const [loading, setLoading] = useState(false);

  // Sync state when user prop changes
  React.useEffect(() => {
    if (user?.photoUrl?.startsWith('http')) {
      setSelectedStyleUrl(user.photoUrl);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { photoUrl: selectedStyleUrl });
      onUpdate(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Avatar updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-sm text-gray-500 mb-8">Customize your GlobeTrotter profile.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Choose a default generated avatar style</label>
              
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-primary-100 flex items-center justify-center shadow-inner overflow-hidden">
                  <img src={selectedStyleUrl} alt="Selected Avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {AVATAR_STYLES.map((style) => {
                  const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
                  const isSelected = selectedStyleUrl === url;
                  
                  return (
                    <button
                      key={style}
                      onClick={() => setSelectedStyleUrl(url)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all overflow-hidden ${
                        isSelected 
                          ? 'bg-primary-50 border-2 border-primary-500 shadow-md scale-110 z-10' 
                          : 'bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={style} className="w-12 h-12" />
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full flex items-center justify-center bg-primary-600 text-white font-medium py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'} <Check size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
