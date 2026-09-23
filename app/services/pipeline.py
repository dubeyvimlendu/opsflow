from pathlib import Path

from app.services.employee_processor import load_employee_data
from app.services.employee_validator import validate_employee_data
from app.services.reporting import save_validation_report
from app.utils.cleaners import clean_employee_data


# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Data directory
DATA_DIR = BASE_DIR / "data"


def run_employee_pipeline():

    # -------------------------
    # 1. Load
    # -------------------------

    print("\nLoading employee data...")

    df = load_employee_data()

    print(
        f"Loaded {len(df)} records."
    )

    # -------------------------
    # 2. Clean
    # -------------------------

    print("\nCleaning data...")

    cleaned_df = clean_employee_data(df)

    print("Cleaning completed.")

    # -------------------------
    # 3. Validate
    # -------------------------

    print("\nValidating data...")

    valid_df, invalid_df = validate_employee_data(
        cleaned_df
    )

    print(
        f"Valid records   : {len(valid_df)}"
    )

    print(
        f"Invalid records : {len(invalid_df)}"
    )

    # -------------------------
    # 4. Save valid records
    # -------------------------

    clean_file = DATA_DIR / "employees_processed.csv"

    valid_df.to_csv(
        clean_file,
        index=False
    )

    # -------------------------
    # 5. Save validation report
    # -------------------------

    report_file = save_validation_report(
        invalid_df
    )

    print(
        f"\nProcessed data    : {clean_file}"
    )

    print(
        f"Validation report : {report_file}"
    )

    return valid_df, invalid_df


if __name__ == "__main__":
    run_employee_pipeline()