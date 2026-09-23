from pathlib import Path

import pandas as pd
import pytest

from app.services.file_reader import read_file


TEST_DATA = pd.DataFrame(
    [
        {
            "employee_code": "TEST001",
            "first_name": "Test",
            "last_name": "Employee",
            "email": "test@opsflow.com",
            "department": "Engineering",
            "designation": "Software Engineer",
            "salary": 65000,
            "joining_date": "2026-09-23",
            "status": "Active",
        }
    ]
)


def test_read_csv(tmp_path):

    file_path = tmp_path / "employees.csv"

    TEST_DATA.to_csv(
        file_path,
        index=False,
    )

    result = read_file(file_path)

    assert isinstance(result, pd.DataFrame)
    assert len(result) == 1
    assert result.iloc[0]["employee_code"] == "TEST001"


def test_read_excel(tmp_path):

    file_path = tmp_path / "employees.xlsx"

    TEST_DATA.to_excel(
        file_path,
        index=False,
    )

    result = read_file(file_path)

    assert isinstance(result, pd.DataFrame)
    assert len(result) == 1
    assert result.iloc[0]["employee_code"] == "TEST001"


def test_read_json(tmp_path):

    file_path = tmp_path / "employees.json"

    TEST_DATA.to_json(
        file_path,
        orient="records",
    )

    result = read_file(file_path)

    assert isinstance(result, pd.DataFrame)
    assert len(result) == 1
    assert result.iloc[0]["employee_code"] == "TEST001"


def test_unsupported_file_format(tmp_path):

    file_path = tmp_path / "employees.txt"

    file_path.write_text(
        "employee_code,first_name\nTEST001,Test"
    )

    with pytest.raises(ValueError):

        read_file(file_path)


def test_missing_file():

    with pytest.raises(FileNotFoundError):

        read_file(
            Path("does_not_exist.csv")
        )