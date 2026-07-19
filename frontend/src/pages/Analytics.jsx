import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { getCharts } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCharts().then(res => {
      setCharts(res.data);
      setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (Object.keys(charts).length === 0) {
    return <div className="text-center mt-20 text-gray-500">No chart data available. Please upload a dataset.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-full pb-10">
      <h1 className="text-3xl font-bold mb-6">Detailed Analytics</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {Object.entries(charts).map(([key, chartData]) => {
          let parsedData = typeof chartData === 'string' ? JSON.parse(chartData) : chartData;
          return (
            <div key={key} className="glass-panel p-4 flex flex-col items-center justify-center overflow-hidden w-full">
              <div className="w-full h-[400px]">
                <Plot
                  data={parsedData.data}
                  layout={{
                    ...parsedData.layout,
                    autosize: true,
                    margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: 'inherit' }
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Analytics;
