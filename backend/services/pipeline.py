import pandas as pd
from analytics.generate_metrics import generate_analytics_and_charts
from ml.model import train_and_predict

# ==========================================
# FLOW HIGHLIGHT:
# CSV Upload
#       │
#       ▼
# Pandas
#       │
#       ▼
# Cleaning
#       │
#       ▼
# Analytics
#       │
#       ▼
# Machine Learning
#       │
#       ▼
# Predictions
#       │
#       ▼
# Frontend Dashboard
# ==========================================

def process_data(file_path: str):
    """
    Main orchestration function that handles the entire data pipeline.
    """
    
    # Step 2: Read the file using Pandas
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
        
    # Step 3: Clean the data
    df_cleaned = clean_data(df)
    
    # Step 4: Generate analytics & charts
    metrics, analytics, charts = generate_analytics_and_charts(df_cleaned)
    
    # Step 5: Machine Learning predictions
    predictions = train_and_predict(df_cleaned)
    
    return {
        "metrics": metrics,
        "analytics": analytics,
        "charts": charts,
        "predictions": predictions
    }

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the uploaded dataset based on predefined rules.
    """
    # 1. Remove duplicates
    df = df.drop_duplicates()
    
    # 2. Handle missing values 
    df = df.dropna(how='all')
    
    # Standardize column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    
    # 3. Convert date columns
    if 'appointment_date' in df.columns:
        df['appointment_date'] = pd.to_datetime(df['appointment_date'], errors='coerce')
        
    # 4. Convert time columns
    if 'appointment_time' in df.columns:
        df['appointment_time'] = pd.to_datetime(df['appointment_time'], format='%H:%M', errors='coerce').dt.time
        
    # 5. Validate columns & 6. Remove invalid records
    # Remove records where critical fields (like date) couldn't be parsed (NaT)
    if 'appointment_date' in df.columns:
        df = df.dropna(subset=['appointment_date'])
        
    return df
