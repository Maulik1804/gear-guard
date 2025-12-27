"""
FastAPI Application for GearGuard
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="GearGuard API",
    description="The Ultimate Maintenance Tracker API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to GearGuard API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Import routers
from api.routers import (
    companies, users, employees, teams, locations, 
    work_centers, equipment, work_orders, tasks, maintenance_schedules
)

# Include routers
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(locations.router, prefix="/api/locations", tags=["Locations"])
app.include_router(work_centers.router, prefix="/api/work-centers", tags=["Work Centers"])
app.include_router(equipment.router, prefix="/api/equipment", tags=["Equipment"])
app.include_router(work_orders.router, prefix="/api/work-orders", tags=["Work Orders"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(maintenance_schedules.router, prefix="/api/maintenance-schedules", tags=["Maintenance Schedules"])


if __name__ == "__main__":
    import uvicorn
    import sys
    
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    # Allow command line arguments
    if len(sys.argv) > 1:
        if "--no-reload" in sys.argv:
            reload = False
        if "--port" in sys.argv:
            idx = sys.argv.index("--port")
            if idx + 1 < len(sys.argv):
                port = int(sys.argv[idx + 1])
        if "--host" in sys.argv:
            idx = sys.argv.index("--host")
            if idx + 1 < len(sys.argv):
                host = sys.argv[idx + 1]
    
    uvicorn.run(app, host=host, port=port, reload=reload)

