"""
Report queries against the `employees` table.

Follows the exact pattern already used in employee_repository.py: no
ORM, no connection pooling — every function opens its own connection
via app.database.connection.get_connection(), uses a plain cursor for
scalar aggregates or cursor(dictionary=True) for row sets, and always
closes cursor + connection in a finally block.

Every aggregate here (COUNT/AVG/MIN/MAX/GROUP BY) is computed by
MySQL, not by pulling rows into Python — this stays cheap as the
employees table grows.
"""

from typing import Any

from app.database.connection import get_connection


def get_total_employee_count() -> int:
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM employees")
        (count,) = cursor.fetchone()
        return count
    finally:
        cursor.close()
        connection.close()


def get_total_department_count() -> int:
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(DISTINCT department) FROM employees")
        (count,) = cursor.fetchone()
        return count
    finally:
        cursor.close()
        connection.close()


def get_status_breakdown() -> list[dict[str, Any]]:
    """
    Employee counts grouped by whatever status values actually exist.
    Shared by the workforce overview and the dedicated status endpoint
    so both always agree.
    """
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT status, COUNT(*) AS count
        FROM employees
        GROUP BY status
        ORDER BY count DESC
    """

    try:
        cursor.execute(query)
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


def get_department_stats() -> list[dict[str, Any]]:
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            department,
            COUNT(*) AS employee_count,
            AVG(salary) AS average_salary,
            MIN(salary) AS minimum_salary,
            MAX(salary) AS maximum_salary
        FROM employees
        GROUP BY department
        ORDER BY department
    """

    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            # AVG/MIN/MAX over a DECIMAL column come back as Decimal;
            # cast to float so the Pydantic schema serializes cleanly.
            row["average_salary"] = float(row["average_salary"])
            row["minimum_salary"] = float(row["minimum_salary"])
            row["maximum_salary"] = float(row["maximum_salary"])
        return rows
    finally:
        cursor.close()
        connection.close()


def get_salary_summary() -> dict[str, Any] | None:
    """Returns None when the employees table is empty."""
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            AVG(salary) AS average_salary,
            MIN(salary) AS minimum_salary,
            MAX(salary) AS maximum_salary
        FROM employees
    """

    try:
        cursor.execute(query)
        row = cursor.fetchone()
        if row is None or row["average_salary"] is None:
            return None
        return {
            "average_salary": float(row["average_salary"]),
            "minimum_salary": float(row["minimum_salary"]),
            "maximum_salary": float(row["maximum_salary"]),
        }
    finally:
        cursor.close()
        connection.close()


def get_salary_distribution(num_buckets: int = 5) -> list[dict[str, Any]]:
    """
    Builds `num_buckets` equal-width salary ranges from the current
    min/max salary, then asks MySQL to COUNT(*) within each range.
    Only the min/max and the per-bucket counts ever leave the
    database — never the underlying rows.
    """
    summary = get_salary_summary()
    if summary is None:
        return []

    low = summary["minimum_salary"]
    high = summary["maximum_salary"]

    if low == high:
        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT COUNT(*) FROM employees")
            (count,) = cursor.fetchone()
        finally:
            cursor.close()
            connection.close()
        return [{"range": f"{low:,.0f}", "count": count}]

    width = (high - low) / num_buckets
    boundaries = [low + width * i for i in range(num_buckets + 1)]

    connection = get_connection()
    cursor = connection.cursor()

    buckets: list[dict[str, Any]] = []
    try:
        for i in range(num_buckets):
            lower = boundaries[i]
            upper = boundaries[i + 1]
            is_last_bucket = i == num_buckets - 1

            if is_last_bucket:
                query = "SELECT COUNT(*) FROM employees WHERE salary >= %s AND salary <= %s"
            else:
                query = "SELECT COUNT(*) FROM employees WHERE salary >= %s AND salary < %s"

            cursor.execute(query, (lower, upper))
            (count,) = cursor.fetchone()

            buckets.append({
                "range": f"{lower:,.0f}\u2013{upper:,.0f}",
                "count": count,
            })

        return buckets
    finally:
        cursor.close()
        connection.close()


def get_joining_year_counts() -> list[dict[str, Any]]:
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT YEAR(joining_date) AS year, COUNT(*) AS count
        FROM employees
        GROUP BY YEAR(joining_date)
        ORDER BY year
    """

    try:
        cursor.execute(query)
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


def get_future_joining_date_count() -> int:
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM employees WHERE joining_date > CURDATE()")
        (count,) = cursor.fetchone()
        return count
    finally:
        cursor.close()
        connection.close()


def get_non_positive_salary_count() -> int:
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM employees WHERE salary <= 0")
        (count,) = cursor.fetchone()
        return count
    finally:
        cursor.close()
        connection.close()


def get_distinct_status_count() -> int:
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(DISTINCT status) FROM employees")
        (count,) = cursor.fetchone()
        return count
    finally:
        cursor.close()
        connection.close()
