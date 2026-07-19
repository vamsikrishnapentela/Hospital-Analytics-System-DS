import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Activity, UploadCloud, Cpu, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/predictions', label: 'Predictions', icon: Activity },
  { path: '/model-metrics', label: 'Model Metrics', icon: Cpu },
  { path: '/how-it-works', label: 'How It Works', icon: BookOpen },
  { path: '/upload', label: 'Upload Dataset', icon: UploadCloud },
];

const Sidebar = ({ isOpen }) => {
  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 z-10"
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <Activity className="text-medical-600 shrink-0" size={28} />
        {isOpen && <span className="ml-3 font-bold text-lg text-medical-700 dark:text-medical-400 whitespace-nowrap">MedAnalytics AI</span>}
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={22} className="shrink-0" />
            {isOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
