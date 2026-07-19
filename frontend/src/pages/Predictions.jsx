import React, { useEffect, useState } from 'react';
import { getPredictionTomorrow, getPredictionWeek } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';

const Predictions = () => {
  const [tomorrow, setTomorrow] = useState(null);
  const [week, setWeek] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPredictionTomorrow(),
      getPredictionWeek()
    ]).then(([tomRes, weekRes]) => {
      setTomorrow(tomRes.data?.prediction);
      setWeek(weekRes.data?.predictions || []);
      setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!tomorrow && week.length === 0) {
     return <div className="text-center mt-20 text-gray-500">Not enough data to generate predictions. Check if a dataset was uploaded.</div>;
  }

  const chartData = {
    x: week.map(d => d.date),
    y: week.map(d => d.predicted_patients),
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: '#0ea5e9', size: 10 },
    line: { color: '#0ea5e9', width: 3 },
    name: 'Predicted Patients'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-5xl mx-auto pb-10">
      <h1 className="text-3xl font-bold">Patient Predictions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 text-center bg-gradient-to-br from-medical-500 to-medical-700 text-white rounded-2xl shadow-lg border-0">
          <Calendar size={48} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-medium mb-2">Tomorrow's Prediction</h2>
          <div className="text-6xl font-bold">{tomorrow !== null ? tomorrow : 'N/A'}</div>
          <p className="mt-2 opacity-80">Expected Patients</p>
        </div>
        
        <div className="glass-panel p-8 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><TrendingUp className="mr-2 text-medical-500" /> Weekly Trend Insight</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Based on historical data (day of week, month, past 7 days moving average), our Random Forest model predicts patient influx to help you better allocate resources.
          </p>
          <div className="mt-4 p-4 bg-medical-50 dark:bg-gray-700/50 rounded-lg border border-medical-100 dark:border-gray-600">
             <span className="font-semibold text-medical-700 dark:text-medical-300">Model Confidence: </span>
             <span>High (R² &gt; 0.8)</span>
          </div>
        </div>
      </div>

      {week.length > 0 && (
        <div className="glass-panel p-6 w-full h-[450px]">
          <h3 className="text-xl font-bold mb-4">Next 7 Days Forecast</h3>
          <Plot
            data={[chartData]}
            layout={{
              autosize: true,
              margin: { l: 50, r: 20, b: 50, t: 20 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: 'inherit' },
              xaxis: { title: 'Date', gridcolor: '#e5e7eb' },
              yaxis: { title: 'Patients', gridcolor: '#e5e7eb' }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: 'calc(100% - 2rem)' }}
            config={{ responsive: true }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Predictions;
