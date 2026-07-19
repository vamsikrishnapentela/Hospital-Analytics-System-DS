import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDataset } from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      await uploadDataset(file);
      setStatus('success');
      setMsg('Dataset processed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.detail || 'An error occurred during processing.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto mt-6 md:mt-10 pb-10">
      <div className="glass-panel p-6 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload Hospital Dataset</h1>
        <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Upload a CSV or Excel file containing your appointment records.</p>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 md:p-12 transition-colors ${file ? 'border-medical-500 bg-medical-50 dark:bg-medical-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <File size={48} className="text-medical-500 mb-4" />
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center cursor-pointer">
              <UploadCloud size={48} className="text-gray-400 mb-4" />
              <p className="font-semibold text-gray-700 dark:text-gray-300">Click or drag file to this area to upload</p>
              <p className="text-sm text-gray-500 mt-2">Supports CSV and Excel files for analytics processing.</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-medical-600 hover:bg-medical-700 shadow-lg shadow-medical-500/30'}`}
          >
            {uploading ? 'Processing Dataset (This may take a minute)...' : 'Run Data Pipeline'}
          </button>
        </div>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center justify-center">
            <CheckCircle className="mr-2" /> {msg}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center justify-center">
            <AlertCircle className="mr-2" /> {msg}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadDataset;
