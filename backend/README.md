# AI-Powered Hospital Analytics Dashboard - Backend

This is a complete production-ready FastAPI backend. It supports uploading an Excel or CSV file and running it through a full data science and ML pipeline.

## Features
- **Data Cleaning**: Handled via Pandas.
- **Analytics**: Calculates a wide variety of metrics (busiest doctor, waiting time, revenue, etc.).
- **Visualizations**: Auto-generates Plotly chart data structures stored in JSON.
- **Machine Learning**: Predicts daily patient count using a Random Forest Regressor and features like previous day/week averages. Prints out MAE, MSE, RMSE, R² Score, and Feature Importance.

## Run
```bash
pip install -r requirements.txt
uvicorn app:app --reload
```
Navigate to `http://127.0.0.1:8000/docs` for the interactive API docs.
