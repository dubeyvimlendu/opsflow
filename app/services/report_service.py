from app.repositories import report_repository
from app.schemas.report import (
    DataQualityReport,
    DepartmentStats,
    JoiningYearCount,
    SalaryAnalysis,
    SalaryBucket,
    StatusCount,
    WorkforceOverview,
)

DATA_QUALITY_NOTES = [
    "Duplicate emails cannot occur: the employees table enforces a UNIQUE "
    "constraint on email.",
    "Historical import success/failure trends are not available. The "
    "current import pipeline only writes the latest run's results to "
    "data/validation_errors.csv and data/employees_processed.csv on disk — "
    "these are overwritten on every import and are not queryable from the "
    "database. Persisting each import as a row in a new import_runs table "
    "(timestamp, filename, total/valid/invalid/inserted/duplicate counts) "
    "would let this section report real trends over time.",
]


def get_workforce_overview() -> WorkforceOverview:
    return WorkforceOverview(
        total_employees=report_repository.get_total_employee_count(),
        total_departments=report_repository.get_total_department_count(),
        status_breakdown=[
            StatusCount(**row) for row in report_repository.get_status_breakdown()
        ],
    )


def get_department_analysis() -> list[DepartmentStats]:
    return [DepartmentStats(**row) for row in report_repository.get_department_stats()]


def get_salary_analysis() -> SalaryAnalysis:
    summary = report_repository.get_salary_summary()

    if summary is None:
        return SalaryAnalysis(
            average_salary=0,
            minimum_salary=0,
            maximum_salary=0,
            distribution=[],
        )

    distribution = [
        SalaryBucket(**row) for row in report_repository.get_salary_distribution()
    ]
    return SalaryAnalysis(**summary, distribution=distribution)


def get_joining_trends() -> list[JoiningYearCount]:
    return [
        JoiningYearCount(**row) for row in report_repository.get_joining_year_counts()
    ]


def get_status_analysis() -> list[StatusCount]:
    return [StatusCount(**row) for row in report_repository.get_status_breakdown()]


def get_data_quality() -> DataQualityReport:
    return DataQualityReport(
        total_employees=report_repository.get_total_employee_count(),
        employees_with_future_joining_date=report_repository.get_future_joining_date_count(),
        employees_with_non_positive_salary=report_repository.get_non_positive_salary_count(),
        distinct_status_values=report_repository.get_distinct_status_count(),
        notes=DATA_QUALITY_NOTES,
    )
