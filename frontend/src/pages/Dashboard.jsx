import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, Calendar, Activity } from 'lucide-react';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMetrics, getPredictionTomorrow } from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, predRes] = await Promise.all([
          getMetrics(),
          getPredictionTomorrow()
        ]);
        setMetrics(metricsRes.data || {});
        setPrediction(predRes.data?.prediction);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please upload a dataset first.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error || Object.keys(metrics).length === 0) {
    return (
      <div className="text-center mt-20 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Activity size={48} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">No Data Available</h2>
        <p className="text-gray-500 mt-2 text-lg">Please go to Upload Dataset to process your data and run the AI models.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      <h1 className="text-3xl font-bold">Hospital Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Appointments" value={metrics.total_appointments} icon={Users} />
        <KPICard title="Completed" value={metrics.completed_appointments} icon={CheckCircle} />
        <KPICard title="Cancelled" value={metrics.cancelled_appointments} icon={XCircle} />
        <KPICard title="Follow Up Rate" value={metrics.follow_up_rate ? `${metrics.follow_up_rate.toFixed(1)}%` : 'N/A'} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Avg Waiting Time" 
          value={metrics.average_waiting_time ? `${metrics.average_waiting_time.toFixed(0)} min` : 'N/A'} 
          icon={Clock} 
        />
        <KPICard 
          title="Avg Consultation" 
          value={metrics.average_consultation_duration ? `${metrics.average_consultation_duration.toFixed(0)} min` : 'N/A'} 
          icon={Clock} 
        />
        <KPICard 
          title="Tomorrow's Prediction" 
          value={prediction !== undefined && prediction !== null ? `${prediction} patients` : 'N/A'} 
          icon={Calendar} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4">Busiest Metrics</h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                 <span className="text-gray-500">Busiest Weekday</span>
                 <span className="font-semibold">{metrics.busiest_weekday || 'N/A'}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                 <span className="text-gray-500">Busiest Month</span>
                 <span className="font-semibold">{metrics.busiest_month || 'N/A'}</span>
              </li>
              <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                 <span className="text-gray-500">Busiest Department</span>
                 <span className="font-semibold">{metrics.busiest_department || 'N/A'}</span>
              </li>
              <li className="flex justify-between pb-2">
                 <span className="text-gray-500">Busiest Doctor</span>
                 <span className="font-semibold">{metrics.busiest_doctor || 'N/A'}</span>
              </li>
            </ul>
         </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
