from fastapi import HTTPException, status

from app.repositories.employee_repository import (
    create_employee,
    get_all_employees,
    get_employee_by_code,
)
from app.schemas.employee import EmployeeCreate


def list_employees():

    return get_all_employees()


def find_employee(employee_code: str):

    employee = get_employee_by_code(
        employee_code
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return employee


def add_employee(employee: EmployeeCreate):

    existing = get_employee_by_code(
        employee.employee_code
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee code already exists",
        )

    employee_id = create_employee(
        employee.model_dump()
    )

    return {
        "id": employee_id,
        "message": "Employee created successfully",
    }