import pytest
from fastapi.testclient import TestClient

from app.database.connection import get_connection
from app.main import app


@pytest.fixture
def client():
    """
    Create a TestClient for the FastAPI application.
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_employee():
    """
    Test employee data.
    """
    employee = {
        "employee_code": "EMP9998",
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee@opsflow.com",
        "department": "Engineering",
        "designation": "Software Engineer",
        "salary": 65000,
        "joining_date": "2026-09-23",
        "status": "Active",
    }

    yield employee

    # Clean up test data after every test
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            DELETE FROM employees
            WHERE employee_code = %s
            """,
            (employee["employee_code"],),
        )
        connection.commit()
    finally:
        cursor.close()
        connection.close()


def test_health_check(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "opsflow",
    }


def test_get_employees(client):
    response = client.get("/api/employees")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0


def test_get_existing_employee(client):
    response = client.get("/api/employees/EMP0001")

    assert response.status_code == 200

    data = response.json()

    assert data["employee_code"] == "EMP0001"


def test_get_non_existing_employee(client):
    response = client.get("/api/employees/EMP9999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Employee not found",
    }


def test_create_employee(client, test_employee):
    response = client.post(
        "/api/employees",
        json=test_employee,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["message"] == "Employee created successfully"
    assert "id" in data


def test_create_employee_with_invalid_data(client):
    employee = {
        "employee_code": "INVALID",
        "first_name": "",
        "last_name": "Employee",
        "email": "not-an-email",
        "department": "Engineering",
        "designation": "Software Engineer",
        "salary": -100,
        "joining_date": "2026-09-23",
        "status": "Active",
    }

    response = client.post(
        "/api/employees",
        json=employee,
    )

    assert response.status_code == 422


def test_create_duplicate_employee(client, test_employee):
    # First request creates the employee
    first_response = client.post(
        "/api/employees",
        json=test_employee,
    )

    assert first_response.status_code == 201

    # Second request uses the same employee code
    second_response = client.post(
        "/api/employees",
        json=test_employee,
    )

    assert second_response.status_code == 409
    assert second_response.json() == {
        "detail": "Employee code already exists",
    }