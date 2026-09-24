from fastapi import APIRouter

from app.schemas.report import (
    DataQualityReport,
    DepartmentStats,
    JoiningYearCount,
    SalaryAnalysis,
    StatusCount,
    WorkforceOverview,
)
from app.services import report_service


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


@router.get("/overview", response_model=WorkforceOverview)
def workforce_overview():
    return report_service.get_workforce_overview()


@router.get("/departments", response_model=list[DepartmentStats])
def department_analysis():
    return report_service.get_department_analysis()


@router.get("/salary", response_model=SalaryAnalysis)
def salary_analysis():
    return report_service.get_salary_analysis()


@router.get("/joining-trends", response_model=list[JoiningYearCount])
def joining_trends():
    return report_service.get_joining_trends()


@router.get("/status", response_model=list[StatusCount])
def status_analysis():
    return report_service.get_status_analysis()


@router.get("/data-quality", response_model=DataQualityReport)
def data_quality():
    return report_service.get_data_quality()
