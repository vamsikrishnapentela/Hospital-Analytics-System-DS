import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Cpu, Target, Hash, CheckSquare, AlertCircle } from 'lucide-react';

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelMetrics().then(res => {
      setMetrics(res.data);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="text-center mt-20 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">No Model Data</h2>
        <p className="text-gray-500 mt-2 text-lg">Please upload a dataset to train the model and generate metrics.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl mx-auto pb-10">
      <h1 className="text-3xl font-bold mb-6">Model Evaluation Metrics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="MAE" value={metrics.MAE} icon={Target} color="text-blue-500" />
        <MetricCard title="MSE" value={metrics.MSE} icon={Target} color="text-red-500" />
        <MetricCard title="RMSE" value={metrics.RMSE} icon={Target} color="text-orange-500" />
        <MetricCard title="R² Score" value={metrics.R2} icon={CheckSquare} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
           <h3 className="text-xl font-bold mb-4 flex items-center"><Cpu className="mr-2" /> Model Configuration</h3>
           <ul className="space-y-3">
             <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
               <span className="text-gray-500">Algorithm</span>
               <span className="font-semibold">Random Forest Regressor</span>
             </li>
             <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
               <span className="text-gray-500">Trees (n_estimators)</span>
               <span className="font-semibold">100</span>
             </li>
             <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
               <span className="text-gray-500">Train/Test Split</span>
               <span className="font-semibold">80% / 20%</span>
             </li>
             <li className="flex justify-between pb-2">
               <span className="text-gray-500">Target Variable</span>
               <span className="font-semibold">Daily Patient Count</span>
             </li>
           </ul>
        </div>
        
        <div className="glass-panel p-6">
           <h3 className="text-xl font-bold mb-4 flex items-center"><Hash className="mr-2" /> Feature Importance</h3>
           <div className="space-y-4">
             {metrics.feature_importance && Object.entries(metrics.feature_importance).map(([feature, importance]) => (
               <FeatureBar key={feature} name={feature} val={importance} />
             ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
    <Icon size={32} className={`mb-3 ${color}`} />
    <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold">{value !== undefined ? value : 'N/A'}</div>
  </div>
);

const FeatureBar = ({ name, val }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-gray-700 dark:text-gray-300">{name}</span>
      <span className="font-semibold">{val}%</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div className="bg-medical-500 h-2.5 rounded-full" style={{ width: `${val}%` }}></div>
    </div>
  </div>
);

export default ModelMetrics;
