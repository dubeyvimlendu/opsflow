from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.employees import router as employee_router
from app.api.reports import router as reports_router


app = FastAPI(
    title="OpsFlow API",
    description="Employee operations and data processing API",
    version="1.0.0",
)


# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Routers
# -------------------------

app.include_router(employee_router)
app.include_router(reports_router)


# -------------------------
# Health Check
# -------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "opsflow",
    }