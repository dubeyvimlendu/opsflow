from datetime import date
from typing import Any

import pandas as pd

from app.database.connection import get_connection


def insert_employees(
    employees: pd.DataFrame,
) -> int:

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO employees (
            employee_code,
            first_name,
            last_name,
            email,
            department,
            designation,
            salary,
            joining_date,
            status
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
    """

    records = [
        (
            row["employee_code"],
            row["first_name"],
            row["last_name"],
            row["email"],
            row["department"],
            row["designation"],
            float(row["salary"]),
            row["joining_date"].date(),
            row["status"],
        )
        for _, row in employees.iterrows()
    ]

    try:
        cursor.executemany(query, records)
        connection.commit()

        return cursor.rowcount

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def get_all_employees() -> list[dict[str, Any]]:

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            employee_code,
            first_name,
            last_name,
            email,
            department,
            designation,
            salary,
            joining_date,
            status
        FROM employees
        ORDER BY id
    """

    try:
        cursor.execute(query)

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def get_employee_by_code(
    employee_code: str,
) -> dict[str, Any] | None:

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            employee_code,
            first_name,
            last_name,
            email,
            department,
            designation,
            salary,
            joining_date,
            status
        FROM employees
        WHERE employee_code = %s
    """

    try:
        cursor.execute(
            query,
            (employee_code,)
        )

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def create_employee(
    employee: dict,
) -> int:

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO employees (
            employee_code,
            first_name,
            last_name,
            email,
            department,
            designation,
            salary,
            joining_date,
            status
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
    """

    values = (
        employee["employee_code"],
        employee["first_name"],
        employee["last_name"],
        employee["email"],
        employee["department"],
        employee["designation"],
        employee["salary"],
        employee["joining_date"],
        employee["status"],
    )

    try:
        cursor.execute(query, values)
        connection.commit()

        return cursor.lastrowid

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()
def insert_new_employees(employees) -> tuple[int, int]:
    """
    Insert only employees whose employee_code
    does not already exist in the database.

    Returns:
        (inserted_count, duplicate_count)
    """

    if employees.empty:
        return 0, 0

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # --------------------------------
        # 1. Get employee codes from input
        # --------------------------------

        employee_codes = employees[
            "employee_code"
        ].tolist()

        placeholders = ", ".join(
            ["%s"] * len(employee_codes)
        )

        query = f"""
            SELECT employee_code
            FROM employees
            WHERE employee_code IN ({placeholders})
        """

        cursor.execute(
            query,
            employee_codes
        )

        existing_codes = {
            row["employee_code"]
            for row in cursor.fetchall()
        }

        # --------------------------------
        # 2. Separate new and duplicate rows
        # --------------------------------

        new_employees = employees[
            ~employees["employee_code"].isin(
                existing_codes
            )
        ]

        duplicate_count = len(employees) - len(
            new_employees
        )

        # --------------------------------
        # 3. Insert only new employees
        # --------------------------------

        if new_employees.empty:
            connection.commit()

            return 0, duplicate_count

        insert_query = """
            INSERT INTO employees (
                employee_code,
                first_name,
                last_name,
                email,
                department,
                designation,
                salary,
                joining_date,
                status
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s
            )
        """

        records = [
            (
                row["employee_code"],
                row["first_name"],
                row["last_name"],
                row["email"],
                row["department"],
                row["designation"],
                float(row["salary"]),
                row["joining_date"].date(),
                row["status"],
            )
            for _, row in new_employees.iterrows()
        ]

        cursor.executemany(
            insert_query,
            records
        )

        connection.commit()

        return cursor.rowcount, duplicate_count

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()