import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, Cpu, BookOpen } from 'lucide-react';

const HowItWorks = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="bg-medical-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center"><BookOpen className="mr-3" /> Architecture & Machine Learning Guide</h1>
        <p className="opacity-90 text-lg">A complete breakdown of how the MedAnalytics AI pipeline processes your data, trains models, and generates insights.</p>
      </div>

      <Section title="1. Workflow & File Architecture" icon={Network}>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg">When you upload a dataset, the system executes a powerful automated pipeline:</p>
          <ul className="list-none space-y-4 mt-4">
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <strong className="text-medical-600 dark:text-medical-400 text-lg">Step 1: Upload (Frontend &rarr; Backend)</strong><br/>
              <span className="text-sm text-gray-500 font-mono">Location: backend/routes/endpoints.py</span><br/>
              The React frontend sends the CSV/Excel file safely to the FastAPI backend where it is stored in the <code>uploads/</code> folder.
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <strong className="text-medical-600 dark:text-medical-400 text-lg">Step 2: Data Cleaning (Pandas)</strong><br/>
              <span className="text-sm text-gray-500 font-mono">Location: backend/services/pipeline.py</span><br/>
              The backend uses the Pandas data science library to read the file. It drops duplicate rows, removes empty/corrupted data, and automatically standardizes all date and time formats.
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <strong className="text-medical-600 dark:text-medical-400 text-lg">Step 3: Metrics Generation</strong><br/>
              <span className="text-sm text-gray-500 font-mono">Location: backend/analytics/generate_metrics.py</span><br/>
              The engine calculates KPIs (busiest days, wait times, revenue) and generates complex JSON configurations that tell Plotly how to render the interactive charts on the frontend.
            </li>
            <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <strong className="text-medical-600 dark:text-medical-400 text-lg">Step 4: Machine Learning Pipeline</strong><br/>
              <span className="text-sm text-gray-500 font-mono">Location: backend/ml/model.py</span><br/>
              The data is aggregated into a daily timeline. The AI engineers new mathematical features, trains a prediction model, evaluates its accuracy, and saves it to disk (<code>models/patient_predictor.joblib</code>).
            </li>
          </ul>
        </div>
      </Section>

      <Section title="2. The Machine Learning Model Explained" icon={Cpu}>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg"><strong>Algorithm: Random Forest Regressor</strong></p>
          <p>We use a Random Forest because it is highly accurate, handles non-linear patterns (like weekly hospital seasonality), and requires very little hyperparameter tuning compared to Neural Networks. It solves the problem of predicting how many patients will arrive on a given day based on historical trends.</p>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-4 shadow-sm">
            <h4 className="font-bold text-medical-600 text-xl mb-2">What is "Trees (n_estimators)"?</h4>
            <p className="mb-3">A Random Forest works by generating a "forest" of many individual Decision Trees. Each tree independently analyzes the data and makes its own prediction. The forest then averages all of their answers together to get a final, highly accurate result.</p>
            <p><strong>How many should there be?</strong> We use <strong>100 trees</strong>. If you use too few (e.g., 5), the model is highly inaccurate. If you use too many (e.g., 5,000), it takes too long to train and uses too much memory without adding much benefit. 100 to 200 is the industry standard "sweet spot" for this type of data.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-4 shadow-sm">
            <h4 className="font-bold text-medical-600 text-xl mb-2">What is "Feature Importance"?</h4>
            <p>Feature importance tells us exactly <strong>which piece of data had the biggest impact</strong> on the final prediction. For example, if "day_of_week" has a 60% importance, it means knowing whether it's a Monday or a Sunday is the single most crucial factor in predicting patient volume. It helps hospital administrators understand the <em>"Why"</em> behind the AI's prediction.</p>
          </div>
        </div>
      </Section>

      <Section title="3. Dataset Guidelines & CSV Customization" icon={Database}>
         <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg">For the most rich dashboard experience, your CSV/Excel file should ideally contain columns like: <code>Date, Status, Waiting Time, Consultation Duration, Department, Doctor, Patient Age, Gender, Revenue.</code></p>
          
          <div className="bg-medical-50 dark:bg-medical-900/20 p-6 rounded-lg border border-medical-100 dark:border-medical-800">
             <h4 className="font-bold text-xl mb-3 text-medical-700 dark:text-medical-300">Where to change CSV column names?</h4>
             <p className="mb-3">You actually don't need your CSV to perfectly match our code! The system uses a "Fuzzy Matching" algorithm to find your columns automatically.</p>
             <p className="mb-3">However, if you have very strange column names in your CSV and want to teach the code to recognize them, open this file:</p>
             <p className="font-mono text-sm bg-gray-200 dark:bg-gray-800 p-2 rounded mb-3">backend/analytics/generate_metrics.py</p>
             <p>Look for the <code>find_col(...)</code> functions. For example, to match a column named "Time Spent", you can just add 'spent' to the keyword list like this:</p>
             <p className="font-mono text-sm bg-white dark:bg-black p-3 rounded mt-2 border border-gray-300 dark:border-gray-700">
               consult_col = find_col(['consult', 'duration', 'spent'])
             </p>
          </div>
        </div>
      </Section>

    </motion.div>
  );
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="glass-panel p-8">
    <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
      <Icon className="mr-3 text-medical-500" size={32} /> {title}
    </h2>
    {children}
  </div>
);

export default HowItWorks;
