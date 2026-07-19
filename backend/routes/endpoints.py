from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from services.pipeline import process_data

router = APIRouter()

# In-memory storage for the latest processed data results
latest_results = {
    "metrics": {},
    "analytics": {},
    "charts": {},
    "predictions": {
        "tomorrow": None,
        "week": []
    }
}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Step 1: Store the uploaded file inside uploads/.
    """
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are allowed.")
    
    file_location = f"uploads/{file.filename}"
    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        
        # Trigger the pipeline (Pandas -> Cleaning -> Analytics -> ML -> Predictions)
        results = process_data(file_location)
        
        # Update latest results cache
        latest_results["metrics"] = results.get("metrics", {})
        latest_results["analytics"] = results.get("analytics", {})
        latest_results["charts"] = results.get("charts", {})
        latest_results["predictions"] = results.get("predictions", {})
        
        return {"message": "File uploaded and processed successfully.", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
def get_metrics():
    """Return key metrics."""
    return latest_results["metrics"]

@router.get("/analytics")
def get_analytics():
    """Return detailed analytics."""
    return latest_results["analytics"]

@router.get("/charts")
def get_charts():
    """Return chart JSON configurations for frontend Plotly integration."""
    return latest_results["charts"]

@router.get("/prediction/tomorrow")
def get_prediction_tomorrow():
    """Return predictions for tomorrow."""
    return {"prediction": latest_results["predictions"].get("tomorrow")}

@router.get("/prediction/week")
def get_prediction_week():
    """Return predictions for the next week."""
    return {"predictions": latest_results["predictions"].get("week", [])}

@router.get("/model_metrics")
def get_model_metrics():
    """Return the dynamic model evaluation metrics."""
    return latest_results["predictions"].get("evaluation", {})
