import pandas as pd
import pytest

from app.services.import_service import process_employee_import


def test_process_valid_employee():

    data = {
        "employee_code": ["EMP9998"],
        "first_name": ["Test"],
        "last_name": ["Employee"],
        "email": ["testo.import@opsflow.com"],
        "department": ["Engineering"],
        "designation": ["Software Engineer"],
        "salary": [65000],
        "joining_date": ["2026-09-23"],
        "status": ["Active"],
    }

    df = pd.DataFrame(data)

    result = process_employee_import(df)

    assert result["status"] == "completed"
    assert result["total_records"] == 1
    assert result["valid_records"] == 1
    assert result["invalid_records"] == 0


def test_process_invalid_employee():

    data = {
        "employee_code": ["INVALID"],
        "first_name": [""],
        "last_name": ["Employee"],
        "email": ["not-an-email"],
        "department": ["Engineering"],
        "designation": ["Software Engineer"],
        "salary": [-100],
        "joining_date": ["2026-09-23"],
        "status": ["Invalid"],
    }

    df = pd.DataFrame(data)

    result = process_employee_import(df)

    assert result["status"] == "completed"
    assert result["total_records"] == 1
    assert result["valid_records"] == 0
    assert result["invalid_records"] == 1


def test_process_empty_dataframe():

    df = pd.DataFrame()

    with pytest.raises(ValueError):

        process_employee_import(df)