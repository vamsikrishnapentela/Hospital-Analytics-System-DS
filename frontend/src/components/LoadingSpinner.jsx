import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64 space-y-4">
    <motion.div
      className="w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <p className="text-medical-600 font-medium">Processing Data...</p>
  </div>
);

export default LoadingSpinner;
