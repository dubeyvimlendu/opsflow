from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"


def save_validation_report(
    invalid_df: pd.DataFrame,
) -> Path:
    """
    Save invalid employee records and their
    validation errors to a CSV report.
    """

    report_file = DATA_DIR / "validation_errors.csv"

    report_df = invalid_df.copy()

    report_df["validation_errors"] = (
        report_df["validation_errors"]
        .apply(lambda errors: "; ".join(errors))
    )

    report_df.to_csv(
        report_file,
        index=False
    )

    return report_file