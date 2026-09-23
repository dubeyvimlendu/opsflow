import re


VALID_DEPARTMENTS = {
    "Engineering",
    "IT",
    "Finance",
    "HR",
    "Sales",
    "Marketing",
    "Operations",
}

VALID_STATUSES = {
    "Active",
    "Inactive",
    "On Leave",
}


def validate_employee_code(employee_code: str) -> bool:
    return bool(
        re.fullmatch(
            r"EMP\d{4}",
            employee_code
        )
    )


def validate_department(department: str) -> bool:
    return department in VALID_DEPARTMENTS


def validate_status(status: str) -> bool:
    return status in VALID_STATUSES