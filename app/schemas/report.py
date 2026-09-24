"""
Pydantic response schemas for the Stage 3 reports module.

Design notes, now grounded in the real `employees` table
(employee_code, first_name, last_name, email, department, designation,
salary, joining_date, status, created_at, updated_at — all NOT NULL,
email and employee_code UNIQUE):

- WorkforceOverview does not hard-code "active"/"inactive"/"on-leave"
  fields, because `status` is a plain VARCHAR(20) with no CHECK
  constraint. It exposes a dynamic status_breakdown instead (same
  shape as /api/reports/status), so the frontend renders whatever
  status values actually exist in the database.
- DataQualityReport only reports what the current schema can actually
  support:
    - employees_with_future_joining_date: a joining_date in the future
      is a plausible data-entry error the DB doesn't prevent.
    - employees_with_non_positive_salary: the API validates salary > 0,
      but the DB column has no CHECK constraint, so this checks for it
      directly as a defense-in-depth signal.
    - distinct_status_values: surfaces inconsistent spellings/casing
      (e.g. "Active" vs "active") since status isn't an enum.
  It deliberately has no historical import-success fields and no
  duplicate-email field: email duplicates are impossible (UNIQUE
  constraint), and there is no import-history table to compute trends
  from — `notes` documents both of those explicitly instead of
  inventing numbers.
"""

from pydantic import BaseModel


class StatusCount(BaseModel):
    status: str
    count: int


class WorkforceOverview(BaseModel):
    total_employees: int
    total_departments: int
    status_breakdown: list[StatusCount]


class DepartmentStats(BaseModel):
    department: str
    employee_count: int
    average_salary: float
    minimum_salary: float
    maximum_salary: float


class SalaryBucket(BaseModel):
    range: str
    count: int


class SalaryAnalysis(BaseModel):
    average_salary: float
    minimum_salary: float
    maximum_salary: float
    distribution: list[SalaryBucket]


class JoiningYearCount(BaseModel):
    year: int
    count: int


class DataQualityReport(BaseModel):
    total_employees: int
    employees_with_future_joining_date: int
    employees_with_non_positive_salary: int
    distinct_status_values: int
    notes: list[str]
