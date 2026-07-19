import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Predictions from './pages/Predictions';
import ModelMetrics from './pages/ModelMetrics';
import UploadDataset from './pages/UploadDataset';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="model-metrics" element={<ModelMetrics />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="upload" element={<UploadDataset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
