from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.endpoints import router
import os

app = FastAPI(
    title="AI-Powered Hospital Analytics Dashboard API",
    description="Backend API for Hospital Analytics, Data Processing, and Predictions",
    version="1.0.0"
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories at startup
directories = ["uploads", "datasets", "charts", "models"]
for directory in directories:
    os.makedirs(directory, exist_ok=True)

# Include the main API router
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Hospital Analytics Dashboard API"}
