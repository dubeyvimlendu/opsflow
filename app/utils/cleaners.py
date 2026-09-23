import pandas as pd


def clean_employee_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and normalize employee data without
    changing the underlying business meaning.
    """

    df = df.copy()

    # -------------------------
    # Remove surrounding spaces
    # -------------------------

    text_columns = [
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "department",
        "designation",
        "status",
    ]

    for column in text_columns:
        df[column] = df[column].apply(
            lambda value: value.strip()
            if isinstance(value, str)
            else value
        )

    # -------------------------
    # Normalize employee code
    # -------------------------

    df["employee_code"] = (
        df["employee_code"]
        .str.upper()
    )

    # -------------------------
    # Normalize email
    # -------------------------

    df["email"] = (
        df["email"]
        .str.lower()
    )

    # -------------------------
    # Normalize department
    # -------------------------

    department_mapping = {
        "engineering": "Engineering",
        "it": "IT",
        "finance": "Finance",
        "hr": "HR",
        "sales": "Sales",
        "marketing": "Marketing",
        "operations": "Operations",
    }

    df["department"] = (
        df["department"]
        .str.lower()
        .map(department_mapping)
        .fillna(df["department"])
    )

    # -------------------------
    # Normalize status
    # -------------------------

    status_mapping = {
        "active": "Active",
        "inactive": "Inactive",
        "on leave": "On Leave",
    }

    df["status"] = (
        df["status"]
        .str.lower()
        .map(status_mapping)
        .fillna(df["status"])
    )

    # -------------------------
    # Convert salary
    # -------------------------

    df["salary"] = pd.to_numeric(
        df["salary"],
        errors="coerce"
    )

    # -------------------------
    # Convert joining date
    # -------------------------

    df["joining_date"] = pd.to_datetime(
        df["joining_date"],
        errors="coerce"
    )

    return df