import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://hospital-analytics-system-ds.onrender.com' 
    : 'http://localhost:10000',
});

export const getMetrics = () => api.get('/metrics');
export const getAnalytics = () => api.get('/analytics');
export const getCharts = () => api.get('/charts');
export const getPredictionTomorrow = () => api.get('/prediction/tomorrow');
export const getPredictionWeek = () => api.get('/prediction/week');
export const getModelMetrics = () => api.get('/model_metrics');
export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
