# AI-Powered Hospital Analytics Dashboard

This is a full-stack, AI-driven platform for hospital analytics, data processing, and machine learning predictions. It empowers healthcare administrators with data-driven insights through dynamic visualizations and predictive modeling.

## 🚀 Live Links
- **Frontend (Vercel):** [https://hospital-analytics-system-ds.vercel.app/](https://hospital-analytics-system-ds.vercel.app/)
- **Backend (Render):** [https://hospital-analytics-system-ds.onrender.com](https://hospital-analytics-system-ds.onrender.com)

---

## 🛠️ Tech Stack & Technologies Used

### Frontend (Client-Side)
- **React.js & Vite:** Used for building a blazing fast, modern single-page application.
- **Tailwind CSS:** For highly responsive, utility-first styling and beautiful UI components.
- **Framer Motion:** Adds smooth, professional micro-interactions and animations to the UI.
- **Axios:** Handles asynchronous HTTP requests to our FastAPI backend.
- **React Router:** Manages client-side routing between Analytics, Upload, and Prediction pages.

### Backend (Server-Side)
- **Python & FastAPI:** Provides a high-performance, asynchronous REST API architecture.
- **Pandas & NumPy:** For robust data wrangling, cleaning, and transformation of hospital CSV/Excel datasets.
- **Scikit-Learn:** Powers the machine learning pipeline (Random Forest Regressor) for predicting patient metrics.
- **Plotly:** Generates interactive, complex data visualizations directly from the Python backend and sends them to the frontend.
- **Uvicorn:** ASGI web server used to run the FastAPI application.

---

## ⚙️ Application Flow & Step-by-Step Breakdown

### 1. Data Upload (Upload Dataset Page)
- **What it does:** Allows users to upload hospital records in CSV or Excel format.
- **Why it matters:** Raw data is the foundation of analytics. By standardizing the upload process, we ensure data integrity.
- **How it works:** The frontend uses a drag-and-drop interface. The file is sent via Axios `multipart/form-data` to the FastAPI backend, which saves it temporarily and validates the columns using Pandas.

### 2. Data Processing & Visualization (Analytics Page)
- **What it does:** Displays interactive charts (like patient admissions over time, department breakdowns) based on the uploaded data.
- **Why it matters:** Visual representation helps hospital admins spot trends, bottlenecks, and operational inefficiencies at a glance.
- **How it works:** The backend utilizes Plotly to generate JSON chart configurations from the dataset. The React frontend receives this JSON and renders fully interactive charts natively in the browser.

### 3. Machine Learning Predictions (Predictions Page)
- **What it does:** Predicts future hospital metrics (like expected admissions for tomorrow or next week).
- **Why it matters:** Enables proactive resource allocation, staff scheduling, and inventory management for the hospital.
- **How it works:** Our `Scikit-Learn` Random Forest model is trained on historical data. When a prediction is requested, FastAPI passes the current data state into the model, generates a forecast, and returns the insights to the frontend.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd hospital_analytics
```

### 2. Run the Backend (FastAPI)
Open a terminal and navigate to the backend folder:
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app:app --host 0.0.0.0 --port 10000 --reload
```
The API will run at `http://localhost:10000`. You can view the docs at `http://localhost:10000/docs`.

### 3. Run the Frontend (React)
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will run at `http://localhost:5173`. 

*(Note: The frontend is configured to automatically detect whether it is running locally or in production, so you don't need any `.env` files for the API connection!)*
