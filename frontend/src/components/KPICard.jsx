import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-6 flex items-center space-x-4"
  >
    <div className="p-3 rounded-lg bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400">
      <Icon size={28} />
    </div>
    <div>
      <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value !== undefined && value !== null ? value : 'N/A'}</p>
    </div>
  </motion.div>
);

export default KPICard;
