import re

import pandas as pd


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


def validate_employee_data(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:

    df = df.copy()

    errors = []
    duplicate_employee_codes = (
        df["employee_code"]
        .duplicated(keep=False)
    )

    duplicate_emails = (
        df["email"]
        .duplicated(keep=False)
    )

    for index, row in df.iterrows():

        row_errors = []

        # -------------------------
        # Employee code
        # -------------------------

        employee_code = row["employee_code"]
        if duplicate_employee_codes.loc[index]:
            row_errors.append(
                "Duplicate employee code"
            )

        if duplicate_emails.loc[index]:
            row_errors.append(
                "Duplicate email"
            )

        if pd.isna(employee_code):
            row_errors.append(
                "Missing employee code"
            )

        elif not re.fullmatch(
            r"EMP\d{4}",
            str(employee_code)
        ):
            row_errors.append(
                "Invalid employee code"
            )

        # -------------------------
        # First name
        # -------------------------

        if pd.isna(row["first_name"]) or not str(
            row["first_name"]
        ).strip():

            row_errors.append(
                "Missing first name"
            )

        # -------------------------
        # Last name
        # -------------------------

        if pd.isna(row["last_name"]) or not str(
            row["last_name"]
        ).strip():

            row_errors.append(
                "Missing last name"
            )

        # -------------------------
        # Email
        # -------------------------

        email = row["email"]

        if pd.isna(email) or not str(email).strip():

            row_errors.append(
                "Missing email"
            )

        elif not re.fullmatch(
            r"[^@\s]+@[^@\s]+\.[^@\s]+",
            str(email)
        ):

            row_errors.append(
                "Invalid email"
            )

        # -------------------------
        # Department
        # -------------------------

        if pd.isna(row["department"]):

            row_errors.append(
                "Missing department"
            )

        elif row["department"] not in VALID_DEPARTMENTS:

            row_errors.append(
                "Invalid department"
            )

        # -------------------------
        # Designation
        # -------------------------

        if pd.isna(row["designation"]) or not str(
            row["designation"]
        ).strip():

            row_errors.append(
                "Missing designation"
            )

        # -------------------------
        # Salary
        # -------------------------

        if pd.isna(row["salary"]):

            row_errors.append(
                "Missing salary"
            )

        elif row["salary"] <= 0:

            row_errors.append(
                "Salary must be greater than zero"
            )

        # -------------------------
        # Joining date
        # -------------------------

        if pd.isna(row["joining_date"]):

            row_errors.append(
                "Invalid joining date"
            )

        # -------------------------
        # Status
        # -------------------------

        if pd.isna(row["status"]):

            row_errors.append(
                "Missing status"
            )

        elif row["status"] not in VALID_STATUSES:

            row_errors.append(
                "Invalid status"
            )

        errors.append(
            row_errors
        )

    df["validation_errors"] = errors

    valid_mask = df["validation_errors"].apply(
        lambda errors: len(errors) == 0
    )

    valid_df = df[valid_mask].copy()

    invalid_df = df[~valid_mask].copy()

    return valid_df, invalid_df