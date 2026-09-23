from pathlib import Path

import pandas as pd

from app.repositories.employee_repository import (
    insert_new_employees,
)
from app.services.employee_validator import (
    validate_employee_data,
)
from app.services.reporting import (
    save_validation_report,
)
from app.utils.cleaners import (
    clean_employee_data,
)


# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Data directory
DATA_DIR = BASE_DIR / "data"


def process_employee_import(df: pd.DataFrame) -> dict:
    """
    Run the complete employee import workflow.

    Flow:
        DataFrame
        -> Clean
        -> Validate
        -> Save reports
        -> Insert valid records into MySQL
    """

    # --------------------------------
    # 1. Check input
    # --------------------------------

    if df.empty:
        raise ValueError(
            "Input file contains no records"
        )

    # --------------------------------
    # 2. Clean
    # --------------------------------

    cleaned_df = clean_employee_data(df)

    # --------------------------------
    # 3. Validate
    # --------------------------------

    valid_df, invalid_df = validate_employee_data(
        cleaned_df
    )

    # --------------------------------
    # 4. Save processed valid data
    # --------------------------------

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    processed_file = (
        DATA_DIR / "employees_processed.csv"
    )

    valid_df.to_csv(
        processed_file,
        index=False,
    )

    # --------------------------------
    # 5. Save validation report
    # --------------------------------

    report_file = save_validation_report(
        invalid_df
    )

    # --------------------------------
    # 6. Insert valid records into MySQL
    # --------------------------------

    inserted_records = 0
    duplicate_records = 0

    if not valid_df.empty:
        (
            inserted_records,
            duplicate_records,
        ) = insert_new_employees(
            valid_df
        )

    # --------------------------------
    # 7. Return import summary
    # --------------------------------

    return {
        "status": "completed",
        "total_records": len(df),
        "valid_records": len(valid_df),
        "invalid_records": len(invalid_df),
        "inserted_records": inserted_records,
        "duplicate_records": duplicate_records,
        "processed_file": str(processed_file),
        "validation_report": str(report_file),
    }