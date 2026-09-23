from app.utils.validators import (
    validate_employee_code,
    validate_department,
    validate_status,
)


def test_valid_employee_code():
    assert validate_employee_code("EMP0001")


def test_invalid_employee_code():
    assert not validate_employee_code("EMP12")


def test_valid_department():
    assert validate_department("Engineering")


def test_invalid_department():
    assert not validate_department("Physics")


def test_valid_status():
    assert validate_status("Active")


def test_invalid_status():
    assert not validate_status("Working")