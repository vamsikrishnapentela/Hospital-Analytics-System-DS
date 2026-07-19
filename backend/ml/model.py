import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def train_and_predict(df: pd.DataFrame):
    """
    Train a Random Forest model to predict daily patient count.
    Splits 80/20. Prints eval metrics and feature importances.
    """
    # Try to find date column
    date_col = None
    for col in df.columns:
        if 'date' in col.lower():
            date_col = col
            break
            
    if not date_col:
        return {"error": "appointment_date column missing."}
    
    # 1. Create daily aggregated dataset automatically
    daily_counts = df.groupby(df[date_col].dt.date).size().reset_index(name='patient_count')
    daily_counts[date_col] = pd.to_datetime(daily_counts['index'] if 'index' in daily_counts.columns else daily_counts[date_col])
    daily_counts = daily_counts.sort_values(date_col).reset_index(drop=True)
    
    if len(daily_counts) < 8:
        return {"error": "Not enough data for ML prediction."}
    
    # 2. Features: day of week, month, prev day appointments, prev week average
    daily_counts['day_of_week'] = daily_counts[date_col].dt.dayofweek
    daily_counts['month'] = daily_counts[date_col].dt.month
    
    daily_counts['prev_day_count'] = daily_counts['patient_count'].shift(1)
    daily_counts['prev_week_avg'] = daily_counts['patient_count'].shift(1).rolling(window=7, min_periods=1).mean()
    
    # Drop rows with NaN due to shifting
    dataset = daily_counts.dropna().copy()
    
    if len(dataset) < 4:
        return {"error": "Dataset too small after feature engineering."}
    
    X = dataset[['day_of_week', 'month', 'prev_day_count', 'prev_week_avg']]
    y = dataset['patient_count']
    
    # 3. Split 80 / 20
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # 4. Train model (Random Forest Regressor)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Feature Importance
    importance = model.feature_importances_
    features = X.columns
    feature_imp = {feat: round(float(imp) * 100, 2) for feat, imp in zip(features, importance)}
    
    # 5. Save Model
    joblib.dump(model, 'models/patient_predictor.joblib')
    
    # 6. Predict Tomorrow (Using actual real-world dates for the UI, but using last known data for features)
    last_record = dataset.iloc[-1]
    
    # We will use today's actual date so the UI shows current dates
    actual_today = pd.Timestamp.now().normalize()
    actual_tomorrow = actual_today + pd.Timedelta(days=1)
    
    tomorrow_features = pd.DataFrame([{
        'day_of_week': actual_tomorrow.dayofweek,
        'month': actual_tomorrow.month,
        'prev_day_count': last_record['patient_count'],
        'prev_week_avg': dataset['patient_count'].tail(7).mean()
    }])
    
    pred_tomorrow = model.predict(tomorrow_features)[0]
    
    # 7. Predict Week
    week_predictions = []
    current_date = actual_tomorrow
    current_prev_day = last_record['patient_count']
    recent_counts = list(dataset['patient_count'].tail(7))
    
    for _ in range(7):
        current_prev_week_avg = np.mean(recent_counts)
        feats = pd.DataFrame([{
            'day_of_week': current_date.dayofweek,
            'month': current_date.month,
            'prev_day_count': current_prev_day,
            'prev_week_avg': current_prev_week_avg
        }])
        
        pred = model.predict(feats)[0]
        week_predictions.append({
            "date": current_date.strftime('%Y-%m-%d'),
            "predicted_patients": round(pred)
        })
        
        # update state
        current_date += pd.Timedelta(days=1)
        current_prev_day = pred
        recent_counts.append(pred)
        recent_counts.pop(0)
    
    return {
        "tomorrow": round(pred_tomorrow),
        "week": week_predictions,
        "evaluation": {
            "MAE": round(mae, 2), "MSE": round(mse, 2), "RMSE": round(rmse, 2), "R2": round(r2, 2),
            "feature_importance": feature_imp
        }
    }
