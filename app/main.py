from fastapi import FastAPI

from app.api.employees import router as employee_router


app = FastAPI(
    title="OpsFlow API",
    description=(
        "Employee operations and data processing API"
    ),
    version="1.0.0",
)


app.include_router(
    employee_router
)


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "opsflow",
    }