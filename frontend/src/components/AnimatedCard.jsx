import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};
